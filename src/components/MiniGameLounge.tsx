import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Volume2, VolumeX, RotateCcw, Trophy, Sparkles, Check } from 'lucide-react';

type GameId = 'connect4' | 'memory';
type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY';

interface MiniGameLoungeProps {
  unlockedReward: boolean;
  appliedPromoCode: string | null;
  onUnlockReward: () => void;
  onApplyRewardToBag: () => void;
}

const ROWS = 6;
const COLS = 7;

type CellValue = 0 | 1 | 2; // 0 empty, 1 player (orange), 2 bot (emerald/teal)

interface MemoryCard {
  uid: number;
  pairId: string;
  label: string;
  shortCode: string;
  accent: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MEMORY_PAIRS = [
  { pairId: 'fries', label: 'Peri Fries', shortCode: 'FRY', accent: '#FF5A1F' },
  { pairId: 'lagoon', label: 'Blue Lagoon', shortCode: 'BLU', accent: '#0284C7' },
  { pairId: 'wrap', label: 'Tikka Wrap', shortCode: 'WRP', accent: '#D97706' },
  { pairId: 'mojito', label: 'Mint Mojito', shortCode: 'MNT', accent: '#059669' },
  { pairId: 'sliders', label: 'Herb Sliders', shortCode: 'SLD', accent: '#B45309' },
  { pairId: 'berry', label: 'Berry Spritz', shortCode: 'BRY', accent: '#E11D48' },
];

function createShuffledDeck(): MemoryCard[] {
  const doubled = [...MEMORY_PAIRS, ...MEMORY_PAIRS].map((item, idx) => ({
    uid: idx,
    pairId: item.pairId,
    label: item.label,
    shortCode: item.shortCode,
    accent: item.accent,
    isFlipped: false,
    isMatched: false,
  }));
  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

function checkConnect4Win(board: CellValue[][], player: 1 | 2): boolean {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        board[r][c] === player &&
        board[r][c + 1] === player &&
        board[r][c + 2] === player &&
        board[r][c + 3] === player
      ) {
        return true;
      }
    }
  }
  // Vertical
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c < COLS; c++) {
      if (
        board[r][c] === player &&
        board[r + 1][c] === player &&
        board[r + 2][c] === player &&
        board[r + 3][c] === player
      ) {
        return true;
      }
    }
  }
  // Diagonal down-right
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        board[r][c] === player &&
        board[r + 1][c + 1] === player &&
        board[r + 2][c + 2] === player &&
        board[r + 3][c + 3] === player
      ) {
        return true;
      }
    }
  }
  // Diagonal up-right
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        board[r][c] === player &&
        board[r - 1][c + 1] === player &&
        board[r - 2][c + 2] === player &&
        board[r - 3][c + 3] === player
      ) {
        return true;
      }
    }
  }
  return false;
}

function findAvailableRow(board: CellValue[][], col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === 0) return r;
  }
  return -1;
}

function pickBotColumn(board: CellValue[][]): number {
  const validCols: number[] = [];
  for (let c = 0; c < COLS; c++) {
    if (findAvailableRow(board, c) !== -1) validCols.push(c);
  }
  if (validCols.length === 0) return -1;

  // 1. Check if bot can win immediately
  for (const c of validCols) {
    const r = findAvailableRow(board, c);
    const copy = board.map((row) => [...row]);
    copy[r][c] = 2;
    if (checkConnect4Win(copy, 2)) return c;
  }

  // 2. Block player's immediate winning move
  for (const c of validCols) {
    const r = findAvailableRow(board, c);
    const copy = board.map((row) => [...row]);
    copy[r][c] = 1;
    if (checkConnect4Win(copy, 1)) return c;
  }

  // 3. Prefer center columns
  const preferred = [3, 2, 4, 1, 5, 0, 6].filter((c) => validCols.includes(c));
  return preferred[Math.floor(Math.random() * Math.min(2, preferred.length))];
}

export const MiniGameLounge: React.FC<MiniGameLoungeProps> = ({
  unlockedReward,
  appliedPromoCode,
  onUnlockReward,
  onApplyRewardToBag,
}) => {
  const [selectedGame, setSelectedGame] = useState<GameId>('connect4');
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [muted, setMuted] = useState<boolean>(false);
  const [roundOutcome, setRoundOutcome] = useState<'WIN' | 'LOSS' | 'DRAW'>('WIN');
  const [roundSummaryText, setRoundSummaryText] = useState<string>('');

  // Connect-4 state
  const [board, setBoard] = useState<CellValue[][]>(() =>
    Array.from({ length: ROWS }, () => Array<CellValue>(COLS).fill(0))
  );
  const [turn, setTurn] = useState<'PLAYER' | 'BOT'>('PLAYER');
  const [movesCount, setMovesCount] = useState<number>(0);
  const botTimeoutRef = useRef<number | null>(null);

  // Memory game state
  const [cards, setCards] = useState<MemoryCard[]>(() => createShuffledDeck());
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [memorySeconds, setMemorySeconds] = useState<number>(45);
  const [memoryMoves, setMemoryMoves] = useState<number>(0);
  const lockBoardRef = useRef<boolean>(false);

  const playTone = useCallback(
    (freq: number, duration = 0.09, type: OscillatorType = 'sine') => {
      if (muted) return;
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        // Ignore audio context restrictions
      }
    },
    [muted]
  );

  // Clear timers on unmount or game switch
  useEffect(() => {
    return () => {
      if (botTimeoutRef.current !== null) {
        window.clearTimeout(botTimeoutRef.current);
      }
    };
  }, []);

  // Memory countdown timer
  useEffect(() => {
    if (selectedGame !== 'memory' || gameState !== 'PLAYING') return;
    if (memorySeconds <= 0) {
      setRoundOutcome('LOSS');
      setRoundSummaryText('Time ran out on the lecture break clock. Try another round!');
      setGameState('ROUND_SUMMARY');
      playTone(220, 0.2, 'triangle');
      return;
    }
    const timer = window.setInterval(() => {
      setMemorySeconds((prev) => prev - 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [selectedGame, gameState, memorySeconds, playTone]);

  const startGame = (gameId: GameId) => {
    if (botTimeoutRef.current !== null) {
      window.clearTimeout(botTimeoutRef.current);
      botTimeoutRef.current = null;
    }
    setSelectedGame(gameId);
    if (gameId === 'connect4') {
      setBoard(Array.from({ length: ROWS }, () => Array<CellValue>(COLS).fill(0)));
      setTurn('PLAYER');
      setMovesCount(0);
    } else {
      setCards(createShuffledDeck());
      setFlippedIds([]);
      setMemorySeconds(45);
      setMemoryMoves(0);
      lockBoardRef.current = false;
    }
    setGameState('PLAYING');
    playTone(520, 0.08);
  };

  const handleSelectGameTab = (gameId: GameId) => {
    if (botTimeoutRef.current !== null) {
      window.clearTimeout(botTimeoutRef.current);
      botTimeoutRef.current = null;
    }
    setSelectedGame(gameId);
    setGameState('TITLE_MENU');
  };

  const handleConnect4Drop = (col: number) => {
    if (gameState !== 'PLAYING' || turn !== 'PLAYER') return;
    const row = findAvailableRow(board, col);
    if (row === -1) return;

    const nextBoard = board.map((r) => [...r]);
    nextBoard[row][col] = 1;
    setBoard(nextBoard);
    setMovesCount((m) => m + 1);
    playTone(460, 0.07);

    if (checkConnect4Win(nextBoard, 1)) {
      setRoundOutcome('WIN');
      setRoundSummaryText('You connected 4 before the Campus Bot! Free mocktail voucher unlocked.');
      onUnlockReward();
      setGameState('ROUND_SUMMARY');
      playTone(680, 0.22);
      return;
    }

    const isDraw = nextBoard[0].every((cell) => cell !== 0);
    if (isDraw) {
      setRoundOutcome('DRAW');
      setRoundSummaryText('Full board tie! Rematch for the Free Mocktail reward.');
      setGameState('ROUND_SUMMARY');
      return;
    }

    setTurn('BOT');
    botTimeoutRef.current = window.setTimeout(() => {
      const botCol = pickBotColumn(nextBoard);
      if (botCol === -1) return;
      const botRow = findAvailableRow(nextBoard, botCol);
      const afterBot = nextBoard.map((r) => [...r]);
      afterBot[botRow][botCol] = 2;
      setBoard(afterBot);
      playTone(340, 0.07);

      if (checkConnect4Win(afterBot, 2)) {
        setRoundOutcome('LOSS');
        setRoundSummaryText('Campus Bot took 4 in a row. One click to play a rematch!');
        setGameState('ROUND_SUMMARY');
        playTone(210, 0.18, 'triangle');
        return;
      }

      const drawAfterBot = afterBot[0].every((cell) => cell !== 0);
      if (drawAfterBot) {
        setRoundOutcome('DRAW');
        setRoundSummaryText('Stalemate on the table! Play another fast round.');
        setGameState('ROUND_SUMMARY');
        return;
      }

      setTurn('PLAYER');
    }, 550);
  };

  const handleMemoryCardClick = (uid: number) => {
    if (gameState !== 'PLAYING' || lockBoardRef.current) return;
    const target = cards.find((c) => c.uid === uid);
    if (!target || target.isFlipped || target.isMatched) return;

    const updatedCards = cards.map((c) => (c.uid === uid ? { ...c, isFlipped: true } : c));
    setCards(updatedCards);
    playTone(480, 0.05);

    const nextFlipped = [...flippedIds, uid];
    setFlippedIds(nextFlipped);

    if (nextFlipped.length === 2) {
      setMemoryMoves((m) => m + 1);
      lockBoardRef.current = true;
      const [firstId, secondId] = nextFlipped;
      const firstCard = updatedCards.find((c) => c.uid === firstId);
      const secondCard = updatedCards.find((c) => c.uid === secondId);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        window.setTimeout(() => {
          setCards((prev) => {
            const matched = prev.map((c) =>
              c.uid === firstId || c.uid === secondId ? { ...c, isMatched: true } : c
            );
            const allMatched = matched.every((c) => c.isMatched);
            if (allMatched) {
              setRoundOutcome('WIN');
              setRoundSummaryText(
                `Matched all 6 menu pairs with ${memorySeconds}s remaining! Reward unlocked.`
              );
              onUnlockReward();
              setGameState('ROUND_SUMMARY');
              playTone(720, 0.22);
            } else {
              playTone(600, 0.08);
            }
            return matched;
          });
          setFlippedIds([]);
          lockBoardRef.current = false;
        }, 280);
      } else {
        window.setTimeout(() => {
          setCards((prev) =>
            prev.map((c) =>
              c.uid === firstId || c.uid === secondId ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIds([]);
          lockBoardRef.current = false;
        }, 620);
      }
    }
  };

  return (
    <section id="mini-games" className="bg-[#141416] py-16 text-zinc-100 md:py-20">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left Info & Challenge Rules */}
          <div className="lg:col-span-5">
            <p className="text-xs font-medium tracking-wide text-zinc-400">
              In-Store Hangout Lounge · Free Mocktail Challenge
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl [text-wrap:balance]">
              Play while your snacks prep in under 5 minutes.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-300">
              Every Foodmaniac booth comes stocked with quick tabletop games. Beat the Campus Bot in
              Tabletop 4-In-A-Row or clear Speed Snack Flip here to unlock a{' '}
              <span className="font-semibold text-white">GAMERFREE</span> voucher (₹95 off a classic
              mocktail on orders ₹150+).
            </p>

            {/* Segmented Game Switcher */}
            <div className="mt-6 inline-flex rounded-lg bg-zinc-800/90 p-1">
              <button
                type="button"
                onClick={() => handleSelectGameTab('connect4')}
                className={`min-h-[40px] rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedGame === 'connect4'
                    ? 'bg-[#FF5A1F] text-white'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Tabletop 4-In-A-Row
              </button>
              <button
                type="button"
                onClick={() => handleSelectGameTab('memory')}
                className={`min-h-[40px] rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedGame === 'memory'
                    ? 'bg-[#FF5A1F] text-white'
                    : 'text-zinc-300 hover:text-white'
                }`}
              >
                Speed Snack Flip
              </button>
            </div>

            {/* Reward Status */}
            <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Trophy className={`h-5 w-5 ${unlockedReward ? 'text-emerald-400' : 'text-amber-400'}`} />
                  <span className="text-sm font-semibold text-white">
                    {unlockedReward ? 'Reward Unlocked: GAMERFREE' : 'Challenge Reward Locked'}
                  </span>
                </div>
                <span className="font-mono text-xs text-zinc-400 tabular-nums">
                  ₹95 Value
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                {unlockedReward
                  ? 'You won a round! Apply code GAMERFREE in your Order Bag for ₹95 off on orders ₹150+.'
                  : 'Win one match of either game to unlock your instant ₹95 Mocktail Voucher.'}
              </p>
              {unlockedReward && (
                <button
                  type="button"
                  onClick={onApplyRewardToBag}
                  className="mt-3 inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500 whitespace-nowrap"
                >
                  {appliedPromoCode === 'GAMERFREE' ? (
                    <>
                      <Check className="h-4 w-4" />
                      Applied to Order Bag
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Apply GAMERFREE to Bag
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right Interactive Game Table */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 sm:p-6">
              {/* Unobtrusive Top HUD */}
              <div className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">
                    {selectedGame === 'connect4' ? 'Tabletop 4-In-A-Row' : 'Speed Snack Flip'}
                  </h3>
                  <p className="text-xs text-zinc-400 tabular-nums">
                    {gameState === 'PLAYING'
                      ? selectedGame === 'connect4'
                        ? turn === 'PLAYER'
                          ? `Your Turn · Drop Orange Token (Move ${movesCount + 1})`
                          : 'Campus Bot Thinking...'
                        : `Pairs: ${cards.filter((c) => c.isMatched).length / 2}/6 · Time Left: ${memorySeconds}s · Moves: ${memoryMoves}`
                      : selectedGame === 'connect4'
                      ? 'Beat Campus Bot · 6x7 Grid'
                      : 'Match 6 Menu Pairs · 45s Clock'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? 'Unmute game sounds' : 'Mute game sounds'}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-200 transition-colors hover:bg-zinc-700"
                  >
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                  {gameState === 'PLAYING' && (
                    <button
                      type="button"
                      onClick={() => startGame(selectedGame)}
                      aria-label="Restart game"
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-xs font-semibold text-zinc-200 transition-colors hover:bg-zinc-700 whitespace-nowrap"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Restart
                    </button>
                  )}
                </div>
              </div>

              {/* Game Body */}
              <div className="mt-5 min-h-[340px] flex flex-col justify-center">
                {gameState === 'TITLE_MENU' && (
                  <div className="mx-auto max-w-md py-8 text-center">
                    <p className="text-xs font-medium text-zinc-400">
                      {selectedGame === 'connect4'
                        ? 'Rules · Connect 4 Tokens'
                        : 'Rules · Match All 6 Pairs'}
                    </p>
                    <h4 className="mt-2 font-display text-2xl font-bold text-white">
                      {selectedGame === 'connect4'
                        ? 'Outsmart the Campus Bot'
                        : 'Beat the 45-Second Prep Clock'}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                      {selectedGame === 'connect4'
                        ? 'Click any column to drop your tangerine disc. Line up 4 horizontally, vertically, or diagonally before the bot blocks you.'
                        : 'Flip cards two at a time to pair all 6 Foodmaniac snacks & mocktails before the 45-second timer hits zero.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => startGame(selectedGame)}
                      className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#FF5A1F] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e54b12] whitespace-nowrap"
                    >
                      Start Game
                    </button>
                  </div>
                )}

                {gameState === 'PLAYING' && selectedGame === 'connect4' && (
                  <div className="mx-auto w-full max-w-[440px]">
                    <div className="grid grid-cols-7 gap-2 rounded-xl bg-[#0F5132] p-3 border border-emerald-800/70">
                      {board.map((rowArr, rIdx) =>
                        rowArr.map((cell, cIdx) => {
                          const canDrop = turn === 'PLAYER' && board[0][cIdx] === 0;
                          return (
                            <button
                              key={`${rIdx}-${cIdx}`}
                              type="button"
                              disabled={!canDrop}
                              onClick={() => handleConnect4Drop(cIdx)}
                              aria-label={`Drop token in column ${cIdx + 1}`}
                              className={`aspect-square min-h-[42px] w-full rounded-full border-2 transition-transform duration-150 ${
                                cell === 1
                                  ? 'border-orange-200 bg-[#FF5A1F]'
                                  : cell === 2
                                  ? 'border-amber-100 bg-amber-300'
                                  : canDrop
                                  ? 'border-emerald-900/80 bg-zinc-950/70 hover:scale-95 hover:border-orange-400'
                                  : 'border-emerald-900/80 bg-zinc-950/70'
                              }`}
                            />
                          );
                        })
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-zinc-400">
                      <span>You: Tangerine Disc</span>
                      <span>Campus Bot: Amber Disc</span>
                    </div>
                  </div>
                )}

                {gameState === 'PLAYING' && selectedGame === 'memory' && (
                  <div className="mx-auto w-full max-w-[460px]">
                    <div className="grid grid-cols-4 gap-3">
                      {cards.map((card) => {
                        const revealed = card.isFlipped || card.isMatched;
                        return (
                          <button
                            key={card.uid}
                            type="button"
                            onClick={() => handleMemoryCardClick(card.uid)}
                            disabled={revealed}
                            aria-label={revealed ? card.label : 'Hidden snack card'}
                            className={`flex min-h-[76px] flex-col items-center justify-center rounded-lg border p-2 text-center transition-transform duration-150 ${
                              card.isMatched
                                ? 'border-emerald-500/60 bg-emerald-950/60 text-emerald-200'
                                : card.isFlipped
                                ? 'border-zinc-500 bg-zinc-800 text-white'
                                : 'border-zinc-700 bg-zinc-800/80 text-zinc-300 hover:-translate-y-0.5 hover:border-[#FF5A1F]'
                            }`}
                          >
                            {revealed ? (
                              <>
                                <span
                                  className="font-mono text-xs font-bold"
                                  style={{ color: card.isMatched ? '#6EE7B7' : card.accent }}
                                >
                                  {card.shortCode}
                                </span>
                                <span className="mt-1 text-[11px] font-medium leading-tight">
                                  {card.label}
                                </span>
                              </>
                            ) : (
                              <span className="font-mono text-sm font-semibold text-zinc-500">?</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {gameState === 'ROUND_SUMMARY' && (
                  <div className="mx-auto max-w-md py-8 text-center">
                    <p className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      {roundOutcome === 'WIN'
                        ? 'Victory · Voucher Ready'
                        : roundOutcome === 'DRAW'
                        ? 'Draw · Table Tied'
                        : 'Round Over'}
                    </p>
                    <h4 className="mt-2 font-display text-2xl font-bold text-white">
                      {roundOutcome === 'WIN'
                        ? 'You Won the Mocktail Challenge'
                        : roundOutcome === 'DRAW'
                        ? 'Close Match at the Booth'
                        : 'Bot Took This Round'}
                    </h4>
                    <p className="mt-2 text-sm text-zinc-300">{roundSummaryText}</p>
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => startGame(selectedGame)}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e54b12] whitespace-nowrap"
                      >
                        Play Again
                      </button>
                      {roundOutcome === 'WIN' && (
                        <button
                          type="button"
                          onClick={onApplyRewardToBag}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-emerald-600 bg-emerald-600/20 px-5 py-2.5 text-sm font-semibold text-emerald-300 transition-colors hover:bg-emerald-600/30 whitespace-nowrap"
                        >
                          Use GAMERFREE in Bag
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

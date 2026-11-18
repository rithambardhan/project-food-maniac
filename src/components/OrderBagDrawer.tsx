import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2, Clock, CheckCircle2, Copy, Check, FastForward } from 'lucide-react';
import { MenuItem, PROMO_CODES } from '../data/foodmaniacData';

export interface BagLineItem {
  key: string;
  item: MenuItem;
  customization: string;
  quantity: number;
}

export interface PlacedOrder {
  orderId: string;
  customerName: string;
  pickupMode: 'Counter Express' | 'Hangout Booth';
  boothNote: string;
  items: BagLineItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoUsed: string | null;
  targetSeconds: number;
}

interface OrderBagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bagItems: BagLineItem[];
  promoCode: string | null;
  unlockedGamerReward: boolean;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onApplyPromo: (code: string | null) => void;
  onClearBag: () => void;
}

export const OrderBagDrawer: React.FC<OrderBagDrawerProps> = ({
  isOpen,
  onClose,
  bagItems,
  promoCode,
  unlockedGamerReward,
  onUpdateQty,
  onRemoveItem,
  onApplyPromo,
  onClearBag,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [pickupMode, setPickupMode] = useState<'Counter Express' | 'Hangout Booth'>('Counter Express');
  const [boothNote, setBoothNote] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<PlacedOrder | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [fastMode, setFastMode] = useState<boolean>(false);
  const [copiedVoucher, setCopiedVoucher] = useState<boolean>(false);

  const subtotal = bagItems.reduce((sum, entry) => sum + entry.item.price * entry.quantity, 0);

  let discount = 0;
  let activePromoDetails = promoCode ? PROMO_CODES[promoCode] : undefined;
  if (activePromoDetails && subtotal >= activePromoDetails.minSubtotal) {
    if (activePromoDetails.type === 'percent') {
      discount = Math.round((subtotal * activePromoDetails.value) / 100);
    } else {
      discount = Math.min(activePromoDetails.value, subtotal);
    }
  } else if (activePromoDetails && subtotal < activePromoDetails.minSubtotal) {
    activePromoDetails = undefined;
  }

  const finalTotal = Math.max(0, subtotal - discount);
  const maxPrepMinutes =
    bagItems.length > 0 ? Math.max(...bagItems.map((entry) => entry.item.prepMinutes)) : 4;

  // Real-time kitchen prep ticker for placed order
  useEffect(() => {
    if (!activeOrder) return;
    if (elapsedSeconds >= activeOrder.targetSeconds) return;

    const intervalMs = fastMode ? 120 : 1000;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => Math.min(activeOrder.targetSeconds, prev + 1));
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [activeOrder, elapsedSeconds, fastMode]);

  if (!isOpen) return null;

  const handleApplyCode = (rawCode?: string) => {
    const clean = (rawCode ?? promoInput).trim().toUpperCase();
    if (!clean) {
      setPromoFeedback('Enter a code such as DGUFLASH15 or BOUNCE10.');
      return;
    }
    const found = PROMO_CODES[clean];
    if (!found) {
      setPromoFeedback('Code not recognized. Try DGUFLASH15, CAMPUSCLUB, or BOUNCE10.');
      return;
    }
    if (clean === 'GAMERFREE' && !unlockedGamerReward) {
      setPromoFeedback('Win 1 round in the Mini-Game Lounge below to unlock GAMERFREE.');
      return;
    }
    if (subtotal < found.minSubtotal) {
      setPromoFeedback(`Add ₹${found.minSubtotal - subtotal} more to meet the ₹${found.minSubtotal} minimum.`);
      return;
    }
    onApplyPromo(clean);
    setPromoInput(clean);
    setPromoFeedback(`Applied: ${found.label}`);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (bagItems.length === 0) return;
    if (!customerName.trim()) {
      setFormError('Please enter your first name for the counter callout.');
      return;
    }
    setFormError(null);
    const targetSecs = Math.min(270, Math.max(120, maxPrepMinutes * 55));
    const randomNum = 1040 + Math.floor(Math.random() * 890);
    setActiveOrder({
      orderId: `FM-${randomNum}`,
      customerName: customerName.trim(),
      pickupMode,
      boothNote: boothNote.trim(),
      items: [...bagItems],
      subtotal,
      discount,
      total: finalTotal,
      promoUsed: activePromoDetails ? activePromoDetails.code : null,
      targetSeconds: targetSecs,
    });
    setElapsedSeconds(0);
    setFastMode(false);
    onClearBag();
  };

  const handleCopyBounceVoucher = () => {
    navigator.clipboard?.writeText('BOUNCE10').catch(() => {});
    setCopiedVoucher(true);
    window.setTimeout(() => setCopiedVoucher(false), 2000);
  };

  const remainingSeconds = activeOrder
    ? Math.max(0, activeOrder.targetSeconds - elapsedSeconds)
    : 0;
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  const progressRatio = activeOrder ? elapsedSeconds / activeOrder.targetSeconds : 0;
  const isReady = activeOrder ? remainingSeconds === 0 : false;

  const prepStages = [
    { label: '01. Order Queued at Express Counter', threshold: 0 },
    { label: '02. Quick-Cook Prep Station Firing', threshold: 0.2 },
    { label: '03. Mocktail Bar & Garnish Sync', threshold: 0.6 },
    { label: '04. Ready for Pickup / Booth Delivery', threshold: 1 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-zinc-950/50 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Express Order Bag"
    >
      <div
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold text-zinc-950">
              {activeOrder ? `Express Order #${activeOrder.orderId}` : 'Express Order Bag'}
            </h2>
            <p className="text-xs text-zinc-500 tabular-nums">
              {activeOrder
                ? `Target prep: under 5 minutes · ${activeOrder.pickupMode}`
                : `${bagItems.reduce((acc, i) => acc + i.quantity, 0)} items · Est. prep ${
                    bagItems.length > 0 ? `${maxPrepMinutes} min` : '0 min'
                  }`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close order bag"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeOrder ? (
            <div className="space-y-6">
              {/* Live Countdown Panel */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {isReady ? 'Order Status · Ready Now' : 'Express Prep Countdown'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFastMode((f) => !f)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#FF5A1F] hover:underline"
                  >
                    <FastForward className="h-3.5 w-3.5" />
                    {fastMode ? 'Normal Speed' : 'Preview 8x Speed'}
                  </button>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <span className="font-mono text-4xl font-bold text-zinc-950 tabular-nums">
                    {isReady
                      ? '00:00'
                      : `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isReady ? 'text-emerald-700' : 'text-[#FF5A1F]'
                    }`}
                  >
                    {isReady ? 'Ready at Express Counter' : 'Under 5-Min Guarantee Active'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      isReady ? 'bg-emerald-600' : 'bg-[#FF5A1F]'
                    }`}
                    style={{ width: `${Math.round(progressRatio * 100)}%` }}
                  />
                </div>

                {/* 4 Stage Steps */}
                <ul className="mt-5 space-y-2.5">
                  {prepStages.map((stage) => {
                    const done = progressRatio >= stage.threshold && (stage.threshold < 1 || isReady);
                    return (
                      <li key={stage.label} className="flex items-center justify-between text-xs">
                        <span className={done ? 'font-semibold text-zinc-950' : 'text-zinc-500'}>
                          {stage.label}
                        </span>
                        <span
                          className={`font-mono font-medium ${
                            done ? 'text-emerald-700' : 'text-zinc-400'
                          }`}
                        >
                          {done ? 'Done' : 'Pending'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Order Summary */}
              <div className="rounded-xl border border-zinc-200 p-4">
                <p className="text-xs font-semibold text-zinc-500">
                  For {activeOrder.customerName} · {activeOrder.pickupMode}
                  {activeOrder.boothNote ? ` (${activeOrder.boothNote})` : ''}
                </p>
                <div className="mt-3 divide-y divide-zinc-100">
                  {activeOrder.items.map((entry) => (
                    <div key={entry.key} className="flex justify-between py-2 text-sm">
                      <span className="text-zinc-800">
                        {entry.quantity}x {entry.item.name}{' '}
                        <span className="text-xs text-zinc-500">({entry.customization})</span>
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        ₹{entry.item.price * entry.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-zinc-200 pt-3 flex justify-between text-sm font-bold text-zinc-950">
                  <span>Paid / Counter Total</span>
                  <span className="font-mono tabular-nums">₹{activeOrder.total}</span>
                </div>
              </div>

              {/* Bounce-Back Receipt Voucher (Mission 9 Week 4 Retention Mechanic) */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-950 p-4 text-white">
                <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Receipt Reward · Valid for 14 Days</span>
                </div>
                <h3 className="mt-1.5 font-display text-base font-bold">
                  10% Bounce-Back Voucher: BOUNCE10
                </h3>
                <p className="mt-1 text-xs text-zinc-300">
                  Use code <span className="font-mono font-semibold text-white">BOUNCE10</span> on
                  your next campus break order of ₹100+ within 14 days.
                </p>
                <button
                  type="button"
                  onClick={handleCopyBounceVoucher}
                  className="mt-3 inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-700"
                >
                  {copiedVoucher ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedVoucher ? 'Copied BOUNCE10' : 'Copy Code'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveOrder(null)}
                className="w-full min-h-[44px] rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 hover:bg-zinc-50"
              >
                Start Another Express Order
              </button>
            </div>
          ) : bagItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-12 text-center">
              <Clock className="h-8 w-8 text-zinc-400" />
              <h3 className="mt-3 font-display text-lg font-bold text-zinc-900">
                Your Express Bag is empty
              </h3>
              <p className="mt-1 max-w-xs text-sm text-zinc-500">
                Add instant-prep snacks or craft mocktails from the menu for under-5-minute pickup.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 min-h-[42px] rounded-lg bg-[#FF5A1F] px-5 py-2 text-sm font-semibold text-white hover:bg-[#e54b12]"
              >
                Browse Express Menu
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Itemized Bag List */}
              <ul className="divide-y divide-zinc-200">
                {bagItems.map((entry) => (
                  <li key={entry.key} className="py-4 first:pt-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-950">{entry.item.name}</h4>
                        <p className="mt-0.5 text-xs text-zinc-500">
                          {entry.customization} · {entry.item.prepMinutes} min prep
                        </p>
                      </div>
                      <span className="font-mono text-sm font-semibold text-zinc-950 tabular-nums">
                        ₹{entry.item.price * entry.quantity}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(entry.key, -1)}
                          aria-label={`Decrease quantity of ${entry.item.name}`}
                          className="flex h-8 w-8 items-center justify-center text-zinc-700 hover:text-zinc-950"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono text-xs font-semibold tabular-nums">
                          {entry.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(entry.key, 1)}
                          aria-label={`Increase quantity of ${entry.item.name}`}
                          className="flex h-8 w-8 items-center justify-center text-zinc-700 hover:text-zinc-950"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(entry.key)}
                        aria-label={`Remove ${entry.item.name}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Promo / Student Club Voucher */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <label htmlFor="promo-code-input" className="block text-xs font-semibold text-zinc-700">
                  Student &amp; Bounce-Back Promo Code
                </label>
                <div className="mt-2 flex gap-2">
                  <input
                    id="promo-code-input"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="e.g. DGUFLASH15"
                    className="h-10 flex-1 rounded-lg border border-zinc-300 bg-white px-3 font-mono text-xs uppercase text-zinc-900 placeholder:normal-case placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCode()}
                    className="h-10 rounded-lg bg-zinc-950 px-4 text-xs font-semibold text-white hover:bg-zinc-800 whitespace-nowrap"
                  >
                    Apply
                  </button>
                </div>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {['DGUFLASH15', 'CAMPUSCLUB', 'BOUNCE10'].map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => handleApplyCode(code)}
                      className="rounded border border-zinc-300 bg-white px-2 py-1 font-mono text-[11px] font-medium text-zinc-700 hover:border-[#FF5A1F] hover:text-[#FF5A1F]"
                    >
                      {code}
                    </button>
                  ))}
                  {unlockedGamerReward && (
                    <button
                      type="button"
                      onClick={() => handleApplyCode('GAMERFREE')}
                      className="rounded border border-emerald-600 bg-emerald-50 px-2 py-1 font-mono text-[11px] font-semibold text-emerald-800 hover:bg-emerald-100"
                    >
                      GAMERFREE
                    </button>
                  )}
                </div>
                {promoFeedback && (
                  <p className="mt-2 text-xs text-zinc-700">{promoFeedback}</p>
                )}
              </div>

              {/* Express Checkout Details */}
              <form id="express-checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label htmlFor="student-name" className="block text-xs font-semibold text-zinc-700">
                    Your Name (For Express Callout)
                  </label>
                  <input
                    id="student-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ritham"
                    className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none"
                  />
                </div>

                <div>
                  <span className="block text-xs font-semibold text-zinc-700">Handoff Mode</span>
                  <div className="mt-1.5 grid grid-cols-2 gap-2">
                    {(['Counter Express', 'Hangout Booth'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setPickupMode(mode)}
                        className={`min-h-[40px] rounded-lg border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                          pickupMode === mode
                            ? 'border-zinc-950 bg-zinc-950 text-white'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {pickupMode === 'Hangout Booth' && (
                  <div>
                    <label htmlFor="booth-note" className="block text-xs font-semibold text-zinc-700">
                      Booth / Table Number
                    </label>
                    <input
                      id="booth-note"
                      type="text"
                      value={boothNote}
                      onChange={(e) => setBoothNote(e.target.value)}
                      placeholder="e.g. Arcade Booth #3"
                      className="mt-1.5 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none"
                    />
                  </div>
                )}

                {formError && <p className="text-xs font-medium text-red-600">{formError}</p>}
              </form>
            </div>
          )}
        </div>

        {/* Sticky Checkout Footer */}
        {!activeOrder && bagItems.length > 0 && (
          <div className="border-t border-zinc-200 bg-zinc-50 px-6 py-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-mono tabular-nums">₹{subtotal}</span>
              </div>
              {discount > 0 && activePromoDetails && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount ({activePromoDetails.code})</span>
                  <span className="font-mono tabular-nums">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-base font-bold text-zinc-950">
                <span>Total (Pay at Counter / UPI)</span>
                <span className="font-mono tabular-nums">₹{finalTotal}</span>
              </div>
            </div>
            <button
              type="submit"
              form="express-checkout-form"
              className="mt-4 w-full min-h-[44px] rounded-lg bg-[#FF5A1F] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e54b12]"
            >
              Start Express Order · {maxPrepMinutes} Min Prep
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

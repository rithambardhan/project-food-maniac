import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Search,
  Plus,
  Minus,
  Clock,
  Calendar,
  MapPin,
  Users,
  Check,
  Menu,
  X,
} from 'lucide-react';
import {
  MENU_ITEMS,
  HANGOUT_ZONES,
  CAMPUS_EVENTS,
  MenuCategory,
  MenuItem,
} from './data/foodmaniacData';
import { MenuIllustration } from './components/MenuIllustration';
import { ProductModal } from './components/ProductModal';
import { MiniGameLounge } from './components/MiniGameLounge';
import { OrderBagDrawer, BagLineItem } from './components/OrderBagDrawer';

const HERO_SPOTLIGHT_IDS = ['solo-combo', 'peri-fries', 'blue-lagoon'];
const BREAK_SLOTS = ['1:15 PM Lunch Gap', '4:30 PM Post-Class', '6:30 PM Evening Hangout'];

export default function App() {
  const [bagItems, setBagItems] = useState<BagLineItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('all');
  const [spicyOnly, setSpicyOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalItem, setModalItem] = useState<MenuItem | null>(null);
  const [spotlightIndex, setSpotlightIndex] = useState<number>(0);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [unlockedGamerReward, setUnlockedGamerReward] = useState<boolean>(false);
  const [toastText, setToastText] = useState<string | null>(null);

  // Hangout Zone Reservation State
  const [selectedZoneId, setSelectedZoneId] = useState<string>(HANGOUT_ZONES[0].id);
  const [selectedSlot, setSelectedSlot] = useState<string>(BREAK_SLOTS[1]);
  const [groupSize, setGroupSize] = useState<number>(4);
  const [reserveName, setReserveName] = useState<string>('');
  const [reserveError, setReserveError] = useState<string | null>(null);
  const [boothPass, setBoothPass] = useState<{
    passCode: string;
    zoneName: string;
    slot: string;
    groupSize: number;
    name: string;
  } | null>(null);

  // Campus Event RSVP state
  const [rsvpedEvents, setRsvpedEvents] = useState<Record<string, boolean>>({});

  const totalBagCount = bagItems.reduce((sum, entry) => sum + entry.quantity, 0);

  const showToast = (msg: string) => {
    setToastText(msg);
    window.setTimeout(() => {
      setToastText((prev) => (prev === msg ? null : prev));
    }, 2400);
  };

  const handleAddToBag = (item: MenuItem, customization?: string, qty = 1) => {
    const chosenCustom = customization ?? item.customizationOptions[0];
    const key = `${item.id}__${chosenCustom}`;
    setBagItems((prev) => {
      const existing = prev.find((e) => e.key === key);
      if (existing) {
        return prev.map((e) => (e.key === key ? { ...e, quantity: e.quantity + qty } : e));
      }
      return [...prev, { key, item, customization: chosenCustom, quantity: qty }];
    });
    showToast(`Added ${item.name} to bag`);
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setBagItems((prev) =>
      prev
        .map((entry) =>
          entry.key === key ? { ...entry, quantity: entry.quantity + delta } : entry
        )
        .filter((entry) => entry.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setBagItems((prev) => prev.filter((entry) => entry.key !== key));
  };

  const handleClearBag = () => {
    setBagItems([]);
    setAppliedPromoCode(null);
  };

  const handleApplyRewardToBag = () => {
    setAppliedPromoCode('GAMERFREE');
    setIsBagOpen(true);
  };

  const filteredMenu = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (activeCategory !== 'all' && item.category !== activeCategory) return false;
      if (spicyOnly && !item.isSpicy) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          item.name.toLowerCase().includes(q) ||
          item.shortDesc.toLowerCase().includes(q) ||
          item.categoryLabel.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [activeCategory, spicyOnly, searchQuery]);

  const spotlightItem =
    MENU_ITEMS.find((m) => m.id === HERO_SPOTLIGHT_IDS[spotlightIndex]) ?? MENU_ITEMS[0];

  const getItemQtyInBag = (itemId: string) =>
    bagItems
      .filter((entry) => entry.item.id === itemId)
      .reduce((sum, entry) => sum + entry.quantity, 0);

  const handleNavCategoryJump = (category: MenuCategory) => {
    setActiveCategory(category);
    setMobileMenuOpen(false);
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveName.trim()) {
      setReserveError('Enter a name for your group booth pass.');
      return;
    }
    setReserveError(null);
    const zone = HANGOUT_ZONES.find((z) => z.id === selectedZoneId) ?? HANGOUT_ZONES[0];
    const passNum = 10 + Math.floor(Math.random() * 88);
    setBoothPass({
      passCode: `FM-B${passNum}`,
      zoneName: zone.name,
      slot: selectedSlot,
      groupSize,
      name: reserveName.trim(),
    });
  };

  const toggleEventRsvp = (eventId: string, title: string) => {
    setRsvpedEvents((prev) => {
      const next = !prev[eventId];
      showToast(next ? `RSVP confirmed for ${title}` : `RSVP removed for ${title}`);
      return { ...prev, [eventId]: next };
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#141416]">
      {/* Slim Dismissible Campus Offer Strip (<= 40px) */}
      <div className="border-b border-zinc-200 bg-zinc-950 px-4 py-2 text-center text-xs text-zinc-200">
        <span>
          Campus Gate Flash Offer: Use <span className="font-mono font-semibold text-white">DGUFLASH15</span> for 15% off snacks &amp; mocktails (₹120+ orders)
        </span>
      </div>

      {/* Top Bar Contract: Exactly 3 Zones, Single Row */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="font-display text-xl font-extrabold tracking-tight text-zinc-950 whitespace-nowrap shrink-0"
          >
            Foodmaniac
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-600"
          >
            <a
              href="#menu"
              onClick={() => setActiveCategory('all')}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Express Menu
            </a>
            <a
              href="#menu"
              onClick={(e) => {
                e.preventDefault();
                handleNavCategoryJump('mocktails');
              }}
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Mocktail Bar
            </a>
            <a
              href="#mini-games"
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Mini-Games
            </a>
            <a
              href="#hangout"
              className="hover:text-zinc-950 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
            >
              Hangout Zones
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#FF5A1F] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#e54b12] whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="tabular-nums">Order Bag ({totalBagCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label="Toggle navigation menu"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Collapse */}
        {mobileMenuOpen && (
          <nav className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden">
            <div className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
              <a
                href="#menu"
                onClick={() => handleNavCategoryJump('all')}
                className="py-2 hover:text-zinc-950"
              >
                Express Menu
              </a>
              <a
                href="#menu"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavCategoryJump('mocktails');
                }}
                className="py-2 hover:text-zinc-950"
              >
                Mocktail Bar
              </a>
              <a
                href="#mini-games"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-zinc-950"
              >
                Mini-Games
              </a>
              <a
                href="#hangout"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-zinc-950"
              >
                Hangout Zones
              </a>
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main id="top">
        {/* SECTION 1: Storefront Hero & Express Promise */}
        <section className="border-b border-zinc-200 bg-white py-12 md:py-16">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-stretch">
              {/* Left Hero Copy */}
              <div className="flex flex-col justify-center lg:col-span-6">
                <p className="text-xs font-medium text-zinc-500">
                  Campus QSR &amp; Social Hangout Hub · Within 1 km of University Gates
                </p>
                <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl leading-[1.08] [text-wrap:balance]">
                  Instant snacks, cold mocktails, and mini-games in under 5 minutes.
                </h1>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
                  Built for lecture gaps and 4 PM–9 PM squad hangouts. Skip slow café queues and
                  crowded street carts with rapid-prep bites at student-friendly ₹95–₹245 prices.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <a
                    href="#menu"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#FF5A1F] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#e54b12] whitespace-nowrap"
                  >
                    Order Express Menu
                  </a>
                  <a
                    href="#mini-games"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-50 whitespace-nowrap"
                  >
                    Play for a Free Mocktail
                  </a>
                </div>
              </div>

              {/* Right Express Spotlight Card */}
              <div className="lg:col-span-6">
                <div className="flex h-full flex-col justify-between overflow-hidden rounded-xl border border-zinc-200 bg-[#F4F4F6]">
                  <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3">
                    <span className="text-xs font-semibold text-zinc-700">
                      Counter Spotlight · {spotlightItem.featuredTag ?? spotlightItem.categoryLabel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {HERO_SPOTLIGHT_IDS.map((id, idx) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setSpotlightIndex(idx)}
                          aria-label={`View featured item ${idx + 1}`}
                          className={`h-7 rounded-md px-2.5 font-mono text-xs font-semibold transition-colors ${
                            spotlightIndex === idx
                              ? 'bg-zinc-950 text-white'
                              : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                          }`}
                        >
                          0{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative flex-1 min-h-[220px] flex items-center justify-center p-4">
                    <MenuIllustration
                      type={spotlightItem.illustrationType}
                      className="h-52 w-full max-w-[320px]"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-zinc-200 bg-white px-5 py-4">
                    <div>
                      <p className="text-xs font-medium text-zinc-500">
                        {spotlightItem.categoryLabel} · {spotlightItem.prepMinutes} min prep
                      </p>
                      <h2 className="mt-0.5 font-display text-lg font-bold text-zinc-950">
                        {spotlightItem.name}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-lg font-bold text-zinc-950 tabular-nums">
                        ₹{spotlightItem.price}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToBag(spotlightItem)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-zinc-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 whitespace-nowrap"
                      >
                        <Plus className="h-4 w-4" />
                        Quick Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4-Column Operational Proof Strip (Below Hero Split) */}
            <div className="mt-10 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-8 md:grid-cols-4">
              <div>
                <p className="text-xs font-medium text-zinc-500">Order-to-Table Target</p>
                <p className="mt-1 font-display text-xl font-bold text-zinc-950 tabular-nums">
                  Under 5 Mins
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Student Budget Range</p>
                <p className="mt-1 font-display text-xl font-bold text-zinc-950 tabular-nums">
                  ₹95 – ₹245
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Tabletop Mini-Games</p>
                <p className="mt-1 font-display text-xl font-bold text-zinc-950">
                  Free at Every Booth
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-zinc-500">Peak Hangout Hours</p>
                <p className="mt-1 font-display text-xl font-bold text-zinc-950 tabular-nums">
                  11 AM – 9 PM Daily
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: Rapid Express Snack & Mocktail Counter */}
        <section id="menu" className="py-14 md:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500">
                  Rapid Express Counter · Pre-Prepped Fresh Ingredients
                </p>
                <h2 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
                  Snacks, Craft Mocktails &amp; Squad Boxes
                </h2>
              </div>

              {/* Search & Spicy Filter */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search fries, wrap, mojito..."
                    aria-label="Search menu items"
                    className="h-10 w-56 rounded-lg border border-zinc-200 bg-white pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-950 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setSpicyOnly((s) => !s)}
                  className={`min-h-[40px] rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                    spicyOnly
                      ? 'border-orange-600 bg-orange-50 text-orange-800'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                  }`}
                >
                  {spicyOnly ? 'Spicy Picks: On' : 'Spicy Picks'}
                </button>
              </div>
            </div>

            {/* Category Segmented Tabs */}
            <div className="mt-6 flex flex-wrap items-center gap-1.5 rounded-lg bg-zinc-200/70 p-1 w-fit">
              {(
                [
                  { id: 'all', label: 'All Items' },
                  { id: 'snacks', label: 'Express Snacks' },
                  { id: 'mocktails', label: 'Craft Mocktails' },
                  { id: 'combos', label: 'Group Combos' },
                ] as { id: MenuCategory; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`min-h-[38px] rounded-md px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    activeCategory === tab.id
                      ? 'bg-white text-zinc-950 shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 3-Column Uniform Product Grid */}
            {filteredMenu.length === 0 ? (
              <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-10 text-center">
                <p className="font-display text-lg font-bold text-zinc-900">
                  No menu items match your filter
                </p>
                <p className="mt-1 text-sm text-zinc-500">
                  Clear your search or spicy filter to view all express snacks and mocktails.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('all');
                    setSpicyOnly(false);
                    setSearchQuery('');
                  }}
                  className="mt-4 min-h-[40px] rounded-lg bg-zinc-950 px-4 py-2 text-xs font-semibold text-white"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMenu.map((item) => {
                  const qtyInBag = getItemQtyInBag(item.id);
                  const defaultLineKey = `${item.id}__${item.customizationOptions[0]}`;
                  const defaultLineQty =
                    bagItems.find((e) => e.key === defaultLineKey)?.quantity ?? 0;

                  return (
                    <article
                      key={item.id}
                      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {/* Product Visual (65% height feel on uniform neutral backdrop) */}
                      <button
                        type="button"
                        onClick={() => setModalItem(item)}
                        className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4F4F6] text-left focus-visible:outline-2 focus-visible:outline-zinc-950"
                        aria-label={`Customize and view ${item.name}`}
                      >
                        <MenuIllustration
                          type={item.illustrationType}
                          className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      </button>

                      {/* Card Content */}
                      <div className="flex flex-1 flex-col justify-between p-5">
                        <div>
                          {/* Unboxed Metadata with middot separators */}
                          <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                            <span>{item.categoryLabel}</span>
                            <span aria-hidden="true">·</span>
                            <span className="inline-flex items-center gap-1 tabular-nums">
                              <Clock className="h-3 w-3 text-[#FF5A1F]" />
                              {item.prepMinutes} min prep
                            </span>
                            {item.isSpicy && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-orange-700">Spicy</span>
                              </>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setModalItem(item)}
                            className="mt-1.5 block text-left font-display text-base font-bold text-zinc-950 hover:text-[#FF5A1F] transition-colors"
                          >
                            {item.name}
                          </button>

                          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-zinc-600">
                            {item.shortDesc}
                          </p>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
                          <span className="font-mono text-base font-bold text-zinc-950 tabular-nums">
                            ₹{item.price}
                          </span>

                          <div className="flex items-center gap-2">
                            {qtyInBag > 0 && defaultLineQty > 0 ? (
                              <div className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateQty(defaultLineKey, -1)}
                                  aria-label={`Remove one ${item.name}`}
                                  className="flex h-9 w-9 items-center justify-center text-zinc-700 hover:text-zinc-950"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="w-7 text-center font-mono text-xs font-bold tabular-nums">
                                  {qtyInBag}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleAddToBag(item)}
                                  aria-label={`Add one more ${item.name}`}
                                  className="flex h-9 w-9 items-center justify-center text-zinc-700 hover:text-zinc-950"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddToBag(item)}
                                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg bg-zinc-950 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#FF5A1F] whitespace-nowrap"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                {qtyInBag > 0 ? `Add (${qtyInBag})` : 'Add'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: Interactive Mini-Game Lounge */}
        <MiniGameLounge
          unlockedReward={unlockedGamerReward}
          appliedPromoCode={appliedPromoCode}
          onUnlockReward={() => setUnlockedGamerReward(true)}
          onApplyRewardToBag={handleApplyRewardToBag}
        />

        {/* SECTION 4: Chillout Zones & Campus Events */}
        <section id="hangout" className="py-16 md:py-20 bg-white border-t border-zinc-200">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-12">
              {/* Left: Reserve a Hangout Booth */}
              <div className="lg:col-span-7">
                <p className="text-xs font-medium text-zinc-500">
                  Color-Themed Hangout Seating · Zero Cafe Minimums
                </p>
                <h2 className="mt-1.5 font-display text-3xl font-bold tracking-tight text-zinc-950">
                  Lock a Hangout Booth Between Classes
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  Pick your zone before walking over from campus. Every booth includes free board
                  games, charging ports, and rapid counter delivery.
                </p>

                {boothPass ? (
                  <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-6">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <Check className="h-4 w-4" />
                        Booth Pass Confirmed
                      </span>
                      <span className="font-mono text-sm font-bold text-zinc-950">
                        {boothPass.passCode}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold text-zinc-950">
                      {boothPass.zoneName}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-600">
                      Reserved for <span className="font-semibold">{boothPass.name}</span> ·{' '}
                      {boothPass.groupSize} Students · {boothPass.slot}
                    </p>
                    <p className="mt-3 text-xs text-zinc-500">
                      Show pass code <span className="font-mono font-semibold text-zinc-800">{boothPass.passCode}</span> at the Express Counter or enter it in your Hangout Booth delivery note.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBoothPass(null)}
                      className="mt-4 min-h-[40px] rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100"
                    >
                      Change Reservation
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReserveSubmit} className="mt-6 space-y-5">
                    {/* Zone Selector Cards */}
                    <div className="grid gap-3 sm:grid-cols-3">
                      {HANGOUT_ZONES.map((zone) => {
                        const isSelected = selectedZoneId === zone.id;
                        return (
                          <button
                            key={zone.id}
                            type="button"
                            onClick={() => setSelectedZoneId(zone.id)}
                            className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-colors ${
                              isSelected
                                ? 'border-zinc-950 bg-zinc-950 text-white'
                                : 'border-zinc-200 bg-white text-zinc-900 hover:border-zinc-400'
                            }`}
                          >
                            <div>
                              <span
                                className={`text-xs font-medium ${
                                  isSelected ? 'text-zinc-300' : 'text-zinc-500'
                                }`}
                              >
                                {zone.capacity}
                              </span>
                              <h3 className="mt-1 font-display text-base font-bold">
                                {zone.name}
                              </h3>
                              <p
                                className={`mt-1.5 text-xs leading-relaxed ${
                                  isSelected ? 'text-zinc-300' : 'text-zinc-600'
                                }`}
                              >
                                {zone.vibe}
                              </p>
                            </div>
                            <p
                              className={`mt-3 pt-2.5 border-t text-[11px] font-medium ${
                                isSelected
                                  ? 'border-zinc-800 text-orange-300'
                                  : 'border-zinc-100 text-zinc-500'
                              }`}
                            >
                              {zone.gamesIncluded}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {/* Time Slot & Group Size */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <span className="block text-xs font-semibold text-zinc-700">
                          Campus Break Slot
                        </span>
                        <div className="mt-2 flex flex-col gap-2">
                          {BREAK_SLOTS.map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setSelectedSlot(slot)}
                              className={`min-h-[40px] rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors ${
                                selectedSlot === slot
                                  ? 'border-[#FF5A1F] bg-orange-50 text-zinc-950'
                                  : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between space-y-4">
                        <div>
                          <label
                            htmlFor="reserve-name"
                            className="block text-xs font-semibold text-zinc-700"
                          >
                            Squad Lead Name
                          </label>
                          <input
                            id="reserve-name"
                            type="text"
                            value={reserveName}
                            onChange={(e) => setReserveName(e.target.value)}
                            placeholder="e.g. Ananya (MBA Sec A)"
                            className="mt-2 h-10 w-full rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 focus:border-zinc-950 focus:outline-none"
                          />
                        </div>

                        <div>
                          <span className="block text-xs font-semibold text-zinc-700">
                            Group Size
                          </span>
                          <div className="mt-2 flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5">
                            <span className="inline-flex items-center gap-1.5 text-xs text-zinc-600">
                              <Users className="h-4 w-4" />
                              Students
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setGroupSize((g) => Math.max(1, g - 1))}
                                aria-label="Decrease group size"
                                className="flex h-8 w-8 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-6 text-center font-mono text-sm font-bold tabular-nums">
                                {groupSize}
                              </span>
                              <button
                                type="button"
                                onClick={() => setGroupSize((g) => Math.min(10, g + 1))}
                                aria-label="Increase group size"
                                className="flex h-8 w-8 items-center justify-center rounded border border-zinc-200 bg-white text-zinc-700 hover:text-zinc-950"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {reserveError && (
                      <p className="text-xs font-medium text-red-600">{reserveError}</p>
                    )}

                    <button
                      type="submit"
                      className="min-h-[44px] rounded-lg bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF5A1F]"
                    >
                      Generate Booth Pass
                    </button>
                  </form>
                )}
              </div>

              {/* Right: Campus Events & Open Mic Nights */}
              <div className="lg:col-span-5">
                <p className="text-xs font-medium text-zinc-500">
                  Community Nights · Student Club Partnerships
                </p>
                <h2 className="mt-1.5 font-display text-2xl font-bold tracking-tight text-zinc-950">
                  This Week at Foodmaniac
                </h2>

                <div className="mt-6 space-y-4">
                  {CAMPUS_EVENTS.map((ev) => {
                    const isGoing = !!rsvpedEvents[ev.id];
                    return (
                      <div
                        key={ev.id}
                        className="rounded-xl border border-zinc-200 bg-[#FAFAFA] p-5"
                      >
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-500">
                          <Calendar className="h-3.5 w-3.5 text-[#FF5A1F]" />
                          <span>{ev.schedule}</span>
                        </div>
                        <h3 className="mt-2 font-display text-lg font-bold text-zinc-950">
                          {ev.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-600">
                          {ev.description}
                        </p>
                        <div className="mt-3 space-y-1 text-xs text-zinc-600">
                          <p>
                            <span className="font-semibold text-zinc-900">Zone:</span> {ev.zone} ·{' '}
                            {ev.entryFee}
                          </p>
                          <p>
                            <span className="font-semibold text-zinc-900">Perk:</span> {ev.perks}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleEventRsvp(ev.id, ev.title)}
                          className={`mt-4 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                            isGoing
                              ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                              : 'border border-zinc-300 bg-white text-zinc-900 hover:border-zinc-950'
                          }`}
                        >
                          {isGoing ? (
                            <>
                              <Check className="h-3.5 w-3.5" />
                              Spot Reserved
                            </>
                          ) : (
                            'RSVP for Squad'
                          )}
                        </button>
                      </div>
                    );
                  })}

                  {/* Campus Location Card */}
                  <div className="rounded-xl border border-zinc-200 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#FF5A1F]" />
                      <div>
                        <h3 className="font-display text-base font-bold text-zinc-950">
                          Main Campus Hub · University Road
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                          400m from Main Gate &amp; Hostel Block · Open 11:00 AM – 9:00 PM · Club
                          group code: <span className="font-mono font-semibold">CAMPUSCLUB</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Clean Footer */}
      <footer className="border-t border-zinc-200 bg-[#FAFAFA] py-10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <span className="font-display text-lg font-extrabold text-zinc-950">Foodmaniac</span>
            <p className="mt-1 text-xs text-zinc-500">
              Fast-casual campus QSR, craft mocktails, and mini-game chillout hub · 11 AM – 9 PM
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-zinc-600">
            <a href="#menu" className="hover:text-zinc-950">
              Express Menu
            </a>
            <a href="#mini-games" className="hover:text-zinc-950">
              Mini-Game Lounge
            </a>
            <a href="#hangout" className="hover:text-zinc-950">
              Booth Reservations
            </a>
            <button
              type="button"
              onClick={() => setIsBagOpen(true)}
              className="font-semibold text-[#FF5A1F] hover:underline"
            >
              Open Express Bag
            </button>
          </div>
        </div>
      </footer>

      {/* Subtle Add-to-Bag Feedback Toast */}
      {toastText && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-40 rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white shadow-lg"
        >
          {toastText}
        </div>
      )}

      {/* Product Customization Modal */}
      <ProductModal
        item={modalItem}
        onClose={() => setModalItem(null)}
        onAddToBag={handleAddToBag}
      />

      {/* Slide-Over Express Bag & Live <5 Min Prep Tracker */}
      <OrderBagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        bagItems={bagItems}
        promoCode={appliedPromoCode}
        unlockedGamerReward={unlockedGamerReward}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onApplyPromo={setAppliedPromoCode}
        onClearBag={handleClearBag}
      />
    </div>
  );
}

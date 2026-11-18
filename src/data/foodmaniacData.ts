export type MenuCategory = 'all' | 'snacks' | 'mocktails' | 'combos';
export type DietaryTag = 'all' | 'veg' | 'spicy';

export interface MenuItem {
  id: string;
  name: string;
  category: Exclude<MenuCategory, 'all'>;
  categoryLabel: string;
  price: number;
  prepMinutes: number;
  isVeg: boolean;
  isSpicy: boolean;
  shortDesc: string;
  prepNote: string;
  illustrationType:
    | 'peri_fries'
    | 'paneer_wrap'
    | 'crispy_sliders'
    | 'cheese_nuggets'
    | 'blue_lagoon'
    | 'mango_chili'
    | 'mint_mojito'
    | 'berry_fizz'
    | 'solo_combo'
    | 'squad_box';
  customizationLabel: string;
  customizationOptions: string[];
  featuredTag?: string;
}

export interface HangoutZone {
  id: string;
  name: string;
  capacity: string;
  vibe: string;
  gamesIncluded: string;
  hourlyNote: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  schedule: string;
  zone: string;
  entryFee: string;
  description: string;
  perks: string;
}

export interface PromoCodeInfo {
  code: string;
  label: string;
  type: 'percent' | 'free_mocktail';
  value: number;
  minSubtotal: number;
  description: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'peri-fries',
    name: 'Flash Peri-Peri Loaded Fries',
    category: 'snacks',
    categoryLabel: 'Express Snack',
    price: 110,
    prepMinutes: 3,
    isVeg: true,
    isSpicy: true,
    shortDesc: 'Crisp shoestring fries tossed in smoky peri-peri dust and liquid cheddar.',
    prepNote: 'Pre-blanched batch flash-fried to order in 160 seconds.',
    illustrationType: 'peri_fries',
    customizationLabel: 'Heat Level',
    customizationOptions: ['Mild Tangy', 'Classic Peri', 'Extra Fiery'],
    featuredTag: 'Campus Favorite',
  },
  {
    id: 'paneer-wrap',
    name: 'Tikka Crunch Pocket Wrap',
    category: 'snacks',
    categoryLabel: 'Express Snack',
    price: 135,
    prepMinutes: 4,
    isVeg: true,
    isSpicy: true,
    shortDesc: 'Seared masala paneer strips, pickled onions, and mint crema in a toasted tortilla.',
    prepNote: 'Pre-marinated strips grilled on high-heat flat top under 4 minutes.',
    illustrationType: 'paneer_wrap',
    customizationLabel: 'Sauce Finish',
    customizationOptions: ['Mint Crema', 'Chipotle Mayo', 'Double Sauce'],
  },
  {
    id: 'crispy-sliders',
    name: 'Double Crunch Herb Sliders',
    category: 'snacks',
    categoryLabel: 'Express Snack',
    price: 145,
    prepMinutes: 4,
    isVeg: true,
    isSpicy: false,
    shortDesc: 'Two toasted brioche mini buns with crispy herb patty and melted cheese.',
    prepNote: 'Assembly-line bun toast and rapid fry station.',
    illustrationType: 'crispy_sliders',
    customizationLabel: 'Add Dip',
    customizationOptions: ['Garlic Aioli', 'Smoky BBQ', 'Cheese Fondue'],
    featuredTag: 'Under 4 Mins',
  },
  {
    id: 'cheese-nuggets',
    name: 'Jalapeno Cheese Poppers',
    category: 'snacks',
    categoryLabel: 'Express Snack',
    price: 120,
    prepMinutes: 3,
    isVeg: true,
    isSpicy: true,
    shortDesc: '8 golden-fried cheddar and diced jalapeno bites served with chili ranch.',
    prepNote: 'Portion-controlled freezer-to-fryer basket in 180 seconds.',
    illustrationType: 'cheese_nuggets',
    customizationLabel: 'Dip Choice',
    customizationOptions: ['Chili Ranch', 'Sweet Mustard', 'Peri Mayo'],
  },
  {
    id: 'blue-lagoon',
    name: 'Electric Blue Lagoon Fizz',
    category: 'mocktails',
    categoryLabel: 'Craft Mocktail',
    price: 95,
    prepMinutes: 2,
    isVeg: true,
    isSpicy: false,
    shortDesc: 'Zesty blue curacao syrup, crushed lime, and sparkling soda over pebble ice.',
    prepNote: 'Poured straight from chilled syrup taps in 90 seconds.',
    illustrationType: 'blue_lagoon',
    customizationLabel: 'Ice & Fizz',
    customizationOptions: ['Regular Ice', 'Light Ice', 'Extra Tangy Lime'],
    featuredTag: '90-Sec Pour',
  },
  {
    id: 'mango-chili',
    name: 'Alphonso Mango Chili Cooler',
    category: 'mocktails',
    categoryLabel: 'Craft Mocktail',
    price: 115,
    prepMinutes: 2,
    isVeg: true,
    isSpicy: true,
    shortDesc: 'Sweet mango nectar muddled with green chili kick and salted citrus rim.',
    prepNote: 'Pre-batched mango base shaken rapidly with fresh soda.',
    illustrationType: 'mango_chili',
    customizationLabel: 'Rim & Spice',
    customizationOptions: ['Chili-Salt Rim', 'No Chili Rim', 'Extra Mango'],
  },
  {
    id: 'mint-mojito',
    name: 'Campus Mint Ginger Mojito',
    category: 'mocktails',
    categoryLabel: 'Craft Mocktail',
    price: 99,
    prepMinutes: 2,
    isVeg: true,
    isSpicy: false,
    shortDesc: 'Fresh garden mint, cold-pressed ginger zing, and sparkling lemon spritz.',
    prepNote: 'Express muddle bar setup for lecture-gap speed.',
    illustrationType: 'mint_mojito',
    customizationLabel: 'Sweetness',
    customizationOptions: ['Balanced', 'Less Sugar', 'Extra Mint'],
  },
  {
    id: 'berry-fizz',
    name: 'Wild Berry Hibiscus Spritz',
    category: 'mocktails',
    categoryLabel: 'Craft Mocktail',
    price: 120,
    prepMinutes: 2,
    isVeg: true,
    isSpicy: false,
    shortDesc: 'Chilled berry hibiscus infusion topped with crushed ice and citrus twist.',
    prepNote: 'Cold-steeped concentrate poured in under 2 minutes.',
    illustrationType: 'berry_fizz',
    customizationLabel: 'Fizz Style',
    customizationOptions: ['Classic Soda', 'Tonic Finish', 'Light Ice'],
  },
  {
    id: 'solo-combo',
    name: 'Lecture Break Solo Box',
    category: 'combos',
    categoryLabel: 'Group Combo',
    price: 175,
    prepMinutes: 4,
    isVeg: true,
    isSpicy: true,
    shortDesc: 'Flash Peri-Peri Fries + Tikka Crunch Wrap + Electric Blue Lagoon Fizz.',
    prepNote: 'Dual-station sync: fries & wrap finish simultaneously under 4 minutes.',
    illustrationType: 'solo_combo',
    customizationLabel: 'Mocktail Choice',
    customizationOptions: ['Blue Lagoon', 'Mint Mojito', 'Mango Chili'],
    featuredTag: 'Best Value',
  },
  {
    id: 'squad-box',
    name: '4-Player Hangout Platter',
    category: 'combos',
    categoryLabel: 'Group Combo',
    price: 245,
    prepMinutes: 5,
    isVeg: true,
    isSpicy: true,
    shortDesc: '2 Double Crunch Sliders, Poppers, Peri Fries, and two 350ml Mocktails.',
    prepNote: 'Designed for game-table sharing between classes.',
    illustrationType: 'squad_box',
    customizationLabel: 'Table Game Add-on',
    customizationOptions: ['Include Card Deck', 'Include Uno & Dice', 'Food Only'],
  },
];

export const HANGOUT_ZONES: HangoutZone[] = [
  {
    id: 'arcade-booths',
    name: 'Arcade Color Booths',
    capacity: '4–6 Students',
    vibe: 'Vibrant tangerine & cobalt booths with tabletop board games',
    gamesIncluded: 'Connect-4, Jenga, Uno, Card Decks',
    hourlyNote: 'Free with ₹150+ group order',
  },
  {
    id: 'jam-corner',
    name: 'Acoustic & Jam Lounge',
    capacity: '6–10 Students',
    vibe: 'Cozy cushioned riser seating for post-class chillouts & open mics',
    gamesIncluded: 'Trivia Cards, Guitar Stand, Acoustic Mic',
    hourlyNote: 'Free with ₹200+ group order',
  },
  {
    id: 'express-bar',
    name: 'Rapid Counter Bar',
    capacity: '1–2 Students',
    vibe: 'High-top charging counter for 15-minute lecture-gap refuels',
    gamesIncluded: 'Fast USB-C Ports + Solo Speed Puzzles',
    hourlyNote: 'Walk-in priority seating',
  },
];

export const CAMPUS_EVENTS: CampusEvent[] = [
  {
    id: 'mini-game-knockout',
    title: 'Campus Mini-Game Knockout',
    schedule: 'Every Wednesday · 4:30 PM – 6:30 PM',
    zone: 'Arcade Color Booths',
    entryFee: 'Free with any snack order',
    description: '3-round Connect-4 & quick trivia blitz for college squads.',
    perks: 'Winners get 1 Free Craft Mocktail on the spot',
  },
  {
    id: 'open-mic-jam',
    title: 'Friday Open Mic & Jam Night',
    schedule: 'Every Friday · 6:00 PM – 8:45 PM',
    zone: 'Acoustic & Jam Lounge',
    entryFee: '₹99 Pass (Includes 1 Mocktail)',
    description: 'Student singers, stand-up sets, and acoustic mashups near campus.',
    perks: 'Club group bookings get 15% off platters',
  },
];

export const PROMO_CODES: Record<string, PromoCodeInfo> = {
  DGUFLASH15: {
    code: 'DGUFLASH15',
    label: 'Flash Student Discount (15% Off)',
    type: 'percent',
    value: 15,
    minSubtotal: 120,
    description: 'Campus gate flyer & Instagram launch offer',
  },
  CAMPUSCLUB: {
    code: 'CAMPUSCLUB',
    label: 'Student Club Group Deal (20% Off)',
    type: 'percent',
    value: 20,
    minSubtotal: 220,
    description: 'Valid for student club group orders ₹220+',
  },
  BOUNCE10: {
    code: 'BOUNCE10',
    label: 'Bounce-Back Voucher (10% Off)',
    type: 'percent',
    value: 10,
    minSubtotal: 100,
    description: '14-day repeat visit reward voucher',
  },
  GAMERFREE: {
    code: 'GAMERFREE',
    label: 'Mini-Game Winner (₹95 Free Mocktail Credit)',
    type: 'free_mocktail',
    value: 95,
    minSubtotal: 150,
    description: 'Unlocked by winning a round in the Mini-Game Lounge',
  },
};

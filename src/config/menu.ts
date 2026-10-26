/**
 * @file menu.ts
 * Source of truth for Hook & Cook menu items and category configuration.
 * All prices strictly reflect captured menu data.
 * Items with unknown prices are set to null and rendered as 'Ask staff'.
 */

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number | null; // null represents 'Ask staff'
  description?: string;
  isVegetarian?: boolean;
  isFeatured?: boolean;
  image?: string;
  imageAlt?: string;
  spiceLevel?: 0 | 1 | 2 | 3;
}

export interface MenuCategory {
  id: string;
  name: string;
  subtitle?: string;
  priceNote?: string;
  badge?: string;
  isVegetarianCategory?: boolean;
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "veg_starters",
    name: "Veg Starters",
    subtitle: "Crispy bhajias, paneer, tikki and golden rolls",
    isVegetarianCategory: true,
  },
  {
    id: "soups",
    name: "Soups",
    subtitle: "Warm, simmering broths and noodles",
    priceNote: "Soups from KES 420. Individual prices TBC — ask staff.",
  },
  {
    id: "mains_and_platters",
    name: "Mains & Platters",
    subtitle: "Hearty curries, seafood specialties, and Karoga platters",
    priceNote: "Mains from KES 1,400 depending on portion. Ask staff for today's cuts.",
  },
  {
    id: "cocktails",
    name: "Cocktails & Bar",
    subtitle: "House creations, timeless classics, and chilled beers",
    priceNote: "Full bar list and daily happy hour specials available on request.",
  },
  {
    id: "desserts",
    name: "Desserts & Tea",
    subtitle: "Sweet finishes, spiced masala tea, and espresso",
    priceNote: "Ask staff for today's freshly prepared selections.",
  },
];

export const MENU_ITEMS: MenuItem[] = [
  // --- VEG STARTERS ---
  {
    id: "plain-chips",
    name: "Plain Chips",
    category: "veg_starters",
    price: 400,
    description: "Crisp golden potato chips seasoned with fine sea salt.",
    isVegetarian: true,
  },
  {
    id: "french-fries",
    name: "French Fries",
    category: "veg_starters",
    price: 400,
    description: "Classic slender cut fries, double-fried for optimal crunch.",
    isVegetarian: true,
  },
  {
    id: "masala-chips",
    name: "Masala Chips",
    category: "veg_starters",
    price: 500,
    description: "Kenyan-style spiced chips tossed in a tangy garlic-chili tomato glaze with fresh cilantro.",
    isVegetarian: true,
    isFeatured: true,
    image: "/src/assets/images/masala_chips_1793027544877.jpg",
    imageAlt: "Kenyan spiced masala chips with fresh cilantro and lime",
    spiceLevel: 2,
  },
  {
    id: "chili-chips",
    name: "Chili Chips",
    category: "veg_starters",
    price: 500,
    description: "Tossed in fiery green chilies, cracked black pepper, and fresh lemon juice.",
    isVegetarian: true,
    spiceLevel: 3,
  },
  {
    id: "american-chips",
    name: "American Chips",
    category: "veg_starters",
    price: 500,
    description: "Thick hand-cut chips dusted with sweet paprika and savory seasoning.",
    isVegetarian: true,
  },
  {
    id: "sauce-chips",
    name: "Sauce Chips",
    category: "veg_starters",
    price: 500,
    description: "Golden chips smothered in our chef's signature house savory reduction.",
    isVegetarian: true,
  },
  {
    id: "masala-bhajia",
    name: "Masala Bhajia",
    category: "veg_starters",
    price: 500,
    description: "Thinly sliced spiced potatoes dipped in seasoned gram flour batter and fried crisp.",
    isVegetarian: true,
    isFeatured: true,
    image: "/src/assets/images/hara_bhara_kabab_1793027564272.jpg",
    imageAlt: "Golden crisp masala bhajia fritters",
    spiceLevel: 1,
  },
  {
    id: "methi-bhajia",
    name: "Methi Bhajia",
    category: "veg_starters",
    price: 500,
    description: "Fragrant fenugreek leaf fritters with aromatic spices and mint chutney.",
    isVegetarian: true,
    spiceLevel: 1,
  },
  {
    id: "mazi-bhajia",
    name: "Mazi Bhajia",
    category: "veg_starters",
    price: 500,
    description: "Traditional coastal-style crispy battered fritters served with tamarind dip.",
    isVegetarian: true,
  },
  {
    id: "onion-rings",
    name: "Onion Rings",
    category: "veg_starters",
    price: 500,
    description: "Crispy battered sweet onion rings fried golden brown.",
    isVegetarian: true,
  },
  {
    id: "corn-chaat",
    name: "Corn Chaat",
    category: "veg_starters",
    price: 500,
    description: "Sweet corn kernels tossed with diced onions, tomatoes, chaat masala and lime.",
    isVegetarian: true,
  },
  {
    id: "veg-spring-roll",
    name: "Veg Spring Roll",
    category: "veg_starters",
    price: 500,
    description: "Golden crisp pastry filled with julienned vegetables and mild spices.",
    isVegetarian: true,
  },
  {
    id: "crispy-roasted-potato",
    name: "Crispy Roasted Potato",
    category: "veg_starters",
    price: 500,
    description: "Oven-crisped spiced baby potatoes with cumin and cracked coriander.",
    isVegetarian: true,
  },
  {
    id: "mcalou-tikki",
    name: "McAlou Tikki",
    category: "veg_starters",
    price: 500,
    description: "Spiced mashed potato patties griddled crisp with pomegranate seeds and ginger.",
    isVegetarian: true,
  },
  {
    id: "paneer-pakoda",
    name: "Paneer Pakoda",
    category: "veg_starters",
    price: 600,
    description: "Fresh cottage cheese slices stuffed with mint chutney and fried in crisp chickpea batter.",
    isVegetarian: true,
    isFeatured: true,
    image: "/src/assets/images/paneer_pakoda_1793027563689.jpg",
    imageAlt: "Crispy golden paneer pakoda with fresh mint dip",
  },
  {
    id: "hara-bhara-kabab",
    name: "Hara Bhara Kabab",
    category: "veg_starters",
    price: 600,
    description: "Nutritious patties of fresh spinach, green peas, and potatoes studded with toasted cashew nuts.",
    isVegetarian: true,
    isFeatured: true,
    image: "/src/assets/images/hara_bhara_kabab_1793027564272.jpg",
    imageAlt: "Spinach and pea hara bhara kabab with toasted cashews",
  },
  {
    id: "mushroom-salt-pepper",
    name: "Mushroom Salt & Pepper",
    category: "veg_starters",
    price: 600,
    description: "Button mushrooms wok-tossed with crushed black peppercorns and spring onions.",
    isVegetarian: true,
    spiceLevel: 2,
  },
  {
    id: "chili-paneer",
    name: "Chili Paneer",
    category: "veg_starters",
    price: 600,
    description: "Wok-seared paneer cubes with bell peppers, red onions, ginger and savory dark soy sauce.",
    isVegetarian: true,
    isFeatured: true,
    image: "/src/assets/images/chili_paneer_1793027545635.jpg",
    imageAlt: "Sizzling chili paneer with bell peppers and green onions",
    spiceLevel: 2,
  },
  {
    id: "paneer-chili-dry",
    name: "Paneer Chili Dry",
    category: "veg_starters",
    price: 600,
    description: "Crispy coated paneer cubes tossed dry with fiery slit green chilies and garlic.",
    isVegetarian: true,
    spiceLevel: 3,
  },
  {
    id: "mushroom-kadai-dry",
    name: "Mushroom Kadai Dry",
    category: "veg_starters",
    price: 600,
    description: "Whole mushrooms stir-fried in freshly ground kadai spices, capsicum and tomatoes.",
    isVegetarian: true,
    spiceLevel: 2,
  },
  {
    id: "mushroom-pakoda",
    name: "Mushroom Pakoda",
    category: "veg_starters",
    price: 600,
    description: "Plump button mushrooms dipped in seasoned spiced gram batter and fried crisp.",
    isVegetarian: true,
  },
  {
    id: "garlic-mushroom",
    name: "Garlic Mushroom",
    category: "veg_starters",
    price: 600,
    description: "Sautéed fresh button mushrooms in rich roasted garlic and aromatic herbs.",
    isVegetarian: true,
  },
  {
    id: "veg-finger",
    name: "Veg Finger",
    category: "veg_starters",
    price: 600,
    description: "Crispy breaded vegetable croquettes served with garlic mayo.",
    isVegetarian: true,
  },
  {
    id: "paneer-reshmi-roll",
    name: "Paneer Reshmi Roll",
    category: "veg_starters",
    price: 600,
    description: "Delicate silken marinated paneer wrapped in a thin griddled flatbread with spiced onions.",
    isVegetarian: true,
  },
  {
    id: "crispy-corn",
    name: "Crispy Corn",
    category: "veg_starters",
    price: 600,
    description: "Tender corn kernels fried until shatteringly crisp and dusted with chaat masala.",
    isVegetarian: true,
  },

  // --- SOUPS ---
  {
    id: "veg-hot-sour-soup",
    name: "Veg Hot & Sour Soup",
    category: "soups",
    price: null, // TBC: 'Ask staff'
    description: "Classic tangy and peppery broth loaded with shredded bamboo shoots and mushrooms.",
    isVegetarian: true,
  },
  {
    id: "veg-noodles-soup",
    name: "Veg Noodles Soup",
    category: "soups",
    price: null, // TBC: 'Ask staff'
    description: "Silky noodles swimming in an aromatic ginger-garlic clear vegetable broth.",
    isVegetarian: true,
  },
  {
    id: "veg-mushroom-soup",
    name: "Veg Mushroom Soup",
    category: "soups",
    price: null, // TBC: 'Ask staff'
    description: "Creamy earth-toned wild button mushroom soup finished with cracked pepper.",
    isVegetarian: true,
  },

  // --- MAINS & PLATTERS ---
  {
    id: "chicken-curry",
    name: "Chicken Curry",
    category: "mains_and_platters",
    price: null, // TBC: 'Ask staff'
    description: "Slow-simmered tender chicken pieces in a rich, deeply spiced tomato and onion gravy.",
    isFeatured: true,
    image: "/src/assets/images/chicken_curry_1793027564712.jpg",
    imageAlt: "Aromatic chicken curry served in a traditional hammered copper handi",
  },
  {
    id: "paneer-mains",
    name: "Paneer Specialty Curries",
    category: "mains_and_platters",
    price: null, // TBC: 'Ask staff'
    description: "Selection of vegetarian mains including Paneer Tikka Masala and Palak Paneer.",
    isVegetarian: true,
  },
  {
    id: "seafood-fish-fillet",
    name: "Fresh Fish Fillet & Seafood",
    category: "mains_and_platters",
    price: null, // TBC: 'Ask staff'
    description: "Catch of the day grilled or cooked in coastal coconut swahili spices.",
    isFeatured: true,
  },
  {
    id: "karoga-chicken-platter",
    name: "Chicken, Fish & Karoga Platters",
    category: "mains_and_platters",
    price: null, // TBC: 'Ask staff'
    description: "Generous sharing platters suited for groups, sports nights, and communal dining.",
  },

  // --- COCKTAILS & BAR ---
  {
    id: "whiskey-sour",
    name: "Whiskey Sour",
    category: "cocktails",
    price: null, // TBC: 'Ask staff'
    description: "Bourbon whiskey, fresh squeezed lemon, cane sugar, egg white froth and Angostura bitters.",
    isFeatured: true,
    image: "/src/assets/images/cocktail_whiskey_sour_1793027546581.jpg",
    imageAlt: "Whiskey sour cocktail with foamy head and dried citrus slice",
  },
  {
    id: "old-fashioned",
    name: "Old Fashioned",
    category: "cocktails",
    price: null,
    description: "Aged whiskey, brown sugar cube, aromatic bitters, slow stirred over clear hand-cut ice.",
  },
  {
    id: "long-island",
    name: "Long Island Iced Tea",
    category: "cocktails",
    price: null,
    description: "Vodka, gin, rum, tequila, triple sec, citrus blend and a splash of cola.",
  },
  {
    id: "cosmopolitan",
    name: "Cosmopolitan",
    category: "cocktails",
    price: null,
    description: "Citron vodka, triple sec, tart cranberry juice, and freshly squeezed lime.",
  },
  {
    id: "blue-lagoon",
    name: "Blue Lagoon",
    category: "cocktails",
    price: null,
    description: "Vibrant blue curaçao, smooth vodka, and sparkling lemonade over crushed ice.",
  },
  {
    id: "classic-mojito",
    name: "Classic Mojito",
    category: "cocktails",
    price: null,
    description: "White rum muddled with fresh mint leaves, lime juice, cane sugar, and club soda.",
  },
  {
    id: "draught-beer",
    name: "Chilled Draught & Bottled Beers",
    category: "cocktails",
    price: null,
    description: "Tusker Lager, White Cap, Heineken, and premium cold draughts on tap.",
  },

  // --- DESSERTS & TEA ---
  {
    id: "house-dessert",
    name: "Chef's Daily Dessert",
    category: "desserts",
    price: null,
    description: "Ask your server for tonight's freshly prepared cake, pudding or ice cream.",
    isVegetarian: true,
  },
  {
    id: "masala-tea",
    name: "Spiced Masala Chai",
    category: "desserts",
    price: null,
    description: "Freshly brewed Kenyan black tea steeped with crushed cardamom, ginger and cinnamon.",
    isVegetarian: true,
  },
];

// Specials array: empty by default per prompt specification.
// Populated here only if owner creates active daily specials.
export const TODAY_SPECIALS: MenuItem[] = [];

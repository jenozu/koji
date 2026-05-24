import { Product, CustomerReview, SizeOption, FrameOption } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'nezuko-kitty',
    title: 'Pink Ribbons & Cozy Kitty Print',
    character: 'Nezuko',
    franchise: 'Demon Slayer',
    price: 18.00,
    description: 'Nezuko-chan cuddling a gorgeous Hello Kitty plush with dynamic strawberry pink and mint turquoise details. Standard giclée professional grade print on luxurious textured cream cardstock.',
    imageUrl: '/src/assets/images/nezuko_print_1779216079613.png',
    tag: 'Best Seller',
    rating: 4.9,
    reviewsCount: 48,
    category: 'prints',
    vibe: 'dreamy',
    colors: ['#FFB3C1', '#82D1C1'],
    features: ['240gsm textured archival paper', 'Giclée archival pigment inks', 'Available in 3 classic frames', 'Hand-stamped artist catalog marking'],
    backstory: 'Nezuko-chan found a little kitty buddy with a matching pink bow! Now they share quiet, dreamy moments sipping strawberry milk under fluffy peach skies. Bring a cozy, comforting energy to your nightstand or reading corner.'
  },
  {
    id: 'rengoku-kitty',
    title: 'Blazing Hearts & Fluffy Kitties Print',
    character: 'Kyojuro Rengoku',
    franchise: 'Demon Slayer',
    price: 18.00,
    description: 'The bright blazing spirit Kyojuro Rengoku holding adorable round kittens. Combines fierce warmth with charming whimsical pastel shapes and nostalgic pink clouds.',
    imageUrl: '/src/assets/images/rengoku_print_1779216094690.png',
    tag: 'Popular',
    rating: 5.0,
    reviewsCount: 32,
    category: 'prints',
    vibe: 'nostalgia',
    colors: ['#FFEBB3', '#FF8097'],
    features: ['240gsm textured archival paper', 'Giclée archival pigment inks', 'Full bleed edge-to-edge illustration', 'Resistant to UV color fade for 50+ years'],
    backstory: 'A warm, passionate protector who loves sweet red bean helper cakes and round fluffy kitty companions! Kyojuro’s brilliant smile shines brilliantly next to his cute kitty friends beneath high-contrast pink candy clouds.'
  },
  {
    id: 'naruto-kitty',
    title: 'Whirlwind Blush & Kitten Ears Print',
    character: 'Naruto Uzumaki',
    franchise: 'Naruto',
    price: 18.00,
    description: 'A whimsical pastel anime illustration featuring Naruto-kun in cute cat ears, cuddling a blushing Hello Kitty plush among beautifully detailed pastel pink roses and turquoise wild-leaves.',
    imageUrl: '/src/assets/images/naruto_print_1779216109999.png',
    tag: 'Limited Edition',
    rating: 4.8,
    reviewsCount: 27,
    category: 'prints',
    vibe: 'cozy',
    colors: ['#FFEAA7', '#82D1C1'],
    features: ['240gsm textured archival paper', 'Giclée archival pigment inks', 'Features beautiful hand-drawn charcoal borders', 'Personally inspected for high fidelity printing'],
    backstory: 'Naruto-kun in fluffy pink kitty ears, holding his favorite giant plush friend under a gentle breeze of wild pink roses! A heartwarming picture representing warmth, hope, and happy childhood daydreams.'
  },
  {
    id: 'bayonetta-kitty',
    title: 'Witching Blossoms & Moon Kitty Print',
    character: 'Bayonetta',
    franchise: 'Bayonetta',
    price: 18.00,
    description: 'Graceful, mysterious, and ultra-stylish. Bayonetta wearing retro-mod glasses while showcasing a vintage Hello Kitty plush companion against a cascade of cherry blossoms.',
    imageUrl: '/src/assets/images/bayonetta_print_1779216123318.png',
    tag: 'Rare',
    rating: 5.0,
    reviewsCount: 19,
    category: 'prints',
    vibe: 'fierce',
    colors: ['#2B2D31', '#FFB3C1'],
    features: ['240gsm textured archival paper', 'Giclée archival pigment inks', 'Slightly high-contrast graphic detailing', 'Superb resolution for large displays'],
    backstory: 'Elegant, beautiful, and absolutely confident. Bayonetta cradles a lovely pink-bowed kitty friend inside a swirl of hand-colored cherry blossoms and mint-cyan skies, producing a stunning 90s aesthetic poster.'
  },
  {
    id: 'mononoke-kitty',
    title: 'Wolf Spirit & Kawaii Ribbon Print',
    character: 'San (Princess Mononoke)',
    franchise: 'Studio Ghibli',
    price: 18.00,
    description: 'A striking nostalgic illustration of San with her fluffy wolf ears headpiece, holding a sweet Hello Kitty plush under a magical forest canopy with pink petals.',
    imageUrl: '/src/assets/images/mononoke_print_1779216142403.png',
    tag: 'Featured',
    rating: 4.9,
    reviewsCount: 41,
    category: 'prints',
    vibe: 'fierce',
    colors: ['#82D1C1', '#FFB3C1'],
    features: ['240gsm textured archival paper', 'Giclée archival pigment inks', 'Signature ink-line-art border effect', 'Unique blend of rugged nature and sweetness'],
    backstory: 'San, the Princess of the Forest, wears her classic wolf hood but harbors a warm, unexpected friendship with a little kitty plush! This print combines breathtaking forest colors with charming cozy sweetness, perfect for Studio Ghibli lovers.'
  },
  {
    id: 'apparel-sweet-hoodie',
    title: '🌸 Strawberry Milk Cozy Knit Sweater',
    character: 'Strawberry Collection',
    franchise: 'Koji Studio',
    price: 45.00,
    description: 'An oversized, exceptionally soft premium knit sweater in warm cream colors, detailed with an outline print of a cute cute strawberry kitty and mint sleeves.',
    imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600',
    tag: 'Cozy Pick',
    rating: 4.9,
    reviewsCount: 64,
    category: 'apparel',
    vibe: 'cozy',
    colors: ['#FFB3C1', '#FDFBF7'],
    features: ['80% combed cotton, 20% recycled fleece', 'Oversized dreamy relaxed unisex fit', 'Breathable ultra-soft yarn dye', 'Wash-proof kawaii pastel prints'],
    backstory: 'Knitted for cozy days watching your favorite anime under a fluffy blanket! Keeps you amazingly warm while feeling like a delicious carton of chilled strawberry milk.'
  },
  {
    id: 'acc-matcha-tote',
    title: '🍵 Blushing Matcha Tea Party Tote Bag',
    character: 'Matcha Friends',
    franchise: 'Koji Studio',
    price: 16.00,
    description: 'A sturdy, natural heavy-duty cream canvas tote bag featuring an adorable blushing matcha teapot and retro bubble letters in muted turquoise.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
    tag: 'Eco-Friendly',
    rating: 4.7,
    reviewsCount: 38,
    category: 'accessories',
    vibe: 'dreamy',
    colors: ['#82D1C1', '#FDFBF7'],
    features: ['100% thick 12oz biological canvas', 'Double-stitched stress points', 'Holds a 15-inch laptop and three manga volumes', 'Inner zipper compartment for secure keys'],
    backstory: 'Perfect for picnics, library study sessions, and weekend strolls to high-end aesthetic cafés. Includes a tiny interior pocket decorated with blushing tea cups!'
  },
  {
    id: 'acc-sakura-socks',
    title: '🌸 Retro Sakura-Blossom Velvet Socks',
    character: 'Sakura Petals',
    franchise: 'Koji Studio',
    price: 12.00,
    description: 'Soft-as-clouds cozy crew socks embroidered with mini retro-pink cherry blossom flowers and bordered with a fine charcoal collar stitch.',
    imageUrl: 'https://images.unsplash.com/photo-1582966772680-860e372bb558?auto=format&fit=crop&q=80&w=600',
    tag: 'Stocking Filler',
    rating: 4.8,
    reviewsCount: 52,
    category: 'accessories',
    vibe: 'cozy',
    colors: ['#FFB3C1', '#82D1C1'],
    features: ['Ultra-soft modal & bamboo blend', 'Elastic flat-toe cozy seams', 'Embroidered detailing', 'Perfect gift bundle fit'],
    backstory: 'Pamper your feet with absolute softness. Stitched with cute blushing sakura blossoms, they are the finest companion for tea ceremonies at your personal desk.'
  },
  {
    id: 'cozy-desk-light',
    title: '🌸 Cozy Peach-Blossom Desktop Neon Light',
    character: 'Momo Kitten',
    franchise: 'Koji Studio',
    price: 29.00,
    description: 'An incredibly comforting, warm blushing peach LED desk neon lamp that casts a magical sweet pastel glow in study bays or vanity tables. Powered via standard USB.',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    tag: 'Cozy Light',
    rating: 4.9,
    reviewsCount: 21,
    category: 'cozy',
    vibe: 'cozy',
    colors: ['#FFB3C1', '#FFEBB3'],
    features: ['Low-voltage safe soft silicone neon LED', 'USB powered with toggling inline dimmer switch', 'Dual mounting hook slots or easel base', 'Includes mini sheet of glossy cherry stickers'],
    backstory: 'Cast a dreamy fairytale shadow onto your workstation or nightstand! Handcrafted in the shape of a cute blushing peach kitten under a starry night halo.'
  },
  {
    id: 'cozy-pencil-case',
    title: '🧁 Fluffy Hello Kitty Cozy Pencil Case',
    character: 'Strawberry Kitty',
    franchise: 'Koji Studio',
    price: 14.50,
    description: 'Delightfully soft corduroy bubble pouch decorated with tiny embroidered ribbons and pastel buttons. Excellent for pens, washi tapes, or cosmetics.',
    imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=600',
    tag: 'Fairy Pouch',
    rating: 4.8,
    reviewsCount: 15,
    category: 'cozy',
    vibe: 'dreamy',
    colors: ['#FDFBF7', '#FFB3C1'],
    features: ['Made of double-stitched cotton corduroy', 'Charming custom floral brass zipper pull', 'Expands to hold over 24 pens and scissors', 'Interior mesh divider for sticker storage'],
    backstory: 'Perfect for school, college, or sketching trips! Designed in standard cream and strawberry pink to keep your favorite drawing supplies safe and ultra-cute.'
  },
  {
    id: 'cozy-ramen-mug',
    title: '🍥 Whirlwind Ramen Cat Ceramic Mug',
    character: 'Naruto Neko',
    franchise: 'Koji Studio',
    price: 18.50,
    description: 'A thick-walled retro ceramic mug shaped like a cute steaming ramen bowl, complete with a tiny cat ear stirrer spoon and lid to keep cocoa hot.',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    tag: 'Warm Cocoa',
    rating: 5.0,
    reviewsCount: 34,
    category: 'cozy',
    vibe: 'nostalgia',
    colors: ['#FFEAA7', '#82D1C1'],
    features: ['380ml capacity robust stoneware ceramic', 'Includes matching ceramic cat-ear lid and spoon', 'Microwave and dishwasher safe high-fire clay', 'Thermal heat preservation handle outline'],
    backstory: 'Steaming with absolute comfort and nostalgic warmth! Enjoy your evening matcha latte or rich milk tea while studying next to your cute desk setup.'
  },
  {
    id: 'stationery-journal-peach',
    title: '🌸 Peach Milk Dream Hardcover Journal',
    character: 'Peach Bunny',
    franchise: 'Koji Studio',
    price: 18.00,
    description: 'An elegant, gold-pressed hardcover bullet journal with heavy 120gsm cream dot-grid pages. Features soft strawberry-pink bookmarks and pocket dividers.',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600',
    tag: 'Premium Paper',
    rating: 4.9,
    reviewsCount: 28,
    category: 'stationery',
    vibe: 'dreamy',
    colors: ['#FFB3C1', '#FFEAA7'],
    features: ['160 numbered thick cream pages, ghost-free', 'Matte vegan leather cover with gold-foil ribbons', 'Lay-flat bookbinding for painless sketching', 'Expandable secret utility pocket in the back'],
    backstory: 'A luxurious journal designed to collect your morning aesthetic sketches, poetry dreams, and cozy daily planners. Hand-crafted in pastel blush shades.'
  },
  {
    id: 'stationery-sticker-pack',
    title: '🧁 Kawaii Cafe Chibi Glossy Sticker Set',
    character: 'Café Kitties',
    franchise: 'Koji Studio',
    price: 8.50,
    description: 'A pocket-sized vinyl folder containing 18 die-cut stickers printed on super thick water-resistant glossy paper. Highlights holographic glitter and peach linings.',
    imageUrl: 'https://images.unsplash.com/photo-1572375995501-4b0894dbe154?auto=format&fit=crop&q=80&w=600',
    tag: 'Cute Details',
    rating: 5.0,
    reviewsCount: 42,
    category: 'stationery',
    vibe: 'cozy',
    colors: ['#FFB3C1', '#82D1C1'],
    features: ['18 unique illustrations per deluxe pocket bundle', 'Premium thick vinyl with glass-glitter holographic finish', 'Waterproof, scratch-resistant, UV-falking-proof', 'Super clean residue-free easy peeling backing'],
    backstory: 'Perfect for plastering your laptop, water flask, phone, or journal! Each adorable kitty is enjoying a cup of iced strawberry latte or warm dango skewers.'
  },
  {
    id: 'stationery-washi-tape',
    title: '🍵 Retro Matcha Tea Party Washi Tape Trio',
    character: 'Matcha Friends',
    franchise: 'Koji Studio',
    price: 9.50,
    description: 'Three rolls of exquisite Japanese rice paper tape, beautifully illustrated with dango sticks, matcha kettles, and cozy cherry blossoms. Includes gold foil accents!',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600',
    tag: 'Eco Craft',
    rating: 4.8,
    reviewsCount: 19,
    category: 'stationery',
    vibe: 'nostalgia',
    colors: ['#82D1C1', '#FFEAA7'],
    features: ['Three coordinate widths: 10mm, 15mm, and 20mm', 'Made from 100% natural Japanese Washi fibers', 'Glittering hot-stamped gold foil edge gilding', 'Repositionable and easy to rip without scissors'],
    backstory: 'Add a whimsical border of vintage tea ceremonies to your stationery letters, bullet journals, or gift wrappings. Truly coordinates with matcha aesthetic!'
  },
  {
    id: 'plush-peach-kitty',
    title: '🎀 Peach Kitty Fluffy Jumbo Plushie',
    character: 'Momo Peach Kitty',
    franchise: 'Koji Studio',
    price: 34.00,
    description: 'An incredibly soft, marshmallow-textured jumbo cuddle plush featuring Momo Kitty wearing a satin strawberry pink ribbon. Crafted with super dense velboa fur.',
    imageUrl: 'https://images.unsplash.com/photo-1559251606-c623743a6d76?auto=format&fit=crop&q=80&w=600',
    tag: 'Cloud Soft',
    rating: 5.0,
    reviewsCount: 56,
    category: 'plush',
    vibe: 'dreamy',
    colors: ['#FFB3C1', '#FDFBF7'],
    features: ['Premium premium elastic down-cotton stuffing', 'Double-stitched safety seams for maximum cuddling', 'Features adorable hand-stitched blush details', 'Includes Certificate of Adoption card'],
    backstory: 'Momo Kitty loves nothing more than reading warm mangas under peach trees. Hand-stuffed to make the plush feel exactly like a warm, squishy, fluffy marshmallow cloud!'
  },
  {
    id: 'plush-matcha-shiba',
    title: '🍵 Cozy Matcha Roll Shiba Hugging Cushion',
    character: 'Shiba Roll',
    franchise: 'Koji Studio',
    price: 28.00,
    description: 'A cylindrical, super-squishy hug-pillow shaped like a sweet Japanese matcha swiss roll, complete with a round happy Shiba Inu face peaking out!',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600',
    tag: 'Hug Size',
    rating: 4.9,
    reviewsCount: 38,
    category: 'plush',
    vibe: 'cozy',
    colors: ['#82D1C1', '#FFEAA7'],
    features: ['Removable matcha shell for easy washing', 'Anti-clump premium high-density siliconized fiberfill', 'Perfect length for side sleepers or desk headrests', 'Beautifully embroidered cherry blossom on the back'],
    backstory: 'Shiba Roll fell asleep in the bakery ovens and woke up wrapped in sweet matcha cotton! This ultra-comfortable pillow reduces tension and spreads green tea vibes.'
  },
  {
    id: 'plush-strawberry-chibi',
    title: '🧁 Chibi Strawberry Bunny Keychain Mascot',
    character: 'Strawberry Usagi',
    franchise: 'Koji Studio',
    price: 15.00,
    description: 'A handheld chibi pocket plush keychain. Usagi wears a miniature hand-knitted strawberry-pattern crown and carries a tiny felt tea tray.',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=600',
    tag: 'Staff Favorite',
    rating: 4.8,
    reviewsCount: 47,
    category: 'plush',
    vibe: 'nostalgia',
    colors: ['#FFB3C1', '#FF8097'],
    features: ['Secured with a premium rose-gold star clasp', 'High-detailed custom embroidered chibi blush cheeks', '100% hypoallergenic organic outer fibers', 'Comes with a matching holographic acrylic charm'],
    backstory: 'This tiny bunny travels inside your tote bag or backpack, offering moral support during tests, coffee run meetings, and study hours at the library.'
  }
];

export const APPAREL_SIZE_OPTIONS: SizeOption[] = [
  { value: 'XS', label: '🌸 Chibi XS Fit', dimensions: 'Pit-to-pit 18", Length 25"', priceModifier: 0 },
  { value: 'S', label: '🎀 Kawaii S Fit', dimensions: 'Pit-to-pit 20", Length 26"', priceModifier: 0 },
  { value: 'M', label: '🌸 Comfy M Fit', dimensions: 'Pit-to-pit 22", Length 27"', priceModifier: 0 },
  { value: 'L', label: '🎀 Oversized L Fit', dimensions: 'Pit-to-pit 24", Length 28"', priceModifier: 0 },
  { value: 'XL', label: '👑 Oversized XL Fit', dimensions: 'Pit-to-pit 26", Length 30"', priceModifier: 4 },
  { value: 'XXL', label: '👑 Jumbo XXL Fit', dimensions: 'Pit-to-pit 28", Length 32"', priceModifier: 8 }
];

export const APPAREL_FRAME_OPTIONS: FrameOption[] = [
  { value: 'NONE', label: '🌸 Simple Eco Kraft Sleeve', priceModifier: 0, hex: 'transparent' },
  { value: 'STRAWBERRY_PINK', label: '🍓 Velvet Strawberry Gift Box', priceModifier: 6, hex: '#FFB3C1' }
];

export const APPAREL_COLOR_OPTIONS = [
  { value: 'White', label: '🤍 Starry White', hex: '#FFFFFF' },
  { value: 'Black', label: '🖤 Midnight Black', hex: '#1A1A1A' },
  { value: 'Navy', label: '💙 Dreamy Navy', hex: '#1B2E4E' },
  { value: 'Grey', label: '🩶 Cozy Grey', hex: '#8E909A' }
];

export const COZY_SIZE_OPTIONS: SizeOption[] = [
  { value: 'A5_MINI', label: '🌸 Standard Studio Pack', dimensions: 'Single piece with collection sticker', priceModifier: 0 },
  { value: 'A4_MEDIUM', label: '🧸 Cozy Gift Bundle Set', dimensions: 'Includes matching sticker card & wrapping', priceModifier: 6 }
];

export const COZY_FRAME_OPTIONS: FrameOption[] = [
  { value: 'NONE', label: '🌸 Eco Muted Kraft Cover', priceModifier: 0, hex: 'transparent' },
  { value: 'MUTED_MINT', label: '🍵 Pastel Mint Matcha wrapping', priceModifier: 4, hex: '#82D1C1' }
];

export const STATIONERY_SIZE_OPTIONS: SizeOption[] = [
  { value: 'A5_MINI', label: '🌸 Standard Studio Pack', dimensions: 'Single piece with themed card', priceModifier: 0 },
  { value: 'A4_MEDIUM', label: '🎀 Deluxe Journaling Bundle', dimensions: 'Includes matching sticker card & ribbon wrap', priceModifier: 5 }
];

export const STATIONERY_FRAME_OPTIONS: FrameOption[] = [
  { value: 'NONE', label: '🌸 Glassine Eco Envelope', priceModifier: 0, hex: 'transparent' },
  { value: 'STRAWBERRY_PINK', label: '🧁 Pastel Pink Organza Tie Bag', priceModifier: 3, hex: '#FFB3C1' }
];

export const PLUSH_SIZE_OPTIONS: SizeOption[] = [
  { value: 'A5_MINI', label: '🌸 Classic Mini Mascot keychain (10cm)', dimensions: 'Pocket size with gold star-keychain clasp', priceModifier: 0 },
  { value: 'A4_MEDIUM', label: '🧸 Hug-size Companion (30cm)', dimensions: 'Fluffy round size, standard comfort', priceModifier: 12 },
  { value: 'A3_LARGE', label: '👑 Jumbo Cozy Snuggle (50cm)', dimensions: 'Giant squishy plush with high-end matching bow', priceModifier: 24 }
];

export const PLUSH_FRAME_OPTIONS: FrameOption[] = [
  { value: 'NONE', label: '🌸 Transparent Eco Dustbag', priceModifier: 0, hex: 'transparent' },
  { value: 'STRAWBERRY_PINK', label: '🍓 Premium Gift Box & Cherry Ribbon', priceModifier: 6, hex: '#FFB3C1' }
];

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Mochi_Muffin 🍡',
    rating: 5,
    comment: 'The Nezuko print is even more beautiful in person! The textured cream paper feels like a luxury sketch pad, and the solid mint outline looks so retro-pop. Perfectly packaged and arrived safely in a sturdy tube! 💖',
    date: 'May 12, 2026',
    emoji: 'star-eyed'
  },
  {
    id: 'rev-2',
    name: 'Katsu_Guy 🔥',
    rating: 5,
    comment: 'UMAI! The Rengoku print is incredibly cute! The flat pop-art shadow is so striking in my gaming room. I bought the Muted Mint Wood frame and they look premium. 10/10 will buy the Naruto print next!',
    date: 'April 28, 2026',
    emoji: 'excited'
  },
  {
    id: 'rev-3',
    name: 'Yuki_Usagi 🌸',
    rating: 4,
    comment: 'The strawberry sweater is so oversized and cozy, literally feels like a soft cloud. Combining Princess Mononoke with Hello Kitty is a genius concept, the colors are dreamy! ✨',
    date: 'May 06, 2026',
    emoji: 'happy'
  },
  {
    id: 'rev-4',
    name: 'Neko_Sensei 🐾',
    rating: 5,
    comment: 'Absolutely obsessed with the Bayonetta print! The dark lines paired with retro-pastel pink makes it feel very high-end and artistic. Beautiful addition to my studio.',
    date: 'May 15, 2026',
    emoji: 'shy'
  }
];

export const SIZE_OPTIONS: SizeOption[] = [
  { value: 'A5_MINI', label: '🌸 A5 Mini Desk Print', dimensions: '5.8" x 8.3" (14.8 x 21cm)', priceModifier: 0 },
  { value: 'A4_MEDIUM', label: '🎀 A4 Room Display', dimensions: '8.3" x 11.7" (21 x 29.7cm)', priceModifier: 8 },
  { value: 'A3_LARGE', label: '👑 A3 Statement Poster', dimensions: '11.7" x 16.5" (29.7 x 42cm)', priceModifier: 18 }
];

export const FRAME_OPTIONS: FrameOption[] = [
  { value: 'NONE', label: '🖼️ Unframed (Art Print Only)', priceModifier: 0, hex: 'transparent' },
  { value: 'MUTED_MINT', label: '🌿 Muted Mint Pastel Wood Frame', priceModifier: 14, hex: '#82D1C1' },
  { value: 'STRAWBERRY_PINK', label: '🍓 Strawberry Milk Pastel Wood Frame', priceModifier: 14, hex: '#FFB3C1' },
  { value: 'CREAM_WOOD', label: '🪵 Soft Cream Natural Wood Frame', priceModifier: 12, hex: '#F0E6D2' }
];

export const VIBE_DESCRIPTIONS = {
  dreamy: { name: 'Dreamy Pastel', emoji: '☁️', desc: 'Soft pastel pinks and creams for an comforting, cloud-like atmosphere.' },
  nostalgia: { name: 'Soft Nostalgia', emoji: '📻', desc: 'Vibrant warming tones and retro clouds evoking childhood and classic anime.' },
  cozy: { name: 'Whimsical Cozy', emoji: '🏡', desc: 'Cozy combinations that bring absolute calm, comfort, and sweet daily blushes.' },
  fierce: { name: 'Fierce Kawaii', emoji: '⚔️', desc: 'Powerful character personalities rendered with beautiful line accents and bold cute companion dynamics.' }
};

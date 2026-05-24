import React, { useState, useEffect } from 'react';
import { Product, CartItem, CustomerReview, PrintSize, FrameColor } from './types';
import { PRODUCTS, INITIAL_REVIEWS, VIBE_DESCRIPTIONS } from './data';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import AiMatchmaker from './components/AiMatchmaker';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Heart,
  Search,
  Sparkles,
  ArrowUp,
  Check,
  Instagram,
  Twitter,
  Star,
  MessageCircle,
  Percent,
  MapPin,
  Trash2,
  X,
  Shirt,
  Scissors
} from 'lucide-react';

export default function App() {
  // Navigation & Catalog filter states
  const [theme, setTheme] = useState<'default' | 'pastel-magic'>(() => {
    try {
      const saved = localStorage.getItem('koji-theme');
      return (saved as 'default' | 'pastel-magic') || 'default';
    } catch {
      return 'default';
    }
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('koji_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('koji_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'prints' | 'apparel' | 'accessories' | 'cozy' | 'stationery' | 'plush'>('all');
  const [selectedVibe, setSelectedVibe] = useState<'all' | 'dreamy' | 'cozy' | 'fierce' | 'nostalgia'>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low-high' | 'price-high-low' | 'rating'>('popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviews, setReviews] = useState<CustomerReview[]>(INITIAL_REVIEWS);
  const [reviewReactions, setReviewReactions] = useState<Record<string, Record<string, number>>>(() => {
    try {
      const saved = localStorage.getItem('koji_review_reactions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Decorative & Alert States
  const [showPromoPopup, setShowPromoPopup] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Global guestbook states
  const [guestName, setGuestName] = useState('');
  const [guestText, setGuestText] = useState('');
  const [guestRating, setGuestRating] = useState(5);
  const [guestEmoji, setGuestEmoji] = useState<'happy' | 'excited' | 'star-eyed' | 'shy'>('happy');
  const [guestSuccess, setGuestSuccess] = useState(false);

  // Printify Print-On-Demand States
  const [printifyProducts, setPrintifyProducts] = useState<Product[]>([]);
  const [printifySyncStatus, setPrintifySyncStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [printifyMessage, setPrintifyMessage] = useState<string>('');

  const handleForceSync = async () => {
    setPrintifySyncStatus('loading');
    setPrintifyMessage('Connecting securely to Printify servers...');
    try {
      const res = await fetch('/api/printify/products');
      if (!res.ok) {
        throw new Error(`Server errors with status ${res.status}`);
      }
      const data = await res.json();
      if (data && data.products) {
        setPrintifyProducts(data.products);
        if (data.status === 'connected') {
          setPrintifySyncStatus('success');
          setPrintifyMessage(`Successfully loaded ${data.products.length} custom products from your Printify shop!`);
          triggerToast('🌻 Printify catalog synced successfully!');
        } else {
          setPrintifySyncStatus('idle');
          setPrintifyMessage(data.message || 'Printify is unconfigured.');
        }
      } else {
        setPrintifySyncStatus('error');
        setPrintifyMessage(data.message || 'Failed to parse products.');
      }
    } catch (err: any) {
      console.error("Error manual syncing Printify products:", err);
      setPrintifySyncStatus('error');
      setPrintifyMessage(err.message || 'Failed to connect to backend server api.');
      triggerToast('❌ Printify sync failed');
    }
  };

  useEffect(() => {
    const fetchPrintifyProducts = async () => {
      setPrintifySyncStatus('loading');
      setPrintifyMessage('Connecting securely to Printify servers...');
      try {
        const res = await fetch('/api/printify/products');
        if (!res.ok) {
          throw new Error(`Server answered with status ${res.status}`);
        }
        const data = await res.json();
        if (data && data.products) {
          setPrintifyProducts(data.products);
          if (data.status === 'connected') {
            setPrintifySyncStatus('success');
            setPrintifyMessage(data.message || `Loaded ${data.products.length} custom products!`);
          } else {
            setPrintifySyncStatus('idle');
            setPrintifyMessage(data.message || 'Printify is unconfigured.');
          }
        } else {
          setPrintifySyncStatus('error');
          setPrintifyMessage(data.message || 'Failed to parse products.');
        }
      } catch (err: any) {
        console.error("Error loading products:", err);
        setPrintifySyncStatus('error');
        setPrintifyMessage(err.message || 'Error connecting to Printify API.');
      }
    };
    fetchPrintifyProducts();
  }, []);

  // Decorative falling cherry blossoms coords
  const [sakuraPetals, setSakuraPetals] = useState<{ id: number; left: number; top: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate lovely falling cherry blossom coordinates
    const petals = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 92, // % width
      top: -Math.random() * 40 - 20, // offset top px
      delay: Math.random() * 10 // scale delay in seconds
    }));
    setSakuraPetals(petals);

    // Scroll listener for Top Back tracking
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Sync variables to local storage
  useEffect(() => {
    localStorage.setItem('koji_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('koji_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('koji_review_reactions', JSON.stringify(reviewReactions));
  }, [reviewReactions]);

  // Show customized cute Toast Alerts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: Product, size: PrintSize = 'A4_MEDIUM', frame: FrameColor = 'NONE', quantity: number = 1, color?: string) => {
    const cartId = color ? `${product.id}-${size}-${frame}-${color}` : `${product.id}-${size}-${frame}`;
    
    setCartItems(prev => {
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        triggerToast(`🌸 Updated ${product.character} quantity in your bag!`);
        return prev.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + quantity } : item);
      }
      const itemLabel = product.category === 'apparel' 
        ? `${product.character} apparel (${color || 'White'})`
        : `${product.character} art print`;
      triggerToast(`🛍️ Added ${itemLabel} to your bag!`);
      return [...prev, { cartId, product, size, frame, color, quantity }];
    });
  };

  // Quick Add handler on cards - defaults to A4_MEDIUM, unframed, 1 qty
  const handleQuickAdd = (product: Product) => {
    handleAddToCart(product, 'A4_MEDIUM', 'NONE', 1, product.category === 'apparel' ? 'White' : undefined);
  };

  const handleUpdateCartQuantity = (cartId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleUpdateCartCustomization = (cartId: string, size: PrintSize, frame: FrameColor, color?: string) => {
    setCartItems(prev => {
      const targetItem = prev.find(item => item.cartId === cartId);
      if (!targetItem) return prev;

      const mergedColor = color !== undefined ? color : targetItem.color;
      const newCartId = mergedColor ? `${targetItem.product.id}-${size}-${frame}-${mergedColor}` : `${targetItem.product.id}-${size}-${frame}`;
      const existingCollision = prev.find(item => item.cartId === newCartId && item.cartId !== cartId);

      if (existingCollision) {
        // Merge quantities and remove the original
        return prev.filter(item => item.cartId !== cartId).map(item => {
          if (item.cartId === newCartId) {
            return { ...item, quantity: item.quantity + targetItem.quantity };
          }
          return item;
        });
      }

      return prev.map(item => {
        if (item.cartId === cartId) {
          return { ...item, cartId: newCartId, size, frame, color: mergedColor };
        }
        return item;
      });
    });
    triggerToast('✨ Updated item details in your bag!');
  };

  const handleRemoveCartItem = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
    triggerToast('🗑️ Item removed from shopping bag');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist actions
  const handleToggleWishlist = (product: Product) => {
    const inWishlist = wishlist.some(item => item.id === product.id);
    if (inWishlist) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      triggerToast('🌸 Removed from wishlist');
    } else {
      setWishlist(prev => [...prev, product]);
      triggerToast('💖 Added to your magical wishlist!');
    }
  };

  // Add customized customer review in component state
  const handleAddReview = (newReview: Omit<CustomerReview, 'id' | 'date'>) => {
    const fresh: CustomerReview = {
      ...newReview,
      id: `rev-gen-${Date.now()}`,
      date: 'Today'
    };
    setReviews(prev => [fresh, ...prev]);
    triggerToast('✨ Thank you for leaving your starry review!');
  };

  const handleAddGuestbookEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestText.trim()) return;

    const fresh: CustomerReview = {
      id: `rev-guest-${Date.now()}`,
      name: `${guestName} 🌸`,
      rating: guestRating,
      comment: guestText,
      date: 'Today',
      emoji: guestEmoji
    };

    setReviews(prev => [fresh, ...prev]);
    setGuestName('');
    setGuestText('');
    setGuestSuccess(true);
    triggerToast('📝 Sweet! Shared with our fairytale community!');
    setTimeout(() => setGuestSuccess(false), 3000);
  };

  const handleReactToReview = (reviewId: string, emoji: string) => {
    setReviewReactions(prev => {
      const reviewMap = prev[reviewId] || {};
      const newCount = (reviewMap[emoji] || 0) + 1;
      return {
        ...prev,
        [reviewId]: {
          ...reviewMap,
          [emoji]: newCount
        }
      };
    });
    triggerToast(`💞 Reacted with ${emoji}!`);
  };

  // Filter & Sort core display logic with support for synchronized Printify collections!
  const allProducts = [...PRODUCTS, ...printifyProducts];

  const filteredProducts = allProducts.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesVibe = selectedVibe === 'all' || p.vibe === selectedVibe;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.character.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.franchise.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesVibe && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low-high') return a.price - b.price;
    if (sortBy === 'price-high-low') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // popular
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div id="app-root-container" className="min-h-screen bg-[#FDFBF7] flex flex-col relative w-full overflow-x-hidden">
      
      {/* Decorative Header Banner Sparkle */}
      <div id="promo-top-ticker" className="bg-[#FFB3C1] text-charcoal border-b-2 border-[#2B2D31] text-[10px] sm:text-[11px] py-1.5 px-6 sm:px-4 font-mono font-bold tracking-wider text-center flex flex-wrap items-center justify-center gap-1 sm:gap-3 select-none relative z-45 pr-12">
        <span className="flex items-center gap-1 flex-wrap justify-center text-center">🌸 USE CUPON <strong className="bg-[#FDFBF7] px-1.5 py-0.2 rounded border border-[#2B2D31] text-xs">KAWAII10</strong> FOR 10% OFF COZY ORDERS!</span>
        <span className="hidden md:inline">• FREE SHIPPING ON BUNDLES! •</span>
        <button
          id="btn-ticker-close"
          onClick={() => {
            const tk = document.getElementById('promo-top-ticker');
            if (tk) tk.style.display = 'none';
          }}
          className="text-charcoal/50 hover:text-charcoal cursor-pointer absolute right-3 text-xs font-bold font-mono"
        >
          [x]
        </button>
      </div>

      {/* Sticky Main Header Navigation */}
      <header id="site-header" className="sticky top-0 bg-[#FDFBF7]/95 backdrop-blur-xs border-b-2 border-[#2B2D31] z-40 select-none w-full flex flex-col">
        {/* Row 1: Logo & Global Controls */}
        <div className="py-2.5 px-3 sm:px-4 md:px-8 flex justify-between items-center w-full">
          {/* Left Side: Brand Logo */}
          <div id="brand-logo-container" className="flex items-center gap-1.5 sm:gap-2 cursor-pointer" onClick={() => {
            setSelectedCategory('all');
            setSelectedVibe('all');
            scrollToSection('app-root-container');
          }}>
            <span className="h-8 w-8 sm:h-9 sm:w-9 bg-[#FFB3C1] border-2 border-[#2B2D31] rounded-full flex items-center justify-center text-lg sm:text-xl shadow-[1.5px_1.5px_0px_0px_#2B2D31] sm:shadow-[2px_2px_0px_0px_#2B2D31] select-none hover:rotate-12 transition-transform duration-200">
              💮
            </span>
            <div>
              <h1 className="font-display font-bold text-xs sm:text-base leading-none text-charcoal tracking-tight flex items-center gap-1">
                koji.studio <Sparkles className="h-2.5 w-2.5 text-pink-dark fill-pink-dark animate-pulse hidden xs:inline" />
              </h1>
              <p className="text-[7.5px] sm:text-[9px] font-mono tracking-widest uppercase font-bold text-[#FF8097] leading-none mt-0.5">
                Retro Kawaii Prints
              </p>
            </div>
          </div>

          {/* Right Side Control Bar */}
          <div id="nav-controls" className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Theme Switcher Toggle */}
            <button
              id="btn-theme-toggle"
              onClick={() => {
                const nextTheme = theme === 'default' ? 'pastel-magic' : 'default';
                setTheme(nextTheme);
                localStorage.setItem('koji-theme', nextTheme);
                document.documentElement.setAttribute('data-theme', nextTheme);
              }}
              className="flex items-center gap-1 sm:gap-2 px-1.5 py-1 sm:px-2.5 sm:py-1.5 bg-white border-2 border-[#2B2D31] rounded-full hover:bg-cream cursor-pointer transition-all shadow-[1.5px_1.5px_0px_0px_#2B2D31] sm:shadow-[2px_2px_0px_0px_#2B2D31] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#2B2D31] select-none"
              title="Switch Theme Color Palette"
            >
              <span className="hidden md:inline text-[10px] sm:text-xs font-bold leading-none font-sans text-charcoal/85">
                {theme === 'default' ? '🌸 Yellow & Mint' : '🔮 Blue & Lavender'}
              </span>
              <span className="md:hidden text-[10px] font-bold leading-none font-sans text-charcoal/85 px-0.5" title="Palette color toggle">
                🎨
              </span>
              <div className={`w-6 sm:w-8 h-3.5 sm:h-4 rounded-full border border-charcoal/35 p-0.5 flex items-center transition-all duration-300 ${theme === 'pastel-magic' ? 'bg-[#D5C9FF]' : 'bg-[#82D1C1]'}`}>
                <div className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-white border border-charcoal/50 shadow-xs transition-transform duration-300 ${theme === 'pastel-magic' ? 'translate-x-2 sm:translate-x-3.5' : 'translate-x-0'}`} />
              </div>
            </button>

            {/* Heart Wishlist Trigger */}
            <button
              id="btn-nav-wishlist"
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 sm:p-2.5 bg-white border-2 border-[#2B2D31] rounded-full hover:bg-cream cursor-pointer transition-all shadow-[1.5px_1.5px_0px_0px_#FFB3C1] sm:shadow-[2px_2px_0px_0px_#FFB3C1] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#FFB3C1]"
            >
              <Heart className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#FF8097] fill-current" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#82D1C1] text-[#2B2D31] text-[8px] sm:text-[9px] font-mono font-bold border border-[#2B2D31] px-1 rounded-full">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Bag Drawer Trigger */}
            <button
              id="btn-nav-cart"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 px-2.5 sm:p-2.5 sm:px-3.5 bg-[#82D1C1] hover:bg-[#59C1AF] border-2 border-[#2B2D31] rounded-full cursor-pointer transition-all shadow-[1.5px_1.5px_0px_0px_#2B2D31] sm:shadow-[2.5px_2.5px_0px_0px_#2B2D31] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#2B2D31] flex items-center gap-1"
            >
              <ShoppingBag className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-charcoal" />
              <span className="hidden sm:inline font-display font-bold text-xs">
                ${cartItems.reduce((acc, item) => {
                  let extra = 0;
                  if (item.product.category === 'prints') {
                    extra += (item.size === 'A4_MEDIUM' ? 8 : item.size === 'A3_LARGE' ? 18 : 0);
                    extra += (item.frame !== 'NONE' ? 14 : 0);
                  } else if (item.product.category === 'apparel') {
                    extra += (item.size === 'A4_MEDIUM' ? 4 : item.size === 'A3_LARGE' ? 8 : 0);
                    extra += (item.frame === 'STRAWBERRY_PINK' ? 6 : 0);
                  } else if (item.product.category === 'cozy') {
                    extra += (item.size === 'A4_MEDIUM' ? 6 : 0);
                    extra += (item.frame === 'MUTED_MINT' ? 4 : 0);
                  } else if (item.product.category === 'stationery') {
                    extra += (item.size === 'A4_MEDIUM' ? 5 : 0);
                    extra += (item.frame === 'STRAWBERRY_PINK' ? 3 : 0);
                  } else if (item.product.category === 'plush') {
                    extra += (item.size === 'A4_MEDIUM' ? 12 : item.size === 'A3_LARGE' ? 24 : 0);
                    extra += (item.frame === 'STRAWBERRY_PINK' ? 6 : 0);
                  }
                  const s = item.product.price + extra;
                  return acc + (s * item.quantity);
                }, 0).toFixed(2)}
              </span>
              <span className="bg-[#FFB3C1] text-charcoal text-[8px] sm:text-[9px] font-mono font-bold border border-[#2B2D31] px-1 rounded-full leading-none">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            </button>
          </div>
        </div>

        {/* Row 2: Persistent Shop Navigation Sub-header (Desktop & Mobile Friendly, Horizontally Scrollable without scrollbars) */}
        <div id="sticky-sub-nav" className="border-t border-[#2B2D31]/10 bg-[#FDFBF7] py-2 px-3 sm:px-4 md:px-8 w-full flex items-center justify-start sm:justify-center overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth">
          <nav className="flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap py-0.5">
            {[
              { id: 'all', label: 'All Items', icon: '🌟' },
              { id: 'prints', label: 'Art Prints', icon: '🎨' },
              { id: 'apparel', label: 'Apparel', icon: '👚' },
              { id: 'accessories', label: 'Accessories', icon: '🎀' },
              { id: 'cozy', label: 'Cozy Goods', icon: '🧸' },
              { id: 'stationery', label: 'Stationery', icon: '📇' },
              { id: 'plush', label: 'Plushies', icon: '🧸' }
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  id={`sub-nav-cat-${cat.id}`}
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    scrollToSection('prints-shop-section');
                  }}
                  className={`px-2.5 py-1 text-[10.5px] sm:text-xs font-bold font-sans uppercase tracking-wider rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#82D1C1]/90 text-charcoal border-[#2B2D31] shadow-[1.5px_1.5px_0px_0px_#2B2D31] translate-y-[-0.5px]'
                      : 'bg-white/80 text-charcoal/70 border-[#2B2D31]/15 hover:border-charcoal hover:text-charcoal'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
            
            {/* Guestbook direct jump link in sticky menu */}
            <button
              id="sub-nav-reviews-jump"
              onClick={() => scrollToSection('customer-guestbook-section')}
              className="px-2.5 py-1 text-[10.5px] sm:text-xs font-bold font-sans uppercase tracking-wider rounded-lg border bg-white/80 text-charcoal/70 border-[#2B2D31]/15 hover:border-charcoal hover:text-charcoal cursor-pointer flex items-center gap-1.5"
            >
              <span className="text-xs">💭</span>
              <span>Guestbook</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
        
        {/* Hero Section */}
        <section
          id="hero-banner"
          className="relative rounded-3xl border-2 border-[#2B2D31] bg-[#FDFBF7] p-6 md:p-12 overflow-hidden shadow-[6px_6px_0px_0px_#2B2D31] flex flex-col md:flex-row justify-between items-center gap-8 grid-bg"
        >
          {/* Cherry Blossom Petals Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {sakuraPetals.map((pet) => (
              <div
                key={pet.id}
                className="cherry-blossom"
                style={{
                  left: `${pet.left}%`,
                  top: `${pet.top}px`,
                  animationDelay: `${pet.delay}s`,
                  animationDuration: `${10 + Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          {/* Left Hero Details */}
          <div className="flex-1 space-y-5 text-left z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#FFB3C1] text-[#2B2D31] text-[10px] uppercase font-mono font-bold border border-[#2B2D31] px-3 py-1 rounded-md shadow-[1.5px_1.5px_0px_0px_#2B2D31]">
              🌸 Kawaii Dreams Come True
            </span>
            
            <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight text-charcoal">
              Cozy Retro <span className="text-pink-dark font-display">Pastel Anime</span> Art Prints & Merch
            </h1>
            
            <p className="text-xs md:text-sm text-charcoal/80 max-w-lg leading-relaxed">
              Discover our enchantingly curated collection of beloved anime heroes holding sweet Hello Kitty plush toys. Crafted with warm milky cream finishes, hand-drawn fine charcoal borders, and bright nostalgia to bring absolute joy to your room!
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                id="btn-hero-cta"
                onClick={() => scrollToSection('prints-shop-section')}
                className="px-6 py-3 bg-[#82D1C1] hover:bg-[#59C1AF] font-bold text-xs rounded-xl border border-[#2B2D31] shadow-[3.5px_3.5px_0px_0px_#2B2D31] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[2px_2px_0px_0px_#2B2D31] transition-all cursor-pointer flex items-center gap-1"
              >
                Shop Collection <ShoppingBag className="h-4 w-4" />
              </button>
              <button
                id="btn-hero-match"
                onClick={() => {
                  const aiBtn = document.getElementById('btn-ai-launcher');
                  if (aiBtn) aiBtn.click();
                }}
                className="px-6 py-3 bg-white hover:bg-[#FFB3C1]/20 font-bold text-xs rounded-xl border border-[#2B2D31] shadow-[3.5px_3.5px_0px_0px_#2B2D31] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[2px_2px_0px_0px_#2B2D31] transition-all cursor-pointer flex items-center gap-1.5"
              >
                Find My Aesthetic Vibe <Sparkles className="h-4 w-4 text-[#FF8097]" />
              </button>
            </div>
          </div>

          {/* Right Hero Collage / Cute Framed Preview */}
          <div className="relative flex-shrink-0 w-full max-w-[280px] md:max-w-[345px] aspect-[4/3] bg-[#FFB3C1]/10 border-2 border-[#2B2D31] rounded-2xl p-4 flex items-center justify-center shadow-[4px_4px_0px_0px_#82D1C1] z-10 select-none">
            {/* Visual stacked prints */}
            <div className="absolute top-2 left-4 h-full w-[80%] bg-white border border-charcoal rounded-xl rotate-[-4deg] opacity-60"></div>
            <div className="absolute top-1 right-2 h-full w-[80%] bg-cream border border-charcoal rounded-xl rotate-[2deg] opacity-70"></div>
            
            {/* Main display card */}
            <div className="relative aspect-[3/4] max-w-[190px] border-2 border-charcoal rounded-xl overflow-hidden shadow-[2.5px_2.5px_0px_0px_#2B2D31]">
              <img
                src="/src/assets/images/nezuko_print_1779216079613.png"
                alt="Nezuko print preview"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-[#82D1C1] text-[#2B2D31] text-[8px] font-bold border border-[#2B2D31] px-1 rounded">
                🌸 SIGNATURE EDITION
              </span>
            </div>
            {/* Ribbon banner decoration */}
            <div className="absolute -bottom-2 -rotate-1 bg-[#FDFBF7] text-[9.5px] text-[#2B2D31] font-bold border border-[#2B2D31] px-3.5 py-1.5 rounded-md shadow-md">
              🎗️ Giclée Archival Acid-Free Paper
            </div>
          </div>
        </section>

        {/* Brand Vibe Features Shelf */}
        <section id="aesthetic-vibe-shelf" className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y border-y-2 border-[#2B2D31] bg-[#FDFBF7] py-4 select-none">
          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
            <span className="text-2xl">🌱</span>
            <h3 className="font-display font-bold text-xs">Small Batch Printed</h3>
            <p className="text-[10px] text-charcoal/60">Giclée quality on premium paper</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
            <span className="text-2xl">🧸</span>
            <h3 className="font-display font-bold text-xs">100% Artist Approved</h3>
            <p className="text-[10px] text-charcoal/60">Original kawaii licensing & details</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
            <span className="text-2xl">✉️</span>
            <h3 className="font-display font-bold text-xs">Hand-Stamped Packaging</h3>
            <p className="text-[10px] text-charcoal/60">Sealed with wax & cute fairy stickers</p>
          </div>
          <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
            <span className="text-2xl">🌈</span>
            <h3 className="font-display font-bold text-xs">Custom Pastel Framing</h3>
            <p className="text-[10px] text-charcoal/60">Sturdy cute wood borders configured</p>
          </div>
        </section>

        {/* Core Art Print Storefront Shop */}
        <section id="prints-shop-section" className="space-y-6 pt-4">
          
          {/* Section subtitle headings */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-4 border-[#2B2D31]/15">
            <div>
              <div className="flex items-center gap-1 text-xs text-[#FF8097] font-semibold">
                <span>🍀 OUR COMPLETE PRINTS GALLERY</span>
                <span className="h-1 w-8 bg-[#82D1C1]"></span>
              </div>
              <h2 className="font-display font-bold text-2xl text-[#2B2D31] mt-1">
                Explore The Fairy Collection
              </h2>
            </div>

            {/* In-shelf Search Input */}
            <div className="flex w-full md:w-auto overflow-hidden border-2 border-[#2B2D31] rounded-xl bg-white shadow-[2px_2px_0px_0px_#2B2D31] px-2.5 py-1.5 items-center gap-2">
              <Search className="h-4 w-4 text-charcoal/40" />
              <input
                id="search-shop-input"
                type="text"
                placeholder="Search character (e.g. Naruto)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs text-charcoal bg-transparent outline-none w-full md:w-48 font-medium"
              />
              {searchQuery && (
                <button id="btn-search-clear" onClick={() => setSearchQuery('')} className="p-0.5 hover:bg-cream rounded-full">
                  <X className="h-3.5 w-3.5 text-charcoal/40" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive filters menu */}
          <div id="shop-filters-shelf" className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Left side: Categories Pills */}
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                id="filter-category-all"
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 border border-charcoal font-semibold rounded-xl tracking-wide transition-all cursor-pointer active:scale-95 ${
                  selectedCategory === 'all'
                    ? 'bg-[#82D1C1] text-charcoal shadow-[2px_2px_0px_0px_#2B2D31] font-bold'
                    : 'bg-white hover:bg-cream text-charcoal/70'
                }`}
              >
                🎠 View All ({allProducts.length})
              </button>
              <button
                id="filter-category-prints"
                onClick={() => setSelectedCategory('prints')}
                className={`px-4 py-2 border border-charcoal font-semibold rounded-xl tracking-wide transition-all cursor-pointer active:scale-95 ${
                  selectedCategory === 'prints'
                    ? 'bg-[#82D1C1] text-charcoal shadow-[2px_2px_0px_0px_#2B2D31] font-bold'
                    : 'bg-white hover:bg-cream text-charcoal/70'
                }`}
              >
                🖼️ Giclée Art Prints
              </button>
              <button
                id="filter-category-apparel"
                onClick={() => setSelectedCategory('apparel')}
                className={`px-4 py-2 border border-charcoal font-semibold rounded-xl tracking-wide transition-all cursor-pointer active:scale-95 ${
                  selectedCategory === 'apparel'
                    ? 'bg-[#82D1C1] text-charcoal shadow-[2px_2px_0px_0px_#2B2D31] font-bold'
                    : 'bg-white hover:bg-cream text-charcoal/70'
                }`}
              >
                👚 Cozy Apparel
              </button>
              <button
                id="filter-category-accessories"
                onClick={() => setSelectedCategory('accessories')}
                className={`px-4 py-2 border border-charcoal font-semibold rounded-xl tracking-wide transition-all cursor-pointer active:scale-95 ${
                  selectedCategory === 'accessories'
                    ? 'bg-[#82D1C1] text-charcoal shadow-[2px_2px_0px_0px_#2B2D31] font-bold'
                    : 'bg-white hover:bg-cream text-charcoal/70'
                }`}
              >
                🎀 Accessories
              </button>
              <button
                id="filter-category-cozy"
                onClick={() => setSelectedCategory('cozy')}
                className={`px-4 py-2 border border-charcoal font-semibold rounded-xl tracking-wide transition-all cursor-pointer active:scale-95 ${
                  selectedCategory === 'cozy'
                    ? 'bg-[#82D1C1] text-charcoal shadow-[2px_2px_0px_0px_#2B2D31] font-bold'
                    : 'bg-white hover:bg-cream text-charcoal/70'
                }`}
              >
                🧸 Cozy Desk Goods
              </button>
              <button
                id="filter-category-stationery"
                onClick={() => setSelectedCategory('stationery')}
                className={`px-4 py-2 border border-charcoal font-semibold rounded-xl tracking-wide transition-all cursor-pointer active:scale-95 ${
                  selectedCategory === 'stationery'
                    ? 'bg-[#82D1C1] text-charcoal shadow-[2px_2px_0px_0px_#2B2D31] font-bold'
                    : 'bg-white hover:bg-cream text-charcoal/70'
                }`}
              >
                📇 Stationery & Stickers
              </button>
              <button
                id="filter-category-plush"
                onClick={() => setSelectedCategory('plush')}
                className={`px-4 py-2 border border-charcoal font-semibold rounded-xl tracking-wide transition-all cursor-pointer active:scale-95 ${
                  selectedCategory === 'plush'
                    ? 'bg-[#82D1C1] text-charcoal shadow-[2px_2px_0px_0px_#2B2D31] font-bold'
                    : 'bg-white hover:bg-cream text-charcoal/70'
                }`}
              >
                🧸 Kawaii Plushies
              </button>
            </div>

            {/* Right side: Sorting elements */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex border border-charcoal rounded-xl bg-white px-3 py-1.5 text-xs items-center gap-2">
                <span className="text-[#2B2D31]/50 font-mono font-bold font-display uppercase">📯 VIBE:</span>
                <select
                  id="filter-vibe-select"
                  value={selectedVibe}
                  onChange={(e) => setSelectedVibe(e.target.value as any)}
                  className="bg-transparent font-bold cursor-pointer text-[#2B2D31] outline-none"
                >
                  <option value="all">☁️ All Vibes</option>
                  <option value="dreamy">🌸 Dreamy Pastel</option>
                  <option value="cozy">🏡 Whimsical Cozy</option>
                  <option value="fierce">⚔️ Fierce Kawaii</option>
                  <option value="nostalgia">📻 Soft Nostalgia</option>
                </select>
              </div>

              <div className="flex border border-charcoal rounded-xl bg-white px-3 py-1.5 text-xs items-center gap-2">
                <span className="text-[#2B2D31]/50 font-mono font-bold font-display uppercase">📣 Sort:</span>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-bold cursor-pointer text-[#2B2D31] outline-none"
                >
                  <option value="popular">⚡ Popular Picks</option>
                  <option value="price-low-high">🍓 Price: Cute to Royal</option>
                  <option value="price-high-low">👑 Price: Royal to Cute</option>
                  <option value="rating">⭐️ Highest Sparkles</option>
                </select>
              </div>
            </div>
          </div>

          {/* Printify Connection Status Banner */}
          <AnimatePresence>
            {printifySyncStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className={`p-4 border-2 border-[#2B2D31] rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                  printifySyncStatus === 'success' 
                    ? 'bg-[#82D1C1]/15 border-[#82D1C1]' 
                    : printifySyncStatus === 'loading' 
                    ? 'bg-amber-100/10 border-amber-300' 
                    : 'bg-[#FFB3C1]/15 border-[#FFB3C1]'
                } shadow-[3px_3px_0px_0px_#2B2D31] select-none`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl border border-[#2B2D31] ${
                    printifySyncStatus === 'success' ? 'bg-[#82D1C1]' : printifySyncStatus === 'loading' ? 'bg-amber-300' : 'bg-[#FFB3C1]'
                  }`}>
                    {printifySyncStatus === 'success' ? (
                      <span className="text-xl leading-none block">🦁</span>
                    ) : printifySyncStatus === 'loading' ? (
                      <span className="text-xl leading-none animate-spin block">🔄</span>
                    ) : (
                      <span className="text-xl leading-none block">⚠️</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#2B2D31] flex items-center gap-2">
                      Printify Studio Sync
                      <span className={`text-[9px] font-mono tracking-wider font-bold text-white px-2 py-0.5 rounded uppercase ${
                        printifySyncStatus === 'success' ? 'bg-[#59C1AF]' : printifySyncStatus === 'loading' ? 'bg-amber-500' : 'bg-[#FF8097]'
                      }`}>
                        {printifySyncStatus === 'success' ? 'Synchronised' : printifySyncStatus === 'loading' ? 'Fetching' : 'Failure'}
                      </span>
                    </h4>
                    <p className="text-xs text-charcoal/80 mt-1 max-w-xl leading-normal font-sans">
                      {printifyMessage}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto justify-end">
                  {printifySyncStatus === 'success' && (
                    <div className="text-xs bg-[#2B2D31] text-[#FDFBF7] px-3 py-1.5 rounded-lg font-mono font-bold whitespace-nowrap">
                      🎯 SHOP ID: 19409513
                    </div>
                  )}
                  <button
                    id="btn-printify-resync"
                    disabled={printifySyncStatus === 'loading'}
                    onClick={handleForceSync}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-cream border-2 border-[#2B2D31] rounded-xl text-xs font-bold font-sans cursor-pointer active:translate-x-[0.5px] active:translate-y-[0.5px] shadow-[2.5px_2.5px_0px_0px_#2B2D31] active:shadow-[1px_1px_0px_0px_#2B2D31] select-none transition-all disabled:opacity-50"
                  >
                    <span>🔄</span>
                    <span>{printifySyncStatus === 'loading' ? 'Syncing...' : 'Sync Now'}</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Core Product Grid Display */}
          <div id="product-grid-layout" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onViewDetails={(prod) => setSelectedProduct(prod)}
                onAddToCart={(prod) => handleQuickAdd(prod)}
                isWishlisted={wishlist.some(w => w.id === p.id)}
                onToggleWishlist={(prod) => handleToggleWishlist(prod)}
              />
            ))}
          </div>

          {/* Fallback empty view */}
          {sortedProducts.length === 0 && (
            <div role="status" className="bg-white border-2 border-dashed border-[#2B2D31]/30 rounded-2xl py-20 text-center space-y-4 max-w-lg mx-auto shadow-md">
              <span className="text-3xl block">😿</span>
              <div>
                <h3 className="font-display font-bold text-sm text-[#2B2D31]">Art piece not spotted</h3>
                <p className="text-xs text-charcoal/50 mt-1 max-w-sm mx-auto leading-relaxed">
                  We couldn't spot any prints matching "{searchQuery}" or selected filters. Try choosing "View All" or ask Koji Vibe Helper to track one!
                </p>
              </div>
              <button
                id="btn-clear-filters"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedVibe('all');
                }}
                className="px-4 py-2 bg-[#82D1C1] hover:bg-[#59C1AF] font-bold text-xs rounded-xl border border-[#2B2D31] transition-all cursor-pointer shadow-[2px_2px_0px_0px_#2B2D31]"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Brand visual aesthetic feature / Newsletter subscription banner */}
        <section
          id="brand-aesthetic-banner"
          className="rounded-3xl border-2 border-[#2B2D31] bg-white p-6 md:p-10 shadow-[4px_4px_0px_0px_#FFB3C1] relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Subtle grid elements */}
          <div className="space-y-3 flex-1 text-left">
            <h2 className="font-display font-bold text-xl md:text-2xl text-[#2B2D31] flex items-center gap-1.5">
              🧁 Join Our Magic Fairy Club!
              <span className="text-xs font-mono font-bold bg-[#82D1C1] text-charcoal border border-[#2B2D31] px-1.5 py-0.5 rounded leading-none">
                GIFT PROMO
              </span>
            </h2>
            <p className="text-xs text-charcoal/75 max-w-lg leading-relaxed">
              We periodically send out secret artist catalog drop alerts, exclusive limited-release prints, custom room display tips, and magical coupon codes! Complete your subscription and get the **STKCARDS** 15% discount code instantly.
            </p>
          </div>

          <div className="w-full md:w-auto flex-shrink-0 z-10 select-none">
            {newsletterSubscribed ? (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 bg-[#82D1C1]/20 border border-[#2B2D31] rounded-2xl flex items-center gap-3 text-left shadow-[2px_2px_0px_0px_#2B2D31]"
              >
                <div className="h-9 w-9 bg-[#82D1C1] rounded-full border border-[#2B2D31] flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs text-charcoal">Yay! You are in!</h4>
                  <p className="text-[10px] text-charcoal/80 mt-1">
                    Your secret 15% checkout code is: <strong className="bg-white border border-charcoal px-1.5 py-0.5 rounded text-pink-dark">STKCARDS</strong> 🌸
                  </p>
                </div>
              </motion.div>
            ) : (
              <form
                id="newsletter-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail.trim()) {
                    setNewsletterSubscribed(true);
                    triggerToast('💌 Fairy subscription saved beautifully!');
                  }
                }}
                className="flex border-2 border-[#2B2D31] rounded-xl overflow-hidden shadow-[2.5px_2.5px_0px_0px_#2B2D31] bg-[#FDFBF7]"
              >
                <input
                  id="input-newsletter-email"
                  type="email"
                  placeholder="Your cute email address..."
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-2.5 outline-none text-xs text-[#2B2D31] font-medium w-full sm:w-64 bg-[#FDFBF7]"
                />
                <button
                  id="btn-newsletter-submit"
                  type="submit"
                  className="bg-[#FFB3C1] hover:bg-[#FF8097] text-charcoal font-bold text-xs px-5 border-l-2 border-[#2B2D31] transition-all cursor-pointer font-display"
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Interactive Community Reviews & Guestbook board */}
        <section id="customer-guestbook-section" className="bg-[#FDFBF7] border-2 border-[#2B2D31] rounded-3xl p-6 md:p-8 shadow-[4px_4px_0px_0px_#82D1C1] grid grid-cols-1 md:grid-cols-12 gap-8 relative select-none">
          
          {/* Left info column */}
          <div className="md:col-span-5 text-left space-y-4">
            <span className="text-[10px] uppercase font-mono font-bold bg-[#FFB3C1] border border-charcoal px-2.5 py-1 rounded inline-block shadow-[1px_1px_0px_0px_#2B2D31]">
              💬 HEAR FROM THE FAIRIES
            </span>
            <h2 className="font-display font-bold text-xl md:text-2xl text-charcoal">
              Aesthetic Community Guestbook & Art Board
            </h2>
            <p className="text-xs text-charcoal/75 leading-relaxed">
              We display actual fairy reviews and heartwarming direct messages here! Customers love sharing pictures of their cute framed anime prints hanging in cozy desks and pastel bedrooms. Feel free to leave your review comments directly below!
            </p>

            <div className="p-3 bg-white border border-[#2B2D31]/10 rounded-xl space-y-2">
              <div className="flex items-center gap-1 text-xs font-bold text-charcoal font-display">
                ⭐️ Super Premium Etsy Rating
              </div>
              <p className="text-[10px] text-charcoal/65 leading-relaxed">
                Over 4,800 orders shipped internationally with an exceptional 5.0 Star fairy rating across custom anime decor categories!
              </p>
            </div>

            {/* Direct write message form */}
            <form id="guestbook-submit-form" onSubmit={handleAddGuestbookEntry} className="bg-white border-2 border-[#2B2D31] rounded-2xl p-4.5 space-y-3 shadow-[3px_3px_0px_0px_#2B2D31] text-left">
              <h3 className="font-display font-bold text-xs text-charcoal">✍️ Pin a Guestbook Message</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="guest-input-name"
                  type="text"
                  placeholder="Your star moniker (e.g., Ami_Bunny) 🐾"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-cream border border-[#2B2D31]/30 rounded px-2.5 py-1 text-xs outline-none focus:border-[#82D1C1] font-medium"
                />
                <select
                  id="guest-input-emoji"
                  value={guestEmoji}
                  onChange={(e) => setGuestEmoji(e.target.value as any)}
                  className="bg-cream border border-[#2B2D31]/30 rounded px-2.5 py-1 text-xs outline-none focus:border-[#82D1C1] font-bold cursor-pointer"
                >
                  <option value="happy">🌸 Happy</option>
                  <option value="excited">⚡ Excited</option>
                  <option value="star-eyed">🤩 Starry</option>
                  <option value="shy">⭐ Blush</option>
                </select>
              </div>

              <textarea
                id="guest-input-comment"
                placeholder="Share your retro-pastel workspace cozy joy or say hii!..."
                required
                rows={3}
                value={guestText}
                onChange={(e) => setGuestText(e.target.value)}
                className="w-full bg-cream border border-[#2B2D31]/30 rounded p-2.5 text-xs outline-none focus:border-[#82D1C1] font-medium"
              />

              <div className="flex justify-between items-center pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-charcoal/50">Rating</span>
                  <select
                    id="guest-input-rating"
                    value={guestRating}
                    onChange={(e) => setGuestRating(Number(e.target.value))}
                    className="font-bold cursor-pointer text-xs outline-none bg-transparent"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐</option>
                    <option value={4}>⭐⭐⭐⭐</option>
                  </select>
                </div>

                <button
                  id="btn-guestbook-submit"
                  type="submit"
                  className="bg-[#82D1C1] hover:bg-[#59C1AF] text-[#2B2D31] font-bold text-xs py-1.5 px-4 border border-[#2B2D31] rounded-lg shadow-[1.5px_1.5px_0px_0px_#2B2D31] active:translate-y-0.5 cursor-pointer"
                >
                  Pin Message 📌
                </button>
              </div>

              {guestSuccess && (
                <p className="text-[10px] text-green-600 font-bold">
                  🎉 Sweet dream! Your comment has been posted to our aesthetic Guestbook board beautifully! Check it out on the board!
                </p>
              )}
            </form>
          </div>

          {/* Right dynamic list scroll board representation resembling a styled bulletin board */}
          <div className="md:col-span-7 flex flex-col h-[400px] bg-white border-2 border-[#2B2D31] rounded-2xl overflow-y-auto p-4 space-y-3.5 shadow-[4px_4px_0px_0px_#2B2D31] divide-y divide-[#2B2D31]/10 pr-2">
            
            {/* Display list mapping */}
            {reviews.map((rev) => (
              <div key={rev.id} className="pt-3.5 first:pt-3 text-left space-y-2.5 flex flex-col">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs bg-[#FFB3C1]/20 border border-pink text-charcoal px-2 py-0.2 rounded-full font-bold">
                      {rev.emoji === 'star-eyed' && '🤩'}
                      {rev.emoji === 'happy' && '🌸'}
                      {rev.emoji === 'excited' && '⚡'}
                      {rev.emoji === 'shy' && '⭐'}
                    </span>
                    <span className="text-xs font-bold font-display text-charcoal">
                      {rev.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-charcoal/40">
                    {rev.date}
                  </span>
                </div>

                <div className="flex text-amber-400 text-xs select-none leading-none">
                  {'★'.repeat(rev.rating)}
                </div>

                <p className="text-xs text-charcoal/80 leading-relaxed italic pr-2 font-medium">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                {/* Community Reaction Badges Row */}
                <div className="flex flex-wrap gap-1.5 items-center pt-1.5">
                  <span className="text-[9px] uppercase font-bold text-charcoal/40 font-mono tracking-wide mr-1 select-none">
                    Stickers:
                  </span>
                  {['💖', '🌸', '🧁', '⚡', '⭐'].map(emoji => {
                    const count = (reviewReactions[rev.id] && reviewReactions[rev.id][emoji]) || 0;
                    return (
                      <button
                        key={emoji}
                        onClick={() => handleReactToReview(rev.id, emoji)}
                        className={`flex items-center gap-1 text-[10.5px] px-2 py-0.5 border rounded-full transition-all duration-100 cursor-pointer active:scale-95 ${
                          count > 0 
                            ? 'bg-[#FFB3C1]/15 border-[#FFB3C1] font-bold text-[#FF8097] shadow-[1px_1px_0px_0px_#FFB3C1]' 
                            : 'bg-white border-[#2B2D31]/15 text-charcoal/50 hover:bg-cream hover:border-[#2B2D31]'
                        }`}
                      >
                        <span>{emoji}</span>
                        {count > 0 && <span className="font-mono text-[9px] font-bold leading-none text-charcoal">{count}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Styled Footer */}
      <footer id="site-footer" className="bg-[#2B2D31] border-t-2 border-[#2B2D31] py-10 px-6 mt-16 text-left select-none relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 bg-[#FFB3C1] border border-[#FDFBF7] rounded-full flex items-center justify-center text-lg">
                💮
              </span>
              <h3 className="font-display font-bold text-sm text-[#FDFBF7] tracking-tight">
                koji.studio
              </h3>
            </div>
            <p className="text-[11px] text-[#FDFBF7]/70 leading-relaxed max-w-xs">
              Handcrafting original giclée retro pastel prints and cute merch loaded with bubbly feelings. Made, printed, and lovingly hand-wrapped in small boutique batches.
            </p>
            <div className="flex gap-2 items-center">
              <a 
                href="https://instagram.com/kojixkoji" 
                id="social-inst" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center bg-[#FDFBF7] border border-[#2B2D31] hover:bg-[#82D1C1] rounded-full text-[#2B2D31] transition-all shadow-[1.5px_1.5px_0px_0px_#2B2D31] hover:shadow-[2.5px_2.5px_0px_0px_#2B2D31] hover:-translate-y-0.5"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com/kojixkoji" 
                id="social-twit" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center bg-[#FDFBF7] border border-[#2B2D31] hover:bg-[#82D1C1] rounded-full text-[#2B2D31] transition-all shadow-[1.5px_1.5px_0px_0px_#2B2D31] hover:shadow-[2.5px_2.5px_0px_0px_#2B2D31] hover:-translate-y-0.5"
                title="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://www.pinterest.com/kojixkoji" 
                id="social-pin" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center bg-[#FDFBF7] border border-[#2B2D31] hover:bg-[#82D1C1] rounded-full text-[#2B2D31] transition-all shadow-[1.5px_1.5px_0px_0px_#2B2D31] hover:shadow-[2.5px_2.5px_0px_0px_#2B2D31] hover:-translate-y-0.5"
                title="Pinterest"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.992 3.993-.283 1.194.599 2.169 1.775 2.169 2.13 0 3.769-2.247 3.769-5.489 0-2.871-2.063-4.877-5.008-4.877-3.411 0-5.413 2.561-5.413 5.204 0 1.03.397 2.133.893 2.734.098.119.112.224.083.345l-.333 1.36c-.053.22-.178.267-.412.158-1.54-.716-2.5-2.969-2.5-4.779 0-3.891 2.827-7.464 8.149-7.464 4.278 0 7.604 3.048 7.604 7.124 0 4.25-2.679 7.671-6.398 7.671-1.25 0-2.425-.649-2.827-1.417 0 0-.619 2.357-.769 2.936-.279 1.073-1.031 2.418-1.534 3.238C9.444 23.822 10.7 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
                </svg>
              </a>
              <a 
                href="https://kojixkoji.tumblr.com" 
                id="social-tum" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 flex items-center justify-center bg-[#FDFBF7] border border-[#2B2D31] hover:bg-[#82D1C1] rounded-full text-[#2B2D31] transition-all shadow-[1.5px_1.5px_0px_0px_#2B2D31] hover:shadow-[2.5px_2.5px_0px_0px_#2B2D31] hover:-translate-y-0.5"
                title="Tumblr"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.517-4.508 4.71-6.649h3.004v6.248h4.248v3.499h-4.248v6.862c0 .9.516 1.547 1.547 1.547a4.2 4.2 0 0 0 2.016-.628l1.016 3.149C16.594 23.313 15.437 24 14.562 24z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#FFB3C1] font-bold">🛒 Shop Categories</h4>
            <ul className="space-y-1.5 text-xs text-[#FDFBF7]/80">
              <li>
                <button id="foot-cat-all" onClick={() => { setSelectedCategory('all'); scrollToSection('prints-shop-section'); }} className="hover:text-[#FFB3C1] cursor-pointer transition-colors text-left">
                  🌟 All Products & Bundles
                </button>
              </li>
              <li>
                <button id="foot-cat-prints" onClick={() => { setSelectedCategory('prints'); scrollToSection('prints-shop-section'); }} className="hover:text-[#FFB3C1] cursor-pointer transition-colors text-left">
                  🎨 Giclée Anime Prints
                </button>
              </li>
              <li>
                <button id="foot-cat-apparel" onClick={() => { setSelectedCategory('apparel'); scrollToSection('prints-shop-section'); }} className="hover:text-[#FFB3C1] cursor-pointer transition-colors text-left">
                  👚 Strawberry Knit Sweaters
                </button>
              </li>
              <li>
                <button id="foot-cat-acc" onClick={() => { setSelectedCategory('accessories'); scrollToSection('prints-shop-section'); }} className="hover:text-[#FFB3C1] cursor-pointer transition-colors text-left">
                  🍵 Matcha Canvas Totes
                </button>
              </li>
              <li>
                <button id="foot-cat-cozy" onClick={() => { setSelectedCategory('cozy'); scrollToSection('prints-shop-section'); }} className="hover:text-[#FFB3C1] cursor-pointer transition-colors text-left">
                  🧸 Cozy Desk Goods & DIYs
                </button>
              </li>
              <li>
                <button id="foot-cat-stationery" onClick={() => { setSelectedCategory('stationery'); scrollToSection('prints-shop-section'); }} className="hover:text-[#FFB3C1] cursor-pointer transition-colors text-left">
                  📇 Stationery & Sticker Packs
                </button>
              </li>
              <li>
                <button id="foot-cat-plush" onClick={() => { setSelectedCategory('plush'); scrollToSection('prints-shop-section'); }} className="hover:text-[#FFB3C1] cursor-pointer transition-colors text-left">
                  🧸 Fluffy Cuddle Plushies
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#82D1C1] font-bold">🔮 Fairy Support</h4>
            <ul className="space-y-1.5 text-xs text-[#FDFBF7]/80">
              <li><a href="#" className="hover:text-[#82D1C1] transition-colors">📦 Fast Flower Mail Shipping</a></li>
              <li><a href="#" className="hover:text-[#82D1C1] transition-colors">🛡️ Secure Payments Guarantee</a></li>
              <li><a href="#" className="hover:text-[#82D1C1] transition-colors">🌸 Refund/Return Policies</a></li>
              <li><a href="#" className="hover:text-[#82D1C1] transition-colors">✨ Clean Paper Care Instructions</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs uppercase font-mono tracking-widest text-[#FF8097] font-bold">🍪 Fairytale Store</h4>
            <div className="text-xs text-[#FDFBF7]/80 space-y-1">
              <p className="flex items-center gap-1">📍 <span className="font-semibold text-[#FDFBF7]">Koji Studio HQ</span></p>
              <p className="text-[#FDFBF7]/60 leading-normal pl-4">Pastel Lane 77, Strawberry Valley, Wonderland Cloud</p>
              <p className="pl-4 italic pt-1 text-[#FFB3C1]">✨ &ldquo;Printed under rainbows and starry skies!&rdquo;</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[#FDFBF7]/10 flex flex-col sm:flex-row justify-between items-center text-xs text-[#FDFBF7]/55 gap-3">
          <p>© 2026 koji.studio x kojixkoji. Crafted lovingly of retro-pastel dreams & kawaii anime magic.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* Slide-over Shopping Cart Panel */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onUpdateCustomization={handleUpdateCartCustomization}
          />
        )}
      </AnimatePresence>

      {/* Slide-over Wishlist Panel Drawer */}
      <AnimatePresence>
        {isWishlistOpen && (
          <WishlistDrawer
            isOpen={isWishlistOpen}
            onClose={() => setIsWishlistOpen(false)}
            wishlist={wishlist}
            onRemoveItem={handleToggleWishlist}
            onAddToCart={handleAddToCart}
            onTriggerToast={triggerToast}
          />
        )}
      </AnimatePresence>

      {/* Styled Floating Toast Notifier Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            id="toast-alert"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 bg-[#2B2D31] text-cream border-2 border-cream rounded-2xl p-3 px-4 shadow-xl text-xs font-bold font-display flex items-center gap-2 select-none"
          >
            <Check className="h-4 w-4 text-[#82D1C1]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Art Detail Dialog Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            isWishlisted={wishlist.some(w => w.id === selectedProduct.id)}
            onToggleWishlist={handleToggleWishlist}
            reviews={reviews}
            onAddReview={handleAddReview}
            theme={theme}
          />
        )}
      </AnimatePresence>

      {/* Sticky Cute Back to Top Button */}
      {showScrollTop && (
        <button
          id="btn-scroll-top"
          onClick={() => scrollToSection('app-root-container')}
          className="fixed bottom-24 right-7 p-2 bg-white hover:bg-cream text-charcoal border-2 border-[#2B2D31] rounded-full shadow-[2.5px_2.5px_0px_0px_#2B2D31] hover:scale-105 duration-100 ease-in-out cursor-pointer z-35 active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_#2B2D31]"
        >
          <ArrowUp className="h-4.5 w-4.5" />
        </button>
      )}

      {/* Adorable Fox AI Aesthetic Matchmaker Curator chat widget */}
      <AiMatchmaker
        onSelectProduct={(p) => setSelectedProduct(p)}
        onAddToCart={(p, qty) => handleAddToCart(p, 'A4_MEDIUM', 'NONE', qty)}
        products={allProducts}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { Product, PrintSize, FrameColor, CustomerReview } from '../types';
import {
  SIZE_OPTIONS,
  FRAME_OPTIONS,
  APPAREL_SIZE_OPTIONS,
  APPAREL_FRAME_OPTIONS,
  APPAREL_COLOR_OPTIONS,
  COZY_SIZE_OPTIONS,
  COZY_FRAME_OPTIONS,
  STATIONERY_SIZE_OPTIONS,
  STATIONERY_FRAME_OPTIONS,
  PLUSH_SIZE_OPTIONS,
  PLUSH_FRAME_OPTIONS,
  VIBE_DESCRIPTIONS
} from '../data';
import { X, Heart, Loader2, Award, Zap, ShieldCheck, ShoppingBag, Eye, Calendar, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: PrintSize, frame: FrameColor, quantity: number, color?: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  reviews: CustomerReview[];
  onAddReview: (review: Omit<CustomerReview, 'id' | 'date'>) => void;
  theme?: 'default' | 'pastel-magic';
}

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  reviews,
  onAddReview,
  theme = 'default'
}: ProductDetailModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<PrintSize>(() => {
    if (product?.category === 'apparel') return 'M';
    return 'A4_MEDIUM';
  });
  const [selectedFrame, setSelectedFrame] = useState<FrameColor>('NONE');
  const [selectedColor, setSelectedColor] = useState<string>('White');
  const [quantity, setQuantity] = useState(1);
  const [previewMode, setPreviewMode] = useState<'framed' | 'lifestyle'>('framed');
  const [isAdding, setIsAdding] = useState(false);

  const [images, setImages] = useState<string[]>(() => {
    const initialList = [product.imageUrl];
    
    if (product.id === 'nezuko-kitty') {
      initialList.push(
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=600'
      );
    } else if (product.id === 'rengoku-kitty') {
      initialList.push(
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600'
      );
    } else if (product.id === 'naruto-kitty') {
      initialList.push(
        'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1561715276-a2d087060f1d?auto=format&fit=crop&q=80&w=600'
      );
    } else if (product.id === 'apparel-sweet-hoodie') {
      initialList.push(
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=600'
      );
    } else {
      if (product.category === 'prints') {
        initialList.push(
          'https://images.unsplash.com/photo-1501472312651-726afd116ff1?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=600'
        );
      } else if (product.category === 'accessories') {
        initialList.push(
          'https://images.unsplash.com/photo-1531315630201-bb15abeb1653?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1529511582893-2d7e684dd128?auto=format&fit=crop&q=80&w=600'
        );
      } else {
        initialList.push(
          'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1449244411325-d482a00d5b49?auto=format&fit=crop&q=80&w=800'
        );
      }
    }

    return initialList;
  });

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  
  // Custom Reviews form state
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewEmoji, setNewReviewEmoji] = useState<'happy' | 'excited' | 'star-eyed' | 'shy'>('happy');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Dynamic lists based on categories
  const sizesList = product.category === 'apparel' 
    ? APPAREL_SIZE_OPTIONS 
    : product.category === 'cozy' 
       ? COZY_SIZE_OPTIONS 
       : product.category === 'stationery'
         ? STATIONERY_SIZE_OPTIONS
         : product.category === 'plush'
           ? PLUSH_SIZE_OPTIONS
           : SIZE_OPTIONS;

  const framesList = product.category === 'apparel' 
    ? APPAREL_FRAME_OPTIONS 
    : product.category === 'cozy' 
       ? COZY_FRAME_OPTIONS 
       : product.category === 'stationery'
         ? STATIONERY_FRAME_OPTIONS
         : product.category === 'plush'
           ? PLUSH_FRAME_OPTIONS
           : FRAME_OPTIONS;

  // Math calculated values for selected options
  const sizeOpt = sizesList.find(s => s.value === selectedSize) || sizesList[1] || sizesList[0];
  const frameOpt = framesList.find(f => f.value === selectedFrame) || framesList[0];

  const getThemeHex = (hex: string) => {
    if (theme !== 'pastel-magic') return hex;
    const upper = hex.toUpperCase();
    if (upper === '#82D1C1') return '#D5C9FF'; // light lavender
    if (upper === '#59C1AF') return '#BCA9FF'; // lavender dark
    if (upper === '#FFEAA7' || upper === '#FFEBB3' || upper === '#F0E6D2') {
      return '#D2E4FF'; // milky pale blue
    }
    return hex;
  };

  const hasModifiers = product.category === 'prints' || product.category === 'apparel' || product.category === 'cozy' || product.category === 'stationery' || product.category === 'plush';
  const unitPrice = product.price + (hasModifiers ? (sizeOpt?.priceModifier || 0) + (frameOpt?.priceModifier || 0) : 0);
  const totalPrice = unitPrice * quantity;
  const showCustomizers = product.category !== 'accessories';

  // Filter reviews matching current product if any, or just display relevant reviews
  const filteredReviews = reviews.filter(rev => rev.printId === product.id || !rev.printId);

  const handleAddToCart = () => {
    setIsAdding(true);
    setTimeout(() => {
      onAddToCart(product, selectedSize, selectedFrame, quantity, product.category === 'apparel' ? selectedColor : undefined);
      setIsAdding(false);
      onClose();
    }, 800);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    onAddReview({
      name: newReviewName,
      rating: newReviewRating,
      comment: newReviewComment,
      emoji: newReviewEmoji,
      printId: product.id
    });

    setReviewSuccess(true);
    setNewReviewName('');
    setNewReviewComment('');
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div
      id="modal-backdrop"
      className="fixed inset-0 bg-[#2B2D31]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'modal-backdrop') onClose();
      }}
    >
      <motion.div
        id="modal-container"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#FDFBF7] border-2 border-[#2B2D31] rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-[6px_6px_0px_0px_#2B2D31] flex flex-col md:flex-row divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#2B2D31] select-none"
      >
        
        {/* Left: Live Visual Custom Framer Display */}
        <div id="col-detail-visual" className="flex-1 p-6 flex flex-col items-center justify-between bg-[#FDFBF7] grid-bg min-h-[300px] md:min-h-[500px]">
          
          {/* Top selection for Preview Style */}
          <div className="w-full flex justify-between items-center mb-4">
            <span className="text-[10px] bg-[#FFB3C1] text-[#2B2D31] font-bold border border-charcoal uppercase tracking-widest px-2.5 py-1 rounded-md shadow-[1.5px_1.5px_0px_0px_#2B2D31]">
              🎨 Visual Customizer
            </span>
            <div className="flex gap-1">
              <button
                id="btn-prev-framed"
                onClick={() => setPreviewMode('framed')}
                className={`text-xs px-2.5 py-1 border border-[#2B2D31] font-semibold rounded-md transition-all cursor-pointer ${
                  previewMode === 'framed' ? 'bg-[#82D1C1] shadow-[1.5px_1.5px_0px_0px_#2B2D31]' : 'bg-white'
                }`}
              >
                Framed Detail
              </button>
              <button
                id="btn-prev-life"
                onClick={() => setPreviewMode('lifestyle')}
                className={`text-xs px-2.5 py-1 border border-[#2B2D31] font-semibold rounded-md transition-all cursor-pointer ${
                  previewMode === 'lifestyle' ? 'bg-[#82D1C1] shadow-[1.5px_1.5px_0px_0px_#2B2D31]' : 'bg-white'
                }`}
              >
                In a Room ✨
              </button>
            </div>
          </div>

          {/* Interactive Artwork Visual Showcase */}
          <div
            id="visual-showcase"
            className="w-full flex-1 flex items-center justify-center p-4 relative transition-all duration-300 rounded-xl border border-transparent"
          >

            {/* Left Chevron Arrow overlay */}
            {images.length > 1 && (
              <button
                id="btn-carousel-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
                }}
                className="absolute left-2 md:left-4 p-2 bg-white border-2 border-[#2B2D31] rounded-full hover:bg-cream cursor-pointer transition-all shadow-[2px_2px_0px_0px_#2B2D31] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_#2B2D31] select-none z-10"
                aria-label="Previous Image"
              >
                <ChevronLeft className="w-4 h-4 text-charcoal stroke-[3px]" />
              </button>
            )}

            {previewMode === 'framed' ? (
              <motion.div
                key={`framed-view-${activeImageIdx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative max-w-[280px] md:max-w-[340px] aspect-[3/4] transition-all duration-300"
                style={{
                  border: selectedFrame !== 'NONE' ? `22px solid ${getThemeHex(frameOpt.hex)}` : '0px solid transparent',
                  boxShadow: selectedFrame !== 'NONE' 
                    ? 'inset 0 0 0 1.5px #2B2D31, 1px 1px 0px 1.5px #2B2D31, 6px 6px 0px 0px #FFB3C1'
                    : '1px 1px 0px 1.5px #2B2D31, 5px 5px 0px 0px #2B2D31',
                  borderRadius: selectedFrame !== 'NONE' ? '4px' : '12px',
                  overflow: 'hidden'
                }}
              >
                <img
                  src={images[activeImageIdx] || product.imageUrl}
                  alt={`${product.title} - View ${activeImageIdx + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ) : (
              <motion.div
                key={`lifestyle-view-${activeImageIdx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative w-full max-w-[380px] aspect-video bg-amber-50 rounded-xl border-2 border-[#2B2D31] overflow-hidden shadow-[4px_4px_0px_0px_#2B2D31] flex flex-col justify-end"
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {/* Embedded scale frame on the wall */}
                <div className="absolute top-[20%] left-[38%] w-[84px] aspect-[3/4] bg-[#FDFBF7] p-0.5 border border-[#2B2D31] shadow-md transform rotate-1">
                  <div
                    className="w-full h-full"
                    style={{
                      border: selectedFrame !== 'NONE' ? `4px solid ${getThemeHex(frameOpt.hex)}` : 'none',
                      boxShadow: selectedFrame !== 'NONE' ? 'inset 0 0 0 0.5px #2B2D31' : 'none'
                    }}
                  >
                    <img 
                      src={images[activeImageIdx] || product.imageUrl} 
                      alt={`${product.title} - View ${activeImageIdx + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
                <div className="bg-[#2B2D31]/80 text-[#FDFBF7] text-[10px] py-1 text-center font-mono w-full border-t border-[#2B2D31] z-10">
                  🛋️ Visual Scale Representation • A4 Size Shown
                </div>
              </motion.div>
            )}

            {/* Right Chevron Arrow overlay */}
            {images.length > 1 && (
              <button
                id="btn-carousel-next"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
                }}
                className="absolute right-2 md:right-4 p-2 bg-white border-2 border-[#2B2D31] rounded-full hover:bg-cream cursor-pointer transition-all shadow-[2px_2px_0px_0px_#2B2D31] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_#2B2D31] select-none z-10"
                aria-label="Next Image"
              >
                <ChevronRight className="w-4 h-4 text-charcoal stroke-[3px]" />
              </button>
            )}
          </div>

          {/* Thumbnail Gallery Row */}
          <div className="w-full flex flex-wrap gap-2 items-center justify-center px-4 mb-2">
            {images.map((img, idx) => (
              <button
                id={`btn-thumb-${idx}`}
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`h-11 w-9 relative cursor-pointer border-2 border-charcoal rounded-md overflow-hidden transition-all duration-200 ${
                  activeImageIdx === idx 
                    ? 'ring-2 ring-pink ring-offset-1 scale-103 shadow-[1.5px_1.5px_0px_0px_#2B2D31]' 
                    : 'opacity-70 hover:opacity-100 shadow-[1px_1px_0px_0px_#2B2D31]'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Underlay product tags & environmental specs */}
          <div className="w-full mt-4 p-3 bg-white border border-[#2B2D31]/15 rounded-xl text-left space-y-1.5 ">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono font-bold text-charcoal/50 uppercase">VIBE CLASS</span>
              <span className="text-[10px] font-semibold text-pink-dark flex items-center gap-0.5">
                {VIBE_DESCRIPTIONS[product.vibe]?.emoji} {VIBE_DESCRIPTIONS[product.vibe]?.name}
              </span>
            </div>
            <p className="text-[10px] text-charcoal/70 italic leading-relaxed">
              &ldquo;{product.backstory || product.description}&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Full Product Details and Shopping Interface */}
        <div id="col-detail-selection" className="flex-1 p-6 flex flex-col bg-white">
          
          {/* Header row with close button & title */}
          <div className="flex justify-between items-start gap-3">
            <div>
              <span className="text-[10px] bg-cream text-charcoal/80 border border-charcoal/20 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-bold">
                {product.franchise} Catalog
              </span>
              <h2 id="modal-title" className="font-display font-bold text-xl text-[#2B2D31] mt-2 leading-snug">
                {product.title}
              </h2>
            </div>
            <button
              id="btn-close-modal"
              onClick={onClose}
              className="p-1.5 hover:bg-cream border border-transparent hover:border-charcoal rounded-full transition-all cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-xs text-charcoal/75 mt-3 leading-relaxed">
            {product.description}
          </p>

          <hr className="my-4 border-[#2B2D31]/15" />

          {/* Configuration Form */}
          <div className="space-y-4">
            
            {showCustomizers ? (
              product.category === 'apparel' ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-[#2B2D31] uppercase tracking-wider block mb-2 font-display">
                      👚 Choose Apparel Size
                    </label>
                    <div className="relative">
                      <select
                        id="select-apparel-size"
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value as PrintSize)}
                        className="w-full p-3 bg-white border-2 border-[#2B2D31] rounded-xl text-xs font-bold text-[#2B2D31] outline-none cursor-pointer hover:bg-cream transition-colors shadow-[2px_2px_0px_0px_#2B2D31] active:translate-x-[0.5px] active:translate-y-[0.5px] focus:ring-0 appearance-none font-sans"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232B2D31' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 16px center',
                          backgroundSize: '12px'
                        }}
                      >
                        {sizesList.map((opt) => (
                          <option key={opt.value} value={opt.value} className="font-sans font-bold text-charcoal">
                            {opt.label} ({opt.dimensions})&nbsp;&nbsp;&nbsp;{opt.priceModifier === 0 ? '— Base Price' : `— +$${opt.priceModifier.toFixed(2)}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Apparel Color Selector */}
                  <div>
                    <label className="text-xs font-bold text-[#2B2D31] uppercase tracking-wider block mb-2 font-display">
                      🎨 Choose Apparel Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {APPAREL_COLOR_OPTIONS.map((opt) => (
                        <button
                          id={`color-opt-${opt.value.toLowerCase()}`}
                          key={opt.value}
                          type="button"
                          onClick={() => setSelectedColor(opt.value)}
                          className={`p-2 border-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                            selectedColor === opt.value
                              ? 'border-[#2B2D31] bg-[#FFB3C1]/20 shadow-[2px_2px_0px_0px_#2B2D31] font-bold'
                              : 'border-[#2B2D31]/15 bg-cream/35 hover:border-charcoal'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-charcoal/60 shadow-xs flex-shrink-0"
                            style={{ backgroundColor: opt.hex }}
                          />
                          <span className="text-[10px] font-sans font-bold text-charcoal tracking-tight leading-none truncate">
                            {opt.value}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Size Selector */}
                  <div>
                    <label className="text-xs font-bold text-[#2B2D31] uppercase tracking-wider block mb-2 font-display">
                      {product.category === 'prints' 
                        ? "📏 Step 1: Choose Art Print Size" 
                        : product.category === 'stationery'
                          ? "📇 Step 1: Choose Stationery Size Pack"
                          : product.category === 'plush'
                            ? "🧸 Step 1: Choose Plush Size Option"
                            : "🧸 Step 1: Choose Custom Bundle Set"}
                    </label>
                    <div id="size-options-grid" className="grid grid-cols-1 gap-2">
                      {sizesList.map((opt) => (
                        <button
                          id={`size-opt-${opt.value}`}
                          key={opt.value}
                          onClick={() => setSelectedSize(opt.value)}
                          className={`p-2.5 border text-left rounded-xl transition-all cursor-pointer text-xs flex justify-between items-center ${
                            selectedSize === opt.value
                              ? 'bg-[#82D1C1]/20 border-[#2B2D31] shadow-[2px_2px_0px_0px_#2B2D31] font-bold'
                              : 'bg-cream border-charcoal/20 hover:border-[#2B2D31]'
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{opt.label}</p>
                            <p className="text-[10px] text-charcoal/50 font-mono mt-0.5">{opt.dimensions}</p>
                          </div>
                          <span className="text-xs font-mono font-bold">
                            {opt.priceModifier === 0 ? 'Base Price' : `+$${opt.priceModifier.toFixed(2)}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frame Selector */}
                  <div>
                    <label className="text-xs font-bold text-[#2B2D31] uppercase tracking-wider block mb-2 font-display">
                      {product.category === 'prints' 
                        ? "🖼️ Step 2: Choose Frame Option" 
                        : product.category === 'stationery'
                          ? "🧁 Step 2: Choose Premium Gift Envelope"
                          : product.category === 'plush'
                            ? "🍓 Step 2: Choose Luxury Gift Dustbag"
                            : "🍵 Step 2: Choose Soft Pastel wrapping"}
                    </label>
                    <div id="frame-options-grid" className="grid grid-cols-2 gap-2">
                      {framesList.map((opt) => (
                        <button
                          id={`frame-opt-${opt.value}`}
                          key={opt.value}
                          onClick={() => setSelectedFrame(opt.value)}
                          className={`p-2.5 border text-left rounded-xl transition-all cursor-pointer text-xs flex flex-col justify-between gap-1 ${
                            selectedFrame === opt.value
                              ? 'bg-[#FFB3C1]/20 border-[#2B2D31] shadow-[2px_2px_0px_0px_#2B2D31] font-bold'
                              : 'bg-cream border-charcoal/20 hover:border-[#2B2D31]'
                          }`}
                        >
                          <span className="font-semibold line-clamp-1">{opt.label}</span>
                          <div className="flex justify-between items-center w-full mt-2">
                            <div
                              className="h-3.5 w-3.5 rounded-full border border-charcoal"
                              style={{ backgroundColor: getThemeHex(opt.hex) }}
                            />
                            <span className="text-[10px] font-mono font-bold">
                              {opt.priceModifier === 0 ? 'Free' : `+$${opt.priceModifier}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="p-4.5 bg-[#82D1C1]/10 rounded-xl border-2 border-dashed border-[#82D1C1]/50 text-left">
                <p className="text-xs text-charcoal/80 font-medium leading-relaxed">
                  🎀 This gorgeous accessory comes as a standard pre-packaged boutique product, sealed with cute fairy stamps and mini artist stickers under our signature pink ribbons! No size customization is needed.
                </p>
              </div>
            )}

            {/* Quantity Selector & Checkout Pricing */}
            <div className="bg-[#FDFBF7] border-2 border-[#2B2D31] rounded-xl p-3 shadow-[3px_3px_0px_0px_#2B2D31] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-[#2B2D31] font-display">QTY:</span>
                <div className="flex border border-[#2B2D31] rounded-lg bg-white overflow-hidden items-center">
                  <button
                    id="btn-qty-dec"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-2 py-0.5 hover:bg-cream font-bold cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3.5 py-0.5 text-xs font-mono font-bold text-center border-x border-[#2B2D31] inline-block w-8">
                    {quantity}
                  </span>
                  <button
                    id="btn-qty-inc"
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-2 py-0.5 hover:bg-cream font-bold cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Price details */}
              <div className="text-right">
                <p className="text-[10px] text-charcoal/50 font-mono italic">
                  ${unitPrice.toFixed(2)} x {quantity}
                </p>
                <p className="text-base text-[#2B2D31] font-bold font-display leading-tight">
                  Total: <span className="text-lg text-pink-dark font-display">${totalPrice.toFixed(2)}</span>
                </p>
              </div>
            </div>

            {/* Checkout CTAs */}
            <div className="grid grid-cols-6 gap-2 pt-2">
              <button
                id="btn-modal-add-cart"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="col-span-4 flex items-center justify-center gap-2 py-3 bg-[#82D1C1] hover:bg-[#59C1AF] disabled:bg-[#82D1C1]/50 text-[#2B2D31] font-bold rounded-xl border-2 border-[#2B2D31] shadow-[3.5px_3.5px_0px_0px_#2B2D31] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[2px_2px_0px_0px_#2B2D31] transition-all cursor-pointer"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4.5 w-4.5" /> Put in Bag
                  </>
                )}
              </button>

              <button
                id="btn-modal-wishlist"
                onClick={() => onToggleWishlist(product)}
                className="col-span-2 flex items-center justify-center gap-1.5 py-3 bg-white hover:bg-[#FFB3C1]/20 text-[#2B2D31] border-2 border-[#2B2D31] rounded-xl shadow-[3.5px_3.5px_0px_0px_#2B2D31] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-[2px_2px_0px_0px_#2B2D31] transition-all cursor-pointer"
              >
                <Heart className={`h-4.5 w-4.5 ${isWishlisted ? 'fill-[#FF8097] text-[#FF8097]' : ''}`} />
                <span className="text-xs font-bold font-display">
                  {isWishlisted ? 'Loved' : 'Love'}
                </span>
              </button>
            </div>
          </div>

          <hr className="my-6 border-[#2B2D31]/15" />

          {/* Dynamic Interactive Guestbook & Prints Reviews Area */}
          <div id="product-reviews-section" className="space-y-4 flex-1">
            <h3 className="font-display font-bold text-sm text-[#2B2D31] flex items-center gap-1.5">
              🌿 Customer Fairy Reviews
              <span className="text-xs bg-[#82D1C1] px-1.5 py-0.5 rounded-md border border-[#2B2D31] font-mono">
                {filteredReviews.length}
              </span>
            </h3>

            {/* List of customer reviews */}
            <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
              {filteredReviews.map((rev) => (
                <div key={rev.id} className="p-2.5 bg-[#FDFBF7] border border-[#2B2D31]/15 rounded-xl text-left space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#2B2D31]">{rev.name}</span>
                      <span className="text-xs">
                        {rev.emoji === 'star-eyed' && '🤩'}
                        {rev.emoji === 'happy' && '🌸'}
                        {rev.emoji === 'excited' && '⚡'}
                        {rev.emoji === 'shy' && '⭐'}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-charcoal/40">{rev.date}</span>
                  </div>
                  <div className="flex text-amber-400 text-[10px] select-none">
                    {'★'.repeat(rev.rating)}
                  </div>
                  <p className="text-[10px] text-charcoal/85 leading-relaxed italic">{rev.comment}</p>
                </div>
              ))}
              {filteredReviews.length === 0 && (
                <p className="text-[10px] text-charcoal/40 italic">No reviews yet for this print. Be the first to share sparklies! ✨</p>
              )}
            </div>

            {/* Compact form to Add Reviews */}
            <form id="add-review-form" onSubmit={handleFormSubmit} className="p-3 bg-cream border border-[#2B2D31] rounded-xl space-y-2">
              <h4 className="text-[10px] uppercase font-bold text-charcoal/60 tracking-wider">✍️ Write a Cute Review</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="rev-input-name"
                  type="text"
                  placeholder="Your nickname 🍡"
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="bg-white border text-[10px] px-2 py-1 outline-none border-[#2B2D31] rounded font-medium"
                />
                
                <div className="flex items-center justify-between bg-white border border-[#2B2D31] rounded px-1.5 py-0.5">
                  <span className="text-[9px] font-mono font-bold text-charcoal/50">Rating</span>
                  <select
                    id="rev-input-rating"
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="bg-transparent text-[10px] font-bold outline-none cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐</option>
                    <option value={4}>⭐⭐⭐⭐</option>
                    <option value={3}>⭐⭐⭐</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between bg-white border border-[#2B2D31] rounded px-2 py-1">
                  <span className="text-[9px] font-mono font-bold text-charcoal/50">Your Avatar Vibe</span>
                  <select
                    id="rev-input-emoji"
                    value={newReviewEmoji}
                    onChange={(e) => setNewReviewEmoji(e.target.value as any)}
                    className="bg-transparent text-xs font-bold outline-none cursor-pointer"
                  >
                    <option value="happy">🌸 Happy</option>
                    <option value="excited">⚡ Excited</option>
                    <option value="star-eyed">🤩 Starry</option>
                    <option value="shy">⭐ Blush</option>
                  </select>
                </div>

                <button
                  id="btn-submit-review"
                  type="submit"
                  disabled={!newReviewName.trim() || !newReviewComment.trim()}
                  className="bg-[#82D1C1] text-[#2B2D31] hover:bg-[#59C1AF] disabled:opacity-40 font-bold text-[10px] py-1 px-2 border border-[#2B2D31] rounded transition-all cursor-pointer text-center"
                >
                  Send Review
                </button>
              </div>

              <textarea
                id="rev-input-comment"
                placeholder="What do you love about this product? (e.g. print texture, colors)..."
                rows={2}
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                className="bg-white border text-[10px] p-2 outline-none border-[#2B2D31] rounded w-full font-medium"
              />

              {reviewSuccess && (
                <p className="text-[9px] text-green-600 font-bold flex items-center gap-1">
                  💖 Thank you! Your review has been added beautifully under this print!
                </p>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

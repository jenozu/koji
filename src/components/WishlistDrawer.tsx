import React, { useState } from 'react';
import { Product, PrintSize, FrameColor } from '../types';
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
  PLUSH_FRAME_OPTIONS
} from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Heart, Share2, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  onRemoveItem: (product: Product) => void;
  onAddToCart: (product: Product, size: PrintSize, frame: FrameColor, quantity: number, color?: string) => void;
  onTriggerToast: (msg: string) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveItem,
  onAddToCart,
  onTriggerToast
}: WishlistDrawerProps) {
  // Store customization state locally for each product in the wishlist
  // Format: { [productId]: { size: PrintSize, frame: FrameColor, color?: string } }
  const [customizations, setCustomizations] = useState<Record<string, { size: PrintSize; frame: FrameColor; color?: string }>>({});

  if (!isOpen) return null;

  // Initialize helper to get current customized values
  const getCustomization = (productId: string, category?: string) => {
    const fallbackSize = category === 'apparel' ? 'M' : 'A4_MEDIUM';
    return customizations[productId] || { size: fallbackSize as PrintSize, frame: 'NONE', color: 'White' };
  };

  // Updaters
  const updateCustomization = (productId: string, size: PrintSize, frame: FrameColor, color?: string) => {
    setCustomizations(prev => ({
      ...prev,
      [productId]: { size, frame, color }
    }));
  };

  // Calculates estimated wishlist subtotal
  const totalPriceEstimate = wishlist.reduce((acc, item) => {
    const custom = getCustomization(item.id, item.category);
    let extra = 0;
    if (item.category === 'prints') {
      const sizeOpt = SIZE_OPTIONS.find(s => s.value === custom.size) || SIZE_OPTIONS[1];
      const frameOpt = FRAME_OPTIONS.find(f => f.value === custom.frame) || FRAME_OPTIONS[0];
      extra += sizeOpt.priceModifier + frameOpt.priceModifier;
    } else if (item.category === 'apparel') {
      const sizeOpt = APPAREL_SIZE_OPTIONS.find(s => s.value === custom.size) || APPAREL_SIZE_OPTIONS[0];
      const frameOpt = APPAREL_FRAME_OPTIONS.find(f => f.value === custom.frame) || APPAREL_FRAME_OPTIONS[0];
      extra += sizeOpt.priceModifier + frameOpt.priceModifier;
    } else if (item.category === 'cozy') {
      const sizeOpt = COZY_SIZE_OPTIONS.find(s => s.value === custom.size) || COZY_SIZE_OPTIONS[0];
      const frameOpt = COZY_FRAME_OPTIONS.find(f => f.value === custom.frame) || COZY_FRAME_OPTIONS[0];
      extra += sizeOpt.priceModifier + frameOpt.priceModifier;
    } else if (item.category === 'stationery') {
      const sizeOpt = STATIONERY_SIZE_OPTIONS.find(s => s.value === custom.size) || STATIONERY_SIZE_OPTIONS[0];
      const frameOpt = STATIONERY_FRAME_OPTIONS.find(f => f.value === custom.frame) || STATIONERY_FRAME_OPTIONS[0];
      extra += sizeOpt.priceModifier + frameOpt.priceModifier;
    } else if (item.category === 'plush') {
      const sizeOpt = PLUSH_SIZE_OPTIONS.find(s => s.value === custom.size) || PLUSH_SIZE_OPTIONS[0];
      const frameOpt = PLUSH_FRAME_OPTIONS.find(f => f.value === custom.frame) || PLUSH_FRAME_OPTIONS[0];
      extra += sizeOpt.priceModifier + frameOpt.priceModifier;
    }
    return acc + item.price + extra;
  }, 0);

  // Shares board URL
  const handleShareBoard = () => {
    if (wishlist.length === 0) {
      onTriggerToast('🌸 Pin some pretty artworks before sharing!');
      return;
    }
    const itemTitles = wishlist.map(item => item.character).join(', ');
    const message = `✨ Check out my fairy mood board from koji.studio! 🌸 Character prints: ${itemTitles} ✨`;
    try {
      navigator.clipboard.writeText(message);
      onTriggerToast('🌸 Copied mini mood board clipboard card to share with friends!');
    } catch {
      onTriggerToast('💞 Sharing board code: ' + itemTitles);
    }
  };

  return (
    <div
      id="wishlist-drawer-backdrop"
      className="fixed inset-0 bg-[#2B2D31]/45 backdrop-blur-xs z-50 flex justify-end select-none"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'wishlist-drawer-backdrop') onClose();
      }}
    >
      <motion.div
        id="wishlist-drawer-container"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-full max-w-sm bg-[#FDFBF7] border-l-2 border-[#2B2D31] h-full flex flex-col shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header content */}
        <div className="bg-[#FFB3C1] border-b-2 border-[#2B2D31] px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-charcoal fill-[#FF8097]" />
            <h2 className="font-display font-bold text-base text-[#2B2D31]">Your Lovely Wishlist</h2>
            <span className="bg-white text-xs font-bold border border-[#2B2D31] px-2 py-0.5 rounded-full font-mono shadow-[1px_1px_0px_0px_#2B2D31]">
              {wishlist.length}
            </span>
          </div>
          <button
            id="btn-close-wish"
            onClick={onClose}
            className="p-1 hover:bg-white/40 border border-transparent hover:border-charcoal rounded-full cursor-pointer transition-all"
          >
            <X className="h-5 w-5 text-charcoal" />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 grid-bg text-left">
          {wishlist.map((item) => {
            const currentCustom = getCustomization(item.id);
            const sizesList = item.category === 'apparel' 
              ? APPAREL_SIZE_OPTIONS 
              : item.category === 'cozy' 
                ? COZY_SIZE_OPTIONS 
                : item.category === 'stationery'
                  ? STATIONERY_SIZE_OPTIONS
                  : item.category === 'plush'
                    ? PLUSH_SIZE_OPTIONS
                    : SIZE_OPTIONS;

            const framesList = item.category === 'apparel' 
              ? APPAREL_FRAME_OPTIONS 
              : item.category === 'cozy' 
                ? COZY_FRAME_OPTIONS 
                : item.category === 'stationery'
                  ? STATIONERY_FRAME_OPTIONS
                  : item.category === 'plush'
                    ? PLUSH_FRAME_OPTIONS
                    : FRAME_OPTIONS;

            const sizeOpt = sizesList.find(s => s.value === currentCustom.size) || sizesList[1] || sizesList[0];
            const frameOpt = framesList.find(f => f.value === currentCustom.frame) || framesList[0];

            const hasModifiers = item.category === 'prints' || item.category === 'apparel' || item.category === 'cozy' || item.category === 'stationery' || item.category === 'plush';
            const itemUnitPrice = item.price + (hasModifiers ? (sizeOpt?.priceModifier || 0) + (frameOpt?.priceModifier || 0) : 0);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col bg-white border-2 border-[#2B2D31] rounded-2xl overflow-hidden p-3 gap-2.5 shadow-[2.5px_2.5px_0px_0px_#2B2D31] relative"
              >
                <div className="flex items-center gap-3">
                  {/* Small thumbnail aspect */}
                  <div className="h-16 w-12 rounded bg-cream border border-[#2B2D31] overflow-hidden flex-shrink-0 select-none">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Meta info of customization */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[9px] uppercase font-mono bg-[#82D1C1]/20 border border-[#82D1C1]/55 text-[#2B2D31] px-1.5 py-0.2 rounded font-bold">
                        {item.character}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-xs text-[#2B2D31] truncate mt-0.5">
                      {item.title}
                    </h4>
                  </div>

                  {/* Remove Button */}
                  <button
                    id={`btn-wishlist-remove-${item.id}`}
                    onClick={() => onRemoveItem(item)}
                    className="text-charcoal/40 hover:text-[#FF8097] p-1 rounded-full hover:bg-cream transition-all cursor-pointer flex-shrink-0 self-start"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Custom Options selectors within wishlist card */}
                {item.category !== 'accessories' ? (
                  <div className={`grid gap-2 bg-[#FDFBF7] p-1.5 rounded-xl border border-[#2B2D31]/10 text-left ${item.category === 'apparel' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {/* Size Selector */}
                    <div className="flex flex-col space-y-0.5 text-left">
                      <label className="text-[8px] uppercase font-mono font-bold text-charcoal/50">
                        {item.category === 'prints' ? '📏 CHOOSE SIZE' : item.category === 'apparel' ? '👚 APPAREL FIT' : item.category === 'stationery' ? '📇 PACK SIZE' : item.category === 'plush' ? '🧸 PLUSH SIZE' : '🧸 BUNDLE SIZE'}
                      </label>
                      <select
                        id={`wish-select-size-${item.id}`}
                        value={currentCustom.size}
                        onChange={(e) => updateCustomization(item.id, e.target.value as PrintSize, currentCustom.frame, currentCustom.color)}
                        className="bg-white border border-[#2B2D31]/15 text-[10px] font-bold rounded px-1.5 py-1 outline-none text-charcoal cursor-pointer font-sans"
                      >
                        {sizesList.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label.split(' Print')[0].replace('🌸 ', '').replace('🎀 ', '').replace('👑 ', '')} (${(item.price + opt.priceModifier).toFixed(0)})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Color Selector */}
                    {item.category === 'apparel' && (
                      <div className="flex flex-col space-y-0.5 text-left">
                        <label className="text-[8px] uppercase font-mono font-bold text-charcoal/50">
                          🎨 SWATCH COLOR
                        </label>
                        <select
                          id={`wish-select-color-${item.id}`}
                          value={currentCustom.color || 'White'}
                          onChange={(e) => updateCustomization(item.id, currentCustom.size, currentCustom.frame, e.target.value)}
                          className="bg-white border border-[#2B2D31]/15 text-[10px] font-bold rounded px-1.5 py-1 outline-none text-charcoal cursor-pointer font-sans"
                        >
                          {APPAREL_COLOR_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>
                              {opt.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Frame Selector */}
                    <div className="flex flex-col space-y-0.5 text-left">
                      <label className="text-[8px] uppercase font-mono font-bold text-charcoal/50">
                        {item.category === 'prints' ? '🖼️ CHOOSE FRAME' : item.category === 'apparel' ? '🎁 PREMIUM WRAP' : item.category === 'stationery' ? '🧁 GIFT PACKING' : item.category === 'plush' ? '🍓 LUXURY dustbag' : '🍵 PASTEL WRAP'}
                      </label>
                      <select
                        id={`wish-select-frame-${item.id}`}
                        value={currentCustom.frame}
                        onChange={(e) => updateCustomization(item.id, currentCustom.size, e.target.value as FrameColor, currentCustom.color)}
                        className="bg-white border border-[#2B2D31]/15 text-[10px] font-bold rounded px-1.5 py-1 outline-none text-[#2B2D31] cursor-pointer font-sans"
                      >
                        {framesList.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label.replace('🌸 ', '').replace('🍓 ', '').replace('🍵 ', '').replace('🌿 ', '').split(' wood ')[0].split(' Wood')[0]} ({opt.priceModifier > 0 ? `+$${opt.priceModifier}` : 'Standard'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="py-1.5 px-2.5 bg-cream rounded-xl text-[9px] font-mono text-charcoal/60 border border-[#2B2D31]/10 text-left">
                    🎁 Standard Boutique Packaged Accessory
                  </div>
                )}

                {/* Interactive Purchase Row */}
                <div className="flex justify-between items-center w-full mt-1 border-t border-[#2B2D31]/10 pt-2 text-left">
                  <div>
                    <span className="text-[10px] text-charcoal/50 font-mono">Art Combination:</span>
                    <p className="font-display font-bold text-xs text-[#2B2D31] leading-tight">
                      ${itemUnitPrice.toFixed(2)}
                    </p>
                  </div>

                  <button
                    id={`btn-wish-cart-${item.id}`}
                    onClick={() => {
                      onAddToCart(item, currentCustom.size, currentCustom.frame, 1, item.category === 'apparel' ? currentCustom.color || 'White' : undefined);
                      onRemoveItem(item); // Automatically convert love into basket and clear pin to keep things tidy!
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#82D1C1] hover:bg-[#59C1AF] text-[#2B2D31] font-bold text-[10.5px] rounded-lg border border-[#2B2D31] shadow-[1.5px_1.5px_0px_0px_#2B2D31] active:translate-x-[0.5px] active:translate-y-[0.5px] active:shadow-[1px_1px_0px_0px_#2B2D31] transition-all cursor-pointer"
                  >
                    Bag Custom Art <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {wishlist.length === 0 && (
            <div className="py-24 text-center space-y-3">
              <span className="text-4xl animate-pulse block">😻</span>
              <p className="font-display font-medium text-sm text-[#2B2D31]">No pinned dream prints yet</p>
              <p className="text-[10.5px] text-charcoal/50 max-w-[210px] mx-auto leading-normal">
                Click the lovely pink heart on products in the catalog to pin your favorite vibes onto this blackboard!
              </p>
            </div>
          )}
        </div>

        {/* Footer Area with Board Actions (Share + Estimation Recap) */}
        {wishlist.length > 0 && (
          <div className="bg-white border-t-2 border-[#2B2D31] p-5 space-y-4">
            <div className="bg-[#FDFBF7] p-2.5 rounded-xl border border-[#2B2D31]/10 space-y-1 text-xs">
              <div className="flex justify-between text-charcoal/70">
                <span>Pinned items count:</span>
                <span className="font-mono font-bold text-charcoal">{wishlist.length} Prints</span>
              </div>
              <div className="flex justify-between font-bold text-[#2B2D31] border-t border-[#2B2D31]/10 pt-1.5 uppercase font-display text-[10px]">
                <span>Est. board value:</span>
                <span className="text-pink-dark text-xs">${totalPriceEstimate.toFixed(2)}</span>
              </div>
            </div>

            <button
              id="btn-wish-share-clipboard"
              onClick={handleShareBoard}
              className="w-full py-2.5 bg-[#FFB3C1] hover:bg-[#FF8097] text-charcoal font-bold rounded-xl border-2 border-[#2B2D31] shadow-[2.5px_2.5px_0px_0px_#2B2D31] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_0px_#2B2D31] transition-all flex items-center justify-center gap-1.5 cursor-pointer text-xs font-display"
            >
              <Share2 className="h-4 w-4" /> Share My Mood Gallery
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

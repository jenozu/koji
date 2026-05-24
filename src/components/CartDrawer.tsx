import React, { useState } from 'react';
import { CartItem, PrintSize, FrameColor } from '../types';
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
import { X, Trash2, ShoppingBag, Gift, ArrowRight, Sparkles, Truck, CheckCircle, ChevronLeft } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartId: string, delta: number) => void;
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
  onUpdateCustomization?: (cartId: string, size: PrintSize, frame: FrameColor, color?: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onUpdateCustomization
}: CartDrawerProps) {
  if (!isOpen) return null;

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  
  // Checkout sequence wizard state: 'cart' | 'shipping' | 'success'
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'success'>('cart');
  const isCheckoutCompleted = checkoutStep === 'success';

  // Shipping details state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerPostcode, setCustomerPostcode] = useState('');
  const [customerGiftNote, setCustomerGiftNote] = useState('');
  const [checkoutValidationError, setCheckoutValidationError] = useState('');

  // Subtotal calculations
  const subtotal = cartItems.reduce((acc, item) => {
    let extra = 0;
    if (item.product.category === 'prints') {
      const sizeOpt = SIZE_OPTIONS.find(s => s.value === item.size) || SIZE_OPTIONS[1];
      const frameOpt = FRAME_OPTIONS.find(f => f.value === item.frame) || FRAME_OPTIONS[0];
      extra += sizeOpt.priceModifier + frameOpt.priceModifier;
    } else if (item.product.category === 'apparel') {
      const sizeOpt = APPAREL_SIZE_OPTIONS.find(s => s.value === item.size) || APPAREL_SIZE_OPTIONS[0];
      const frameOpt = APPAREL_FRAME_OPTIONS.find(f => f.value === item.frame) || APPAREL_FRAME_OPTIONS[0];
      extra += sizeOpt.priceModifier + frameOpt.priceModifier;
    } else if (item.product.category === 'cozy') {
      const sizeOpt = COZY_SIZE_OPTIONS.find(s => s.value === item.size) || COZY_SIZE_OPTIONS[0];
      const frameOpt = COZY_FRAME_OPTIONS.find(f => f.value === item.frame) || COZY_FRAME_OPTIONS[0];
      extra += sizeOpt.priceModifier + frameOpt.priceModifier;
    } else if (item.product.category === 'stationery') {
      const sizeOpt = STATIONERY_SIZE_OPTIONS.find(s => s.value === item.size) || STATIONERY_SIZE_OPTIONS[0];
      const frameOpt = STATIONERY_FRAME_OPTIONS.find(f => f.value === item.frame) || STATIONERY_FRAME_OPTIONS[0];
      extra += sizeOpt.priceModifier + frameOpt.priceModifier;
    } else if (item.product.category === 'plush') {
      const sizeOpt = PLUSH_SIZE_OPTIONS.find(s => s.value === item.size) || PLUSH_SIZE_OPTIONS[0];
      const frameOpt = PLUSH_FRAME_OPTIONS.find(f => f.value === item.frame) || PLUSH_FRAME_OPTIONS[0];
      extra += sizeOpt.priceModifier + frameOpt.priceModifier;
    }
    const unitPrice = item.product.price + extra;
    return acc + (unitPrice * item.quantity);
  }, 0);

  const discountAmount = subtotal * (discountPercent / 100);
  const shippingCost = cartItems.length === 0 ? 0 : (shippingMethod === 'standard' ? 3.99 : 9.99);
  const finalTotal = subtotal - discountAmount + shippingCost;

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCoupon = couponCode.trim().toUpperCase();
    if (cleanCoupon === 'KAWAII10') {
      setDiscountPercent(10);
      setCouponSuccess('⚡ Sweet! 10% discount applied to your lovely order!');
      setCouponError('');
    } else if (cleanCoupon === 'STKCARDS') {
      setDiscountPercent(15);
      setCouponSuccess('🍓 Marvelous! 15% discount applied successfully!');
      setCouponError('');
    } else {
      setCouponError('❌ Ahh, invalid cupcake coupon! Try writing KAWAII10 or STKCARDS');
      setCouponSuccess('');
    }
  };

  const handleCheckout = () => {
    setCheckoutStep('shipping');
  };

  const handlePlaceFinalOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !customerAddress.trim() || !customerCity.trim() || !customerPostcode.trim()) {
      setCheckoutValidationError('🌸 Oh darling, please fill in all the delivery spots!');
      return;
    }
    if (!customerEmail.includes('@') || customerEmail.length < 5) {
      setCheckoutValidationError('🌸 Hmmm, that email address does not look quite starry enough!');
      return;
    }
    setCheckoutValidationError('');
    setCheckoutStep('success');
  };

  const handleCloseReceipt = () => {
    setCheckoutStep('cart');
    // Clear details
    setCustomerName('');
    setCustomerEmail('');
    setCustomerAddress('');
    setCustomerCity('');
    setCustomerPostcode('');
    setCustomerGiftNote('');
    onClearCart();
    onClose();
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 bg-[#2B2D31]/40 backdrop-blur-xs z-50 flex justify-end select-none"
      onClick={(e) => {
        if ((e.target as HTMLElement).id === 'cart-drawer-backdrop') onClose();
      }}
    >
      <motion.div
        id="cart-drawer-container"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md bg-[#FDFBF7] border-l-2 border-[#2B2D31] h-full flex flex-col shadow-2xl relative"
      >
        {/* Header content */}
        <div className="bg-[#82D1C1] border-b-2 border-[#2B2D31] px-5 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {checkoutStep === 'shipping' && (
              <button
                id="btn-back-to-cart"
                onClick={() => setCheckoutStep('cart')}
                className="p-1 hover:bg-white/40 border border-transparent hover:border-charcoal rounded-full cursor-pointer mr-1 relative z-10 active:scale-95"
              >
                <ChevronLeft className="h-5 w-5 text-[#2B2D31]" />
              </button>
            )}
            <ShoppingBag className="h-5 w-5 text-charcoal" />
            <h2 className="font-display font-bold text-base text-[#2B2D31]">
              {checkoutStep === 'shipping' ? 'Starry Secure Delivery' : 'Your Magical Shopping Bag'}
            </h2>
            {checkoutStep !== 'shipping' && (
              <span className="bg-[#FFB3C1] text-xs font-bold border border-[#2B2D31] px-2 py-0.5 rounded-full font-mono shadow-[1px_1px_0px_0px_#2B2D31]">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </div>
          <button
            id="btn-close-cart"
            onClick={onClose}
            className="p-1 hover:bg-white/40 border border-transparent hover:border-charcoal rounded-full transition-all cursor-pointer animate-pulse"
          >
            <X className="h-5 w-5 text-charcoal" />
          </button>
        </div>

        {/* Dynamic scroll content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 grid-bg">
          {checkoutStep === 'success' ? (
            /* Checkout Success Invoice */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-[#2B2D31] rounded-2xl p-5 shadow-[4px_4px_0px_0px_#82D1C1] text-center space-y-4 my-2"
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-[#82D1C1]/20 border border-[#2B2D31] flex items-center justify-center text-2xl select-none animate-bounce">
                🎉
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-[#2B2D31]">Order Placed with Love!</h3>
                <p className="text-[11px] text-charcoal/50 mt-1">Receipt ID: #KOJI-{Math.floor(Math.random() * 90000 + 10000)}</p>
              </div>

              {/* Delivery Receipt Metadata Block */}
              <div className="p-3 bg-cream border border-[#2B2D31]/10 rounded-xl text-left text-xs space-y-1 bg-[#FDFBF7] shadow-inner">
                <p className="font-display font-bold text-[#FF8097] text-[10px] tracking-wider uppercase border-b border-[#2B2D31]/10 pb-1 mb-1.5 flex items-center gap-1">
                  <span>📬 Delivery Destination Spot</span>
                </p>
                <div className="space-y-0.5 text-charcoal/80 font-mono text-[10.5px]">
                  <p><span className="text-charcoal font-semibold font-sans">To:</span> {customerName}</p>
                  <p><span className="text-charcoal font-semibold font-sans">E-mail:</span> {customerEmail}</p>
                  <p className="not-italic"><span className="text-charcoal font-semibold font-sans">Deliver:</span> {customerAddress}, {customerCity}, {customerPostcode}</p>
                  {customerGiftNote && (
                    <div className="mt-2 p-2 bg-white border border-[#2B2D31]/10 border-dashed rounded text-[10px] leading-relaxed relative">
                      <span className="absolute -top-1.5 right-2 bg-[#FFB3C1] text-[#2B2D31] text-[7px] border border-[#2B2D31] px-1 font-bold rounded">GIFT MESSAGE</span>
                      <p className="italic text-charcoal/70">&ldquo;{customerGiftNote}&rdquo;</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-[#FDFBF7] border border-[#2B2D31]/10 rounded-xl space-y-2 text-left text-xs font-mono">
                <p className="font-bold border-b border-[#2B2D31]/10 pb-1 flex justify-between">
                  <span>ITEM SUMMARY</span>
                  <span>QTY</span>
                </p>
                {cartItems.map(item => (
                  <div key={item.cartId} className="flex justify-between text-charcoal/80 text-[11px]">
                    <span className="truncate max-w-[180px]">
                      {item.product.character} ({item.size.replace('_', ' ')})
                    </span>
                    <span>x{item.quantity}</span>
                  </div>
                ))}
                
                <hr className="border-[#2B2D31]/10 my-2" />
                
                <div className="space-y-1 text-[11px]">
                  <p className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </p>
                  {discountPercent > 0 && (
                    <p className="flex justify-between text-pink-dark">
                      <span>Discount:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </p>
                  )}
                  <p className="flex justify-between">
                    <span>Shipping ({shippingMethod === 'standard' ? 'Postal' : 'Carry'}):</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </p>
                  <p className="flex justify-between font-bold border-t border-[#2B2D31]/10 pt-1.5 text-xs text-[#2B2D31]">
                    <span>Total Charged:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[11px] text-charcoal/70 leading-relaxed italic">
                  📦 Your retro-pastel prints are being wrapped with silk ribbons and flower fragrance! We will shoot a magical parcel tracking bird your way super soon.
                </p>
                <button
                  id="btn-confirm-order-close"
                  onClick={handleCloseReceipt}
                  className="w-full py-2.5 bg-[#FFB3C1] hover:bg-[#FF8097] text-charcoal font-bold rounded-xl border border-[#2B2D31] shadow-[2px_2px_0px_0px_#2B2D31] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#2B2D31] transition-all cursor-pointer text-xs font-display"
                >
                  Return & Clear Bag 🌸
                </button>
              </div>
            </motion.div>
          ) : checkoutStep === 'shipping' ? (
            /* Delivery Address Entry Form */
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-[#2B2D31] rounded-2xl p-5 shadow-[3px_3px_0px_0px_#82D1C1] text-left space-y-4 my-2"
            >
              <div className="border-b border-[#2B2D31]/15 pb-2">
                <h3 className="font-display font-bold text-sm text-[#2B2D31] flex items-center gap-1">
                  📫 Delivery Address details
                </h3>
                <p className="text-[10px] text-charcoal/50 mt-1 font-medium leading-normal">
                  Fill in where the carrier bird should deliver your starry art parcel!
                </p>
              </div>

              <form id="shipping-details-form" onSubmit={handlePlaceFinalOrder} className="space-y-3.5">
                {checkoutValidationError && (
                  <p className="text-[10px] text-red-500 font-bold bg-red-50 p-2.5 border border-red-200 rounded-lg">
                    {checkoutValidationError}
                  </p>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-charcoal/60">Full Name *</label>
                  <input
                    id="shipping-input-name"
                    type="text"
                    required
                    placeholder="e.g. Sakura Kinomoto"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#2B2D31]/30 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#82D1C1]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-charcoal/60">Magical E-mail *</label>
                  <input
                    id="shipping-input-email"
                    type="email"
                    required
                    placeholder="e.g. sakura@sweetberry.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#2B2D31]/30 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-[#82D1C1]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-charcoal/60">Street Address *</label>
                  <input
                    id="shipping-input-address"
                    type="text"
                    required
                    placeholder="e.g. 14 Flower Meadow Lane"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#2B2D31]/30 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#82D1C1]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-charcoal/60">Town / City *</label>
                    <input
                      id="shipping-input-city"
                      type="text"
                      required
                      placeholder="Strawberry Valley"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#2B2D31]/30 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#82D1C1]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-charcoal/60">Postcode / Zip *</label>
                    <input
                      id="shipping-input-postcode"
                      type="text"
                      required
                      placeholder="CP-9012"
                      value={customerPostcode}
                      onChange={(e) => setCustomerPostcode(e.target.value)}
                      className="w-full bg-[#FDFBF7] border border-[#2B2D31]/30 rounded-xl px-3 py-2 text-xs font-bold outline-none font-mono focus:border-[#82D1C1]"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-0.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] uppercase font-mono tracking-wider font-bold text-charcoal/60">Gift Note (Optional)</label>
                    <span className="text-[9px] font-bold text-[#FF8097]">🎀 Free cute wrapping!</span>
                  </div>
                  <textarea
                    id="shipping-input-giftnote"
                    placeholder="e.g. Happy Birthday sweet AMI!-chan! Enjoy your Nezuko print!..."
                    rows={2}
                    value={customerGiftNote}
                    onChange={(e) => setCustomerGiftNote(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#2B2D31]/30 rounded-xl p-3 text-xs font-medium outline-none focus:border-[#82D1C1] leading-relaxed resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="hidden"
                  id="shipping-form-hidden-submit"
                />
              </form>
            </motion.div>
          ) : (
            /* Standard Items List */
            <>
              {cartItems.map((item) => {
                const sizesList = item.product.category === 'apparel' 
                  ? APPAREL_SIZE_OPTIONS 
                  : item.product.category === 'cozy' 
                    ? COZY_SIZE_OPTIONS 
                    : item.product.category === 'stationery'
                      ? STATIONERY_SIZE_OPTIONS
                      : item.product.category === 'plush'
                        ? PLUSH_SIZE_OPTIONS
                        : SIZE_OPTIONS;

                const framesList = item.product.category === 'apparel' 
                  ? APPAREL_FRAME_OPTIONS 
                  : item.product.category === 'cozy' 
                    ? COZY_FRAME_OPTIONS 
                    : item.product.category === 'stationery'
                      ? STATIONERY_FRAME_OPTIONS
                      : item.product.category === 'plush'
                        ? PLUSH_FRAME_OPTIONS
                        : FRAME_OPTIONS;

                const sizeOpt = sizesList.find(s => s.value === item.size) || sizesList[1] || sizesList[0];
                const frameOpt = framesList.find(f => f.value === item.frame) || framesList[0];

                const hasModifiers = item.product.category === 'prints' || item.product.category === 'apparel' || item.product.category === 'cozy' || item.product.category === 'stationery' || item.product.category === 'plush';
                const itemUnitPrice = item.product.price + (hasModifiers ? (sizeOpt?.priceModifier || 0) + (frameOpt?.priceModifier || 0) : 0);
                const itemTotalPrice = itemUnitPrice * item.quantity;

                // Simple simulated low-stock alert when user increases item volumes!
                const showsLowStockAlert = item.quantity >= 3;

                return (
                  <motion.div
                    key={item.cartId}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col bg-white border-2 border-[#2B2D31] rounded-2xl overflow-hidden shadow-[2.5px_2.5px_0px_0px_#2B2D31] p-3 gap-2.5 relative"
                  >
                    <div className="flex items-center gap-3">
                      {/* Small thumbnail aspect */}
                      <div className="h-16 w-12 rounded bg-cream border border-[#2B2D31] overflow-hidden flex-shrink-0 select-none">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.title}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Meta info of customization */}
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] uppercase font-mono bg-[#FFB3C1]/30 border border-pink text-[#2B2D31] px-1.5 py-0.2 rounded font-bold">
                            {item.product.character}
                          </span>
                          <span className="text-[9px] text-[#2B2D31]/50 font-mono">
                            {item.product.franchise}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-xs text-[#2B2D31] truncate mt-0.5">
                          {item.product.title}
                        </h4>
                      </div>

                      {/* Remove Button */}
                      <button
                        id={`btn-remove-item-${item.cartId}`}
                        onClick={() => onRemoveItem(item.cartId)}
                        className="text-charcoal/40 hover:text-[#FF8097] p-1.5 rounded-full hover:bg-cream transition-all cursor-pointer flex-shrink-0 self-start"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Inline Config Options based on categories */}
                    {item.product.category !== 'accessories' ? (
                      <div className={`grid gap-2 bg-[#FDFBF7] p-1.5 rounded-xl border border-[#2B2D31]/10 font-sans ${item.product.category === 'apparel' ? 'grid-cols-3' : 'grid-cols-2'}`}>
                        {/* Size Selector Dropdown */}
                        <div className="flex flex-col space-y-0.5 text-left">
                          <label className="text-[8px] uppercase font-mono font-bold text-charcoal/50">
                            {item.product.category === 'prints' ? '📏 PRINT SIZE' : item.product.category === 'apparel' ? '👚 APPAREL FIT' : item.product.category === 'stationery' ? '📇 PACK SIZE' : item.product.category === 'plush' ? '🧸 PLUSH SIZE' : '🧸 BUNDLE SIZE'}
                          </label>
                          <select
                            id={`select-size-${item.cartId}`}
                            value={item.size}
                            onChange={(e) => onUpdateCustomization?.(item.cartId, e.target.value as any, item.frame, item.color)}
                            className="bg-white border border-[#2B2D31]/15 text-[10px] font-bold rounded px-1.5 py-1 outline-none text-charcoal cursor-pointer font-sans"
                          >
                            {sizesList.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label.split(' Print')[0].replace('🌸 ', '').replace('🎀 ', '').replace('👑 ', '')} (${(item.product.price + opt.priceModifier).toFixed(0)})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Apparel Color Dropdown */}
                        {item.product.category === 'apparel' && (
                          <div className="flex flex-col space-y-0.5 text-left">
                            <label className="text-[8px] uppercase font-mono font-bold text-charcoal/50">
                              🎨 SWATCH COLOR
                            </label>
                            <select
                              id={`select-color-${item.cartId}`}
                              value={item.color || 'White'}
                              onChange={(e) => onUpdateCustomization?.(item.cartId, item.size, item.frame, e.target.value)}
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

                        {/* Frame Color Dropdown */}
                        <div className="flex flex-col space-y-0.5 text-left">
                          <label className="text-[8px] uppercase font-mono font-bold text-charcoal/50">
                            {item.product.category === 'prints' ? '🖼️ CUSTOM FRAME' : item.product.category === 'apparel' ? '🎁 PREMIUM WRAP' : item.product.category === 'stationery' ? '🧁 GIFT PACKING' : item.product.category === 'plush' ? '🍓 LUXURY dustbag' : '🍵 PASTEL WRAP'}
                          </label>
                          <select
                            id={`select-frame-${item.cartId}`}
                            value={item.frame}
                            onChange={(e) => onUpdateCustomization?.(item.cartId, item.size, e.target.value as any, item.color)}
                            className="bg-white border border-[#2B2D31]/15 text-[10px] font-bold rounded px-1.5 py-1 outline-none text-charcoal cursor-pointer font-sans"
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

                    {/* Dynamic low stock alert & increments row */}
                    <div className="flex justify-between items-center w-full mt-0.5 border-t border-[#2B2D31]/10 pt-2 text-left">
                      <div>
                        {showsLowStockAlert ? (
                          <span className="text-[9.5px] text-[#FF8097] font-bold animate-pulse font-mono block">
                            ⚠️ Only 2 prints remaining in bunny mail storage!
                          </span>
                        ) : (
                          <span className="text-[9.5px] text-green-600 font-bold font-mono block">
                            🍒 Small batch pressed and available
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2.5">
                        {/* Incrementor */}
                        <div className="flex border border-[#2B2D31] rounded-md bg-white overflow-hidden text-[9px] font-mono font-bold">
                          <button
                            id={`btn-cart-dec-${item.cartId}`}
                            onClick={() => onUpdateQuantity(item.cartId, -1)}
                            className="px-2 py-0.5 hover:bg-cream cursor-pointer border-r border-[#2B2D31]"
                          >
                            -
                          </button>
                          <span className="px-2 font-bold text-center inline-block w-5">
                            {item.quantity}
                          </span>
                          <button
                            id={`btn-cart-inc-${item.cartId}`}
                            onClick={() => onUpdateQuantity(item.cartId, 1)}
                            className="px-2 py-0.5 hover:bg-cream cursor-pointer border-l border-[#2B2D31]"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-xs font-bold font-display text-charcoal">
                          ${itemTotalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {cartItems.length === 0 && (
                <div role="status" className="py-20 text-center space-y-3">
                  <div className="mx-auto h-12 w-12 rounded-full border border-charcoal/20 bg-cream flex items-center justify-center text-xl select-none">
                    👜
                  </div>
                  <div>
                    <p className="font-display font-bold text-[#2B2D31] text-sm">Your shopping bag is empty</p>
                    <p className="text-[11px] text-charcoal/60 mt-1 max-w-[200px] mx-auto leading-relaxed">
                      Time to discover lovely ribbons, cherry blossoms, and cute kitty companions!
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Dynamic Pricing / Discounts & checkout controls footer */}
        {!isCheckoutCompleted && cartItems.length > 0 && (
          <div className="bg-white border-t-2 border-[#2B2D31] p-5 space-y-3">
            
            {/* Promo code drawer - Only show in standard cart view */}
            {checkoutStep === 'cart' && (
              <>
                <form id="coupon-form" onSubmit={applyCoupon} className="flex gap-2">
                  <input
                    id="input-coupon"
                    type="text"
                    placeholder="PROMO CODE (e.g. KAWAII10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 text-xs border border-[#2B2D31] bg-cream rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-[#82D1C1]"
                  />
                  <button
                    id="btn-apply-coupon"
                    type="submit"
                    className="text-xs font-bold px-4 py-2 bg-white hover:bg-[#FFB3C1]/20 border border-[#2B2D31] rounded-xl transition-all cursor-pointer shadow-[1.5px_1.5px_0px_0px_#2B2D31] active:translate-y-0.5 active:shadow-[0.5px_0.5px_0px_0px_#2B2D31]"
                  >
                    Apply
                  </button>
                </form>
                
                {couponError && <p className="text-[9px] text-red-500 font-semibold">{couponError}</p>}
                {couponSuccess && <p className="text-[9px] text-green-600 font-semibold">{couponSuccess}</p>}

                {/* Delivery service speed selectors */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#2B2D31]/10">
                  <button
                    id="btn-ship-standard"
                    onClick={() => setShippingMethod('standard')}
                    className={`p-2 border rounded-xl text-left cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'bg-[#82D1C1]/20 border-[#2B2D31] font-bold shadow-xs'
                        : 'bg-[#FDFBF7] border-[#2B2D31]/15 opacity-80'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[10px] font-bold">📦 Bubble Postal</span>
                      <span className="text-[10px] font-mono">$3.99</span>
                    </div>
                    <p className="text-[9px] text-charcoal/50 mt-1 leading-none">Wrapped carefully • 5 days</p>
                  </button>

                  <button
                    id="btn-ship-express"
                    onClick={() => setShippingMethod('express')}
                    className={`p-2 border rounded-xl text-left cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'bg-[#FFF3E0]/20 border-[#2B2D31] font-bold shadow-xs'
                        : 'bg-[#FDFBF7] border-[#2B2D31]/15 opacity-80'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="text-[10px] font-bold flex items-center gap-0.5">🐇 Spirit Carry</span>
                      <span className="text-[10px] font-mono">$9.99</span>
                    </div>
                    <p className="text-[9px] text-charcoal/50 mt-1 leading-none font-medium">Bouncing carriage • 2 days</p>
                  </button>
                </div>
              </>
            )}

            {/* Mathematical Totals pricing breakdown (Always show as recap) */}
            <div className="space-y-1 text-xs border-t border-[#2B2D31]/10 pt-3">
              <div className="flex justify-between text-charcoal/70">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">${subtotal.toFixed(2)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-pink-dark">
                  <span>Sweet Discount ({discountPercent}%):</span>
                  <span className="font-mono font-bold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-charcoal/70">
                <span>Shipping ({shippingMethod === 'standard' ? 'Postal' : 'Carry'}):</span>
                <span className="font-mono font-bold">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold border-t border-[#2B2D31]/10 pt-2 text-[#2B2D31]">
                <span>Total order:</span>
                <span className="text-sm text-pink-dark font-display font-bold">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Clear bag confirmation helper inside Cart Drawer */}
            {checkoutStep === 'cart' && (
              <div className="flex justify-end pt-1">
                <button
                  id="btn-cart-clear-bag"
                  onClick={() => {
                    const confirmClear = window.confirm('🌸 Do you really want to clear your beautiful canvas prints bag?');
                    if (confirmClear) onClearCart();
                  }}
                  className="text-[10px] font-mono font-bold text-charcoal/30 hover:text-charcoal cursor-pointer flex items-center justify-center gap-1 hover:underline active:scale-95 transition-all text-right"
                >
                  [ Clear entire shopping bag ]
                </button>
              </div>
            )}

            {/* Checkout Wizard Triggers */}
            {checkoutStep === 'shipping' ? (
              <button
                id="btn-ship-submit-trigger"
                onClick={(e) => {
                  const subForm = document.getElementById('shipping-form-hidden-submit');
                  if (subForm) subForm.click();
                }}
                className="w-full mt-2 py-3 bg-[#82D1C1] hover:bg-[#59C1AF] text-[#2B2D31] font-bold rounded-xl border-2 border-[#2B2D31] shadow-[3px_3px_0px_0px_#2B2D31] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_0px_#2B2D31] transition-all flex items-center justify-center gap-2 cursor-pointer font-display text-sm"
              >
                Place Magical Order ✨ <Sparkles className="h-4.5 w-4.5 text-[#FF8097] fill-[#FF8097] animate-spin" />
              </button>
            ) : (
              <button
                id="btn-checkout-trigger"
                onClick={handleCheckout}
                className="w-full mt-2 py-3 bg-[#FFB3C1] hover:bg-[#FF8097] text-[#2B2D31] font-bold rounded-xl border-2 border-[#2B2D31] shadow-[3px_3px_0px_0px_#2B2D31] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_0px_#2B2D31] transition-all flex items-center justify-center gap-2 cursor-pointer font-display text-sm"
              >
                Confirm Order Details <ArrowRight className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}

import React from 'react';
import { Product } from '../types';
import { Heart, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}: ProductCardProps) {
  // Extract main pastel colors
  const primaryColor = product.colors[0];

  return (
    <div
      id={`card-${product.id}`}
      className="group bg-white border-2 border-[#2B2D31] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#2B2D31] hover:shadow-[8px_8px_0px_0px_#FFB3C1] active:shadow-[2px_2px_0px_0px_#2B2D31] translate-y-0 hover:-translate-y-1 active:translate-y-0.5 transition-all duration-200 flex flex-col h-full"
    >
      {/* Visual representation card frame */}
      <div id={`frame-img-${product.id}`} className="relative aspect-[3/4] bg-cream border-b-2 border-[#2B2D31] overflow-hidden select-none">
        
        {/* Floating Tag */}
        {product.tag && (
          <span
            id={`tag-${product.id}`}
            className="absolute top-2.5 left-2.5 z-10 bg-[#FFB3C1] text-[#2B2D31] text-[10px] font-bold tracking-wide px-2.5 py-0.5 border border-[#2B2D31] rounded-md shadow-[1.5px_1.5px_0px_0px_#2B2D31]"
          >
            🌸 {product.tag}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          id={`btn-wish-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-2.5 right-2.5 z-10 p-2 bg-white/90 hover:bg-[#FFB3C1] border border-[#2B2D31] rounded-full text-[#141414] hover:text-[#2B2D31] active:scale-90 transition-all shadow-[1.5px_1.5px_0px_0px_#2B2D31] cursor-pointer"
        >
          <Heart
            className={`h-4.5 w-4.5 transition-colors duration-150 ${
              isWishlisted ? 'fill-[#FF8097] text-[#FF8097]' : 'text-[#2B2D31]'
            }`}
          />
        </button>

        {/* Product Artwork Img */}
        <img
          id={`img-art-${product.id}`}
          src={product.imageUrl}
          alt={product.title}
          onClick={() => onViewDetails(product)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
        />

        {/* Interactive hover overlay for quick details */}
        <div
          onClick={() => onViewDetails(product)}
          className="absolute inset-0 bg-[#2B2D31]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
        />
      </div>

      {/* Narrative Cataloging Card Body */}
      <div id={`body-card-${product.id}`} className="p-3.5 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono tracking-widest text-charcoal/60">
            {product.franchise}
          </span>
          <span className="text-[10px] bg-cream text-charcoal/70 border border-charcoal/20 px-1.5 py-0.5 rounded font-medium capitalize">
            {product.category}
          </span>
        </div>

        <h3
          id={`title-${product.id}`}
          onClick={() => onViewDetails(product)}
          className="font-display font-bold text-sm text-[#2B2D31] mt-1.5 line-clamp-1 group-hover:text-[#FF8097] transition-colors cursor-pointer"
        >
          {product.title}
        </h3>

        <p className="text-[11px] text-charcoal/75 mt-1 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Stars rating */}
        <div className="flex items-center gap-1 mt-2.5">
          <div className="flex text-amber-400 select-none">
            {'★'.repeat(Math.round(product.rating))}
            {product.rating % 1 !== 0 && '½'}
          </div>
          <span className="text-[10px] text-charcoal/50 font-mono font-bold">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price & CTA Section */}
        <div className="flex items-center justify-between mt-3.5 pt-2.5 border-t border-[#2B2D31]/15">
          <div>
            <span className="text-[10px] text-charcoal/50 font-mono">From</span>
            <p className="font-display text-[#2B2D31] font-bold text-base leading-none">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <button
            id={`btn-add-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#82D1C1] hover:bg-[#59C1AF] text-[#2B2D31] font-bold text-xs rounded-xl border border-[#2B2D31] shadow-[2.5px_2.5px_0px_0px_#2B2D31] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1.5px_1.5px_0px_0px_#2B2D31] transition-all cursor-pointer"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Quick Add
          </button>
        </div>
      </div>
    </div>
  );
}

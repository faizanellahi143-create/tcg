import React, { useState } from 'react';
import { Heart, Search, Plus, Minus, ShoppingCart, TrendingUp } from 'lucide-react';
import { GundamCard } from '../types/card';
import { CardGrid } from './CardGrid';
import { CardDetailModal } from './CardDetailModal';

interface WishlistProps {
  wishlist: GundamCard[];
  allCards: GundamCard[];
  onAddToWishlist: (card: GundamCard) => void;
  onRemoveFromWishlist: (card: GundamCard) => void;
  onCardClick: (card: GundamCard) => void;
}

export const Wishlist: React.FC<WishlistProps> = ({
  wishlist,
  allCards,
  onAddToWishlist,
  onRemoveFromWishlist,
  onCardClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'wishlist' | 'browse'>('wishlist');
  const [selectedCard, setSelectedCard] = useState<GundamCard | null>(null);

  const wishlistIds = new Set(wishlist.map(card => card.id));
  
  const filteredCards = (viewMode === 'wishlist' ? wishlist : allCards).filter(card => {
    return card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           card.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalWishlistValue = wishlist.reduce((sum, card) => sum + (card.marketPrice || 0), 0);
  const averageCardPrice = wishlist.length > 0 ? totalWishlistValue / wishlist.length : 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="text-pink-400" size={24} />
          <h2 className="text-2xl font-bold text-white">My Wishlist</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Cards Wanted</div>
            <div className="text-2xl font-bold text-white">{wishlist.length}</div>
            <div className="text-xs text-gray-500">Total items</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Value</div>
            <div className="text-2xl font-bold text-pink-400">${totalWishlistValue.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-xs text-pink-300">
              <TrendingUp size={12} />
              <span>Market estimate</span>
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Avg. Price</div>
            <div className="text-2xl font-bold text-green-400">${averageCardPrice.toFixed(2)}</div>
            <div className="text-xs text-gray-500">Per card</div>
          </div>
        </div>

        {wishlist.length > 0 && (
          <div className="mt-4 flex gap-2">
            <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition-colors">
              <ShoppingCart size={16} />
              Find Best Prices
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              <Plus size={16} />
              Export List
            </button>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('wishlist')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'wishlist'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              My Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => setViewMode('browse')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'browse'
                  ? 'bg-blue-800 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              Browse All Cards
            </button>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-white font-semibold text-lg">
            {viewMode === 'wishlist' ? 'Wishlist Cards' : 'Browse Cards'}
          </h3>
          <p className="text-gray-400 text-sm">
            {filteredCards.length} cards found
          </p>
        </div>

        {filteredCards.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Heart size={48} className="mx-auto mb-4 opacity-50" />
            <div className="text-lg mb-2">
              {viewMode === 'wishlist' ? 'Your wishlist is empty' : 'No cards found'}
            </div>
            <div className="text-sm">
              {viewMode === 'wishlist' 
                ? 'Browse cards and add them to your wishlist!' 
                : 'Try adjusting your search terms'
              }
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {filteredCards.map((card) => {
              const isInWishlist = wishlistIds.has(card.id);
              
              return (
                <div key={card.id} className="relative">
                  <div
                    onClick={() => setSelectedCard(card)}
                    className={`relative group bg-slate-700 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer ${
                      isInWishlist ? 'border-pink-400 bg-pink-950/20' : 'border-gray-600'
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-32 sm:h-40 object-cover"
                      loading="lazy"
                    />
                    
                    {/* Cost */}
                    <div className="absolute top-1 left-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {card.cost}
                    </div>
                    
                    {/* Wishlist indicator */}
                    {isInWishlist && (
                      <div className="absolute top-1 right-1 w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center">
                        <Heart size={12} fill="currentColor" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2">
                    <div className="text-white text-xs font-medium truncate" title={card.name}>
                      {card.name}
                    </div>
                    <div className="text-gray-400 text-xs">{card.id}</div>
                    
                    {card.marketPrice && (
                      <div className="text-green-400 text-xs font-medium">
                        ${card.marketPrice}
                      </div>
                    )}
                  </div>
                  
                  {/* Wishlist controls */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    {isInWishlist ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromWishlist(card);
                        }}
                        className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToWishlist(card);
                        }}
                        className="w-6 h-6 bg-pink-600 hover:bg-pink-700 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </div>
  );
};
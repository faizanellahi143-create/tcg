import React, { useState } from 'react';
import { Package, Heart, Search, Plus, Minus, Star, TrendingUp, ShoppingCart, ExternalLink, AlertCircle } from 'lucide-react';
import { GundamCard } from '../types/card';
import { CardDetailModal } from './CardDetailModal';

interface MyCardsProps {
  collection: GundamCard[];
  wishlist: GundamCard[];
  allCards: GundamCard[];
  onAddToCollection: (card: GundamCard) => void;
  onRemoveFromCollection: (card: GundamCard) => void;
  onAddToWishlist: (card: GundamCard) => void;
  onRemoveFromWishlist: (card: GundamCard) => void;
  onCardClick: (card: GundamCard) => void;
  setIsDraggingCard?: (isDragging: boolean) => void;
}

export const MyCards: React.FC<MyCardsProps> = ({
  collection,
  wishlist,
  allCards,
  onAddToCollection,
  onRemoveFromCollection,
  onAddToWishlist,
  onRemoveFromWishlist,
  onCardClick,
  setIsDraggingCard
}) => {
  const [activeView, setActiveView] = useState<'collection' | 'wishlist' | 'all' | 'missing'>('collection');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState<GundamCard | null>(null);

  const collectionIds = new Set(collection.map(card => card.id));
  const wishlistIds = new Set(wishlist.map(card => card.id));
  
  const collectionQuantities = collection.reduce((acc, card) => {
    acc[card.id] = (acc[card.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalCollectionValue = collection.reduce((sum, card) => sum + (card.marketPrice || 0), 0);
  const totalWishlistValue = wishlist.reduce((sum, card) => sum + (card.marketPrice || 0), 0);
  const totalAllCardsValue = allCards.reduce((sum, card) => sum + (card.marketPrice || 0), 0);
  const averageAllCardsPrice = allCards.length > 0 ? totalAllCardsValue / allCards.length : 0;
  const completionPercentage = Math.round((collection.length / allCards.length) * 100);
  const missingCards = allCards.filter(card => !collectionIds.has(card.id));
  const missingCardsValue = missingCards.reduce((sum, card) => sum + (card.marketPrice || 0), 0);

  const currentCards = activeView === 'collection' ? collection : 
                      activeView === 'wishlist' ? wishlist : 
                      activeView === 'missing' ? missingCards :
                      allCards;
  const filteredCards = currentCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {activeView === 'collection' ? (
              <Package className="text-blue-400" size={24} />
            ) : (
              <Heart className="text-pink-400" size={24} />
            )}
            <h2 className="text-2xl font-bold text-white">My Cards</h2>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('collection')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'collection'
                  ? 'bg-blue-800 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <Package size={16} />
              Collection ({collection.length})
            </button>
            <button
              onClick={() => setActiveView('wishlist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'wishlist'
                  ? 'bg-pink-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <Heart size={16} />
              Wishlist ({wishlist.length})
            </button>
            <button
              onClick={() => setActiveView('missing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'missing'
                  ? 'bg-orange-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <AlertCircle size={16} />
              Missing ({missingCards.length})
            </button>
            <button
              onClick={() => setActiveView('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeView === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              <Package size={16} />
              All Cards ({allCards.length})
            </button>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {activeView === 'collection' || activeView === 'missing' || activeView === 'all' ? (
            <>
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm">
                  {activeView === 'collection' ? 'Cards Owned' : 
                   activeView === 'missing' ? 'Cards Missing' : 'Total Cards'}
                </div>
                <div className="text-2xl font-bold text-white">
                  {activeView === 'collection' ? collection.length : 
                   activeView === 'missing' ? missingCards.length : allCards.length}
                </div>
                <div className="text-xs text-gray-500">
                  {activeView === 'collection' ? `of ${allCards.length} total` : 
                   activeView === 'missing' ? `to complete collection` : 'Available cards'}
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm">
                  {activeView === 'all' ? 'Total Value' : 'Completion'}
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {activeView === 'all' ? `$${totalAllCardsValue.toFixed(2)}` : `${completionPercentage}%`}
                </div>
                <div className={activeView === 'all' ? 'flex items-center gap-1 text-xs text-green-300' : 'w-full bg-slate-600 rounded-full h-2 mt-2'}>
                  {activeView === 'all' ? (
                    <>
                      <TrendingUp size={12} />
                      <span>Market estimate</span>
                    </>
                  ) : (
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionPercentage}%` }}
                    />
                  )}
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm">
                  {activeView === 'collection' ? 'Collection Value' : 
                   activeView === 'missing' ? 'Missing Value' : 'Average Price'}
                </div>
                <div className="text-2xl font-bold text-green-400">
                  ${activeView === 'collection' ? totalCollectionValue.toFixed(2) : 
                    activeView === 'missing' ? missingCardsValue.toFixed(2) : averageAllCardsPrice.toFixed(2)}
                </div>
                <div className="flex items-center gap-1 text-xs text-green-300">
                  <TrendingUp size={12} />
                  <span>{activeView === 'collection' ? 'Market estimate' : 
                         activeView === 'missing' ? 'Cost to complete' : 'Per card'}</span>
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm">
                  {activeView === 'collection' ? 'Unique Cards' : 
                   activeView === 'missing' ? 'Avg. Missing Price' : 'Find Prices'}
                </div>
                {activeView === 'all' ? (
                  <button 
                    onClick={() => window.open('https://www.tcgplayer.com/search/all/product?q=gundam+tcg', '_blank')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    Find All Prices
                  </button>
                ) : (
                  <>
                    <div className="text-2xl font-bold text-white">
                      {activeView === 'collection' 
                        ? new Set(collection.map(c => c.id)).size 
                        : missingCards.length > 0 
                          ? `$${(missingCardsValue / missingCards.length).toFixed(2)}`
                          : '$0.00'
                      }
                    </div>
                    <div className="text-xs text-gray-500">
                      {activeView === 'collection' ? 'Different cards' : 'Per missing card'}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
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
                <div className="text-2xl font-bold text-green-400">
                  ${wishlist.length > 0 ? (totalWishlistValue / wishlist.length).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-gray-500">Per card</div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-3 py-2 rounded-lg transition-colors text-sm">
                    <ShoppingCart size={14} />
                    Find Prices
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeView}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Card Grid */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-white font-semibold text-lg">
            {activeView === 'collection' ? 'My Collection' : 
             activeView === 'wishlist' ? 'My Wishlist' : 
             activeView === 'missing' ? 'Missing Cards' :
             'Browse All Cards'}
          </h3>
          <p className="text-gray-400 text-sm">
            {filteredCards.length} cards found
            {activeView === 'missing' && filteredCards.length > 0 && (
              <span className="ml-2 text-orange-400">
                • ${filteredCards.reduce((sum, card) => sum + (card.marketPrice || 0), 0).toFixed(2)} total value
              </span>
            )}
          </p>
        </div>

        {filteredCards.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            {activeView === 'collection' ? (
              <Package size={48} className="mx-auto mb-4 opacity-50" />
            ) : activeView === 'wishlist' ? (
              <Heart size={48} className="mx-auto mb-4 opacity-50" />
            ) : activeView === 'missing' ? (
              <AlertCircle size={48} className="mx-auto mb-4 opacity-50" />
            ) : (
              <Package size={48} className="mx-auto mb-4 opacity-50" />
            )}
            <div className="text-lg mb-2">
              {activeView === 'collection' ? 'No cards in collection' : 
               activeView === 'wishlist' ? 'No cards in wishlist' : 
               activeView === 'missing' ? 'Collection complete!' :
               'No cards found'}
            </div>
            <div className="text-sm">
              {activeView === 'collection' 
                ? 'Start building your collection!' 
                : activeView === 'wishlist'
                  ? 'Browse cards and add them to your wishlist!'
                  : activeView === 'missing'
                    ? 'You own all available cards!'
                  : 'Try adjusting your search terms'
              }
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {filteredCards.map((card) => {
              const isOwned = collectionIds.has(card.id);
              const isWanted = wishlistIds.has(card.id);
              const quantity = collectionQuantities[card.id] || 0;
              
              return (
                <div key={card.id} className="relative">
                  <div
                    onClick={() => setSelectedCard(card)}
                    className={`relative group bg-slate-700 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer ${
                      activeView === 'collection' ? (isOwned ? 'border-green-400 bg-green-950/20' : 'border-gray-600') :
                      activeView === 'wishlist' ? (isWanted ? 'border-pink-400 bg-pink-950/20' : 'border-gray-600') :
                      (isOwned ? 'border-green-400 bg-green-950/20' : isWanted ? 'border-pink-400 bg-pink-950/20' : 'border-gray-600')
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
                    
                    {/* Status indicators */}
                    <div className="absolute top-1 right-1 flex gap-1">
                      {isOwned && (
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center">
                          <Star size={12} fill="currentColor" />
                        </div>
                      )}
                      {isWanted && (
                        <div className="w-6 h-6 bg-pink-600 text-white rounded-full flex items-center justify-center">
                          <Heart size={12} fill="currentColor" />
                        </div>
                      )}
                    </div>
                    
                    {/* Quantity for collection */}
                    {activeView === 'collection' && quantity > 1 && (
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
                        x{quantity}
                      </div>
                    )}
                    
                    {/* Quantity for all cards view */}
                    {activeView === 'all' && quantity > 0 && (
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white px-2 py-1 rounded text-xs font-bold">
                        x{quantity}
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
                  
                  {/* Action controls */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    {activeView === 'missing' ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const searchQuery = encodeURIComponent(`${card.name} ${card.set}`);
                            window.open(`https://www.tcgplayer.com/search/all/product?q=${searchQuery}`, '_blank');
                          }}
                          className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                          title="Find on TCGPlayer"
                        >
                          <ExternalLink size={10} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCollection(card);
                          }}
                          className="w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors"
                          title="Add to collection"
                        >
                          <Plus size={12} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isWanted) {
                              onRemoveFromWishlist(card);
                            } else {
                              onAddToWishlist(card);
                            }
                          }}
                          className={`w-6 h-6 text-white rounded-full flex items-center justify-center transition-colors ${
                            isWanted 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-pink-600 hover:bg-pink-700'
                          }`}
                          title={isWanted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart size={12} fill={isWanted ? 'currentColor' : 'none'} />
                        </button>
                      </>
                    ) : activeView === 'collection' ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFromCollection(card);
                          }}
                          className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
                          disabled={!isOwned}
                        >
                          <Minus size={12} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCollection(card);
                          }}
                          className="w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </>
                    ) : activeView === 'wishlist' ? (
                      <>
                        {isWanted ? (
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
                      </>
                    ) : (
                      /* All cards view - show both collection and wishlist controls */
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const searchQuery = encodeURIComponent(`${card.name} ${card.set}`);
                            window.open(`https://www.tcgplayer.com/search/all/product?q=${searchQuery}`, '_blank');
                          }}
                          className="w-6 h-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                          title="Find prices on TCGPlayer"
                        >
                          <ExternalLink size={10} />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isOwned) {
                              onRemoveFromCollection(card);
                            } else {
                              onAddToCollection(card);
                            }
                          }}
                          className={`w-6 h-6 text-white rounded-full flex items-center justify-center transition-colors ${
                            isOwned 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-green-600 hover:bg-green-700'
                          }`}
                        >
                          {isOwned ? <Minus size={12} /> : <Plus size={12} />}
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isWanted) {
                              onRemoveFromWishlist(card);
                            } else {
                              onAddToWishlist(card);
                            }
                          }}
                          className={`w-6 h-6 text-white rounded-full flex items-center justify-center transition-colors ${
                            isWanted 
                              ? 'bg-red-600 hover:bg-red-700' 
                              : 'bg-pink-600 hover:bg-pink-700'
                          }`}
                        >
                          <Heart size={12} fill={isWanted ? 'currentColor' : 'none'} />
                        </button>
                      </>
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
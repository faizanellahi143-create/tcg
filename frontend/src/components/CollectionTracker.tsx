import React, { useState } from 'react';
import { Package, Search, Plus, Minus, Star, TrendingUp } from 'lucide-react';
import { GundamCard } from '../types/card';
import { CardGrid } from './CardGrid';
import { CardDetailModal } from './CardDetailModal';

interface CollectionTrackerProps {
  collection: GundamCard[];
  allCards: GundamCard[];
  onAddToCollection: (card: GundamCard) => void;
  onRemoveFromCollection: (card: GundamCard) => void;
  onCardClick: (card: GundamCard) => void;
  onAddToWishlist: (card: GundamCard) => void;
  setIsDraggingCard?: (isDragging: boolean) => void;
}

export const CollectionTracker: React.FC<CollectionTrackerProps> = ({
  collection,
  allCards,
  onAddToCollection,
  onRemoveFromCollection,
  onCardClick,
  onAddToWishlist
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'owned' | 'missing' | 'all'>('owned');
  const [selectedCard, setSelectedCard] = useState<GundamCard | null>(null);

  const collectionIds = new Set(collection.map(card => card.id));
  const collectionQuantities = collection.reduce((acc, card) => {
    acc[card.id] = (acc[card.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredCards = allCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (viewMode) {
      case 'owned':
        return collectionIds.has(card.id);
      case 'missing':
        return !collectionIds.has(card.id);
      case 'all':
      default:
        return true;
    }
  });

  const totalCollectionValue = collection.reduce((sum, card) => sum + (card.marketPrice || 0), 0);
  const completionPercentage = Math.round((collection.length / allCards.length) * 100);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="text-blue-500" size={24} />
          <h2 className="text-2xl font-bold text-white">My Collection</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Cards Owned</div>
            <div className="text-2xl font-bold text-white">{collection.length}</div>
            <div className="text-xs text-gray-500">of {allCards.length} total</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Completion</div>
            <div className="text-2xl font-bold text-green-400">{completionPercentage}%</div>
            <div className="w-full bg-slate-600 rounded-full h-2 mt-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Collection Value</div>
            <div className="text-2xl font-bold text-green-400">${totalCollectionValue.toFixed(2)}</div>
            <div className="flex items-center gap-1 text-xs text-green-300">
              <TrendingUp size={12} />
              <span>Market estimate</span>
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Unique Cards</div>
            <div className="text-2xl font-bold text-white">{new Set(collection.map(c => c.id)).size}</div>
            <div className="text-xs text-gray-500">Different cards</div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search your collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* View Mode */}
          <div className="flex gap-2">
            {[
              { id: 'owned', label: 'Owned', count: collection.length },
              { id: 'missing', label: 'Missing', count: allCards.length - collection.length },
              { id: 'all', label: 'All Cards', count: allCards.length }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === mode.id
                    ? 'bg-blue-800 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {mode.label} ({mode.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card Grid */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="mb-4">
          <h3 className="text-white font-semibold text-lg">
            {viewMode === 'owned' ? 'Cards in Collection' : 
             viewMode === 'missing' ? 'Missing Cards' : 'All Cards'}
          </h3>
          <p className="text-gray-400 text-sm">
            {filteredCards.length} cards found
          </p>
        </div>

        {filteredCards.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <div className="text-lg mb-2">No cards found</div>
            <div className="text-sm">
              {viewMode === 'owned' ? 'Start building your collection!' : 
               viewMode === 'missing' ? 'Your collection is complete!' : 
               'Try adjusting your search terms'}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
            {filteredCards.map((card) => {
              const isOwned = collectionIds.has(card.id);
              const quantity = collectionQuantities[card.id] || 0;
              
              return (
                <div key={card.id} className="relative">
                  <div
                    onClick={() => setSelectedCard(card)}
                    className={`relative group bg-slate-700 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer ${
                      isOwned ? 'border-green-400 bg-green-950/20' : 'border-gray-600'
                    }`}
                  >
                    <img
                      src={card.image}
                      alt={card.name}
                      className={`w-full h-32 sm:h-40 object-cover ${!isOwned ? 'grayscale opacity-60' : ''}`}
                      loading="lazy"
                    />
                    
                    {/* Cost */}
                    <div className="absolute top-1 left-1 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {card.cost}
                    </div>
                    
                    {/* Owned indicator */}
                    {isOwned && (
                      <div className="absolute top-1 right-1 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center">
                        <Star size={12} fill="currentColor" />
                      </div>
                    )}
                    
                    {/* Quantity */}
                    {quantity > 1 && (
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
                  
                  {/* Collection controls */}
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
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
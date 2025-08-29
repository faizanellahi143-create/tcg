import React from 'react';
import { useDrag } from 'react-dnd';
import { GundamCard } from '../types/card';
import { Plus, Minus } from 'lucide-react';

interface DraggableCardProps {
  card: GundamCard;
  onCardClick: (card: GundamCard) => void;
  onAddToDeck?: (card: GundamCard) => void;
  onRemoveFromDeck?: (card: GundamCard) => void;
  quantity?: number;
  showQuantityControls?: boolean;
  setIsDraggingCard?: (isDragging: boolean) => void;
  isDeckCard?: boolean;
}

export const DraggableCard: React.FC<DraggableCardProps> = ({
  card,
  onCardClick,
  onAddToDeck,
  onRemoveFromDeck,
  quantity = 0,
  showQuantityControls = true,
  setIsDraggingCard,
  isDeckCard = false
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: () => {
      // Only show removal zone when dragging cards from the deck
      if (isDeckCard) {
        setIsDraggingCard?.(true);
      }
      return { card };
    },
    end: () => {
      if (isDeckCard) {
        setIsDraggingCard?.(false);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const getColorClasses = (colors: string[]) => {
    if (colors.includes('Blue')) return 'border-blue-500 bg-blue-900/30';
    if (colors.includes('Red')) return 'border-red-500 bg-red-900/30';
    if (colors.includes('Green')) return 'border-green-500 bg-green-900/30';
    if (colors.includes('White')) return 'border-gray-400 bg-gray-800/30';
    return 'border-gray-500 bg-gray-800/30';
  };

  return (
    <div
      ref={drag}
      className={`relative group bg-slate-800 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer ${getColorClasses(card.colors)} ${
        isDragging ? 'opacity-50 scale-95' : ''
      }`}
    >
      <div onClick={() => onCardClick(card)} className="relative">
        <img
          src={card.image}
          alt={card.name}
          className="w-full h-32 sm:h-40 object-cover"
          loading="lazy"
        />
        
        {/* Cost */}
        <div className="absolute top-1 left-1 w-6 h-6 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {card.cost}
        </div>
        
        {/* Power/HP for units */}
        {card.type === 'Unit' && card.power && card.hp && (
          <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
            {card.power}/{card.hp}
          </div>
        )}
        
        {/* Rarity indicator */}
        <div className={`absolute top-1 right-1 w-2 h-2 rounded-full ${
          card.rarity === 'RR' ? 'bg-yellow-400' :
          card.rarity === 'R' ? 'bg-purple-400' :
          card.rarity === 'U' ? 'bg-blue-400' :
          card.rarity === 'P' ? 'bg-red-400' : 'bg-gray-400'
        }`} />

        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center">
            <div className="text-blue-400 font-medium text-sm">Dragging...</div>
          </div>
        )}
      </div>
      
      <div className="p-2">
        <div className="text-white text-xs font-medium truncate" title={card.name}>
          {card.name}
        </div>
        <div className="text-gray-400 text-xs mb-1">{card.id}</div>
        
        {/* Card Type */}
        <div className="text-blue-300 text-xs font-medium mb-1">
          {card.type}
        </div>
        
        {/* Additional Details */}
        <div className="space-y-1">
          {card.level && (
            <div className="text-gray-300 text-xs">
              Level: {card.level}
            </div>
          )}
          {card.trait && (
            <div className="text-purple-300 text-xs truncate" title={card.trait}>
              {card.trait}
            </div>
          )}
          {card.zone && (
            <div className="text-yellow-300 text-xs">
              {card.zone}
            </div>
          )}
        </div>
        
        {card.marketPrice && (
          <div className="text-green-400 text-xs font-medium mt-1">
            ${card.marketPrice}
          </div>
        )}
      </div>
      
      {/* Quantity controls */}
      {showQuantityControls && (
        <div className="absolute bottom-2 left-2 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromDeck?.(card);
            }}
            className="w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors"
            disabled={quantity === 0}
          >
            <Minus size={12} />
          </button>
          
          {quantity > 0 && (
            <span className="bg-black/80 text-white px-2 py-1 rounded text-xs font-medium min-w-[20px] text-center">
              {quantity}
            </span>
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToDeck?.(card);
            }}
            className="w-6 h-6 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors"
            disabled={quantity >= 4}
          >
            <Plus size={12} />
          </button>
        </div>
      )}
    </div>
  );
};
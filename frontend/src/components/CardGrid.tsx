import React from 'react';
import { GundamCard } from '../types/card';
import { DraggableCard } from './DraggableCard';

interface CardGridProps {
  cards: GundamCard[];
  onCardClick: (card: GundamCard) => void;
  onAddToDeck?: (card: GundamCard) => void;
  onRemoveFromDeck?: (card: GundamCard) => void;
  deckQuantities?: Record<string, number>;
  showQuantityControls?: boolean;
  setIsDraggingCard?: (isDragging: boolean) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardClick,
  onAddToDeck,
  onRemoveFromDeck,
  deckQuantities = {},
  showQuantityControls = true,
  setIsDraggingCard
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {cards.map((card) => {
        const quantity = deckQuantities[card.id] || 0;
        
        return (
          <DraggableCard
            key={card.id}
            card={card}
            onCardClick={onCardClick}
            onAddToDeck={onAddToDeck}
            onRemoveFromDeck={onRemoveFromDeck}
            quantity={quantity}
            showQuantityControls={showQuantityControls}
            setIsDraggingCard={setIsDraggingCard}
            isDeckCard={false}
          />
        );
      })}
    </div>
  );
};
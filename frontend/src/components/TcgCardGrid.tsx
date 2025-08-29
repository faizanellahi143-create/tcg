import React from "react";
import { TcgCard } from "../store/slices/cardSlice";
import { TcgDraggableCard } from "./TcgDraggableCard";

interface TcgCardGridProps {
  cards: TcgCard[];
  onCardClick: (card: TcgCard) => void;
  onAddToDeck?: (card: TcgCard) => void;
  onRemoveFromDeck?: (card: TcgCard) => void;
  deckQuantities?: Record<string, number>;
  showQuantityControls?: boolean;
  setIsDraggingCard?: (isDragging: boolean) => void;
}

export const TcgCardGrid: React.FC<TcgCardGridProps> = ({
  cards,
  onCardClick,
  onAddToDeck,
  onRemoveFromDeck,
  deckQuantities = {},
  showQuantityControls = true,
  setIsDraggingCard,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {cards.map((card) => {
        const quantity = deckQuantities[card._id] || 0;

        return (
          <TcgDraggableCard
            key={card._id}
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

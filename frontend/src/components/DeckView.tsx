import React from "react";
import { useDrop } from "react-dnd";
import { DeckCard, GundamCard } from "../types/card";
import { DraggableCard } from "./DraggableCard";
import { TournamentMode } from "./TournamentMode";
import { DynamicDeckStatistics } from "./DynamicDeckStatistics";
import {
  Save,
  Download,
  Upload,
  DollarSign,
  TrendingUp,
  Globe,
} from "lucide-react";
interface DeckViewProps {
  deck: DeckCard[];
  onCardClick: (card: DeckCard) => void;
  onAddToDeck?: (card: GundamCard) => void;
  onRemoveFromDeck: (card: DeckCard) => void;
  onSaveDeck: () => void;
  onShareDeckClick: () => void;
  onExportDeck: () => void;
  onImportDeck: () => void;
  showTournamentLegality?: boolean;
  setIsDraggingCard?: (isDragging: boolean) => void;
}

export const DeckView: React.FC<DeckViewProps> = ({
  deck,
  onCardClick,
  onAddToDeck,
  onRemoveFromDeck,
  onSaveDeck,
  onShareDeckClick,
  onExportDeck,
  onImportDeck,
  showTournamentLegality = false,
  setIsDraggingCard,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "CARD",
    drop: (item: { card: GundamCard }) => {
      addToDeck(item.card);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const addToDeck = (card: GundamCard) => {
    const existingCard = deck.find((deckCard) => deckCard.id === card.id);
    if (!existingCard) {
      onAddToDeck?.(card);
    } else {
      onAddToDeck?.(card);
    }
  };

  const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);
  const uniqueCards = deck.length;
  const totalMarketValue = deck.reduce(
    (sum, card) => sum + (card.marketPrice || 0) * card.quantity,
    0
  );

  return (
    <div
      ref={drop}
      className={`bg-slate-800 rounded-lg p-4 space-y-4 transition-all duration-200 ${
        isOver ? "ring-2 ring-blue-500 bg-blue-900/20" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">Current Deck</h3>
          <div className="text-gray-400 text-sm">
            {totalCards}/50 cards • {uniqueCards} unique
            {isOver && (
              <span className="text-blue-400 ml-2">Drop card here!</span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onSaveDeck}
            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Save size={16} />
            Save
          </button>
          <button
            onClick={onShareDeckClick}
            className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Globe size={16} />
            Share
          </button>
          <button
            onClick={onExportDeck}
            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Download size={16} />
            Export
          </button>
          <button
            onClick={onImportDeck}
            className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-3 py-2 rounded-lg text-sm transition-colors"
          >
            <Upload size={16} />
            Import
          </button>
        </div>
      </div>

      {/* Dynamic Deck Statistics */}
      <DynamicDeckStatistics deck={deck} />

      {/* Market Value */}
      <div className="bg-slate-700 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign size={16} className="text-green-400" />
          <span className="text-white font-medium">Market Value</span>
          <TrendingUp size={14} className="text-green-400" />
        </div>

        <div className="text-2xl font-bold text-green-400 mb-1">
          ${totalMarketValue.toFixed(2)}
        </div>
        <div className="text-xs text-gray-400">
          Based on recent market data • Updated 24h ago
        </div>
        <div className="text-xs text-gray-500 mt-1">
          *Prices are estimates and may vary by condition and seller
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            totalCards >= 50
              ? "bg-green-500"
              : totalCards >= 40
              ? "bg-yellow-500"
              : "bg-blue-500"
          }`}
          style={{ width: `${Math.min((totalCards / 50) * 100, 100)}%` }}
        />
      </div>

      {/* Deck Cards */}
      <div className="max-h-[600px] overflow-y-auto">
        {deck.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-lg mb-2">No cards in deck</div>
            <div className="text-sm">
              Add cards from the library to start building
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {deck.map((card) => (
              <DraggableCard
                key={card.id}
                card={card}
                onCardClick={onCardClick}
                onAddToDeck={onAddToDeck}
                onRemoveFromDeck={onRemoveFromDeck}
                quantity={card.quantity}
                showQuantityControls={true}
                setIsDraggingCard={setIsDraggingCard}
                isDeckCard={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Tournament Legality Check */}
      {showTournamentLegality && (
        <div className="mt-6">
          <TournamentMode deck={deck} />
        </div>
      )}
    </div>
  );
};

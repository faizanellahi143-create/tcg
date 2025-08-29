import React from "react";
import { useDrag } from "react-dnd";
import { TcgCard } from "../store/slices/cardSlice";
import { Plus, Minus } from "lucide-react";

interface TcgDraggableCardProps {
  card: TcgCard;
  onCardClick: (card: TcgCard) => void;
  onAddToDeck?: (card: TcgCard) => void;
  onRemoveFromDeck?: (card: TcgCard) => void;
  quantity?: number;
  showQuantityControls?: boolean;
  setIsDraggingCard?: (isDragging: boolean) => void;
  isDeckCard?: boolean;
}

export const TcgDraggableCard: React.FC<TcgDraggableCardProps> = ({
  card,
  onCardClick,
  onAddToDeck,
  onRemoveFromDeck,
  quantity = 0,
  showQuantityControls = true,
  setIsDraggingCard,
  isDeckCard = false,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TCG_CARD",
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

  const getColorClasses = (affinity: string | undefined) => {
    if (!affinity || affinity === "-") return "border-gray-500 bg-gray-800/30";
    if (affinity.includes("Blue")) return "border-blue-500 bg-blue-900/30";
    if (affinity.includes("Red")) return "border-red-500 bg-red-900/30";
    if (affinity.includes("Green")) return "border-green-500 bg-green-900/30";
    if (affinity.includes("Yellow"))
      return "border-yellow-500 bg-yellow-900/30";
    if (affinity.includes("Purple"))
      return "border-purple-500 bg-purple-900/30";
    return "border-gray-500 bg-gray-800/30";
  };

  const getRarityColor = (rarity: string | undefined) => {
    if (!rarity) return "bg-gray-400";
    switch (rarity) {
      case "UR":
        return "bg-yellow-400";
      case "SR":
        return "bg-orange-400";
      case "R":
        return "bg-purple-400";
      case "U":
        return "bg-blue-400";
      case "C":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const safeParseNumber = (value: string | undefined): number => {
    if (!value || value === "-" || value === "") return 0;
    const parsed = parseInt(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Safety check for card object
  if (!card || !card.name) {
    return (
      <div className="relative group bg-slate-800 rounded-lg overflow-hidden border-2 border-gray-500 bg-gray-800/30 p-4">
        <div className="text-gray-400 text-center">Invalid Card</div>
      </div>
    );
  }

  return (
    <div
      ref={drag}
      className={`relative group bg-slate-800 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer ${getColorClasses(
        card.affinity
      )} ${isDragging ? "opacity-50 scale-95" : ""}`}
    >
      <div onClick={() => onCardClick(card)} className="relative">
        <img
          src={card.images?.large || card.imageUrl || "/placeholder-card.png"}
          alt={card.name}
          className="w-full h-32 sm:h-40 object-cover"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-card.png";
          }}
        />

        {/* AP (Action Points) */}
        {card.ap && card.ap !== "-" && (
          <div className="absolute top-1 left-1 w-6 h-6 bg-blue-800 text-white rounded-full flex items-center justify-center text-xs font-bold">
            {card.ap}
          </div>
        )}

        {/* BP (Battle Points) for characters */}
        {card.type === "Character" && card.bp && card.bp !== "-" && (
          <div className="absolute bottom-1 right-1 bg-black/80 text-white px-1 py-0.5 rounded text-xs">
            {safeParseNumber(card.bp)}
          </div>
        )}

        {/* Rarity indicator */}
        <div
          className={`absolute top-1 right-1 w-2 h-2 rounded-full ${getRarityColor(
            card.rarity
          )}`}
        />

        {/* Drag indicator */}
        {isDragging && (
          <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-400 border-dashed rounded-lg flex items-center justify-center">
            <div className="text-blue-400 font-medium text-sm">Dragging...</div>
          </div>
        )}
      </div>

      <div className="p-2">
        <div
          className="text-white text-xs font-medium truncate"
          title={card.name}
        >
          {card.name}
        </div>
        <div className="text-gray-400 text-xs mb-1">{card.code || "N/A"}</div>

        {/* Card Type */}
        <div className="text-blue-300 text-xs font-medium mb-1">
          {card.type || "Unknown"}
        </div>

        {/* Set Name */}
        {card.set?.name && (
          <div
            className="text-purple-300 text-xs truncate"
            title={card.set.name}
          >
            {card.set.name}
          </div>
        )}

        {/* Energy Requirement */}
        {card.needEnergy?.value && card.needEnergy.value !== "-" && (
          <div className="text-yellow-300 text-xs">
            Energy: {card.needEnergy.value}
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

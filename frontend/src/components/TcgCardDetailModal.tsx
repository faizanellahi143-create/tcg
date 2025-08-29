import React from "react";
import {
  X,
  Star,
  TrendingUp,
  ExternalLink,
  Zap,
  Shield,
  Heart,
} from "lucide-react";
import { TcgCard } from "../store/slices/cardSlice";

interface TcgCardDetailModalProps {
  card: TcgCard;
  onClose: () => void;
  onAddToDeck: (card: TcgCard) => void;
  onRemoveFromDeck: (card: TcgCard) => void;
  deckQuantity: number;
}

export const TcgCardDetailModal: React.FC<TcgCardDetailModalProps> = ({
  card,
  onClose,
  onAddToDeck,
  onRemoveFromDeck,
  deckQuantity,
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "UR":
        return "text-yellow-400";
      case "SR":
        return "text-orange-400";
      case "R":
        return "text-purple-400";
      case "U":
        return "text-blue-400";
      case "C":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getRarityName = (rarity: string) => {
    switch (rarity) {
      case "UR":
        return "Ultra Rare";
      case "SR":
        return "Super Rare";
      case "R":
        return "Rare";
      case "U":
        return "Uncommon";
      case "C":
        return "Common";
      default:
        return rarity;
    }
  };

  const getAffinityColor = (affinity: string) => {
    if (affinity.includes("Blue")) return "text-blue-400";
    if (affinity.includes("Red")) return "text-red-400";
    if (affinity.includes("Green")) return "text-green-400";
    if (affinity.includes("Yellow")) return "text-yellow-400";
    if (affinity.includes("Purple")) return "text-purple-400";
    return "text-gray-400";
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{card.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card Image and Basic Info */}
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden border-2 border-slate-600 bg-slate-800">
                <img
                  src={
                    card.images?.large ||
                    card.imageUrl ||
                    "/placeholder-card.png"
                  }
                  alt={card.name}
                  className="w-full h-auto object-contain bg-slate-800"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-card.png";
                  }}
                />

                {/* AP overlay */}
                {card.ap && (
                  <div className="absolute top-3 left-3 w-10 h-10 bg-blue-800/90 text-white rounded-full flex items-center justify-center text-lg font-bold backdrop-blur-sm">
                    {card.ap}
                  </div>
                )}

                {/* BP overlay */}
                {card.bp && (
                  <div className="absolute bottom-3 right-3 bg-black/90 text-white px-3 py-1 rounded-lg text-lg font-bold backdrop-blur-sm">
                    {card.bp}
                  </div>
                )}

                {/* Rarity badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold bg-slate-800/90 backdrop-blur-sm ${getRarityColor(
                      card.rarity
                    )}`}
                  >
                    {card.rarity}
                  </span>
                </div>
              </div>

              {/* Deck Controls */}
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-400">In Deck</span>
                  <span className="text-white font-bold">{deckQuantity}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onAddToDeck(card)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Add to Deck
                  </button>
                  {deckQuantity > 0 && (
                    <button
                      onClick={() => onRemoveFromDeck(card)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Card Details */}
              <div className="bg-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Card Code</span>
                  <span className="text-white font-mono">{card.code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Set</span>
                  <span className="text-white">
                    {card.set?.name || "Unknown"}
                  </span>
                </div>
                {card.needEnergy?.value && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Energy Required</span>
                    <span
                      className={`font-medium ${getAffinityColor(
                        card.needEnergy.value
                      )}`}
                    >
                      {card.needEnergy.value}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Card Information */}
            <div className="space-y-6">
              {/* Basic Stats */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Card Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-400 text-sm">Type</span>
                    <p className="text-white font-medium">{card.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">Rarity</span>
                    <p className={`font-medium ${getRarityColor(card.rarity)}`}>
                      {getRarityName(card.rarity)}
                    </p>
                  </div>
                  {card.ap && (
                    <div>
                      <span className="text-gray-400 text-sm">
                        Action Points
                      </span>
                      <p className="text-white font-medium flex items-center gap-1">
                        <Zap size={16} className="text-blue-400" />
                        {card.ap}
                      </p>
                    </div>
                  )}
                  {card.bp && (
                    <div>
                      <span className="text-gray-400 text-sm">
                        Battle Points
                      </span>
                      <p className="text-white font-medium flex items-center gap-1">
                        <Shield size={16} className="text-green-400" />
                        {card.bp}
                      </p>
                    </div>
                  )}
                  {card.affinity && card.affinity !== "-" && (
                    <div>
                      <span className="text-gray-400 text-sm">Affinity</span>
                      <p
                        className={`font-medium ${getAffinityColor(
                          card.affinity
                        )}`}
                      >
                        {card.affinity}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Effect */}
              {card.effect && (
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Effect
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{card.effect}</p>
                </div>
              )}

              {/* Trigger */}
              {card.trigger && (
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Trigger Effect
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {card.trigger}
                  </p>
                </div>
              )}

              {/* Description */}
              {card.description && card.description !== card.effect && (
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Description
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              )}

              {/* External Links */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">
                  External Links
                </h3>
                <div className="space-y-2">
                  {card.url && (
                    <a
                      href={card.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink size={16} />
                      View on Union Arena TCG
                    </a>
                  )}
                  {card.needEnergy?.logo && (
                    <a
                      href={card.needEnergy.logo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink size={16} />
                      View Energy Icon
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


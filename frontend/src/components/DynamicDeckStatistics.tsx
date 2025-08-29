import React from "react";
import { BarChart3, Zap, Shield, Sword, Target, Star } from "lucide-react";
import { GundamCard, DeckCard } from "../types/card";
import { TcgCard } from "../store/slices/cardSlice";

// Union type for both card types
type AnyCard = GundamCard | TcgCard;

// Interface for deck statistics
interface DeckStats {
  totalCards: number;
  uniqueCards: number;
  averageCost: string;
  colorCounts: Record<string, number>;
  affinityCounts: Record<string, number>;
  typeCounts: Record<string, number>;
  rarityCounts: Record<string, number>;
  totalAP: number;
  totalBP: number;
  averageBP: string;
  energyRequirements: Record<string, number>;
  cardTypeBreakdown: {
    gundamCards: number;
    tcgCards: number;
    mixed: boolean;
  };
}

interface DynamicDeckStatisticsProps {
  deck: AnyCard[];
  title?: string;
  className?: string;
}

export const DynamicDeckStatistics: React.FC<DynamicDeckStatisticsProps> = ({
  deck,
  title = "Deck Statistics",
  className = "",
}) => {
  // Helper function to check if card is TCG card
  const isTcgCard = (card: AnyCard): card is TcgCard => {
    return "tcgId" in card && "ap" in card && "bp" in card;
  };

  // Helper function to check if card is Gundam card
  const isGundamCard = (card: AnyCard): card is GundamCard => {
    return "cost" in card && "colors" in card;
  };

  // Calculate statistics based on card type
  const calculateStats = (): DeckStats => {
    const totalCards = deck.reduce((sum, card) => {
      // Handle both card types
      if (isGundamCard(card)) {
        return sum + (card.quantity || 1);
      } else {
        return sum + 1; // TCG cards don't have quantity in the same way
      }
    }, 0);

    const uniqueCards = deck.length;

    // Calculate costs and AP
    let totalCost = 0;
    let totalAP = 0;
    let totalBP = 0;
    let costCount = 0;
    let bpCount = 0;

    // Initialize counters
    const colorCounts: Record<string, number> = {};
    const affinityCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    const rarityCounts: Record<string, number> = {};
    const energyRequirements: Record<string, number> = {};

    // Track card type breakdown
    let gundamCardCount = 0;
    let tcgCardCount = 0;

    deck.forEach((card) => {
      const quantity = isGundamCard(card) ? card.quantity || 1 : 1;

      if (isGundamCard(card)) {
        gundamCardCount += quantity;
        // Gundam card statistics
        totalCost += (card.cost || 0) * quantity;
        costCount += quantity;

        // Colors
        if (card.colors) {
          card.colors.forEach((color) => {
            colorCounts[color] = (colorCounts[color] || 0) + quantity;
          });
        }

        // Types
        if (card.type) {
          typeCounts[card.type] = (typeCounts[card.type] || 0) + quantity;
        }

        // Rarity
        if (card.rarity) {
          rarityCounts[card.rarity] =
            (rarityCounts[card.rarity] || 0) + quantity;
        }
      } else {
        tcgCardCount += quantity;
        // TCG card statistics
        if (card.ap && card.ap !== "-") {
          const ap = parseInt(card.ap) || 0;
          totalAP += ap * quantity;
        }

        if (card.bp && card.bp !== "-") {
          const bp = parseInt(card.bp) || 0;
          totalBP += bp * quantity;
          bpCount += quantity;
        }

        // Affinity (energy color)
        if (card.affinity && card.affinity !== "-") {
          affinityCounts[card.affinity] =
            (affinityCounts[card.affinity] || 0) + quantity;
        }

        // Types
        if (card.type) {
          typeCounts[card.type] = (typeCounts[card.type] || 0) + quantity;
        }

        // Rarity
        if (card.rarity) {
          rarityCounts[card.rarity] =
            (rarityCounts[card.rarity] || 0) + quantity;
        }

        // Energy requirements
        if (card.needEnergy?.value && card.needEnergy.value !== "-") {
          energyRequirements[card.needEnergy.value] =
            (energyRequirements[card.needEnergy.value] || 0) + quantity;
        }
      }
    });

    const averageCost =
      costCount > 0 ? (totalCost / costCount).toFixed(1) : "0.0";
    const averageBP = bpCount > 0 ? (totalBP / bpCount).toFixed(0) : "0";

    return {
      totalCards,
      uniqueCards,
      averageCost,
      colorCounts,
      affinityCounts,
      typeCounts,
      rarityCounts,
      totalAP,
      totalBP,
      averageBP,
      energyRequirements,
      cardTypeBreakdown: {
        gundamCards: gundamCardCount,
        tcgCards: tcgCardCount,
        mixed: gundamCardCount > 0 && tcgCardCount > 0,
      },
    };
  };

  const stats = calculateStats();

  // Determine if we're dealing with TCG cards
  const hasTcgCards = stats.cardTypeBreakdown.tcgCards > 0;
  const hasGundamCards = stats.cardTypeBreakdown.gundamCards > 0;

  return (
    <div className={`bg-slate-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-blue-500" />
        <span className="text-white font-medium">{title}</span>
        {stats.cardTypeBreakdown.mixed && (
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            Mixed Deck
          </span>
        )}
      </div>

      {/* Card Type Overview */}
      {stats.cardTypeBreakdown.mixed && (
        <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-slate-600 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-400">
              {stats.cardTypeBreakdown.gundamCards}
            </div>
            <div className="text-xs text-gray-300">Gundam Cards</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-400">
              {stats.cardTypeBreakdown.tcgCards}
            </div>
            <div className="text-xs text-gray-300">TCG Cards</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        {/* Card Counts */}
        <div>
          <div className="text-gray-400">Total Cards</div>
          <div className="text-white font-medium">{stats.totalCards}</div>
        </div>

        <div>
          <div className="text-gray-400">Unique Cards</div>
          <div className="text-white font-medium">{stats.uniqueCards}</div>
        </div>

        {/* Gundam Card Stats */}
        {hasGundamCards && (
          <>
            <div>
              <div className="text-gray-400">Average Cost</div>
              <div className="text-white font-medium">{stats.averageCost}</div>
            </div>

            <div>
              <div className="text-gray-400">Colors</div>
              <div className="flex gap-1 flex-wrap">
                {Object.entries(stats.colorCounts).map(([color, count]) => (
                  <span
                    key={color}
                    className="text-white text-xs bg-slate-600 px-1 rounded"
                  >
                    {color.charAt(0)}
                    {count}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TCG Card Stats */}
        {hasTcgCards && (
          <>
            <div>
              <div className="text-gray-400">Total AP</div>
              <div className="text-white font-medium flex items-center gap-1">
                <Zap size={12} className="text-blue-400" />
                {stats.totalAP}
              </div>
            </div>

            <div>
              <div className="text-gray-400">Average BP</div>
              <div className="text-white font-medium flex items-center gap-1">
                <Sword size={12} className="text-red-400" />
                {stats.averageBP}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
        {/* Type Distribution */}
        <div>
          <div className="text-gray-400">Card Types</div>
          <div className="space-y-1">
            {Object.entries(stats.typeCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([type, count]) => (
                <div key={type} className="flex justify-between text-xs">
                  <span className="text-gray-300">{type}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Rarity Distribution */}
        <div>
          <div className="text-gray-400">Rarities</div>
          <div className="space-y-1">
            {Object.entries(stats.rarityCounts)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 3)
              .map(([rarity, count]) => (
                <div key={rarity} className="flex justify-between text-xs">
                  <span className="text-gray-300">{rarity}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Energy/Affinity Distribution */}
        {(hasTcgCards
          ? Object.keys(stats.affinityCounts).length > 0
          : Object.keys(stats.colorCounts).length > 0) && (
          <div>
            <div className="text-gray-400">
              {hasTcgCards ? "Energy Affinity" : "Colors"}
            </div>
            <div className="space-y-1">
              {(hasTcgCards ? stats.affinityCounts : stats.colorCounts) ? (
                Object.entries(
                  hasTcgCards ? stats.affinityCounts : stats.colorCounts
                )
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 3)
                  .map(([affinity, count]) => (
                    <div
                      key={affinity}
                      className="flex justify-between text-xs"
                    >
                      <span className="text-gray-300">{affinity}</span>
                      <span className="text-white font-medium">{count}</span>
                    </div>
                  ))
              ) : (
                <span className="text-gray-500 text-xs">None</span>
              )}
            </div>
          </div>
        )}

        {/* Energy Requirements (TCG specific) */}
        {hasTcgCards && Object.keys(stats.energyRequirements).length > 0 && (
          <div>
            <div className="text-gray-400">Energy Req.</div>
            <div className="space-y-1">
              {Object.entries(stats.energyRequirements)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([energy, count]) => (
                  <div key={energy} className="flex justify-between text-xs">
                    <span className="text-gray-300">{energy}</span>
                    <span className="text-white font-medium">{count}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar for Deck Completion */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Deck Progress</span>
          <span>{stats.totalCards}/50 cards</span>
        </div>
        <div className="bg-slate-600 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              stats.totalCards >= 50
                ? "bg-green-500"
                : stats.totalCards >= 40
                ? "bg-yellow-500"
                : "bg-blue-500"
            }`}
            style={{
              width: `${Math.min((stats.totalCards / 50) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

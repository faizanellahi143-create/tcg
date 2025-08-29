import React from "react";
import { BarChart3, Zap, Sword, Star, Target, Shield } from "lucide-react";
import { TcgCard } from "../store/slices/cardSlice";

interface TcgDeckStatisticsProps {
  cards: TcgCard[];
  title?: string;
  className?: string;
  showProgressBar?: boolean;
}

export const TcgDeckStatistics: React.FC<TcgDeckStatisticsProps> = ({
  cards,
  title = "TCG Deck Statistics",
  className = "",
  showProgressBar = true,
}) => {
  // Calculate TCG-specific statistics
  const calculateStats = () => {
    const totalCards = cards.length;

    // AP (Action Points) statistics
    const apStats = cards.reduce(
      (acc, card) => {
        if (card.ap && card.ap !== "-") {
          const ap = parseInt(card.ap) || 0;
          acc.total += ap;
          acc.count += 1;
          acc.distribution[ap] = (acc.distribution[ap] || 0) + 1;
        }
        return acc;
      },
      { total: 0, count: 0, distribution: {} as Record<number, number> }
    );

    // BP (Battle Points) statistics
    const bpStats = cards.reduce(
      (acc, card) => {
        if (card.bp && card.bp !== "-") {
          const bp = parseInt(card.bp) || 0;
          acc.total += bp;
          acc.count += 1;
          acc.distribution[bp] = (acc.distribution[bp] || 0) + 1;
          acc.min = Math.min(acc.min, bp);
          acc.max = Math.max(acc.max, bp);
        }
        return acc;
      },
      {
        total: 0,
        count: 0,
        distribution: {} as Record<number, number>,
        min: Infinity,
        max: -Infinity,
      }
    );

    // Type distribution
    const typeCounts = cards.reduce((acc, card) => {
      if (card.type) {
        acc[card.type] = (acc[card.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Rarity distribution
    const rarityCounts = cards.reduce((acc, card) => {
      if (card.rarity) {
        acc[card.rarity] = (acc[card.rarity] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Affinity (energy color) distribution
    const affinityCounts = cards.reduce((acc, card) => {
      if (card.affinity && card.affinity !== "-") {
        acc[card.affinity] = (acc[card.affinity] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Energy requirements
    const energyRequirements = cards.reduce((acc, card) => {
      if (card.needEnergy?.value && card.needEnergy.value !== "-") {
        acc[card.needEnergy.value] = (acc[card.needEnergy.value] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Set distribution
    const setCounts = cards.reduce((acc, card) => {
      if (card.set?.name) {
        acc[card.set.name] = (acc[card.set.name] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCards,
      apStats: {
        total: apStats.total,
        average:
          apStats.count > 0
            ? (apStats.total / apStats.count).toFixed(1)
            : "0.0",
        distribution: apStats.distribution,
      },
      bpStats: {
        total: bpStats.total,
        average:
          bpStats.count > 0 ? (bpStats.total / bpStats.count).toFixed(0) : "0",
        min: bpStats.min === Infinity ? 0 : bpStats.min,
        max: bpStats.max === -Infinity ? 0 : bpStats.max,
        distribution: bpStats.distribution,
      },
      typeCounts,
      rarityCounts,
      affinityCounts,
      energyRequirements,
      setCounts,
    };
  };

  const stats = calculateStats();

  // Get top 3 most common values for each category
  const getTop3 = (counts: Record<string, number>) => {
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  };

  return (
    <div className={`bg-slate-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-blue-500" />
        <span className="text-white font-medium">{title}</span>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <div className="text-gray-400">Total Cards</div>
          <div className="text-white font-medium">{stats.totalCards}</div>
        </div>

        <div>
          <div className="text-gray-400">Avg AP</div>
          <div className="text-white font-medium flex items-center gap-1">
            <Zap size={12} className="text-blue-400" />
            {stats.apStats.average}
          </div>
        </div>

        <div>
          <div className="text-gray-400">Avg BP</div>
          <div className="text-white font-medium flex items-center gap-1">
            <Sword size={12} className="text-red-400" />
            {stats.bpStats.average}
          </div>
        </div>

        <div>
          <div className="text-gray-400">BP Range</div>
          <div className="text-white font-medium text-xs">
            {stats.bpStats.min}-{stats.bpStats.max}
          </div>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        {/* Card Types */}
        <div>
          <div className="text-gray-400 mb-2">Card Types</div>
          <div className="space-y-1">
            {getTop3(stats.typeCounts).map(([type, count]) => (
              <div key={type} className="flex justify-between text-xs">
                <span className="text-gray-300 truncate">{type}</span>
                <span className="text-white font-medium ml-2">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rarities */}
        <div>
          <div className="text-gray-400 mb-2">Rarities</div>
          <div className="space-y-1">
            {getTop3(stats.rarityCounts).map(([rarity, count]) => (
              <div key={rarity} className="flex justify-between text-xs">
                <span className="text-gray-300 truncate">{rarity}</span>
                <span className="text-white font-medium ml-2">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Affinity */}
        <div>
          <div className="text-gray-400 mb-2">Energy Affinity</div>
          <div className="space-y-1">
            {getTop3(stats.affinityCounts).map(([affinity, count]) => (
              <div key={affinity} className="flex justify-between text-xs">
                <span className="text-gray-300 truncate">{affinity}</span>
                <span className="text-white font-medium ml-2">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mt-4">
        {/* Energy Requirements */}
        {Object.keys(stats.energyRequirements).length > 0 && (
          <div>
            <div className="text-gray-400 mb-2">Energy Req.</div>
            <div className="space-y-1">
              {getTop3(stats.energyRequirements).map(([energy, count]) => (
                <div key={energy} className="flex justify-between text-xs">
                  <span className="text-gray-300 truncate">{energy}</span>
                  <span className="text-white font-medium ml-2">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sets */}
        {Object.keys(stats.setCounts).length > 0 && (
          <div>
            <div className="text-gray-400 mb-2">Sets</div>
            <div className="space-y-1">
              {getTop3(stats.setCounts).map(([setName, count]) => (
                <div key={setName} className="flex justify-between text-xs">
                  <span className="text-gray-300 truncate">{setName}</span>
                  <span className="text-white font-medium ml-2">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AP Distribution */}
        {Object.keys(stats.apStats.distribution).length > 0 && (
          <div>
            <div className="text-gray-400 mb-2">AP Distribution</div>
            <div className="space-y-1">
              {getTop3(stats.apStats.distribution).map(([ap, count]) => (
                <div key={ap} className="flex justify-between text-xs">
                  <span className="text-gray-300">AP {ap}</span>
                  <span className="text-white font-medium ml-2">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar for Deck Completion */}
      {showProgressBar && (
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
      )}
    </div>
  );
};

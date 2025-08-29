import React, { useMemo } from "react";
import { TcgCard } from "../store/slices/cardSlice";

interface EnhancedFiltersProps {
  cards: TcgCard[];
  filters: {
    type: string;
    rarity: string;
    set: string;
    affinity: string;
    minBp: string;
    maxBp: string;
  };
  onFilterChange: (filters: Partial<typeof filters>) => void;
  onClearFilters: () => void;
}

export const EnhancedFilters: React.FC<EnhancedFiltersProps> = ({
  cards,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  // Generate unique filter options from the actual card data
  const filterOptions = useMemo(() => {
    const types = new Set<string>();
    const rarities = new Set<string>();
    const sets = new Set<string>();
    const affinities = new Set<string>();
    const bpValues: number[] = [];

    cards.forEach((card) => {
      // Collect types
      if (card.type) types.add(card.type);

      // Collect rarities
      if (card.rarity) rarities.add(card.rarity);

      // Collect sets
      if (card.set?.name) sets.add(card.set.name);

      // Collect affinities
      if (card.affinity && card.affinity !== "-") affinities.add(card.affinity);

      // Collect BP values for range calculation
      const bp = parseInt(card.bp);
      if (!isNaN(bp) && bp > 0) bpValues.push(bp);
    });

    return {
      types: Array.from(types).sort(),
      rarities: Array.from(rarities).sort(),
      sets: Array.from(sets).sort(),
      affinities: Array.from(affinities).sort(),
      minBp: Math.min(...bpValues),
      maxBp: Math.max(...bpValues),
    };
  }, [cards]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    onFilterChange({ [key]: value });
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Advanced Filters</h3>
        <button
          onClick={onClearFilters}
          className="text-sm text-gray-400 hover:text-white transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Type
          </label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {filterOptions.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Rarity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Rarity
          </label>
          <select
            value={filters.rarity}
            onChange={(e) => handleFilterChange("rarity", e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Rarities</option>
            {filterOptions.rarities.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>
        </div>

        {/* Set Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Set
          </label>
          <select
            value={filters.set}
            onChange={(e) => handleFilterChange("set", e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Sets</option>
            {filterOptions.sets.map((set) => (
              <option key={set} value={set}>
                {set}
              </option>
            ))}
          </select>
        </div>

        {/* Affinity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Energy Affinity
          </label>
          <select
            value={filters.affinity}
            onChange={(e) => handleFilterChange("affinity", e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Affinities</option>
            {filterOptions.affinities.map((affinity) => (
              <option key={affinity} value={affinity}>
                {affinity}
              </option>
            ))}
          </select>
        </div>

        {/* BP Range Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Min BP
          </label>
          <input
            type="number"
            value={filters.minBp}
            onChange={(e) => handleFilterChange("minBp", e.target.value)}
            placeholder={filterOptions.minBp.toString()}
            min={filterOptions.minBp}
            max={filterOptions.maxBp}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Max BP
          </label>
          <input
            type="number"
            value={filters.maxBp}
            onChange={(e) => handleFilterChange("maxBp", e.target.value)}
            placeholder={filterOptions.maxBp.toString()}
            min={filterOptions.minBp}
            max={filterOptions.maxBp}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.type ||
        filters.rarity ||
        filters.set ||
        filters.affinity ||
        filters.minBp ||
        filters.maxBp) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-sm text-gray-400">Active filters:</span>
          {filters.type && (
            <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              Type: {filters.type}
            </span>
          )}
          {filters.rarity && (
            <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
              Rarity: {filters.rarity}
            </span>
          )}
          {filters.set && (
            <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">
              Set: {filters.set}
            </span>
          )}
          {filters.affinity && (
            <span className="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">
              Affinity: {filters.affinity}
            </span>
          )}
          {(filters.minBp || filters.maxBp) && (
            <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded-full">
              BP: {filters.minBp || filterOptions.minBp} -{" "}
              {filters.maxBp || filterOptions.maxBp}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

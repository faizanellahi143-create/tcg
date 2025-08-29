import React from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface FilterState {
  search: string;
  colors: string[];
  types: string[];
  rarity: string[];
  cost: string;
  sets: string[];
}

interface CardFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  cardCount: number;
}

export const CardFilters: React.FC<CardFiltersProps> = ({
  filters,
  onFiltersChange,
  cardCount
}) => {
  const colors = ['Blue', 'Green', 'Red', 'White', 'Purple', 'Colorless'];
  const types = ['Unit', 'Pilot', 'Command', 'Base'];
  const rarities = ['C', 'U', 'R', 'RR', 'P'];
  const sets = [
    // Available Now
    { id: 'ST-01', name: 'ST-01: Heroic Beginnings', status: 'available' },
    { id: 'ST-02', name: 'ST-02: Wings of Advance', status: 'available' },
    { id: 'ST-03', name: 'ST-03: Zeon\'s Rush', status: 'available' },
    { id: 'ST-04', name: 'ST-04: SEED Strike', status: 'available' },
    { id: 'GD01', name: 'GD01: Newtype Rising', status: 'available' },
    // Upcoming
    { id: 'ST-05', name: 'ST-05: Iron Bloom', status: 'upcoming' },
    { id: 'ST-06', name: 'ST-06: Clan Unity', status: 'upcoming' },
    { id: 'GD02', name: 'GD02: Dual Impact', status: 'upcoming' },
    { id: 'ST-07', name: 'ST-07: Celestial Drive', status: 'upcoming' },
    { id: 'ST-08', name: 'ST-08: Flash of Radiance', status: 'upcoming' },
    { id: 'GD03', name: 'GD03: TBA', status: 'upcoming' }
  ];

  const toggleArrayFilter = (key: 'colors' | 'types' | 'rarity' | 'sets', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    onFiltersChange({ ...filters, [key]: updated });
  };

  const resetFilters = () => {
    onFiltersChange({
      search: '',
      colors: [],
      types: [],
      rarity: [],
      cost: '',
      sets: []
    });
  };

  return (
    <div className="bg-slate-800 p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Cards</h3>
        <div className="text-gray-400 text-sm">{cardCount} cards found</div>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search cards..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      {/* ID/Cost Filter */}
      <div className="flex gap-2">
        <select
          value={filters.cost}
          onChange={(e) => onFiltersChange({ ...filters, cost: e.target.value })}
          className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="">All Costs</option>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6+</option>
        </select>
      </div>

      {/* Color Filters */}
      <div>
        <label className="text-gray-300 text-sm font-medium mb-2 block">Colors</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => toggleArrayFilter('colors', color)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filters.colors.includes(color)
                  ? 'bg-blue-800 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Type Filters */}
      <div>
        <label className="text-gray-300 text-sm font-medium mb-2 block">Types</label>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => toggleArrayFilter('types', type)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filters.types.includes(type)
                  ? 'bg-green-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Rarity Filters */}
      <div>
        <label className="text-gray-300 text-sm font-medium mb-2 block">Rarity</label>
        <div className="flex flex-wrap gap-2">
          {rarities.map((rarity) => (
            <button
              key={rarity}
              onClick={() => toggleArrayFilter('rarity', rarity)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filters.rarity.includes(rarity)
                  ? 'bg-purple-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {rarity}
            </button>
          ))}
        </div>
      </div>

      {/* Set Filters */}
      <div>
        <label className="text-gray-300 text-sm font-medium mb-2 block">Sets</label>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          <div className="text-xs text-gray-400 font-medium">Available Now</div>
          {sets.filter(set => set.status === 'available').map((set) => (
            <button
              key={set.id}
              onClick={() => toggleArrayFilter('sets', set.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.sets.includes(set.id)
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {set.name}
            </button>
          ))}
          
          <div className="text-xs text-gray-400 font-medium mt-3">Upcoming</div>
          {sets.filter(set => set.status === 'upcoming').map((set) => (
            <button
              key={set.id}
              onClick={() => toggleArrayFilter('sets', set.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.sets.includes(set.id)
                  ? 'bg-orange-700 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              } ${set.status === 'upcoming' ? 'opacity-75' : ''}`}
            >
              {set.name} {set.status === 'upcoming' && <span className="text-xs text-orange-300">⏳</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={resetFilters}
        className="flex items-center gap-2 w-full bg-slate-700 hover:bg-slate-600 text-gray-300 px-4 py-2 rounded-lg transition-colors"
      >
        <RotateCcw size={16} />
        Reset Filters
      </button>
    </div>
  );
};
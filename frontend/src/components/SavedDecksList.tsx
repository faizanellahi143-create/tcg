import React from "react";
import { Deck } from "../types/card";
import {
  Play,
  Eye,
  Trash2,
  Calendar,
  DollarSign,
  Users,
  Package,
  Brain,
  Search,
  Filter,
  SortAsc,
  X,
  RotateCcw,
} from "lucide-react";

interface DeckFilterState {
  search: string;
  colors: string[];
  tags: string[];
  minCards: string;
  maxCards: string;
  minValue: string;
  maxValue: string;
  sortBy:
    | "name-asc"
    | "name-desc"
    | "date-newest"
    | "date-oldest"
    | "value-high"
    | "value-low"
    | "cards-high"
    | "cards-low"
    | "winrate-high"
    | "winrate-low";
}
interface SavedDecksListProps {
  savedDecks: Deck[];
  filteredAndSortedDecks: Deck[];
  deckFilters: DeckFilterState;
  onDeckFiltersChange: (filters: DeckFilterState) => void;
  onLoadDeck: (deckId: string) => void;
  onDeleteDeck: (deckId: string) => void;
  onViewDeck: (deck: Deck) => void;
  onAnalyzeDeck: (deck: Deck) => void;
  selectedDeckForAnalysis?: Deck | null;
}

export const SavedDecksList: React.FC<SavedDecksListProps> = ({
  savedDecks,
  filteredAndSortedDecks,
  deckFilters,
  onDeckFiltersChange,
  onLoadDeck,
  onDeleteDeck,
  onViewDeck,
  onAnalyzeDeck,
  selectedDeckForAnalysis,
}) => {
  const availableColors = [
    ...new Set(savedDecks.flatMap((deck) => deck.colors)),
  ];
  const availableTags = [
    ...new Set(savedDecks.flatMap((deck) => deck.tags || [])),
  ];

  const toggleArrayFilter = (key: "colors" | "tags", value: string) => {
    const current = deckFilters[key];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];

    onDeckFiltersChange({ ...deckFilters, [key]: updated });
  };

  const resetFilters = () => {
    onDeckFiltersChange({
      search: "",
      colors: [],
      tags: [],
      minCards: "",
      maxCards: "",
      minValue: "",
      maxValue: "",
      sortBy: "date-newest",
    });
  };

  const hasActiveFilters =
    deckFilters.search ||
    deckFilters.colors.length > 0 ||
    deckFilters.tags.length > 0 ||
    deckFilters.minCards ||
    deckFilters.maxCards ||
    deckFilters.minValue ||
    deckFilters.maxValue ||
    deckFilters.sortBy !== "date-newest";

  if (savedDecks.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 text-center">
        <Package className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-white font-medium mb-2">No Saved Decks</h3>
        <p className="text-gray-400">
          Build and save some decks in the Library tab to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-blue-400" size={24} />
          <h2 className="text-2xl font-bold text-white">My Saved Decks</h2>
          <span className="bg-blue-600 text-white text-sm px-2 py-1 rounded-full">
            {savedDecks.length}
          </span>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="text-gray-400" size={20} />
          <h3 className="text-white font-semibold">Filter & Sort</h3>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Search and Sort Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search decks..."
                value={deckFilters.search}
                onChange={(e) =>
                  onDeckFiltersChange({
                    ...deckFilters,
                    search: e.target.value,
                  })
                }
                className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <SortAsc className="text-gray-400" size={16} />
              <select
                value={deckFilters.sortBy}
                onChange={(e) =>
                  onDeckFiltersChange({
                    ...deckFilters,
                    sortBy: e.target.value as any,
                  })
                }
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="date-newest">Date Created (Newest)</option>
                <option value="date-oldest">Date Created (Oldest)</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="value-high">Market Value (High to Low)</option>
                <option value="value-low">Market Value (Low to High)</option>
                <option value="cards-high">Total Cards (High to Low)</option>
                <option value="cards-low">Total Cards (Low to High)</option>
                <option value="winrate-high">Win Rate (High to Low)</option>
                <option value="winrate-low">Win Rate (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card Count Range */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Card Count
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={deckFilters.minCards}
                  onChange={(e) =>
                    onDeckFiltersChange({
                      ...deckFilters,
                      minCards: e.target.value,
                    })
                  }
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={deckFilters.maxCards}
                  onChange={(e) =>
                    onDeckFiltersChange({
                      ...deckFilters,
                      maxCards: e.target.value,
                    })
                  }
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Market Value Range */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Market Value ($)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Min"
                  value={deckFilters.minValue}
                  onChange={(e) =>
                    onDeckFiltersChange({
                      ...deckFilters,
                      minValue: e.target.value,
                    })
                  }
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Max"
                  value={deckFilters.maxValue}
                  onChange={(e) =>
                    onDeckFiltersChange({
                      ...deckFilters,
                      maxValue: e.target.value,
                    })
                  }
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Colors Filter */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Colors
              </label>
              <div className="flex flex-wrap gap-1">
                {availableColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => toggleArrayFilter("colors", color)}
                    className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                      deckFilters.colors.includes(color)
                        ? "bg-blue-600 text-white"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags Filter */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-1">
                {availableTags.length > 0 ? (
                  availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleArrayFilter("tags", tag)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        deckFilters.tags.includes(tag)
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700 text-gray-300 hover:bg-slate-600"
                      }`}
                    >
                      {tag}
                    </button>
                  ))
                ) : (
                  <span className="text-gray-500 text-xs">
                    No tags available
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
              <span className="text-gray-400 text-sm">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {deckFilters.search && (
                  <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                    Search: "{deckFilters.search}"
                    <button
                      onClick={() =>
                        onDeckFiltersChange({ ...deckFilters, search: "" })
                      }
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                )}
                {deckFilters.colors.map((color) => (
                  <span
                    key={color}
                    className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    {color}
                    <button
                      onClick={() => toggleArrayFilter("colors", color)}
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
                {deckFilters.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => toggleArrayFilter("tags", tag)}
                      className="hover:text-white"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">
            {filteredAndSortedDecks.length === savedDecks.length
              ? `All Decks (${savedDecks.length})`
              : `Filtered Results (${filteredAndSortedDecks.length} of ${savedDecks.length})`}
          </h3>
        </div>

        <div className="grid gap-4">
          {filteredAndSortedDecks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Package size={48} className="mx-auto mb-4 opacity-50" />
              <div className="text-lg mb-2">No decks match your filters</div>
              <div className="text-sm">
                Try adjusting your search criteria or reset filters
              </div>
            </div>
          ) : (
            filteredAndSortedDecks.map((deck) => (
              <div
                key={deck.id}
                className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {deck.name}
                    </h3>
                    {deck.description && (
                      <p className="text-gray-400 text-sm mb-2">
                        {deck.description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        <span>{deck.totalCards} cards</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <DollarSign size={14} />
                        <span>${deck.marketValue.toFixed(2)}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{deck.createdAt.toLocaleDateString()}</span>
                      </div>

                      {deck.wins !== undefined && deck.losses !== undefined && (
                        <div className="flex items-center gap-1">
                          <span className="text-green-400">{deck.wins}W</span>
                          <span>-</span>
                          <span className="text-red-400">{deck.losses}L</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => onViewDeck(deck)}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      title="View deck contents"
                    >
                      <Eye size={14} />
                      View
                    </button>

                    <button
                      onClick={() => onAnalyzeDeck(deck)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedDeckForAnalysis?.id === deck.id
                          ? "bg-purple-600 text-white"
                          : "bg-purple-700 hover:bg-purple-600 text-white"
                      }`}
                      title="Analyze deck with AI"
                    >
                      <Brain size={14} />
                      {selectedDeckForAnalysis?.id === deck.id
                        ? "Analyzing"
                        : "Analyze"}
                    </button>

                    <button
                      onClick={() => onLoadDeck(deck.id)}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      title="Load deck into builder for editing"
                    >
                      <Play size={14} />
                      Re-build
                    </button>

                    <button
                      onClick={() => onDeleteDeck(deck.id)}
                      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                      title="Delete deck"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Colors and Tags */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-sm">Colors:</span>
                    <div className="flex gap-1">
                      {deck.colors.map((color) => (
                        <span
                          key={color}
                          className="text-white bg-slate-600 px-2 py-1 rounded text-xs"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  {deck.tags && deck.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">Tags:</span>
                      <div className="flex gap-1">
                        {deck.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-blue-300 bg-blue-900/30 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {deck.notes && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <p className="text-gray-300 text-sm italic">
                      "{deck.notes}"
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

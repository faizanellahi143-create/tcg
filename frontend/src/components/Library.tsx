import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchCards,
  searchCardsByName,
  fetchCardStats,
  setFilters,
  clearFilters,
  setSearchQuery,
  setCurrentPage,
  selectFilteredCards,
  selectFilters,
  selectLoading,
  selectError,
  selectTotalCards,
  selectCurrentPage,
  selectHasMore,
  selectSearchQuery,
  type TcgCard,
  type CardFilters,
} from "../store/slices/cardSlice";
import { TcgCardGrid } from "./TcgCardGrid";
import { TcgCardDetailModal } from "./TcgCardDetailModal";
import { TcgDeckStatistics } from "./TcgDeckStatistics";
import { Search, Filter, X, Loader2 } from "lucide-react";

interface LibraryProps {
  onCardClick: (card: TcgCard) => void;
  onAddToDeck: (card: TcgCard) => void;
  onRemoveFromDeck: (card: TcgCard) => void;
  deckQuantities: Record<string, number>;
  setIsDraggingCard: (dragging: boolean) => void;
}

export const Library: React.FC<LibraryProps> = ({
  onCardClick,
  onAddToDeck,
  onRemoveFromDeck,
  deckQuantities,
  setIsDraggingCard,
}) => {
  const dispatch = useAppDispatch();

  // Redux state
  const filteredCards = useAppSelector(selectFilteredCards);
  const filters = useAppSelector(selectFilters);
  const loading = useAppSelector(selectLoading);
  const error = useAppSelector(selectError);
  const totalCards = useAppSelector(selectTotalCards);
  const currentPage = useAppSelector(selectCurrentPage);
  const hasMore = useAppSelector(selectHasMore);
  const searchQuery = useAppSelector(selectSearchQuery);

  // Local state
  const [selectedCard, setSelectedCard] = useState<TcgCard | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Fetch initial cards and stats
  useEffect(() => {
    dispatch(fetchCards(1));
    dispatch(fetchCardStats());
  }, [dispatch]);

  // Handle search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchInput(query);
      if (query.trim()) {
        dispatch(searchCardsByName(query));
      } else {
        dispatch(fetchCards(1));
      }
    },
    [dispatch]
  );

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<CardFilters>) => {
    dispatch(setFilters(newFilters));
  };

  // Clear all filters
  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchInput("");
  };

  // Load more cards
  const loadMoreCards = () => {
    if (hasMore && !loading) {
      const nextPage = currentPage + 1;
      dispatch(setCurrentPage(nextPage));
      dispatch(fetchCards(nextPage));
    }
  };

  // Handle card click
  const handleCardClick = (card: TcgCard) => {
    setSelectedCard(card);
    onCardClick(card);
  };

  // Close card detail modal
  const closeCardModal = () => {
    setSelectedCard(null);
  };

  // Get unique values for filter options
  const getUniqueValues = (key: keyof TcgCard) => {
    const values = new Set<string>();
    filteredCards.forEach((card) => {
      if (key === "set") {
        if (card.set?.name) {
          values.add(card.set.name);
        }
      } else if (card[key] && typeof card[key] === "string") {
        values.add(card[key] as string);
      }
    });
    return Array.from(values).sort();
  };

  const uniqueTypes = getUniqueValues("type");
  const uniqueRarities = getUniqueValues("rarity");
  const uniqueSets = getUniqueValues("set");
  const uniqueAffinities = getUniqueValues("affinity");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Card Library</h2>
            <p className="text-gray-400">
              Browse and search through {totalCards.toLocaleString()} cards from
              the Union Arena TCG
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                showFilters
                  ? "bg-blue-600 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              <Filter size={16} />
              Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors"
            >
              <X size={16} />
              Clear All
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search cards by name or effect..."
            value={searchInput}
            onChange={handleSearchInputChange}
            className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">
              {totalCards.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Total Cards</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-400">
              {filteredCards.length.toLocaleString()}
            </div>
            <div className="text-xs text-gray-400">Showing</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {uniqueTypes.length}
            </div>
            <div className="text-xs text-gray-400">Card Types</div>
          </div>
          <div className="bg-slate-700 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {uniqueSets.length}
            </div>
            <div className="text-xs text-gray-400">Sets</div>
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
                BP: {filters.minBp || "0"} - {filters.maxBp || "∞"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Advanced Filters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Card Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange({ type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {uniqueTypes.map((type) => (
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
                onChange={(e) => handleFilterChange({ rarity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Rarities</option>
                {uniqueRarities.map((rarity) => (
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
                onChange={(e) => handleFilterChange({ set: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Sets</option>
                {uniqueSets.map((set) => (
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
                onChange={(e) =>
                  handleFilterChange({ affinity: e.target.value })
                }
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Affinities</option>
                {uniqueAffinities.map((affinity) => (
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
                onChange={(e) => handleFilterChange({ minBp: e.target.value })}
                placeholder="0"
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
                onChange={(e) => handleFilterChange({ maxBp: e.target.value })}
                placeholder="∞"
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* TCG Deck Statistics */}
      {filteredCards.length > 0 && (
        <TcgDeckStatistics
          cards={filteredCards}
          title="Library Statistics"
          showProgressBar={false}
        />
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <X size={20} />
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Cards ({filteredCards.length.toLocaleString()})
          </h3>
          {loading && (
            <div className="flex items-center gap-2 text-blue-400">
              <Loader2 className="animate-spin" size={16} />
              <span>Loading...</span>
            </div>
          )}
        </div>

        {filteredCards.length > 0 ? (
          <>
            <TcgCardGrid
              cards={filteredCards}
              onCardClick={handleCardClick}
              onAddToDeck={onAddToDeck}
              onRemoveFromDeck={onRemoveFromDeck}
              deckQuantities={deckQuantities}
              showQuantityControls={true}
              setIsDraggingCard={setIsDraggingCard}
            />

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMoreCards}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={16} />
                      Loading...
                    </div>
                  ) : (
                    "Load More Cards"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={24} />
                  <span>Loading cards...</span>
                </div>
              ) : (
                <div>
                  <p className="text-xl mb-2">No cards found</p>
                  <p className="text-sm">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Detail Modal */}
      {selectedCard && (
        <TcgCardDetailModal
          card={selectedCard}
          onClose={closeCardModal}
          onAddToDeck={onAddToDeck}
          onRemoveFromDeck={onRemoveFromDeck}
          deckQuantity={deckQuantities[selectedCard._id] || 0}
        />
      )}
    </div>
  );
};

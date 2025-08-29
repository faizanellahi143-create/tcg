import React, { useState } from 'react';
import { Globe, Search, Star, Download, Eye, Heart, TrendingUp, Calendar, Users, Filter, SortAsc, X, Award, Zap } from 'lucide-react';
import { Deck } from '../types/card';

interface PublicDeckBrowserProps {
  publicDecks: Deck[];
  onLoadDeck: (deck: Deck) => void;
  onViewDeck: (deck: Deck) => void;
  onLikeDeck: (deckId: string) => void;
  onFollowUser: (username: string) => void;
  userLikes: Set<string>;
  userFollowing: Set<string>;
}

interface PublicDeckFilters {
  search: string;
  colors: string[];
  tags: string[];
  authors: string[];
  minCards: string;
  maxCards: string;
  minValue: string;
  maxValue: string;
  sortBy: 'popularity' | 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'value-high' | 'value-low' | 'likes-high' | 'winrate-high';
  timeframe: 'all' | 'week' | 'month' | 'year';
}

export const PublicDeckBrowser: React.FC<PublicDeckBrowserProps> = ({
  publicDecks,
  onLoadDeck,
  onViewDeck,
  onLikeDeck,
  onFollowUser,
  userLikes,
  userFollowing
}) => {
  const [filters, setFilters] = useState<PublicDeckFilters>({
    search: '',
    colors: [],
    tags: [],
    authors: [],
    minCards: '',
    maxCards: '',
    minValue: '',
    maxValue: '',
    sortBy: 'popularity',
    timeframe: 'all'
  });

  const [showFilters, setShowFilters] = useState(false);

  const availableColors = [...new Set(publicDecks.flatMap(deck => deck.colors))];
  const availableTags = [...new Set(publicDecks.flatMap(deck => deck.tags || []))];
  const availableAuthors = [...new Set(publicDecks.map(deck => deck.author).filter(Boolean))];

  const toggleArrayFilter = (key: 'colors' | 'tags' | 'authors', value: string) => {
    const current = filters[key];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    
    setFilters({ ...filters, [key]: updated });
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      colors: [],
      tags: [],
      authors: [],
      minCards: '',
      maxCards: '',
      minValue: '',
      maxValue: '',
      sortBy: 'popularity',
      timeframe: 'all'
    });
  };

  const filteredDecks = publicDecks.filter(deck => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (!deck.name.toLowerCase().includes(searchLower) &&
          !deck.description?.toLowerCase().includes(searchLower) &&
          !deck.author?.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Color filter
    if (filters.colors.length > 0) {
      if (!filters.colors.some(color => deck.colors.includes(color))) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags.length > 0) {
      if (!deck.tags || !filters.tags.some(tag => deck.tags.includes(tag))) {
        return false;
      }
    }

    // Authors filter
    if (filters.authors.length > 0) {
      if (!deck.author || !filters.authors.includes(deck.author)) {
        return false;
      }
    }

    // Card count filters
    if (filters.minCards && deck.totalCards < parseInt(filters.minCards)) {
      return false;
    }
    if (filters.maxCards && deck.totalCards > parseInt(filters.maxCards)) {
      return false;
    }

    // Market value filters
    if (filters.minValue && deck.marketValue < parseFloat(filters.minValue)) {
      return false;
    }
    if (filters.maxValue && deck.marketValue > parseFloat(filters.maxValue)) {
      return false;
    }

    // Timeframe filter
    if (filters.timeframe !== 'all') {
      const now = new Date();
      const deckDate = new Date(deck.createdAt);
      const daysDiff = (now.getTime() - deckDate.getTime()) / (1000 * 60 * 60 * 24);
      
      switch (filters.timeframe) {
        case 'week':
          if (daysDiff > 7) return false;
          break;
        case 'month':
          if (daysDiff > 30) return false;
          break;
        case 'year':
          if (daysDiff > 365) return false;
          break;
      }
    }

    return true;
  });

  // Sort filtered decks
  const sortedDecks = [...filteredDecks].sort((a, b) => {
    switch (filters.sortBy) {
      case 'popularity':
        return (b.likes || 0) - (a.likes || 0);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'value-high':
        return b.marketValue - a.marketValue;
      case 'value-low':
        return a.marketValue - b.marketValue;
      case 'likes-high':
        return (b.likes || 0) - (a.likes || 0);
      case 'winrate-high':
        const aWinRate = (a.wins || 0) + (a.losses || 0) > 0 ? (a.wins || 0) / ((a.wins || 0) + (a.losses || 0)) : 0;
        const bWinRate = (b.wins || 0) + (b.losses || 0) > 0 ? (b.wins || 0) / ((b.wins || 0) + (b.losses || 0)) : 0;
        return bWinRate - aWinRate;
      default:
        return 0;
    }
  });

  const hasActiveFilters = filters.search || 
    filters.colors.length > 0 || 
    filters.tags.length > 0 || 
    filters.authors.length > 0 ||
    filters.minCards || 
    filters.maxCards || 
    filters.minValue || 
    filters.maxValue ||
    filters.sortBy !== 'popularity' ||
    filters.timeframe !== 'all';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="text-green-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Community Deck Browser</h2>
          <span className="bg-green-600 text-white text-sm px-2 py-1 rounded-full">
            {publicDecks.length} decks
          </span>
        </div>
        
        <p className="text-gray-300 mb-6">
          Discover amazing decks shared by the community. Find inspiration, learn new strategies, 
          and connect with fellow pilots from around the world.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Decks</div>
            <div className="text-2xl font-bold text-white">{publicDecks.length}</div>
            <div className="text-xs text-gray-500">Community shared</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Active Builders</div>
            <div className="text-2xl font-bold text-green-400">{availableAuthors.length}</div>
            <div className="text-xs text-gray-500">Contributing pilots</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Most Popular</div>
            <div className="text-lg font-bold text-yellow-400">
              {publicDecks.length > 0 
                ? publicDecks.reduce((max, deck) => (deck.likes || 0) > (max.likes || 0) ? deck : max).name.slice(0, 15) + '...'
                : 'N/A'
              }
            </div>
            <div className="text-xs text-gray-500">
              {publicDecks.length > 0 
                ? `${publicDecks.reduce((max, deck) => (deck.likes || 0) > (max.likes || 0) ? deck : max).likes || 0} likes`
                : 'No decks yet'
              }
            </div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Avg. Deck Value</div>
            <div className="text-2xl font-bold text-green-400">
              ${publicDecks.length > 0 
                ? (publicDecks.reduce((sum, deck) => sum + deck.marketValue, 0) / publicDecks.length).toFixed(0)
                : '0'
              }
            </div>
            <div className="text-xs text-gray-500">Market estimate</div>
          </div>
        </div>
      </div>

      {/* Search and Quick Filters */}
      <div className="bg-slate-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search decks, authors, or descriptions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full bg-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Quick Sort */}
          <div className="flex items-center gap-2">
            <SortAsc className="text-gray-400" size={16} />
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
            >
              <option value="popularity">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="value-high">Highest Value</option>
              <option value="value-low">Lowest Value</option>
              <option value="likes-high">Most Liked</option>
              <option value="winrate-high">Best Win Rate</option>
            </select>
          </div>

          {/* Timeframe */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'year', label: 'This Year' }
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setFilters({ ...filters, timeframe: period.id as any })}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  filters.timeframe === period.id
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            <Filter size={16} />
            Filters
            {hasActiveFilters && <span className="bg-blue-400 text-blue-900 text-xs px-1 rounded-full">!</span>}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card Count Range */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Card Count</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minCards}
                    onChange={(e) => setFilters({ ...filters, minCards: e.target.value })}
                    className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxCards}
                    onChange={(e) => setFilters({ ...filters, maxCards: e.target.value })}
                    className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Market Value Range */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Market Value ($)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Min"
                    value={filters.minValue}
                    onChange={(e) => setFilters({ ...filters, minValue: e.target.value })}
                    className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Max"
                    value={filters.maxValue}
                    onChange={(e) => setFilters({ ...filters, maxValue: e.target.value })}
                    className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                  />
                </div>
              </div>

              {/* Colors Filter */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Colors</label>
                <div className="flex flex-wrap gap-1">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => toggleArrayFilter('colors', color)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        filters.colors.includes(color)
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="text-gray-300 text-sm font-medium mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-1">
                  {availableTags.length > 0 ? (
                    availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleArrayFilter('tags', tag)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          filters.tags.includes(tag)
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))
                  ) : (
                    <span className="text-gray-500 text-xs">No tags available</span>
                  )}
                </div>
              </div>
            </div>

            {/* Authors Filter */}
            <div>
              <label className="text-gray-300 text-sm font-medium mb-2 block">Authors</label>
              <div className="flex flex-wrap gap-2">
                {availableAuthors.map((author) => (
                  <button
                    key={author}
                    onClick={() => toggleArrayFilter('authors', author!)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filters.authors.includes(author!)
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    {author}
                    {userFollowing.has(author!) && (
                      <span className="ml-1 text-xs">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 pt-2 border-t border-slate-600">
                <span className="text-gray-400 text-sm">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {filters.search && (
                    <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                      Search: "{filters.search}"
                      <button
                        onClick={() => setFilters({ ...filters, search: '' })}
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  )}
                  {filters.colors.map((color) => (
                    <span key={color} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {color}
                      <button
                        onClick={() => toggleArrayFilter('colors', color)}
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {filters.tags.map((tag) => (
                    <span key={tag} className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => toggleArrayFilter('tags', tag)}
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {filters.authors.map((author) => (
                    <span key={author} className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs flex items-center gap-1">
                      {author}
                      <button
                        onClick={() => toggleArrayFilter('authors', author)}
                        className="hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <button
                  onClick={resetFilters}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">
            {sortedDecks.length === publicDecks.length 
              ? `All Community Decks (${publicDecks.length})`
              : `Filtered Results (${sortedDecks.length} of ${publicDecks.length})`
            }
          </h3>
        </div>

        {sortedDecks.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Globe size={48} className="mx-auto mb-4 opacity-50" />
            <div className="text-lg mb-2">No decks match your filters</div>
            <div className="text-sm">Try adjusting your search criteria or reset filters</div>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedDecks.map((deck) => {
              const isLiked = userLikes.has(deck.id);
              const isFollowing = userFollowing.has(deck.author || '');
              const winRate = (deck.wins || 0) + (deck.losses || 0) > 0 
                ? Math.round(((deck.wins || 0) / ((deck.wins || 0) + (deck.losses || 0))) * 100)
                : null;

              return (
                <div
                  key={deck.id}
                  className="bg-slate-700 rounded-lg p-6 border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white font-bold text-xl">{deck.name}</h3>
                        {deck.featured && (
                          <span className="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <Award size={12} />
                            Featured
                          </span>
                        )}
                        {deck.trending && (
                          <span className="bg-orange-600 text-orange-100 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <TrendingUp size={12} />
                            Trending
                          </span>
                        )}
                      </div>
                      
                      {deck.description && (
                        <p className="text-gray-300 mb-3">{deck.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Users size={14} />
                          <button
                            onClick={() => onFollowUser(deck.author || '')}
                            className={`hover:text-white transition-colors ${
                              isFollowing ? 'text-green-400' : ''
                            }`}
                          >
                            {deck.author}
                            {isFollowing && ' ✓'}
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(deck.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Zap size={14} />
                          <span>{deck.totalCards} cards</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <TrendingUp size={14} />
                          <span>${deck.marketValue.toFixed(0)}</span>
                        </div>
                        
                        {winRate !== null && (
                          <div className="flex items-center gap-1">
                            <Award size={14} />
                            <span className="text-green-400">{winRate}% WR</span>
                          </div>
                        )}
                      </div>

                      {/* Colors and Tags */}
                      <div className="flex items-center gap-4 mb-4">
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
                              {deck.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-blue-300 bg-blue-900/30 px-2 py-1 rounded text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                              {deck.tags.length > 3 && (
                                <span className="text-gray-400 text-xs">+{deck.tags.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Performance Stats */}
                      {((deck.wins || 0) > 0 || (deck.losses || 0) > 0) && (
                        <div className="bg-slate-600 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-gray-400">Record: </span>
                                <span className="text-green-400">{deck.wins || 0}W</span>
                                <span className="text-gray-400"> - </span>
                                <span className="text-red-400">{deck.losses || 0}L</span>
                              </div>
                              {winRate !== null && (
                                <div>
                                  <span className="text-gray-400">Win Rate: </span>
                                  <span className={`font-medium ${
                                    winRate >= 60 ? 'text-green-400' : 
                                    winRate >= 40 ? 'text-yellow-400' : 'text-red-400'
                                  }`}>
                                    {winRate}%
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              Based on {(deck.wins || 0) + (deck.losses || 0)} recorded games
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => onViewDeck(deck)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        <Eye size={14} />
                        View
                      </button>
                      
                      <button
                        onClick={() => onLoadDeck(deck)}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        <Download size={14} />
                        Import
                      </button>
                      
                      <button
                        onClick={() => onLikeDeck(deck.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
                          isLiked
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                        }`}
                      >
                        <Heart size={14} fill={isLiked ? 'currentColor' : 'none'} />
                        {deck.likes || 0}
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  {deck.notes && (
                    <div className="bg-slate-600 rounded-lg p-3">
                      <div className="text-gray-400 text-xs mb-1">Author's Notes:</div>
                      <p className="text-gray-200 text-sm italic">"{deck.notes}"</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
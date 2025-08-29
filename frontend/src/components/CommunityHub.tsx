import React, { useState } from 'react';
import { Users, TrendingUp, Award, Calendar, MessageCircle, Heart, Star, Crown, Zap } from 'lucide-react';
import { Deck } from '../types/card';

interface CommunityHubProps {
  publicDecks: Deck[];
  featuredDecks: Deck[];
  trendingDecks: Deck[];
  topBuilders: Array<{
    username: string;
    deckCount: number;
    totalLikes: number;
    winRate: number;
    isFollowing: boolean;
  }>;
  onViewDeck: (deck: Deck) => void;
  onFollowUser: (username: string) => void;
}

export const CommunityHub: React.FC<CommunityHubProps> = ({
  publicDecks,
  featuredDecks,
  trendingDecks,
  topBuilders,
  onViewDeck,
  onFollowUser
}) => {
  const [activeSection, setActiveSection] = useState<'featured' | 'trending' | 'recent'>('featured');

  const recentDecks = publicDecks
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const sections = [
    { id: 'featured', label: 'Featured', icon: Award, decks: featuredDecks },
    { id: 'trending', label: 'Trending', icon: TrendingUp, decks: trendingDecks },
    { id: 'recent', label: 'Recent', icon: Calendar, decks: recentDecks }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="text-blue-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Community Hub</h2>
        </div>
        
        <p className="text-gray-300 mb-6">
          Welcome to the Mobile Suit TCG community! Discover amazing decks, connect with fellow pilots, 
          and stay up-to-date with the latest meta developments.
        </p>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Community Decks</div>
            <div className="text-2xl font-bold text-white">{publicDecks.length}</div>
            <div className="text-xs text-gray-500">Shared publicly</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Active Builders</div>
            <div className="text-2xl font-bold text-blue-400">{topBuilders.length}</div>
            <div className="text-xs text-gray-500">Contributing pilots</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Likes</div>
            <div className="text-2xl font-bold text-red-400">
              {publicDecks.reduce((sum, deck) => sum + (deck.likes || 0), 0)}
            </div>
            <div className="text-xs text-gray-500">Community appreciation</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">This Week</div>
            <div className="text-2xl font-bold text-green-400">
              {publicDecks.filter(deck => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(deck.createdAt) > weekAgo;
              }).length}
            </div>
            <div className="text-xs text-gray-500">New decks</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Featured/Trending/Recent Decks */}
        <div className="lg:col-span-2 bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <Icon size={16} />
                  {section.label} ({section.decks.length})
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            {sections.find(s => s.id === activeSection)?.decks.map((deck) => (
              <div
                key={deck.id}
                className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-bold text-lg">{deck.name}</h3>
                      {deck.featured && (
                        <span className="bg-yellow-600 text-yellow-100 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <Award size={12} />
                          Featured
                        </span>
                      )}
                      {deck.trending && (
                        <span className="bg-orange-600 text-orange-100 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <TrendingUp size={12} />
                          Hot
                        </span>
                      )}
                    </div>
                    
                    {deck.description && (
                      <p className="text-gray-300 text-sm mb-2">{deck.description}</p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>by {deck.author}</span>
                      <span>{new Date(deck.createdAt).toLocaleDateString()}</span>
                      <span>{deck.totalCards} cards</span>
                      <span>${deck.marketValue.toFixed(0)}</span>
                      <div className="flex items-center gap-1">
                        <Heart size={12} />
                        <span>{deck.likes || 0}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewDeck(deck)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    View Deck
                  </button>
                </div>

                {/* Colors and Tags */}
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {deck.colors.map((color) => (
                      <span key={color} className="bg-slate-600 text-white px-2 py-1 rounded text-xs">
                        {color}
                      </span>
                    ))}
                  </div>
                  
                  {deck.tags && deck.tags.length > 0 && (
                    <div className="flex gap-1">
                      {deck.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sections.find(s => s.id === activeSection)?.decks.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Award size={48} className="mx-auto mb-4 opacity-50" />
                <div className="text-lg mb-2">No {activeSection} decks yet</div>
                <div className="text-sm">Check back later for community highlights!</div>
              </div>
            )}
          </div>
        </div>

        {/* Top Builders Sidebar */}
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="text-yellow-400" size={20} />
            <h3 className="text-white font-semibold text-lg">Top Builders</h3>
          </div>

          <div className="space-y-3">
            {topBuilders.slice(0, 10).map((builder, index) => (
              <div
                key={builder.username}
                className="bg-slate-700 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-600 text-yellow-100' :
                    index === 1 ? 'bg-gray-400 text-gray-900' :
                    index === 2 ? 'bg-orange-600 text-orange-100' :
                    'bg-slate-600 text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div>
                    <div className="text-white font-medium">{builder.username}</div>
                    <div className="text-xs text-gray-400">
                      {builder.deckCount} decks • {builder.totalLikes} likes
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {builder.winRate > 0 && (
                    <div className="text-xs text-green-400 font-medium">
                      {Math.round(builder.winRate * 100)}% WR
                    </div>
                  )}
                  
                  <button
                    onClick={() => onFollowUser(builder.username)}
                    className={`text-xs px-2 py-1 rounded transition-colors ${
                      builder.isFollowing
                        ? 'bg-green-600 text-white'
                        : 'bg-slate-600 hover:bg-slate-500 text-gray-300'
                    }`}
                  >
                    {builder.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              </div>
            ))}

            {topBuilders.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <div className="text-lg mb-2">No builders yet</div>
                <div className="text-sm">Be the first to share a deck!</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Weekly Highlights */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="text-purple-400" size={24} />
          <h3 className="text-xl font-bold text-white">Weekly Highlights</h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="text-yellow-400" size={16} />
              <span className="text-white font-medium">Deck of the Week</span>
            </div>
            {featuredDecks.length > 0 ? (
              <div>
                <div className="text-blue-400 font-medium">{featuredDecks[0].name}</div>
                <div className="text-gray-400 text-sm">by {featuredDecks[0].author}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {featuredDecks[0].likes || 0} likes • {featuredDecks[0].totalCards} cards
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No featured deck this week</div>
            )}
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-orange-400" size={16} />
              <span className="text-white font-medium">Rising Star</span>
            </div>
            {topBuilders.length > 0 ? (
              <div>
                <div className="text-orange-400 font-medium">{topBuilders[0].username}</div>
                <div className="text-gray-400 text-sm">{topBuilders[0].deckCount} decks shared</div>
                <div className="text-xs text-gray-500 mt-1">
                  {topBuilders[0].totalLikes} total likes
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No rising stars yet</div>
            )}
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="text-green-400" size={16} />
              <span className="text-white font-medium">Most Discussed</span>
            </div>
            {publicDecks.length > 0 ? (
              <div>
                <div className="text-green-400 font-medium">
                  {publicDecks.reduce((max, deck) => 
                    (deck.comments || 0) > (max.comments || 0) ? deck : max
                  ).name}
                </div>
                <div className="text-gray-400 text-sm">
                  by {publicDecks.reduce((max, deck) => 
                    (deck.comments || 0) > (max.comments || 0) ? deck : max
                  ).author}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {publicDecks.reduce((max, deck) => 
                    (deck.comments || 0) > (max.comments || 0) ? deck : max
                  ).comments || 0} comments
                </div>
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No discussions yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Deck Showcase */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-semibold text-lg">Community Showcase</h3>
          
          <div className="flex gap-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <Icon size={14} />
                  {section.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.find(s => s.id === activeSection)?.decks.map((deck) => (
            <div
              key={deck.id}
              onClick={() => onViewDeck(deck)}
              className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-slate-500 transition-all duration-200 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-1">{deck.name}</h4>
                  <div className="text-gray-400 text-sm mb-2">by {deck.author}</div>
                  
                  {deck.description && (
                    <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                      {deck.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-1">
                  {deck.colors.map((color) => (
                    <span key={color} className="bg-slate-600 text-white px-2 py-1 rounded text-xs">
                      {color}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Heart size={12} />
                    <span>{deck.likes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={12} />
                    <span>{deck.comments || 0}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{deck.totalCards} cards • ${deck.marketValue.toFixed(0)}</span>
                <span>{new Date(deck.createdAt).toLocaleDateString()}</span>
              </div>

              {deck.tags && deck.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {deck.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                  {deck.tags.length > 2 && (
                    <span className="text-gray-400 text-xs">+{deck.tags.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {sections.find(s => s.id === activeSection)?.decks.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <div className="text-lg mb-2">No {activeSection} decks</div>
            <div className="text-sm">Check back later for community highlights!</div>
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { X, Package, DollarSign, Calendar, TrendingUp, Users, History, RotateCcw, Trash2, Clock, BarChart3 } from 'lucide-react';
import { Deck, GameRecord } from '../types/card';

interface SavedDeckDetailModalProps {
  deck: Deck | null;
  onClose: () => void;
  onAddGameRecord?: (gameRecord: GameRecord) => void;
  onRevertToVersion?: (deckId: string, versionId: string) => void;
  onDeleteVersion?: (deckId: string, versionId: string) => void;
}

export const SavedDeckDetailModal: React.FC<SavedDeckDetailModalProps> = ({
  deck,
  onClose,
  onAddGameRecord,
  onRevertToVersion,
  onDeleteVersion
}) => {
  if (!deck) return null;

  const getColorClasses = (colors: string[]) => {
    if (colors.includes('Blue')) return 'border-blue-500 bg-gradient-to-br from-blue-950/50 to-blue-900/30';
    if (colors.includes('Red')) return 'border-red-500 bg-gradient-to-br from-red-950/50 to-red-900/30';
    if (colors.includes('Green')) return 'border-green-500 bg-gradient-to-br from-green-950/50 to-green-900/30';
    if (colors.includes('White')) return 'border-gray-400 bg-gradient-to-br from-gray-800/50 to-gray-700/30';
    return 'border-gray-500 bg-gradient-to-br from-gray-800/40 to-gray-700/20';
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">{deck.name}</h2>
            <p className="text-gray-400 text-sm">{deck.totalCards} cards • ${deck.marketValue.toFixed(2)} value</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Deck Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Package size={16} />
                Deck Information
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Cards:</span>
                  <span className="text-white font-medium">{deck.totalCards}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Value:</span>
                  <span className="text-green-400 font-medium">${deck.marketValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-white font-medium">{deck.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Updated:</span>
                  <span className="text-white font-medium">{deck.updatedAt.toLocaleDateString()}</span>
                </div>
                {deck.author && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Author:</span>
                    <span className="text-white font-medium">{deck.author}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <TrendingUp size={16} />
                Performance
              </h3>
              
              <div className="space-y-2 text-sm">
                {deck.wins !== undefined && deck.losses !== undefined ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Record:</span>
                      <span className="text-white font-medium">
                        <span className="text-green-400">{deck.wins}W</span> - <span className="text-red-400">{deck.losses}L</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate:</span>
                      <span className="text-white font-medium">
                        {deck.wins + deck.losses > 0 
                          ? Math.round((deck.wins / (deck.wins + deck.losses)) * 100)
                          : 0
                        }%
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400">No games recorded yet</p>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Colors:</span>
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
              </div>
            </div>
          </div>

          {/* Description and Notes */}
          {(deck.description || deck.notes) && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-3">Description & Notes</h3>
              {deck.description && (
                <p className="text-gray-300 mb-3">{deck.description}</p>
              )}
              {deck.notes && (
                <p className="text-gray-400 italic text-sm">"{deck.notes}"</p>
              )}
            </div>
          )}

          {/* Tags */}
          {deck.tags && deck.tags.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <h3 className="text-white font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {deck.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-blue-300 bg-blue-900/30 px-3 py-1 rounded-lg text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Game Statistics */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <BarChart3 size={16} />
              Game Statistics & Performance
            </h3>
            
            {/* Add Game Form */}
            <div className="bg-slate-700 rounded-lg p-4 mb-4">
              <h4 className="text-white font-medium mb-3">Record New Game</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Opponent deck type"
                  className="bg-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
                <select className="bg-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none">
                  <option value="win">Win</option>
                  <option value="loss">Loss</option>
                </select>
                <select className="bg-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none">
                  <option value="Standard">Standard</option>
                  <option value="Extended">Extended</option>
                  <option value="Unlimited">Unlimited</option>
                </select>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Add Game
                </button>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Win Rate</div>
                <div className={`text-2xl font-bold ${
                  deck.wins && deck.losses && (deck.wins + deck.losses) > 0
                    ? Math.round((deck.wins / (deck.wins + deck.losses)) * 100) >= 60 
                      ? 'text-green-400' 
                      : Math.round((deck.wins / (deck.wins + deck.losses)) * 100) >= 40 
                        ? 'text-yellow-400' 
                        : 'text-red-400'
                    : 'text-gray-400'
                }`}>
                  {deck.wins && deck.losses && (deck.wins + deck.losses) > 0
                    ? Math.round((deck.wins / (deck.wins + deck.losses)) * 100)
                    : 0
                  }%
                </div>
                <div className="text-xs text-gray-500">
                  {deck.wins || 0}W - {deck.losses || 0}L
                </div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Total Games</div>
                <div className="text-2xl font-bold text-white">
                  {(deck.wins || 0) + (deck.losses || 0)}
                </div>
                <div className="text-xs text-gray-500">Recorded matches</div>
              </div>
              
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-gray-400 text-sm">Recent Form</div>
                <div className="flex gap-1 mt-1">
                  {(deck.gameHistory || []).slice(0, 5).map((game, index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full ${
                        game.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      title={`${game.result} vs ${game.opponent}`}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">Last 5 games</div>
              </div>
            </div>
          {/* Card List */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <History size={16} />
              Version History ({deck.versions?.length || 0} versions)
            </h3>
            
            {deck.versions && deck.versions.length > 0 ? (
              <div className="space-y-3">
                {deck.versions
                  .sort((a, b) => b.version - a.version)
                  .map((version) => (
                  <div key={version.id} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          v{version.version}
                        </div>
                        <div>
                          <div className="text-white font-medium">{version.name}</div>
                          <div className="text-gray-400 text-sm flex items-center gap-2">
                            <Clock size={12} />
                            {version.createdAt.toLocaleDateString()} at {version.createdAt.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {onRevertToVersion && (
                          <button
                            onClick={() => onRevertToVersion(deck.id, version.id)}
                            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                            title="Load this version into the deck builder"
                          >
                            <RotateCcw size={14} />
                            Revert
                          </button>
                        )}
                        
                        {onDeleteVersion && deck.versions && deck.versions.length > 1 && (
                          <button
                            onClick={() => onDeleteVersion(deck.id, version.id)}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                            title="Delete this version"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 text-sm">
                      <div>
                        <span className="text-gray-400">Cards:</span>
                        <span className="text-white ml-2">{version.totalCards}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Value:</span>
                        <span className="text-green-400 ml-2">${version.marketValue.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Unique:</span>
                        <span className="text-white ml-2">{version.cards.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Avg Cost:</span>
                        <span className="text-white ml-2">
                          {version.totalCards > 0 
                            ? (version.cards.reduce((sum, card) => sum + (card.cost * card.quantity), 0) / version.totalCards).toFixed(1)
                            : '0.0'
                          }
                        </span>
                      </div>
                    </div>
                    
                    {version.notes && (
                      <div className="bg-slate-600 rounded-lg p-3 mt-3">
                        <div className="text-gray-400 text-xs mb-1">Version Notes:</div>
                        <div className="text-gray-200 text-sm italic">"{version.notes}"</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <History size={48} className="mx-auto mb-4 opacity-50" />
                <div className="text-lg mb-2">No version history</div>
                <div className="text-sm">Versions will appear here when you save updates to this deck</div>
              </div>
            )}
          </div>

            {/* Recent Games List */}
            {deck.gameHistory && deck.gameHistory.length > 0 && (
              <div>
                <h4 className="text-white font-medium mb-3">Recent Games</h4>
                <div className="space-y-2">
                  {deck.gameHistory.slice(0, 5).map((game) => (
                    <div key={game.id} className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          game.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <span className="text-white font-medium">vs {game.opponent}</span>
                          <div className="text-xs text-gray-400">
                            {game.format} • {new Date(game.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded text-sm font-medium ${
                        game.result === 'win' 
                          ? 'bg-green-600/20 text-green-300' 
                          : 'bg-red-600/20 text-red-300'
                      }`}>
                        {game.result.toUpperCase()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          {/* Card List */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Users size={16} />
              Current Deck Contents ({deck.cards.length} unique cards)
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {deck.cards.map((card) => (
                <div
                  key={card.id}
                  className={`relative bg-slate-700 rounded-lg overflow-hidden border-2 ${getColorClasses(card.colors)}`}
                >
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-32 sm:h-40 object-cover"
                    loading="lazy"
                  />
                  
                  {/* Cost */}
                  <div className="absolute top-1 left-1 w-6 h-6 bg-blue-800/90 text-white rounded-full flex items-center justify-center text-xs font-bold backdrop-blur-sm">
                    {card.cost}
                  </div>
                  
                  {/* Quantity */}
                  <div className="absolute bottom-1 right-1 bg-black/90 text-white px-2 py-1 rounded text-xs font-bold backdrop-blur-sm">
                    x{card.quantity}
                  </div>
                  
                  {/* Power/HP for units */}
                  {card.type === 'Unit' && card.power && card.hp && (
                    <div className="absolute bottom-1 left-1 bg-black/90 text-white px-1 py-0.5 rounded text-xs backdrop-blur-sm">
                      {card.power}/{card.hp}
                    </div>
                  )}
                  
                  <div className="p-2">
                    <div className="text-white text-xs font-medium truncate" title={card.name}>
                      {card.name}
                    </div>
                    <div className="text-gray-400 text-xs">{card.id}</div>
                    <div className="text-blue-300 text-xs">{card.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
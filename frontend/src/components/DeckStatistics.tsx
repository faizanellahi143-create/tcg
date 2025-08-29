import React, { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, Calendar, Award } from 'lucide-react';
import { Deck, GameRecord } from '../types/card';

interface DeckStatisticsProps {
  deck: Deck;
  onAddGameRecord: (gameRecord: GameRecord) => void;
}

export const DeckStatistics: React.FC<DeckStatisticsProps> = ({ deck, onAddGameRecord }) => {
  const gameRecords = deck.gameHistory || [];
  const [newGame, setNewGame] = useState({ opponent: '', result: 'win' as 'win' | 'loss', format: 'Standard' });
  const [showAddGame, setShowAddGame] = useState(false);

  const wins = gameRecords.filter(game => game.result === 'win').length;
  const losses = gameRecords.filter(game => game.result === 'loss').length;
  const totalGames = wins + losses;
  const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

  const matchupStats = gameRecords.reduce((acc, game) => {
    if (!acc[game.opponent]) {
      acc[game.opponent] = { wins: 0, losses: 0 };
    }
    acc[game.opponent][game.result]++;
    return acc;
  }, {} as Record<string, { wins: number; losses: number }>);

  const addGameRecord = () => {
    if (!newGame.opponent) return;
    
    const record: GameRecord = {
      id: Date.now().toString(),
      opponent: newGame.opponent,
      result: newGame.result,
      date: new Date(),
      format: newGame.format
    };
    
    onAddGameRecord(record);
    setNewGame({ opponent: '', result: 'win', format: 'Standard' });
    setShowAddGame(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-green-400" size={24} />
            <h2 className="text-2xl font-bold text-white">Deck Statistics</h2>
          </div>
          <button
            onClick={() => setShowAddGame(!showAddGame)}
            className="bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Record Game
          </button>
        </div>

        {/* Add Game Form */}
        {showAddGame && (
          <div className="bg-slate-700 rounded-lg p-4 mb-4">
            <h3 className="text-white font-medium mb-3">Record New Game</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Opponent deck type"
                value={newGame.opponent}
                onChange={(e) => setNewGame({ ...newGame, opponent: e.target.value })}
                className="bg-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <select
                value={newGame.result}
                onChange={(e) => setNewGame({ ...newGame, result: e.target.value as 'win' | 'loss' })}
                className="bg-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="win">Win</option>
                <option value="loss">Loss</option>
              </select>
              <select
                value={newGame.format}
                onChange={(e) => setNewGame({ ...newGame, format: e.target.value })}
                className="bg-slate-600 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none"
              >
                <option value="Standard">Standard</option>
                <option value="Extended">Extended</option>
                <option value="Unlimited">Unlimited</option>
              </select>
              <button
                onClick={addGameRecord}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add Game
              </button>
            </div>
          </div>
        )}
        
        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Win Rate</div>
            <div className={`text-2xl font-bold ${winRate >= 60 ? 'text-green-400' : winRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
              {winRate}%
            </div>
            <div className="text-xs text-gray-500">{wins}W - {losses}L</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Games</div>
            <div className="text-2xl font-bold text-white">{totalGames}</div>
            <div className="text-xs text-gray-500">Recorded matches</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Best Matchup</div>
            <div className="text-lg font-bold text-green-400">
              {Object.entries(matchupStats).length > 0 
                ? Object.entries(matchupStats)
                    .map(([opponent, stats]) => ({
                      opponent,
                      winRate: stats.wins / (stats.wins + stats.losses)
                    }))
                    .sort((a, b) => b.winRate - a.winRate)[0]?.opponent || 'N/A'
                : 'N/A'
              }
            </div>
            <div className="text-xs text-gray-500">Highest win rate</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Recent Form</div>
            <div className="flex gap-1 mt-1">
              {gameRecords.slice(0, 5).map((game, index) => (
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
      </div>

      {/* Matchup Analysis */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Target size={20} />
          Matchup Analysis
        </h3>
        
        {Object.keys(matchupStats).length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Award size={48} className="mx-auto mb-4 opacity-50" />
            <div className="text-lg mb-2">No games recorded yet</div>
            <div className="text-sm">Start recording your games to see matchup analysis</div>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(matchupStats).map(([opponent, stats]) => {
              const total = stats.wins + stats.losses;
              const winRate = Math.round((stats.wins / total) * 100);
              
              return (
                <div key={opponent} className="bg-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{opponent}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${
                        winRate >= 60 ? 'text-green-400' : 
                        winRate >= 40 ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {winRate}%
                      </span>
                      <span className="text-gray-400 text-sm">
                        ({stats.wins}-{stats.losses})
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        winRate >= 60 ? 'bg-green-500' : 
                        winRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${winRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recent Games */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Calendar size={20} />
          Recent Games
        </h3>
        
        {gameRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <div className="text-lg mb-2">No games recorded</div>
            <div className="text-sm">Click "Record Game" to start tracking your performance</div>
          </div>
        ) : (
          <div className="space-y-2">
            {gameRecords.slice(0, 10).map((game) => (
              <div key={game.id} className="bg-slate-700 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    game.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <span className="text-white font-medium">vs {game.opponent}</span>
                    <div className="text-xs text-gray-400">
                      {game.format} • {game.date.toLocaleDateString()}
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
        )}
      </div>
    </div>
  );
};
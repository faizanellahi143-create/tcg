import React, { useState } from 'react';
import { TrendingUp, Target, Award, BarChart3, Users, Calendar } from 'lucide-react';

interface MetaArchetype {
  id: string;
  name: string;
  winRate: number;
  popularity: number;
  tier: 'S' | 'A' | 'B' | 'C';
  colors: string[];
  keyCards: string[];
  description: string;
  matchups: {
    good: string[];
    bad: string[];
  };
}

const mockMetaData: MetaArchetype[] = [
  {
    id: 'blue-control',
    name: 'Blue Control',
    winRate: 68.5,
    popularity: 15.2,
    tier: 'S',
    colors: ['Blue'],
    keyCards: ['Nu Gundam', 'Amuro Ray', 'Federation Base'],
    description: 'Dominant control deck focusing on card advantage and powerful late-game units.',
    matchups: {
      good: ['Red Aggro', 'Green Midrange'],
      bad: ['White Combo', 'Colorless Ramp']
    }
  },
  {
    id: 'red-aggro',
    name: 'Red Aggro',
    winRate: 64.2,
    popularity: 22.8,
    tier: 'A',
    colors: ['Red'],
    keyCards: ['Sazabi', 'Char Aznable', 'Beam Saber Strike'],
    description: 'Fast-paced aggressive strategy with efficient units and direct damage.',
    matchups: {
      good: ['White Combo', 'Colorless Ramp'],
      bad: ['Blue Control', 'Green Midrange']
    }
  },
  {
    id: 'green-midrange',
    name: 'Green Midrange',
    winRate: 61.8,
    popularity: 18.5,
    tier: 'A',
    colors: ['Green'],
    keyCards: ['Barbatos', 'Gouf Custom', 'Zaku II'],
    description: 'Balanced approach with efficient creatures and versatile answers.',
    matchups: {
      good: ['Red Aggro', 'White Combo'],
      bad: ['Blue Control', 'Colorless Ramp']
    }
  },
  {
    id: 'white-combo',
    name: 'White Combo',
    winRate: 58.9,
    popularity: 12.1,
    tier: 'B',
    colors: ['White'],
    keyCards: ['Strike Freedom', 'Wing Zero', 'Federation Base'],
    description: 'Synergy-based deck that aims for explosive combo turns.',
    matchups: {
      good: ['Blue Control', 'Colorless Ramp'],
      bad: ['Red Aggro', 'Green Midrange']
    }
  },
  {
    id: 'colorless-ramp',
    name: 'Colorless Ramp',
    winRate: 55.3,
    popularity: 8.7,
    tier: 'B',
    colors: ['Colorless'],
    keyCards: ['Federation Base', 'Resource Acceleration', 'High-Cost Units'],
    description: 'Ramp strategy focusing on expensive, powerful threats.',
    matchups: {
      good: ['Green Midrange', 'White Combo'],
      bad: ['Blue Control', 'Red Aggro']
    }
  }
];

export const MetaTracker: React.FC = () => {
  const [selectedArchetype, setSelectedArchetype] = useState<MetaArchetype | null>(null);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'season'>('week');

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'S': return 'text-yellow-400 bg-yellow-400/20';
      case 'A': return 'text-green-400 bg-green-400/20';
      case 'B': return 'text-blue-400 bg-blue-400/20';
      case 'C': return 'text-gray-400 bg-gray-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-orange-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Meta Tracker</h2>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar size={16} />
            <span className="text-sm">Timeframe:</span>
          </div>
          <div className="flex gap-2">
            {[
              { id: 'week', label: 'Past Week' },
              { id: 'month', label: 'Past Month' },
              { id: 'season', label: 'Current Season' }
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setTimeframe(period.id as any)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  timeframe === period.id
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Games</div>
            <div className="text-2xl font-bold text-white">12,847</div>
            <div className="text-xs text-gray-500">Analyzed matches</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Active Archetypes</div>
            <div className="text-2xl font-bold text-orange-400">{mockMetaData.length}</div>
            <div className="text-xs text-gray-500">Competitive decks</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Meta Diversity</div>
            <div className="text-2xl font-bold text-green-400">73%</div>
            <div className="text-xs text-gray-500">Healthy format</div>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Top Tier</div>
            <div className="text-2xl font-bold text-yellow-400">
              {mockMetaData.filter(deck => deck.tier === 'S').length}
            </div>
            <div className="text-xs text-gray-500">S-tier decks</div>
          </div>
        </div>
      </div>

      {/* Meta Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Archetype List */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <BarChart3 size={20} />
            Current Meta Breakdown
          </h3>
          
          <div className="space-y-3">
            {mockMetaData.map((archetype) => (
              <div
                key={archetype.id}
                onClick={() => setSelectedArchetype(archetype)}
                className="bg-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getTierColor(archetype.tier)}`}>
                      {archetype.tier}
                    </span>
                    <span className="text-white font-medium">{archetype.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold">{archetype.winRate}%</div>
                    <div className="text-xs text-gray-400">Win Rate</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {archetype.colors.map((color) => (
                      <span
                        key={color}
                        className="text-xs bg-slate-600 text-gray-300 px-2 py-1 rounded"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users size={14} />
                    <span>{archetype.popularity}%</span>
                  </div>
                </div>
                
                {/* Popularity bar */}
                <div className="mt-2 w-full bg-slate-600 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${archetype.popularity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed View */}
        <div className="bg-slate-800 rounded-lg p-4">
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Target size={20} />
            {selectedArchetype ? 'Archetype Details' : 'Select an Archetype'}
          </h3>
          
          {selectedArchetype ? (
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded font-bold ${getTierColor(selectedArchetype.tier)}`}>
                    Tier {selectedArchetype.tier}
                  </span>
                  <h4 className="text-xl font-bold text-white">{selectedArchetype.name}</h4>
                </div>
                <p className="text-gray-300 text-sm">{selectedArchetype.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Win Rate</div>
                  <div className="text-2xl font-bold text-green-400">{selectedArchetype.winRate}%</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="text-gray-400 text-sm">Popularity</div>
                  <div className="text-2xl font-bold text-orange-400">{selectedArchetype.popularity}%</div>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <h5 className="text-white font-medium mb-2">Key Cards</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedArchetype.keyCards.map((card) => (
                    <span key={card} className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      {card}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <h5 className="text-white font-medium mb-3">Matchup Analysis</h5>
                <div className="space-y-2">
                  <div>
                    <div className="text-green-400 text-sm font-medium mb-1">Favorable Against:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedArchetype.matchups.good.map((matchup) => (
                        <span key={matchup} className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs">
                          {matchup}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-red-400 text-sm font-medium mb-1">Struggles Against:</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedArchetype.matchups.bad.map((matchup) => (
                        <span key={matchup} className="bg-red-600/20 text-red-300 px-2 py-1 rounded text-xs">
                          {matchup}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Award size={48} className="mx-auto mb-4 opacity-50" />
              <div className="text-lg mb-2">Select an archetype</div>
              <div className="text-sm">Click on any deck archetype to view detailed analysis</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
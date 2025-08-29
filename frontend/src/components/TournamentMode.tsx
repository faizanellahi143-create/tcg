import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Trophy, Users } from 'lucide-react';
import { DeckCard } from '../types/card';

interface TournamentModeProps {
  deck: DeckCard[];
}

interface LegalityRule {
  id: string;
  name: string;
  description: string;
  check: (deck: DeckCard[]) => { passed: boolean; message: string; details?: string };
}

const tournamentRules: LegalityRule[] = [
  {
    id: 'deck-size',
    name: 'Deck Size',
    description: 'Deck must contain exactly 50 cards',
    check: (deck) => {
      const totalCards = deck.reduce((sum, card) => sum + card.quantity, 0);
      return {
        passed: totalCards === 50,
        message: totalCards === 50 ? 'Valid deck size' : `Invalid deck size: ${totalCards}/50 cards`,
        details: totalCards < 50 ? 'Add more cards to reach 50' : totalCards > 50 ? 'Remove cards to reach exactly 50' : undefined
      };
    }
  },
  {
    id: 'card-limit',
    name: 'Card Copies',
    description: 'Maximum 4 copies of any single card',
    check: (deck) => {
      const violations = deck.filter(card => card.quantity > 4);
      return {
        passed: violations.length === 0,
        message: violations.length === 0 ? 'All card limits respected' : `${violations.length} cards exceed limit`,
        details: violations.length > 0 ? `Reduce copies of: ${violations.map(c => c.name).join(', ')}` : undefined
      };
    }
  },
  {
    id: 'color-limit',
    name: 'Color Limit',
    description: 'Maximum 2 colors allowed per deck',
    check: (deck) => {
      const colors = new Set(deck.flatMap(card => card.colors));
      return {
        passed: colors.size <= 2,
        message: colors.size <= 2 ? 'Valid color distribution' : `Too many colors: ${colors.size}/2 maximum`,
        details: colors.size > 2 ? `Reduce to maximum 2 colors. Current colors: ${Array.from(colors).join(', ')}` : undefined
      };
    }
  },
  {
    id: 'banned-cards',
    name: 'Banned Cards',
    description: 'No banned cards allowed',
    check: (deck) => {
      // Mock banned list - in real implementation this would be dynamic
      const bannedCards = ['Overpowered Card', 'Broken Combo Piece'];
      const violations = deck.filter(card => bannedCards.includes(card.name));
      return {
        passed: violations.length === 0,
        message: violations.length === 0 ? 'No banned cards detected' : `${violations.length} banned cards found`,
        details: violations.length > 0 ? `Remove: ${violations.map(c => c.name).join(', ')}` : undefined
      };
    }
  },
  {
    id: 'color-requirements',
    name: 'Color Balance',
    description: 'Deck should have reasonable color distribution',
    check: (deck) => {
      const colors = new Set(deck.flatMap(card => card.colors));
      const colorCount = colors.size;
      return {
        passed: colorCount <= 3,
        message: colorCount <= 3 ? 'Good color distribution' : 'Too many colors may cause consistency issues',
        details: colorCount > 3 ? 'Consider focusing on fewer colors for better consistency' : undefined
      };
    }
  }
];

export const TournamentMode: React.FC<TournamentModeProps> = ({ deck }) => {
  const [selectedFormat, setSelectedFormat] = useState<'standard' | 'extended' | 'unlimited'>('standard');
  
  const legalityResults = tournamentRules.map(rule => ({
    ...rule,
    result: rule.check(deck)
  }));

  const isLegal = legalityResults.every(rule => rule.result.passed);
  const violations = legalityResults.filter(rule => !rule.result.passed);

  const formats = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Current sets only, most restrictive',
      sets: ['GD01', 'GD02', 'GD03']
    },
    {
      id: 'extended',
      name: 'Extended',
      description: 'Last 2 years of sets',
      sets: ['GD01', 'GD02', 'GD03', 'GD04', 'GD05']
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      description: 'All sets allowed',
      sets: ['All Sets']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trophy className="text-yellow-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Tournament Mode</h2>
        </div>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Shield size={16} />
            <span className="text-sm">Format:</span>
          </div>
          <div className="flex gap-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id as any)}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  selectedFormat === format.id
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                {format.name}
              </button>
            ))}
          </div>
        </div>

        {/* Format Info */}
        <div className="bg-slate-700 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2">
            {formats.find(f => f.id === selectedFormat)?.name} Format
          </h3>
          <p className="text-gray-300 text-sm mb-2">
            {formats.find(f => f.id === selectedFormat)?.description}
          </p>
          <div className="text-xs text-gray-400">
            Legal Sets: {formats.find(f => f.id === selectedFormat)?.sets.join(', ')}
          </div>
        </div>
      </div>

      {/* Legality Status */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          {isLegal ? (
            <CheckCircle className="text-green-400" size={24} />
          ) : (
            <XCircle className="text-red-400" size={24} />
          )}
          <h3 className="text-xl font-bold text-white">
            Deck Legality: {isLegal ? 'LEGAL' : 'ILLEGAL'}
          </h3>
        </div>

        <div className={`rounded-lg p-4 mb-4 ${
          isLegal ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
        }`}>
          <div className={`font-medium mb-2 ${isLegal ? 'text-green-300' : 'text-red-300'}`}>
            {isLegal 
              ? '✅ Your deck is tournament legal!' 
              : `❌ ${violations.length} rule violation${violations.length > 1 ? 's' : ''} found`
            }
          </div>
          <div className={`text-sm ${isLegal ? 'text-green-200' : 'text-red-200'}`}>
            {isLegal 
              ? 'This deck meets all tournament requirements and is ready for competitive play.'
              : 'Please fix the violations below before registering for tournaments.'
            }
          </div>
        </div>

        {/* Rule Checks */}
        <div className="space-y-3">
          {legalityResults.map((rule) => (
            <div
              key={rule.id}
              className={`bg-slate-700 rounded-lg p-4 border-l-4 ${
                rule.result.passed ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {rule.result.passed ? (
                    <CheckCircle className="text-green-400" size={20} />
                  ) : (
                    <AlertTriangle className="text-red-400" size={20} />
                  )}
                  <div>
                    <div className="text-white font-medium">{rule.name}</div>
                    <div className="text-gray-400 text-sm">{rule.description}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  rule.result.passed 
                    ? 'bg-green-600/20 text-green-300' 
                    : 'bg-red-600/20 text-red-300'
                }`}>
                  {rule.result.passed ? 'PASS' : 'FAIL'}
                </div>
              </div>
              
              <div className={`text-sm ${rule.result.passed ? 'text-green-200' : 'text-red-200'}`}>
                {rule.result.message}
              </div>
              
              {rule.result.details && (
                <div className="mt-2 text-xs text-gray-400 bg-slate-600 rounded p-2">
                  💡 {rule.result.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tournament Registration */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Users className="text-blue-400" size={24} />
          <h3 className="text-xl font-bold text-white">Tournament Registration</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Upcoming Tournaments</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Weekly Standard</span>
                <span className="text-blue-500">Tomorrow 7PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Monthly Extended</span>
                <span className="text-blue-500">Next Week</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Championship</span>
                <span className="text-blue-500">Next Month</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Registration Status</h4>
            <div className="space-y-3">
              <button
                disabled={!isLegal}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  isLegal
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isLegal ? 'Register for Tournament' : 'Fix Violations to Register'}
              </button>
              <div className="text-xs text-gray-400 text-center">
                {isLegal 
                  ? 'Your deck is ready for competitive play'
                  : 'Deck must be legal to register'
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
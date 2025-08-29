import React, { useState } from 'react';
import { Brain, Target, TrendingUp, TrendingDown, Zap, Shield, AlertTriangle, Trophy, Dice6, Users } from 'lucide-react';
import { Deck, AIComparisonResult } from '../types/card';

interface DeckComparisonProps {
  savedDecks: Deck[];
  compareDecksWithAI: (deck1Id: string, deck2Id: string) => Promise<void>;
  aiComparisonResults: AIComparisonResult | null;
  isAnalyzing: boolean;
}

export const DeckComparison: React.FC<DeckComparisonProps> = ({
  savedDecks,
  compareDecksWithAI,
  aiComparisonResults,
  isAnalyzing
}) => {
  const [selectedDeck1, setSelectedDeck1] = useState<string>('');
  const [selectedDeck2, setSelectedDeck2] = useState<string>('');

  const handleCompareDecks = async () => {
    if (selectedDeck1 && selectedDeck2 && selectedDeck1 !== selectedDeck2) {
      await compareDecksWithAI(selectedDeck1, selectedDeck2);
    }
  };

  const canCompare = selectedDeck1 && selectedDeck2 && selectedDeck1 !== selectedDeck2;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="text-purple-400" size={24} />
          <h2 className="text-2xl font-bold text-white">AI Deck Comparison</h2>
          <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">BETA</span>
        </div>
        
        <p className="text-gray-300 mb-6">
          Compare two of your saved decks using advanced AI analysis. Get detailed insights on matchups, 
          win probabilities, and strategic recommendations.
        </p>

        {/* Deck Selection */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select First Deck
            </label>
            <select
              value={selectedDeck1}
              onChange={(e) => setSelectedDeck1(e.target.value)}
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="">Choose a deck...</option>
              {savedDecks.map((deck) => (
                <option key={deck.id} value={deck.id}>
                  {deck.name} ({deck.totalCards} cards)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Second Deck
            </label>
            <select
              value={selectedDeck2}
              onChange={(e) => setSelectedDeck2(e.target.value)}
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="">Choose a deck...</option>
              {savedDecks.map((deck) => (
                <option key={deck.id} value={deck.id} disabled={deck.id === selectedDeck1}>
                  {deck.name} ({deck.totalCards} cards)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Compare Button */}
        <button
          onClick={handleCompareDecks}
          disabled={!canCompare || isAnalyzing}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            canCompare && !isAnalyzing
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
              Analyzing Decks...
            </div>
          ) : (
            'Compare Decks with AI'
          )}
        </button>

        {!canCompare && selectedDeck1 && selectedDeck2 && selectedDeck1 === selectedDeck2 && (
          <p className="text-red-400 text-sm mt-2">Please select two different decks to compare.</p>
        )}
      </div>

      {/* Analysis Results */}
      {aiComparisonResults && (
        <div className="space-y-6">
          {/* Win Probability */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="text-yellow-400" size={24} />
              <h3 className="text-xl font-bold text-white">Matchup Analysis</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {aiComparisonResults.winProbability}%
                  </div>
                  <div className="text-gray-300 mb-2">Win Probability</div>
                  <div className="text-sm text-gray-400">
                    {aiComparisonResults.deck1Name} vs {aiComparisonResults.deck2Name}
                  </div>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Dice6 className="text-blue-400" size={20} />
                    <div className="text-3xl font-bold text-blue-400">
                      {aiComparisonResults.predictedWins}/10
                    </div>
                  </div>
                  <div className="text-gray-300 mb-2">Predicted Wins</div>
                  <div className="text-sm text-gray-400">
                    In 10 rounds of play
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
                <div className="text-sm text-yellow-200">
                  <strong>Important Note:</strong> These probability calculations are AI-generated estimates based on deck composition, 
                  card synergies, and statistical analysis. Actual results can vary significantly depending on:
                  <ul className="mt-2 ml-4 list-disc space-y-1">
                    <li>Your starting hand and draw luck</li>
                    <li>Player skill level and decision-making</li>
                    <li>In-game scenarios and timing</li>
                    <li>Meta knowledge and adaptation</li>
                  </ul>
                  Use these insights as guidance, but remember that skilled play can overcome statistical disadvantages!
                </div>
              </div>
            </div>
          </div>

          {/* Overall Summary */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-blue-400" size={24} />
              <h3 className="text-xl font-bold text-white">Overall Analysis</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">{aiComparisonResults.overallSummary}</p>
          </div>

          {/* Deck Strengths & Weaknesses */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Deck 1 Analysis */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">{aiComparisonResults.deck1Name}</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="text-green-400" size={16} />
                    <h4 className="text-green-400 font-medium">Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {aiComparisonResults.deck1Strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-green-300">
                        <Shield size={14} className="mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="text-red-400" size={16} />
                    <h4 className="text-red-400 font-medium">Weaknesses</h4>
                  </div>
                  <ul className="space-y-2">
                    {aiComparisonResults.deck1Weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-300">
                        <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Deck 2 Analysis */}
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">{aiComparisonResults.deck2Name}</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="text-green-400" size={16} />
                    <h4 className="text-green-400 font-medium">Strengths</h4>
                  </div>
                  <ul className="space-y-2">
                    {aiComparisonResults.deck2Strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-green-300">
                        <Shield size={14} className="mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="text-red-400" size={16} />
                    <h4 className="text-red-400 font-medium">Weaknesses</h4>
                  </div>
                  <ul className="space-y-2">
                    {aiComparisonResults.deck2Weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-red-300">
                        <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-orange-400" size={24} />
              <h3 className="text-xl font-bold text-white">Strategic Recommendations</h3>
            </div>
            <ul className="space-y-3">
              {aiComparisonResults.strategicRecommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300">
                  <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Alternative Cards */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-cyan-400" size={24} />
              <h3 className="text-xl font-bold text-white">Alternative Card Suggestions</h3>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">For {aiComparisonResults.deck1Name}:</h4>
                <ul className="space-y-2">
                  {aiComparisonResults.alternativeCards.deck1.map((card, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-cyan-300">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{card}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">For {aiComparisonResults.deck2Name}:</h4>
                <ul className="space-y-2">
                  {aiComparisonResults.alternativeCards.deck2.map((card, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-cyan-300">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{card}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Key Matchup Factors */}
          <div className="bg-slate-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="text-purple-400" size={24} />
              <h3 className="text-xl font-bold text-white">Key Matchup Factors</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {aiComparisonResults.keyMatchupFactors.map((factor, index) => (
                <div key={index} className="bg-slate-700 rounded-lg p-3">
                  <div className="flex items-start gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{factor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {savedDecks.length === 0 && (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <Brain className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-white font-medium mb-2">No Saved Decks</h3>
          <p className="text-gray-400">
            You need at least 2 saved decks to use the comparison feature. 
            Build and save some decks first!
          </p>
        </div>
      )}

      {savedDecks.length === 1 && (
        <div className="bg-slate-800 rounded-lg p-8 text-center">
          <Brain className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-white font-medium mb-2">Need More Decks</h3>
          <p className="text-gray-400">
            You have 1 saved deck. Build and save at least one more deck to compare them!
          </p>
        </div>
      )}
    </div>
  );
};
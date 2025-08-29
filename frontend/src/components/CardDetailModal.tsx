import React from 'react';
import { X, Star, TrendingUp, ExternalLink } from 'lucide-react';
import { GundamCard } from '../types/card';

interface CardDetailModalProps {
  card: GundamCard | null;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose
}) => {
  if (!card) return null;

  const getColorClasses = (colors: string[]) => {
    if (colors.includes('Blue')) return 'border-blue-500 bg-gradient-to-br from-blue-950/50 to-blue-900/30';
    if (colors.includes('Red')) return 'border-red-500 bg-gradient-to-br from-red-950/50 to-red-900/30';
    if (colors.includes('Green')) return 'border-green-500 bg-gradient-to-br from-green-950/50 to-green-900/30';
    if (colors.includes('White')) return 'border-gray-400 bg-gradient-to-br from-gray-800/50 to-gray-700/30';
    return 'border-gray-500 bg-gradient-to-br from-gray-800/40 to-gray-700/20';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'RR': return 'text-yellow-400';
      case 'R': return 'text-purple-400';
      case 'U': return 'text-blue-400';
      case 'P': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityName = (rarity: string) => {
    switch (rarity) {
      case 'RR': return 'Double Rare';
      case 'R': return 'Rare';
      case 'U': return 'Uncommon';
      case 'C': return 'Common';
      case 'P': return 'Promo';
      default: return 'Unknown';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{card.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Card Image and Basic Info */}
            <div className="space-y-4">
              <div className={`relative rounded-lg overflow-hidden border-2 ${getColorClasses(card.colors)}`}>
                <img
                  src={card.image}
                  alt={card.name}
                  className="w-full h-auto object-contain bg-slate-900"
                />
                
                {/* Cost overlay */}
                <div className="absolute top-3 left-3 w-10 h-10 bg-blue-800/90 text-white rounded-full flex items-center justify-center text-lg font-bold backdrop-blur-sm">
                  {card.cost}
                </div>
                
                {/* Power/HP overlay */}
                {card.type === 'Unit' && card.power && card.hp && (
                  <div className="absolute bottom-3 right-3 bg-black/90 text-white px-3 py-1 rounded-lg text-lg font-bold backdrop-blur-sm">
                    {card.power}/{card.hp}
                  </div>
                )}
              </div>

              {/* Market Price */}
              {card.marketPrice && (
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Market Price</span>
                    <TrendingUp className="text-green-400" size={16} />
                  </div>
                  <div className="text-2xl font-bold text-green-400">
                    ${card.marketPrice}
                  </div>
                  <div className="text-sm text-gray-500">
                    Based on recent sales
                  </div>
                  <button className="mt-2 flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm">
                    <ExternalLink size={14} />
                    View market data
                  </button>
                </div>
              )}
            </div>

            {/* Card Details */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Star className="text-yellow-400" size={16} />
                  Card Information
                </h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ID:</span>
                    <span className="text-white font-medium">{card.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white font-medium">{card.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Cost:</span>
                    <span className="text-white font-medium">{card.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Colors:</span>
                    <div className="flex gap-1">
                      {card.colors.map((color) => (
                        <span
                          key={color}
                          className="text-white bg-slate-700 px-2 py-1 rounded text-xs"
                        >
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rarity:</span>
                    <span className={`font-medium ${getRarityColor(card.rarity)}`}>
                      {card.rarity} - {getRarityName(card.rarity)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Set:</span>
                    <span className="text-white font-medium">{card.set}</span>
                  </div>
                  {card.power && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Power:</span>
                      <span className="text-white font-medium">{card.power}</span>
                    </div>
                  )}
                  {card.hp && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">HP:</span>
                      <span className="text-white font-medium">{card.hp}</span>
                    </div>
                  )}
                  {card.level && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Level:</span>
                      <span className="text-white font-medium">{card.level}</span>
                    </div>
                  )}
                  {card.ap && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">AP:</span>
                      <span className="text-white font-medium">{card.ap}</span>
                    </div>
                  )}
                  {card.link && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Link:</span>
                      <span className="text-white font-medium">{card.link}</span>
                    </div>
                  )}
                  {card.trait && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Trait:</span>
                      <span className="text-white font-medium text-xs">{card.trait}</span>
                    </div>
                  )}
                  {card.zone && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Zone:</span>
                      <span className="text-white font-medium text-xs">{card.zone}</span>
                    </div>
                  )}
                  {card.show && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Show:</span>
                      <span className="text-white font-medium text-xs">{card.show}</span>
                    </div>
                  )}
                  {card.source && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Source:</span>
                      <span className="text-white font-medium text-xs">{card.source}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Abilities */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Abilities</h3>
                <div className="space-y-2">
                  {card.abilities.map((ability, index) => (
                    <div
                      key={index}
                      className="bg-slate-700 rounded-lg p-3 text-sm text-gray-200"
                    >
                      <span className="font-medium text-blue-400">•</span> {ability}
                    </div>
                  ))}
                </div>
              </div>

              {/* Flavor Text */}
              {card.flavorText && (
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-3">Lore</h3>
                  <p className="text-gray-300 italic text-sm leading-relaxed">
                    "{card.flavorText}"
                  </p>
                </div>
              )}

              {/* Strategic Role */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Strategic Role</h3>
                <div className="text-sm text-gray-300 space-y-2">
                  {card.type === 'Unit' && (
                    <>
                      <p>• <span className="text-blue-400 font-medium">Core Combatant:</span> Units are deployed to the Battle Area to engage in combat. You can have up to 6 units in play at once.</p>
                      <p>• <span className="text-green-400 font-medium">Link Potential:</span> Can be enhanced by Pilot cards. If a pilot meets this unit's link conditions, it becomes a Link Unit and can attack immediately when deployed.</p>
                      {card.cost <= 3 && <p>• <span className="text-yellow-400 font-medium">Early Game:</span> Low-cost unit ideal for establishing board presence in the opening turns.</p>}
                      {card.cost >= 4 && <p>• <span className="text-purple-400 font-medium">Mid-Late Game:</span> Higher-cost unit that provides significant power in mid-to-late game scenarios.</p>}
                    </>
                  )}
                  {card.type === 'Pilot' && (
                    <>
                      <p>• <span className="text-blue-400 font-medium">Unit Enhancement:</span> Attach to a Unit to grant extra AP/HP stats and often special abilities.</p>
                      <p>• <span className="text-green-400 font-medium">Link Activation:</span> When link conditions are met with a compatible Unit, enables immediate attack and bonus effects.</p>
                      {card.link && <p>• <span className="text-yellow-400 font-medium">Link Requirement:</span> Works best with units matching: {card.link}</p>}
                      <p>• <span className="text-purple-400 font-medium">Strategic Timing:</span> Best played when you can immediately link with a Unit for maximum impact.</p>
                    </>
                  )}
                  {card.type === 'Command' && (
                    <>
                      <p>• <span className="text-blue-400 font-medium">Tactical Tool:</span> Single-use cards that can swing battles with powerful effects or resource boosts.</p>
                      <p>• <span className="text-green-400 font-medium">Timing Matters:</span> Some Commands have "Action" timing, allowing play during opponent's turn for disruption.</p>
                      <p>• <span className="text-yellow-400 font-medium">Resource After Use:</span> Goes to trash after resolving, so timing and value are crucial.</p>
                      <p>• <span className="text-purple-400 font-medium">Versatility:</span> Some Command cards can double as Pilots if needed, providing deck flexibility.</p>
                    </>
                  )}
                  {card.type === 'Base' && (
                    <>
                      <p>• <span className="text-blue-400 font-medium">Shield Fortification:</span> Deployed in shield zone to protect you. Only one base can be active at a time.</p>
                      <p>• <span className="text-green-400 font-medium">Defensive Value:</span> Typically have 4-6 HP compared to regular shields (1 HP), requiring multiple attacks to destroy.</p>
                      <p>• <span className="text-yellow-400 font-medium">Resource Gain:</span> When deployed, the shield card it replaces goes to your hand, effectively drawing a card.</p>
                      <p>• <span className="text-purple-400 font-medium">Strategic Support:</span> Often provide ongoing effects that support your faction's strategy while active.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Deck Building Notes */}
              <div className="bg-slate-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Deck Building Notes</h3>
                <div className="text-sm text-gray-300 space-y-2">
                  <p>• <span className="text-blue-400 font-medium">Color Strategy:</span> Best used in {card.colors.join('/')} color decks for optimal resource consistency</p>
                  <p>• <span className="text-green-400 font-medium">Type Synergy:</span> Synergizes well with other {card.type} cards and faction themes</p>
                  {card.type === 'Unit' && (
                    <>
                      <p>• <span className="text-yellow-400 font-medium">Pilot Pairing:</span> Consider including compatible Pilots to enable Link Unit abilities</p>
                      <p>• <span className="text-purple-400 font-medium">Support Cards:</span> Pair with Command cards that enhance combat or provide protection</p>
                    </>
                  )}
                  {card.type === 'Pilot' && (
                    <p>• <span className="text-yellow-400 font-medium">Unit Coverage:</span> Ensure your deck has multiple Units that can fulfill this Pilot's link conditions</p>
                  )}
                  {card.type === 'Command' && (
                    <p>• <span className="text-yellow-400 font-medium">Timing Consideration:</span> Include mix of proactive and reactive Commands for different game situations</p>
                  )}
                  {card.type === 'Base' && (
                    <p>• <span className="text-yellow-400 font-medium">Defensive Strategy:</span> Include 4-6 Base cards in control-oriented decks for maximum shield protection</p>
                  )}
                  {card.cost >= 4 && (
                    <p>• <span className="text-red-400 font-medium">Resource Planning:</span> High-cost card - ensure adequate low-cost cards and resource acceleration</p>
                  )}
                  {card.cost <= 2 && (
                    <p>• <span className="text-green-400 font-medium">Early Game Value:</span> Excellent for establishing board presence in opening turns</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
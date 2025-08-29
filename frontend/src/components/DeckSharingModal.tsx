import React, { useState } from 'react';
import { X, Globe, Lock, Users, Tag, FileText, Eye, EyeOff } from 'lucide-react';
import { Deck } from '../types/card';

interface DeckSharingModalProps {
  deck: Deck | null;
  isOpen: boolean;
  onClose: () => void;
  onShare: (deckData: {
    name: string;
    description: string;
    notes: string;
    tags: string[];
    isPublic: boolean;
    allowComments: boolean;
    allowForks: boolean;
  }) => void;
}

export const DeckSharingModal: React.FC<DeckSharingModalProps> = ({
  deck,
  isOpen,
  onClose,
  onShare
}) => {
  const [name, setName] = useState(deck?.name || '');
  const [description, setDescription] = useState(deck?.description || '');
  const [notes, setNotes] = useState(deck?.notes || '');
  const [tags, setTags] = useState<string[]>(deck?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isPublic, setIsPublic] = useState(deck?.isPublic || false);
  const [allowComments, setAllowComments] = useState(true);
  const [allowForks, setAllowForks] = useState(true);

  if (!isOpen || !deck) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onShare({
      name,
      description,
      notes,
      tags,
      isPublic,
      allowComments,
      allowForks
    });
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const suggestedTags = [
    'Aggro', 'Control', 'Midrange', 'Combo', 'Budget', 'Competitive',
    'Blue', 'Red', 'Green', 'White', 'Purple', 'Colorless',
    'Federation', 'Zeon', 'SEED', 'Wing', 'Iron-Blooded', 'Celestial',
    'Beginner', 'Advanced', 'Tournament', 'Casual', 'Meta', 'Rogue'
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Share Deck with Community</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Deck Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Deck Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Enter a catchy name for your deck"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Describe your deck's strategy and playstyle..."
            />
          </div>

          {/* Strategy Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Strategy Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
              rows={3}
              placeholder="Share tips, mulligan advice, or key combos..."
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            
            {/* Current Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-300 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Add Tag */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Add a tag..."
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Tag size={16} />
              </button>
            </div>
            
            {/* Suggested Tags */}
            <div>
              <div className="text-xs text-gray-400 mb-2">Suggested tags:</div>
              <div className="flex flex-wrap gap-1">
                {suggestedTags
                  .filter(tag => !tags.includes(tag))
                  .slice(0, 12)
                  .map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setTags([...tags, tag])}
                    className="bg-slate-700 hover:bg-slate-600 text-gray-300 px-2 py-1 rounded text-xs transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              <Globe size={16} />
              Privacy & Sharing Settings
            </h3>
            
            <div className="space-y-4">
              {/* Public/Private Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isPublic ? (
                    <Globe className="text-green-400" size={20} />
                  ) : (
                    <Lock className="text-gray-400" size={20} />
                  )}
                  <div>
                    <div className="text-white font-medium">
                      {isPublic ? 'Public Deck' : 'Private Deck'}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {isPublic 
                        ? 'Anyone can discover and import this deck'
                        : 'Only you can see this deck'
                      }
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isPublic ? 'bg-green-600' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Community Features (only if public) */}
              {isPublic && (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Users className="text-blue-400" size={20} />
                      <div>
                        <div className="text-white font-medium">Allow Comments</div>
                        <div className="text-gray-400 text-sm">
                          Let other players discuss your deck
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowComments(!allowComments)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        allowComments ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          allowComments ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-purple-400" size={20} />
                      <div>
                        <div className="text-white font-medium">Allow Forks</div>
                        <div className="text-gray-400 text-sm">
                          Let others create variations of your deck
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAllowForks(!allowForks)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        allowForks ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          allowForks ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-800 rounded-lg p-4">
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              {isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
              Preview
            </h3>
            
            <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-bold text-lg">{name || 'Untitled Deck'}</h4>
                  {description && (
                    <p className="text-gray-300 text-sm mt-1">{description}</p>
                  )}
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div>{deck.totalCards} cards</div>
                  <div>${deck.marketValue.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>by You</span>
                <span>{new Date().toLocaleDateString()}</span>
                <div className="flex gap-1">
                  {deck.colors.map((color) => (
                    <span key={color} className="bg-slate-600 px-2 py-1 rounded text-xs">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
              
              {tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {tags.map((tag) => (
                    <span key={tag} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Globe size={16} />
              {isPublic ? 'Share Publicly' : 'Save Privately'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
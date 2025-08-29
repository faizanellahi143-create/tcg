import React, { useState, useEffect } from "react";
import { X, Save, Tag, Eye, EyeOff, AlertCircle } from "lucide-react";
import { TcgCard } from "../store/slices/cardSlice";
import { GundamCard } from "../types/card";
import {
  convertTcgCardsToDeckFormat,
  convertGundamCardsToDeckFormat,
  estimateMarketValue,
} from "../services/deckService";

interface SaveDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deckData: any) => void;
  currentCards: (TcgCard | GundamCard)[];
  deckQuantities: Record<string, number>;
  loading?: boolean;
}

export const SaveDeckModal: React.FC<SaveDeckModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentCards,
  deckQuantities,
  loading = false,
}) => {
  const [deckName, setDeckName] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [format, setFormat] = useState("Standard");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // Calculate deck statistics
  const tcgCards = currentCards.filter(
    (card): card is TcgCard => "tcgId" in card
  );
  const gundamCards = currentCards.filter(
    (card): card is GundamCard => "cost" in card
  );

  const tcgDeckCards = convertTcgCardsToDeckFormat(tcgCards, deckQuantities);
  const gundamDeckCards = convertGundamCardsToDeckFormat(
    gundamCards,
    deckQuantities
  );
  const allDeckCards = [...tcgDeckCards, ...gundamDeckCards];

  const totalCards = allDeckCards.reduce((sum, card) => sum + card.quantity, 0);
  const estimatedValue = estimateMarketValue(allDeckCards);

  // Available formats
  const formats = [
    "Standard",
    "Modern",
    "Legacy",
    "Commander",
    "Limited",
    "TCG",
  ];

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!deckName.trim()) {
      newErrors.push("Deck name is required");
    }

    if (totalCards === 0) {
      newErrors.push("Deck must contain at least one card");
    }

    if (totalCards > 60) {
      newErrors.push("Deck cannot exceed 60 cards");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) return;

    const deckData = {
      name: deckName.trim(),
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
      cards: allDeckCards,
      format,
      tags: tags.length > 0 ? tags : undefined,
      isPublic,
      createdBy: "current-user", // This should come from auth context
    };

    onSave(deckData);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setDeckName("");
      setDescription("");
      setNotes("");
      setFormat("Standard");
      setTags([]);
      setIsPublic(false);
      setErrors([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Save Deck</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-600/20 border border-red-600/50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <AlertCircle size={20} />
                <span className="font-medium">
                  Please fix the following errors:
                </span>
              </div>
              <ul className="list-disc list-inside text-red-300 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Deck Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Deck Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deck Name *
              </label>
              <input
                type="text"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="Enter deck name..."
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={100}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of your deck..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={500}
              />
            </div>

            {/* Format */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Format
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {formats.map((fmt) => (
                  <option key={fmt} value={fmt}>
                    {fmt}
                  </option>
                ))}
              </select>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Visibility
              </label>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`w-full px-3 py-2 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                  isPublic
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-700 border-slate-600 text-gray-300 hover:bg-slate-600"
                }`}
              >
                {isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
                {isPublic ? "Public" : "Private"}
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={50}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
              />
              <button
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-2 bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    <Tag size={14} />
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about your deck..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={1000}
            />
          </div>

          {/* Deck Summary */}
          <div className="bg-slate-700 rounded-lg p-4">
            <h3 className="text-lg font-medium text-white mb-3">
              Deck Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-400">Total Cards</div>
                <div className="text-white font-medium">{totalCards}</div>
              </div>
              <div>
                <div className="text-gray-400">TCG Cards</div>
                <div className="text-white font-medium">
                  {tcgDeckCards.length}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Gundam Cards</div>
                <div className="text-white font-medium">
                  {gundamDeckCards.length}
                </div>
              </div>
              <div>
                <div className="text-gray-400">Est. Value</div>
                <div className="text-green-400 font-medium">
                  ${estimatedValue}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || totalCards === 0}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Deck
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

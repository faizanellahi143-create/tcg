import React from 'react';
import { X, Save } from 'lucide-react';

interface VersionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  versionNotes: string;
  setVersionNotes: (notes: string) => void;
}

export const VersionModal: React.FC<VersionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  versionNotes,
  setVersionNotes
}) => {
  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Save New Version</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Version Notes
            </label>
            <textarea
              value={versionNotes}
              onChange={(e) => setVersionNotes(e.target.value)}
              placeholder="Describe what changed in this version..."
              className="w-full bg-slate-800 text-white px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              rows={3}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: "Added 2 new units", "Adjusted mana curve", "Improved late game"
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save size={16} />
              Save Version
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
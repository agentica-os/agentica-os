import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useFlowStore } from '../../store/flowStore';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
  existingFlowName: string | null;
}

export const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onSave, existingFlowName }) => {
  const [name, setName] = useState('');
  const savedFlows = useFlowStore((state) => state.getSavedFlows());
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false);

  React.useEffect(() => {
    if (isOpen && existingFlowName) {
      setName(existingFlowName);
      setShowOverwriteWarning(true);
    } else if (!isOpen) {
      setName('');
      setShowOverwriteWarning(false);
    }
  }, [isOpen, existingFlowName]);

  const handleNameChange = (newName: string) => {
    setName(newName);
    setShowOverwriteWarning(savedFlows.includes(newName));
  };

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-[400px] max-w-[90vw]">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-200">
            {existingFlowName ? 'Save Flow' : 'Save Flow As'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Enter flow name"
            className="w-full bg-gray-900 text-gray-200 border border-gray-700 rounded-md px-3 py-2"
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          />
          {showOverwriteWarning && (
            <p className="mt-2 text-sm text-amber-400">
              A flow with this name already exists. Saving will overwrite it.
            </p>
          )}
        </div>
        <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
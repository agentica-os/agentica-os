import React from 'react';
import { X } from 'lucide-react';

interface TextModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string) => void;
  title: string;
}

export const TextModal: React.FC<TextModalProps> = ({
  isOpen,
  onClose,
  value,
  onChange,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-[800px] max-w-[90vw] max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-200">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-auto">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-[400px] bg-gray-900 text-gray-200 border border-gray-700 rounded-md px-4 py-3 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors resize-none font-mono"
            spellCheck={false}
          />
        </div>
        <div className="p-4 border-t border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
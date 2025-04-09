import React, { useState } from 'react';
import { X, FolderOpen, Trash2 } from 'lucide-react';

interface LoadModalProps {
  isOpen: boolean;
  onClose: () => void;
  flows: string[];
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
}

export const LoadModal: React.FC<LoadModalProps> = ({ isOpen, onClose, flows, onLoad, onDelete }) => {
  const [flowsState, setFlowsState] = useState<string[]>([]);
  
  React.useEffect(() => {
    setFlowsState(flows);
  }, [flows]);

  if (!isOpen) return null;

  const handleDelete = (name: string) => {
    onDelete(name);
    setFlowsState(flowsState.filter(flow => flow !== name));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-[400px] max-w-[90vw]">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-gray-200">Load Flow</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {flowsState.length === 0 ? (
            <p className="text-gray-400 text-center">No saved flows</p>
          ) : (
            <div className="space-y-2">
              {flowsState.map((flow) => (
                <div
                  key={flow}
                  className="flex items-center justify-between p-3 bg-gray-900 rounded-md"
                >
                  <span className="text-gray-200">{flow}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onLoad(flow)}
                      className="p-1 text-gray-400 hover:text-blue-400"
                      title="Load flow"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(flow)}
                      className="p-1 text-gray-400 hover:text-red-400"
                      title="Delete flow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
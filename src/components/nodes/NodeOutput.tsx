import React from 'react';

interface NodeOutputProps {
  outputs: any[];
}

export const NodeOutput: React.FC<NodeOutputProps> = ({ outputs }) => {
  if (outputs.length === 0) return null;

  return (
    <div className="mt-4 pt-4 border-t border-gray-700">
      <div className="text-sm font-medium text-gray-300 mb-2">Output:</div>
      {outputs.map((output, index) => (
        <div key={index} className="text-sm text-gray-400 break-all font-mono bg-gray-900/50 p-2 rounded">
          {typeof output === 'object' ? JSON.stringify(output) : String(output)}
        </div>
      ))}
    </div>
  );
};
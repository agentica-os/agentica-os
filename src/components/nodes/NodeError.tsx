import React from 'react';

interface NodeErrorProps {
  error: string;
}

export const NodeError: React.FC<NodeErrorProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mt-4 pt-4 border-t border-red-500/30">
      <div className="text-sm font-medium text-red-400 mb-2">Error:</div>
      <div className="text-sm text-red-300 break-all font-mono bg-red-900/20 p-2 rounded border border-red-500/30">
        {error}
      </div>
    </div>
  );
};
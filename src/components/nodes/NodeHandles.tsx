import React from 'react';
import { Handle, Position } from 'reactflow';

interface NodeHandlesProps {
  inputs: number;
  outputs: number;
  hasError: boolean;
}

export const NodeHandles: React.FC<NodeHandlesProps> = ({ inputs, outputs, hasError }) => {
  return (
    <>
      {/* Input Handles */}
      {Array.from({ length: inputs }).map((_, i) => (
        <Handle
          key={`input-${i}`}
          type="target"
          position={Position.Left}
          id={`input-${i}`}
          style={{ top: `${((i + 1) * 100) / (inputs + 1)}%` }}
          className={`w-3 h-3 ${
            hasError ? '!bg-red-500/80 border-red-600' : '!bg-blue-500/80 border-blue-600'
          } border-2 shadow-md hover:!bg-blue-400 transition-colors`}
        />
      ))}

      {/* Output Handles */}
      {Array.from({ length: outputs }).map((_, i) => (
        <Handle
          key={`output-${i}`}
          type="source"
          position={Position.Right}
          id={`output-${i}`}
          style={{ top: `${((i + 1) * 100) / (outputs + 1)}%` }}
          className={`w-3 h-3 ${
            hasError ? '!bg-red-500/80 border-red-600' : '!bg-emerald-500/80 border-emerald-600'
          } border-2 shadow-md hover:!bg-emerald-400 transition-colors`}
        />
      ))}
    </>
  );
};
import React from 'react';
import { MiniMap, MiniMapProps } from 'reactflow';

export const FlowMinimap: React.FC<Partial<MiniMapProps>> = (props) => {
  return (
    <MiniMap
      className="!bg-gray-800/50 !border-gray-700"
      nodeColor="#4B5563"
      maskColor="rgba(17, 24, 39, 0.7)"
      {...props}
    />
  );
};
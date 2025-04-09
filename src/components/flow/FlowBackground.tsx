import React from 'react';
import { Background, BackgroundProps } from 'reactflow';

export const FlowBackground: React.FC<Partial<BackgroundProps>> = (props) => {
  return (
    <Background
      color="#374151"
      gap={16}
      size={1}
      {...props}
    />
  );
};
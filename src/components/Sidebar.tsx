import React, { useRef } from 'react';
import { useFlowStore } from '../store/flowStore';
import { nodeRegistry } from './flow/NodeRegistry';
import { 
  Type, 
  Globe, 
  SplitSquareVertical, 
  Brain, 
  Timer, 
  Calendar, 
  Filter, 
  ScrollText, 
  Variable, 
  FileCode,
  HelpCircle
} from 'lucide-react';

const nodeIcons: Record<string, React.ReactNode> = {
  staticText: <Type className="w-5 h-5" />,
  httpRequest: <Globe className="w-5 h-5" />,
  conditional: <SplitSquareVertical className="w-5 h-5" />,
  llm: <Brain className="w-5 h-5" />,
  timer: <Timer className="w-5 h-5" />,
  scheduler: <Calendar className="w-5 h-5" />,
  gate: <Filter className="w-5 h-5" />,
  logger: <ScrollText className="w-5 h-5" />,
  variable: <Variable className="w-5 h-5" />,
  template: <FileCode className="w-5 h-5" />
};

export const Sidebar: React.FC = () => {
  const addNode = useFlowStore((state) => state.addNode);
  const dragPreviewRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (event: React.DragEvent, nodeType: string, node: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';

    // Create drag preview
    if (dragPreviewRef.current) {
      const preview = dragPreviewRef.current.cloneNode(true) as HTMLDivElement;
      preview.style.position = 'fixed';
      preview.style.top = '-1000px';
      preview.style.left = '-1000px';
      preview.style.width = '240px';
      preview.style.pointerEvents = 'none';
      preview.style.zIndex = '1000';
      document.body.appendChild(preview);

      // Set the drag image
      event.dataTransfer.setDragImage(
        preview,
        preview.offsetWidth / 2,
        preview.offsetHeight / 2
      );

      // Clean up the preview element after drag
      requestAnimationFrame(() => {
        document.body.removeChild(preview);
      });
    }
  };

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-6 h-6 text-blue-500" />
          <h1 className="text-2xl font-bold text-blue-500">Agentica</h1>
        </div>
        <h2 className="text-xl font-bold text-gray-200">Nodes</h2>
      </div>
      <div className="p-4 space-y-2 flex-1 overflow-y-auto bg-gray-900/30 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {Object.entries(nodeRegistry).map(([type, node]) => (
          <div
            key={type}
            ref={dragPreviewRef}
            draggable
            onDragStart={(e) => handleDragStart(e, type, node)}
            className="flex items-center p-3 bg-gray-800/50 rounded-lg cursor-move hover:bg-gray-750 border border-gray-700/50 shadow-sm hover:border-gray-600 transition-all duration-150"
          >
            <div className="mr-3 text-gray-400 group-hover:text-gray-300 transition-colors">
              {nodeIcons[type]}
            </div>
            <span className="text-gray-300 group-hover:text-gray-200 transition-colors flex-1">
              {node.label}
            </span>
            <div className="relative group">
              <HelpCircle className="w-4 h-4 text-gray-500 hover:text-gray-300 cursor-help transition-colors" />
              <div className="fixed left-[calc(16rem+0.5rem)] ml-2 w-64 p-3 text-sm text-gray-200 bg-gray-800 rounded-lg shadow-xl border border-gray-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-[9999] pointer-events-none">
                {node.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
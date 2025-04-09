import React, { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Connection,
  Edge,
  ReactFlowInstance,
  addEdge,
  useReactFlow,
  Background,
  Controls,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useFlowStore } from '../store/flowStore';
import { FlowBackground } from './flow/FlowBackground';
import { FlowMinimap } from './flow/FlowMinimap';
import { FlowToolbar } from './flow/FlowToolbar';
import { FlowControls } from './FlowControls';
import { nodeTypes, nodeRegistry } from './flow/NodeRegistry';
import { FlowExecutor } from './flow/FlowExecutor';
import { Grid, Undo2, Redo2 } from 'lucide-react';

export const Flow: React.FC = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    addNode,
    setOutputs,
    setError,
    clearErrors,
    setExecutingNode,
    snapToGrid,
    gridSize,
    toggleSnapToGrid,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useFlowStore();
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const [isExecuting, setIsExecuting] = React.useState(false);
  const { getNode } = useReactFlow();
  const flowExecutor = React.useMemo(() => new FlowExecutor(), []);

  const onNodesChange = useCallback((changes: any) => {
    setNodes(changes);
  }, [setNodes]);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges(changes);
  }, [setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find(node => node.id === connection.source);
      const targetNode = nodes.find(node => node.id === connection.target);
      
      if (!sourceNode || !targetNode) {
        return;
      }

      const sourceOutputIndex = parseInt(connection.sourceHandle?.split('-')[1] || '0');
      const targetInputIndex = parseInt(connection.targetHandle?.split('-')[1] || '0');

      if (sourceOutputIndex >= sourceNode.data.outputs || targetInputIndex >= targetNode.data.inputs) {
        return;
      }

      const newEdge = {
        id: `e${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle,
        targetHandle: connection.targetHandle,
        className: 'animate-pulse-once',
      };
      setEdges((eds) => [...eds, newEdge]);
    },
    [setEdges, nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        return;
      }

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (!(type in nodeRegistry)) {
        return;
      }

      const nodeConfig = nodeRegistry[type as keyof typeof nodeRegistry].getConfig();

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type: 'custom',
        position,
        data: {
          label: nodeConfig.label,
          inputs: nodeConfig.inputs,
          outputs: nodeConfig.outputs,
          config: nodeConfig.configFields.reduce((acc, field) => ({
            ...acc,
            [field.name]: field.default
          }), {}),
          configFields: nodeConfig.configFields,
        },
      };

      addNode(newNode);
    },
    [reactFlowInstance, addNode]
  );

  const executeFlow = async () => {
    setIsExecuting(true);
    setOutputs([]);
    clearErrors();

    try {
      await flowExecutor.execute({
        nodes,
        edges,
        onNodeStart: (nodeId) => setExecutingNode(nodeId, true),
        onNodeComplete: (nodeId) => setExecutingNode(nodeId, false),
        onNodeError: (nodeId, error) => setError(nodeId, error),
        onOutputs: setOutputs,
      });
    } catch (error) {
      console.error('Flow execution error:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        if (event.shiftKey) {
          if (canRedo()) redo();
        } else {
          if (canUndo()) undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full bg-gray-950 relative">
      <FlowControls onExecute={executeFlow} isExecuting={isExecuting} />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        className="bg-gray-950"
        snapToGrid={snapToGrid}
        snapGrid={[gridSize, gridSize]}
        fitView
      >
        <FlowBackground />
        <FlowToolbar />
        <FlowMinimap />
        <Panel position="top-left" className="flex gap-2">
          <button
            onClick={toggleSnapToGrid}
            className={`p-2 rounded ${
              snapToGrid ? 'bg-blue-600' : 'bg-gray-700'
            } hover:bg-opacity-80 transition-colors`}
            title="Toggle grid snap"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={undo}
            disabled={!canUndo()}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 transition-colors"
            title="Undo (Ctrl/⌘ + Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo()}
            className="p-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:hover:bg-gray-700 transition-colors"
            title="Redo (Ctrl/⌘ + Shift + Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};
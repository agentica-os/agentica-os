import { StateCreator } from 'zustand';
import { Node, applyNodeChanges } from 'reactflow';
import { FlowState } from '../types';

export interface NodesSlice {
  nodes: Node[];
  setNodes: (changes: any) => void;
  addNode: (node: Node) => void;
  updateNodeData: (nodeId: string, data: any) => void;
}

export const createNodesSlice: StateCreator<
  FlowState & NodesSlice,
  [],
  [],
  NodesSlice
> = (set, get) => ({
  nodes: [],
  
  setNodes: (changes) => {
    set((state) => {
      const newNodes = Array.isArray(changes)
        ? applyNodeChanges(changes, state.nodes)
        : changes;

      const newState = { nodes: newNodes };
      
      if (!Array.isArray(changes) || !changes.every(change => change.type === 'select')) {
        setTimeout(() => get().addToHistory(), 0);
      }
      
      return newState;
    });
  },

  addNode: (node) => {
    const { snapToGrid, gridSize } = get();
    if (snapToGrid) {
      node.position.x = Math.round(node.position.x / gridSize) * gridSize;
      node.position.y = Math.round(node.position.y / gridSize) * gridSize;
    }
    set((state) => {
      const newState = { nodes: [...state.nodes, node] };
      setTimeout(() => get().addToHistory(), 0);
      return newState;
    });
  },

  updateNodeData: (nodeId, data) => {
    set((state) => {
      const newState = {
        nodes: state.nodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
        )
      };
      setTimeout(() => get().addToHistory(), 0);
      return newState;
    });
  },
});
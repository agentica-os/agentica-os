import { StateCreator } from 'zustand';
import { FlowState } from '../types';
import { Node, Edge } from 'reactflow';

const STORAGE_PREFIX = 'flow_';

export interface PersistenceSlice {
  currentFlow: string | null;
  saveFlow: (name: string) => void;
  loadFlow: (name: string) => void;
  deleteFlow: (name: string) => void;
  getSavedFlows: () => string[];
  clearFlow: () => void;
}

const isValidFlow = (data: any): data is { nodes: Node[]; edges: Edge[] } => {
  return (
    data &&
    Array.isArray(data.nodes) &&
    Array.isArray(data.edges) &&
    data.nodes.every((node: any) => 
      node && 
      typeof node.id === 'string' &&
      typeof node.type === 'string' &&
      node.position &&
      typeof node.position.x === 'number' &&
      typeof node.position.y === 'number'
    )
  );
};

export const createPersistenceSlice: StateCreator<
  FlowState & PersistenceSlice,
  [],
  [],
  PersistenceSlice
> = (set, get) => ({
  currentFlow: null,

  saveFlow: (name) => {
    try {
      const { nodes, edges } = get();
      const flowData = { nodes, edges };
      localStorage.setItem(`${STORAGE_PREFIX}${name}`, JSON.stringify(flowData));
      set({ currentFlow: name });
    } catch (error) {
      console.error('Failed to save flow:', error);
      throw new Error('Failed to save flow');
    }
  },

  loadFlow: (name) => {
    try {
      const data = localStorage.getItem(`${STORAGE_PREFIX}${name}`);
      if (!data) {
        throw new Error('Flow not found');
      }

      const parsedData = JSON.parse(data);
      if (!isValidFlow(parsedData)) {
        throw new Error('Invalid flow data');
      }

      const { nodes, edges } = parsedData;
      set({ 
        nodes, 
        edges, 
        outputs: [], 
        errors: [], 
        executingNodes: [],
        currentFlow: name,
        history: [],
        historyIndex: -1
      });
      
      // Add initial state to history after a small delay
      setTimeout(() => get().addToHistory(), 0);
    } catch (error) {
      console.error('Failed to load flow:', error);
      throw new Error('Failed to load flow');
    }
  },

  deleteFlow: (name) => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${name}`);
      const { currentFlow } = get();
      if (currentFlow === name) {
        set({ currentFlow: null });
      }
    } catch (error) {
      console.error('Failed to delete flow:', error);
      throw new Error('Failed to delete flow');
    }
  },

  getSavedFlows: () => {
    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(STORAGE_PREFIX))
        .map(key => key.replace(STORAGE_PREFIX, ''));
    } catch (error) {
      console.error('Failed to get saved flows:', error);
      return [];
    }
  },

  clearFlow: () => set({ 
    nodes: [], 
    edges: [], 
    outputs: [], 
    errors: [], 
    executingNodes: [],
    currentFlow: null,
    history: [],
    historyIndex: -1
  }),
});
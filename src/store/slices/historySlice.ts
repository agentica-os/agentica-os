import { StateCreator } from 'zustand';
import { FlowState } from '../types';

const MAX_HISTORY_LENGTH = 50;

export interface HistorySlice {
  history: FlowState['history'];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  addToHistory: () => void;
}

export const createHistorySlice: StateCreator<
  FlowState & HistorySlice,
  [],
  [],
  HistorySlice
> = (set, get) => ({
  history: [],
  historyIndex: -1,

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const { nodes, edges } = history[newIndex];
      set({ 
        nodes: [...nodes], 
        edges: [...edges], 
        historyIndex: newIndex,
        // Clear these to prevent stale state
        outputs: [],
        errors: [],
        executingNodes: []
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const { nodes, edges } = history[newIndex];
      set({ 
        nodes: [...nodes], 
        edges: [...edges], 
        historyIndex: newIndex,
        // Clear these to prevent stale state
        outputs: [],
        errors: [],
        executingNodes: []
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  addToHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    
    // Deep clone to prevent reference issues
    const newHistoryState = {
      nodes: nodes.map(node => ({
        ...node,
        data: { ...node.data }
      })),
      edges: edges.map(edge => ({ ...edge }))
    };

    const currentState = history[historyIndex];
    if (currentState && 
        JSON.stringify(currentState) === JSON.stringify(newHistoryState)) {
      return;
    }

    // Remove future states when adding new history entry
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newHistoryState);
    
    if (newHistory.length > MAX_HISTORY_LENGTH) {
      newHistory.shift();
    }
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      // Clear execution state when adding history
      outputs: [],
      errors: [],
      executingNodes: []
    });
  },
});
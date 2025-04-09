import { StateCreator } from 'zustand';
import { Edge, applyEdgeChanges } from 'reactflow';
import { FlowState } from '../types';

export interface EdgesSlice {
  edges: Edge[];
  setEdges: (changes: any) => void;
}

export const createEdgesSlice: StateCreator<
  FlowState & EdgesSlice,
  [],
  [],
  EdgesSlice
> = (set, get) => ({
  edges: [],
  
  setEdges: (changes) => {
    set((state) => {
      let newEdges;
      if (typeof changes === 'function') {
        newEdges = changes(state.edges);
      } else {
        newEdges = Array.isArray(changes)
          ? applyEdgeChanges(changes, state.edges)
          : changes;
      }

      const newState = { edges: newEdges };
      
      if (!Array.isArray(changes) || !changes.every(change => change.type === 'select')) {
        setTimeout(() => get().addToHistory(), 0);
      }
      
      return newState;
    });
  },
});
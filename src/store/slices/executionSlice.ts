import { StateCreator } from 'zustand';
import { FlowState, NodeError } from '../types';
import { NodeOutput } from '../../types/node';

export interface ExecutionSlice {
  outputs: NodeOutput[];
  errors: NodeError[];
  executingNodes: string[];
  setOutputs: (outputs: NodeOutput[]) => void;
  setError: (nodeId: string, error: string | null) => void;
  clearErrors: () => void;
  setExecutingNode: (nodeId: string, isExecuting: boolean) => void;
}

export const createExecutionSlice: StateCreator<
  FlowState & ExecutionSlice,
  [],
  [],
  ExecutionSlice
> = (set) => ({
  outputs: [],
  errors: [],
  executingNodes: [],

  setOutputs: (outputs) => set({ outputs }),

  setError: (nodeId, error) => set((state) => ({
    errors: error 
      ? [...state.errors.filter(e => e.nodeId !== nodeId), { nodeId, error }]
      : state.errors.filter(e => e.nodeId !== nodeId)
  })),

  clearErrors: () => set({ errors: [] }),

  setExecutingNode: (nodeId, isExecuting) => set((state) => ({
    executingNodes: isExecuting 
      ? [...state.executingNodes, nodeId]
      : state.executingNodes.filter(id => id !== nodeId)
  })),
});
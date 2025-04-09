import { create } from 'zustand';
import { FlowState } from './types';
import { createNodesSlice, NodesSlice } from './slices/nodesSlice';
import { createEdgesSlice, EdgesSlice } from './slices/edgesSlice';
import { createHistorySlice, HistorySlice } from './slices/historySlice';
import { createPersistenceSlice, PersistenceSlice } from './slices/persistenceSlice';
import { createExecutionSlice, ExecutionSlice } from './slices/executionSlice';
import { createGridSlice, GridSlice } from './slices/gridSlice';

export const useFlowStore = create<
  FlowState & 
  NodesSlice & 
  EdgesSlice & 
  HistorySlice & 
  PersistenceSlice & 
  ExecutionSlice & 
  GridSlice
>((...args) => ({
  ...createNodesSlice(...args),
  ...createEdgesSlice(...args),
  ...createHistorySlice(...args),
  ...createPersistenceSlice(...args),
  ...createExecutionSlice(...args),
  ...createGridSlice(...args),
}));
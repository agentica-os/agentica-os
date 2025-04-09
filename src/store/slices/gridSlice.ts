import { StateCreator } from 'zustand';
import { FlowState } from '../types';

export interface GridSlice {
  snapToGrid: boolean;
  gridSize: number;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
}

export const createGridSlice: StateCreator<
  FlowState & GridSlice,
  [],
  [],
  GridSlice
> = (set) => ({
  snapToGrid: true,
  gridSize: 20,

  toggleSnapToGrid: () => set((state) => ({ 
    snapToGrid: !state.snapToGrid 
  })),
  
  setGridSize: (size) => set({ gridSize: size }),
});
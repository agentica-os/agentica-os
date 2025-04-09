import { Node, Edge } from 'reactflow';
import { NodeOutput } from '../types/node';

export interface HistoryState {
  nodes: Node[];
  edges: Edge[];
}

export interface NodeError {
  nodeId: string;
  error: string;
}

export interface FlowState {
  nodes: Node[];
  edges: Edge[];
  outputs: NodeOutput[];
  errors: NodeError[];
  executingNodes: string[];
  currentFlow: string | null;
  history: HistoryState[];
  historyIndex: number;
  snapToGrid: boolean;
  gridSize: number;
}
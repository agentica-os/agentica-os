export interface NodeData {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface NodeConfig {
  type: string;
  label: string;
  description: string;
  inputs: number;
  outputs: number;
  configFields: ConfigField[];
}

export interface ConfigField {
  name: string;
  type: 'text' | 'select' | 'number';
  label: string;
  options?: string[];
  default?: any;
}

export interface NodeState {
  [key: string]: any;
}

export interface NodeOutput {
  nodeId: string;
  outputs: any[];
}

export abstract class BaseNode {
  abstract type: string;
  abstract label: string;
  abstract description: string;
  abstract getConfig(): NodeConfig;
  abstract execute(inputs: any[], state: NodeState): Promise<any[]>;
}

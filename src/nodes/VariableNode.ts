import { BaseNode, NodeConfig, NodeState } from '../types/node';

export class VariableNode extends BaseNode {
  type = 'variable';
  label = 'Variable';
  description = 'Stores and retrieves values during flow execution. Use store mode to save values and load mode to retrieve them later.';
  private static variables: Record<string, any> = {};

  getConfig(): NodeConfig {
    return {
      type: this.type,
      label: this.label,
      description: this.description,
      inputs: 1,
      outputs: 1,
      configFields: [
        {
          name: 'name',
          type: 'text',
          label: 'Variable Name',
          default: 'myVar'
        },
        {
          name: 'mode',
          type: 'select',
          label: 'Mode',
          options: ['store', 'load'],
          default: 'store'
        }
      ]
    };
  }

  async execute(inputs: any[], state: NodeState): Promise<any[]> {
    const name = state.name || 'myVar';
    const mode = state.mode || 'store';
    const value = inputs[0];

    if (mode === 'store') {
      VariableNode.variables[name] = value;
      return [value];
    } else {
      return [VariableNode.variables[name]];
    }
  }
}
import { BaseNode, NodeConfig, NodeState } from '../types/node';

export class StaticTextNode extends BaseNode {
  type = 'staticText';
  label = 'Static Text';
  description = 'Outputs a static text value that you define. Useful for constants, messages, or test data.';

  getConfig(): NodeConfig {
    return {
      type: this.type,
      label: this.label,
      description: this.description,
      inputs: 0,
      outputs: 1,
      configFields: [
        {
          name: 'text',
          type: 'text',
          label: 'Text Content',
          default: ''
        }
      ]
    };
  }

  async execute(_inputs: any[], state: NodeState): Promise<any[]> {
    return [state.text || ''];
  }
}
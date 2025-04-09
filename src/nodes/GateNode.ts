import { BaseNode, NodeConfig, NodeState } from '../types/node';

export class GateNode extends BaseNode {
  type = 'gate';
  label = 'Gate';
  description = 'Controls data flow based on a control signal. Can either pass through or block data based on the control input.';

  getConfig(): NodeConfig {
    return {
      type: this.type,
      label: this.label,
      description: this.description,
      inputs: 2, // Control signal and input value
      outputs: 1,
      configFields: [
        {
          name: 'mode',
          type: 'select',
          label: 'Gate Mode',
          options: ['pass', 'block'],
          default: 'pass'
        },
        {
          name: 'defaultValue',
          type: 'text',
          label: 'Default Value (when blocked)',
          default: ''
        }
      ]
    };
  }

  async execute(inputs: any[], state: NodeState): Promise<any[]> {
    const [controlSignal, value] = inputs;
    const mode = state.mode || 'pass';
    const defaultValue = state.defaultValue || null;

    const shouldPass = mode === 'pass' ? !!controlSignal : !controlSignal;
    return [shouldPass ? value : defaultValue];
  }
}
import { BaseNode, NodeConfig, NodeState } from '../types/node';

export class LoggerNode extends BaseNode {
  type = 'logger';
  label = 'Logger';
  description = 'Logs data to the console with different severity levels. Useful for debugging and monitoring flow execution.';

  getConfig(): NodeConfig {
    return {
      type: this.type,
      label: this.label,
      description: this.description,
      inputs: 1,
      outputs: 1,
      configFields: [
        {
          name: 'level',
          type: 'select',
          label: 'Log Level',
          options: ['info', 'warn', 'error', 'debug'],
          default: 'info'
        },
        {
          name: 'prefix',
          type: 'text',
          label: 'Log Prefix',
          default: ''
        }
      ]
    };
  }

  async execute(inputs: any[], state: NodeState): Promise<any[]> {
    const value = inputs[0];
    const level = state.level || 'info';
    const prefix = state.prefix ? `[${state.prefix}] ` : '';
    const message = `${prefix}${JSON.stringify(value)}`;

    switch (level) {
      case 'warn':
        console.warn(message);
        break;
      case 'error':
        console.error(message);
        break;
      case 'debug':
        console.debug(message);
        break;
      default:
        console.log(message);
    }

    return [value];
  }
}
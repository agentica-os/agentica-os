import { BaseNode, NodeConfig, NodeState } from '../types/node';

export class TimerNode extends BaseNode {
  type = 'timer';
  label = 'Timer';
  description = 'Triggers actions at regular intervals. Executes the flow periodically based on the configured interval time.';
  private intervals: Record<string, NodeJS.Timeout> = {};

  getConfig(): NodeConfig {
    return {
      type: this.type,
      label: this.label,
      description: this.description,
      inputs: 1,
      outputs: 1,
      configFields: [
        {
          name: 'interval',
          type: 'number',
          label: 'Interval (ms)',
          default: 1000
        },
        {
          name: 'enabled',
          type: 'select',
          label: 'Enabled',
          options: ['true', 'false'],
          default: 'true'
        }
      ]
    };
  }

  async execute(inputs: any[], state: NodeState): Promise<any[]> {
    const nodeId = state.nodeId as string;
    const interval = parseInt(state.interval) || 1000;
    const enabled = state.enabled !== 'false';
    const inputValue = inputs[0];

    if (this.intervals[nodeId]) {
      clearInterval(this.intervals[nodeId]);
      delete this.intervals[nodeId];
    }

    if (enabled) {
      return new Promise((resolve) => {
        this.intervals[nodeId] = setInterval(() => {
          console.log(`Timer ${nodeId} tick with value:`, inputValue);
        }, interval);

        resolve([inputValue]);
      });
    }

    return [inputValue];
  }

  cleanup(nodeId: string) {
    if (this.intervals[nodeId]) {
      clearInterval(this.intervals[nodeId]);
      delete this.intervals[nodeId];
    }
  }
}
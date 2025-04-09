import { BaseNode, NodeConfig, NodeState } from '../types/node';

export class SchedulerNode extends BaseNode {
  type = 'scheduler';
  label = 'Scheduler';
  description = 'Schedules actions to occur at specific times. Executes the flow at configured times, useful for automated tasks and periodic updates.';
  private timeouts: Record<string, NodeJS.Timeout> = {};

  getConfig(): NodeConfig {
    return {
      type: this.type,
      label: this.label,
      description: this.description,
      inputs: 1,
      outputs: 1,
      configFields: [
        {
          name: 'time',
          type: 'text',
          label: 'Execution Time (HH:mm)',
          default: '12:00'
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

  private getNextExecutionTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    const executionTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hours,
      minutes
    );

    if (executionTime.getTime() < now.getTime()) {
      executionTime.setDate(executionTime.getDate() + 1);
    }

    return executionTime;
  }

  async execute(inputs: any[], state: NodeState): Promise<any[]> {
    const nodeId = state.nodeId as string;
    const timeStr = state.time || '12:00';
    const enabled = state.enabled !== 'false';
    const inputValue = inputs[0];

    if (this.timeouts[nodeId]) {
      clearTimeout(this.timeouts[nodeId]);
      delete this.timeouts[nodeId];
    }

    if (enabled) {
      const executionTime = this.getNextExecutionTime(timeStr);
      const delay = executionTime.getTime() - Date.now();

      this.timeouts[nodeId] = setTimeout(() => {
        console.log(`Scheduler ${nodeId} executed with value:`, inputValue);
        this.execute(inputs, state);
      }, delay);
    }

    return [inputValue];
  }

  cleanup(nodeId: string) {
    if (this.timeouts[nodeId]) {
      clearTimeout(this.timeouts[nodeId]);
      delete this.timeouts[nodeId];
    }
  }
}
import { BaseNode, NodeConfig, NodeState } from '../types/node';

export class ConditionalNode extends BaseNode {
  type = 'conditional';
  label = 'If/Else';
  description = 'Routes data based on conditions. Compares two inputs and outputs to either the true or false path depending on the comparison result.';

  getConfig(): NodeConfig {
    return {
      type: this.type,
      label: this.label,
      description: this.description,
      inputs: 2, // Left and right operands
      outputs: 2, // True and False outputs
      configFields: [
        {
          name: 'operator',
          type: 'select',
          label: 'Operator',
          options: ['equals', 'not equals', 'greater than', 'less than', 'greater or equal', 'less or equal'],
          default: 'equals'
        },
        {
          name: 'outputMode',
          type: 'select',
          label: 'Output Mode',
          options: ['left value', 'right value', 'both values', 'boolean'],
          default: 'both values'
        }
      ]
    };
  }

  async execute(inputs: any[], state: NodeState): Promise<any[]> {
    const [left, right] = inputs;
    const operator = state.operator;
    const outputMode = state.outputMode || 'both values';

    if (left === undefined || right === undefined) {
      return [null, null];
    }

    let result = false;
    const leftNum = Number(left);
    const rightNum = Number(right);
    const isNumeric = !isNaN(leftNum) && !isNaN(rightNum);

    switch (operator) {
      case 'equals':
        result = left === right;
        break;
      case 'not equals':
        result = left !== right;
        break;
      case 'greater than':
        result = isNumeric ? leftNum > rightNum : String(left) > String(right);
        break;
      case 'less than':
        result = isNumeric ? leftNum < rightNum : String(left) < String(right);
        break;
      case 'greater or equal':
        result = isNumeric ? leftNum >= rightNum : String(left) >= String(right);
        break;
      case 'less or equal':
        result = isNumeric ? leftNum <= rightNum : String(left) <= String(right);
        break;
      default:
        result = false;
    }

    let trueOutput: any = null;
    let falseOutput: any = null;

    switch (outputMode) {
      case 'left value':
        trueOutput = result ? left : null;
        falseOutput = result ? null : left;
        break;
      case 'right value':
        trueOutput = result ? right : null;
        falseOutput = result ? null : right;
        break;
      case 'both values':
        trueOutput = result ? [left, right] : null;
        falseOutput = result ? null : [left, right];
        break;
      case 'boolean':
        trueOutput = result ? true : null;
        falseOutput = result ? null : false;
        break;
    }

    return [trueOutput, falseOutput];
  }
}
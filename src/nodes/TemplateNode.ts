import { BaseNode, NodeConfig, NodeState } from '../types/node';

export class TemplateNode extends BaseNode {
  type = 'template';
  label = 'Template';
  description = 'Creates text using templates with variable substitution. Replace {{value}} placeholders with input data to generate dynamic text.';

  getConfig(): NodeConfig {
    return {
      type: this.type,
      label: this.label,
      description: this.description,
      inputs: 1,
      outputs: 1,
      configFields: [
        {
          name: 'template',
          type: 'text',
          label: 'Template (use {{value}} for input)',
          default: 'Value is: {{value}}'
        }
      ]
    };
  }

  async execute(inputs: any[], state: NodeState): Promise<any[]> {
    const value = inputs[0];
    const template = state.template || 'Value is: {{value}}';

    let result = template;
    if (typeof value === 'object') {
      Object.entries(value).forEach(([key, val]) => {
        result = result.replace(
          new RegExp(`{{value.${key}}}`, 'g'),
          String(val)
        );
      });
    }
    
    result = result.replace(/{{value}}/g, String(value));

    return [result];
  }
}
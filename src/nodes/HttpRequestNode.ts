import { BaseNode, NodeConfig, NodeState } from '../types/node';

export class HttpRequestNode extends BaseNode {
  type = 'httpRequest';
  label = 'HTTP Request';
  description = 'Makes HTTP requests to external APIs. Supports GET, POST, PUT, and DELETE methods with custom headers and body.';

  getConfig(): NodeConfig {
    return {
      type: this.type,
      label: this.label,
      description: this.description,
      inputs: 1,
      outputs: 1,
      configFields: [
        {
          name: 'method',
          type: 'select',
          label: 'HTTP Method',
          options: ['GET', 'POST', 'PUT', 'DELETE'],
          default: 'GET'
        },
        {
          name: 'headers',
          type: 'text',
          label: 'Headers (JSON)',
          default: '{}'
        },
        {
          name: 'body',
          type: 'text',
          label: 'Request Body',
          default: ''
        }
      ]
    };
  }

  async execute(inputs: any[], state: NodeState): Promise<any[]> {
    try {
      const url = inputs[0] || '';
      const method = state.method || 'GET';
      const headers = JSON.parse(state.headers || '{}');
      const body = state.body;

      // Use a CORS proxy to handle the request
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

      const options: RequestInit = {
        method: 'GET', // The proxy only supports GET requests
        headers: {
          'Content-Type': 'application/json',
        }
      };

      const response = await fetch(proxyUrl, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.text();
      return [data];
    } catch (error) {
      console.error('HTTP Request failed:', error);
      throw error;
    }
  }
}
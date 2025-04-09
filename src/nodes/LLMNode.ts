import { BaseNode, NodeConfig, NodeState } from '../types/node';
import OpenAI from 'openai';

export class LLMNode extends BaseNode {
  type = 'llm';
  label = 'LLM';
  description = 'Interacts with Large Language Models like GPT-3.5 and GPT-4. Processes text input using AI to generate responses based on the system prompt and configuration.';

  getConfig(): NodeConfig {
    return {
      type: this.type,
      label: this.label,
      description: this.description,
      inputs: 1,
      outputs: 1,
      configFields: [
        {
          name: 'model',
          type: 'select',
          label: 'Model',
          options: ['gpt-3.5-turbo', 'gpt-4'],
          default: 'gpt-3.5-turbo'
        },
        {
          name: 'systemPrompt',
          type: 'text',
          label: 'System Prompt',
          default: 'You are a helpful assistant.'
        },
        {
          name: 'temperature',
          type: 'number',
          label: 'Temperature',
          default: 0.7
        },
        {
          name: 'maxTokens',
          type: 'number',
          label: 'Max Tokens',
          default: 500
        },
        {
          name: 'apiKey',
          type: 'text',
          label: 'OpenAI API Key',
          default: ''
        }
      ]
    };
  }

  async execute(inputs: any[], state: NodeState): Promise<any[]> {
    const [userInput] = inputs;
    
    if (!state.apiKey) {
      throw new Error('OpenAI API key is required');
    }

    if (!userInput) {
      return ['No input provided'];
    }

    try {
      const openai = new OpenAI({
        apiKey: state.apiKey,
        dangerouslyAllowBrowser: true
      });

      const completion = await openai.chat.completions.create({
        model: state.model || 'gpt-3.5-turbo',
        temperature: Number(state.temperature) || 0.7,
        max_tokens: Number(state.maxTokens) || 500,
        messages: [
          {
            role: 'system',
            content: state.systemPrompt || 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: userInput
          }
        ]
      });

      return [completion.choices[0]?.message?.content || 'No response generated'];
    } catch (error) {
      console.error('LLM Node Error:', error);
      throw error;
    }
  }
}
import { Edge, Node } from 'reactflow';
import { nodeRegistry } from './NodeRegistry';
import { NodeOutput } from '../../types/node';

interface ExecuteFlowParams {
  nodes: Node[];
  edges: Edge[];
  onNodeStart: (nodeId: string) => void;
  onNodeComplete: (nodeId: string) => void;
  onNodeError: (nodeId: string, error: string) => void;
  onOutputs: (outputs: NodeOutput[]) => void;
}

export class FlowExecutor {
  private nodeStates = new Map<string, any[]>();
  private nodeOutputs: NodeOutput[] = [];

  async execute({
    nodes,
    edges,
    onNodeStart,
    onNodeComplete,
    onNodeError,
    onOutputs,
  }: ExecuteFlowParams) {
    this.nodeStates.clear();
    this.nodeOutputs = [];

    try {
      // Find nodes without inputs (starting nodes)
      const startNodes = nodes.filter(node => {
        return !edges.some(edge => edge.target === node.id);
      });

      // Execute starting nodes
      await Promise.all(startNodes.map(node => 
        this.executeNode(node.id, {
          nodes,
          edges,
          onNodeStart,
          onNodeComplete,
          onNodeError,
        })
      ));

      onOutputs(this.nodeOutputs);
    } catch (error) {
      console.error('Flow execution error:', error);
    }
  }

  private async executeNode(
    nodeId: string,
    {
      nodes,
      edges,
      onNodeStart,
      onNodeComplete,
      onNodeError,
    }: Omit<ExecuteFlowParams, 'onOutputs'>
  ) {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    onNodeStart(nodeId);

    try {
      // Get node type from ID prefix
      const nodeType = node.id.split('-')[0];
      const nodeInstance = nodeRegistry[nodeType as keyof typeof nodeRegistry];
      
      if (!nodeInstance) {
        throw new Error('Invalid node type');
      }

      // Get input values from connected nodes
      const inputEdges = edges.filter(edge => edge.target === nodeId);
      const inputs = await Promise.all(inputEdges.map(async edge => {
        const sourceOutputs = this.nodeStates.get(edge.source) || [];
        const outputIndex = parseInt(edge.sourceHandle?.split('-')[1] || '0');
        return sourceOutputs[outputIndex];
      }));

      // Execute node
      const outputs = await nodeInstance.execute(inputs, node.data.config);
      this.nodeStates.set(nodeId, outputs);
      this.nodeOutputs.push({ nodeId, outputs });

      // Execute connected nodes
      const connectedEdges = edges.filter(edge => edge.source === nodeId);
      const targetNodes = connectedEdges.map(edge => edge.target);
      await Promise.all(targetNodes.map(targetId => 
        this.executeNode(targetId, {
          nodes,
          edges,
          onNodeStart,
          onNodeComplete,
          onNodeError,
        })
      ));

      onNodeComplete(nodeId);
    } catch (error) {
      onNodeError(nodeId, error instanceof Error ? error.message : 'An error occurred');
      throw error;
    }
  }
}
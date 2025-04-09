import { StaticTextNode } from '../../nodes/StaticTextNode';
import { HttpRequestNode } from '../../nodes/HttpRequestNode';
import { ConditionalNode } from '../../nodes/ConditionalNode';
import { LLMNode } from '../../nodes/LLMNode';
import { TimerNode } from '../../nodes/TimerNode';
import { SchedulerNode } from '../../nodes/SchedulerNode';
import { GateNode } from '../../nodes/GateNode';
import { LoggerNode } from '../../nodes/LoggerNode';
import { VariableNode } from '../../nodes/VariableNode';
import { TemplateNode } from '../../nodes/TemplateNode';
import { CustomNode } from '../CustomNode';
import { NodeTypes } from 'reactflow';

export const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export const nodeRegistry = {
  staticText: new StaticTextNode(),
  httpRequest: new HttpRequestNode(),
  conditional: new ConditionalNode(),
  llm: new LLMNode(),
  timer: new TimerNode(),
  scheduler: new SchedulerNode(),
  gate: new GateNode(),
  logger: new LoggerNode(),
  variable: new VariableNode(),
  template: new TemplateNode(),
};
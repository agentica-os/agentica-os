import React, { useState } from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';
import { ConfigField } from '../types/node';
import { TextModal } from './TextModal';
import { NodeHandles } from './nodes/NodeHandles';
import { NodeConfig } from './nodes/NodeConfig';
import { NodeOutput } from './nodes/NodeOutput';
import { NodeError } from './nodes/NodeError';

interface CustomNodeProps {
  id: string;
  data: {
    label: string;
    description: string;
    inputs: number;
    outputs: number;
    config: Record<string, any>;
    configFields: ConfigField[];
  };
}

export const CustomNode: React.FC<CustomNodeProps> = ({ id, data }) => {
  const { label, description, inputs, outputs, config, configFields } = data;
  const updateNodeData = useFlowStore((state) => state.updateNodeData);
  const nodeOutputs = useFlowStore((state) => 
    state.outputs.find((output) => output.nodeId === id)?.outputs || []
  );
  const nodeError = useFlowStore((state) => 
    state.errors.find((error) => error.nodeId === id)?.error
  );
  const isExecuting = useFlowStore((state) => 
    state.executingNodes.includes(id)
  );
  const [modalField, setModalField] = useState<ConfigField | null>(null);

  const handleConfigChange = (fieldName: string, value: string) => {
    updateNodeData(id, {
      config: {
        ...config,
        [fieldName]: value
      }
    });
  };

  return (
    <>
      <div className={`shadow-xl rounded-lg bg-gradient-to-b from-gray-800 to-gray-850 border ${
        nodeError ? 'border-red-500' : isExecuting ? 'border-blue-500' : 'border-gray-700'
      } min-w-[240px] backdrop-blur-sm transition-colors duration-200`}>
        <div className={`px-4 py-3 border-b ${
          nodeError ? 'border-red-500 bg-red-900/10' : isExecuting ? 'border-blue-500 bg-blue-900/10' : 'border-gray-700 bg-gray-800/50'
        } flex items-center justify-between`}>
          <div className="text-lg font-semibold text-gray-200">{label}</div>
          <div className="flex items-center gap-2">
            <div className="relative group">
              <HelpCircle className="w-5 h-5 text-gray-400 hover:text-gray-200 cursor-help transition-colors" />
              <div className="absolute right-0 w-64 p-2 mt-2 text-sm text-gray-200 bg-gray-900 rounded-lg shadow-xl border border-gray-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                {description}
              </div>
            </div>
            {nodeError && (
              <div className="text-red-500 flex items-center" title={nodeError}>
                <AlertCircle className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>

        <NodeHandles inputs={inputs} outputs={outputs} hasError={!!nodeError} />

        <div className="p-4 space-y-3">
          <NodeConfig
            configFields={configFields}
            config={config}
            onConfigChange={handleConfigChange}
            onOpenModal={setModalField}
          />
          <NodeOutput outputs={nodeOutputs} />
          <NodeError error={nodeError} />
        </div>
      </div>

      {modalField && (
        <TextModal
          isOpen={true}
          onClose={() => setModalField(null)}
          value={config[modalField.name] || modalField.default}
          onChange={(value) => handleConfigChange(modalField.name, value)}
          title={`Edit ${modalField.label}`}
        />
      )}
    </>
  );
};
import React from 'react';
import { ConfigField } from '../../types/node';
import { Maximize2 } from 'lucide-react';

interface NodeConfigProps {
  configFields: ConfigField[];
  config: Record<string, any>;
  onConfigChange: (fieldName: string, value: string) => void;
  onOpenModal: (field: ConfigField) => void;
}

export const NodeConfig: React.FC<NodeConfigProps> = ({
  configFields,
  config,
  onConfigChange,
  onOpenModal,
}) => {
  const renderConfigField = (field: ConfigField) => {
    const isLongText = field.type === 'text' && field.name === 'systemPrompt';

    switch (field.type) {
      case 'select':
        return (
          <select
            value={config[field.name] || field.default}
            onChange={(e) => onConfigChange(field.name, e.target.value)}
            className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded-md px-3 py-1.5 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
          >
            {field.options?.map((option) => (
              <option key={option} value={option} className="bg-gray-800">
                {option}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={config[field.name] || field.default}
            onChange={(e) => onConfigChange(field.name, e.target.value)}
            className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded-md px-3 py-1.5 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
          />
        );
      default:
        return (
          <div className="relative">
            <input
              type="text"
              value={config[field.name] || field.default}
              onChange={(e) => onConfigChange(field.name, e.target.value)}
              className="w-full bg-gray-800 text-gray-200 border border-gray-600 rounded-md px-3 py-1.5 text-sm shadow-sm focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
            />
            {isLongText && (
              <button
                onClick={() => onOpenModal(field)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                title="Open in modal"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-3">
      {configFields?.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {field.label}
          </label>
          {renderConfigField(field)}
        </div>
      ))}
    </div>
  );
};
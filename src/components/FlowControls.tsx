import React, { useState } from 'react';
import { Save, FolderOpen, Play, FilePlus } from 'lucide-react';
import { useFlowStore } from '../store/flowStore';
import { SaveModal } from './modals/SaveModal';
import { LoadModal } from './modals/LoadModal';
import { ConfirmModal } from './modals/ConfirmModal';

export const FlowControls: React.FC<{ onExecute: () => void; isExecuting: boolean }> = ({
  onExecute,
  isExecuting,
}) => {
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isConfirmNewFlowOpen, setIsConfirmNewFlowOpen] = useState(false);
  const [isConfirmLoadOpen, setIsConfirmLoadOpen] = useState(false);
  const [pendingLoadFlow, setPendingLoadFlow] = useState<string | null>(null);
  const { saveFlow, loadFlow, deleteFlow, getSavedFlows, clearFlow, nodes, currentFlow } = useFlowStore();

  const handleNewFlow = () => {
    if (nodes.length > 0) {
      setIsConfirmNewFlowOpen(true);
    } else {
      clearFlow();
    }
  };

  const handleLoadFlow = (name: string) => {
    if (nodes.length > 0 && (!currentFlow || currentFlow !== name)) {
      setPendingLoadFlow(name);
      setIsConfirmLoadOpen(true);
    } else {
      loadFlow(name);
      setIsLoadModalOpen(false);
    }
  };

  const handleSaveBeforeLoad = () => {
    setIsSaveModalOpen(true);
    setIsConfirmLoadOpen(false);
  };

  const handleConfirmLoad = () => {
    if (pendingLoadFlow) {
      loadFlow(pendingLoadFlow);
      setPendingLoadFlow(null);
      setIsLoadModalOpen(false);
    }
    setIsConfirmLoadOpen(false);
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <button
          onClick={handleNewFlow}
          className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow-lg transition-colors"
          title="New flow"
        >
          <FilePlus className="w-4 h-4 mr-2" />
          New
        </button>
        <button
          onClick={() => setIsSaveModalOpen(true)}
          className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow-lg transition-colors"
          title="Save flow"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </button>
        <button
          onClick={() => setIsLoadModalOpen(true)}
          className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md shadow-lg transition-colors"
          title="Load flow"
        >
          <FolderOpen className="w-4 h-4 mr-2" />
          Load
        </button>
        <button
          onClick={onExecute}
          disabled={isExecuting}
          className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-md shadow-lg transition-colors"
        >
          <Play className="w-4 h-4 mr-2" />
          {isExecuting ? 'Executing...' : 'Run Flow'}
        </button>
      </div>

      <SaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={saveFlow}
        existingFlowName={currentFlow}
      />

      <LoadModal
        isOpen={isLoadModalOpen}
        onClose={() => setIsLoadModalOpen(false)}
        flows={getSavedFlows()}
        onLoad={handleLoadFlow}
        onDelete={deleteFlow}
      />

      <ConfirmModal
        isOpen={isConfirmNewFlowOpen}
        onClose={() => setIsConfirmNewFlowOpen(false)}
        onConfirm={() => {
          setIsConfirmNewFlowOpen(false);
          setIsSaveModalOpen(true);
        }}
        title="Create New Flow"
        message="Do you want to save the current flow before creating a new one?"
      />

      <ConfirmModal
        isOpen={isConfirmLoadOpen}
        onClose={() => {
          setIsConfirmLoadOpen(false);
          setPendingLoadFlow(null);
        }}
        onConfirm={handleConfirmLoad}
        title="Load Flow"
        message="Do you want to save the current flow before loading another one?"
      />
    </>
  );
};
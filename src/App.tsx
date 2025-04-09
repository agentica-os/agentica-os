import React, { useState, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/Sidebar';
import { Flow } from './components/Flow';
import { WelcomeModal } from './components/modals/WelcomeModal';

function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
      <WelcomeModal isOpen={showWelcome} onClose={handleCloseWelcome} />
    </div>
  );
}

export default App;
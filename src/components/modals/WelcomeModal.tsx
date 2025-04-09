import React from 'react';
import { X, Github, Star, GitPullRequest } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-[600px] max-w-[90vw]">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-gray-200">Welcome to Agentica</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-blue-200 font-medium">🚧 Alpha Stage Project</p>
            <p className="text-gray-300 mt-2">
              Agentica is currently in alpha stage. While it's functional, you may encounter bugs or incomplete features.
              We're actively working on improvements and welcome your feedback!
            </p>
          </div>

          <div className="space-y-4 text-gray-300">
            <p>
              Agentica is a visual flow programming tool that helps you build and connect AI-powered workflows.
              Drag nodes from the sidebar, connect them together, and create powerful automation flows.
            </p>

            <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
              <h3 className="text-lg font-semibold text-gray-200">Get Involved</h3>
              <div className="flex items-center gap-3">
                <Github className="w-5 h-5 text-gray-400" />
                <a 
                  href="https://github.com/yourusername/agentica" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View on GitHub
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-gray-400" />
                <span>Star the project to show your support</span>
              </div>
              <div className="flex items-center gap-3">
                <GitPullRequest className="w-5 h-5 text-gray-400" />
                <span>Contribute by submitting pull requests</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-700 flex justify-between items-center">
          <label className="flex items-center gap-2 text-gray-300">
            <input type="checkbox" className="rounded bg-gray-700 border-gray-600 text-blue-500 focus:ring-blue-500" />
            <span>Don't show this again</span>
          </label>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
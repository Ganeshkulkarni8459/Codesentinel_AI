
import React, { useState } from 'react';
import { RepoConfig } from '../types';
import { Github, FolderArchive, ArrowRight, Loader2, UploadCloud, LogOut } from 'lucide-react';

interface RepoSelectorProps {
  onSelect: (config: RepoConfig) => void;
  onLogout: () => void;
}

const RepoSelector: React.FC<RepoSelectorProps> = ({ onSelect, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'github' | 'zip'>('github');
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'github' && !inputValue) return;
    
    setIsProcessing(true);

    // Simulate ingestion delay
    setTimeout(() => {
      let config: RepoConfig;
      
      if (activeTab === 'github') {
        const name = inputValue.split('/').pop() || inputValue;
        config = { type: 'GITHUB', name, url: inputValue };
      } else {
        // Mock zip handling
        const fileName = inputValue.split('\\').pop()?.split('/').pop() || 'uploaded-project.zip';
        config = { type: 'ZIP', name: fileName.replace('.zip', ''), files: 45 };
      }
      
      onSelect(config);
      setIsProcessing(false);
    }, 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setInputValue(e.target.files[0].name);
      }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4 relative">
      <button 
          onClick={onLogout} 
          className="absolute top-6 right-6 text-gray-500 hover:text-white flex items-center gap-2 transition-colors px-4 py-2 rounded-lg hover:bg-[#161b22]"
      >
          <LogOut size={16} /> <span className="text-sm font-medium">Logout</span>
      </button>

      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Target Selection</h2>
            <p className="text-gray-400">Select the codebase for the autonomous agent to ingest.</p>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-2xl">
            {/* Tabs */}
            <div className="flex border-b border-[#30363d]">
                <button 
                    onClick={() => { setActiveTab('github'); setInputValue(''); }}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'github' ? 'bg-[#0d1117] text-white border-t-2 border-green-500' : 'text-gray-400 hover:text-white hover:bg-[#1f242c]'}`}
                >
                    <Github size={18} /> GitHub Repo
                </button>
                <button 
                    onClick={() => { setActiveTab('zip'); setInputValue(''); }}
                    className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${activeTab === 'zip' ? 'bg-[#0d1117] text-white border-t-2 border-green-500' : 'text-gray-400 hover:text-white hover:bg-[#1f242c]'}`}
                >
                    <FolderArchive size={18} /> Upload ZIP
                </button>
            </div>

            {/* Content */}
            <div className="p-8 min-h-[300px] flex flex-col justify-center">
                {isProcessing ? (
                    <div className="text-center py-8">
                        <Loader2 size={48} className="animate-spin text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">Ingesting Codebase...</h3>
                        <p className="text-gray-400 font-mono text-sm">
                            {activeTab === 'github' && "Cloning repository metadata..."}
                            {activeTab === 'zip' && "Decompressing and parsing artifacts..."}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {activeTab === 'github' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2">
                                <label className="block text-sm font-medium text-gray-400 mb-2">Repository URL</label>
                                <input 
                                    type="url" 
                                    placeholder="https://github.com/username/repository"
                                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    autoFocus
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-2">Public repositories only. Large repos may take time to map.</p>
                            </div>
                        )}

                        {activeTab === 'zip' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 text-center border-2 border-dashed border-[#30363d] rounded-xl p-8 hover:border-gray-500 transition-colors cursor-pointer relative">
                                <input 
                                    type="file" 
                                    accept=".zip"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleFileChange}
                                    required
                                />
                                <UploadCloud size={48} className="mx-auto text-gray-600 mb-4" />
                                <div className="text-gray-300 font-medium mb-1">
                                    {inputValue || "Click to upload or drag and drop"}
                                </div>
                                <p className="text-xs text-gray-500">ZIP archives containing source code</p>
                            </div>
                        )}

                        <div className="pt-4 flex justify-end">
                            <button 
                                type="submit"
                                className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-3 rounded-lg font-medium transition-all"
                            >
                                Connect Agent <ArrowRight size={18} />
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default RepoSelector;

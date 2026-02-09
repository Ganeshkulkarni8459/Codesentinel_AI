import React from 'react';
import { LayoutDashboard, ShieldAlert, Zap, TestTube, Terminal, BrainCircuit, ScanSearch } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  phase: string;
  duration: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, phase, duration }) => {
  const menuItems = [
    { id: 'overview', label: 'Mission Control', icon: LayoutDashboard },
    { id: 'validation', label: 'Validation Loop', icon: ScanSearch },
    { id: 'security', label: 'Security Findings', icon: ShieldAlert },
    { id: 'performance', label: 'Benchmarks', icon: Zap },
    { id: 'tests', label: 'Auto-Tests', icon: TestTube },
    { id: 'thoughts', label: 'Thought Signature', icon: BrainCircuit },
  ];

  return (
    <div className="w-64 bg-[#0d1117] border-r border-[#30363d] flex flex-col h-full">
      <div className="p-6 border-b border-[#30363d]">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="text-green-500 w-6 h-6" />
          <span className="font-bold text-lg tracking-tight text-white">CodeSentinel</span>
        </div>
        <div className="text-xs text-green-400 font-mono tracking-wider">AI MARATHON AGENT</div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-[#1f242c] text-green-400 border-l-2 border-green-500 shadow-lg shadow-green-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-[#161b22]'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#30363d] bg-[#161b22]">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-mono text-gray-500">SESSION DURATION</span>
            <span className="text-xs font-mono text-green-400">{Math.floor(duration / 60)}h {duration % 60}m</span>
        </div>
        <div className="h-1 w-full bg-[#30363d] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-green-500 animate-pulse w-full"></div>
        </div>
        <div className="text-[10px] leading-tight text-gray-400 font-mono uppercase truncate">
             {phase.split(':')[0]}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
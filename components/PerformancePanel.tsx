
import React from 'react';
import { PerformanceIssue } from '../types';
import { Zap, Timer, BarChart3, ArrowRight, Gauge } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface PerformancePanelProps {
  issues: PerformanceIssue[];
}

const PerformancePanel: React.FC<PerformancePanelProps> = ({ issues }) => {
    
  // Helper to extract numbers from strings like "150ms" or "2.5s"
  const parseValue = (val: string | undefined | null) => {
      if (!val) return 0;
      const num = parseFloat(val.replace(/[^0-9.]/g, ''));
      if (val.toLowerCase().includes('s') && !val.toLowerCase().includes('ms')) {
          return isNaN(num) ? 0 : num * 1000; // Convert seconds to ms for chart scale
      }
      return isNaN(num) ? 0 : num;
  };

  const data = issues.map(i => ({
      name: i.component.length > 15 ? i.component.substring(0, 12) + '...' : i.component,
      fullName: i.component,
      Current: parseValue(i.currentValue),
      Optimized: parseValue(i.optimizedValue),
      unit: i.currentValue?.includes('s') && !i.currentValue?.includes('ms') ? 'ms (scaled)' : 'ms'
  }));

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar">
        <div className="mb-8 flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Performance Benchmarks</h2>
                <p className="text-gray-400 text-sm">Autonomous latency measurement and optimization cycles.</p>
            </div>
            {issues.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 text-green-400 rounded-full text-xs font-mono border border-green-500/30">
                    <Gauge size={12} className="animate-spin-slow" />
                    <span>PROFILED: {issues.length} MODULES</span>
                </div>
            )}
        </div>

      {issues.length > 0 ? (
          <div className="h-80 mb-8 bg-[#161b22] p-6 rounded-lg border border-[#30363d] shadow-inner">
             <h3 className="text-sm font-semibold text-gray-300 mb-6 flex items-center gap-2">
                 <BarChart3 size={16} className="text-green-500" /> Latency Reduction Delta (ms)
             </h3>
             <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data} layout="horizontal" margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#30363d" vertical={false} />
                    <XAxis dataKey="name" stroke="#8b949e" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#8b949e" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: '#0d1117', border: '1px solid #30363d', borderRadius: '8px' }} 
                        itemStyle={{ fontSize: 12 }}
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar dataKey="Current" fill="#f87171" radius={[4, 4, 0, 0]} barSize={24} name="Baseline" />
                    <Bar dataKey="Optimized" fill="#4ade80" radius={[4, 4, 0, 0]} barSize={24} name="Optimized" />
                 </BarChart>
             </ResponsiveContainer>
          </div>
      ) : (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-[#30363d] rounded-lg bg-[#0d1117]/50">
               <div className="p-5 bg-[#161b22] rounded-full mb-6 border border-[#30363d]">
                   <Timer className="text-gray-600 animate-pulse" size={40} />
               </div>
               <h3 className="text-gray-300 font-bold text-lg mb-2">No Benchmark Artifacts</h3>
               <p className="text-gray-500 text-sm max-w-sm text-center">
                   Profiling begins after Initial Analysis. The orchestrator will simulate high-load scenarios to identify performance regressions.
               </p>
          </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {issues.map((issue) => (
          <div key={issue.id} className="bg-[#161b22] border border-[#30363d] p-5 rounded-lg flex items-center justify-between group hover:border-[#4ade80] transition-all duration-300">
            <div className="flex-1">
               <div className="flex items-center gap-2 mb-1">
                   {issue.impact === 'HIGH' ? <Zap className="text-yellow-400" size={18} /> : <Timer className="text-green-400" size={18} />}
                   <h4 className="font-semibold text-gray-100">{issue.component}</h4>
                   <span className="text-[10px] font-bold text-gray-500 border border-[#30363d] px-2 py-0.5 rounded-full uppercase tracking-tighter">{issue.metric}</span>
               </div>
               <p className="text-sm text-gray-400 mt-2 italic">"{issue.suggestion}"</p>
            </div>
            <div className="flex items-center gap-6 pl-6 border-l border-[#30363d] ml-4">
                <div className="text-right">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Baseline</div>
                    <div className="text-base font-mono font-bold text-red-400">{issue.currentValue}</div>
                </div>
                <ArrowRight size={20} className="text-gray-700" />
                <div className="text-right">
                    <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Target</div>
                    <div className="text-base font-mono font-bold text-green-400">{issue.optimizedValue}</div>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformancePanel;

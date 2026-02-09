
import React from 'react';
import { ReviewState } from '../types';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { Box, Layers, BrainCircuit, RefreshCw, CheckCircle2, Shield, Activity, HardDrive, Zap, TestTube, Search, ChevronRight } from 'lucide-react';

interface DashboardProps {
  state: ReviewState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const chartData = [
      { subject: 'Security', A: Math.max(10, 100 - (state.vulnerabilities.filter(v => v.severity === 'CRITICAL' || v.severity === 'HIGH').length * 15)), fullMark: 100 },
      { subject: 'Stability', A: Math.max(15, 100 - (state.performance.length * 8)), fullMark: 100 },
      { subject: 'Tests', A: state.tests.length > 0 ? (state.tests.filter(t => t.status === 'PASS').length / Math.max(1, state.tests.length)) * 100 : 20, fullMark: 100 },
      { subject: 'Optimized', A: state.performance.length > 0 ? 85 : 10, fullMark: 100 },
      { subject: 'Structure', A: state.architecture.length > 0 ? 90 : 30, fullMark: 100 },
  ];

  const validatedCount = state.vulnerabilities.filter(v => v.status === 'VALIDATED').length;
  const performanceCount = state.performance.length;
  const testCount = state.tests.length;

  return (
    <div className="p-6 h-full overflow-y-auto custom-scrollbar bg-[#0d1117] space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Summary Card */}
           <div className="lg:col-span-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-[-20px] right-[-20px] p-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-700">
                    <BrainCircuit size={280} className="text-green-500" />
                </div>
                
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse"></div>
                        <h3 className="text-green-400 text-xs font-bold uppercase tracking-[0.2em]">
                            {state.phase}
                        </h3>
                    </div>
                    <div className="text-[10px] text-gray-500 font-mono tracking-tighter">ORCHESTRATOR_L6_ENABLED</div>
                </div>

                <p className="text-gray-100 leading-relaxed text-xl font-medium mb-10 max-w-2xl min-h-[3rem]">
                    {state.summary || "Initializing autonomous sub-routines... Codebase structure mapping in progress."}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[
                        { label: 'Vulns', val: state.vulnerabilities.length, icon: Shield, color: 'text-red-400', border: 'hover:border-red-500/30' },
                        { label: 'Verified', val: validatedCount, icon: Search, color: 'text-emerald-400', border: 'hover:border-emerald-500/30' },
                        { label: 'Perf', val: performanceCount, icon: Zap, color: 'text-yellow-400', border: 'hover:border-yellow-500/30' },
                        { label: 'Tests', val: testCount, icon: TestTube, color: 'text-blue-400', border: 'hover:border-blue-500/30' },
                        { label: 'Logic', val: state.thoughtSignature.decisions.length, icon: Activity, color: 'text-purple-400', border: 'hover:border-purple-500/30' },
                        { label: 'Decisions', val: state.thoughtSignature.decisions.length, icon: HardDrive, color: 'text-gray-400', border: 'hover:border-gray-500/30' }
                    ].map((item, i) => (
                        <div key={i} className={`bg-[#0d1117] p-3 rounded-xl border border-[#30363d] ${item.border} transition-all duration-300 transform hover:-translate-y-1`}>
                            <div className="flex items-center gap-2 mb-1 text-gray-500">
                                 <item.icon size={12} className={item.color} />
                                 <span className="text-[9px] uppercase font-bold tracking-tighter">{item.label}</span>
                            </div>
                            <div className="text-xl font-bold text-white font-mono">{item.val}</div>
                        </div>
                    ))}
                </div>
           </div>

           {/* Vitality Radar Chart */}
           <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col items-center justify-center shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500/10 via-green-500 to-green-500/10 opacity-50"></div>
                <h3 className="text-gray-400 text-[10px] font-bold mb-6 uppercase tracking-[0.2em] w-full text-left">Cognitive Health Matrix</h3>
                <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                            <PolarGrid stroke="#30363d" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b949e', fontSize: 10, fontWeight: 'bold' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Repo Health" dataKey="A" stroke="#22c55e" strokeWidth={3} fill="#22c55e" fillOpacity={0.15} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-500 font-mono group-hover:text-green-400 transition-colors">
                    <Activity size={12} /> REAL-TIME NEURAL SYNC
                </div>
           </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thought Signature Stream */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl flex flex-col">
                <h3 className="text-gray-400 text-xs font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
                    <BrainCircuit size={16} className="text-green-500" /> Recent Decision Tree
                </h3>
                <div className="space-y-4 flex-1 overflow-y-auto pr-3 custom-scrollbar max-h-[350px]">
                    {state.thoughtSignature.decisions.length === 0 ? (
                        <div className="text-center py-20 bg-[#0d1117]/50 rounded-xl border border-dashed border-[#30363d]">
                            <p className="text-gray-600 italic text-sm font-mono">Waiting for primary reasoning cycles...</p>
                        </div>
                    ) : (
                        state.thoughtSignature.decisions.slice().reverse().map((decision, idx) => (
                            <div key={decision.id + idx} className="bg-[#0d1117] border-l-2 border-green-500/40 p-4 rounded-r-xl transition-all hover:bg-[#1c2128] group/item">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-green-300 text-sm">{decision.action}</span>
                                    <span className="text-[9px] text-gray-600 font-mono tracking-tighter bg-gray-800 px-2 py-0.5 rounded">{decision.timestamp}</span>
                                </div>
                                <p className="text-gray-400 text-[11px] leading-relaxed mb-3 group-hover/item:text-gray-300 transition-colors">{decision.justification}</p>
                                <div className="inline-flex items-center text-[9px] text-emerald-500 font-bold bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10 uppercase tracking-widest">
                                    Outcome: {decision.outcome}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Active Targets */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 shadow-xl flex flex-col">
                <h3 className="text-gray-400 text-xs font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={16} className="text-yellow-500" /> Active Validation Targets
                </h3>
                <div className="flex-1 space-y-3 overflow-y-auto pr-3 custom-scrollbar max-h-[350px]">
                    {state.vulnerabilities.length === 0 && state.performance.length === 0 ? (
                        <div className="text-center py-20 bg-[#0d1117]/50 rounded-xl border border-dashed border-[#30363d]">
                            <p className="text-gray-600 italic text-sm font-mono">No validation targets active.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {state.vulnerabilities.map((v) => (
                                <div key={v.id} className="bg-[#0d1117] p-3 rounded-lg border border-red-500/10 flex items-center justify-between group hover:border-red-500/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Shield size={14} className="text-red-400" />
                                        <div className="text-xs font-bold text-gray-300">{v.type}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-mono text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded uppercase font-bold">{v.severity}</span>
                                        <ChevronRight size={12} className="text-gray-600 group-hover:text-gray-400" />
                                    </div>
                                </div>
                            ))}
                            {state.performance.map((p) => (
                                <div key={p.id} className="bg-[#0d1117] p-3 rounded-lg border border-yellow-500/10 flex items-center justify-between group hover:border-yellow-500/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <Zap size={14} className="text-yellow-400" />
                                        <div className="text-xs font-bold text-gray-300">{p.component}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[9px] font-mono text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded uppercase font-bold">{p.currentValue}</span>
                                        <ChevronRight size={12} className="text-gray-600 group-hover:text-gray-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
       </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { Terminal, BrainCircuit, CheckCircle2 } from 'lucide-react';

interface ThoughtLogProps {
  logs: LogEntry[];
}

const ThoughtLog: React.FC<ThoughtLogProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      <div className="p-4 border-b border-[#30363d] flex justify-between items-center bg-[#161b22]">
        <div className="flex items-center gap-2">
          <Terminal size={18} className="text-gray-400" />
          <h2 className="text-sm font-bold text-gray-200">ORCHESTRATOR THOUGHT STREAM</h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-green-500">
           <BrainCircuit size={14} className="animate-pulse" />
           <span>REASONING ACTIVE</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm">
        {logs.length === 0 && (
            <div className="text-gray-600 italic text-center mt-20">
                Waiting for initialization...
            </div>
        )}
        {logs.map((log) => (
          <div key={log.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex-shrink-0 mt-0.5">
               {log.level === 'THOUGHT' && <BrainCircuit size={14} className="text-emerald-400" />}
               {log.level === 'INFO' && <div className="w-3.5 h-3.5 rounded-full border border-green-500/50 bg-green-500/10" />}
               {log.level === 'SUCCESS' && <CheckCircle2 size={14} className="text-green-500" />}
               {log.level === 'WARN' && <div className="w-3.5 h-3.5 rounded-full border border-yellow-500/50 bg-yellow-500/10" />}
            </div>
            <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${
                        log.level === 'THOUGHT' ? 'text-emerald-400' :
                        log.level === 'SUCCESS' ? 'text-green-400' :
                        log.level === 'WARN' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                        [{log.level}]
                    </span>
                    <span className="text-[10px] text-gray-600">{log.timestamp}</span>
                </div>
                <div className={`leading-relaxed ${
                    log.level === 'THOUGHT' ? 'text-gray-300 italic' : 'text-gray-200'
                }`}>
                    {log.message}
                </div>
                {log.level === 'THOUGHT' && (
                    <div className="h-px w-full bg-gradient-to-r from-emerald-500/20 to-transparent mt-2" />
                )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ThoughtLog;
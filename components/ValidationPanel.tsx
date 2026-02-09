import React from 'react';
import { Vulnerability } from '../types';
import { Globe, ShieldCheck, TerminalSquare, Bug, Check } from 'lucide-react';

interface ValidationPanelProps {
  vulnerabilities: Vulnerability[];
}

const ValidationPanel: React.FC<ValidationPanelProps> = ({ vulnerabilities }) => {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Browser Validation Loop</h2>
            <p className="text-gray-400 text-sm">Autonomous verification of security findings via simulated headless browsers.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-900/20 text-green-400 rounded-full text-xs font-mono border border-green-500/30">
              <Globe size={12} className="animate-pulse" />
              HEADLESS CLUSTER: ACTIVE
          </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {vulnerabilities.map((vuln) => (
            <div key={vuln.id} className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                {/* Header */}
                <div className="bg-[#0d1117] p-3 border-b border-[#30363d] flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Bug size={16} className="text-red-400" />
                        <span className="font-mono text-sm font-bold text-gray-300">{vuln.id}</span>
                        <span className="text-xs text-gray-500">|</span>
                        <span className="text-xs text-gray-300">{vuln.type}</span>
                    </div>
                    <div className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        vuln.status === 'VALIDATED' ? 'bg-green-900/20 text-green-400 border border-green-500/30' :
                        vuln.status === 'FALSE_POSITIVE' ? 'bg-gray-700 text-gray-400' :
                        'bg-green-900/20 text-green-400 border border-green-500/30'
                    }`}>
                        {vuln.status === 'OPEN' ? 'VALIDATING...' : vuln.status}
                    </div>
                </div>

                {/* Validation Console */}
                <div className="p-4 font-mono text-xs bg-[#000] text-gray-300 space-y-2">
                    <div className="flex gap-2">
                        <span className="text-green-500">$</span>
                        <span>targeting {vuln.location}...</span>
                    </div>
                    {vuln.validationEvidence ? (
                        <>
                            <div className="flex gap-2">
                                <span className="text-green-500">$</span>
                                <span className="text-yellow-300">inject_payload --target="{vuln.location}"</span>
                            </div>
                            <div className="pl-4 border-l border-gray-700 text-gray-400 py-1">
                                {vuln.validationEvidence}
                            </div>
                            <div className="flex gap-2 text-green-400 font-bold">
                                <Check size={14} />
                                <span>Exploit Verified. Criticality Confirmed.</span>
                            </div>
                        </>
                    ) : (
                        <div className="flex gap-2">
                            <span className="text-green-500">$</span>
                            <span className="animate-pulse">waiting for worker...</span>
                        </div>
                    )}
                </div>
            </div>
        ))}
        {vulnerabilities.length === 0 && (
             <div className="text-center py-20 border border-dashed border-gray-700 rounded-lg opacity-50">
                <TerminalSquare size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-500">No targets queued for validation.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ValidationPanel;
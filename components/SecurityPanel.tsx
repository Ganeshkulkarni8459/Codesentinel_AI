import React from 'react';
import { Vulnerability } from '../types';
import { ShieldAlert, AlertTriangle, CheckCircle, Lock } from 'lucide-react';

interface SecurityPanelProps {
  vulnerabilities: Vulnerability[];
}

const SecurityPanel: React.FC<SecurityPanelProps> = ({ vulnerabilities }) => {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Security Audit</h2>
          <p className="text-gray-400 text-sm">Real-time vulnerability detection and fix orchestration.</p>
        </div>
        <div className="flex gap-4">
            <div className="px-4 py-2 bg-red-900/20 border border-red-500/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-400">{vulnerabilities.filter(v => v.severity === 'CRITICAL').length}</div>
                <div className="text-xs text-red-300 uppercase tracking-wider">Critical</div>
            </div>
            <div className="px-4 py-2 bg-orange-900/20 border border-orange-500/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-400">{vulnerabilities.filter(v => v.severity === 'HIGH').length}</div>
                <div className="text-xs text-orange-300 uppercase tracking-wider">High</div>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        {vulnerabilities.length === 0 ? (
           <div className="text-center py-20 border border-dashed border-gray-700 rounded-lg">
             <ShieldAlert size={48} className="mx-auto text-gray-600 mb-4" />
             <p className="text-gray-500">No vulnerabilities detected yet (or scan pending).</p>
           </div>
        ) : (
            vulnerabilities.map((vuln) => (
            <div key={vuln.id} className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 hover:border-gray-500 transition-colors group">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        {vuln.severity === 'CRITICAL' ? <ShieldAlert className="text-red-500" /> : <AlertTriangle className="text-orange-400" />}
                        <h3 className="font-semibold text-gray-200">{vuln.type}</h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-gray-700 text-gray-400 bg-gray-800">
                            {vuln.id}
                        </span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                        vuln.status === 'FIXED' ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 
                        vuln.status === 'VALIDATED' ? 'bg-green-900/30 text-green-400 border border-green-500/30' :
                        'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                        {vuln.status}
                    </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{vuln.description}</p>
                <div className="flex items-center justify-between text-xs font-mono text-gray-500 bg-[#0d1117] p-2 rounded">
                    <span className="flex items-center gap-1">
                        <Lock size={12} /> {vuln.location}
                    </span>
                    <button className="text-green-400 hover:text-green-300 hover:underline">
                        View Fix Diff
                    </button>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default SecurityPanel;
import React from 'react';
import { GeneratedTest } from '../types';
import { TestTube, PlayCircle, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface TestsPanelProps {
  tests: GeneratedTest[];
}

const TestsPanel: React.FC<TestsPanelProps> = ({ tests }) => {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Test Generation & Validation</h2>
            <p className="text-gray-400 text-sm">Autonomous test creation to verify fixes and prevent regressions.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">
              <PlayCircle size={16} /> Run All Suites
          </button>
      </div>

      <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
            <thead className="bg-[#0d1117] text-gray-400 font-medium">
                <tr>
                    <th className="px-4 py-3 border-b border-[#30363d]">Status</th>
                    <th className="px-4 py-3 border-b border-[#30363d]">Test Name</th>
                    <th className="px-4 py-3 border-b border-[#30363d]">Type</th>
                    <th className="px-4 py-3 border-b border-[#30363d]">Target Coverage</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#30363d]">
                {tests.length === 0 ? (
                    <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                            No tests generated yet.
                        </td>
                    </tr>
                ) : (
                    tests.map((test) => (
                        <tr key={test.id} className="hover:bg-[#1f242c] transition-colors">
                            <td className="px-4 py-3">
                                {test.status === 'PASS' && <span className="flex items-center gap-1 text-green-400"><CheckCircle2 size={16} /> Pass</span>}
                                {test.status === 'FAIL' && <span className="flex items-center gap-1 text-red-400"><XCircle size={16} /> Fail</span>}
                                {test.status === 'PENDING' && <span className="flex items-center gap-1 text-yellow-400"><Loader2 size={16} className="animate-spin" /> Pending</span>}
                            </td>
                            <td className="px-4 py-3 font-mono text-gray-300">{test.name}</td>
                            <td className="px-4 py-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] bg-gray-800 border border-gray-700 text-gray-400">
                                    {test.type}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-gray-400">{test.coverageDelta}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestsPanel;
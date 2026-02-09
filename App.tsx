
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ReviewState, ReviewPhase, LogEntry, GeminiResponseSchema, User, RepoConfig, ThoughtSignature } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SecurityPanel from './components/SecurityPanel';
import PerformancePanel from './components/PerformancePanel';
import TestsPanel from './components/TestsPanel';
import ValidationPanel from './components/ValidationPanel';
import ThoughtLog from './components/ThoughtLog';
import LoginPage from './components/LoginPage';
import RepoSelector from './components/RepoSelector';
import { analyzeCodeBlock } from './services/geminiService';
import { DEMO_CODE } from './utils/mockData';
import { Play, Pause, Key, LogOut, Code, UserCircle, RotateCw, RefreshCcw, AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'codesentinel_session_v1';

const getInitialThoughtSignature = (): ThoughtSignature => ({
    sessionId: `SES-${Math.floor(Math.random() * 90000) + 10000}`,
    startTime: Date.now(),
    simulatedDuration: 0,
    repoMetadata: {},
    phasesCompleted: [],
    selfCorrections: [],
    decisions: [],
    nextPlannedAction: 'Initialize Deep Ingestion'
});

const getInitialState = (): ReviewState => ({
  repoName: 'NO TARGET',
  phase: ReviewPhase.IDLE,
  progress: 0,
  logs: [],
  thoughtSignature: getInitialThoughtSignature(),
  architecture: [],
  vulnerabilities: [],
  performance: [],
  tests: [],
  summary: '',
});

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [repoConfig, setRepoConfig] = useState<RepoConfig | null>(null);
  const [state, setState] = useState<ReviewState>(getInitialState);
  const [activeTab, setActiveTab] = useState('overview');
  const [apiKey, setApiKey] = useState(process.env.API_KEY || '');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [isMarathonRunning, setIsMarathonRunning] = useState(false);
  
  const processingRef = useRef(false);
  const isMounted = useRef(false);

  // Load Session
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.user) setUser(parsed.user);
            if (parsed.repoConfig) setRepoConfig(parsed.repoConfig);
            if (parsed.state) setState(parsed.state);
        } catch (e) {
            console.error("Failed to restore session", e);
        }
    }
    isMounted.current = true;
  }, []);

  // Save Session
  useEffect(() => {
    if (!isMounted.current) return;
    const sessionData = { user, repoConfig, state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
  }, [user, repoConfig, state]);

  const addLog = useCallback((message: string, level: LogEntry['level'] = 'INFO') => {
    setState(prev => ({
      ...prev,
      logs: [...prev.logs, {
        id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toLocaleTimeString(),
        level,
        message
      }].slice(-100) // Keep last 100 logs
    }));
  }, []);

  const runAutonomousStep = useCallback(async () => {
      const currentApiKey = apiKey || process.env.API_KEY;
      if (!currentApiKey) {
          addLog("API Key missing. Orchestration paused.", 'ERROR');
          setIsMarathonRunning(false);
          setShowApiKeyModal(true);
          return;
      }

      if (processingRef.current || !isMarathonRunning) return;
      processingRef.current = true;

      const currentPhase = state.phase;
      addLog(`Commencing ${currentPhase}...`, 'INFO');
      
      try {
          const result: GeminiResponseSchema = await analyzeCodeBlock(DEMO_CODE, currentPhase, currentApiKey);
          
          setState(prev => {
              const newState = { ...prev };
              
              if (result.findings?.architecture?.length) {
                  newState.architecture = [...prev.architecture, ...result.findings.architecture.filter(a => !prev.architecture.find(pa => pa.name === a.name))];
              }
              
              if (result.findings?.vulnerabilities?.length) {
                  if (currentPhase === ReviewPhase.VALIDATION) {
                      newState.vulnerabilities = prev.vulnerabilities.map(v => {
                          const update = result.findings?.vulnerabilities?.find(nv => nv.id === v.id);
                          return update ? { ...v, ...update } : v;
                      });
                  } else {
                      const uniqueVulns = result.findings.vulnerabilities.filter(v => !prev.vulnerabilities.find(pv => pv.id === v.id));
                      newState.vulnerabilities = [...prev.vulnerabilities, ...uniqueVulns];
                  }
              }

              if (result.findings?.performance?.length) {
                  const uniquePerf = result.findings.performance.filter(p => !prev.performance.find(pp => pp.id === p.id));
                  newState.performance = [...prev.performance, ...uniquePerf];
              }

              if (result.findings?.tests?.length) {
                  const uniqueTests = result.findings.tests.filter(t => !prev.tests.find(pt => pt.id === t.id));
                  newState.tests = [...prev.tests, ...uniqueTests];
              }

              if (result.summary) newState.summary = result.summary;

              const sigUpdate = result.thoughtSignatureUpdate || {};
              newState.thoughtSignature = {
                  ...prev.thoughtSignature,
                  simulatedDuration: prev.thoughtSignature.simulatedDuration + (sigUpdate.simulatedDuration || 45),
                  nextPlannedAction: sigUpdate.nextPlannedAction || prev.thoughtSignature.nextPlannedAction,
                  decisions: [...prev.thoughtSignature.decisions, ...(sigUpdate.decisions || [{
                      id: `DEC-${Date.now()}`,
                      timestamp: new Date().toLocaleTimeString(),
                      action: `Completed ${currentPhase}`,
                      justification: result.thoughtProcess?.substring(0, 100) + "...",
                      outcome: 'Success'
                  }])].slice(-20)
              };

              return newState;
          });

          if (result.thoughtProcess) {
              addLog(result.thoughtProcess, 'THOUGHT');
          }

          // Sequential Phase Transitions
          let nextPhase: ReviewPhase | null = null;
          switch (currentPhase) {
              case ReviewPhase.INIT: nextPhase = ReviewPhase.UNDERSTANDING; break;
              case ReviewPhase.UNDERSTANDING: nextPhase = ReviewPhase.ANALYSIS; break;
              case ReviewPhase.ANALYSIS: nextPhase = ReviewPhase.VALIDATION; break;
              case ReviewPhase.VALIDATION: nextPhase = ReviewPhase.BENCHMARK; break;
              case ReviewPhase.BENCHMARK: nextPhase = ReviewPhase.TESTING; break;
              case ReviewPhase.TESTING: nextPhase = ReviewPhase.REPORTING; break;
              case ReviewPhase.REPORTING: nextPhase = ReviewPhase.COMPLETE; break;
              default: nextPhase = null;
          }
          
          if (nextPhase && isMarathonRunning) {
              setTimeout(() => {
                  processingRef.current = false;
                  setState(prev => ({ ...prev, phase: nextPhase! }));
              }, 2500); // 2.5s simulated breather between phases
          } else {
              processingRef.current = false;
              if (nextPhase === ReviewPhase.COMPLETE) {
                setIsMarathonRunning(false);
                addLog("Mission Objective Achieved. Full Codebase Orchestration Complete.", 'SUCCESS');
              }
          }
      } catch (err) {
          console.error("Step Execution Failed", err);
          addLog("Agent encountered a runtime exception. Retrying current phase...", 'WARN');
          processingRef.current = false;
      }
  }, [apiKey, isMarathonRunning, state.phase, addLog]);

  useEffect(() => {
      if (isMarathonRunning && state.phase !== ReviewPhase.IDLE && state.phase !== ReviewPhase.COMPLETE) {
          runAutonomousStep();
      }
  }, [isMarathonRunning, state.phase]);

  const handleLogin = (userData: User) => {
    setUser(userData);
    if (!apiKey && !process.env.API_KEY) setShowApiKeyModal(true);
  };

  const handleRepoSelect = (config: RepoConfig) => {
    setRepoConfig(config);
    setState(prev => ({
        ...prev,
        repoName: config.name,
        phase: ReviewPhase.INIT,
        thoughtSignature: getInitialThoughtSignature(),
        logs: [{
            id: 'init-1',
            timestamp: new Date().toLocaleTimeString(),
            level: 'SUCCESS',
            message: `Neural Link Established: ${config.name} ingested.`
        }]
    }));
  };

  const handleLogout = () => {
    setUser(null);
    setRepoConfig(null);
    setState(getInitialState());
    setIsMarathonRunning(false);
    localStorage.removeItem(STORAGE_KEY);
  };

  const startMarathon = () => {
    const effectiveKey = apiKey || process.env.API_KEY;
    if (!effectiveKey) {
      setShowApiKeyModal(true);
      return;
    }
    
    setIsMarathonRunning(true);
    // If we're at the start or finish, reset to INIT
    if (state.phase === ReviewPhase.IDLE || state.phase === ReviewPhase.COMPLETE) {
        setState(prev => ({ ...prev, phase: ReviewPhase.INIT }));
    } else {
        // Just trigger the effect by ensuring phase is "current"
        runAutonomousStep();
    }
  };

  const resetSession = () => {
    if (window.confirm("Hard Reset of CodeSentinel Orchestration?")) {
        setState(prev => ({
            ...getInitialState(),
            repoName: repoConfig?.name || 'NO TARGET',
        }));
        setIsMarathonRunning(false);
        processingRef.current = false;
    }
  };

  if (!user) return <LoginPage onLogin={handleLogin} />;
  
  if (!repoConfig) return (
    <>
        <RepoSelector onSelect={handleRepoSelect} onLogout={handleLogout} />
        {showApiKeyModal && <ApiKeyModal apiKey={apiKey} setApiKey={setApiKey} onClose={() => setShowApiKeyModal(false)} />}
    </>
  );

  return (
    <div className="flex h-screen bg-[#0d1117] text-white overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} phase={state.phase} duration={state.thoughtSignature.simulatedDuration} />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[#30363d] bg-[#0d1117]/80 backdrop-blur-md flex items-center justify-between px-6 z-10 sticky top-0">
           <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 text-sm">
                    <Code size={16} className="text-green-500" />
                    <span className="font-bold text-gray-200 tracking-tight">{state.repoName}</span>
                    <span className="bg-[#1f242c] px-2 py-0.5 rounded text-[9px] border border-gray-700 font-bold uppercase text-gray-400">{repoConfig.type}</span>
               </div>
               <div className="h-4 w-px bg-gray-800"></div>
               <div className="text-[10px] text-green-400 font-mono flex items-center gap-2">
                   <span className="opacity-40">SESSION_ID:</span>
                   <span className="bg-green-500/10 px-1.5 py-0.5 rounded">{state.thoughtSignature.sessionId}</span>
               </div>
           </div>
           
           <div className="flex items-center gap-3">
             <button onClick={resetSession} className="p-2 text-gray-500 hover:text-yellow-400 transition-colors" title="Reset Session">
                 <RefreshCcw size={16} />
             </button>

             {(!isMarathonRunning || state.phase === ReviewPhase.COMPLETE) ? (
                 <button 
                     onClick={startMarathon}
                     className="flex items-center gap-2 px-6 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-md font-bold text-sm shadow-xl active:scale-95 transition-all"
                 >
                     <Play size={16} fill="currentColor" /> {state.phase === ReviewPhase.COMPLETE ? 'Restart Suite' : 'Begin Analysis'}
                 </button>
             ) : (
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMarathonRunning(false)} className="bg-red-900/20 text-red-400 p-2 rounded hover:bg-red-900/40 border border-red-500/30 transition-colors">
                        <Pause size={16} fill="currentColor" />
                    </button>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-[#1f242c] rounded-md border border-green-500/30">
                        <RotateCw size={16} className="animate-spin text-green-400" />
                        <span className="text-xs text-green-400 font-bold uppercase tracking-widest animate-pulse">Orchestrating...</span>
                    </div>
                </div>
             )}
             
             <button onClick={handleLogout} className="text-gray-500 hover:text-red-400 p-2 transition-colors ml-2">
                 <LogOut size={16} />
             </button>
           </div>
        </header>

        <main className="flex-1 overflow-hidden flex relative">
           <div className={`flex-1 overflow-hidden transition-all duration-500 ${activeTab === 'thoughts' ? 'w-1/2' : 'w-full'}`}>
             {activeTab === 'overview' && <Dashboard state={state} />}
             {activeTab === 'validation' && <ValidationPanel vulnerabilities={state.vulnerabilities} />}
             {activeTab === 'security' && <SecurityPanel vulnerabilities={state.vulnerabilities} />}
             {activeTab === 'performance' && <PerformancePanel issues={state.performance} />}
             {activeTab === 'tests' && <TestsPanel tests={state.tests} />}
             {activeTab === 'thoughts' && (
                 <div className="h-full bg-[#0d1117]">
                    <ThoughtLog logs={state.logs} />
                 </div>
             )}
           </div>
           
           {activeTab !== 'thoughts' && (
               <div className="hidden xl:block w-[400px] border-l border-[#30363d] bg-[#0d1117] shadow-2xl">
                    <ThoughtLog logs={state.logs} />
               </div>
           )}
        </main>
      </div>

      {showApiKeyModal && <ApiKeyModal apiKey={apiKey} setApiKey={setApiKey} onClose={() => setShowApiKeyModal(false)} />}
    </div>
  );
}

const ApiKeyModal = ({ apiKey, setApiKey, onClose }: { apiKey: string, setApiKey: (k: string) => void, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-[100] p-4">
      <div className="bg-[#161b22] border border-[#30363d] p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-green-900/20 rounded-xl border border-green-500/20">
            <Key className="text-green-400" size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Gemini 3 Authentication</h2>
        </div>
        
        <p className="text-gray-400 text-sm mb-6">Enter your API key to enable the CodeSentinel marathon agent. High-tier reasoning requires valid credits.</p>

        <input 
            type="password" 
            placeholder="API Key"
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-white mb-6 font-mono text-sm outline-none focus:ring-2 focus:ring-green-500 transition-all"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
        />
        
        <div className="flex gap-3">
             <button 
                onClick={onClose}
                className="flex-1 bg-transparent hover:bg-gray-800 text-gray-400 py-3 rounded-lg font-bold transition-all border border-[#30363d]"
            >
                Cancel
            </button>
            <button 
                onClick={() => apiKey && onClose()}
                className="flex-[2] bg-[#238636] hover:bg-[#2ea043] text-white py-3 rounded-lg font-bold transition-all shadow-lg shadow-green-900/20"
            >
                Initialize Agent
            </button>
        </div>
      </div>
    </div>
);

export enum ReviewPhase {
  IDLE = 'IDLE',
  INIT = 'PHASE 1: SESSION INITIALIZATION',
  UNDERSTANDING = 'PHASE 2: DEEP REPO UNDERSTANDING',
  ANALYSIS = 'PHASE 3: SECURITY & LOGIC ANALYSIS',
  VALIDATION = 'PHASE 4: BROWSER VALIDATION LOOP',
  BENCHMARK = 'PHASE 5: PERFORMANCE BENCHMARKING',
  TESTING = 'PHASE 6: TEST GENERATION & EXECUTION',
  REPORTING = 'PHASE 7: COMPREHENSIVE REPORTING',
  COMPLETE = 'MISSION COMPLETE'
}

export interface User {
  name: string;
  role: string;
  isAuthenticated: boolean;
}

export interface RepoConfig {
  type: 'GITHUB' | 'ZIP';
  name: string;
  url?: string;
  files?: number;
}

export interface Vulnerability {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  confidence: 'CONFIRMED' | 'HIGH' | 'MEDIUM' | 'LOW';
  type: string;
  location: string;
  description: string;
  exploitability: string; // "PROVEN", "THEORETICAL"
  validationEvidence?: string;
  status: 'OPEN' | 'VALIDATED' | 'FALSE_POSITIVE' | 'FIXED';
}

export interface PerformanceIssue {
  id: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  component: string;
  metric: string;
  currentValue: string;
  optimizedValue: string;
  suggestion: string;
}

export interface GeneratedTest {
  id: string;
  name: string;
  type: 'UNIT' | 'INTEGRATION' | 'E2E';
  status: 'PASS' | 'FAIL' | 'PENDING';
  codeSnippet?: string;
  coverageDelta: string; // e.g., "+5%"
}

export interface ArchitectureNode {
  name: string;
  type: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  details?: string;
}

export interface SelfCorrection {
  id: string;
  timestamp: string;
  originalFindingId: string;
  previousSeverity: string;
  newSeverity: string;
  reason: string;
}

export interface AutonomousDecision {
  id: string;
  timestamp: string;
  action: string;
  justification: string;
  outcome: string;
}

export interface ThoughtSignature {
  sessionId: string;
  startTime: number;
  simulatedDuration: number; // in minutes
  repoMetadata: any;
  phasesCompleted: string[];
  selfCorrections: SelfCorrection[];
  decisions: AutonomousDecision[];
  nextPlannedAction: string;
}

export interface ReviewState {
  repoName: string;
  phase: ReviewPhase;
  progress: number; // 0-100
  logs: LogEntry[];
  thoughtSignature: ThoughtSignature;
  architecture: ArchitectureNode[];
  vulnerabilities: Vulnerability[];
  performance: PerformanceIssue[];
  tests: GeneratedTest[];
  summary: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'THOUGHT' | 'VALIDATION';
  message: string;
  phase?: ReviewPhase;
}

export interface GeminiResponseSchema {
  thoughtProcess: string;
  thoughtSignatureUpdate?: Partial<ThoughtSignature>;
  findings?: {
    vulnerabilities?: Vulnerability[];
    performance?: PerformanceIssue[];
    architecture?: ArchitectureNode[];
    tests?: GeneratedTest[];
  };
  summary?: string;
  nextPhase?: ReviewPhase;
}

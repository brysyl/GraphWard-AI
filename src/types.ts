export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface Repository {
  id: string;
  name: string;
  repoUrl: string;
  loc: number;
  branch: string;
  primaryLang: string;
  healthScore: number;
  astNodeCount: number;
  criticalCves: number;
  highCves: number;
  mediumCves: number;
  verifiedPRs: number;
}

export type ASTNodeType = 'module' | 'class' | 'function' | 'import' | 'scope' | 'hotspot' | 'test';

export interface ASTNode {
  id: string;
  label: string;
  type: ASTNodeType;
  file: string;
  loc: number;
  lineStart: number;
  lineEnd: number;
  complexity: number;
  infected: boolean;
  cveId?: string;
  cveTitle?: string;
  cveSeverity?: Severity;
  cwe?: string;
  taintedVars?: string[];
  callDependencies?: string[];
  incomingCalls?: string[];
  astDepth: number; // 1 to 5
  x?: number;
  y?: number;
}

export interface ASTEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'call' | 'imports' | 'taint' | 'dataflow';
  isVulnerablePath?: boolean;
}

export interface CVERecord {
  id: string;
  title: string;
  severity: Severity;
  cwe: string;
  file: string;
  line: number;
  scanner: 'Semgrep' | 'SonarQube' | 'Bandit' | 'Snyk' | 'Custom AST';
  status: 'REMEDIATED' | 'AUTO_PATCHING' | 'QUEUED' | 'FLAGGED';
  fixIteration: number;
  prId?: string;
  mttrMinutes: number;
  description: string;
  exploitRisk: string;
  discoveredAt: string;
  remediatedAt?: string;
}

export interface PRDiff {
  id: string;
  prNumber: number;
  title: string;
  cveId: string;
  branch: string;
  file: string;
  language: string;
  originalCode: string;
  patchedCode: string;
  originalASTSummary: string;
  patchedASTSummary: string;
  linterStatus: 'PASSED' | 'FAILED';
  linterDetails: string;
  sastStatus: 'CLEARED' | 'FLAGGED';
  sastScanner: string;
  unitTestsTotal: number;
  unitTestsPassed: number;
  coveragePercent: number;
  merged: boolean;
  mergeSha?: string;
  iterationsCount: number;
  author: string;
  createdAt: string;
}

export interface RCLILog {
  id: string;
  timestamp: string;
  level: 'STEP' | 'INFO' | 'WARN' | 'RESULT' | 'REMEDIATION' | 'SUCCESS' | 'ERROR';
  stepNumber?: number;
  message: string;
  subtext?: string;
  codeSnippet?: string;
}

export interface MCPServer {
  id: string;
  name: string;
  status: 'CONNECTED' | 'STANDBY' | 'OFFLINE';
  version: string;
  endpoint: string;
  type: 'SAST' | 'Linter' | 'AST_Parser' | 'Test_Runner';
  rulesCount: number;
  latencyMs: number;
}

export interface EnterpriseSettings {
  isAirGapped: boolean;
  vllmModel: string;
  vramAllocGB: number;
  contextWindow: number;
  sandboxType: 'gVisor Container' | 'Firecracker MicroVM' | 'WASM Isolated Engine';
  mcpServers: MCPServer[];
  autoMergeThreshold: number;
  strictNoRegression: boolean;
  enforceConstantTimeVerification: boolean;
  logRetentionDays: number;
  telemetryVPC: string;
}

export interface ExecutiveMetrics {
  technicalDebtBaselineUSD: number;
  technicalDebtRemediatedUSD: number;
  activeCves: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  mttrBaselineDays: number;
  mttrCurrentMinutes: number;
  zeroBreakagePassRate: number;
  totalVerificationsRun: number;
  regressionsCount: number;
  totalLocAnalyzed: number;
  prsMergedAutonomous: number;
}

export interface PoCReportData {
  companyName: string;
  reportTitle: string;
  evaluationWindow: string;
  generatedDate: string;
  totalTechnicalDebtRemediatedUSD: number;
  costReductionPercentage: number;
  mttrReductionHours: number;
  engineeringHoursSaved: number;
  topRemediatedRisks: CVERecord[];
  testRegressionsCount: number;
  complianceCertifications: string[];
}

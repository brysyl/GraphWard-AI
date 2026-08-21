import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Trash2, 
  Cpu, 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  GitPullRequest,
  Zap,
  Server,
  Code
} from 'lucide-react';
import { RCLILog, Repository } from '../types';
import { mockInitialRCLILogs } from '../data/mockData';

interface RCLITerminalModuleProps {
  selectedRepo: Repository;
  onNavigateToTab: (tab: 'dashboard' | 'ast-graph' | 'r-cli' | 'pr-diff' | 'airgap-settings') => void;
  activeCveTarget?: string;
}

export const RCLITerminalModule: React.FC<RCLITerminalModuleProps> = ({
  selectedRepo,
  onNavigateToTab,
  activeCveTarget = 'CVE-2026-3182',
}) => {
  const [logs, setLogs] = useState<RCLILog[]>(mockInitialRCLILogs);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [commandInput, setCommandInput] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentStep, setCurrentStep] = useState<number>(7);
  const [vllmTokensSec, setVllmTokensSec] = useState<number>(128);

  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal to bottom on new logs
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      if (isExecuting) {
        setVllmTokensSec(prev => Math.floor(120 + Math.random() * 24));
      }
    }, 1200);
    return () => clearInterval(interval);
  }, [isExecuting]);

  const addLog = (log: Omit<RCLILog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
    const newLog: RCLILog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
    };
    setLogs(prev => [...prev, newLog]);
  };

  // Run full closed-loop remediation execution sequence
  const runAutonomousAuditSequence = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setIsPaused(false);
    setCurrentStep(1);

    addLog({
      level: 'INFO',
      message: `[HARNESS INIT] Triggering GraphWard R-CLI Closed-Loop Remediation Engine on target repo: ${selectedRepo.name}`,
      subtext: 'Air-Gapped Private VPC Mode: ENABLED | Engine: vLLM (Qwen-Coder-32B Local) | gVisor Sandbox: ISOLATED',
    });

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    await sleep(800);
    setCurrentStep(1);
    addLog({
      level: 'STEP',
      stepNumber: 1,
      message: `Ingesting Repository AST Graph... (${selectedRepo.astNodeCount} files processed in 388ms)`,
      subtext: `Target: ${selectedRepo.loc.toLocaleString()} LOC | Constructing acyclic call hierarchies & control flow trees`,
    });

    await sleep(1000);
    setCurrentStep(2);
    addLog({
      level: 'WARN',
      stepNumber: 2,
      message: `Detected ${activeCveTarget} in services/auth_service.py (Line 84: Insecure Algorithm Negotiation)`,
      subtext: 'CWE-347 | Severity: CRITICAL | AST Path: OAuthV2Router -> validate_jwt_signature -> header.alg check',
    });

    await sleep(1200);
    setCurrentStep(3);
    addLog({
      level: 'STEP',
      stepNumber: 3,
      message: 'GraphWard LLM generating precision AST diff with strict type bounds and no regressions...',
      subtext: 'Synthesizing constant-time comparison (hmac.compare_digest) & explicit algorithm whitelist set',
    });

    await sleep(1400);
    setCurrentStep(4);
    addLog({
      level: 'RESULT',
      stepNumber: 4,
      message: 'Executing local sandboxed pytest suite in gVisor container (Iteration 1)...',
      subtext: '141 passed, 1 failed in 1.94s: AssertionError in test_jwt_empty_header [test_jwt_auth_matrix.py:84]',
      codeSnippet: 'FAILED test_jwt_empty_header: AssertionError: expected SecurityException on empty alg, received KeyError',
    });

    await sleep(1200);
    setCurrentStep(5);
    addLog({
      level: 'REMEDIATION',
      stepNumber: 5,
      message: 'Self-correcting AST patch (Iteration 2): Added defensive None check for empty alg header...',
      subtext: 'R-CLI auto-feedback loop engaged | Updating patch delta and re-compiling AST trees',
    });

    await sleep(1400);
    setCurrentStep(6);
    addLog({
      level: 'SUCCESS',
      stepNumber: 6,
      message: 'All 142 unit tests passed cleanly (0 regressions, 100% test integrity, 99.4% branch coverage).',
      subtext: 'Pytest: 142/142 PASSED (1.82s) | Semgrep SAST Scan: 0 vulnerabilities remaining (CLEARED)',
    });

    await sleep(900);
    setCurrentStep(7);
    addLog({
      level: 'SUCCESS',
      stepNumber: 7,
      message: 'PR #482 submitted for automated merge: graphward/patch-cve-2026-3182-autofix',
      subtext: 'Cryptographically signed with Sovereign Air-Gap Hardware Key (SHA-256: 4f8a29e...)',
    });

    setIsExecuting(false);
  };

  // Handle Command Line Execution
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = commandInput.trim();
    if (!cmd) return;

    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setCommandInput('');

    addLog({
      level: 'INFO',
      message: `$ graphward ${cmd.replace(/^graphward\s*/, '')}`,
    });

    const parsed = cmd.toLowerCase().trim();

    if (parsed === 'clear') {
      setLogs([]);
      return;
    }

    if (parsed === 'help') {
      addLog({
        level: 'INFO',
        message: `GraphWard R-CLI Commands Available:
  • audit                  - Run full repository AST deep scan & vulnerability detection
  • fix <CVE_ID>           - Trigger precision AST self-correction loop for target CVE
  • test --sandbox         - Execute sandboxed pytest / test harness inside gVisor container
  • ast --dump <file>      - Dump AST syntax tree & cyclomatic complexity
  • status                 - Display telemetry, VPC state, and active AST node counts
  • diff                   - Switch to PR & Diff Inspection Studio
  • clear                  - Clear terminal emulator output`,
      });
      return;
    }

    if (parsed.startsWith('audit') || parsed.startsWith('graphward audit')) {
      runAutonomousAuditSequence();
      return;
    }

    if (parsed.startsWith('fix') || parsed.startsWith('graphward fix')) {
      runAutonomousAuditSequence();
      return;
    }

    if (parsed === 'status' || parsed === 'graphward status') {
      addLog({
        level: 'SUCCESS',
        message: `GraphWard Enterprise Status:
  • Repository: ${selectedRepo.name} (${selectedRepo.loc.toLocaleString()} LOC)
  • Active AST Nodes: ${selectedRepo.astNodeCount} | Flagged Hotspots: ${selectedRepo.criticalCves + selectedRepo.highCves}
  • VPC Mode: Air-Gapped Sovereign (10.240.0.0/16)
  • Local Engine: vLLM Qwen-Coder-32B (${vllmTokensSec} tokens/sec)
  • Zero-Breakage Rate: 100% (0 regressions recorded)`,
      });
      return;
    }

    if (parsed === 'diff' || parsed === 'graphward diff') {
      onNavigateToTab('pr-diff');
      return;
    }

    if (parsed.includes('test')) {
      addLog({
        level: 'SUCCESS',
        message: 'Sandboxed Test Runner: 142/142 tests PASSED in 1.84s (0 regressions, 0 breaking changes).',
      });
      return;
    }

    if (parsed.includes('ast')) {
      addLog({
        level: 'INFO',
        message: 'AST Tree Dump: ModuleDef(auth_service.py) -> FuncDef(validate_jwt_signature) -> Call(hmac.compare_digest) [CLEAN]',
      });
      return;
    }

    // Default unknown command
    addLog({
      level: 'WARN',
      message: `Unrecognized command '${cmd}'. Type 'help' for available GraphWard R-CLI commands.`,
    });
  };

  // Export logs to downloadable file
  const handleExportLogs = () => {
    const logContent = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message} ${l.subtext ? `\n  >> ${l.subtext}` : ''}`).join('\n\n');
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GraphWard_RCLI_Execution_${Date.now()}.log`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Harness Control Ribbon */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <Terminal className="h-4 w-4 text-sky-400" />
            <span className="font-mono text-xs font-semibold text-slate-200">
              GraphWard R-CLI Execution Harness (Closed-Loop Engine)
            </span>
          </div>

          <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 text-[10px] font-mono">
            Step {currentStep} of 7 Complete
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="rcli-btn-run-audit"
            onClick={runAutonomousAuditSequence}
            disabled={isExecuting}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-semibold transition ${
              isExecuting
                ? 'bg-amber-950/60 border border-amber-600 text-amber-300 cursor-wait'
                : 'bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-950/40'
            }`}
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Run Autonomous Audit</span>
          </button>

          <button
            id="rcli-btn-self-correct"
            onClick={runAutonomousAuditSequence}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-mono text-xs transition"
            title="Simulate AST Test Failure & Auto-Correction"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Simulate Self-Correction Loop</span>
          </button>

          <button
            id="rcli-btn-export-log"
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs transition"
            title="Download full R-CLI execution log"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden md:inline">Export Log</span>
          </button>

          <button
            id="rcli-btn-clear"
            onClick={() => setLogs([])}
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Clear terminal"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Terminal Screen (8 Cols) */}
        <div className="lg:col-span-8 bg-[#050914] border border-slate-800 rounded-lg flex flex-col h-[620px] shadow-2xl overflow-hidden font-mono text-xs">
          {/* Terminal Window Header Bar */}
          <div className="bg-[#0b1329] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-[11px] text-slate-400 ml-2">
                graphward-rcli@sovereign-vpc (~/{selectedRepo.name})
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-emerald-400">
                gVisor Sandbox: ACTIVE
              </span>
              <span>vLLM: {vllmTokensSec} t/s</span>
            </div>
          </div>

          {/* Terminal Output Stream */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 select-text">
            {logs.map((log) => {
              const isStep = log.level === 'STEP';
              const isWarn = log.level === 'WARN';
              const isResult = log.level === 'RESULT';
              const isRemediation = log.level === 'REMEDIATION';
              const isSuccess = log.level === 'SUCCESS';
              const isError = log.level === 'ERROR';

              return (
                <div key={log.id} className="space-y-1 group">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 text-[10px] select-none pt-0.5">
                      [{log.timestamp}]
                    </span>

                    <div className="flex-1">
                      {/* Step Tag */}
                      {log.stepNumber && (
                        <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold mr-2 uppercase ${
                          isStep ? 'bg-sky-950 text-sky-400 border border-sky-800' :
                          isWarn ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                          isResult ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          isRemediation ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                          'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        }`}>
                          [STEP {log.stepNumber}]
                        </span>
                      )}

                      {/* Main Message */}
                      <span className={`font-mono ${
                        isWarn ? 'text-rose-300 font-semibold' :
                        isResult ? 'text-amber-300' :
                        isRemediation ? 'text-purple-300 font-semibold' :
                        isSuccess ? 'text-emerald-300 font-semibold' :
                        isStep ? 'text-sky-200 font-medium' :
                        'text-slate-300'
                      }`}>
                        {log.message}
                      </span>

                      {/* Subtext info */}
                      {log.subtext && (
                        <div className="text-[11px] text-slate-400 pl-4 border-l border-slate-800 mt-0.5 font-sans">
                          ↳ {log.subtext}
                        </div>
                      )}

                      {/* Code Snippet if any */}
                      {log.codeSnippet && (
                        <div className="mt-1.5 p-2 rounded bg-rose-950/30 border border-rose-900/60 text-rose-300 text-[11px] font-mono">
                          {log.codeSnippet}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Interactive Command Prompt Line */}
          <form onSubmit={handleCommandSubmit} className="p-3 bg-[#080e1e] border-t border-slate-800 flex items-center gap-2">
            <span className="text-sky-400 font-bold select-none text-xs">
              graphward-rcli❯
            </span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Type command (e.g. 'audit', 'fix CVE-2026-3182', 'test', 'help')..."
              className="flex-1 bg-transparent border-none text-slate-100 placeholder-slate-600 focus:outline-none font-mono text-xs"
              autoFocus
            />
            <button
              type="submit"
              className="px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-[11px] transition"
            >
              Exec
            </button>
          </form>
        </div>

        {/* Real-time Telemetry & Execution Harness State (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Closed-Loop State Card */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 uppercase text-[10px] font-semibold">
                Autonomous Loop Telemetry
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px]">
                PASS RATE 100%
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>AST Parser Engine:</span>
                <span className="text-sky-400 font-semibold">Tree-Sitter v0.22 (Cython)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>vLLM Model:</span>
                <span className="text-slate-100 font-semibold">Qwen-Coder-32B-AWQ</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>VRAM Allocation:</span>
                <span className="text-slate-100">38.4 GB / 48.0 GB (80%)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Token Generation Speed:</span>
                <span className="text-sky-400 font-semibold">{vllmTokensSec} tokens/sec</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Sandbox Isolation:</span>
                <span className="text-emerald-400 font-semibold">gVisor Container (Rootless)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>SAST Linter Latency:</span>
                <span className="text-slate-100">12ms (Semgrep Enterprise)</span>
              </div>
            </div>

            <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">
                Self-Correction Policy
              </div>
              <p className="text-slate-300 text-[11px] font-sans">
                GraphWard requires 0 test breakages. If a test assertion fails, the R-CLI automatically feeds the traceback into the AST synthesis module until all 142 tests pass cleanly.
              </p>
            </div>

            <button
              id="rcli-btn-open-diff"
              onClick={() => onNavigateToTab('pr-diff')}
              className="w-full py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex items-center justify-center gap-2 transition"
            >
              <GitPullRequest className="h-4 w-4" />
              <span>Inspect PR #482 Diff Patch</span>
            </button>
          </div>

          {/* Quick Command Cheat Sheet */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2 font-mono text-xs">
            <span className="text-slate-400 uppercase text-[10px] font-semibold block">
              Quick R-CLI Triggers
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div 
                onClick={() => setCommandInput('audit')}
                className="p-2 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 cursor-pointer flex justify-between items-center transition"
              >
                <code className="text-sky-300">graphward audit</code>
                <span className="text-slate-500 text-[10px]">Deep AST scan</span>
              </div>
              <div 
                onClick={() => setCommandInput('fix CVE-2026-3182')}
                className="p-2 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 cursor-pointer flex justify-between items-center transition"
              >
                <code className="text-purple-300">graphward fix CVE-2026-3182</code>
                <span className="text-slate-500 text-[10px]">Auto-remediate</span>
              </div>
              <div 
                onClick={() => setCommandInput('test --sandbox')}
                className="p-2 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 cursor-pointer flex justify-between items-center transition"
              >
                <code className="text-emerald-300">graphward test --sandbox</code>
                <span className="text-slate-500 text-[10px]">Run 142 tests</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

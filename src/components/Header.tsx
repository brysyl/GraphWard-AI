import React from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  GitPullRequest, 
  Settings2, 
  BarChart3, 
  Share2, 
  Play, 
  RefreshCw, 
  FileText,
  Lock,
  ChevronDown,
  Database
} from 'lucide-react';
import { Repository } from '../types';

interface HeaderProps {
  activeTab: 'dashboard' | 'ast-graph' | 'r-cli' | 'pr-diff' | 'airgap-settings';
  setActiveTab: (tab: 'dashboard' | 'ast-graph' | 'r-cli' | 'pr-diff' | 'airgap-settings') => void;
  repositories: Repository[];
  selectedRepo: Repository;
  setSelectedRepo: (repo: Repository) => void;
  onTriggerAudit: () => void;
  onTriggerRefactor: () => void;
  onOpenPoCModal: () => void;
  isAuditRunning: boolean;
  isAirGapped: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  repositories,
  selectedRepo,
  setSelectedRepo,
  onTriggerAudit,
  onTriggerRefactor,
  onOpenPoCModal,
  isAuditRunning,
  isAirGapped,
}) => {
  return (
    <header className="border-b border-slate-800 bg-[#080d1a]/95 backdrop-blur sticky top-0 z-40">
      {/* Sovereign Institutional Top Status Bar */}
      <div className="px-4 lg:px-6 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono font-bold shadow-sm shadow-sky-500/20">
              <ShieldCheck className="h-4 w-4 text-sky-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-slate-100 tracking-wide font-mono text-sm">
                GraphWard<span className="text-sky-400">.AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-tighter">
                DEEP AST REMEDIATION & R-CLI HARNESS
              </span>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Quick Status Indicators */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Air-Gapped Private VPC Indicator */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
              isAirGapped 
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
                : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            }`}>
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isAirGapped ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isAirGapped ? 'bg-emerald-500' : 'bg-amber-500'
                }`} />
              </span>
              <Lock className="h-3 w-3" />
              <span className="font-mono text-[11px] font-medium">
                Air-Gapped Private VPC: {isAirGapped ? 'ONLINE' : 'RESTRICTED'}
              </span>
            </div>

            {/* vLLM Engine */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-sky-300">
              <Cpu className="h-3 w-3 text-sky-400" />
              <span className="font-mono text-[11px]">vLLM Engine: Ready (Qwen-32B)</span>
            </div>

            {/* Active AST Nodes */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <Share2 className="h-3 w-3 text-slate-400" />
              <span className="font-mono text-[11px]">Active AST Nodes: <strong className="text-slate-100 font-semibold">{selectedRepo.astNodeCount.toLocaleString()}</strong></span>
            </div>

            {/* Zero Breakage */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/30 border border-emerald-900/50 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-[11px]">Zero-Breakage: 100% (0 Regressions)</span>
            </div>
          </div>
        </div>

        {/* Global Action Header Triggers */}
        <div className="flex items-center gap-2">
          {/* Target Repo Picker */}
          <div className="relative inline-block">
            <div className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded px-2.5 py-1 cursor-pointer transition text-slate-200">
              <Database className="h-3.5 w-3.5 text-sky-400" />
              <select
                id="repo-selector"
                value={selectedRepo.id}
                onChange={(e) => {
                  const target = repositories.find(r => r.id === e.target.value);
                  if (target) setSelectedRepo(target);
                }}
                className="bg-transparent border-none text-xs font-mono font-medium focus:ring-0 text-slate-200 cursor-pointer outline-none pr-4"
              >
                {repositories.map(repo => (
                  <option key={repo.id} value={repo.id} className="bg-slate-900 text-slate-200">
                    {repo.name} ({repo.loc >= 1000000 ? `${(repo.loc / 1000000).toFixed(1)}M` : `${(repo.loc / 1000).toFixed(0)}k`} LOC)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            id="header-btn-poc-report"
            onClick={onOpenPoCModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-sky-800/80 bg-sky-950/40 text-sky-300 hover:bg-sky-900/40 hover:border-sky-600 transition font-mono text-[11px] font-medium"
            title="Export 14-Day PoC Audit Dossier for Executive Review"
          >
            <FileText className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">14-Day PoC Report</span>
          </button>

          <button
            id="header-btn-run-audit"
            onClick={onTriggerAudit}
            disabled={isAuditRunning}
            className={`flex items-center gap-1.5 px-3 py-1 rounded border font-mono text-[11px] font-medium transition shadow-sm ${
              isAuditRunning
                ? 'bg-amber-950/60 border-amber-700 text-amber-300 animate-pulse cursor-wait'
                : 'bg-sky-600 hover:bg-sky-500 border-sky-400 text-slate-950 font-semibold shadow-sky-900/30 hover:shadow-sky-500/20'
            }`}
          >
            {isAuditRunning ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-300" />
                <span>Auditing AST...</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run Autonomous Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Module Navigation Bar */}
      <div className="px-4 lg:px-6 flex items-center justify-between overflow-x-auto scrollbar-none">
        <nav className="flex items-center gap-1 py-1 text-xs">
          <button
            id="nav-tab-dashboard"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-medium transition whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Module A: CR Executive Dashboard</span>
          </button>

          <button
            id="nav-tab-ast-graph"
            onClick={() => setActiveTab('ast-graph')}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-medium transition whitespace-nowrap ${
              activeTab === 'ast-graph'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Share2 className="h-4 w-4" />
            <span>Module B: Deep AST Code Graph</span>
            {selectedRepo.criticalCves > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[10px] font-mono">
                {selectedRepo.criticalCves} Hotspot
              </span>
            )}
          </button>

          <button
            id="nav-tab-r-cli"
            onClick={() => setActiveTab('r-cli')}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-medium transition whitespace-nowrap ${
              activeTab === 'r-cli'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>Module C: R-CLI Execution Harness</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-[10px] font-mono">
              Live Loop
            </span>
          </button>

          <button
            id="nav-tab-pr-diff"
            onClick={() => setActiveTab('pr-diff')}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-medium transition whitespace-nowrap ${
              activeTab === 'pr-diff'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <GitPullRequest className="h-4 w-4" />
            <span>Module D: PR & Diff Studio</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
              142/142 Tests
            </span>
          </button>

          <button
            id="nav-tab-airgap-settings"
            onClick={() => setActiveTab('airgap-settings')}
            className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 font-medium transition whitespace-nowrap ${
              activeTab === 'airgap-settings'
                ? 'border-sky-400 text-sky-400 bg-sky-500/5'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
            }`}
          >
            <Settings2 className="h-4 w-4" />
            <span>Module E: Enterprise Sovereignty & VPC</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

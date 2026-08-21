import React, { useState } from 'react';
import { 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingDown, 
  Filter, 
  Search, 
  GitBranch, 
  Terminal, 
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { ExecutiveMetrics, CVERecord, Repository } from '../types';
import { mockTrajectoryData, mockTestCoverageMatrix } from '../data/mockData';

interface DashboardModuleProps {
  metrics: ExecutiveMetrics;
  cves: CVERecord[];
  selectedRepo: Repository;
  onSelectCVE: (cve: CVERecord) => void;
  onNavigateToTab: (tab: 'dashboard' | 'ast-graph' | 'r-cli' | 'pr-diff' | 'airgap-settings') => void;
  onTriggerAudit: () => void;
  isAuditRunning: boolean;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  metrics,
  cves,
  selectedRepo,
  onSelectCVE,
  onNavigateToTab,
  onTriggerAudit,
  isAuditRunning,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');
  const [scannerFilter, setScannerFilter] = useState<'ALL' | 'Semgrep' | 'SonarQube' | 'Bandit' | 'Snyk'>('ALL');

  const filteredCves = cves.filter(cve => {
    const matchesSearch = 
      cve.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cve.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cve.file.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || cve.severity === severityFilter;
    const matchesScanner = scannerFilter === 'ALL' || cve.scanner === scannerFilter;
    return matchesSearch && matchesSeverity && matchesScanner;
  });

  const paydownPercent = ((metrics.technicalDebtRemediatedUSD / metrics.technicalDebtBaselineUSD) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner: Sovereign Air-Gap & Autonomous CR Telemetry */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 border border-sky-500/30 text-sky-400 font-mono text-xs font-semibold">
              CONTINUOUS REMEDIATION (CR) ACTIVE
            </span>
            <span className="text-slate-400 text-xs font-mono">
              Target: <strong className="text-slate-200">{selectedRepo.name}</strong> ({selectedRepo.loc.toLocaleString()} LOC / {selectedRepo.primaryLang})
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Autonomous Zero-Breakage Code Remediation Grid
          </h2>
          <p className="text-slate-400 text-sm max-w-3xl">
            Deep AST Mapping monitors all call hierarchies, while the GraphWard R-CLI closed-loop harness executes precision self-correcting patches with 100% test regression guarantees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dashboard-btn-ast-inspector"
            onClick={() => onNavigateToTab('ast-graph')}
            className="flex items-center gap-2 px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium font-mono transition"
          >
            <Layers className="h-4 w-4 text-sky-400" />
            <span>Open AST Visualizer</span>
          </button>

          <button
            id="dashboard-btn-trigger-audit"
            onClick={onTriggerAudit}
            disabled={isAuditRunning}
            className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-xs font-semibold transition ${
              isAuditRunning 
                ? 'bg-amber-900/40 border border-amber-600 text-amber-300 animate-pulse'
                : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md shadow-sky-950/50'
            }`}
          >
            {isAuditRunning ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
                <span>Running AST Audit...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-slate-950" />
                <span>Trigger R-CLI Audit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4 Sovereign Executive Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Technical Debt Value Paydown */}
        <div className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-lg p-4 space-y-3 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-mono font-medium uppercase tracking-wider">
              Technical Debt Paydown
            </span>
            <div className="h-7 w-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100">
                ${(metrics.technicalDebtRemediatedUSD / 1000000).toFixed(2)}M
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" /> +{paydownPercent}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Baseline: ${(metrics.technicalDebtBaselineUSD / 1000000).toFixed(2)}M technical debt
            </p>
          </div>
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                style={{ width: `${paydownPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Remediated: 75.5%</span>
              <span>Target: 100%</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Active CVE Backlog Breakdown */}
        <div className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-lg p-4 space-y-3 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-mono font-medium uppercase tracking-wider">
              Active CVE Backlog
            </span>
            <div className="h-7 w-7 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-slate-100">
                {metrics.activeCves.critical + metrics.activeCves.high} Hotspots
              </span>
              <span className="text-xs text-rose-400 font-mono">
                {metrics.activeCves.critical} Critical
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Semgrep & SonarQube verified AST nodes
            </p>
          </div>
          {/* Severity Pills */}
          <div className="flex items-center gap-1.5 pt-1 text-[11px] font-mono">
            <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
              {metrics.activeCves.critical} Crit
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {metrics.activeCves.high} High
            </span>
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              {metrics.activeCves.medium} Med
            </span>
          </div>
        </div>

        {/* Metric 3: MTTR Reduction */}
        <div className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-lg p-4 space-y-3 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-mono font-medium uppercase tracking-wider">
              Mean Time to Remediate (MTTR)
            </span>
            <div className="h-7 w-7 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-sky-400">
                {metrics.mttrCurrentMinutes} Minutes
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center">
                <TrendingDown className="h-3.5 w-3.5" /> -99.5%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Industry baseline: <strong className="text-slate-300 font-mono">{metrics.mttrBaselineDays} Days</strong>
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex justify-between items-center">
            <span>Autonomous PR turnaround</span>
            <span className="text-sky-300 font-semibold">14m 12s avg</span>
          </div>
        </div>

        {/* Metric 4: Zero-Breakage Pass Rate */}
        <div className="bg-[#0f172a] border border-slate-800 hover:border-slate-700 rounded-lg p-4 space-y-3 transition">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs font-mono font-medium uppercase tracking-wider">
              Zero-Breakage Pass Rate
            </span>
            <div className="h-7 w-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-400">
                {metrics.zeroBreakagePassRate.toFixed(1)}%
              </span>
              <span className="text-xs text-emerald-300 font-mono">
                0 Regressions
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {metrics.totalVerificationsRun.toLocaleString()} sandboxed test suites executed
            </p>
          </div>
          <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex justify-between items-center">
            <span>Production Breaking Changes</span>
            <span className="text-emerald-400 font-semibold">0 Allowed</span>
          </div>
        </div>
      </div>

      {/* Interactive Analytics: Trajectory Chart & Test Coverage Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trajectory Area Chart */}
        <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-100 tracking-wide font-mono">
                CVE & Technical Debt Remediation Trajectory
              </h3>
              <p className="text-xs text-slate-400">
                Tracking technical debt paydown ($M) vs residual active CVE vulnerabilities
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
                <span className="text-slate-300">Remediated Debt ($M)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-sm bg-rose-500" />
                <span className="text-slate-300">Active CVE Count</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockTrajectoryData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="remediatedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="cveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0b1329', borderColor: '#334155', borderRadius: '6px', fontSize: '12px', color: '#e2e8f0', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="remediatedDebt" 
                  name="Remediated ($M)" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#remediatedGrad)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="activeCves" 
                  name="Active CVEs" 
                  stroke="#f43f5e" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#cveGrad)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Test Suite Stability & Coverage Matrix */}
        <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-100 tracking-wide font-mono">
                Test Suite Stability Matrix
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-medium">
                100% Zero-Regression
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-tiered automated validation executed prior to PR submission
            </p>
          </div>

          <div className="space-y-3">
            {mockTestCoverageMatrix.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{item.category}</span>
                  <span className="text-sky-400 font-semibold">{item.passed}/{item.total} ({item.coverage}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all"
                    style={{ width: `${item.coverage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded bg-slate-900/90 border border-slate-800 text-xs font-mono space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Closed-Loop Verification Engine</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              If any test fails during R-CLI synthesis, the AST feedback loop triggers self-correction before merge.
            </p>
          </div>
        </div>
      </div>

      {/* Active CVE Backlog & Continuous Remediation Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-mono tracking-tight">
              Active Vulnerability Backlog & Auto-Remediation Status
            </h3>
            <p className="text-xs text-slate-400">
              Directly synthesized AST patches for {selectedRepo.name}
            </p>
          </div>

          {/* Table Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search CVE, CWE, file..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 w-48 font-mono"
              />
            </div>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
            </select>

            <select
              value={scannerFilter}
              onChange={(e) => setScannerFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
            >
              <option value="ALL">All Scanners</option>
              <option value="Semgrep">Semgrep</option>
              <option value="SonarQube">SonarQube</option>
              <option value="Bandit">Bandit</option>
              <option value="Snyk">Snyk</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-800 rounded">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-4 font-semibold">Vulnerability Identifier</th>
                <th className="py-2.5 px-4 font-semibold">Target File & AST Scope</th>
                <th className="py-2.5 px-4 font-semibold">Severity / CWE</th>
                <th className="py-2.5 px-4 font-semibold">Detection Engine</th>
                <th className="py-2.5 px-4 font-semibold">Remediation State</th>
                <th className="py-2.5 px-4 font-semibold">MTTR</th>
                <th className="py-2.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-950/40">
              {filteredCves.map((cve) => (
                <tr key={cve.id} className="hover:bg-slate-900/60 transition group">
                  {/* ID & Title */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-200">{cve.id}</div>
                    <div className="text-[11px] text-slate-400 font-sans max-w-xs truncate" title={cve.title}>
                      {cve.title}
                    </div>
                  </td>

                  {/* Target File */}
                  <td className="py-3 px-4">
                    <div className="text-sky-300 font-medium">{cve.file}</div>
                    <div className="text-slate-400 text-[10px]">Line {cve.line} (AST Token #84)</div>
                  </td>

                  {/* Severity */}
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                      cve.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : cve.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                    }`}>
                      {cve.severity}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-1">{cve.cwe.split(':')[0]}</div>
                  </td>

                  {/* Scanner */}
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[11px]">
                      {cve.scanner}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    {cve.status === 'REMEDIATED' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium">
                        <CheckCircle2 className="h-3 w-3" /> Remediated (PR Merged)
                      </span>
                    ) : cve.status === 'AUTO_PATCHING' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-medium animate-pulse">
                        <RefreshCw className="h-3 w-3 animate-spin" /> Iteration {cve.fixIteration} Running
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700 text-[11px]">
                        Queued for R-CLI
                      </span>
                    )}
                  </td>

                  {/* MTTR */}
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {cve.mttrMinutes > 0 ? `${cve.mttrMinutes} min` : 'Queued'}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          onSelectCVE(cve);
                          onNavigateToTab('ast-graph');
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] transition"
                        title="Locate node in AST Code Graph"
                      >
                        AST Graph
                      </button>

                      <button
                        onClick={() => {
                          onSelectCVE(cve);
                          onNavigateToTab('r-cli');
                        }}
                        className="px-2 py-1 rounded bg-sky-950/80 hover:bg-sky-900 border border-sky-800 text-sky-300 text-[10px] transition"
                        title="Send to R-CLI Execution Harness"
                      >
                        R-CLI
                      </button>

                      {cve.prId && (
                        <button
                          onClick={() => onNavigateToTab('pr-diff')}
                          className="px-2 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 text-[10px] transition"
                          title="View Verified Code Diff"
                        >
                          Diff
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

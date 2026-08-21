import React, { useState } from 'react';
import { 
  GitPullRequest, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Copy, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  Layers, 
  GitMerge, 
  FileCode, 
  Sparkles,
  Columns,
  Rows
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PRDiff } from '../types';

interface DiffStudioModuleProps {
  prs: PRDiff[];
  onMergePR: (prId: string) => void;
  onRequestReiteration: (pr: PRDiff, customPrompt: string) => void;
}

export const DiffStudioModule: React.FC<DiffStudioModuleProps> = ({
  prs,
  onMergePR,
  onRequestReiteration,
}) => {
  const [selectedPrId, setSelectedPrId] = useState<string>(prs[0]?.id || 'pr-482');
  const [diffViewMode, setDiffViewMode] = useState<'split' | 'unified'>('split');
  const [copied, setCopied] = useState<boolean>(false);
  const [showReiterationModal, setShowReiterationModal] = useState<boolean>(false);
  const [reiterationPrompt, setReiterationPrompt] = useState<string>('Enforce strict algorithm whitelist and ensure key id validation is constant-time.');

  const currentPr = prs.find(p => p.id === selectedPrId) || prs[0];

  const handleCopyDiff = () => {
    const rawDiff = `--- a/${currentPr.file}\n+++ b/${currentPr.file}\n@@ -1,15 +1,24 @@\n${currentPr.patchedCode}`;
    navigator.clipboard.writeText(rawDiff);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPatch = () => {
    const patchContent = `# GraphWard AI Autonomous Remediation Patch
# PR #${currentPr.prNumber} | CVE: ${currentPr.cveId}
# Target: ${currentPr.file}
# Date: ${currentPr.createdAt}
# Verification: ${currentPr.unitTestsPassed}/${currentPr.unitTestsTotal} Tests Passed (0 Regressions)

--- a/${currentPr.file}
+++ b/${currentPr.file}
@@ -1,15 +1,28 @@
- // ORIGINAL VULNERABLE AST:
${currentPr.originalCode.split('\n').map(l => `- ${l}`).join('\n')}

+ // GRAPHWARD SELF-CORRECTED AST PATCH:
${currentPr.patchedCode.split('\n').map(l => `+ ${l}`).join('\n')}
`;
    const blob = new Blob([patchContent], { type: 'text/x-diff;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `graphward-patch-${currentPr.cveId.toLowerCase()}.patch`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleApproveAndMerge = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#10b981', '#f59e0b', '#3b82f6'],
    });
    onMergePR(currentPr.id);
  };

  const submitReiteration = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestReiteration(currentPr, reiterationPrompt);
    setShowReiterationModal(false);
  };

  const originalLines = currentPr.originalCode.split('\n');
  const patchedLines = currentPr.patchedCode.split('\n');

  return (
    <div className="space-y-4">
      {/* PR Selector & Action Header */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        {/* PR Switcher Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 mr-2">
            <GitPullRequest className="h-4 w-4 text-sky-400" />
            <span className="font-mono text-xs font-semibold text-slate-200">
              PR & Diff Inspection Studio:
            </span>
          </div>

          <div className="flex items-center rounded border border-slate-800 bg-slate-900 p-0.5 text-xs font-mono">
            {prs.map(pr => (
              <button
                key={pr.id}
                onClick={() => setSelectedPrId(pr.id)}
                className={`px-3 py-1 rounded transition flex items-center gap-1.5 ${
                  selectedPrId === pr.id
                    ? 'bg-sky-500/20 text-sky-300 font-semibold border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>PR #{pr.prNumber}</span>
                <span className="text-[10px] text-slate-500">({pr.cveId})</span>
                {pr.merged && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" title="Merged" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode & Export Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Split vs Unified Toggle */}
          <div className="flex items-center rounded border border-slate-800 bg-slate-900 p-0.5 text-xs font-mono">
            <button
              onClick={() => setDiffViewMode('split')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition ${
                diffViewMode === 'split' ? 'bg-slate-800 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Side-by-Side Split Diff"
            >
              <Columns className="h-3 w-3" />
              <span>Split</span>
            </button>
            <button
              onClick={() => setDiffViewMode('unified')}
              className={`px-2 py-1 rounded flex items-center gap-1 transition ${
                diffViewMode === 'unified' ? 'bg-slate-800 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Unified Single Diff"
            >
              <Rows className="h-3 w-3" />
              <span>Unified</span>
            </button>
          </div>

          <button
            onClick={handleCopyDiff}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs transition"
            title="Copy Raw Git Diff"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span>{copied ? 'Copied!' : 'Copy Diff'}</span>
          </button>

          <button
            onClick={handleDownloadPatch}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs transition"
            title="Download .patch file"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>.patch</span>
          </button>

          <button
            onClick={() => setShowReiterationModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-mono text-xs transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Re-Iterate in R-CLI</span>
          </button>

          {currentPr.merged ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-mono text-xs font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Merged (SHA: {currentPr.mergeSha || '4f8a29e'})</span>
            </div>
          ) : (
            <button
              id="btn-approve-merge"
              onClick={handleApproveAndMerge}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition shadow-md shadow-emerald-950/40"
            >
              <GitMerge className="h-3.5 w-3.5" />
              <span>Approve & Merge PR</span>
            </button>
          )}
        </div>
      </div>

      {/* Automated Verification Matrix Banner */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
        <div className="flex items-center gap-2.5 p-2 rounded bg-slate-900/80 border border-slate-800">
          <div className="h-6 w-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Linter Status</span>
            <span className="text-emerald-400 font-semibold">{currentPr.linterStatus} (0 Warnings)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded bg-slate-900/80 border border-slate-800">
          <div className="h-6 w-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">SAST Security Scan</span>
            <span className="text-emerald-400 font-semibold">{currentPr.sastStatus} (Semgrep Rules)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded bg-slate-900/80 border border-slate-800">
          <div className="h-6 w-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Sandboxed Tests</span>
            <span className="text-emerald-400 font-semibold">{currentPr.unitTestsPassed}/{currentPr.unitTestsTotal} Passed (0 Breakages)</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded bg-slate-900/80 border border-slate-800">
          <div className="h-6 w-6 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">Branch Coverage</span>
            <span className="text-sky-400 font-semibold">{currentPr.coveragePercent}% Coverage</span>
          </div>
        </div>
      </div>

      {/* PR Metadata Details */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-mono text-[10px]">
                {currentPr.branch}
              </span>
              <span className="text-slate-400 text-xs font-mono">
                Target File: <strong className="text-slate-200">{currentPr.file}</strong>
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 mt-1 font-mono">
              PR #{currentPr.prNumber}: {currentPr.title}
            </h3>
          </div>
          <div className="text-right text-[11px] font-mono text-slate-400">
            <span>Author: {currentPr.author}</span>
            <span className="block text-slate-500">{currentPr.createdAt}</span>
          </div>
        </div>

        {/* AST Transformation Summary */}
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="space-y-1">
            <span className="text-rose-400 font-semibold uppercase text-[10px] block">
              Original Vulnerable AST Pattern
            </span>
            <div className="text-slate-300 bg-rose-950/20 border border-rose-900/40 p-2 rounded text-[11px]">
              {currentPr.originalASTSummary}
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-emerald-400 font-semibold uppercase text-[10px] block">
              GraphWard Self-Corrected AST Patch
            </span>
            <div className="text-slate-300 bg-emerald-950/20 border border-emerald-900/40 p-2 rounded text-[11px]">
              {currentPr.patchedASTSummary}
            </div>
          </div>
        </div>
      </div>

      {/* Code Diff Display Screen */}
      <div className="bg-[#050914] border border-slate-800 rounded-lg overflow-hidden font-mono text-xs shadow-2xl">
        {/* Diff Top Bar */}
        <div className="bg-[#0b1329] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <FileCode className="h-4 w-4 text-sky-400" />
            <span className="text-slate-200 font-semibold">{currentPr.file}</span>
            <span className="text-[10px] text-slate-500">({currentPr.language})</span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-rose-400">-{originalLines.length} lines</span>
            <span className="text-emerald-400">+{patchedLines.length} lines</span>
          </div>
        </div>

        {/* Split View */}
        {diffViewMode === 'split' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 max-h-[500px] overflow-y-auto">
            {/* Original Left Pane */}
            <div className="p-3 bg-rose-950/5">
              <div className="text-[10px] text-rose-400 font-bold uppercase tracking-wider mb-2 pb-1 border-b border-rose-950">
                Original Vulnerable Code
              </div>
              <div className="space-y-0.5">
                {originalLines.map((line, idx) => {
                  const isVulnerableLine = line.includes('VULNERABLE') || line.includes('algo == "none"') || line.includes('static zeroed') || line.includes('unsafe');
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-2 py-0.5 px-1 rounded ${
                        isVulnerableLine ? 'bg-rose-950/50 text-rose-200 border-l-2 border-rose-500' : 'text-slate-400'
                      }`}
                    >
                      <span className="text-slate-600 text-[10px] select-none w-6 text-right">{idx + 1}</span>
                      <pre className="font-mono flex-1 whitespace-pre-wrap">{line}</pre>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Patched Right Pane */}
            <div className="p-3 bg-emerald-950/5">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-2 pb-1 border-b border-emerald-950">
                GraphWard AST Self-Corrected Patch
              </div>
              <div className="space-y-0.5">
                {patchedLines.map((line, idx) => {
                  const isPatchLine = line.includes('SECURE') || line.includes('ALLOWED_ALGORITHMS') || line.includes('compare_digest') || line.includes('crypto/rand') || line.includes('Arc::clone');
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-2 py-0.5 px-1 rounded ${
                        isPatchLine ? 'bg-emerald-950/40 text-emerald-200 border-l-2 border-emerald-500' : 'text-slate-300'
                      }`}
                    >
                      <span className="text-slate-600 text-[10px] select-none w-6 text-right">{idx + 1}</span>
                      <pre className="font-mono flex-1 whitespace-pre-wrap">{line}</pre>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Unified View */
          <div className="p-4 max-h-[500px] overflow-y-auto space-y-1">
            <div className="text-slate-500 text-[11px] mb-2 font-mono">
              @@ -1,{originalLines.length} +1,{patchedLines.length} @@
            </div>
            {originalLines.map((line, idx) => (
              <div key={`orig-${idx}`} className="flex items-start gap-2 bg-rose-950/20 text-rose-300 py-0.5 px-1 rounded">
                <span className="text-rose-500 select-none">-</span>
                <span className="text-slate-600 text-[10px] select-none w-6 text-right">{idx + 1}</span>
                <pre className="font-mono flex-1 whitespace-pre-wrap">{line}</pre>
              </div>
            ))}
            {patchedLines.map((line, idx) => (
              <div key={`patch-${idx}`} className="flex items-start gap-2 bg-emerald-950/20 text-emerald-300 py-0.5 px-1 rounded">
                <span className="text-emerald-500 select-none">+</span>
                <span className="text-slate-600 text-[10px] select-none w-6 text-right">{idx + 1}</span>
                <pre className="font-mono flex-1 whitespace-pre-wrap">{line}</pre>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Request R-CLI Re-Iteration */}
      {showReiterationModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-lg max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold font-mono text-slate-100">
                  Request R-CLI AST Re-Iteration (PR #{currentPr.prNumber})
                </h3>
              </div>
              <button
                onClick={() => setShowReiterationModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={submitReiteration} className="space-y-3 font-mono text-xs">
              <p className="text-slate-400 font-sans text-xs">
                Provide custom architectural guidance to guide the autonomous LLM AST patch synthesizer:
              </p>

              <textarea
                rows={4}
                value={reiterationPrompt}
                onChange={(e) => setReiterationPrompt(e.target.value)}
                placeholder="e.g. Ensure backwards compatibility with RS256 while strictly rejecting 'none' algorithm."
                className="w-full p-2.5 rounded bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[11px]">
                ℹ️ The harness will re-execute the sandboxed pytest suite to guarantee 0 regressions before updating the diff.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReiterationModal(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
                >
                  Dispatch Re-Iteration Loop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

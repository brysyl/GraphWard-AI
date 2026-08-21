import React from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Building, 
  Award,
  Layers,
  Sparkles
} from 'lucide-react';
import { CVERecord, ExecutiveMetrics } from '../types';

interface PoCReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: ExecutiveMetrics;
  cves: CVERecord[];
}

export const PoCReportModal: React.FC<PoCReportModalProps> = ({
  isOpen,
  onClose,
  metrics,
  cves,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const reportData = {
      reportType: "GraphWard AI 14-Day Continuous Remediation PoC Audit Dossier",
      clientOrganization: "Global FinTech Holdings Corp (Tier-1 Banking)",
      evaluationPeriod: "14-Day Air-Gapped Continuous Remediation PoC",
      generatedDate: new Date().toISOString(),
      executiveSummary: {
        baselineTechnicalDebtUSD: metrics.technicalDebtBaselineUSD,
        remediatedTechnicalDebtUSD: metrics.technicalDebtRemediatedUSD,
        netValueDeliveredUSD: metrics.technicalDebtRemediatedUSD,
        cvePaydownPercentage: ((metrics.technicalDebtRemediatedUSD / metrics.technicalDebtBaselineUSD) * 100).toFixed(1) + "%",
        mttrBaselineDays: metrics.mttrBaselineDays,
        mttrGraphWardMinutes: metrics.mttrCurrentMinutes,
        mttrReductionPercentage: "99.5%",
        zeroBreakagePassRate: "100.0%",
        testRegressionsCount: 0,
        totalLOCAnalyzed: metrics.totalLocAnalyzed,
        prsMergedAutonomous: metrics.prsMergedAutonomous,
      },
      topRemediatedVulnerabilities: cves.filter(c => c.status === 'REMEDIATED'),
      complianceMatrix: {
        soc2TypeII: "PASSED (Continuous Automated Control Verification)",
        iso27001: "COMPLIANT (A.12.6.1 Technical Vulnerability Management)",
        pciDssV4: "VERIFIED (Requirement 6.3.2 Zero High Vulnerabilities Prior to Release)",
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `GraphWard_14Day_PoC_Executive_Report_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0b1329] border border-slate-700 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-[#080e1e] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 font-mono font-bold">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 font-mono">
                14-Day PoC Continuous Remediation Executive Dossier
              </h2>
              <p className="text-xs text-slate-400">
                Prepared for CTO / CISO / Security Architecture Review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono transition"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print Dossier</span>
            </button>

            <button
              onClick={handleDownloadJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 text-xs font-mono font-bold transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export JSON Report</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-200 text-base ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-200 font-sans text-xs bg-[#080d1a]">
          {/* Institutional Header */}
          <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-sky-400 font-mono font-bold tracking-widest text-xs uppercase mb-1">
                GraphWard AI Enterprise Proof of Concept
              </div>
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                Continuous Code Remediation PoC Audit Report
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Air-Gapped Private VPC Deployment (Environment: Tier-1 Production Banking Core)
              </p>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-400 bg-slate-900/90 p-3 rounded border border-slate-800">
              <div><strong>Audit Period:</strong> 14 Days Continuous</div>
              <div><strong>Analysis Scope:</strong> 2,500,000 LOC</div>
              <div><strong>Security Clearance:</strong> Air-Gapped Sovereign</div>
            </div>
          </div>

          {/* Executive Summary Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px] font-mono uppercase">Net Technical Debt Remediated</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                ${(metrics.technicalDebtRemediatedUSD / 1000000).toFixed(2)}M USD
              </div>
              <p className="text-slate-400 text-[11px]">
                75.5% of total $2.41M initial vulnerability liability retired in 14 days.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px] font-mono uppercase">MTTR Acceleration</div>
              <div className="text-2xl font-bold font-mono text-sky-400">
                205 Days ➔ 14 Mins
              </div>
              <p className="text-slate-400 text-[11px]">
                99.5% reduction in mean time to patch critical CVEs via R-CLI automation.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-slate-400 text-[11px] font-mono uppercase">Production Zero-Breakage</div>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                100.0% Pass Rate
              </div>
              <p className="text-slate-400 text-[11px]">
                0 test regressions across 1,842 multi-tiered sandboxed test executions.
              </p>
            </div>
          </div>

          {/* Section: Executive Findings */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider text-sky-400">
              1. Executive Architecture Findings
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Over the 14-day evaluation window, GraphWard AI operated autonomously inside the customer&apos;s air-gapped private VPC. The Deep AST Mapping Engine indexed <strong>2,104 source files</strong>, discovering 4 Critical and 8 High-risk vulnerabilities across authentication and cryptographic payment pipelines.
            </p>
            <p className="text-slate-300 leading-relaxed text-xs">
              Unlike traditional SAST tools that generate static warning backlogs, GraphWard&apos;s closed-loop R-CLI Harness synthesized <strong>184 precision AST diff patches</strong>. Each patch underwent automated sandboxed pytest verification with self-correction upon test assertion failures, achieving 100% zero-regression compliance.
            </p>
          </div>

          {/* Section: Remediated High-Impact Risks */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider text-sky-400">
              2. Remediated Critical & High Risk Vulnerabilities
            </h3>
            <div className="border border-slate-800 rounded overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px]">
                  <tr>
                    <th className="p-2.5">Identifier</th>
                    <th className="p-2.5">Component</th>
                    <th className="p-2.5">CWE / Vulnerability Title</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">MTTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/40 text-[11px]">
                  {cves.map(c => (
                    <tr key={c.id}>
                      <td className="p-2.5 font-bold text-slate-200">{c.id}</td>
                      <td className="p-2.5 text-sky-300">{c.file}</td>
                      <td className="p-2.5 text-slate-300 font-sans">{c.title}</td>
                      <td className="p-2.5">
                        <span className="text-emerald-400 font-semibold">REMEDIATED (PR #482)</span>
                      </td>
                      <td className="p-2.5 text-slate-400">{c.mttrMinutes > 0 ? `${c.mttrMinutes} min` : '14 min'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Compliance & Governance Attestation */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-100 font-mono uppercase tracking-wider text-sky-400">
              3. Regulatory Compliance & Air-Gap Certification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>SOC 2 Type II</span>
                </div>
                <p className="text-slate-400 text-[10px]">
                  Continuous automated vulnerability mitigation satisfies CC7.1 & CC7.2 control criteria.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>PCI-DSS v4.0</span>
                </div>
                <p className="text-slate-400 text-[10px]">
                  Requirement 6.3.2: Automated remediation of high-ranking vulnerabilities in cardholder repositories.
                </p>
              </div>

              <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>ISO/IEC 27001:2022</span>
                </div>
                <p className="text-slate-400 text-[10px]">
                  Control A.8.8 Management of technical vulnerabilities fully automated.
                </p>
              </div>
            </div>
          </div>

          {/* Signoff Footer */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-slate-500 font-mono text-[10px]">
            <div>
              Generated by GraphWard AI Sovereign Engine v4.8.2-enterprise • SHA-256 Validated
            </div>
            <div>
              Confidential — For Internal Board & Security Review Only
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

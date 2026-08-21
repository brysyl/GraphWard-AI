/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { DashboardModule } from './components/DashboardModule';
import { ASTVisualizerModule } from './components/ASTVisualizerModule';
import { RCLITerminalModule } from './components/RCLITerminalModule';
import { DiffStudioModule } from './components/DiffStudioModule';
import { AirGapSettingsModule } from './components/AirGapSettingsModule';
import { PoCReportModal } from './components/PoCReportModal';
import { AIAssistModal } from './components/AIAssistModal';

import { 
  mockRepositories, 
  mockExecutiveMetrics, 
  mockASTNodes, 
  mockASTEdges, 
  mockCVEList, 
  mockPRDiffs, 
  mockEnterpriseSettings 
} from './data/mockData';
import { Repository, CVERecord, ASTNode, PRDiff, EnterpriseSettings } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ast-graph' | 'r-cli' | 'pr-diff' | 'airgap-settings'>('dashboard');
  const [repositories] = useState<Repository[]>(mockRepositories);
  const [selectedRepo, setSelectedRepo] = useState<Repository>(mockRepositories[0]);
  const [metrics, setMetrics] = useState(mockExecutiveMetrics);
  const [cves, setCves] = useState<CVERecord[]>(mockCVEList);
  const [prs, setPrs] = useState<PRDiff[]>(mockPRDiffs);
  const [nodes, setNodes] = useState<ASTNode[]>(mockASTNodes);
  const [edges, setEdges] = useState(mockASTEdges);
  const [enterpriseSettings, setEnterpriseSettings] = useState<EnterpriseSettings>(mockEnterpriseSettings);

  const [isAuditRunning, setIsAuditRunning] = useState<boolean>(false);
  const [isPoCModalOpen, setIsPoCModalOpen] = useState<boolean>(false);
  const [aiAssistNode, setAiAssistNode] = useState<ASTNode | null>(null);
  const [activeCveTargetForRCLI, setActiveCveTargetForRCLI] = useState<string>('CVE-2026-3182');

  // Trigger Autonomous Audit sequence
  const handleTriggerAudit = () => {
    setIsAuditRunning(true);
    setActiveTab('r-cli');
    setTimeout(() => {
      setIsAuditRunning(false);
    }, 4500);
  };

  // Trigger AST Refactor Loop
  const handleTriggerRefactor = () => {
    setActiveTab('r-cli');
  };

  // Merge PR handler
  const handleMergePR = (prId: string) => {
    setPrs(prev => prev.map(p => {
      if (p.id === prId) {
        return {
          ...p,
          merged: true,
          mergeSha: `${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 6)}`,
        };
      }
      return p;
    }));

    // Update CVE status to REMEDIATED
    setCves(prev => prev.map(c => {
      if (c.id === 'CVE-2026-3182') {
        return { ...c, status: 'REMEDIATED', remediatedAt: new Date().toISOString() };
      }
      return c;
    }));

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      technicalDebtRemediatedUSD: Math.min(prev.technicalDebtBaselineUSD, prev.technicalDebtRemediatedUSD + 150000),
      prsMergedAutonomous: prev.prsMergedAutonomous + 1,
    }));
  };

  // Re-iteration request
  const handleRequestReiteration = (pr: PRDiff, customPrompt: string) => {
    setActiveCveTargetForRCLI(pr.cveId);
    setActiveTab('r-cli');
  };

  const handleSelectCVE = (cve: CVERecord) => {
    setActiveCveTargetForRCLI(cve.id);
  };

  const handleSelectCVEForRCLI = (cveId: string) => {
    setActiveCveTargetForRCLI(cveId);
    setActiveTab('r-cli');
  };

  return (
    <div className="min-h-screen bg-[#080d1a] text-slate-100 flex flex-col font-sans antialiased selection:bg-sky-500/30 selection:text-sky-200">
      {/* Institutional Top Navigation & Telemetry Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        repositories={repositories}
        selectedRepo={selectedRepo}
        setSelectedRepo={setSelectedRepo}
        onTriggerAudit={handleTriggerAudit}
        onTriggerRefactor={handleTriggerRefactor}
        onOpenPoCModal={() => setIsPoCModalOpen(true)}
        isAuditRunning={isAuditRunning}
        isAirGapped={enterpriseSettings.isAirGapped}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 p-4 lg:p-6 max-w-7xl w-full mx-auto">
        {activeTab === 'dashboard' && (
          <DashboardModule
            metrics={metrics}
            cves={cves}
            selectedRepo={selectedRepo}
            onSelectCVE={handleSelectCVE}
            onNavigateToTab={setActiveTab}
            onTriggerAudit={handleTriggerAudit}
            isAuditRunning={isAuditRunning}
          />
        )}

        {activeTab === 'ast-graph' && (
          <ASTVisualizerModule
            nodes={nodes}
            edges={edges}
            selectedRepo={selectedRepo}
            onNavigateToTab={setActiveTab}
            onSelectCVEForRCLI={handleSelectCVEForRCLI}
            onOpenAIAssist={(node) => setAiAssistNode(node)}
          />
        )}

        {activeTab === 'r-cli' && (
          <RCLITerminalModule
            selectedRepo={selectedRepo}
            onNavigateToTab={setActiveTab}
            activeCveTarget={activeCveTargetForRCLI}
          />
        )}

        {activeTab === 'pr-diff' && (
          <DiffStudioModule
            prs={prs}
            onMergePR={handleMergePR}
            onRequestReiteration={handleRequestReiteration}
          />
        )}

        {activeTab === 'airgap-settings' && (
          <AirGapSettingsModule
            settings={enterpriseSettings}
            onUpdateSettings={setEnterpriseSettings}
            onOpenPoCModal={() => setIsPoCModalOpen(true)}
            selectedRepo={selectedRepo}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060a14] py-3 px-6 text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-slate-300 font-semibold">GraphWard AI Sovereign Continuous Remediation v4.8.2</span>
          <span>•</span>
          <span className="text-emerald-400">Zero-Regression Gate: ACTIVE</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>Air-Gapped Private VPC</span>
          <span>•</span>
          <span>vLLM Engine (Qwen-32B)</span>
          <span>•</span>
          <button 
            onClick={() => setIsPoCModalOpen(true)}
            className="text-sky-400 hover:underline"
          >
            PoC Audit Dossier
          </button>
        </div>
      </footer>

      {/* 14-Day PoC Report Modal */}
      <PoCReportModal
        isOpen={isPoCModalOpen}
        onClose={() => setIsPoCModalOpen(false)}
        metrics={metrics}
        cves={cves}
      />

      {/* AI AST Remediation Assistant Modal */}
      <AIAssistModal
        isOpen={!!aiAssistNode}
        onClose={() => setAiAssistNode(null)}
        targetNode={aiAssistNode}
        onApplyPatchToRCLI={(cveId) => handleSelectCVEForRCLI(cveId)}
      />
    </div>
  );
}

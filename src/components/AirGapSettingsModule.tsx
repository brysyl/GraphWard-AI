import React, { useState } from 'react';
import { 
  Settings2, 
  Lock, 
  ShieldCheck, 
  Cpu, 
  Server, 
  FileText, 
  CheckCircle2, 
  RefreshCw, 
  Sliders, 
  Plus, 
  Zap, 
  Layers,
  Database,
  Globe,
  Radio
} from 'lucide-react';
import { EnterpriseSettings, MCPServer, Repository } from '../types';

interface AirGapSettingsModuleProps {
  settings: EnterpriseSettings;
  onUpdateSettings: (newSettings: EnterpriseSettings) => void;
  onOpenPoCModal: () => void;
  selectedRepo: Repository;
}

export const AirGapSettingsModule: React.FC<AirGapSettingsModuleProps> = ({
  settings,
  onUpdateSettings,
  onOpenPoCModal,
  selectedRepo,
}) => {
  const [localSettings, setLocalSettings] = useState<EnterpriseSettings>(settings);
  const [testingPing, setTestingPing] = useState<string | null>(null);
  const [showAddMcp, setShowAddMcp] = useState<boolean>(false);
  const [newMcpName, setNewMcpName] = useState<string>('');
  const [newMcpEndpoint, setNewMcpEndpoint] = useState<string>('');
  const [newMcpType, setNewMcpType] = useState<'SAST' | 'Linter' | 'AST_Parser' | 'Test_Runner'>('SAST');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleToggleAirGap = () => {
    const updated = { ...localSettings, isAirGapped: !localSettings.isAirGapped };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handleToggleMcpStatus = (mcpId: string) => {
    const updatedServers = localSettings.mcpServers.map(s => {
      if (s.id === mcpId) {
        return {
          ...s,
          status: s.status === 'CONNECTED' ? 'OFFLINE' : ('CONNECTED' as const),
        };
      }
      return s;
    });
    const updated = { ...localSettings, mcpServers: updatedServers };
    setLocalSettings(updated);
    onUpdateSettings(updated);
  };

  const handlePingTest = (mcpId: string) => {
    setTestingPing(mcpId);
    setTimeout(() => {
      setTestingPing(null);
    }, 600);
  };

  const handleAddMCPServer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMcpName || !newMcpEndpoint) return;

    const newServer: MCPServer = {
      id: `mcp-${Date.now()}`,
      name: newMcpName,
      status: 'CONNECTED',
      version: 'v1.0.0-custom',
      endpoint: newMcpEndpoint,
      type: newMcpType,
      rulesCount: 1200,
      latencyMs: 16,
    };

    const updated = {
      ...localSettings,
      mcpServers: [...localSettings.mcpServers, newServer],
    };

    setLocalSettings(updated);
    onUpdateSettings(updated);
    setShowAddMcp(false);
    setNewMcpName('');
    setNewMcpEndpoint('');
  };

  const handleSaveAll = () => {
    onUpdateSettings(localSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Air-Gap & Sovereignty Status */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
              SOVEREIGN AIR-GAP VPC: {localSettings.isAirGapped ? 'ENFORCED' : 'OFF'}
            </span>
            <span className="text-slate-400 text-xs font-mono">
              VPC ID: <code className="text-slate-300">{localSettings.telemetryVPC}</code>
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100 tracking-tight">
            Institutional Data Sovereignty & Local Engine Configuration
          </h2>
          <p className="text-slate-400 text-xs max-w-2xl">
            All code ingestion, AST tree synthesis, and sandboxed test execution run strictly on local private infrastructure with zero external telemetry or cloud egress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPoCModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded bg-sky-950/80 hover:bg-sky-900 border border-sky-800 text-sky-300 text-xs font-mono font-semibold transition"
          >
            <FileText className="h-4 w-4 text-sky-400" />
            <span>Generate 14-Day PoC Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Air-Gap Sovereignty & vLLM Settings */}
        <div className="space-y-6">
          {/* Card 1: Air-Gap Network Enclave Toggle */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Air-Gapped Private VPC Enclave
                </h3>
              </div>
              {/* Toggle Switch */}
              <button
                onClick={handleToggleAirGap}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localSettings.isAirGapped ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.isAirGapped ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <p className="text-slate-400 font-sans text-xs">
              When enabled, all inbound and outbound TCP/UDP traffic to public cloud networks is severed at the kernel firewall level. GraphWard routes all LLM queries exclusively to on-premise vLLM model clusters.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Egress Traffic</span>
                <span className="text-emerald-400 font-semibold">0.00 KB (BLOCKED)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Hardware Security Key</span>
                <span className="text-sky-300">FIPS 140-3 Level 4</span>
              </div>
            </div>
          </div>

          {/* Card 2: Local vLLM Inference Engine Selector */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-sky-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Local vLLM Model & Sandbox Runtime
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 text-[10px]">
                CUDA 12.4 ACTIVE
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-300 text-xs block mb-1.5">
                  Autonomous Remediation Model:
                </label>
                <select
                  value={localSettings.vllmModel}
                  onChange={(e) => setLocalSettings({ ...localSettings, vllmModel: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="Qwen-Coder-32B-Instruct (4-bit AWQ)">Qwen-Coder-32B-Instruct (4-bit AWQ) - Recommended</option>
                  <option value="CodeLlama-70B-Instruct-Local">CodeLlama-70B-Instruct-Local (Int8 TensorRT-LLM)</option>
                  <option value="DeepSeek-Coder-V2-236B-FP8">DeepSeek-Coder-V2-236B (FP8 Distributed Cluster)</option>
                  <option value="GraphWard-Aegis-14B-LoRA">GraphWard-Aegis-14B-LoRA (Specialized AST Engine)</option>
                </select>
              </div>

              {/* Sandbox Engine Selection */}
              <div>
                <label className="text-slate-300 text-xs block mb-1.5">
                  Sandboxed Test Execution Container:
                </label>
                <select
                  value={localSettings.sandboxType}
                  onChange={(e) => setLocalSettings({ ...localSettings, sandboxType: e.target.value as any })}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="gVisor Container">gVisor Container (Rootless App Kernel - Highest Isolation)</option>
                  <option value="Firecracker MicroVM">Firecracker MicroVM (KVM-Accelerated Isolation)</option>
                  <option value="WASM Isolated Engine">WASM Isolated Engine (Zero-Process Sandbox)</option>
                </select>
              </div>

              {/* VRAM Allocation Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">VRAM GPU Buffer Allocation:</span>
                  <span className="text-sky-400 font-semibold">{localSettings.vramAllocGB} GB / 80 GB</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="80"
                  step="8"
                  value={localSettings.vramAllocGB}
                  onChange={(e) => setLocalSettings({ ...localSettings, vramAllocGB: parseInt(e.target.value) })}
                  className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                />
              </div>

              {/* Context Window */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">AST AST-Context Window:</span>
                  <span className="text-sky-400 font-semibold">{localSettings.contextWindow.toLocaleString()} Tokens</span>
                </div>
                <input
                  type="range"
                  min="16384"
                  max="131072"
                  step="16384"
                  value={localSettings.contextWindow}
                  onChange={(e) => setLocalSettings({ ...localSettings, contextWindow: parseInt(e.target.value) })}
                  className="w-full accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Custom MCP Servers & Zero-Breakage Policy */}
        <div className="space-y-6">
          {/* Card 3: Custom MCP Server Configurations */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Custom MCP Server Integrations (SAST & Linters)
                </h3>
              </div>
              <button
                onClick={() => setShowAddMcp(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px]"
              >
                <Plus className="h-3 w-3 text-sky-400" />
                <span>Add MCP Server</span>
              </button>
            </div>

            {/* MCP Servers List */}
            <div className="space-y-2.5">
              {localSettings.mcpServers.map(server => (
                <div 
                  key={server.id}
                  className="p-3 rounded bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">{server.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400">
                        {server.version}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">
                      {server.endpoint} • {server.rulesCount.toLocaleString()} AST Rules
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePingTest(server.id)}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px]"
                    >
                      {testingPing === server.id ? 'Pinging...' : `${server.latencyMs}ms`}
                    </button>

                    <button
                      onClick={() => handleToggleMcpStatus(server.id)}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        server.status === 'CONNECTED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {server.status}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Autonomous Merge & Zero-Breakage Policy */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Zero-Breakage & Auto-Merge Policy
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                STRICT POLICY
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-200 block font-semibold">Strict No-Regression Policy</span>
                  <span className="text-slate-400 text-[11px]">Reject PR if even 1 unit or integration test breaks</span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.strictNoRegression}
                  onChange={(e) => setLocalSettings({ ...localSettings, strictNoRegression: e.target.checked })}
                  className="h-4 w-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Autonomous Auto-Merge Confidence Threshold:</span>
                  <span className="text-emerald-400 font-semibold">{localSettings.autoMergeThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="100"
                  value={localSettings.autoMergeThreshold}
                  onChange={(e) => setLocalSettings({ ...localSettings, autoMergeThreshold: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2 flex items-center justify-between">
              {saveSuccess && (
                <span className="text-emerald-400 text-xs flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Settings Saved!
                </span>
              )}
              <button
                onClick={handleSaveAll}
                className="ml-auto px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold text-xs transition shadow-md shadow-sky-950/50"
              >
                Apply Enterprise Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add MCP Server */}
      {showAddMcp && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-700 rounded-lg max-w-md w-full p-5 space-y-4 shadow-2xl font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">
                Register Custom MCP Scanner / Linter
              </h3>
              <button
                onClick={() => setShowAddMcp(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMCPServer} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Server Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Snyk Local Daemon"
                  value={newMcpName}
                  onChange={(e) => setNewMcpName(e.target.value)}
                  className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">gRPC / Socket Endpoint:</label>
                <input
                  type="text"
                  placeholder="grpc://10.240.0.22:9095"
                  value={newMcpEndpoint}
                  onChange={(e) => setNewMcpEndpoint(e.target.value)}
                  className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">MCP Server Protocol Role:</label>
                <select
                  value={newMcpType}
                  onChange={(e) => setNewMcpType(e.target.value as any)}
                  className="w-full p-2 rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="SAST">SAST Security Analyzer</option>
                  <option value="Linter">AST Strict Linter</option>
                  <option value="AST_Parser">Custom AST Grammar Parser</option>
                  <option value="Test_Runner">Sandboxed Test Runner</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMcp(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 font-bold"
                >
                  Register Server
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

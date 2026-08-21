import React, { useState, useRef } from 'react';
import { 
  Share2, 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Code2, 
  Terminal, 
  GitPullRequest, 
  Sparkles, 
  Info,
  ArrowRight,
  ShieldAlert,
  Activity,
  FileCode,
  Sliders
} from 'lucide-react';
import { ASTNode, ASTEdge, Repository, CVERecord } from '../types';

interface ASTVisualizerModuleProps {
  nodes: ASTNode[];
  edges: ASTEdge[];
  selectedRepo: Repository;
  onNavigateToTab: (tab: 'dashboard' | 'ast-graph' | 'r-cli' | 'pr-diff' | 'airgap-settings') => void;
  onSelectCVEForRCLI: (cveId: string) => void;
  onOpenAIAssist: (node: ASTNode) => void;
}

export const ASTVisualizerModule: React.FC<ASTVisualizerModuleProps> = ({
  nodes,
  edges,
  selectedRepo,
  onNavigateToTab,
  onSelectCVEForRCLI,
  onOpenAIAssist,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-jwt-verify');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [depthFilter, setDepthFilter] = useState<number>(4);
  const [viewMode, setViewMode] = useState<'ALL' | 'HOTSPOTS' | 'TAINTED' | 'CLEAN'>('ALL');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Filter nodes based on search, depth, and view mode
  const filteredNodes = nodes.filter(node => {
    const matchesSearch = 
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.cveId && node.cveId.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesDepth = node.astDepth <= depthFilter;

    let matchesViewMode = true;
    if (viewMode === 'HOTSPOTS') matchesViewMode = node.infected;
    if (viewMode === 'TAINTED') matchesViewMode = (node.taintedVars && node.taintedVars.length > 0) || node.infected;
    if (viewMode === 'CLEAN') matchesViewMode = !node.infected;

    return matchesSearch && matchesDepth && matchesViewMode;
  });

  const filteredNodeIds = new Set(filteredNodes.map(n => n.id));

  const filteredEdges = edges.filter(edge => 
    filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
  );

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="space-y-4">
      {/* Control & Filter Ribbon */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-sky-400" />
            <span className="font-mono text-xs font-semibold text-slate-200">
              Deep AST Code Graph ({selectedRepo.name})
            </span>
          </div>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          {/* Search */}
          <div className="relative">
            <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search AST node, function, file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono w-56"
            />
          </div>

          {/* View Mode Filters */}
          <div className="flex items-center rounded border border-slate-800 bg-slate-900/90 p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode('ALL')}
              className={`px-2.5 py-1 rounded transition ${
                viewMode === 'ALL' ? 'bg-sky-500/20 text-sky-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Nodes
            </button>
            <button
              onClick={() => setViewMode('HOTSPOTS')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                viewMode === 'HOTSPOTS' ? 'bg-rose-500/20 text-rose-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertCircle className="h-3 w-3 text-rose-400" />
              Hotspots Only
            </button>
            <button
              onClick={() => setViewMode('TAINTED')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                viewMode === 'TAINTED' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-3 w-3 text-amber-400" />
              Tainted Flows
            </button>
            <button
              onClick={() => setViewMode('CLEAN')}
              className={`px-2.5 py-1 rounded transition flex items-center gap-1 ${
                viewMode === 'CLEAN' ? 'bg-emerald-500/20 text-emerald-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="h-3 w-3 text-emerald-400" />
              Clean
            </button>
          </div>
        </div>

        {/* AST Depth Slider & Canvas Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <Sliders className="h-3.5 w-3.5 text-sky-400" />
            <span>AST Depth: Level {depthFilter}</span>
            <input
              type="range"
              min="1"
              max="4"
              value={depthFilter}
              onChange={(e) => setDepthFilter(parseInt(e.target.value))}
              className="w-24 accent-sky-400 cursor-pointer h-1.5 bg-slate-800 rounded"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded p-0.5">
            <button
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2))}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] font-mono text-slate-400 px-1">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.5))}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleResetView}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 ml-0.5"
              title="Reset Zoom & Pan"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas & Inspector Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[680px]">
        {/* Interactive AST Graph Canvas */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="lg:col-span-8 bg-[#080d1a] border border-slate-800 rounded-lg relative overflow-hidden cursor-grab active:cursor-grabbing select-none"
        >
          {/* Subtle Grid Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Graph Legend Overlay */}
          <div className="absolute top-3 left-3 z-10 bg-slate-900/90 border border-slate-800 rounded p-2.5 text-[11px] font-mono space-y-1.5 backdrop-blur">
            <div className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">AST Node Taxonomy</div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span className="text-rose-300">Flagged CVE Hotspot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded bg-sky-500" />
              <span className="text-slate-300">Function AST Node</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded bg-emerald-500" />
              <span className="text-slate-300">Clean / Verified Node</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-amber-300">Tainted Data Path</span>
            </div>
          </div>

          {/* SVG Canvas with Zoom & Pan */}
          <svg 
            className="w-full h-full"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            <defs>
              {/* Arrow markers */}
              <marker id="arrow-call" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
              </marker>
              <marker id="arrow-vulnerable" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
              </marker>
              <marker id="arrow-dataflow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
              </marker>
            </defs>

            {/* Edges */}
            {filteredEdges.map(edge => {
              const srcNode = nodes.find(n => n.id === edge.source);
              const tgtNode = nodes.find(n => n.id === edge.target);
              if (!srcNode || !tgtNode || !srcNode.x || !srcNode.y || !tgtNode.x || !tgtNode.y) return null;

              const isVulnerable = edge.isVulnerablePath;
              const isSelected = selectedNodeId === edge.source || selectedNodeId === edge.target;

              return (
                <g key={edge.id}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isVulnerable ? '#f43f5e' : isSelected ? '#38bdf8' : '#334155'}
                    strokeWidth={isVulnerable ? 2.5 : isSelected ? 2 : 1.5}
                    strokeDasharray={edge.type === 'dataflow' || isVulnerable ? '4 4' : undefined}
                    markerEnd={isVulnerable ? 'url(#arrow-vulnerable)' : 'url(#arrow-call)'}
                    className={isVulnerable ? 'animate-pulse' : ''}
                  />
                  {edge.label && (
                    <text
                      x={(srcNode.x + tgtNode.x) / 2}
                      y={(srcNode.y + tgtNode.y) / 2 - 6}
                      fill={isVulnerable ? '#f43f5e' : '#94a3b8'}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="select-none pointer-events-none"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nodes */}
            {filteredNodes.map(node => {
              if (!node.x || !node.y) return null;
              const isSelected = selectedNodeId === node.id;
              const isInfected = node.infected;

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNodeId(node.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Glowing halo for infected nodes */}
                  {isInfected && (
                    <circle
                      r="36"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                      strokeOpacity="0.4"
                      className="animate-ping"
                    />
                  )}

                  {/* Node Box */}
                  <rect
                    x="-90"
                    y="-28"
                    width="180"
                    height="56"
                    rx="8"
                    fill={isInfected ? '#1e1124' : isSelected ? '#0b1e38' : '#0f172a'}
                    stroke={
                      isInfected
                        ? '#f43f5e'
                        : isSelected
                        ? '#38bdf8'
                        : node.type === 'test'
                        ? '#10b981'
                        : '#334155'
                    }
                    strokeWidth={isSelected ? 2.5 : isInfected ? 2 : 1.5}
                    className="transition-all duration-200 group-hover:stroke-sky-400 shadow-lg"
                  />

                  {/* Node Header Pill */}
                  <rect
                    x="-82"
                    y="-22"
                    width="164"
                    height="16"
                    rx="4"
                    fill={isInfected ? '#4c0519' : '#1e293b'}
                  />
                  <text
                    x="0"
                    y="-11"
                    fill={isInfected ? '#fda4af' : '#94a3b8'}
                    fontSize="8.5"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="uppercase tracking-wider select-none pointer-events-none"
                  >
                    {node.type} • {node.file.split('/').pop()}
                  </text>

                  {/* Label */}
                  <text
                    x="0"
                    y="8"
                    fill={isInfected ? '#ffe4e6' : '#f8fafc'}
                    fontSize="11"
                    fontFamily="monospace"
                    fontWeight="600"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {node.label.length > 20 ? `${node.label.substring(0, 18)}..` : node.label}
                  </text>

                  {/* Bottom Stats Line */}
                  <text
                    x="0"
                    y="22"
                    fill={isInfected ? '#f43f5e' : '#64748b'}
                    fontSize="8.5"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none pointer-events-none"
                  >
                    {isInfected ? `🚨 ${node.cveId}` : `${node.loc} LOC • C-Score: ${node.complexity}`}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick Helper Floating Tip */}
          <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 rounded px-2.5 py-1 text-[10px] font-mono text-slate-400">
            Click node to inspect AST scope • Drag canvas to pan
          </div>
        </div>

        {/* Node Inspector Side Drawer */}
        <div className="lg:col-span-4 bg-[#0f172a] border border-slate-800 rounded-lg p-5 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-4">
            {/* Inspector Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    AST Scope Inspector
                  </span>
                  {selectedNode.infected ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-bold">
                      INFECTED HOTSPOT
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                      CLEAN / VERIFIED
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-slate-100 font-mono mt-1 break-all">
                  {selectedNode.label}
                </h3>
              </div>
            </div>

            {/* Scope Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Target File</span>
                <span className="text-slate-200 truncate block">{selectedNode.file}</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">AST Depth Level</span>
                <span className="text-sky-400">Level {selectedNode.astDepth} of 5</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Line Boundary</span>
                <span className="text-slate-200">{selectedNode.lineStart} - {selectedNode.lineEnd} ({selectedNode.loc} LOC)</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Cyclomatic Complexity</span>
                <span className={selectedNode.complexity > 10 ? 'text-amber-400' : 'text-slate-200'}>
                  {selectedNode.complexity} / 25
                </span>
              </div>
            </div>

            {/* Vulnerability Card if Infected */}
            {selectedNode.infected && (
              <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800/80 space-y-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Flagged Vulnerability ({selectedNode.cveId})</span>
                </div>
                <div className="text-slate-200 text-[11px] font-sans">
                  <strong>Title:</strong> {selectedNode.cveTitle || 'Insecure Token Handling'}
                </div>
                <div className="text-slate-400 text-[11px]">
                  <strong>CWE Class:</strong> {selectedNode.cwe || 'CWE-347'}
                </div>
                <div className="p-2 rounded bg-slate-900/90 text-rose-300 text-[11px]">
                  ⚠️ Unchecked algorithm negotiation allows signature bypass when alg is set to &apos;none&apos;.
                </div>
              </div>
            )}

            {/* Tainted Variables Trace */}
            {selectedNode.taintedVars && selectedNode.taintedVars.length > 0 && (
              <div className="space-y-1.5 text-xs font-mono">
                <span className="text-slate-400 text-[11px] font-semibold uppercase flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-amber-400" />
                  Tainted Variable Data Flow (AST Sources)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.taintedVars.map((v, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-amber-950/50 border border-amber-800/60 text-amber-300 text-[10px]">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Call Hierarchy Edges */}
            <div className="space-y-2 text-xs font-mono">
              <span className="text-slate-400 text-[11px] font-semibold uppercase block">
                AST Call Graph Dependencies
              </span>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] space-y-1 text-slate-300">
                <div>
                  <strong className="text-slate-500">Incoming Callers:</strong>{' '}
                  {selectedNode.incomingCalls && selectedNode.incomingCalls.length > 0 
                    ? selectedNode.incomingCalls.join(', ') 
                    : 'Root entry point'}
                </div>
                <div>
                  <strong className="text-slate-500">Outbound Callee Nodes:</strong>{' '}
                  {selectedNode.callDependencies && selectedNode.callDependencies.length > 0 
                    ? selectedNode.callDependencies.join(', ') 
                    : 'Terminal AST leaf node'}
                </div>
              </div>
            </div>
          </div>

          {/* Action Triggers for Selected Node */}
          <div className="space-y-2 pt-3 border-t border-slate-800 font-mono text-xs">
            {selectedNode.infected && (
              <button
                id="btn-dispatch-rcli"
                onClick={() => {
                  if (selectedNode.cveId) {
                    onSelectCVEForRCLI(selectedNode.cveId);
                  }
                  onNavigateToTab('r-cli');
                }}
                className="w-full py-2 px-3 rounded bg-sky-600 hover:bg-sky-500 text-slate-950 font-bold flex items-center justify-center gap-2 transition"
              >
                <Terminal className="h-4 w-4" />
                <span>Dispatch R-CLI Auto-Patch Harness</span>
              </button>
            )}

            <button
              id="btn-inspect-diff"
              onClick={() => onNavigateToTab('pr-diff')}
              className="w-full py-2 px-3 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 flex items-center justify-center gap-2 transition"
            >
              <GitPullRequest className="h-4 w-4 text-emerald-400" />
              <span>Inspect Synthesized PR Diff</span>
            </button>

            <button
              id="btn-ai-assist"
              onClick={() => onOpenAIAssist(selectedNode)}
              className="w-full py-2 px-3 rounded bg-slate-900 hover:bg-slate-800 border border-sky-900/60 text-sky-300 flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span>AI AST Remediation Assist</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

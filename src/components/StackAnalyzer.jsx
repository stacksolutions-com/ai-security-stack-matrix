import React, { useState, useMemo } from 'react';

export default function StackAnalyzer({ vendors, overlaps }) {
  const [stack, setStack] = useState([]);
  const activeVendors = vendors.filter(v => !v.isDimmed);

  const handleAdd = (e) => {
    const val = e.target.value;
    if (val && !stack.includes(val)) setStack([...stack, val]);
    e.target.value = ""; 
  };
  
  const removeVendor = (v) => setStack(stack.filter(item => item !== v));

  const analysis = useMemo(() => {
    if (stack.length < 1) return { red: [], amber: [], green: [], nodes: [], edges: [] };
    
    const conflicts = { red: [], amber: [], green: [] };
    const edges = [];
    const nodeMap = new Map(stack.map(v => [v, { id: v, hasConflict: false }]));
    
    for (let i = 0; i < stack.length; i++) {
      for (let j = i + 1; j < stack.length; j++) {
        const vA = stack[i];
        const vB = stack[j];
        const objA = vendors.find(v => v.Vendor === vA) || {};
        const objB = vendors.find(v => v.Vendor === vB) || {};
        const match = overlaps.find(o => (o['Vendor A'] === vA && o['Vendor B'] === vB) || (o['Vendor A'] === vB && o['Vendor B'] === vA));

        if (!match) {
          conflicts.green.push({ vA, vB, level: "Safe" });
        } else {
          nodeMap.get(vA).hasConflict = true;
          nodeMap.get(vB).hasConflict = true;
          if (match['Overlap Level']?.includes('Direct Competitor')) {
            conflicts.red.push({ vA, vB, objA, objB, reason: match['Overlap Reason'], rec: match['Recommendation'] });
            edges.push({ source: vA, target: vB, type: 'red' });
          } else {
            conflicts.amber.push({ vA, vB, objA, objB, reason: match['Overlap Reason'], rec: match['Recommendation'] });
            edges.push({ source: vA, target: vB, type: 'amber' });
          }
        }
      }
    }

    const width = 600, height = 400, radius = 140;
    const center = { x: width / 2, y: height / 2 };
    
    const nodes = Array.from(nodeMap.values()).map((node, index) => {
      const angle = (index / stack.length) * (2 * Math.PI) - (Math.PI / 2);
      const activeRadius = node.hasConflict ? radius : radius + 30; 
      return { ...node, x: stack.length === 1 ? center.x : center.x + activeRadius * Math.cos(angle), y: stack.length === 1 ? center.y : center.y + activeRadius * Math.sin(angle) };
    });

    return { ...conflicts, nodes, edges };
  }, [stack, overlaps, vendors]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <h3 className="text-2xl font-bold mb-2 text-slate-800">Enterprise Stack Analyzer</h3>
      <p className="text-slate-500 mb-8 text-sm">Add vendors from your filtered list below. Hover over any flagged conflict to compare underlying capabilities.</p>
      
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 mb-8 flex items-end space-x-6">
        <div className="flex-1">
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Add Vendor to Stack</label>
          <select onChange={handleAdd} className="w-full p-3 rounded border border-slate-300 shadow-sm focus:ring-2 focus:ring-blue-500 font-medium bg-white">
            <option value="">+ Select a vendor...</option>
            {activeVendors.filter(v => !stack.includes(v.Vendor)).map(v => (
              <option key={v.Vendor} value={v.Vendor}>{v.Vendor} ({v['Layer Name']})</option>
            ))}
          </select>
        </div>
        <button onClick={() => setStack([])} className="px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">Clear Stack</button>
      </div>

      {stack.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 bg-slate-50/50">
          Select a vendor above to begin building your stack.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* SVG Redundancy Web */}
          <div className="bg-slate-900 rounded-xl p-6 relative shadow-inner overflow-hidden border border-slate-800 flex flex-col items-center justify-center min-h-[450px]">
            <h4 className="absolute top-4 left-4 text-slate-400 font-bold uppercase tracking-widest text-xs z-10">Capability Overlap Web</h4>
            
            <svg width="100%" height="100%" viewBox="0 0 600 400" className="absolute inset-0">
              {analysis.edges.map((edge, i) => {
                const sourceNode = analysis.nodes.find(n => n.id === edge.source);
                const targetNode = analysis.nodes.find(n => n.id === edge.target);
                const isRed = edge.type === 'red';
                return (
                  <line key={`edge-${i}`} x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y} 
                    stroke={isRed ? "#ef4444" : "#fbbf24"} strokeWidth={isRed ? 4 : 2} strokeDasharray={isRed ? "none" : "8 4"} opacity="0.8" />
                );
              })}
              
              {analysis.nodes.map((node, i) => (
                <g key={`node-${i}`} className="transition-all duration-500" transform={`translate(${node.x}, ${node.y})`}>
                  {node.hasConflict && <circle r="35" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" className="animate-spin-slow" />}
                  <circle r="25" fill={node.hasConflict ? "#1e293b" : "#064e3b"} stroke={node.hasConflict ? "#64748b" : "#34d399"} strokeWidth="2" />
                  <text y="40" textAnchor="middle" fill="#f8fafc" className="text-xs font-bold font-sans drop-shadow-md">{node.id}</text>
                  <text y="5" textAnchor="middle" fill={node.hasConflict ? "#94a3b8" : "#34d399"} className="text-lg font-bold" dominantBaseline="middle">{node.hasConflict ? "!" : "✓"}</text>
                </g>
              ))}
            </svg>
          </div>

          {/* Text Analysis Column */}
          <div className="space-y-4 pb-12">
            <div className="flex flex-wrap gap-2 mb-4">
              {stack.map(v => (
                <div key={v} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-slate-200">
                  {v} <button onClick={() => removeVendor(v)} className="ml-2 text-slate-400 hover:text-red-500 transition-colors leading-none">✕</button>
                </div>
              ))}
            </div>

            {stack.length < 2 && (
              <div className="text-sm text-slate-500 italic border-l-2 border-slate-200 pl-4 py-2">Add a second vendor to analyze overlaps. Isolated vendors (Green) represent unique, non-overlapping capabilities.</div>
            )}

            {analysis.red.map((c, i) => (
              <div key={`r-${i}`} className="relative group bg-white border-l-4 border-red-500 shadow-sm rounded-r-lg p-4 border-y border-r border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                <h4 className="text-base font-bold text-slate-800 mb-1">{c.vA} <span className="text-red-500 px-1 text-sm font-normal">vs</span> {c.vB}</h4>
                <p className="text-xs font-medium text-slate-600 mb-2 truncate">{c.reason}</p>
                <div className="text-[10px] uppercase tracking-wider font-bold text-red-500 mb-1">Direct Competitor</div>

                <div className="absolute top-full right-0 mt-3 w-80 sm:w-[400px] p-5 bg-slate-900/95 backdrop-blur-sm text-white rounded-xl opacity-0 group-hover:opacity-100 shadow-2xl z-[100] pointer-events-none transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border border-slate-700 text-left">
                  <div className="absolute -top-2 right-6 border-x-8 border-x-transparent border-b-8 border-b-slate-700"></div>
                  <div className="font-bold text-sm text-red-400 mb-1 uppercase tracking-widest">Conflict Analysis</div>
                  <p className="text-xs text-slate-300 mb-4 pb-4 border-b border-slate-700 leading-relaxed">{c.reason}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 relative">
                      <div className="font-bold text-blue-300 text-sm mb-1">{c.objA.Vendor}</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{c.objA.Category}</div>
                      <div className="text-xs text-slate-300 italic leading-relaxed">{c.objA['Core Differentiator']}</div>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 relative mt-2">
                      <div className="font-bold text-blue-300 text-sm mb-1">{c.objB.Vendor}</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{c.objB.Category}</div>
                      <div className="text-xs text-slate-300 italic leading-relaxed">{c.objB['Core Differentiator']}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Consulting Directive</span>
                    <div className="text-xs font-semibold text-slate-200 bg-red-900/40 p-2 rounded border border-red-800/50">{c.rec}</div>
                  </div>
                </div>
              </div>
            ))}

            {analysis.amber.map((c, i) => (
              <div key={`a-${i}`} className="relative group bg-white border-l-4 border-amber-400 shadow-sm rounded-r-lg p-4 border-y border-r border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                <h4 className="text-base font-bold text-slate-800 mb-1">{c.vA} <span className="text-amber-500 px-1 text-sm font-normal">vs</span> {c.vB}</h4>
                <p className="text-xs font-medium text-slate-600 mb-2 truncate">{c.reason}</p>
                <div className="text-[10px] uppercase tracking-wider font-bold text-amber-500 mb-1">Partial Overlap</div>

                <div className="absolute top-full right-0 mt-3 w-80 sm:w-[400px] p-5 bg-slate-900/95 backdrop-blur-sm text-white rounded-xl opacity-0 group-hover:opacity-100 shadow-2xl z-[100] pointer-events-none transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border border-slate-700 text-left">
                  <div className="absolute -top-2 right-6 border-x-8 border-x-transparent border-b-8 border-b-slate-700"></div>
                  <div className="font-bold text-sm text-amber-400 mb-1 uppercase tracking-widest">Partial Overlap Analysis</div>
                  <p className="text-xs text-slate-300 mb-4 pb-4 border-b border-slate-700 leading-relaxed">{c.reason}</p>
                  <div className="space-y-3">
                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 relative">
                      <div className="font-bold text-blue-300 text-sm mb-1">{c.objA.Vendor}</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{c.objA.Category}</div>
                      <div className="text-xs text-slate-300 italic leading-relaxed">{c.objA['Core Differentiator']}</div>
                    </div>
                    <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 relative mt-2">
                      <div className="font-bold text-blue-300 text-sm mb-1">{c.objB.Vendor}</div>
                      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{c.objB.Category}</div>
                      <div className="text-xs text-slate-300 italic leading-relaxed">{c.objB['Core Differentiator']}</div>
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-700">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Consulting Directive</span>
                    <div className="text-xs font-semibold text-slate-200 bg-amber-900/40 p-2 rounded border border-amber-800/50">{c.rec}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
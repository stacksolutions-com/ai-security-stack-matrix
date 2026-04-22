import React from 'react';

export default function SwimlaneView({ data }) {
  const layers = [
    { id: "1", name: "L1: Identity & Access" },
    { id: "2", name: "L2: Prompt Guardrails" },
    { id: "3", name: "L3: Runtime Protection" },
    { id: "4", name: "L4: Governance & GRC" },
    { id: "5", name: "L5: Observability" }
  ];
  const phases = ["Crawl", "Walk", "Run"];
  
  const phaseDetails = [
    { name: 'Crawl', time: '0–6 Months', budget: '$50K–$200K/yr', desc: 'Deploy identity basics + prompt guardrails. Establish shadow AI visibility. Get API keys under governance.' },
    { name: 'Walk', time: '6–18 Months', budget: '$200K–$600K/yr', desc: 'Runtime protection + governance. ML supply chain scanning, AI risk assessments, CI/CD compliance gates, observability.' },
    { name: 'Run', time: '18–36 Months', budget: '$600K–$2M/yr', desc: 'Full-stack: adversarial ML detection, continuous red-teaming, per-model policy gating, enterprise AI firewalls.' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 overflow-visible">
      <h3 className="text-2xl font-bold mb-2 text-slate-800">Deployment Roadmap: Architecture Swimlanes</h3>
      <p className="text-slate-500 mb-6 text-sm">Strategic phasing of AI security tools based on organizational maturity and budget.</p>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        {phaseDetails.map(p => (
          <div key={p.name} className="bg-slate-50 border border-slate-200 rounded-lg p-5 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${p.name === 'Crawl' ? 'bg-slate-400' : p.name === 'Walk' ? 'bg-[color:#19C37A]' : 'bg-[color:#00A35D]'}`}></div>
            <div className="flex justify-between items-start mb-2 pl-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-widest">{p.name} Phase</h4>
              <span className="text-xs font-bold bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">{p.time}</span>
            </div>
            <div className="text-xs font-bold text-[color:#00A35D] mb-3 pl-2">{p.budget}</div>
            <p className="text-sm text-slate-600 leading-relaxed pl-2">{p.desc}</p>
          </div>
        ))}
      </div>

      <div className="min-w-[900px] border-t border-slate-200 pt-6 pb-24">
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div className="font-bold text-slate-400 uppercase text-xs tracking-wider">Architecture Layer</div>
          {phases.map(phase => <div key={phase} className="font-bold text-slate-400 uppercase text-xs tracking-wider text-center">{phase} Phase</div>)}
        </div>
        <div className="space-y-4">
          {layers.map(layer => (
            <div key={layer.id} className="grid grid-cols-4 gap-4">
              {/* Branded layer background */}
              <div className="p-4 rounded-lg bg-[color:#00A35D] flex items-center shadow-sm">
                <span className="font-semibold text-white text-sm">{layer.name}</span>
              </div>
              {phases.map(phase => {
                const vendors = data.filter(v => String(v['Layer #']) === layer.id && v['Maturity Phase'] === phase);
                return (
                  <div key={`${layer.id}-${phase}`} className="bg-slate-50 rounded-lg border border-slate-200 p-3 min-h-[80px] flex flex-wrap gap-2 items-start content-start">
                    {vendors.map(v => (
                      <div key={v.Vendor} className={`relative w-full transition-all duration-300 ${v.isDimmed ? 'opacity-20 grayscale pointer-events-none' : 'group cursor-pointer'}`}>
                        {/* Branded vendor hover state */}
                        <div className={`bg-white border shadow-sm rounded px-3 py-2 text-xs font-bold w-full text-center transition-colors ${v.isDimmed ? 'border-slate-200 text-slate-400' : 'border-slate-300 text-slate-700 group-hover:border-[color:#00A35D] group-hover:text-[color:#00A35D]'}`}>
                          {v.Vendor}
                        </div>
                        
                        {!v.isDimmed && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-80 p-5 bg-slate-900/95 backdrop-blur-sm text-white rounded-xl opacity-0 group-hover:opacity-100 shadow-2xl z-50 pointer-events-none transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border border-slate-700 text-left">
                            <div className="flex justify-between items-start border-b border-slate-700 pb-3 mb-3">
                              <div>
                                <div className="font-bold text-lg leading-tight">{v.Vendor}</div>
                                <div className="text-[color:#19C37A] text-[10px] font-bold uppercase tracking-widest mt-1">{v.Category}</div>
                              </div>
                              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${v['Deployment Friction'] === 'Low' ? 'bg-green-500/20 text-green-300' : v['Deployment Friction'] === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-red-500/20 text-red-300'}`}>
                                {v['Deployment Friction']} Friction
                              </div>
                            </div>
                            <div className="mb-4">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Core AI Capabilities</span>
                              <div className="text-sm text-slate-200 leading-relaxed">{v['Core Differentiator']}</div>
                            </div>
                            <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest block mb-1">Why Phase: {v['Maturity Phase']}?</span>
                              <div className="text-xs text-slate-300">
                                Categorized as a <b>{v['Maturity Phase']}</b> phase investment due to its <b>{v['Cost Profile']}</b> cost profile targeting <b>{v['Target Size']}</b> organizations, combined with {v['Deployment Friction']?.toLowerCase()} integration requirements.
                              </div>
                            </div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900/95"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
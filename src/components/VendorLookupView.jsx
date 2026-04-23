import React from 'react';

export default function VendorLookupView({ data }) {
  // Only show vendors that match the active search (or all if search is empty)
  const displayData = data.filter(v => v && v.Vendor && !v.isDimmed);

  // Reusable sub-component for the capability scoring bars
  const ScoreBar = ({ label, score, color }) => (
    <div className="mb-2.5">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-500">
        <span>{label}</span>
        <span className="text-slate-800">{score || 0} / 100</span>
      </div>
      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-300">
        <div 
          className={`h-full transition-all duration-1000 ${color}`} 
          style={{ width: `${score || 0}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-slate-900 p-8">
      <div className="mb-8 border-b-2 border-slate-900 pb-4">
        <h3 className="text-3xl font-black text-slate-800">Architectural Intelligence Dossiers</h3>
        <p className="text-slate-500 text-sm mt-2 font-medium">Comprehensive capability scoring and deployment metrics.</p>
      </div>

      {displayData.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-300 rounded-xl">
          <div className="text-4xl mb-4">🔍</div>
          <div className="text-slate-500 font-bold text-lg">No vendors match your search.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {displayData.map((v, i) => (
            // Premium Dossier Card with hard structural shadows
            <div key={i} className="border-2 border-slate-900 rounded-xl p-6 bg-white shadow-[6px_6px_0px_0px_#0f172a] flex flex-col relative transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#0f172a]">
              
              {/* Header Section */}
              <div className="flex justify-between items-start mb-6 border-b-2 border-slate-100 pb-5">
                <div className="pr-4">
                  <h4 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{v.Vendor}</h4>
                  <div className="text-[color:#00A35D] text-xs font-bold uppercase tracking-widest mt-1.5">{v.Category}</div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <span className="bg-slate-900 text-white border-2 border-slate-900 px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap shadow-sm">
                    {v['Layer Name']?.split(':')[0]}
                  </span>
                  <span className="bg-[color:#19C37A]/10 text-[color:#00A35D] border-2 border-[color:#19C37A]/30 px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                    {v['Maturity Phase']} Phase
                  </span>
                </div>
              </div>

              {/* Core Differentiator Section */}
              <div className="mb-8">
                <h5 className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[color:#00A35D]"></span>
                  Core Architectural Differentiator
                </h5>
                <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-lg border-l-4 border-[color:#00A35D] border-y border-r border-y-slate-200 border-r-slate-200">
                  {v['Core Differentiator']}
                </p>
              </div>

              {/* Metrics & Capabilities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-auto pt-6 border-t-2 border-slate-100">
                
                {/* Left Column: Deployment Profile */}
                <div className="space-y-4">
                  <h5 className="text-[10px] text-slate-400 uppercase font-bold tracking-widest border-b border-slate-200 pb-2">Deployment Profile</h5>
                  
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Target Org</span>
                    <span className="text-xs text-slate-900 font-black">{v['Target Size']}</span>
                  </div>
                  
                  <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded border border-slate-200">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Friction</span>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider border ${
                      v['Deployment Friction'] === 'Low' ? 'bg-green-100 text-green-700 border-green-200' : 
                      v['Deployment Friction'] === 'Medium' ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                      'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {v['Deployment Friction']}
                    </span>
                  </div>
                </div>

                {/* Right Column: Capability Scoring */}
                <div>
                  <h5 className="text-[10px] text-slate-400 uppercase font-bold tracking-widest border-b border-slate-200 pb-2 mb-4">Functional Capabilities</h5>
                  <ScoreBar label="Identity & Brokering" score={v['Identity Score']} color="bg-blue-500" />
                  <ScoreBar label="Data Discovery & DLP" score={v['Data Score']} color="bg-purple-500" />
                  <ScoreBar label="Runtime AI Defenses" score={v['Runtime Score']} color="bg-[color:#00A35D]" />
                  <ScoreBar label="Governance & Audit" score={v['Governance Score']} color="bg-slate-700" />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
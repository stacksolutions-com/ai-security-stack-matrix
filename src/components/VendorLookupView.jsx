import React, { useState, useEffect } from 'react';

export default function VendorLookupView({ data }) {
  const [manualSelect, setManualSelect] = useState(null);
  
  // Filter to only vendors currently active based on the global search/filters
  const displayData = data.filter(v => v && v.Vendor && !v.isDimmed);

  // Auto-select if the search narrows it down to exactly ONE vendor
  useEffect(() => {
    if (displayData.length === 1) {
      setManualSelect(displayData[0]);
    } else if (manualSelect && !displayData.find(v => v.Vendor === manualSelect.Vendor)) {
      // Clear selection if the user changes the global search to something else
      setManualSelect(null);
    }
  }, [displayData, manualSelect]);

  // Determine which vendor to show the deep dive for
  let activeVendor = manualSelect;
  if (!activeVendor && displayData.length === 1) {
    activeVendor = displayData[0];
  }

  // --- UI Helpers for the Dossier ---
  const ScoreBar = ({ label, score, color }) => (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-500">
        <span>{label}</span>
        <span className="text-slate-800">{score || 0} / 100</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-300">
        <div className={`h-full transition-all duration-1000 ${color}`} style={{ width: `${score || 0}%` }}></div>
      </div>
    </div>
  );

  // Mocking extended data based on existing CSV attributes for the demo
  const getDeploymentModel = (layer) => {
    if (!layer) return "Custom Enterprise Deployment";
    if (layer.includes('L1')) return "API Federation / OIDC / SAML Hooks";
    if (layer.includes('L2')) return "Inline Proxy / Network Edge / API Gateway";
    if (layer.includes('L3')) return "Agentless Cloud Role / K8s DaemonSet";
    if (layer.includes('L4')) return "Out-of-band API / Log & Telemetry Ingestion";
    return "SDK / Telemetry Forwarding";
  };

  const getEstimatedBudget = (phase) => {
    if (phase === 'Crawl') return "$50K – $200K / yr (Initial Scope)";
    if (phase === 'Walk') return "$200K – $600K / yr (Broad Deployment)";
    if (phase === 'Run') return "$600K+ / yr (Global Enterprise)";
    return "Custom Pricing";
  };


  // ==========================================
  // VIEW 1: THE BLANK SLATE / SEARCH PROMPT
  // ==========================================
  if (!activeVendor) {
    return (
      <div className="bg-white rounded-xl shadow-sm border-2 border-slate-900 p-12 min-h-[600px] flex flex-col items-center justify-center">
        <div className="text-6xl mb-6 grayscale opacity-80">🔍</div>
        <h3 className="text-3xl font-black text-slate-800 mb-3 text-center">Vendor Intelligence Database</h3>
        <p className="text-slate-500 mb-8 text-center max-w-lg text-lg">
          {displayData.length > 8 
            ? "Use the global search bar above to isolate a vendor and load their comprehensive architectural dossier."
            : "Multiple vendors match your search. Select one below to view its full dossier:"}
        </p>
        
        {/* If the search narrowed it down to a few, give them buttons to pick one */}
        {displayData.length <= 8 && displayData.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
            {displayData.map(v => (
              <button 
                key={v.Vendor} 
                onClick={() => setManualSelect(v)}
                className="px-6 py-3 border-2 border-slate-900 rounded-lg font-bold text-slate-700 hover:bg-[color:#00A35D] hover:text-white hover:border-[color:#19C37A] hover:shadow-[4px_4px_0px_0px_#0f172a] transition-all bg-white"
              >
                {v.Vendor}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: THE COMPREHENSIVE DOSSIER
  // ==========================================
  return (
    <div className="bg-white rounded-xl shadow-[8px_8px_0px_0px_#0f172a] border-2 border-slate-900 overflow-hidden relative">
      {/* Top Banner accent */}
      <div className="h-4 w-full bg-[color:#00A35D] border-b-2 border-slate-900"></div>
      
      <div className="p-10">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-10 border-b-2 border-slate-200 pb-8">
          <div>
            <div className="text-[color:#00A35D] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <span>{activeVendor.Category}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{activeVendor['Layer Name']}</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">{activeVendor.Vendor}</h2>
          </div>
          <button 
            onClick={() => setManualSelect(null)}
            className="text-slate-400 hover:text-slate-800 font-bold underline text-sm transition-colors"
          >
            Clear Selection ✕
          </button>
        </div>

        {/* Executive Summary */}
        <div className="mb-12">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-[color:#00A35D] pl-3 mb-4">Executive Summary</h4>
          <p className="text-xl text-slate-700 leading-relaxed font-medium bg-slate-50 p-6 rounded-lg border border-slate-200">
            {activeVendor['Core Differentiator']}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Business & Operations */}
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mb-6">Business & Operational Context</h4>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Target Organization</span>
                <span className="text-sm text-slate-900 font-black">{activeVendor['Target Size']}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Maturity Phase Alignment</span>
                <span className="text-sm text-[color:#00A35D] font-black uppercase tracking-widest bg-[color:#19C37A]/10 px-3 py-1 rounded">
                  {activeVendor['Maturity Phase']} Phase
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Deployment Friction</span>
                <span className={`text-xs font-black px-3 py-1.5 rounded uppercase tracking-wider border-2 ${
                  activeVendor['Deployment Friction'] === 'Low' ? 'bg-green-100 text-green-800 border-green-300' : 
                  activeVendor['Deployment Friction'] === 'Medium' ? 'bg-amber-100 text-amber-800 border-amber-300' : 
                  'bg-red-100 text-red-800 border-red-300'
                }`}>
                  {activeVendor['Deployment Friction']} Friction
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Est. Budget Bracket</span>
                <span className="text-sm text-slate-900 font-black">{getEstimatedBudget(activeVendor['Maturity Phase'])}</span>
              </div>
            </div>
            
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mt-10 mb-6">Architectural Footprint</h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
              <div className="mb-4">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Standard Deployment Model</div>
                <div className="text-sm font-bold text-slate-800">{getDeploymentModel(activeVendor['Layer Name'])}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Data Residency Impact</div>
                <div className="text-sm font-bold text-slate-800">{activeVendor['Deployment Friction'] === 'Low' ? 'Minimal (API/Metadata only)' : 'High (Requires inline data processing or agent deployment)'}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Technical Scoring */}
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mb-6">Functional Capabilities</h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <ScoreBar label="Identity Brokering & NHI" score={activeVendor['Identity Score']} color="bg-blue-500" />
              <ScoreBar label="Data Discovery & Prompt DLP" score={activeVendor['Data Score']} color="bg-purple-500" />
              <ScoreBar label="Runtime AI Defense (CNAPP/CSPM)" score={activeVendor['Runtime Score']} color="bg-[color:#00A35D]" />
              <ScoreBar label="Compliance, Audit & GRC" score={activeVendor['Governance Score']} color="bg-slate-800" />
              
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-bold text-center tracking-widest mb-2">Capability Overview</div>
                <p className="text-xs text-slate-600 text-center leading-relaxed">
                  Scoring is aggregated based on architectural completeness, enterprise scalability, and native AI integration depth. High scores indicate a primary system of record for that domain.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
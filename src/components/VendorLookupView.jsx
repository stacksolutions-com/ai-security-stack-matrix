import React, { useState, useEffect } from 'react';

export default function VendorLookupView({ data }) {
  const [manualSelect, setManualSelect] = useState(null);
  
  const displayData = data.filter(v => v && v.Vendor && !v.isDimmed);

  useEffect(() => {
    if (displayData.length === 1) {
      setManualSelect(displayData[0]);
    } else if (manualSelect && !displayData.find(v => v.Vendor === manualSelect.Vendor)) {
      setManualSelect(null);
    }
  }, [displayData, manualSelect]);

  let activeVendor = manualSelect;
  if (!activeVendor && displayData.length === 1) {
    activeVendor = displayData[0];
  }

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

  // Calculate overall confidence based on the 1-5 metadata scores
  const calculateConfidence = (v) => {
    const scores = [
      parseInt(v['Conf: Size']), parseInt(v['Conf: Cost']), 
      parseInt(v['Conf: Friction']), parseInt(v['Conf: Differentiator']), 
      parseInt(v['Conf: Scores'])
    ].filter(n => !isNaN(n));
    
    if (scores.length === 0) return 0;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    return Math.round((avg / 5) * 100); // Return as percentage
  };

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

  const confidenceScore = calculateConfidence(activeVendor);

  return (
    <div className="bg-white rounded-xl shadow-[8px_8px_0px_0px_#0f172a] border-2 border-slate-900 overflow-hidden relative">
      <div className="h-4 w-full bg-[color:#00A35D] border-b-2 border-slate-900"></div>
      
      <div className="p-10">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8 border-b-2 border-slate-200 pb-8">
          <div>
            <div className="text-[color:#00A35D] font-black uppercase tracking-widest mb-2 flex items-center gap-2">
              <span>{activeVendor.Category}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{activeVendor['Layer Name']}</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-4">{activeVendor.Vendor}</h2>
            
            {/* Company Profile Snapshot */}
            <div className="flex flex-wrap gap-4 text-sm">
              {activeVendor.Founded && (
                <div className="bg-slate-100 border border-slate-300 px-3 py-1 rounded text-slate-700 font-bold">
                  🏢 Est. {activeVendor.Founded}
                </div>
              )}
              {activeVendor.HQ && (
                <div className="bg-slate-100 border border-slate-300 px-3 py-1 rounded text-slate-700 font-bold">
                  📍 {activeVendor.HQ}
                </div>
              )}
              {activeVendor.Funding && (
                <div className="bg-green-50 border border-green-200 px-3 py-1 rounded text-green-800 font-bold">
                  💰 {activeVendor.Funding}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-3">
            <button 
              onClick={() => setManualSelect(null)}
              className="text-slate-400 hover:text-slate-800 font-bold underline text-sm transition-colors mb-2"
            >
              Clear Selection ✕
            </button>
            
            {/* Analyst Confidence Index */}
            <div className="text-right bg-slate-900 p-3 rounded-lg border border-slate-700 w-48 shadow-inner">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Analyst Confidence</div>
              <div className="flex items-center justify-end gap-3">
                <div className="text-2xl font-black text-white">{confidenceScore}%</div>
                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${confidenceScore > 80 ? 'bg-[color:#00A35D]' : confidenceScore > 60 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${confidenceScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-10">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-l-4 border-[color:#00A35D] pl-3 mb-4">Core Architectural Differentiator</h4>
          <p className="text-lg text-slate-700 leading-relaxed font-medium bg-slate-50 p-6 rounded-lg border border-slate-200">
            {activeVendor['Core Differentiator']}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Business & Operations */}
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mb-6">Deployment & Cost Profile</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Target Organization</span>
                <span className="text-sm text-slate-900 font-black text-right">{activeVendor['Target Size']}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Maturity Phase Alignment</span>
                <span className="text-sm text-[color:#00A35D] font-black uppercase tracking-widest bg-[color:#19C37A]/10 px-3 py-1 rounded border border-[color:#19C37A]/30">
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
              {activeVendor['Cost Profile'] && (
                <div className="flex justify-between items-center py-3 border-b border-slate-100">
                  <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Cost Profile Indicator</span>
                  <span className="text-lg text-slate-900 font-black tracking-widest">{activeVendor['Cost Profile']}</span>
                </div>
              )}
            </div>
            
            {/* Ecosystem & Integrations */}
            {activeVendor['Integrates With'] && (
              <>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mt-10 mb-6">Known Integrations Ecosystem</h4>
                <div className="flex flex-wrap gap-2">
                  {activeVendor['Integrates With'].split(',').map((integration, idx) => (
                    <span key={idx} className="bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold">
                      🔌 {integration.trim()}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Column: Technical Scoring */}
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b-2 border-slate-900 pb-3 mb-6">Functional Capabilities</h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <ScoreBar label="Identity Brokering & NHI" score={activeVendor['Identity Score']} color="bg-blue-500" />
              <ScoreBar label="Data Discovery & Prompt DLP" score={activeVendor['Data Score']} color="bg-purple-500" />
              <ScoreBar label="Runtime AI Defense (CNAPP/CSPM)" score={activeVendor['Runtime Score']} color="bg-[color:#00A35D]" />
              <ScoreBar label="Compliance, Audit & GRC" score={activeVendor['Governance Score']} color="bg-slate-800" />
              
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-1 rounded uppercase font-bold">Internal Data Note</span>
                <p className="text-xs text-slate-500 mt-2 italic">
                  Data last verified in {activeVendor['Last Verified'] || '2025-Q1'}. Scores are evaluated on enterprise scale requirements.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
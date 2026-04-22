import React, { useMemo } from 'react';

export default function QuadrantView({ data }) {
  const plotData = useMemo(() => {
    const validData = data.filter(v => v && v.Vendor);

    return validData.map((v, i) => {
      let visionScore = 50;
      if (v['Category'] === 'AI-Native Startup') visionScore = 75 + (i % 20); 
      if (v['Category'] === 'Platform Security') visionScore = 50 + (i % 15); 
      if (v['Category'] === 'Big Platform') visionScore = 20 + (i % 25); 

      if (v['Maturity Phase'] === 'Run') visionScore += 10;
      if (v['Maturity Phase'] === 'Crawl') visionScore -= 10;

      let execScore = 40;
      if (v['Target Size']?.includes('Enterprise')) execScore += 30;
      if (v['Target Size'] === 'SMB') execScore -= 20;

      if (v['Deployment Friction'] === 'Low') execScore += 15;
      if (v['Deployment Friction'] === 'High') execScore -= 10;

      const avgCap = (parseInt(v['Identity Score'])||0 + parseInt(v['Data Score'])||0 + parseInt(v['Runtime Score'])||0 + parseInt(v['Governance Score'])||0) / 4;
      execScore += (avgCap * 0.2); 

      const vendorName = v.Vendor || "";
      const jitterX = ((vendorName.length * 3) % 12) - 6;
      const jitterY = ((i * 7) % 12) - 6;

      return { 
        ...v, 
        x: Math.min(Math.max(visionScore + jitterX, 8), 92), 
        y: Math.min(Math.max(execScore + jitterY, 8), 92) 
      };
    });
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-slate-800">Architectural Deployment Matrix</h3>
        <p className="text-slate-500 text-sm mt-1">Evaluated by Enterprise Scalability (Vertical) vs. AI-Native Architecture (Horizontal)</p>
      </div>
      
      {/* Changed to a wider aspect ratio so it looks great on full-screen monitors */}
      <div className="relative w-full aspect-video min-h-[600px] max-h-[800px] border-l-2 border-b-2 border-slate-800 bg-white">
        
        {/* Cleaned up Quadrants with descriptions */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          
          {/* Top Left */}
          <div className="border-r border-b border-slate-200 bg-slate-50/50 relative p-6">
            <div className="text-slate-500 font-bold uppercase tracking-widest text-sm">Established Platforms</div>
            <div className="text-slate-400 text-xs mt-1 max-w-[250px]">Highly scalable, but AI features are bolted onto legacy architecture.</div>
          </div>
          
          {/* Top Right */}
          <div className="border-b border-slate-200 bg-blue-50/30 relative p-6 text-right flex flex-col items-end">
            <div className="text-blue-700 font-bold uppercase tracking-widest text-sm">Enterprise AI-Native</div>
            <div className="text-blue-600/70 text-xs mt-1 max-w-[250px]">Built specifically for AI environments with seamless enterprise governance.</div>
          </div>
          
          {/* Bottom Left */}
          <div className="border-r border-slate-200 bg-white relative p-6 flex flex-col justify-end">
            <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Legacy Point Solutions</div>
            <div className="text-slate-300 text-xs mt-1 max-w-[250px]">Niche tools lacking both modern AI capabilities and broad scalability.</div>
          </div>
          
          {/* Bottom Right */}
          <div className="bg-purple-50/30 relative p-6 flex flex-col justify-end items-end text-right">
            <div className="text-purple-700 font-bold uppercase tracking-widest text-sm">Emerging AI Startups</div>
            <div className="text-purple-500/70 text-xs mt-1 max-w-[250px]">Cutting-edge AI protections, but may require heavy engineering to deploy.</div>
          </div>
        </div>
        
        {/* Data Points */}
        {plotData.map((v, i) => (
          <div key={i} className={`absolute transition-all duration-500 ${v.isDimmed ? 'opacity-15 grayscale pointer-events-none z-0' : 'group cursor-pointer z-10 hover:z-50'}`} style={{ left: `${v.x}%`, bottom: `${v.y}%` }}>
            <div className={`absolute -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-md transition-colors ${v.isDimmed ? 'bg-slate-400' : 'bg-slate-800 group-hover:bg-blue-600'}`}></div>
            <div className={`absolute top-1/2 -translate-y-1/2 left-3 text-xs font-bold whitespace-nowrap drop-shadow-sm pointer-events-none transition-colors ${v.isDimmed ? 'text-slate-400' : 'text-slate-700 group-hover:text-blue-700'}`}>{v.Vendor}</div>
            
            {!v.isDimmed && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-slate-900 text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 shadow-xl w-64 pointer-events-none transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border border-slate-700 text-left z-50">
                <div className="font-bold text-base border-b border-slate-700 pb-1 mb-2">{v.Vendor}</div>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div className="text-slate-400">Target Size:</div><div className="font-semibold text-right text-blue-300">{v['Target Size']}</div>
                  <div className="text-slate-400">Friction:</div><div className="font-semibold text-right">{v['Deployment Friction']}</div>
                </div>
                <div className="text-xs text-slate-300 italic pt-2 border-t border-slate-700">{v['Core Differentiator']}</div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
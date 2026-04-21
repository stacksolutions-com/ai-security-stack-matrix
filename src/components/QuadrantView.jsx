import React, { useMemo } from 'react';

export default function QuadrantView({ data }) {
  const plotData = useMemo(() => {
    return data.map((v, i) => {
      // X-Axis: Legacy Architecture vs Purpose-Built AI-Native
      let visionScore = 50;
      if (v['Category'] === 'AI-Native Startup') visionScore = 75 + (i % 20); 
      if (v['Category'] === 'Platform Security') visionScore = 50 + (i % 15); 
      if (v['Category'] === 'Big Platform') visionScore = 20 + (i % 25); 

      if (v['Maturity Phase'] === 'Run') visionScore += 10;
      if (v['Maturity Phase'] === 'Crawl') visionScore -= 10;

      // Y-Axis: Tactical Point Solution vs Enterprise Scalable
      let execScore = 40;
      if (v['Target Size']?.includes('Enterprise')) execScore += 30;
      if (v['Target Size'] === 'SMB') execScore -= 20;

      if (v['Deployment Friction'] === 'Low') execScore += 15;
      if (v['Deployment Friction'] === 'High') execScore -= 10;

      const avgCap = (parseInt(v['Identity Score'])||0 + parseInt(v['Data Score'])||0 + parseInt(v['Runtime Score'])||0 + parseInt(v['Governance Score'])||0) / 4;
      execScore += (avgCap * 0.2); 

      const jitterX = ((v.Vendor.length * 3) % 12) - 6;
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
        <p className="text-slate-500 text-sm mt-1">Evaluated by Enterprise Scalability vs. AI-Native Architecture</p>
      </div>
      <div className="relative w-full aspect-[4/3] max-h-[700px] border-l-2 border-b-2 border-slate-800 bg-white ml-8 mb-8">
        
        {/* Updated Axes */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-bold text-slate-600 tracking-widest uppercase text-sm flex items-center">
          Legacy Architecture <span className="mx-4 text-xl text-slate-300">→</span> Purpose-Built AI-Native
        </div>
        <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 font-bold text-slate-600 tracking-widest uppercase text-sm flex items-center origin-center whitespace-nowrap">
          Tactical Point Solution <span className="mx-4 text-xl text-slate-300">→</span> Enterprise Scalable
        </div>
        
        {/* Updated Quadrant Labels */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="border-r border-b border-slate-200 bg-slate-50/50 relative"><span className="absolute top-4 left-4 text-slate-500 font-bold uppercase tracking-widest text-xs">Incumbent Ecosystems</span></div>
          <div className="border-b border-slate-200 bg-blue-50/30 relative"><span className="absolute top-4 right-4 text-blue-600 font-bold uppercase tracking-widest text-xs">Enterprise AI-Native</span></div>
          <div className="border-r border-slate-200 bg-white relative"><span className="absolute bottom-4 left-4 text-slate-300 font-bold uppercase tracking-widest text-xs">Peripheral Controls</span></div>
          <div className="bg-purple-50/30 relative"><span className="absolute bottom-4 right-4 text-purple-500 font-bold uppercase tracking-widest text-xs">Emerging AI Startups</span></div>
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
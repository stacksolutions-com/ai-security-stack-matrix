import React, { useMemo } from 'react';

export default function QuadrantView({ data }) {
  const plotData = useMemo(() => {
    return data.map(v => {
      let execScore = 30; 
      if (v['Target Size']?.includes('Enterprise')) execScore += 25;
      if (v['Deployment Friction'] === 'Low') execScore += 15;
      if (v['Deployment Friction'] === 'Medium') execScore += 5;
      const avgCap = (parseInt(v['Identity Score'])||0 + parseInt(v['Data Score'])||0 + parseInt(v['Runtime Score'])||0 + parseInt(v['Governance Score'])||0) / 4;
      execScore += (avgCap * 0.4); 

      let visionScore = 30; 
      if (v['Category'] === 'AI-Native Startup') visionScore += 40; 
      if (v['Category'] === 'Platform Security') visionScore += 15;
      if (v['Category'] === 'Big Platform') visionScore += 5;
      if (v['Maturity Phase'] === 'Walk' || v['Maturity Phase'] === 'Run') visionScore += 15;

      const jitterX = (Math.random() - 0.5) * 5;
      const jitterY = (Math.random() - 0.5) * 5;

      return { ...v, x: Math.min(Math.max(visionScore + jitterX, 5), 95), y: Math.min(Math.max(execScore + jitterY, 5), 95) };
    });
  }, [data]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
      <div className="mb-6"><h3 className="text-2xl font-bold text-slate-800">Market Capability Matrix</h3><p className="text-slate-500 text-sm mt-1">Evaluated by Enterprise Readiness vs. AI-Native Vision</p></div>
      <div className="relative w-full aspect-[4/3] max-h-[700px] border-l-2 border-b-2 border-slate-800 bg-white ml-8 mb-8">
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-bold text-slate-600 tracking-widest uppercase text-sm flex items-center">Completeness of AI Vision <span className="ml-2 text-xl">→</span></div>
        <div className="absolute top-1/2 -left-12 -translate-y-1/2 -rotate-90 font-bold text-slate-600 tracking-widest uppercase text-sm flex items-center origin-center whitespace-nowrap">Ability to Execute <span className="ml-2 text-xl">→</span></div>
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          <div className="border-r border-b border-slate-200 bg-slate-50/50 relative"><span className="absolute top-4 left-4 text-slate-400 font-bold uppercase tracking-widest">Challengers</span></div>
          <div className="border-b border-slate-200 bg-blue-50/30 relative"><span className="absolute top-4 right-4 text-blue-300 font-bold uppercase tracking-widest">Leaders</span></div>
          <div className="border-r border-slate-200 bg-white relative"><span className="absolute bottom-4 left-4 text-slate-300 font-bold uppercase tracking-widest">Niche Players</span></div>
          <div className="bg-purple-50/30 relative"><span className="absolute bottom-4 right-4 text-purple-300 font-bold uppercase tracking-widest">Visionaries</span></div>
        </div>
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
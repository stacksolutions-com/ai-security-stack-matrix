import React from 'react';

export default function VendorLookupView({ data }) {
  // Only show vendors that match the active search (or all if search is empty)
  const displayData = data.filter(v => v && v.Vendor && !v.isDimmed);

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-slate-900 p-8">
      <div className="mb-6 border-b-2 border-slate-900 pb-4">
        <h3 className="text-2xl font-bold text-slate-800">Vendor Deep Dive</h3>
        <p className="text-slate-500 text-sm mt-1">Detailed architectural intelligence and capabilities.</p>
      </div>

      {displayData.length === 0 ? (
        <div className="text-center py-12 text-slate-500 font-bold">No vendors match your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayData.map((v, i) => (
            <div key={i} className="border-2 border-slate-900 rounded-lg p-5 flex flex-col bg-slate-50 hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-[color:#00A35D]"></div>
              
              <div className="flex justify-between items-start mb-3 pl-3">
                <div>
                  <h4 className="font-bold text-lg text-slate-900 leading-tight">{v.Vendor}</h4>
                  <span className="text-[color:#00A35D] text-xs font-bold uppercase tracking-widest">{v.Category}</span>
                </div>
                <div className="bg-white border-2 border-slate-900 px-2 py-1 rounded text-xs font-bold text-slate-700 whitespace-nowrap">
                  {v['Layer Name']?.split(':')[0]}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 pl-3">
                <div className="bg-white border-2 border-slate-200 rounded p-2">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Target Size</div>
                  <div className="text-xs font-bold text-slate-700">{v['Target Size']}</div>
                </div>
                <div className="bg-white border-2 border-slate-200 rounded p-2">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Friction</div>
                  <div className="text-xs font-bold text-slate-700">{v['Deployment Friction']}</div>
                </div>
              </div>

              <div className="pl-3 flex-grow">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Core Differentiator</div>
                <p className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-[color:#19C37A] pl-2">"{v['Core Differentiator']}"</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import ControlPanel from './components/ControlPanel';
import SwimlaneView from './components/SwimlaneView';
import QuadrantView from './components/QuadrantView';
import StackAnalyzer from './components/StackAnalyzer';

export default function App() {
  const [rawVendors, setRawVendors] = useState(null);
  const [overlaps, setOverlaps] = useState(null);
  const [activeTab, setActiveTab] = useState('swimlane');
  const [filterSize, setFilterSize] = useState('All');
  const [filterFriction, setFilterFriction] = useState('All');

  // Load from public folder instead of Google Sheets for the initial build
  useEffect(() => {
    Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/Vendors.csv`).then(r => r.text()),
      fetch(`${import.meta.env.BASE_URL}data/Overlap_Details.csv`).then(r => r.text())
    ]).then(([vendorsCsv, overlapsCsv]) => {
      Papa.parse(vendorsCsv, { header: true, skipEmptyLines: true, complete: (res) => setRawVendors(res.data) });
      Papa.parse(overlapsCsv, { header: true, skipEmptyLines: true, complete: (res) => setOverlaps(res.data) });
    }).catch(err => console.error("Error loading CSVs:", err));
  }, []);

  const vendors = React.useMemo(() => {
    if (!rawVendors) return null;
    return rawVendors.map(v => {
      const matchSize = filterSize === 'All' || (v['Target Size'] && v['Target Size'].includes(filterSize));
      const matchFriction = filterFriction === 'All' || v['Deployment Friction'] === filterFriction;
      return { ...v, isDimmed: !(matchSize && matchFriction) };
    });
  }, [rawVendors, filterSize, filterFriction]);

  if (!vendors || !overlaps) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-xl text-slate-800">Loading Stack Solutions Database...</div>;
  }

  return (
    <div className="w-full max-w-[96vw] mx-auto p-6 text-[color:#707070] font-sans">
      <header className="mb-6 flex justify-between items-center border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-6">
          {/* Brand Logo */}
          <img
            src={`${import.meta.env.BASE_URL}stack-solutions-logo.png`}
            alt="stack solutions"
            className="h-48 w-auto object-contain"
          />
          {/* Light Gray Title Text */}
          <h1 className="text-3xl font-bold text-[color:#707070]">AI Security Stack Matrix</h1>
        </div>

        {/* Branded Tab Navigation */}
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('swimlane')}
            className={`px-4 py-2 rounded font-bold text-sm transition-colors border-2 ${activeTab === 'swimlane' ? 'bg-[color:#00A35D] text-white shadow-md border-[color:#19C37A]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent'}`}>
            Architecture Swimlanes
          </button>
          <button
            onClick={() => setActiveTab('quadrant')}
            className={`px-4 py-2 rounded font-bold text-sm transition-colors border-2 ${activeTab === 'quadrant' ? 'bg-[color:#00A35D] text-white shadow-md border-[color:#19C37A]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent'}`}>
            Market Quadrant
          </button>
          <button
            onClick={() => setActiveTab('conflict')}
            className={`px-4 py-2 rounded font-bold text-sm transition-colors border-2 ${activeTab === 'conflict' ? 'bg-[color:#00A35D] text-white shadow-md border-[color:#19C37A]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent'}`}>
            ⚡ Stack Analyzer
          </button>
        </div>
      </header>

      <ControlPanel
        filterSize={filterSize} setFilterSize={setFilterSize}
        filterFriction={filterFriction} setFilterFriction={setFilterFriction}
        totalTools={rawVendors.length} activeCount={vendors.filter(v => !v.isDimmed).length}
      />

      {activeTab === 'swimlane' && <SwimlaneView data={vendors} />}
      {activeTab === 'quadrant' && <QuadrantView data={vendors} />}
      {activeTab === 'conflict' && <StackAnalyzer vendors={vendors} overlaps={overlaps} />}
    </div>
  );
}
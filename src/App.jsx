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
      fetch('/data/Vendors.csv').then(res => res.text()),
      fetch('/data/Overlap_Details.csv').then(res => res.text())
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
    <div className="max-w-7xl mx-auto p-6 text-slate-900 font-sans">
      <header className="mb-6 flex justify-between items-end border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">AI Security Stack Matrix</h1>
          <div className="mt-4 flex space-x-2">
            <button onClick={() => setActiveTab('swimlane')} className={`px-4 py-2 rounded font-bold text-sm ${activeTab === 'swimlane' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>Architecture Swimlanes</button>
            <button onClick={() => setActiveTab('quadrant')} className={`px-4 py-2 rounded font-bold text-sm ${activeTab === 'quadrant' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>Market Quadrant</button>
            <button onClick={() => setActiveTab('conflict')} className={`px-4 py-2 rounded font-bold text-sm ${activeTab === 'conflict' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600'}`}>⚡ Stack Analyzer</button>
          </div>
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
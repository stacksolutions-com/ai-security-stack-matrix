import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import ControlPanel from './components/ControlPanel';
import SwimlaneView from './components/SwimlaneView';
import QuadrantView from './components/QuadrantView';
import StackAnalyzer from './components/StackAnalyzer';
import VendorLookupView from './components/VendorLookupView';

// DIRECT EXPORT PIPELINE (Bypasses Google Workspace HTML Login Walls)
const VENDORS_SHEET_URL = "https://docs.google.com/spreadsheets/d/1LAxQKNjZ0S4qpxfFgqQmDtzqajAhXUw2Oi3w2PwO9_8/export?format=csv&gid=351895849";
const OVERLAPS_SHEET_URL = "https://docs.google.com/spreadsheets/d/1LAxQKNjZ0S4qpxfFgqQmDtzqajAhXUw2Oi3w2PwO9_8/export?format=csv&gid=388223364";

export default function App() {
  const [rawVendors, setRawVendors] = useState(null);
  const [overlaps, setOverlaps] = useState(null);
  const [activeTab, setActiveTab] = useState('swimlane');
  const [filterSize, setFilterSize] = useState('All');
  const [filterFriction, setFilterFriction] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch(VENDORS_SHEET_URL).then(res => {
        if (!res.ok) throw new Error("Network fetch failed.");
        return res.text();
      }),
      fetch(OVERLAPS_SHEET_URL).then(res => {
        if (!res.ok) throw new Error("Network fetch failed.");
        return res.text();
      })
    ]).then(([vendorsRaw, overlapsRaw]) => {
      
      if (vendorsRaw.trim().toLowerCase().startsWith('<!doctype html>') || vendorsRaw.toLowerCase().includes('<html')) {
        throw new Error("Google Sheets Access Denied. Make sure the document's General Access is set to 'Anyone with the link'.");
      }

      // Strip invisible Byte Order Marks (BOM)
      const vendorsCsv = vendorsRaw.replace(/^\uFEFF/, '').trim();
      const overlapsCsv = overlapsRaw.replace(/^\uFEFF/, '').trim();

      Papa.parse(vendorsCsv, { 
        header: true, 
        skipEmptyLines: true, 
        complete: (res) => {
          if(res.data.length > 0) {
            const firstRowKeys = Object.keys(res.data[0]);
            if (!firstRowKeys.includes('Vendor')) {
              setErrorMessage(`Data format error: Could not find the 'Vendor' column. Check that 'Vendor' is in Cell A1.`);
              return;
            }
          }
          setRawVendors(res.data);
        }
      });
      
      Papa.parse(overlapsCsv, { 
        header: true, 
        skipEmptyLines: true, 
        complete: (res) => setOverlaps(res.data) 
      });

    }).catch(err => {
      console.error("Live Sheets Error:", err);
      setErrorMessage(err.message || "Failed to fetch data from Google Sheets.");
    });
  }, []);

  const vendors = React.useMemo(() => {
    if (!rawVendors) return null;
    return rawVendors.map(v => {
      const matchSize = filterSize === 'All' || (v['Target Size'] && v['Target Size'].includes(filterSize));
      const matchFriction = filterFriction === 'All' || v['Deployment Friction'] === filterFriction;
      const matchSearch = searchQuery === '' || (v.Vendor && v.Vendor.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return { ...v, isDimmed: !(matchSize && matchFriction && matchSearch) };
    });
  }, [rawVendors, filterSize, filterFriction, searchQuery]);

  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 font-sans">
        <div className="bg-white border-2 border-red-500 rounded-xl shadow-[8px_8px_0px_0px_#ef4444] p-10 max-w-2xl text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-slate-800 mb-4">Database Connection Failed</h2>
          <p className="text-red-700 font-bold bg-red-50 p-4 rounded-lg border border-red-200">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  if (!vendors || !overlaps) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-xl text-slate-800">Syncing Live Intelligence Database...</div>;
  }

  return (
    <div className="w-full max-w-[96vw] mx-auto p-6 text-[color:#707070] font-sans">
      <header className="mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center border-b-2 border-slate-900 pb-4 gap-4">
        <div className="flex items-center space-x-6">
          <img
            src={`${import.meta.env.BASE_URL}stack-solutions-logo.png`}
            alt="stack solutions"
            className="h-48 w-auto object-contain"
          />
          <h1 className="text-3xl font-bold text-[color:#707070]">AI Security Stack Matrix</h1>
        </div>

        <div className="flex flex-col items-end gap-3 w-full lg:w-auto">
          <input 
            type="text" 
            placeholder="Search for a vendor..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border-2 border-slate-900 rounded-lg w-full md:w-72 focus:outline-none focus:border-[color:#00A35D] shadow-sm font-bold text-slate-700"
          />
          
          <div className="flex flex-wrap justify-end gap-2">
            <button
              onClick={() => setActiveTab('swimlane')}
              className={`px-4 py-2 rounded font-bold text-sm transition-colors border-2 ${activeTab === 'swimlane' ? 'bg-[color:#00A35D] text-white shadow-md border-[color:#19C37A]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-900'}`}>
              Architecture Swimlanes
            </button>
            <button
              onClick={() => setActiveTab('quadrant')}
              className={`px-4 py-2 rounded font-bold text-sm transition-colors border-2 ${activeTab === 'quadrant' ? 'bg-[color:#00A35D] text-white shadow-md border-[color:#19C37A]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-900'}`}>
              Market Quadrant
            </button>
            <button
              onClick={() => setActiveTab('conflict')}
              className={`px-4 py-2 rounded font-bold text-sm transition-colors border-2 ${activeTab === 'conflict' ? 'bg-[color:#00A35D] text-white shadow-md border-[color:#19C37A]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-900'}`}>
              ⚡ Stack Analyzer
            </button>
            <button 
              onClick={() => setActiveTab('lookup')} 
              className={`px-4 py-2 rounded font-bold text-sm transition-colors border-2 ${activeTab === 'lookup' ? 'bg-[color:#00A35D] text-white shadow-md border-[color:#19C37A]' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-900'}`}>
              🔍 Vendor Lookup
            </button>
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
      {activeTab === 'lookup' && <VendorLookupView data={vendors} />}
    </div>
  );
}
import React from 'react';

export default function ControlPanel({ filterSize, setFilterSize, filterFriction, setFilterFriction, totalTools, activeCount }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-sm flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <span className="font-bold text-slate-400 uppercase tracking-widest text-xs flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
          </svg>
          Filter Landscape
        </span>
        
        <select value={filterSize} onChange={e => setFilterSize(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm">
          <option value="All">Target Size: All Organizations</option>
          <option value="SMB">SMB Focused</option>
          <option value="Mid-Market">Mid-Market Focused</option>
          <option value="Enterprise">Enterprise Grade</option>
        </select>

        <select value={filterFriction} onChange={e => setFilterFriction(e.target.value)} className="bg-slate-50 border border-slate-300 text-slate-700 text-sm font-medium rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 shadow-sm">
          <option value="All">Deployment Friction: Any</option>
          <option value="Low">Low Friction (API/SaaS)</option>
          <option value="Medium">Medium Friction</option>
          <option value="High">High Friction (Agents)</option>
        </select>
      </div>
      
      <div className="text-sm font-bold text-slate-500">
        Showing <span className="text-blue-600 text-lg px-1">{activeCount}</span> of {totalTools} tools
      </div>
    </div>
  );
}
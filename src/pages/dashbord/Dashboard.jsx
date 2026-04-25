<<<<<<< HEAD
import React from 'react';
import { Calendar, FileDown, AlertCircle, Box, FileText, UserPlus } from 'lucide-react';

const Dashboard = () => {
=======
import React, { useState } from 'react';
import { Calendar, FileDown, AlertCircle, Box, FileText, UserPlus, Loader2 } from 'lucide-react';
import { exportFullReportPdf } from '@/services/reports.service';

function formatToday() {
  const today = new Date();
  const month = `${today.getMonth() + 1}`.padStart(2, '0');
  const day = `${today.getDate()}`.padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

const Dashboard = () => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportMessage, setExportMessage] = useState('');
  const [exportError, setExportError] = useState('');

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setExportMessage('');
    setExportError('');

    try {
      const reportDate = formatToday();
      const fileBlob = await exportFullReportPdf(reportDate);
      const objectUrl = URL.createObjectURL(fileBlob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = `full-report-${reportDate}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
      setExportMessage('PDF downloaded successfully.');
    } catch (err) {
      setExportError(err.message || 'Unable to export PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

>>>>>>> ffc9429 (initial frontend commit)
  return (
    <div className="p-4 md:p-8 bg-[#f8faff] min-h-screen font-sans text-slate-900">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">Operational Overview</p>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Dashboard</h1>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#dee7ff] text-[#3e63dd] px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition hover:bg-[#cfdbff]">
            <Calendar size={14} /> <span className="whitespace-nowrap">Last 30 Days</span>
          </button>
<<<<<<< HEAD
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#dee7ff] text-[#3e63dd] px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition hover:bg-[#cfdbff]">
            <FileDown size={14} /> <span className="whitespace-nowrap">Export PDF</span>
=======
          <button
            onClick={() => void handleExportPdf()}
            disabled={isExportingPdf}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#dee7ff] text-[#3e63dd] px-3 md:px-4 py-2 rounded-lg font-bold text-xs transition hover:bg-[#cfdbff] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isExportingPdf ? <Loader2 size={14} className="animate-spin" /> : <FileDown size={14} />}
            <span className="whitespace-nowrap">{isExportingPdf ? 'Exporting...' : 'Export PDF'}</span>
>>>>>>> ffc9429 (initial frontend commit)
          </button>
        </div>
      </div>

<<<<<<< HEAD
=======
      {exportError ? (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-600">
          {exportError}
        </div>
      ) : null}

      {exportMessage ? (
        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700">
          {exportMessage}
        </div>
      ) : null}

>>>>>>> ffc9429 (initial frontend commit)
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
        <StatCard label="Total Products" value="12,482" trend="+4.2%" trendColor="text-emerald-500" />
        <StatCard label="Low Stock" value="24" badge="CRITICAL" badgeColor="bg-red-50 text-red-500" />
        <StatCard label="Total Sales" value="$142.8k" />
        <StatCard label="Purchases" value="$89.2k" />
        <div className="col-span-2 md:col-span-1 bg-[#0e52d3] p-4 md:p-5 rounded-2xl shadow-lg shadow-blue-200 text-white flex flex-col justify-between min-h-25">
          <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider">Net Profit</p>
          <h3 className="text-2xl md:text-3xl font-black">$53.6k</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        <div className="lg:col-span-8 bg-white p-5 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <h3 className="font-bold text-lg">Financial Performance</h3>
            <div className="flex gap-4 md:gap-6 text-[10px] md:text-[11px] font-bold text-gray-400">
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Sales</span>
              <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-200"></span> Purchases</span>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between px-2 md:px-4 overflow-hidden">
            {[
              { s: 110, p: 70 }, { s: 150, p: 90 }, { s: 130, p: 85 }, 
              { s: 190, p: 120 }, { s: 170, p: 100 }, { s: 230, p: 140 }, { s: 200, p: 130 }
            ].map((item, i) => (
              <div key={i} className="flex items-end gap-1 md:gap-1.5 h-full">
                <div style={{ height: `${item.p}px` }} className="w-3 md:w-5 bg-blue-100 rounded-t-sm transition-all"></div>
                <div style={{ height: `${item.s}px` }} className="w-3 md:w-5 bg-blue-600 rounded-t-sm transition-all"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-5 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="font-bold text-lg mb-8">Top Velocity Units</h3>
          <div className="space-y-6 flex-1">
            <VelocityItem label="Office Chair v2" sold="1,204" percentage={90} />
            <VelocityItem label="Floating Shelves" sold="945" percentage={75} />
            <VelocityItem label="Pendant Light" sold="812" percentage={65} />
            <VelocityItem label="Ergo Desk Mat" sold="650" percentage={50} />
            <VelocityItem label="Cable Kit" sold="412" percentage={35} />
          </div>
          <button className="w-full mt-8 py-3.5 bg-[#eef3ff] text-[#3e63dd] rounded-xl font-black text-[10px] uppercase tracking-widest transition hover:bg-[#e4ecff]">
            View Sales Report
          </button>
        </div>
      </div>

      <div className="bg-white p-5 md:p-8 rounded-3xl md:rounded-4xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-10">
          <h3 className="font-bold text-lg">Recent Activity</h3>
          <button className="text-blue-600 font-bold text-xs uppercase tracking-wider">See All</button>
        </div>
        <div className="space-y-6 md:space-y-8">
          <ActivityItem icon={<Box size={18} className="text-blue-600"/>} title="Stock Received" sub="Warehouse North • 24 units" time="2m ago" color="bg-blue-50" />
          <ActivityItem icon={<FileText size={18} className="text-emerald-500"/>} title="Invoice Created" sub="Horizon Architecture • $12.4k" time="14m ago" color="bg-emerald-50" />
          <ActivityItem icon={<AlertCircle size={18} className="text-amber-500"/>} title="Low Stock Alert" sub="Brass Fittings • 12 units left" time="1h ago" color="bg-amber-50" />
          <ActivityItem icon={<UserPlus size={18} className="text-slate-500"/>} title="New Supplier" sub="Vertex Supply Co." time="3h ago" color="bg-slate-100" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, trend, trendColor, badge, badgeColor }) => (
  <div className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-25 md:min-h-27.5">
    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate">{label}</p>
    <div className="flex flex-wrap items-baseline gap-1 md:gap-2">
      <h3 className="text-xl md:text-2xl font-black text-slate-800">{value}</h3>
      {trend && <span className={`text-[9px] md:text-[10px] font-bold ${trendColor}`}>{trend}</span>}
      {badge && <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-black tracking-tighter ${badgeColor}`}>{badge}</span>}
    </div>
  </div>
);

const VelocityItem = ({ label, sold, percentage }) => (
  <div className="min-w-0">
    <div className="flex justify-between text-[10px] md:text-[11px] font-bold mb-2">
      <span className="text-slate-500 truncate mr-2">{label}</span>
      <span className="text-blue-600 shrink-0">{sold} sold</span>
    </div>
    <div className="w-full bg-gray-100 h-1.5 rounded-full">
      <div style={{ width: `${percentage}%` }} className="bg-blue-600 h-full rounded-full transition-all duration-700"></div>
    </div>
  </div>
);

const ActivityItem = ({ icon, title, sub, time, color }) => (
  <div className="flex justify-between items-center group cursor-pointer gap-3">
    <div className="flex items-center gap-3 md:gap-5 min-w-0">
      <div className={`${color} p-2.5 md:p-3.5 rounded-xl md:rounded-2xl shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs md:text-sm font-bold text-slate-800 truncate">{title}</p>
        <p className="text-[10px] md:text-xs text-gray-400 font-medium truncate">{sub}</p>
      </div>
    </div>
    <span className="text-[10px] text-gray-300 font-bold shrink-0">{time}</span>
  </div>
);

<<<<<<< HEAD
export default Dashboard;
=======
export default Dashboard;
>>>>>>> ffc9429 (initial frontend commit)

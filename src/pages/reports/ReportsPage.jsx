import { useMemo, useState } from "react";
import { Download, Loader2 } from "lucide-react";
import {
  exportFullReportPdf,
  getActiveSuppliersReport,
  getBestSellingReport,
  getProfitReport,
  getQuantitySoldReport,
} from "@/services/reports.service";

function formatToday() {
  const today = new Date();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

export default function ReportsPage() {
  const [date, setDate] = useState(formatToday);
  const [profitType, setProfitType] = useState("day");
  const [bestLimit, setBestLimit] = useState(10);

  const [profit, setProfit] = useState(null);
  const [quantitySold, setQuantitySold] = useState([]);
  const [bestSelling, setBestSelling] = useState([]);
  const [activeSuppliers, setActiveSuppliers] = useState([]);

  const [loadingKey, setLoadingKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const totalSoldUnits = useMemo(
    () => quantitySold.reduce((sum, item) => sum + Number(item.totalSold || 0), 0),
    [quantitySold],
  );

  const runRequest = async (key, callback) => {
    setLoadingKey(key);
    setError("");
    setSuccess("");

    try {
      await callback();
    } catch (err) {
      setError(err.message || "Unable to load report.");
    } finally {
      setLoadingKey("");
    }
  };

  const handleLoadProfit = async () => {
    await runRequest("profit", async () => {
      const response = await getProfitReport({ type: profitType, date });
      setProfit(Number(response?.profit || 0));
    });
  };

  const handleLoadQuantitySold = async () => {
    await runRequest("quantity", async () => {
      const response = await getQuantitySoldReport({ date });
      setQuantitySold(Array.isArray(response) ? response : []);
    });
  };

  const handleLoadBestSelling = async () => {
    await runRequest("best", async () => {
      const response = await getBestSellingReport({
        limit: Number(bestLimit) || 10,
        date,
      });
      setBestSelling(Array.isArray(response) ? response : []);
    });
  };

  const handleLoadActiveSuppliers = async () => {
    await runRequest("suppliers", async () => {
      const response = await getActiveSuppliersReport({ date });
      setActiveSuppliers(Array.isArray(response) ? response : []);
    });
  };

  const handleExportPdf = async () => {
    await runRequest("pdf", async () => {
      const fileBlob = await exportFullReportPdf(date);
      const objectUrl = URL.createObjectURL(fileBlob);
      const anchor = document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = `full-report-${date}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(objectUrl);
      setSuccess("PDF downloaded successfully.");
    });
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Analytics</p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Reports</h1>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-100 px-3 py-2">
          <span className="text-xs font-semibold text-slate-500">Date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="h-8 border border-slate-200 rounded-lg px-2 text-sm"
          />
        </div>
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-semibold text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="font-bold text-slate-900 mb-4">Profit Report</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            <select
              value={profitType}
              onChange={(event) => setProfitType(event.target.value)}
              className="h-10 border border-slate-200 rounded-lg px-3 text-sm"
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>
            <button
              onClick={() => void handleLoadProfit()}
              className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
              disabled={loadingKey === "profit"}
            >
              {loadingKey === "profit" ? <Loader2 size={14} className="animate-spin" /> : "Load Profit"}
            </button>
          </div>
          <p className="text-3xl font-black text-slate-900">${Number(profit || 0).toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-5">
          <h2 className="font-bold text-slate-900 mb-4">Export PDF</h2>
          <button
            onClick={() => void handleExportPdf()}
            className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold inline-flex items-center gap-2"
            disabled={loadingKey === "pdf"}
          >
            {loadingKey === "pdf" ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            Download Full Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => void handleLoadQuantitySold()}
          className="h-10 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold"
          disabled={loadingKey === "quantity"}
        >
          {loadingKey === "quantity" ? "Loading..." : "Load Quantity Sold"}
        </button>

        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            value={bestLimit}
            onChange={(event) => setBestLimit(event.target.value)}
            className="h-10 border border-slate-200 rounded-lg px-3 text-sm w-24"
          />
          <button
            onClick={() => void handleLoadBestSelling()}
            className="h-10 flex-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold"
            disabled={loadingKey === "best"}
          >
            {loadingKey === "best" ? "Loading..." : "Load Best Selling"}
          </button>
        </div>

        <button
          onClick={() => void handleLoadActiveSuppliers()}
          className="h-10 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold"
          disabled={loadingKey === "suppliers"}
        >
          {loadingKey === "suppliers" ? "Loading..." : "Load Active Suppliers"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ReportCard title="Quantity Sold" subtitle={`Total sold units: ${totalSoldUnits}`} items={quantitySold} />
        <ReportCard title="Best Selling Products" items={bestSelling} />
        <ReportCard title="Most Active Suppliers" items={activeSuppliers} />
      </div>
    </div>
  );
}

function ReportCard({ title, subtitle, items }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5">
      <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
      {subtitle ? <p className="text-xs text-slate-400 mb-4">{subtitle}</p> : <div className="mb-4" />}

      {items.length === 0 ? (
        <p className="text-sm text-slate-400">No data loaded yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => {
            const label = item.productName || item.supplierName || `Item ${index + 1}`;
            const value = Number(item.totalSold || 0);

            return (
              <div key={`${label}-${index}`} className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-sm font-medium text-slate-700 truncate mr-3">{label}</span>
                <span className="text-sm font-bold text-blue-600">{value}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { Bell, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { getAlerts, markAlertAsRead } from "@/services/alerts.service";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const unreadCount = useMemo(
    () => alerts.filter((alert) => !alert.isRead).length,
    [alerts],
  );

  const loadAlerts = async ({ withLoader = true } = {}) => {
    if (withLoader) {
      setLoading(true);
      setError("");
    }

    try {
      const data = await getAlerts();
      setAlerts(data);
    } catch (err) {
      setError(err.message || "Unable to load alerts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAlerts({ withLoader: false });
  }, []);

  const handleMarkAsRead = async (id) => {
    setBusyId(id);

    try {
      await markAlertAsRead(id);
      setAlerts((current) =>
        current.map((alert) =>
          alert.id === id ? { ...alert, isRead: true } : alert,
        ),
      );
    } catch (err) {
      setError(err.message || "Unable to mark alert as read.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
            Monitoring
          </p>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Alerts</h1>
        </div>

        <button
          onClick={() => void loadAlerts()}
          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Total Alerts" value={alerts.length} />
        <StatCard label="Unread Alerts" value={unreadCount} />
        <StatCard
          label="Read Alerts"
          value={Math.max(alerts.length - unreadCount, 0)}
        />
      </div>

      {error ? (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-semibold text-red-600">
          {error}
        </div>
      ) : null}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="h-56 flex items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mr-2" size={18} />
            Loading alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-slate-500">
            <Bell size={24} className="mb-3" />
            No alerts found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 md:p-5 flex flex-col md:flex-row gap-3 md:items-center">
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{alert.message || alert.type}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Product: {alert.product?.name || "Unknown"} | Type: {alert.type}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {alert.createdAt ? new Date(alert.createdAt).toLocaleString() : "-"}
                  </p>
                </div>

                {alert.isRead ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                    <CheckCircle2 size={14} />
                    Read
                  </span>
                ) : (
                  <button
                    onClick={() => void handleMarkAsRead(alert.id)}
                    disabled={busyId === alert.id}
                    className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold disabled:opacity-60"
                  >
                    {busyId === alert.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Mark as Read"
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-4">
      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">{label}</p>
      <p className="text-xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

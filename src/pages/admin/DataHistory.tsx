import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart3, Download, Clock } from "lucide-react";
import { database, ref, onValue } from "@/lib/firebase";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

interface HistoryEntry {
  value: number;
  timestamp: number;
}

const TIME_RANGES = [
  { label: "1 Hour", ms: 60 * 60 * 1000 },
  { label: "24 Hours", ms: 24 * 60 * 60 * 1000 },
  { label: "7 Days", ms: 7 * 24 * 60 * 60 * 1000 },
];

const DataHistory = () => {
  const [tempHistory, setTempHistory] = useState<HistoryEntry[]>([]);
  const [humidHistory, setHumidHistory] = useState<HistoryEntry[]>([]);
  const [range, setRange] = useState(1);

  useEffect(() => {
    const tempRef = ref(database, "temperature_history");
    const humidRef = ref(database, "humidity_history");

    const unsub1 = onValue(tempRef, (snap) => {
      const val = snap.val();
      if (val) setTempHistory(Object.values(val));
      else setTempHistory([]);
    });

    const unsub2 = onValue(humidRef, (snap) => {
      const val = snap.val();
      if (val) setHumidHistory(Object.values(val));
      else setHumidHistory([]);
    });

    return () => { unsub1(); unsub2(); };
  }, []);

  const now = Date.now();
  const cutoff = now - TIME_RANGES[range].ms;

  const filteredTemp = tempHistory.filter((e) => e.timestamp >= cutoff);
  const filteredHumid = humidHistory.filter((e) => e.timestamp >= cutoff);

  // Merge into chart data
  const allTimestamps = [...new Set([
    ...filteredTemp.map((e) => e.timestamp),
    ...filteredHumid.map((e) => e.timestamp),
  ])].sort();

  const chartData = allTimestamps.map((ts) => {
    const t = filteredTemp.find((e) => e.timestamp === ts);
    const h = filteredHumid.find((e) => e.timestamp === ts);
    return {
      time: new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      fullTime: new Date(ts).toLocaleString(),
      temperature: t?.value ?? null,
      humidity: h?.value ?? null,
    };
  });

  const exportCSV = () => {
    const rows = ["Timestamp,Temperature,Humidity"];
    chartData.forEach((d) => {
      rows.push(`${d.fullTime},${d.temperature ?? ""},${d.humidity ?? ""}`);
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ewange-history-${TIME_RANGES[range].label.replace(" ", "-")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass-card p-3 text-xs border border-border">
        <p className="text-muted-foreground mb-1.5">{payload[0]?.payload?.fullTime}</p>
        {payload.map((p: any) => (
          <p key={p.dataKey} style={{ color: p.color }} className="font-mono">
            {p.name}: {p.value}{p.dataKey === "temperature" ? "°C" : "%"}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">Data History</h2>
          <p className="text-sm text-muted-foreground">{chartData.length} data points in selected range</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-muted-foreground text-sm font-medium hover:text-foreground transition-all"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Time Range Toggle */}
      <div className="flex gap-2 mb-6">
        {TIME_RANGES.map((tr, i) => (
          <button
            key={tr.label}
            onClick={() => setRange(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              range === i
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            {tr.label}
          </button>
        ))}
      </div>

      {/* Temperature Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-4"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-warning" />
          Temperature History
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 16%)" />
              <XAxis dataKey="time" tick={{ fill: "hsl(220 12% 50%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(220 12% 50%)", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="temperature"
                name="Temperature"
                stroke="hsl(38 95% 55%)"
                strokeWidth={2}
                dot={false}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            No temperature data in this range
          </div>
        )}
      </motion.div>

      {/* Humidity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-info" />
          Humidity History
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(225 15% 16%)" />
              <XAxis dataKey="time" tick={{ fill: "hsl(220 12% 50%)", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(220 12% 50%)", fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="hsl(210 100% 60%)"
                strokeWidth={2}
                dot={false}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
            No humidity data in this range
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default DataHistory;

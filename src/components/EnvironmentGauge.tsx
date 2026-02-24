import { Thermometer, Droplets } from "lucide-react";
import { motion } from "framer-motion";

interface EnvironmentGaugeProps {
  temperature: number;
  humidity: number;
}

export function EnvironmentGauge({ temperature, humidity }: EnvironmentGaugeProps) {
  const tempPercent = Math.min(100, Math.max(0, (temperature / 50) * 100));
  const humPercent = Math.min(100, Math.max(0, humidity));

  const getTempColor = (t: number) => {
    if (t > 40) return { text: "text-destructive", bar: "bg-destructive", bg: "bg-destructive/10 border-destructive/20" };
    if (t > 30) return { text: "text-warning", bar: "bg-warning", bg: "bg-warning/10 border-warning/20" };
    return { text: "text-primary", bar: "bg-primary", bg: "bg-primary/10 border-primary/20" };
  };

  const tempStyle = getTempColor(temperature);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6 col-span-full lg:col-span-2"
    >
      <span className="section-label">Environment</span>

      <div className="grid grid-cols-2 gap-8 mt-5">
        {/* Temperature */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${tempStyle.bg}`}>
              <Thermometer className={`h-4 w-4 ${tempStyle.text}`} />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Temperature</span>
          </div>
          <div className={`text-3xl font-bold font-mono ${tempStyle.text} transition-colors duration-500`}>
            {temperature}
            <span className="text-lg ml-0.5">°C</span>
          </div>
          <div className="gauge-bar mt-3">
            <div
              className={`gauge-fill ${tempStyle.bar}`}
              style={{ width: `${tempPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground/50 font-mono">0°</span>
            <span className="text-[10px] text-muted-foreground/50 font-mono">50°</span>
          </div>
        </div>

        {/* Humidity */}
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg border bg-primary/10 border-primary/20 flex items-center justify-center">
              <Droplets className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Humidity</span>
          </div>
          <div className="text-3xl font-bold font-mono text-primary">
            {humidity}
            <span className="text-lg ml-0.5">%</span>
          </div>
          <div className="gauge-bar mt-3">
            <div
              className="gauge-fill bg-primary"
              style={{ width: `${humPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground/50 font-mono">0%</span>
            <span className="text-[10px] text-muted-foreground/50 font-mono">100%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { Thermometer, Droplets } from "lucide-react";

interface EnvironmentGaugeProps {
  temperature: number;
  humidity: number;
}

export function EnvironmentGauge({ temperature, humidity }: EnvironmentGaugeProps) {
  const tempPercent = Math.min(100, Math.max(0, (temperature / 50) * 100));
  const humPercent = Math.min(100, Math.max(0, humidity));

  const getTempColor = (t: number) => {
    if (t > 40) return "text-destructive";
    if (t > 30) return "text-warning";
    return "text-primary";
  };

  return (
    <div className="glass-card p-5 animate-fade-in-up col-span-full lg:col-span-2">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Environment</span>

      <div className="grid grid-cols-2 gap-6 mt-4">
        {/* Temperature */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Thermometer className={`h-5 w-5 ${getTempColor(temperature)}`} />
            <span className="text-sm text-muted-foreground">Temperature</span>
          </div>
          <div className={`text-3xl font-bold font-mono ${getTempColor(temperature)}`}>
            {temperature}°C
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${tempPercent}%` }}
            />
          </div>
        </div>

        {/* Humidity */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Humidity</span>
          </div>
          <div className="text-3xl font-bold font-mono text-primary">
            {humidity}%
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${humPercent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

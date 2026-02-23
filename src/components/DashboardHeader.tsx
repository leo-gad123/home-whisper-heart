import { Wifi, WifiOff, Smartphone } from "lucide-react";

interface DashboardHeaderProps {
  connected: boolean;
  lastCommand: string;
}

export function DashboardHeader({ connected, lastCommand }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          E-wange
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">Smart Home Dashboard</p>
      </div>

      <div className="flex items-center gap-4">
        {/* GSM command */}
        <div className="flex items-center gap-2 glass-card px-3 py-2">
          <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">GSM:</span>
          <span className="text-xs font-mono text-foreground">{lastCommand}</span>
        </div>

        {/* Connection status */}
        <div className="flex items-center gap-2 glass-card px-3 py-2">
          {connected ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-success" />
              <span className="text-xs text-success font-medium">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-destructive" />
              <span className="text-xs text-destructive font-medium">Offline</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

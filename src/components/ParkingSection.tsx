import { Car, ChevronUp, ChevronDown, Minus } from "lucide-react";

interface ParkingSectionProps {
  slots: number;
  gateState: string;
}

export function ParkingSection({ slots, gateState }: ParkingSectionProps) {
  const gateIcon = gateState.includes("Open") ? (
    <ChevronUp className="h-5 w-5 text-success" />
  ) : gateState.includes("Closed") || gateState.includes("Being Closed") ? (
    <ChevronDown className="h-5 w-5 text-warning" />
  ) : (
    <Minus className="h-5 w-5 text-muted-foreground" />
  );

  const maxSlots = 5;
  const occupied = maxSlots - slots;

  return (
    <div className="glass-card p-5 animate-fade-in-up">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Parking</span>

      <div className="mt-4 flex items-center gap-3">
        <Car className="h-8 w-8 text-primary" />
        <div>
          <div className="text-2xl font-bold font-mono text-foreground">
            {slots} <span className="text-sm text-muted-foreground font-normal">/ {maxSlots} slots free</span>
          </div>
        </div>
      </div>

      {/* Slot visualization */}
      <div className="flex gap-1.5 mt-3">
        {Array.from({ length: maxSlots }).map((_, i) => (
          <div
            key={i}
            className={`h-3 flex-1 rounded-sm transition-colors duration-500 ${
              i < occupied ? "bg-warning/70" : "bg-success/40"
            }`}
          />
        ))}
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
        {gateIcon}
        <span className="text-sm text-muted-foreground">Gate:</span>
        <span className="text-sm font-mono font-medium text-foreground">{gateState}</span>
      </div>
    </div>
  );
}

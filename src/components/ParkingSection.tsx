import { Car, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6"
    >
      <span className="section-label">Parking</span>

      <div className="mt-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Car className="h-6 w-6 text-primary" />
        </div>
        <div>
          <div className="text-3xl font-bold font-mono text-foreground">
            {slots}
            <span className="text-sm text-muted-foreground font-normal font-sans ml-1.5">/ {maxSlots} free</span>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Available Slots</span>
        </div>
      </div>

      {/* Slot visualization */}
      <div className="flex gap-2 mt-4">
        {Array.from({ length: maxSlots }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
            className={`h-3 flex-1 rounded-lg transition-colors duration-700 ${
              i < occupied
                ? "bg-warning/60 border border-warning/30"
                : "bg-success/30 border border-success/20"
            }`}
          />
        ))}
      </div>
      <div className="flex justify-between mt-1.5 px-0.5">
        <span className="text-[9px] text-muted-foreground/40 font-mono">1</span>
        <span className="text-[9px] text-muted-foreground/40 font-mono">{maxSlots}</span>
      </div>

      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
          gateState.includes("Open")
            ? "bg-success/10 border-success/20"
            : "bg-warning/10 border-warning/20"
        }`}>
          {gateIcon}
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Gate Status</span>
          <span className="text-sm font-mono font-semibold text-foreground">{gateState}</span>
        </div>
      </div>
    </motion.div>
  );
}

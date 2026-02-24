import { Car, CircleParking, ChevronUp, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

interface ParkingSectionProps {
  slots: number;
  gateState: string;
}

export function ParkingSection({ slots, gateState }: ParkingSectionProps) {
  const maxSlots = 2;
  const isGateOpen = gateState.includes("Open");

  // slots value represents free slots; derive per-slot status
  const slotStatuses = Array.from({ length: maxSlots }, (_, i) =>
    i < maxSlots - slots ? "occupied" : "free"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6"
    >
      <span className="section-label">Parking</span>

      {/* Slots */}
      <div className="grid grid-cols-2 gap-3 mt-5">
        {slotStatuses.map((status, i) => {
          const occupied = status === "occupied";
          return (
            <div
              key={i}
              className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-colors duration-500 ${
                occupied
                  ? "bg-warning/10 border-warning/25"
                  : "bg-success/10 border-success/25"
              }`}
            >
              {occupied ? (
                <Car className={`h-6 w-6 text-warning`} />
              ) : (
                <CircleParking className={`h-6 w-6 text-success`} />
              )}
              <span className="text-xs font-semibold font-mono">Slot {i + 1}</span>
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${
                occupied ? "text-warning" : "text-success"
              }`}>
                {occupied ? "Occupied" : "Free"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Gate */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border">
        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${
          isGateOpen ? "bg-success/10 border-success/20" : "bg-warning/10 border-warning/20"
        }`}>
          {isGateOpen ? (
            <ChevronUp className="h-5 w-5 text-success" />
          ) : (
            <ChevronDown className="h-5 w-5 text-warning" />
          )}
        </div>
        <div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Gate</span>
          <span className={`text-sm font-mono font-semibold ${isGateOpen ? "text-success" : "text-warning"}`}>
            {isGateOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

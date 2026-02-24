import { DoorOpen, DoorClosed, ShieldCheck, ShieldAlert, Lock, Unlock } from "lucide-react";
import { motion } from "framer-motion";

interface DoorCardProps {
  label: string;
  access: string;
  doorState: string;
  index?: number;
}

export function DoorCard({ label, access, doorState, index = 0 }: DoorCardProps) {
  const isAuthorized = access === "Authorized";
  const isOpen = doorState === "Open";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card p-6 ${
        !isAuthorized ? "border-destructive/20" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="section-label">{label}</span>
        <div className={isAuthorized ? "status-dot-active" : "status-dot-alert"} />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-500 ${
          isOpen
            ? "bg-warning/10 border border-warning/20"
            : "bg-success/10 border border-success/20"
        }`}>
          {isOpen ? (
            <DoorOpen className="h-6 w-6 text-warning icon-pulse" />
          ) : (
            <DoorClosed className="h-6 w-6 text-success" />
          )}
        </div>
        <div>
          <div className={`text-xl font-semibold font-mono transition-colors duration-500 ${
            isOpen ? "text-warning" : "text-success"
          }`}>
            {doorState}
          </div>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Door State</span>
        </div>
      </div>

      <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors duration-500 ${
        isAuthorized
          ? "bg-success/5 border border-success/10"
          : "bg-destructive/5 border border-destructive/10"
      }`}>
        {isAuthorized ? (
          <ShieldCheck className="h-4 w-4 text-success" />
        ) : (
          <ShieldAlert className="h-4 w-4 text-destructive icon-pulse" />
        )}
        <span className={`text-xs font-semibold ${isAuthorized ? "text-success" : "text-destructive"}`}>
          {access}
        </span>
        <div className="flex-1" />
        {isAuthorized ? (
          <Unlock className="h-3 w-3 text-success/50" />
        ) : (
          <Lock className="h-3 w-3 text-destructive/50" />
        )}
      </div>
    </motion.div>
  );
}

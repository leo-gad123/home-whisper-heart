import { DoorOpen, DoorClosed, ShieldCheck, ShieldAlert } from "lucide-react";

interface DoorCardProps {
  label: string;
  access: string;
  doorState: string;
}

export function DoorCard({ label, access, doorState }: DoorCardProps) {
  const isAuthorized = access === "Authorized";
  const isOpen = doorState === "Open";

  return (
    <div className="glass-card p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className={isAuthorized ? "status-dot-active" : "status-dot-alert"} />
      </div>

      <div className="flex items-center gap-3 mb-3">
        {isOpen ? (
          <DoorOpen className="h-8 w-8 text-warning" />
        ) : (
          <DoorClosed className="h-8 w-8 text-success" />
        )}
        <div>
          <div className={`text-lg font-semibold font-mono ${isOpen ? "text-warning" : "text-success"}`}>
            {doorState}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {isAuthorized ? (
          <ShieldCheck className="h-4 w-4 text-success" />
        ) : (
          <ShieldAlert className="h-4 w-4 text-destructive" />
        )}
        <span className={`text-sm font-medium ${isAuthorized ? "text-success" : "text-destructive"}`}>
          {access}
        </span>
      </div>
    </div>
  );
}

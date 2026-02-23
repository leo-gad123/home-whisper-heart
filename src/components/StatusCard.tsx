import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  icon: LucideIcon;
  value: string | number;
  subtitle?: string;
  status?: "active" | "inactive" | "alert" | "warning";
  className?: string;
}

const statusColors = {
  active: "text-success",
  inactive: "text-muted-foreground",
  alert: "text-destructive",
  warning: "text-warning",
};

const dotClass = {
  active: "status-dot-active",
  inactive: "status-dot-inactive",
  alert: "status-dot-alert",
  warning: "status-dot-alert",
};

export function StatusCard({ title, icon: Icon, value, subtitle, status = "inactive", className = "" }: StatusCardProps) {
  return (
    <div className={`glass-card p-5 animate-fade-in-up ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${statusColors[status]}`} />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
        </div>
        <div className={dotClass[status]} />
      </div>
      <div className={`text-2xl font-semibold font-mono ${statusColors[status]}`}>{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

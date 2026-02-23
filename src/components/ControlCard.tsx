import { LucideIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { database, ref, set } from "@/lib/firebase";

interface ControlCardProps {
  title: string;
  icon: LucideIcon;
  value: string;
  firebaseKey: string;
  onLabel?: string;
  offLabel?: string;
  options?: string[];
}

export function ControlCard({
  title,
  icon: Icon,
  value,
  firebaseKey,
  onLabel = "ON",
  offLabel = "OFF",
  options,
}: ControlCardProps) {
  const isOn = value === onLabel;

  const handleToggle = (checked: boolean) => {
    const dbRef = ref(database, `/${firebaseKey}`);
    set(dbRef, checked ? onLabel : offLabel);
  };

  const handleOptionChange = (option: string) => {
    const dbRef = ref(database, `/${firebaseKey}`);
    set(dbRef, option);
  };

  if (options) {
    return (
      <div className="glass-card p-5 animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`h-4 w-4 ${value !== offLabel ? "text-success" : "text-muted-foreground"}`} />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
        </div>
        <div className="text-2xl font-semibold font-mono text-foreground mb-3">{value}</div>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleOptionChange(opt)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                value === opt
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 animate-fade-in-up">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${isOn ? "text-success" : "text-muted-foreground"}`} />
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</span>
        </div>
        <div className={isOn ? "status-dot-active" : "status-dot-inactive"} />
      </div>
      <div className={`text-2xl font-semibold font-mono mb-3 ${isOn ? "text-success" : "text-muted-foreground"}`}>
        {value}
      </div>
      <Switch checked={isOn} onCheckedChange={handleToggle} />
    </div>
  );
}

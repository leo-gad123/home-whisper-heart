import { LucideIcon, Fan } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { database, ref, set } from "@/lib/firebase";
import { motion } from "framer-motion";

interface ControlCardProps {
  title: string;
  icon: LucideIcon;
  value: string;
  firebaseKey: string;
  onLabel?: string;
  offLabel?: string;
  options?: string[];
  index?: number;
}

export function ControlCard({
  title,
  icon: Icon,
  value,
  firebaseKey,
  onLabel = "ON",
  offLabel = "OFF",
  options,
  index = 0,
}: ControlCardProps) {
  const isOn = value === onLabel;
  const isFan = Icon === Fan;

  const handleToggle = (checked: boolean) => {
    const dbRef = ref(database, `/${firebaseKey}`);
    set(dbRef, checked ? onLabel : offLabel);
  };

  const handleOptionChange = (option: string) => {
    const dbRef = ref(database, `/${firebaseKey}`);
    set(dbRef, option);
  };

  const iconClass = () => {
    if (isFan && isOn) return "icon-spin";
    if (isOn) return "icon-glow";
    return "";
  };

  if (options) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors duration-500 ${
            value !== offLabel
              ? "bg-success/10 border-success/20"
              : "bg-muted/50 border-border"
          }`}>
            <Icon className={`h-4 w-4 transition-colors duration-500 ${
              value !== offLabel ? "text-success" : "text-muted-foreground"
            }`} />
          </div>
          <span className="section-label">{title}</span>
        </div>
        <div className={`text-2xl font-bold font-mono mb-4 transition-colors duration-500 ${
          value !== offLabel ? "text-foreground" : "text-muted-foreground"
        }`}>
          {value}
        </div>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleOptionChange(opt)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                value === opt
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-500 ${
            isOn ? "bg-success/10 border-success/20" : "bg-muted/50 border-border"
          }`}>
            <Icon className={`h-4 w-4 transition-colors duration-500 ${
              isOn ? "text-success" : "text-muted-foreground"
            } ${iconClass()}`} />
          </div>
          <span className="section-label">{title}</span>
        </div>
        <div className={isOn ? "status-dot-active" : "status-dot-inactive"} />
      </div>
      <div className={`text-2xl font-bold font-mono mb-4 transition-colors duration-500 ${
        isOn ? "text-success" : "text-muted-foreground"
      }`}>
        {value}
      </div>
      <Switch checked={isOn} onCheckedChange={handleToggle} />
    </motion.div>
  );
}

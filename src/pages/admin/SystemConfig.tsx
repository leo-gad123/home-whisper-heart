import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw, Thermometer, Flame, Car, Bell, Palette, Wrench } from "lucide-react";
import { database, ref, onValue, set } from "@/lib/firebase";
import { toast } from "sonner";

interface SystemSettings {
  temp_threshold: number;
  gas_threshold: string;
  parking_capacity: number;
  alert_sound: boolean;
  manual_override: boolean;
  theme: string;
}

const defaults: SystemSettings = {
  temp_threshold: 35,
  gas_threshold: "HIGH",
  parking_capacity: 2,
  alert_sound: true,
  manual_override: false,
  theme: "dark",
};

const SystemConfig = () => {
  const [settings, setSettings] = useState<SystemSettings>(defaults);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const configRef = ref(database, "system_config");
    const unsub = onValue(configRef, (snap) => {
      const val = snap.val();
      if (val) setSettings({ ...defaults, ...val });
    });
    return () => unsub();
  }, []);

  const updateField = <K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await set(ref(database, "system_config"), settings);
      toast.success("Configuration saved successfully");
      setHasChanges(false);
    } catch {
      toast.error("Failed to save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(defaults);
    setHasChanges(true);
  };

  const configGroups = [
    {
      title: "Temperature Control",
      icon: Thermometer,
      color: "text-warning",
      items: [
        {
          label: "Fan Auto-On Threshold (°C)",
          description: "Fan activates automatically above this temperature",
          render: () => (
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={20}
                max={50}
                value={settings.temp_threshold}
                onChange={(e) => updateField("temp_threshold", Number(e.target.value))}
                className="flex-1 accent-warning"
              />
              <span className="text-sm font-mono text-foreground w-12 text-right">{settings.temp_threshold}°C</span>
            </div>
          ),
        },
      ],
    },
    {
      title: "Gas Alert",
      icon: Flame,
      color: "text-destructive",
      items: [
        {
          label: "Gas Alert Threshold",
          description: "Sensitivity level for gas detection",
          render: () => (
            <div className="flex gap-2">
              {["LOW", "MEDIUM", "HIGH"].map((level) => (
                <button
                  key={level}
                  onClick={() => updateField("gas_threshold", level)}
                  className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all ${
                    settings.gas_threshold === level
                      ? "bg-destructive text-destructive-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          ),
        },
      ],
    },
    {
      title: "Parking",
      icon: Car,
      color: "text-info",
      items: [
        {
          label: "Parking Capacity",
          description: "Maximum number of parking slots",
          render: () => (
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateField("parking_capacity", Math.max(1, settings.parking_capacity - 1))}
                className="w-9 h-9 rounded-lg bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 transition-all"
              >
                −
              </button>
              <span className="text-lg font-mono text-foreground w-8 text-center">{settings.parking_capacity}</span>
              <button
                onClick={() => updateField("parking_capacity", Math.min(10, settings.parking_capacity + 1))}
                className="w-9 h-9 rounded-lg bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 transition-all"
              >
                +
              </button>
            </div>
          ),
        },
      ],
    },
    {
      title: "Alerts & Theme",
      icon: Bell,
      color: "text-accent",
      items: [
        {
          label: "Alert Sound",
          description: "Play sound on gas or security alerts",
          render: () => (
            <button
              onClick={() => updateField("alert_sound", !settings.alert_sound)}
              className={`w-12 h-7 rounded-full relative transition-all duration-300 ${
                settings.alert_sound ? "bg-success" : "bg-muted"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-foreground absolute top-1 transition-all duration-300 ${
                  settings.alert_sound ? "left-6" : "left-1"
                }`}
              />
            </button>
          ),
        },
        {
          label: "Manual Override",
          description: "Allow manual control of all automated devices",
          render: () => (
            <button
              onClick={() => updateField("manual_override", !settings.manual_override)}
              className={`w-12 h-7 rounded-full relative transition-all duration-300 ${
                settings.manual_override ? "bg-success" : "bg-muted"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-foreground absolute top-1 transition-all duration-300 ${
                  settings.manual_override ? "left-6" : "left-1"
                }`}
              />
            </button>
          ),
        },
      ],
    },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-1">System Configuration</h2>
          <p className="text-sm text-muted-foreground">Configure thresholds and automation behavior</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary text-muted-foreground text-sm font-medium hover:text-foreground transition-all"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {configGroups.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.08, duration: 0.4 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
                <group.icon className={`h-4.5 w-4.5 ${group.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
            </div>

            <div className="space-y-5">
              {group.items.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {item.render()}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SystemConfig;

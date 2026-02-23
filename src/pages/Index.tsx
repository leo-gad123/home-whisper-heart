import { useFirebaseData } from "@/hooks/useFirebaseData";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DoorCard } from "@/components/DoorCard";
import { StatusCard } from "@/components/StatusCard";
import { EnvironmentGauge } from "@/components/EnvironmentGauge";
import { ParkingSection } from "@/components/ParkingSection";
import {
  Lightbulb,
  Fan,
  Blinds,
  Droplet,
  Bell,
  Flame,
} from "lucide-react";

const Index = () => {
  const { data, connected } = useFirebaseData();

  const getOnOffStatus = (val: string): "active" | "inactive" => (val === "ON" ? "active" : "inactive");
  const gasStatus = data.gas !== "NO" && data.gas !== "—" ? "alert" : "active";
  const buzzerStatus = data.buzzer === "ON" ? "alert" : "inactive";

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader connected={connected} lastCommand={data.gsm_last_command} />

        {/* Doors & Security */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Doors & Security
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <DoorCard label="Main Door" access={data.main_door.access} doorState={data.main_door.door_state} />
            <DoorCard label="Side Door" access={data.side_door.access} doorState={data.side_door.door_state} />
            <StatusCard
              title="Buzzer"
              icon={Bell}
              value={data.buzzer}
              status={buzzerStatus}
              subtitle={buzzerStatus === "alert" ? "Alarm triggered" : "Silent"}
            />
          </div>
        </section>

        {/* Environment & Automation */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Environment & Automation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnvironmentGauge temperature={data.temperature} humidity={data.humidity} />
            <StatusCard title="Lamp" icon={Lightbulb} value={data.lamp} status={getOnOffStatus(data.lamp)} />
            <StatusCard title="Fan" icon={Fan} value={data.fan} status={getOnOffStatus(data.fan)} />
            <StatusCard title="Curtains" icon={Blinds} value={data.curtains} status={data.curtains !== "Closed" ? "active" : "inactive"} />
            <StatusCard title="Water Pump" icon={Droplet} value={data.water_pump} status={getOnOffStatus(data.water_pump)} />
            <StatusCard
              title="Gas Sensor"
              icon={Flame}
              value={data.gas === "NO" ? "Safe" : data.gas}
              status={gasStatus}
              subtitle={gasStatus === "alert" ? "Gas detected!" : "No gas detected"}
            />
          </div>
        </section>

        {/* Parking */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Parking & Gate
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ParkingSection slots={data.parking_slots} gateState={data.parking_gate} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;

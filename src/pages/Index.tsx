import { useFirebaseData } from "@/hooks/useFirebaseData";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DoorCard } from "@/components/DoorCard";
import { StatusCard } from "@/components/StatusCard";
import { EnvironmentGauge } from "@/components/EnvironmentGauge";
import { ParkingSection } from "@/components/ParkingSection";
import { ControlCard } from "@/components/ControlCard";
import {
  Lightbulb,
  Fan,
  Blinds,
  Droplet,
  Flame,
} from "lucide-react";

const Index = () => {
  const { data, connected } = useFirebaseData();

  const gasStatus = data.gas !== "NO" && data.gas !== "—" ? "alert" : "active";

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
          </div>
        </section>

        {/* Environment & Automation */}
        <section className="mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
            Environment & Automation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <EnvironmentGauge temperature={data.temperature} humidity={data.humidity} />
            <ControlCard title="Lamp" icon={Lightbulb} value={data.lamp} firebaseKey="lamp" />
            <ControlCard title="Fan" icon={Fan} value={data.fan} firebaseKey="fan" />
            <ControlCard
              title="Curtains"
              icon={Blinds}
              value={data.curtains}
              firebaseKey="curtains"
              options={["Open", "Closed", "Partial"]}
              offLabel="Closed"
            />
            <ControlCard title="Water Pump" icon={Droplet} value={data.water_pump} firebaseKey="water_pump" />
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

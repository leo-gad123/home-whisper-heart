import { useState, useEffect } from "react";
import { database, ref, onValue } from "@/lib/firebase";

export interface ParkingSlot {
  status: string;
}

export interface HomeData {
  main_door: { access: string; door_state: string };
  side_door: { access: string; door_state: string };
  buzzer: string;
  lamp: string;
  fan: string;
  curtains: string;
  temperature: number;
  humidity: number;
  gas: string;
  parking: {
    slot1: ParkingSlot;
    slot2: ParkingSlot;
    gate: string;
  };
  water_pump: string;
  gsm_last_command: string;
}

const defaultData: HomeData = {
  main_door: { access: "—", door_state: "—" },
  side_door: { access: "—", door_state: "—" },
  buzzer: "—",
  lamp: "—",
  fan: "—",
  curtains: "—",
  temperature: 0,
  humidity: 0,
  gas: "—",
  parking: {
    slot1: { status: "—" },
    slot2: { status: "—" },
    gate: "—",
  },
  water_pump: "—",
  gsm_last_command: "—",
};

export function useFirebaseData() {
  const [data, setData] = useState<HomeData>(defaultData);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Helper: extract a string from a value that may be a plain string or an object with status/value keys
    const str = (v: unknown): string => {
      if (v == null) return "—";
      if (typeof v === "string") return v;
      if (typeof v === "number") return String(v);
      if (typeof v === "object") {
        const obj = v as Record<string, unknown>;
        if (obj.status != null) return String(obj.status);
        if (obj.value != null) return String(obj.value);
      }
      return "—";
    };

    const num = (v: unknown): number => {
      if (typeof v === "number") return v;
      if (typeof v === "object" && v != null) {
        const obj = v as Record<string, unknown>;
        if (typeof obj.value === "number") return obj.value;
      }
      return Number(v) || 0;
    };

    const door = (v: unknown): { access: string; door_state: string } => {
      if (typeof v === "object" && v != null) {
        const obj = v as Record<string, unknown>;
        return { access: str(obj.access), door_state: str(obj.door_state) };
      }
      return { access: "—", door_state: "—" };
    };

    const dbRef = ref(database, "/");
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const parking = val.parking || {};
          setData({
            main_door: door(val.main_door),
            side_door: door(val.side_door),
            buzzer: str(val.buzzer),
            lamp: str(val.lamp),
            fan: str(val.fan),
            curtains: str(val.curtains),
            temperature: num(val.temperature),
            humidity: num(val.humidity),
            gas: str(val.gas),
            parking: {
              slot1: { status: str(parking.slot1) },
              slot2: { status: str(parking.slot2) },
              gate: str(parking.gate),
            },
            water_pump: str(val.water_pump),
            gsm_last_command: str(val.gsm_last_command),
          });
          setConnected(true);
        }
      },
      () => setConnected(false)
    );

    return () => unsubscribe();
  }, []);

  return { data, connected };
}

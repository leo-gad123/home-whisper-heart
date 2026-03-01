import { useState, useEffect } from "react";
import { database, ref, onValue } from "@/lib/firebase";

export interface ParkingSlot {
  status: string;
}

export interface HomeData {
  main_door: { access: string; door_state: string; user_id: string; user_name: string };
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
  main_door: { access: "—", door_state: "—", user_id: "", user_name: "" },
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

    const slotStatus = (v: unknown): string => {
      if (v == null) return "—";
      let raw: unknown = v;
      if (typeof v === "object") {
        const obj = v as Record<string, unknown>;
        raw = obj.status ?? obj.value ?? v;
        if (typeof raw === "object") return "—";
      }
      const n = Number(raw);
      if (!isNaN(n)) return n === 0 ? "Free" : "Occupied";
      if (typeof raw === "string") return raw;
      return "—";
    };

    const dbRef = ref(database, "/");
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          const parking = val.parking || {};
          const mainDoor = (typeof val.main_door === "object" && val.main_door) ? val.main_door : {};
          const userId = mainDoor.user_id != null ? String(mainDoor.user_id) : "";

          // Look up user name from /users/{user_id}
          let userName = "";
          if (userId && val.users && typeof val.users === "object") {
            const userEntry = val.users[userId];
            if (userEntry && typeof userEntry === "object" && userEntry.name) {
              userName = String(userEntry.name);
            }
          }

          setData({
            main_door: {
              access: str(mainDoor.access),
              door_state: str(mainDoor.door_state),
              user_id: userId,
              user_name: userName || (userId ? "Unknown User" : ""),
            },
            buzzer: str(val.buzzer),
            lamp: str(val.lamp),
            fan: str(val.fan),
            curtains: str(val.curtains),
            temperature: num(val.temperature),
            humidity: num(val.humidity),
            gas: str(val.gas),
            parking: {
              slot1: { status: slotStatus(parking.slot1) },
              slot2: { status: slotStatus(parking.slot2) },
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

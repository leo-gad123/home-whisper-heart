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
    const dbRef = ref(database, "/");
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          // Safely extract parking data which may have nested objects
          const parking = val.parking || {};
          const safeParking = {
            slot1: { status: typeof parking.slot1 === "object" ? (parking.slot1?.status ?? "—") : String(parking.slot1 ?? "—") },
            slot2: { status: typeof parking.slot2 === "object" ? (parking.slot2?.status ?? "—") : String(parking.slot2 ?? "—") },
            gate: typeof parking.gate === "object" ? (parking.gate?.status ?? parking.gate?.value ?? "—") : String(parking.gate ?? "—"),
          };
          setData({ ...defaultData, ...val, parking: safeParking });
          setConnected(true);
        }
      },
      () => setConnected(false)
    );

    return () => unsubscribe();
  }, []);

  return { data, connected };
}

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
          setData({ ...defaultData, ...val });
          setConnected(true);
        }
      },
      () => setConnected(false)
    );

    return () => unsubscribe();
  }, []);

  return { data, connected };
}

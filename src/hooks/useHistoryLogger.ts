import { useEffect, useRef } from "react";
import { database, ref, push } from "@/lib/firebase";

export function useHistoryLogger(temperature: number, humidity: number) {
  const lastTemp = useRef<number | null>(null);
  const lastHumidity = useRef<number | null>(null);

  useEffect(() => {
    if (temperature === 0 && humidity === 0) return;

    const now = Date.now();

    if (lastTemp.current !== null && lastTemp.current !== temperature) {
      push(ref(database, "temperature_history"), { value: temperature, timestamp: now });
    }
    lastTemp.current = temperature;

    if (lastHumidity.current !== null && lastHumidity.current !== humidity) {
      push(ref(database, "humidity_history"), { value: humidity, timestamp: now });
    }
    lastHumidity.current = humidity;
  }, [temperature, humidity]);
}

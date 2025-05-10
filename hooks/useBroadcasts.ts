import { useState, useEffect } from "react";

interface Broadcast {
  id: number;
  host: string;
  voice: string;
  province: string;
  date: string;
  created_at: string;
}

export default function useBroadcasts() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/broadcast");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Broadcast[] = await response.json();
        setBroadcasts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch broadcasts");
      } finally {
        setLoading(false);
      }
    };

    fetchBroadcasts();
  }, []);

  return { broadcasts, loading, error };
}
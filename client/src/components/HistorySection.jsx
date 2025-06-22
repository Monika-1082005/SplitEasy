import axios from "axios";
import { useState, useEffect } from "react";

export default function HistorySection() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    async function fetchHistory() {
      try {
        const userId = localStorage.getItem("userId");
        const userEmail = localStorage.getItem("userEmail");
        if (!userId) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${apiUrl}/history`, {
          headers: {
            "x-user-id": userId,
            "x-user-email": userEmail, 
          },
        });
        setHistory(res.data);
      } catch {
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [apiUrl]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (history.length === 0) return <p>No recent activity</p>;

  return (
    <div className="mx-auto p-4 bg-white">
      {history.map(({ date, events }) => (
        <div key={date} className="mb-6">
          <div className="text-center text-gray-500 text-sm mb-4">{date}</div>
          <div className="space-y-4">
            {events.map(({ id, time, icon, message }) => (
              <div
                key={id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded shadow-sm"
              >
                <div className="text-3xl min-w-[40px] text-center">{icon}</div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">{time}</div>
                  <div className="text-gray-800 font-medium">{message}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = "https://weather-app-smoky-two-75.vercel.app";

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true); // loading state
  const { authData } = useAuth();

  useEffect(() => {
    if (!authData) return;
    fetchResults();
  }, [authData]);

  const fetchResults = () => {
    setLoading(true); // start loading
    axios
      .get(`${BACKEND_URL}/api/results`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      })
      .then((res) => setResults(res.data))
      .catch(() => alert("Failed to get stored results"))
      .finally(() => setLoading(false)); // stop loading
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    setLoading(true); // show loading while deleting
    axios
      .delete(`${BACKEND_URL}/api/results/${id}`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      })
      .then(() => {
        alert("Deleted successfully");
        fetchResults();
      })
      .catch(() => {
        alert("Failed to delete");
        setLoading(false);
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        🌤️ Stored Weather Data
      </h3>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
        </div>
      ) : results.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No stored results found.</p>
      ) : (
        <div className="space-y-6">
          {results.map((item) => {
            const weather = item.data.weather?.[0];
            const main = item.data.main;
            const wind = item.data.wind;
            const sys = item.data.sys;

            return (
              <div
                key={item._id}
                className="border rounded-xl p-5 shadow-sm hover:shadow-md transition relative bg-gray-50"
              >
                <h4 className="text-xl font-semibold text-blue-600 mb-2">
                  {item.keyword} ({item.data.name || "Unknown Location"})
                </h4>

                {weather && (
                  <p className="capitalize mb-1">
                    <span className="font-semibold">Weather: </span>
                    {weather.description}
                  </p>
                )}

                {main && (
                  <div className="space-y-1 text-gray-700">
                    <p>
                      <span className="font-semibold">Temperature:</span> {main.temp} °C (Feels like{" "}
                      {main.feels_like} °C)
                    </p>
                    <p>
                      <span className="font-semibold">Humidity:</span> {main.humidity} %
                    </p>
                    <p>
                      <span className="font-semibold">Pressure:</span> {main.pressure} hPa
                    </p>
                  </div>
                )}

                {wind && (
                  <p className="mt-1">
                    <span className="font-semibold">Wind:</span> {wind.speed} m/s, Direction: {wind.deg}°
                  </p>
                )}

                {sys && (
                  <p className="mt-1">
                    <span className="font-semibold">Country:</span> {sys.country}
                  </p>
                )}

                <button
                  onClick={() => handleDelete(item._id)}
                  className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition text-sm"
                  aria-label="Delete record"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

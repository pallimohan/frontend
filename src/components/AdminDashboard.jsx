import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = "https://weather-app-smoky-two-75.vercel.app";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // loading state
  const { authData } = useAuth();

  useEffect(() => {
    if (!authData || authData.role !== "admin") return;
    fetchUsers();
  }, [authData]);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`${BACKEND_URL}/api/admin/repositories`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      })
      .then((res) => setUsers(res.data))
      .catch(() => alert("Failed to fetch admin data"))
      .finally(() => setLoading(false));
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user and all their data?")) return;

    setLoading(true);
    axios
      .delete(`${BACKEND_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${authData.token}` },
      })
      .then(() => {
        alert("User deleted successfully");
        fetchUsers();
      })
      .catch(() => {
        alert("Failed to delete user");
        setLoading(false);
      });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
        Admin Dashboard: Users and Their Repositories
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-yellow-500 border-solid"></div>
        </div>
      ) : users.length === 0 ? (
        <p className="text-gray-500 text-center py-6">No users available</p>
      ) : (
        <div className="space-y-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="border rounded-xl p-5 shadow-sm hover:shadow-md transition relative bg-gray-50"
            >
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition text-sm"
              >
                Delete User
              </button>
              <h3 className="font-semibold text-xl text-blue-700 mb-4">👤 {user.username}</h3>

              {user.repositories.length === 0 ? (
                <p className="text-gray-500 text-sm">No repositories found.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {user.repositories.map((repo) => {
                    const data = repo.data;
                    const weather = data.weather?.[0];
                    const main = data.main;
                    const wind = data.wind;
                    const sys = data.sys;

                    return (
                      <div
                        key={repo._id}
                        className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
                      >
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">
                          📍 {data.name || "Unknown Location"} ({sys?.country})
                        </h4>

                        {weather && (
                          <p className="capitalize mb-1">
                            <span className="font-semibold">Weather:</span> {weather.description}
                          </p>
                        )}

                        {main && (
                          <div className="space-y-1 text-gray-700">
                            <p>
                              <span className="font-semibold">Temp:</span> {main.temp} °C (Feels {main.feels_like} °C)
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
                          <p className="mt-1 text-gray-700">
                            <span className="font-semibold">Wind:</span> {wind.speed} m/s, {wind.deg}°
                          </p>
                        )}

                        <p className="text-sm text-gray-500 mt-2">
                          🕒 Updated at: {new Date(data.dt * 1000).toLocaleString()}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

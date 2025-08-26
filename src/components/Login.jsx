import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "https://weather-app-smoky-two-75.vercel.app";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthData } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BACKEND_URL}/api/login`, { username, password });
      setAuthData({ token: res.data.token, role: res.data.role });
      navigate(res.data.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-md mx-auto p-6 border rounded shadow flex flex-col space-y-4">
      <h2 className="text-xl font-bold">Login</h2>
      <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required className="border p-2 rounded" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="border p-2 rounded" />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
    </form>
  );
}

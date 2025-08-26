import React, { useState } from "react";
import axios from "axios";

const BACKEND_URL = "https://weather-app-smoky-two-75.vercel.app";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/api/register`, { username, password });
      alert("Registration successful! Please log in.");
      setUsername("");
      setPassword("");
    } catch {
      alert("Registration failed. Try a different username.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-6 border rounded shadow flex flex-col space-y-4">
      <h2 className="text-xl font-bold">Register</h2>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required className="border p-2 rounded" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="border p-2 rounded" />
      <button type="submit" className="bg-green-600 text-white p-2 rounded hover:bg-green-700">Register</button>
    </form>
  );
}

import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const BACKEND_URL = "https://weather-app-smoky-two-75.vercel.app";

export default function SearchForm() {
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState(null);
  const { authData } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.post(
        `${BACKEND_URL}/api/search`,
        { keyword },
        {
          headers: { Authorization: `Bearer ${authData.token}` },
        }
      );
      alert("Data fetched and stored!");
      setKeyword("");
    } catch {
      setError("Failed to fetch or store data.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4 max-w-md mx-auto">
      <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Enter keyword" required className="flex-grow border p-2 rounded" />
      <button type="submit" className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Search</button>
      {error && <p className="text-red-600 ml-2">{error}</p>}
    </form>
  );
}

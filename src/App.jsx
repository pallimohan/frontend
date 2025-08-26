import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Register from "./components/Register";
import Login from "./components/Login";
import AdminLogin from "./components/AdminLogin";
import SearchForm from "./components/SearchForm";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";

/**
 * Component to protect routes and optionally check user role
 */
function ProtectedRoute({ children, role }) {
  const { authData } = useAuth();

  if (!authData) return <Navigate to="/login" />;
  if (role && authData.role !== role) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  const { authData, logout } = useAuth();

  return (
    <Router>
      <nav className="bg-blue-900 p-4 mb-6 flex justify-between items-center">
        <h1 className="text-white font-bold text-2xl">API Driven Mini Web App</h1>
        <div className="flex items-center">
          {!authData ? (
            <>
              <Link to="/login" className="text-white mr-4">User Login</Link>
              <Link to="/admin-login" className="text-yellow-300 mr-4">Admin Login</Link>
              <Link to="/register" className="text-white">Register</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-white mr-4">Dashboard</Link>
              {authData.role === "admin" && (
                <Link to="/admin" className="text-yellow-300 mr-4">Admin</Link>
              )}
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-sm"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            authData ? (
              authData.role === "admin" ? <Navigate to="/admin" /> : <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <SearchForm />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

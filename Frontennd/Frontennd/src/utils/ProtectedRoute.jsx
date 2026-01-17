import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ roles = [], children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (!token) return <Navigate to="/login" replace />;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const userRoles = Array.isArray(payload?.roles) ? payload.roles : [];
    const allowed = roles.length === 0 || userRoles.some((r) => roles.includes(r));
    if (!allowed) return <Navigate to="/login" replace />;
    return children;
  } catch {
    return <Navigate to="/login" replace />;
  }
}

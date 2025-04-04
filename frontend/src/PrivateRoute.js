// src/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, autorizado }) {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("⚠️ Debes iniciar sesión para acceder.");
    return <Navigate to="/" />;
  }

  if (!autorizado) {
    alert("🔒 Necesitas autorización especial.");
    return <Navigate to="/" />;
  }

  return children;
}


export default PrivateRoute;

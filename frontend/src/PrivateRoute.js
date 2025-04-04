// src/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children, autorizado }) {
  const token = localStorage.getItem("token");

  if (token && autorizado) {
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default PrivateRoute;

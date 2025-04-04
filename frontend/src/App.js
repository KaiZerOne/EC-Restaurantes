import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import FichajesHome from "./FichajesHome";
import FichajesDashboard from "./FichajesDashboard";
import Fichar from "./Fichar";
import NuevoEmpleado from "./NuevoEmpleado";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [autorizado, setAutorizado] = useState(localStorage.getItem("autorizado") === "true");

  const logout = () => {
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("autorizado");
    setAutorizado(false);
  };

  return (
    <Router>
      <Navbar logout={logout} setAutorizado={setAutorizado} />
      <Routes>
        {/* Si no hay token, siempre redirigir a login */}
        {!token && (
          <>
            <Route path="*" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
          </>
        )}

        {/* Si hay token */}
        {token && (
          <>
            <Route path="/" element={<Navigate to="/fichar" />} />
            <Route path="/fichar" element={<Fichar token={token} />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute autorizado={autorizado}>
                  <FichajesHome />
                </PrivateRoute>
              }
            />
            <Route
              path="/fichajes"
              element={
                <PrivateRoute autorizado={autorizado}>
                  <FichajesDashboard token={token} />
                </PrivateRoute>
              }
            />
            <Route
              path="/nuevo-empleado"
              element={
                <PrivateRoute autorizado={autorizado}>
                  <NuevoEmpleado token={token} />
                </PrivateRoute>
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;

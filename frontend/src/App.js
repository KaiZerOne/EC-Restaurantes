import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import FichajesHome from "./FichajesHome";
import FichajesDashboard from "./FichajesDashboard";
import Fichar from "./Fichar";
import NuevoEmpleado from "./NuevoEmpleado";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [autorizado, setAutorizado] = useState(localStorage.getItem("autorizado") === "true");

  const logout = () => {
    setToken("");
    setAutorizado(false);
    localStorage.clear();
  };

  return (
    <Router>
      {token ? (
        <>
          <Navbar logout={logout} setAutorizado={setAutorizado} />
          <Routes>
            <Route path="/" element={<Navigate to="/fichar" />} />
            <Route path="/fichar" element={<Fichar />} />
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
                  <FichajesDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/nuevo-empleado"
              element={
                <PrivateRoute autorizado={autorizado}>
                  <NuevoEmpleado />
                </PrivateRoute>
              }
            />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="*" element={<Login setToken={setToken} />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;

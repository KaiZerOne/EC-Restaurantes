import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import FichajesHome from "./FichajesHome";
import FichajesDashboard from "./FichajesDashboard";
import Fichar from "./Fichar";
import NuevoEmpleado from "./NuevoEmpleado";
import Login from "./Login";
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
      {token ? (
        <>
          <Navbar logout={logout} setAutorizado={setAutorizado} />
          <Routes>
            {/* 🚪 Redirige raíz a /fichar */}
            <Route path="/" element={<Navigate to="/fichar" />} />

            <Route path="/fichar" element={<Fichar token={token} />} />

            {/* 🔐 Rutas protegidas por contraseña */}
            <Route path="/dashboard" element={autorizado ? <FichajesHome /> : <Navigate to="/fichar" />} />
            <Route path="/fichajes" element={autorizado ? <FichajesDashboard token={token} /> : <Navigate to="/fichar" />} />
            <Route path="/nuevo-empleado" element={autorizado ? <NuevoEmpleado token={token} /> : <Navigate to="/fichar" />} />
          </Routes>
        </>
      ) : (
        <Login setToken={setToken} />
      )}
    </Router>
  );
}

export default App;

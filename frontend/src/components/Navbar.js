import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ContraseniaModal from "./ContraseniaModal";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar({ logout, setAutorizado }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  const irAInicio = () => {
    setMostrarModal(true);
  };

  const accesoVerificado = () => {
    localStorage.setItem("autorizado", "true");
    setAutorizado(true);
    setMostrarModal(false);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    logout();
    closeNavbar();
  };

  const closeNavbar = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/dashboard" onClick={closeNavbar}>
            Mi Aplicación
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link"
                  onClick={() => {
                    irAInicio();
                    closeNavbar();
                  }}
                  style={{ cursor: "pointer", textDecoration: "none" }}
                >
                  Inicio
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger ms-2" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <ContraseniaModal
        mostrar={mostrarModal}
        onVerificada={accesoVerificado}
        onCancelar={() => setMostrarModal(false)}
      />
    </>
  );
}

export default Navbar;

import React, { useState } from "react";
import ContraseniaModal from "./ContraseniaModal";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar({ logout, setAutorizado }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();

  const irAInicio = () => setMostrarModal(true);

  const accesoVerificado = () => {
    localStorage.setItem("autorizado", "true");
    setAutorizado(true);
    setMostrarModal(false);
    navigate("/dashboard");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="#">Mi Aplicación</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" onClick={irAInicio} style={{ cursor: "pointer" }}>Inicio</a>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger" onClick={logout}>Cerrar Sesión</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <ContraseniaModal
        mostrar={mostrarModal}
        onVerificada={accesoVerificado}
        onCancelar={() => setMostrarModal(false)}  // ✅ Ahora se cierra bien
      />
    </>
  );
}

export default Navbar;

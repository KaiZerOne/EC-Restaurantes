import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function FichajesHome() {
    return (
        <div className="container mt-5 text-center">
            <h1 className="mb-4">Gestión de Fichajes</h1>
            <div className="d-flex justify-content-center gap-3">
                <Link to="/fichajes" className="btn btn-primary">Ver Fichajes</Link>
                <Link to="/fichar" className="btn btn-warning">Fichar</Link>
                <Link to="/nuevo-empleado" className="btn btn-success">Añadir Empleado</Link>
            </div>
        </div>
    );
}

export default FichajesHome;

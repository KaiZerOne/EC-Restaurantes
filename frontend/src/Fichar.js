import React, { useState } from "react";
import axios from "axios";

function Fichar() {
    const [dni, setDni] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleFichar = async (e) => {
        e.preventDefault();
        setMensaje("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/fichar/", { dni });
            setMensaje(response.data.mensaje);
        } catch (error) {
            setMensaje(error.response?.data?.error || "Error al fichar.");
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h1 className="mb-4">Fichaje de Empleado</h1>
            {mensaje && <div className="alert alert-info">{mensaje}</div>}
            <form onSubmit={handleFichar} className="card p-4 shadow">
                <div className="mb-3">
                    <label className="form-label">Introduce tu DNI:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Fichar</button>
            </form>
        </div>
    );
}

export default Fichar;


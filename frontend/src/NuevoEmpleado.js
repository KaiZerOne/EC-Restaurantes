import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "./config";

function NuevoEmpleado() {
    const [formData, setFormData] = useState({
        username: "",
        apellido: "",
        dni: "",
        telefono: "",
        correo: "",
        horas_contrato: "",
        rol: "empleado",
        restaurante: ""
    });

    const [mensaje, setMensaje] = useState("");
    const token = localStorage.getItem("token");
    const [restaurantes, setRestaurantes] = useState([]);

    useEffect(() => {
        if (token) {
            axios.get(API.RESTAURANTES, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                setRestaurantes(response.data);
            })
            .catch(error => {
                console.error("Error al obtener restaurantes:", error);
            });
        }
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");

        if (!token) {
            setMensaje("Error: No tienes token.");
            return;
        }

        try {
            await axios.post(API.USUARIOS, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMensaje("✅ Empleado añadido correctamente.");
            setFormData({
                username: "",
                apellido: "",
                dni: "",
                telefono: "",
                correo: "",
                horas_contrato: "",
                rol: "empleado",
                restaurante: ""
            });
        } catch (error) {
            setMensaje("⚠️ Error al añadir el usuario. Revisa los datos.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Añadir Nuevo Empleado</h1>
            {mensaje && <div className="alert alert-info">{mensaje}</div>}

            <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" name="username" className="form-control" value={formData.username} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Apellido</label>
                    <input type="text" name="apellido" className="form-control" value={formData.apellido} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">DNI</label>
                    <input type="text" name="dni" className="form-control" value={formData.dni} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Teléfono</label>
                    <input type="text" name="telefono" className="form-control" value={formData.telefono} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input type="email" name="correo" className="form-control" value={formData.correo} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Horas de Contrato (Opcional)</label>
                    <input type="number" name="horas_contrato" className="form-control" value={formData.horas_contrato} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Restaurante</label>
                    <select name="restaurante" className="form-control" value={formData.restaurante} onChange={handleChange} required>
                        <option value="">Selecciona un restaurante</option>
                        {restaurantes.length > 0 ? (
                            restaurantes.map(rest => (
                                <option key={rest.id} value={rest.id}>
                                    {rest.nombre}
                                </option>
                            ))
                        ) : (
                            <option value="">Cargando restaurantes...</option>
                        )}
                    </select>
                </div>

                <button type="submit" className="btn btn-success w-100">Guardar Empleado</button>
            </form>
        </div>
    );
}

export default NuevoEmpleado;

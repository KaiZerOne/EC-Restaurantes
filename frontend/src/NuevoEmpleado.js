import React, { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../config";

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
    const [token, setToken] = useState("");
    const [restaurantes, setRestaurantes] = useState([
        { id: 1, nombre: "La Marina" },
        { id: 2, nombre: "Armentia" }
    ]); // 📌 Restaurantes por defecto

    // Obtener el token almacenado
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Obtener los restaurantes desde la API
    useEffect(() => {
          axios.get(API.RESTAURANTES, {
            headers: { Authorization: `Bearer ${token}` }
          })
          .then(response => {
            if (response.data.length > 0) {
              setRestaurantes(response.data);
            }
          })
        .catch(error => {
            console.error("Error al obtener restaurantes, usando valores predeterminados:", error);
        });
    }, [token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");

        if (!token) {
            setMensaje("Error: No tienes un token de autenticación.");
            return;
        }

        const dataToSend = { ...formData };
        if (dataToSend.horas_contrato === "") {
            delete dataToSend.horas_contrato;
        }

        try {
            await axios.post("http://127.0.0.1:8000/api/usuarios/", dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMensaje("Empleado añadido correctamente.");
            setFormData({ nombre: "", apellido: "", dni: "", telefono: "", correo: "", horas_contrato: "", rol: "empleado", restaurante: "" });
        } catch (error) {
            console.error("Error al añadir el usuario:", error.response ? error.response.data : error);
            setMensaje("Error al añadir el usuario. Revisa los datos.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Añadir Nuevo Empleado</h1>
            {mensaje && <div className="alert alert-info">{mensaje}</div>}
            <form onSubmit={handleSubmit} className="card p-4 shadow">
                <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" name="username" className="form-control" value={formData.nombre} onChange={handleChange} required />
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

                {/* 📌 Selector de Restaurante */}
                <div className="mb-3">
                    <label className="form-label">Restaurante</label>
                    <select name="restaurante" className="form-control" value={formData.restaurante} onChange={handleChange} required>
                        <option value="">Selecciona un restaurante</option>
                        {restaurantes.map(rest => (
                            <option key={rest.id} value={rest.id}>
                                {rest.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-success">Guardar Empleado</button>
            </form>
        </div>
    );
}

export default NuevoEmpleado;
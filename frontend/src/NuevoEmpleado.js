import React, {useEffect, useState} from "react";
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
    const [restaurantes, setRestaurantes] = useState([
        { id: 1, nombre: "La Marina" },
        { id: 2, nombre: "Armentia" }
    ]);

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
            console.error("Error al obtener restaurantes:", error);
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
            await axios.post(API.USUARIOS, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMensaje("Empleado añadido correctamente.");
            setFormData({
                username: "", apellido: "", dni: "", telefono: "", correo: "", horas_contrato: "", rol: "empleado", restaurante: ""
            });
        } catch (error) {
            console.error("Error al añadir el usuario:", error.response?.data || error);
            setMensaje("Error al añadir el usuario. Revisa los datos.");
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Añadir Nuevo Empleado</h1>
            {mensaje && <div className="alert alert-info">{mensaje}</div>}
            <form onSubmit={handleSubmit} className="card p-4 shadow">
                {/* tus inputs aquí */}
            </form>
        </div>
    );
}

export default NuevoEmpleado;

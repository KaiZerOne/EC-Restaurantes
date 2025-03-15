import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

function FichajesDashboard({ token }) {
    const [fichajes, setFichajes] = useState([]);
    const [filtroEmpleado, setFiltroEmpleado] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("");
    const [horasPorEmpleado, setHorasPorEmpleado] = useState([]);

    useEffect(() => {
        fetchFichajes();
    }, []);

    const fetchFichajes = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/fichajes/", {
                headers: { Authorization: `Bearer ${token}` },
                params: { empleado: filtroEmpleado, fecha: filtroFecha }
            });
            setFichajes(response.data);
            procesarDatos(response.data);
        } catch (error) {
            console.error("Error al obtener fichajes:", error);
        }
    };

    const procesarDatos = (data) => {
        const horasPorEmpleado = data.reduce((acc, fichaje) => {
            const nombre = fichaje.empleado.nombre + " " + fichaje.empleado.apellido;
            if (!acc[nombre]) acc[nombre] = 0;
            acc[nombre] += fichaje.horas_trabajadas;
            return acc;
        }, {});

        const chartData = Object.keys(horasPorEmpleado).map(nombre => ({
            empleado: nombre,
            horas: horasPorEmpleado[nombre]
        }));

        setHorasPorEmpleado(chartData);
    };

    // Filtro en el frontend
    const fichajesFiltrados = fichajes.filter(fichaje =>
        fichaje.empleado.nombre.toLowerCase().includes(filtroEmpleado.toLowerCase()) ||
        fichaje.empleado.apellido.toLowerCase().includes(filtroEmpleado.toLowerCase())
    );

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">📊 Dashboard de Fichajes</h2>

            {/* Filtros */}
            <div className="row g-2 mb-3">
                <div className="col-md-5">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Buscar empleado"
                        value={filtroEmpleado}
                        onChange={(e) => setFiltroEmpleado(e.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <input
                        type="date"
                        className="form-control"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button className="btn btn-primary w-100" onClick={fetchFichajes}>🔄 Filtrar</button>
                </div>
            </div>

            {/* Gráfico de Horas Trabajadas */}
            <div className="card shadow p-4">
                <h4 className="text-center">⏳ Horas Trabajadas por Empleado</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={horasPorEmpleado}>
                        <XAxis dataKey="empleado" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="horas" fill="#007bff" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Tabla de Fichajes */}
            <div className="table-responsive">
                <table className="table table-striped mt-4 text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>👤 Empleado</th>
                            <th>📅 Fecha Entrada</th>
                            <th>📅 Fecha Salida</th>
                            <th>⏳ Horas Trabajadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fichajesFiltrados.length > 0 ? (
                            fichajesFiltrados.map((fichaje) => (
                                <tr key={fichaje.id}>
                                    <td>{fichaje.empleado.nombre} {fichaje.empleado.apellido}</td>
                                    <td>{new Date(fichaje.fecha_entrada).toLocaleString()}</td>
                                    <td>{fichaje.fecha_salida ? new Date(fichaje.fecha_salida).toLocaleString() : "-"}</td>
                                    <td>{fichaje.horas_trabajadas}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center text-danger fw-bold">⚠️ No hay fichajes disponibles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default FichajesDashboard;

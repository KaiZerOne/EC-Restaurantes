import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

const FichajesDashboard = ({ token }) => {
    const [fichajes, setFichajes] = useState([]);
    const [filtroEmpleado, setFiltroEmpleado] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [mostrarIncidencias, setMostrarIncidencias] = useState(false);
    const [restauranteSeleccionado, setRestauranteSeleccionado] = useState("");
    const [horasPorEmpleado, setHorasPorEmpleado] = useState([]);

    useEffect(() => {
        fetchFichajes();
    }, []);

    const fetchFichajes = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/fichajes/", {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    empleado: filtroEmpleado,
                    fecha: "", // Puedes extender esto a fechaDesde y fechaHasta
                }
            });
            setFichajes(response.data);
            procesarDatos(response.data);
        } catch (error) {
            console.error("Error al obtener fichajes:", error);
        }
    };

    const formatearHoras = (horasDecimal) => {
        const totalMinutos = Math.round(horasDecimal * 60);
        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        return `${horas}h ${minutos}min`;
    };

    const generarColorAleatorio = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const procesarDatos = (data) => {
        const horasPorEmpleadoAcumuladas = {};
        const coloresEmpleado = {};

        data.forEach((fichaje) => {
            const nombre = fichaje.empleado?.username || "Desconocido";
            if (!horasPorEmpleadoAcumuladas[nombre]) {
                horasPorEmpleadoAcumuladas[nombre] = 0;
                coloresEmpleado[nombre] = generarColorAleatorio();
            }
            horasPorEmpleadoAcumuladas[nombre] += fichaje.horas_trabajadas;
        });

        const chartData = Object.keys(horasPorEmpleadoAcumuladas).map((nombre) => ({
            name: nombre,
            value: horasPorEmpleadoAcumuladas[nombre],
            color: coloresEmpleado[nombre],
        }));

        setHorasPorEmpleado(chartData);
    };

    const obtenerNombreRestaurante = (id) => {
        switch (id) {
            case 1: return "Armentioa";
            case 2: return "La Marina";
            default: return "Desconocido";
        }
    };

    const fichajesFiltrados = fichajes.filter(fichaje =>
        fichaje.empleado?.username.toLowerCase().includes(filtroEmpleado.toLowerCase()) &&
        (!mostrarIncidencias || fichaje.incidencia !== null) &&
        (restauranteSeleccionado === "" || fichaje.restaurante.toString() === restauranteSeleccionado)
    );

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">📊 Dashboard de Fichajes</h2>

            {/* Filtros */}
            <div className="row g-2 mb-3">
                <div className="col-md-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Buscar empleado"
                        value={filtroEmpleado}
                        onChange={(e) => setFiltroEmpleado(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <button className="btn btn-primary w-100" onClick={fetchFichajes}>🔄 Filtrar</button>
                </div>
            </div>

            {/* Filtro por incidencia y restaurante */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={mostrarIncidencias}
                            onChange={(e) => setMostrarIncidencias(e.target.checked)}
                        />
                        <label className="form-check-label">Mostrar solo fichajes con incidencia</label>
                    </div>
                </div>
                <div className="col-md-6">
                    <select
                        className="form-select"
                        value={restauranteSeleccionado}
                        onChange={(e) => setRestauranteSeleccionado(e.target.value)}
                    >
                        <option value="">Todos los restaurantes</option>
                        <option value="1">Armentioa</option>
                        <option value="2">La Marina</option>
                    </select>
                </div>
            </div>

            {/* Gráfico Circular */}
            <div className="card shadow p-4 mb-4">
                <h4 className="text-center">⏳ Horas Trabajadas por Empleado</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={horasPorEmpleado}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                        >
                            {horasPorEmpleado.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Tabla de Fichajes */}
            <div className="table-responsive">
                <table className="table table-striped text-center">
                    <thead className="table-dark">
                        <tr>
                            <th>👤 Empleado</th>
                            <th>📅 Entrada</th>
                            <th>📅 Salida</th>
                            <th>⏳ Horas</th>
                            <th>🏨 Restaurante</th>
                            <th>⚠️ Incidencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fichajesFiltrados.length > 0 ? (
                            fichajesFiltrados.map((fichaje) => (
                                <tr key={fichaje.id}>
                                    <td>{fichaje.empleado?.username || "Sin nombre"}</td>
                                    <td>{new Date(fichaje.fecha_entrada).toLocaleString()}</td>
                                    <td>{fichaje.fecha_salida ? new Date(fichaje.fecha_salida).toLocaleString() : "-"}</td>
                                    <td>{formatearHoras(fichaje.horas_trabajadas)}</td>
                                    <td>{obtenerNombreRestaurante(fichaje.restaurante)}</td>
                                    <td>{fichaje.incidencia || "-"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-danger fw-bold">⚠️ No hay fichajes.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FichajesDashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import { API } from "./config";

const FichajesDashboard = ({ token }) => {
    const [fichajes, setFichajes] = useState([]);
    const [filtroEmpleado, setFiltroEmpleado] = useState("");
    const [fechaDesde, setFechaDesde] = useState("");
    const [fechaHasta, setFechaHasta] = useState("");
    const [mostrarIncidencias, setMostrarIncidencias] = useState(false);
    const [restauranteSeleccionado, setRestauranteSeleccionado] = useState("");
    const [horasPorEmpleado, setHorasPorEmpleado] = useState([]);
    const [horasTotalesPorEmpleado, setHorasTotalesPorEmpleado] = useState({});
    const [totalFiltrado, setTotalFiltrado] = useState(null);  // 🆕 Total empleado filtrado

    useEffect(() => {
        fetchFichajes();
    }, [filtroEmpleado, fechaDesde, fechaHasta, mostrarIncidencias, restauranteSeleccionado]);

    const fetchFichajes = async () => {
        try {
            const response = await axios.get(API.FICHAJES, {
              headers: { Authorization: `Bearer ${token}` }
            });

            const filtrados = response.data.filter(fichaje => {
                const nombreEmpleado = fichaje.empleado?.username.toLowerCase() || "";
                const nombreFiltro = filtroEmpleado.trim().toLowerCase();

                const coincideEmpleado = nombreEmpleado.includes(nombreFiltro);
                const coincideIncidencia = !mostrarIncidencias || fichaje.incidencia !== null;
                const coincideRestaurante = restauranteSeleccionado === "" || fichaje.restaurante.toString() === restauranteSeleccionado;

                return coincideEmpleado && coincideIncidencia && coincideRestaurante;
            });


            setFichajes(filtrados);
            procesarDatos(filtrados);
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
    const acumuladas = {};
    const coloresEmpleado = {};
    const horasContrato = {};

    data.forEach((fichaje) => {
        const nombre = fichaje.empleado?.username || "Desconocido";
        acumuladas[nombre] = (acumuladas[nombre] || 0) + fichaje.horas_trabajadas;
        horasContrato[nombre] = fichaje.empleado?.horas_contrato || 40;  // ⚠️ real contrato
        if (!coloresEmpleado[nombre]) {
            coloresEmpleado[nombre] = generarColorAleatorio();
        }
    });

    setHorasTotalesPorEmpleado(acumuladas);
    setTotalFiltrado(null);

    const nombresFiltrados = Object.keys(acumuladas);
        if (filtroEmpleado && nombresFiltrados.length === 1) {
            const nombre = nombresFiltrados[0];
            const totalHoras = acumuladas[nombre];
            const contrato = data.find(f => f.empleado?.username === nombre)?.empleado?.horas_contrato || 0;
            const saldo = totalHoras - contrato;

            setTotalFiltrado({ nombre, horas: totalHoras, contrato, saldo });
        }

    const chartData = Object.keys(acumuladas).map((nombre) => ({
        name: nombre,
        value: Math.round(acumuladas[nombre]),
        color: coloresEmpleado[nombre],
    }));

    setHorasPorEmpleado(chartData);
};


    const obtenerNombreRestaurante = (id) => {
        switch (id) {
            case 1: return "La Marina";
            case 2: return "Armentia";
            default: return "Desconocido";
        }
    };

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
                <div className="row mb-3">
                    <div className="col-md-12 text-end">
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                                setFiltroEmpleado("");
                                setFechaDesde("");
                                setFechaHasta("");
                                setRestauranteSeleccionado("");
                                setMostrarIncidencias(false);
                                setTotalFiltrado(null);
                                fetchFichajes();  // Opcional: recargar datos tras limpiar
                            }}
                        >
                            🧹 Limpiar Filtros
                        </button>
                    </div>
                </div>

                <div className="col-md-3 d-flex gap-2">
                    <button className="btn btn-primary w-100" onClick={fetchFichajes}>🔄 Filtrar</button>
                    <button className="btn btn-secondary w-100" onClick={fetchFichajes}>🔄 Actualizar</button>
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
                        <option value="1">La Marina</option>
                        <option value="2">Armentia</option>
                    </select>
                </div>
            </div>

            {totalFiltrado && (
                <div className="alert alert-info text-center fw-bold">
                    🧮 {totalFiltrado.nombre} trabajó <span className="text-primary">{formatearHoras(totalFiltrado.horas)}</span> esta semana.<br />
                    Contrato: <span className="text-success">{formatearHoras(totalFiltrado.contrato)}</span> —
                    Compensables: <span style={{ color: totalFiltrado.saldo < 0 ? "red" : "green" }}>
                        {totalFiltrado.saldo >= 0 ? `+${formatearHoras(totalFiltrado.saldo)}` : `-${formatearHoras(-totalFiltrado.saldo)}`}
                    </span>
                </div>
            )}


            {/* Gráfico Circular */}
            <div className="card shadow p-4 mb-4">
                <h4 className="text-center">⏳ Horas Totales Trabajadas</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={horasPorEmpleado}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, value }) => `${name}: ${value}h`}
                        >
                            {horasPorEmpleado.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}h`, "Total horas"]} />
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
                        {fichajes.length > 0 ? (
                            fichajes.map((fichaje) => {
                                const horasTrabajadas = fichaje.horas_trabajadas || 0;

                                return (
                                    <tr key={fichaje.id}>
                                        <td>{fichaje.empleado?.username}</td>
                                        <td>{new Date(fichaje.fecha_entrada).toLocaleString()}</td>
                                        <td>{fichaje.fecha_salida ? new Date(fichaje.fecha_salida).toLocaleString() : "-"}</td>
                                        <td>{formatearHoras(horasTrabajadas)}</td>
                                        <td>{obtenerNombreRestaurante(fichaje.restaurante)}</td>
                                        <td>{fichaje.incidencia || "-"}</td>
                                    </tr>
                                );
                            })
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

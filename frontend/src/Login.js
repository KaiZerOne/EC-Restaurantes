import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { FaUserShield } from "react-icons/fa"; // Icono bonito

function Login({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const API_URL = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(`${API_URL}/token/`, {
                username,
                password
            });

            const accessToken = response.data.access;
            setToken(accessToken);
            localStorage.setItem("token", accessToken);
            navigate("/dashboard");
        } catch (err) {
            setError("Usuario o contraseña incorrectos");
        }
    };

    const irAlAdmin = () => {
        window.location.href = "/admin"; // 🔥 Redirige directo al admin Django
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "350px", borderRadius: "1rem" }}>
                <h2 className="text-center mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Usuario</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ingrese su usuario"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-3">Entrar</button>
                </form>

                {/* 💥 Botón bonito para el Admin */}
                <button
                    onClick={irAlAdmin}
                    className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 mt-2 admin-button"
                    type="button"
                >
                    <FaUserShield />
                    Acceder como Administrador
                </button>

                {/* Mensaje de error */}
                {error && <p className="text-danger text-center mt-3">{error}</p>}

                {/* Estilos extra para mejorar hover */}
                <style>{`
                    .admin-button {
                        transition: all 0.3s ease;
                    }
                    .admin-button:hover {
                        background-color: #343a40;
                        color: white;
                        border-color: #343a40;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                    }
                `}</style>
            </div>
        </div>
    );
}

export default Login;

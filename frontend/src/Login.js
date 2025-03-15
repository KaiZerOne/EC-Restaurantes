import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

function Login({ setToken }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/", {
                username,
                password
            });

            const accessToken = response.data.access;  // 📌 Guardamos el token de acceso
            setToken(accessToken);
            localStorage.setItem("token", accessToken);  // 📌 Guardamos el token en localStorage
        } catch (err) {
            setError("Usuario o contraseña incorrectos");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "350px" }}>
                <h2 className="text-center">Iniciar Sesión</h2>
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
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                {error && <p className="text-danger text-center mt-3">{error}</p>}
            </div>
        </div>
    );
}

export default Login;

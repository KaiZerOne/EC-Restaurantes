import React, { useState, useEffect } from "react";
import "../styles/modal.css";
import { API } from "../config"; // 👈 Importamos las rutas

function ContraseniaModal({ mostrar, onVerificada, onCancelar }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mostrar) {
      setPassword("");
      setError("");
    }
  }, [mostrar]);

  const verificarContrasenia = async () => {
    try {
      const response = await fetch(API.VALIDAR_PANEL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      if (data.valido) {
        onVerificada();
      } else {
        setError("❌ Contraseña incorrecta");
      }
    } catch {
      setError("❌ Error de conexión");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") verificarContrasenia();
    else if (e.key === "Escape") onCancelar();
  };

  if (!mostrar) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-4 bg-white rounded shadow position-relative">
        <button className="btn-close position-absolute top-0 end-0 m-3" onClick={onCancelar}></button>
        <h4 className="mb-3">🔒 Introduce contraseña</h4>
        <input
          type="password"
          className="form-control mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Contraseña"
        />
        {error && <p className="text-danger fw-bold">{error}</p>}
        <button className="btn btn-success w-100" onClick={verificarContrasenia}>
          ✔️ Acceder
        </button>
      </div>
    </div>
  );
}

export default ContraseniaModal;

import React, { useState, useEffect } from "react";
import "../styles/modal.css";

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
      const response = await fetch("http://127.0.0.1:8000/api/validar-panel/", {
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
    if (e.key === "Enter") {
      verificarContrasenia();
    } else if (e.key === "Escape") {
      onCancelar();  // ✅ Cierra con ESC
    }
  };

  if (!mostrar) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content p-4 bg-white rounded shadow position-relative">
        {/* ❌ Botón cerrar modal */}
        <button
          className="btn-close position-absolute top-0 end-0 m-3"
          onClick={onCancelar}
        ></button>

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

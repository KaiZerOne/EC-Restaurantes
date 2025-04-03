import React from "react";
import { Link } from "react-router-dom";
import { FaRegClock, FaUserPlus, FaClipboardList } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const FichajesHome = () => {
  const cards = [
    {
      icon: <FaClipboardList size={50} className="mb-3 text-primary" />,
      title: "Ver Fichajes",
      description: "Consulta y gestiona todos los registros.",
      link: "/fichajes",
      bg: "bg-light"
    },
    {
      icon: <FaRegClock size={50} className="mb-3 text-warning" />,
      title: "Fichar",
      description: "Registra tu entrada o salida.",
      link: "/fichar",
      bg: "bg-white"
    },
    {
      icon: <FaUserPlus size={50} className="mb-3 text-success" />,
      title: "Nuevo Empleado",
      description: "Añade un nuevo miembro al equipo.",
      link: "/nuevo-empleado",
      bg: "bg-light"
    }
  ];

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <h1 className="mb-5 text-center">Gestión de Fichajes</h1>
      <div className="row w-100 justify-content-center">
        {cards.map((card, index) => (
          <div key={index} className="col-md-4 mb-4 d-flex">
            <Link to={card.link} className="text-decoration-none w-100">
              <div
                className={`card h-100 text-center p-4 shadow-sm ${card.bg} hover-effect`}
                style={{ transition: "transform 0.3s", borderRadius: "1rem" }}
              >
                {card.icon}
                <h5 className="mb-2">{card.title}</h5>
                <p className="text-muted">{card.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Extra estilo para hover */}
      <style>{`
        .hover-effect:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
      `}</style>
    </div>
  );
};

export default FichajesHome;

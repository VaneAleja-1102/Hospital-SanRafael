import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user }) {
  const navigate = useNavigate();

  const menuOptions = [
    {
      id: 1,
      title: "📋 Equipos",
      description: "Ver y gestionar todos los equipos registrados",
      icon: "📋",
      path: "/equipments",
      color: "#667eea",
    },
    {
      id: 2,
      title: "➕ Registrar Equipo",
      description: "Agregar un nuevo equipo al sistema",
      icon: "➕",
      path: "/create",
      color: "#764ba2",
    },
    {
      id: 3,
      title: "📦 Registrar Ingreso/Egreso",
      description: "Registrar entrada o salida de equipos",
      icon: "📦",
      path: "/transaction",
      color: "#f093fb",
    },
    {
      id: 4,
      title: "📊 Ver Movimientos",
      description: "Consultar el historial de movimientos",
      icon: "📊",
      path: "/transactions-history",
      color: "#4facfe",
    },
  ];

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "40px 20px",
    },
    header: {
      textAlign: "center",
      color: "white",
      marginBottom: "50px",
    },
    title: {
      fontSize: "48px",
      fontWeight: "bold",
      margin: "0 0 10px 0",
    },
    subtitle: {
      fontSize: "20px",
      opacity: 0.9,
      margin: 0,
    },
    cardsContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "30px",
      padding: "0 20px",
    },
    card: {
      backgroundColor: "white",
      borderRadius: "20px",
      padding: "40px 30px",
      textAlign: "center",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      border: "2px solid transparent",
    },
    cardIcon: {
      fontSize: "64px",
      marginBottom: "20px",
    },
    cardTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
      marginBottom: "15px",
    },
    cardDescription: {
      fontSize: "16px",
      color: "#666",
      lineHeight: "1.5",
    },
    logoutBtn: {
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      color: "white",
      border: "2px solid white",
      padding: "10px 20px",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      marginTop: "20px",
      transition: "all 0.3s",
    },
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleCardHover = (e, color) => {
    e.currentTarget.style.transform = "translateY(-10px)";
    e.currentTarget.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.2)";
    e.currentTarget.style.borderColor = color;
  };

  const handleCardLeave = (e) => {
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
    e.currentTarget.style.borderColor = "transparent";
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>🏥 Control de Equipos - PDS006</h1>
        <p style={styles.subtitle}>Bienvenido, {user?.name || "Usuario"}</p>
        <button
          onClick={handleLogout}
          style={styles.logoutBtn}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "white";
            e.target.style.color = "#667eea";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            e.target.style.color = "white";
          }}
        >
          🚪 Cerrar sesión
        </button>
      </div>

      <div style={styles.cardsContainer}>
        {menuOptions.map((option) => (
          <div
            key={option.id}
            style={styles.card}
            onClick={() => handleCardClick(option.path)}
            onMouseEnter={(e) => handleCardHover(e, option.color)}
            onMouseLeave={handleCardLeave}
          >
            <div style={styles.cardIcon}>{option.icon}</div>
            <h2 style={styles.cardTitle}>{option.title}</h2>
            <p style={styles.cardDescription}>{option.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

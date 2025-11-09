import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from '../logo.svg';
import "../styles/parametres.css"; // ✅ Vérifie que ce fichier existe

const Parametres = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("profId");
        navigate("/");
    };

    return (
        <div className="success-container">
            {/* ✅ Barre supérieure avec logo et menu */}
            <div className="header">
                <img src={logo} alt="Logo" className="logo" /> {/* ✅ Petit logo à gauche */}
                <nav className="menu">
                    <button className="back-button" onClick={() => navigate("/success")}>
                ⬅ Retour
            </button>
                   <button onClick={handleLogout}>Déconnexion</button>
                </nav>
            </div>
            <h1>⚙️ Paramètres</h1>
            <div className="container">
                <div className="card" onClick={() => navigate("/profil")}>
                    Profil utilisateur
                    <span className="arrow">➡</span>
                </div>
                <div className="card" onClick={() => navigate("/securite")}>
                    Sécurité
                    <span className="arrow">➡</span>
                </div>
                <div className="card" onClick={() => navigate("/contact")}>
                    Contact
                    <span className="arrow">➡</span>
                </div>
            </div>


        </div>

        
    );
};

export default Parametres;
import React from 'react';
import "../styles/contact.css"; // tu peux garder ce CSS
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../logo.svg';

const Contact = () => {
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
                    <button className="back-button" onClick={() => navigate("/parametres")}>
                ⬅ Retour
            </button>
                   <button onClick={handleLogout}>Déconnexion</button>
                </nav>
            </div>
            <h1>Contactez-nous</h1>
            <div className="container">
                <div className="carre">
                    <p>📧 Email : contact@tabetu.com</p>
                    <p>📞 Téléphone : +33 1 23 45 67 89</p>
                    <p>🏢 Adresse : 123 Rue de la Tech, Paris</p>
                </div>
            </div>
        </div>
    );

};

export default Contact;

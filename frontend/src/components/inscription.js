import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../logo.svg';
import "../styles/inscription.css";

const Inscription = () => {
    const [profil, setProfil] = useState({
        nom: "",
        prenom: "",
        email: "",
        password: "",
        domaine: ""
    });

    const navigate = useNavigate();

    useEffect(() => {
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = () => {
            window.history.go(1);
        };
    }, []);

 const handleSubmit = async () => {
  console.log("Envoi du formulaire :", profil);

  // ✅ Vérifier les champs avant envoi
  if (!profil.nom || !profil.prenom || !profil.email || !profil.password || !profil.domaine) {
    alert("⚠️ Tous les champs sont obligatoires !");
    return;
  }

  try {
    const response = await fetch("https://gestion-etudiants-6.onrender.com/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profil),
    });

    // ✅ Si erreur, lire le texte brut pour éviter JSON parse error
    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Erreur serveur :", text);
      alert("Erreur serveur : " + text);
      return;
    }

    // ✅ Si tout va bien, lire le JSON
    const data = await response.json();
    console.log("✅ Réponse du serveur :", data);

    if (data.message === "✅ Inscription réussie" || data.message.includes("succès")) {
      navigate("/login");
    } else {
      alert(data.message || "Une erreur est survenue");
    }

  } catch (error) {
    console.error("❌ Erreur réseau ou autre :", error);
    alert("Erreur réseau ou serveur");
  }
};



    return (
      
           
    <div className="inscrip-page-wrapper">
        <div className="success-container-inscrip">
             <h1 className="title-inscrip">Inscription</h1>

            <div className="form-inscrip">
                <label><strong>Nom :</strong></label>
                <input
                    type="text"
                    placeholder="Nom"
                    value={profil.nom}
                    onChange={(e) => setProfil({ ...profil, nom: e.target.value })}
                />

                <label><strong>Prénom :</strong></label>
                <input
                    type="text"
                    placeholder="Prénom"
                    value={profil.prenom}
                    onChange={(e) => setProfil({ ...profil, prenom: e.target.value })}
                />

                <label><strong>Email :</strong></label>
                <input
                    type="email"
                    placeholder="Email"
                    value={profil.email}
                    onChange={(e) => setProfil({ ...profil, email: e.target.value })}
                />

                <label><strong>Mot de passe :</strong></label>
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={profil.password}
                    onChange={(e) => setProfil({ ...profil, password: e.target.value })}
                />

                <label><strong>Domaine :</strong></label>
                <input
                    type="text"
                    placeholder="Domaine"
                    value={profil.domaine}
                    onChange={(e) => setProfil({ ...profil, domaine: e.target.value })}
                />
<div className="buttons-row-i">
                <button onClick={handleSubmit}>Je m'inscris</button>
                <button onClick={() => navigate("/")}>
                    Retour
                    </button>
               </div>
            </div>
        </div>
        </div>
      
    );
};

export default Inscription;

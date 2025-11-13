import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../logo.svg';
import "../styles/profil.css";

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profilToEdit, setProfilToEdit] = useState(null);

  useEffect(() => {
    const fetchProf = async () => {
      const profId = localStorage.getItem("profId");
      if (!profId) {
        setError("❌ Aucun profId trouvé dans le localStorage !");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/prof/${profId}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération du professeur");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError("Erreur lors du fetch : " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProf();
  }, []);

  const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("profId");
        navigate("/");
    };

const handleEditProfil = async () => {
  if (!profilToEdit || !profilToEdit._id) {
    console.error("❌ Erreur : ID prof manquant !");
    return;
  }

  console.log("🚀 Données envoyées à l’API :", profilToEdit); // ← ICI

  try {
    const response = await fetch(`${API_URL}/prof/${profilToEdit._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profilToEdit),
    });

    if (response.ok) {
      const resJson = await response.json();
      setUser(resJson.updatedProf);
      setProfilToEdit(null);
      refreshProfile(); 
    } else {
      console.error("❌ Erreur lors de la mise à jour.");
    }
  } catch (error) {
    console.error("❌ Erreur :", error);
  }
};

const refreshProfile = async () => {
  const profId = localStorage.getItem("profId");
  if (!profId) return;
  
  try {
    const response = await fetch(`${API_URL}/prof/${profId}`);
    if (response.ok) {
      const updatedData = await response.json();
      setUser(updatedData); // On met à jour le profil sans rechargement
    }
  } catch (error) {
    console.error("❌ Erreur lors du rafraîchissement :", error);
  }
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
      <h1 className="title">👤 Mon Profil</h1>
<div className={`container-ligne ${profilToEdit ? "modification-active" : ""}`}>

            {user && !loading && !error && (
        <div className="user-info-container">
          <p><strong>Nom :</strong> {user.nom}</p>
          <p><strong>Prénom :</strong> {user.prenom}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Domaine :</strong> {user.domaine || ""}</p>

          <button onClick={() => setProfilToEdit(user)}>✏️ Modifier</button>

        </div>
      )}
     {profilToEdit && (
    <div className="user-info-container-modif">
        <label><strong>Nom :</strong></label>
        <input type="text" placeholder="Nom" value={profilToEdit.nom || ""} onChange={(e) => setProfilToEdit({...profilToEdit, nom: e.target.value})} />

        <label><strong>Prénom :</strong></label>
        <input type="text" placeholder="Prénom" value={profilToEdit.prenom || ""} onChange={(e) => setProfilToEdit({...profilToEdit, prenom: e.target.value})} />

        <label><strong>Email :</strong></label>
        <input type="email" placeholder="Email" value={profilToEdit.email || ""} onChange={(e) => setProfilToEdit({...profilToEdit, email: e.target.value})} />

        <label><strong>Domaine :</strong></label>
        <input type="text" placeholder="Domaine" value={profilToEdit.domaine || ""} onChange={(e) => setProfilToEdit({...profilToEdit, domaine: e.target.value})} />

        <button onClick={() => handleEditProfil()}>✔️ Mettre à jour</button>
        <button onClick={() => {setProfilToEdit(null); navigate("/profil")}}>❌ Annuler</button>
    </div>
)}
    </div>
    </div>
  );
};

export default Profil;

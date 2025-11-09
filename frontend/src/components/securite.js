import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../logo.svg';
import "../styles/securite.css";

const Securite = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [profilToEdit, setProfilToEdit] = useState(null);

const [showPasswordForm, setShowPasswordForm] = useState(false);
const [oldPassword, setOldPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");


  useEffect(() => {
    const fetchProf = async () => {
      const profId = localStorage.getItem("profId");
      if (!profId) {
        setError("❌ Aucun profId trouvé dans le localStorage !");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/prof/${profId}`);
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



const handlePasswordUpdate = async () => {
  console.log("🔍 Champs soumis :", { oldPassword, newPassword, confirmPassword });

  if (!oldPassword || !newPassword || !confirmPassword) {
    alert("❌ Tous les champs sont obligatoires !");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("❌ Les mots de passe ne correspondent pas !");
    return;
  }

  try {
    const profId = localStorage.getItem("profId");
    const response = await fetch(`http://localhost:5000/prof/${profId}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Mot de passe mis à jour !");
      setShowPasswordForm(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      alert("❌ Erreur : " + data.message);
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    alert("❌ Une erreur est survenue.");
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
      <h1 className="title">Sécurité Mot de Passe</h1>
<div className={`container-ligne ${profilToEdit ? "modification-active" : ""}`}>

            {user && !loading && !error && (
        <div className="user-info-container">
          <p><strong>Mot de passe :</strong> •••••••••••</p>
            <button /* onClick={() => setShowPasswordForm(true)}*/>🔐 Modifier le mot de passe</button>
        </div>
      )}
     
{showPasswordForm && (
  <div className="password-update-form">
    <label>Mot de passe actuel :</label>
    <input
      type="password"
      value={oldPassword}
      onChange={(e) => setOldPassword(e.target.value)}
    />

    <label>Nouveau mot de passe :</label>
    <input
      type="password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />

    <label>Confirmer le nouveau mot de passe :</label>
    <input
      type="password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />

    <button onClick={handlePasswordUpdate}>✔️ Valider</button>
    <button onClick={() => setShowPasswordForm(false)}>❌ Annuler</button>
  </div>
)}
    </div>
    </div>
  );

};
export default Securite;
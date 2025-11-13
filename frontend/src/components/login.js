import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from '../logo.svg'; // ✅ Assure-toi que le chemin est correct
import "../App.css";
import fond from '../asset/fond.jpg';

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

useEffect(() => {
        // ✅ Bloque le retour en arrière après la déconnexion
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = () => {
            window.history.go(1);
        };
    }, []);
const handleLogin = async () => {
    console.log("🔹 Email :", email);
    console.log("🔹 Password :", password);

    try {
        const response = await fetch("https://gestion-etudiants-6.onrender.com/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        console.log("🔹 Réponse du serveur :", data);

        if (response.ok) {
            // Ici, tu dois récupérer l'ID du prof dans la réponse
            // Par exemple, si le serveur renvoie data.prof._id
            // ou data._id, adapte selon ta réponse exacte
            const profId = data.prof ? data.prof._id : data._id;

            if (profId) {
                localStorage.setItem("profId", profId);

                console.log("✅ profId enregistré dans localStorage :", profId);
            } else {
                console.warn("⚠️ profId absent dans la réponse");
            }

            navigate("/success");
        } else {
            alert("❌ Erreur lors de la connexion : " + data.message);
        }
    } catch (error) {
        console.error("❌ Erreur de connexion :", error);
    }
};
const goToInscription = () => {
        navigate("/inscription");
    };


    return (
        <div className="login-background"style={{
  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${fond})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white'

}}>

 {/* ✅ Garde le style et le fond */}
            <img src={logo} alt="Logo" className="App-logo" />
            <h1>Connexion</h1>
            <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Mot de passe" onChange={(e) => setPassword(e.target.value)} />

            <div className="buttons-row">
            <button onClick={handleLogin}>Se connecter</button>
            <button onClick={goToInscription}>Inscription</button>
            </div>
        </div>
    );
};

export default Login;
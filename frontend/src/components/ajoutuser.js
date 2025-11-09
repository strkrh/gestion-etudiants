import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from '../logo.svg';
import "../styles/ajoutuser.css"; 

const Ajoutuser = () => {
    const navigate = useNavigate();
    const [etudiants, setEtudiants] = useState([]);

    
const [message, setMessage] = useState(""); // ✅ État pour afficher le message
    
const [nom, setNom] = useState("");
const [prenom, setPrenom] = useState("");
const [email, setEmail] = useState("");
const [niveau, setNiveau] = useState("");
const [domaine, setDomaine] = useState("");

useEffect(() => {

        const fetchEtudiants = async () => {
            const profId = localStorage.getItem("profId");
            if (!profId) {
                console.error("❌ profId manquant en localStorage !");
                return;
            }

            try {
                // Correction: backend ne filtre pas directement sur profId par query param,
                // donc on envoie une requête GET simple et on filtre côté frontend (ou backend à modifier)
                const response = await fetch(`http://localhost:5000/etudiants?profId=${profId}`);

                if (!response.ok) throw new Error("Erreur lors du chargement des étudiants");
                const data = await response.json();
                // Filtrer côté frontend les étudiants du prof connecté
                const filteredEtudiants = data.filter(e => e.profId === profId || e.profId?._id === profId);
                setEtudiants(filteredEtudiants);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEtudiants();
    }, []);
const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

const handleAddStudent = async () => {
    try {
        const profId = localStorage.getItem("profId");

        // 👇 Vérifie les données envoyées
        console.log("📤 Données envoyées :", { nom, prenom, email, niveau, domaine, profId });

        const response = await fetch("http://localhost:5000/etudiants", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom, prenom, email, niveau, domaine, profId }),
        });

        if (response.ok) {
            const nouvelEtudiant = await response.json();
            setEtudiants([...etudiants, nouvelEtudiant]);
            setMessage("L'étudiant a été ajouté à la liste !");
            setNom(""); setPrenom(""); setEmail(""); setNiveau(""); setDomaine("");
        } else {
            console.error("🚫 Erreur lors de l'ajout. Code HTTP :", response.status);
            const errorDetails = await response.json();
            console.error("🪵 Détails :", errorDetails);
        }
    } catch (error) {
        console.error("❌ Erreur réseau ou JS :", error);
    }
};


    return (
        <div className="success-container-ajout">
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
            <div className="form-container-ajout">
            <h3>Ajouter un étudiant</h3>
            <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} />
            <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="Niveau" value={niveau} onChange={(e) => setNiveau(e.target.value)} />
            <input type="text" placeholder="Domaine" value={domaine} onChange={(e) => setDomaine(e.target.value)} />
            <button onClick={handleAddStudent}>Ajouter</button>
           
            {message && <p className="message-ajout">{message}</p>}
        </div>
        </div>

        
    );
};

export default Ajoutuser;


import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from '../logo.svg';
import "../styles/modifier.css"; 

const Modifier = () => {
    const navigate = useNavigate();
    const [etudiants, setEtudiants] = useState([]);
    const [studentToEdit, setStudentToEdit] = useState(null);


    useEffect(() => {
        const etudiant = JSON.parse(localStorage.getItem("etudiantAModifier"));
    if (etudiants) {
        setStudentToEdit(etudiant);
    }

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
        localStorage.removeItem("profId");
        navigate("/");
    };

    const handleUpdateStudent = async () => {
        if (!studentToEdit || !studentToEdit._id) {
            console.error("❌ Erreur : ID étudiant manquant !");
            return;
            
        }
        console.log("📦 Données envoyées pour update :", studentToEdit);

        try {
            const response = await fetch(`http://localhost:5000/etudiants/${studentToEdit._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(studentToEdit),
            });
            if (response.ok) {
            const updatedStudent = await response.json();
            console.log("✅ Étudiant mis à jour :", updatedStudent);
            navigate("/success", { state: { refresh: true } });


            setEtudiants(etudiants.map((etudiant) =>
                etudiant._id === updatedStudent._id ? updatedStudent : etudiant
            ));
                setStudentToEdit(null);
                console.log("🔄 Liste des étudiants mise à jour :", etudiants);

            } else {
                console.error("❌ Erreur lors de la mise à jour.");
            }
        } catch (error) {
            console.error("❌ Erreur :", error);
        }
    };


    return (
        <div className="success-container-m">
            <div className="header-m">
                <img src={logo} alt="Logo" className="logo" />
                <nav className="menu-m">
                    <button className="back-button" onClick={() => navigate("/success")}>
                ⬅ Retour
            </button>
                    <button onClick={handleLogout}>Déconnexion</button>
                </nav>
            </div>
                    <div className="form-container-m">
            <h2>Modifier un étudiant</h2>
            {studentToEdit && (
                <div className="edit-container-m">
                    <input type="text" placeholder="Nom" value={studentToEdit.nom || ""} onChange={(e) => setStudentToEdit({...studentToEdit, nom: e.target.value})} />
                    <input type="text" placeholder="Prénom" value={studentToEdit.prenom || ""} onChange={(e) => setStudentToEdit({...studentToEdit, prenom: e.target.value})} />
                    <input type="email" placeholder="Email" value={studentToEdit.email || ""} onChange={(e) => setStudentToEdit({...studentToEdit, email: e.target.value})} />
                    <input type="text" placeholder="Niveau" value={studentToEdit.niveau || ""} onChange={(e) => setStudentToEdit({...studentToEdit, niveau: e.target.value})} />
                    <input type="text" placeholder="Domaine" value={studentToEdit.domaine || ""} onChange={(e) => setStudentToEdit({...studentToEdit, domaine: e.target.value})} />
                    <button onClick={() => handleUpdateStudent()}>✔️ Mettre à jour  </button>
                    <button onClick={() => {setStudentToEdit(null); navigate("/success")}}>❌ Annuler</button>
                </div>
            )}
        </div>
        </div>
    );
};

export default Modifier;

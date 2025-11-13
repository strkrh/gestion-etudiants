import { useNavigate } from "react-router-dom"; // permet de naviguer entre les pages avec react
import { useEffect, useState } from "react";
import logo from '../logo.svg';
import "../styles/success.css"; // ✅ Vérifie que le fichier est bien importé

const Success = () => {
    const navigate = useNavigate();
    const [etudiants, setEtudiants] = useState([]);
    const [studentToEdit, setStudentToEdit] = useState(null);


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
                const response = await fetch(`${API_URL}/etudiants?profId=${profId}`);
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

    const goToAjouter = () => {
        navigate("/ajoutuser");
    };
    const goToSettings = () => {
        navigate("/parametres");
    };
    const goToUpdate = () => {
        navigate("/modifier");
    };

    const handleDeleteStudent = async (id) => {
        try {
            const response = await fetch(`${API_URL}/etudiants/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setEtudiants(etudiants.filter((etudiant) => etudiant._id !== id)); // ✅ Supprime l’étudiant côté frontend
            } else {
                console.error("Erreur lors de la suppression.");
            }
        } catch (error) {
            console.error("Erreur :", error);
        }
    };

    const handleUpdateStudent = async () => {
        if (!studentToEdit || !studentToEdit._id) {
            console.error("❌ Erreur : ID étudiant manquant !");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/etudiants/${studentToEdit._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(studentToEdit),
            });

            if (response.ok) {
                setEtudiants(etudiants.map((etudiant) => 
                    etudiant._id === studentToEdit._id ? studentToEdit : etudiant));
                setStudentToEdit(null);
            } else {
                console.error("❌ Erreur lors de la mise à jour.");
            }
        } catch (error) {
            console.error("❌ Erreur :", error);
        }
    };

    const handleEditStudent = (etudiant) => {
        localStorage.setItem("etudiantAModifier", JSON.stringify(etudiant)); // Stocker temporairement
};


    return (
        <div className="success-container">
            <div className="header">
                <img src={logo} alt="Logo" className="logo" />
                <nav className="menu">
                    <button onClick={goToAjouter}>Ajouter Etudiant</button>
                    <button onClick={goToSettings}>Paramètres</button>
                    <button onClick={handleLogout}>Déconnexion</button>
                </nav>
            </div>

            <h1 className="title">📚 Voici Mes Étudiants</h1>

            <table className="etudiants-table">
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Niveau</th>
                        <th>Domaine</th>
                        <th className="action-header">Action</th>
                    </tr>
                </thead>
                <tbody>
                   {etudiants.map((etudiant, index) => (
                        <tr key={index}>
                            <td>{etudiant.nom}</td>
                            <td>{etudiant.prenom}</td>
                            <td>{etudiant.email}</td>
                            <td>{etudiant.niveau}</td>
                            <td>{etudiant.domaine}</td>
                            <td>
                                <button onClick={() => handleDeleteStudent(etudiant._id)}>🗑️ Supprimer</button>
                                <button onClick={() =>{ goToUpdate(); handleEditStudent(etudiant);}}>✏️ Modifier</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            
        </div>
    );
};

export default Success;

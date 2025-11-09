import { useEffect, useState } from 'react';
import { getEtudiants, deleteEtudiant } from '../api/studentApi';
import { Link } from 'react-router-dom';

interface Etudiant {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  niveau: string;
  domaine: string;
}

export default function StudentList() {
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);

  useEffect(() => {
    getEtudiants().then(res => setEtudiants(res.data));
  }, []);

  const handleDelete = (id: string) => {
    deleteEtudiant(id).then(() =>
      setEtudiants(etudiants.filter(e => e._id !== id))
    );
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Liste des étudiants</h1>
        <Link to="/add" className="px-4 py-2 bg-blue-600 text-white rounded">Ajouter</Link>
      </div>
      <table className="min-w-full bg-white shadow rounded">
        <thead>
          <tr>
            {['Nom', 'Prénom', 'Email', 'Niveau', 'Domaine', 'Actions'].map(h => (
              <th key={h} className="px-4 py-2 text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {etudiants.map(e => (
            <tr key={e._id} className="border-t">
              <td className="px-4 py-2">{e.nom}</td>
              <td className="px-4 py-2">{e.prenom}</td>
              <td className="px-4 py-2">{e.email}</td>
              <td className="px-4 py-2">{e.niveau}</td>
              <td className="px-4 py-2">{e.domaine}</td>
              <td className="px-4 py-2 space-x-2">
                <Link to={`/edit/${e._id}`} className="text-blue-600">Modifier</Link>
                <button onClick={() => handleDelete(e._id)} className="text-red-600">Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

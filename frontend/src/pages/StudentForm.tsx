import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEtudiant, getEtudiants, updateEtudiant } from '../api/studentApi';

interface Etudiant {
  nom: string;
  prenom: string;
  email: string;
  niveau: string;
  domaine: string;
}

const StudentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [etudiant, setEtudiant] = useState<Etudiant>({
    nom: '',
    prenom: '',
    email: '',
    niveau: '',
    domaine: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      getEtudiants().then(res => {
        const found = res.data.find((e: any) => e._id === id);
        if (found) {
          setEtudiant({
            nom: found.nom,
            prenom: found.prenom,
            email: found.email,
            niveau: found.niveau,
            domaine: found.domaine         });
        }
      }).finally(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEtudiant({ ...etudiant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (id) {
      await updateEtudiant(id, etudiant);
    } else {
      await createEtudiant(etudiant);
    }
    navigate('/');
  };

  if (loading) return <p className="p-8">Chargement...</p>;

  return (
    <div className="max-w-md mx-auto p-8 bg-white shadow rounded">
      <h1 className="text-xl font-bold mb-4">{id ? 'Modifier' : 'Ajouter'} un étudiant</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nom" className="block text-sm font-medium">Nom</label>
          <input
            id="nom"
            name="nom"
            value={etudiant.nom}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium">Prénom</label>
          <input
            id="prenom"
            name="prenom"
            value={etudiant.prenom}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={etudiant.email}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="niveau" className="block text-sm font-medium">Niveau</label>
          <input
            id="niveau"
            name="niveau"
            value={etudiant.niveau}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label htmlFor="domaine" className="block text-sm font-medium">Domaine</label>
          <input
            id="domaine"
            name="domaine"
            value={etudiant.domaine}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded" />
        </div>
        <div className="flex justify-between">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {id ? 'Mettre à jour' : 'Ajouter'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;

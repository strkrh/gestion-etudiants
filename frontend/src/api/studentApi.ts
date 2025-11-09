import axios from 'axios';

const API_URL = 'http://localhost:5000/api/etudiants';

export const getEtudiants = () => axios.get(API_URL);
export const createEtudiant = (data: { nom: string; prenom: string; email: string; niveau: string; domaine: string; }) =>
  axios.post(API_URL, data);
export const updateEtudiant = (id: string, data: any) =>
  axios.put(`${API_URL}/${id}`, data);
export const deleteEtudiant = (id: string) => axios.delete(`${API_URL}/${id}`);

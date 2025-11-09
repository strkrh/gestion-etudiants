import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Success from './components/success'; // ✅ Import de la page Connexion Réussie
import Login from './components/login';
import Profil from './components/profil';
import Parametres from "./components/parametres"; // ✅ Import de Paramètres
import Ajoutuser from "./components/ajoutuser";
import Modifier from 'components/modifier';
import Securite from 'components/securite';
import Contact from 'components/contact';
import Inscription from 'components/inscription';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/success" element={<Success />} /> {/* ✅ Route pour la page succès */}
                 <Route path="/profil" element={<Profil />} />
                <Route path="/parametres" element={<Parametres />} /> {/* ✅ Nouvelle route */}
                <Route path="/ajoutuser" element={<Ajoutuser />} /> {/* ✅ Nouvelle route */}
                <Route path="/modifier" element={<Modifier />} /> {/* ✅ Nouvelle route */}
                <Route path="/securite" element={<Securite />} /> {/* ✅ Nouvelle route */}
                <Route path="/contact" element={<Contact />} /> {/* ✅ Nouvelle route */}
                <Route path="/inscription" element={<Inscription />} /> {/* ✅ Nouvelle route */}
            </Routes>
        </Router>
    );
};

export default App;
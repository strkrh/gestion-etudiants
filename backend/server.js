const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const profmodel = require("./models/profModel");
const profRoutes = require("./routes/profRoutes");
console.log(profmodel.schema.paths);

dotenv.config();
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/prof", profRoutes);

// ✅ Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connecté à MongoDB"))
.catch((err) => console.error("Erreur MongoDB:", err));

// ✅ Définir le modèle Étudiant
const EtudiantSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    niveau: String,
    domaine: String,
    profId: { type: mongoose.Schema.Types.ObjectId, ref: "prof" }
});
mongoose.connection.once("open", () => {
    console.log("🔹 MongoDB est connecté sur la base :", mongoose.connection.db.databaseName);
});

const Etudiant = mongoose.model("Etudiant", EtudiantSchema);

// ✅ Route d'accueil
app.get("/", (req, res) => {
    res.send("API Étudiants opérationnelle !");
});
app.get("/dashboard", async (req, res) => {
    try {
        const { email } = req.user;
        const prof = await mongoose.connection.db.collection("prof").findOne({ email });

        if (!prof) {
            return res.status(404).json({ message: "Prof non trouvé !" });
        }

        const etudiants = await Etudiant.find({ profId: prof._id }); // ✅ Filtrer les étudiants liés au Prof connecté
        res.status(200).json({ prof, etudiants });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// ✅ Route de connexion
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;                                 

        console.log("🔹 Tentative de connexion :", email);
        const prof = await profmodel.findOne({ email });


        console.log("🔹 Résultat MongoDB :", prof);

        if (!prof) {
            return res.status(400).json({ message: "Email incorrect !" });
        }

        const isMatch = await bcrypt.compare(password, prof.password);
        console.log("🔹 Mot de passe correct ?", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Mot de passe incorrect !" });
        }

        // Envoie de l'objet prof dans la réponse
        res.json({ 
            message: "✅ Connexion réussie", 
            token: "fake-jwt-token", 
            prof 
        });
    } catch (error) {
        console.error("❌ Erreur serveur :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

app.put("/etudiants/linkprof", async (req, res) => {
    try {
        const { emailprof } = req.body; 

        console.log("🔹 Tentative de lien avec :", emailprof);

        if (!emailprof) {
            return res.status(400).json({ message: "⛔ Email du prof requis !" });
        }

        const prof = await mongoose.connection.db.collection("prof").findOne({ email: emailprof });

        console.log("🔹 prof trouvé :", prof);

        if (!prof) {
            return res.status(404).json({ message: "❌ prof non trouvé !" });
        }

        const updateResult = await Etudiant.updateMany(
            { profId: null }, // ✅ On modifie uniquement ceux sans prof associé
            { $set: { profId: prof._id } }
        );

        console.log("🔹 Résultat de la mise à jour :", updateResult);

        res.status(200).json({ message: "✅ Étudiants liés à leur prof avec succès !" });
    } catch (error) {
        console.error("❌ Erreur détectée :", error.message);
        res.status(500).json({ message: "Erreur serveur", error: error.message });

    }
});
app.delete("/etudiants/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const etudiantSupprime = await Etudiant.findByIdAndDelete(id);

        if (!etudiantSupprime) {
            return res.status(404).json({ message: "Étudiant non trouvé !" });
        }

        res.status(200).json({ message: "Étudiant supprimé avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
app.get("/modifier/:id", async (req, res) => {
    try {
        const etudiant = await Etudiant.findById(req.params.id); // Cherche l'étudiant en base
        if (!etudiant) return res.status(404).json({ message: "Étudiant non trouvé" });
        res.json(etudiant);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
app.put("/modifier/:id", async (req, res) => {
    try {
        const updatedStudent = await Etudiant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedStudent) return res.status(404).json({ message: "Étudiant non trouvé" });
        res.json({ message: "✅ Étudiant mis à jour", student: updatedStudent });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

app.put("/etudiants/:id", async (req, res) => {
    console.log("🔹 Requête PUT reçue avec ID :", req.params.id);
    console.log("🔹 Type de l'ID reçu :", typeof req.params.id);
    console.log("🔹 Données mises à jour :", req.body);

    try {
        const id = req.params.id;

        // ✅ Vérifie si MongoDB enregistre l'ID en ObjectId ou String
        const profExists = await Etudiant.findById(id);

        if (!profExists) {
            return res.status(404).json({ message: "❌ Étudiant non trouvé dans la base MongoDB !" });
        }

        const result = await Etudiant.findByIdAndUpdate(id, req.body, { new: true });

        res.json(result);
    } catch (error) {
        console.error("❌ Erreur mise à jour :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
});


// ✅ Route pour ajouter un étudiant (CORRIGÉ)
app.post("/etudiants", async (req, res) => {
    try {
        let { nom, prenom, email, niveau, domaine, profId } = req.body;

        console.log("🔹 Tentative d'ajout avec profId :", profId);

        if (!nom || !prenom || !email || !niveau || !domaine || !profId) {
            return res.status(400).json({ message: "⛔ Tous les champs sont obligatoires, y compris 'profId' !" });
        }

        // 🔁 Convertir profId en ObjectId
        profId = new mongoose.Types.ObjectId(profId);

        const nouvelEtudiant = new Etudiant({ nom, prenom, email, niveau, domaine,  profId });
        await nouvelEtudiant.save();

        await nouvelEtudiant.save();
        res.status(201).json(nouvelEtudiant);

    } catch (error) {
        console.error("❌ Erreur détectée :", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
app.post("/prof", async (req, res) => {
    try {
        const { nom, prenom, email, password, domaine } = req.body;

        if (role !== "admin") {
            return res.status(403).json({ message: "⛔ Accès refusé ! Seuls les administrateurs peuvent ajouter un Prof." });
        }

        const existingprof = await profmodel.findOne({ email }); // ✅ CORRIGÉ

        if (existingprof) {
            return res.status(400).json({ message: "Email déjà utilisé !" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newprof = new profmodel({ // ✅ CORRIGÉ
            nom,
            prenom,
            email,
            password: hashedPassword,
            domaine
        });

        await newprof.save();
        res.status(201).json({ message: "✅ Prof ajouté avec succès !" });

    } catch (error) {
        res.status(500).json({ message: "❌ Erreur serveur", error });
    }
});


// ✅ Route pour récupérer les étudiants (MODIFIÉE)
app.get("/etudiants", async (req, res) => {
    try {
        const { profId } = req.query;  // récupère profId dans l'URL

        let filter = {};
        if (profId) {
            filter.profId = profId;  // filtre par profId si fourni
        }

        const etudiants = await Etudiant.find(filter);
        res.status(200).json(etudiants);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});
app.get("/prof/:id", async (req, res) => {
    try {
        const profid = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(profid)) {
            return res.status(400).json({ message: "id invalide" });
        }

        const prof = await profmodel.findById(profid); // <- pas de collision ici

        if (!prof) {
            return res.status(404).json({ message: "professeur non trouvé" });
        }

        res.json(prof);
    } catch (error) {
        console.error("erreur serveur dans /prof/:id :", error);
        res.status(500).json({ message: "erreur serveur" });
    }
});

app.put('/prof/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const updatedProf = await profmodel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedProf) return res.status(404).send('Prof not found');
    res.json(updatedProf);
  } catch (error) {
    res.status(500).send('Erreur serveur');
  }
});

app.put("/prof/:id/password", async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const prof = await profmodel.findById(req.params.id);

    if (!prof) {
      return res.status(404).json({ message: "Professeur non trouvé" });
    }

    // 👇 Compare les mots de passe avec bcrypt
    const isMatch = await bcrypt.compare(oldPassword, prof.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Ancien mot de passe incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    prof.password = hashedPassword;
    await prof.save();

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    console.error("💥 Erreur dans PUT /prof/:id/password :", err); // <-- ici
    res.status(500).json({ message: "Erreur serveur" });
  }
});


app.post("/register", async (req, res) => {
    try {
        const { nom, prenom, email, password, domaine } = req.body;


        // ✅ Création du prof avec mot de passe chiffré
        const newprof = new profmodel({
            nom,
            prenom,
            email,
            password,
            domaine
        });

        await newprof.save();

        res.status(201).json({ message: "Utilisateur créé avec succès !" });
    } catch (error) {
        console.error("Erreur /register :", error); // <-- pour debug
        res.status(500).json({ message: "Erreur lors de l'inscription", error });
    }
});
app.post("/register", async (req, res) => {
  try {
    const { nom, prenom, email, password, domaine } = req.body;

    // Vérifier si le compte existe déjà
    const existingProf = await profmodel.findOne({ email });
    if (existingProf) {
      return res.status(400).json({ message: "Email déjà utilisé !" });
    }

    // ✅ Hachage du mot de passe AVANT d'enregistrer
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newprof = new profmodel({
      nom,
      prenom,
      email,
      password: hashedPassword, // ✅ Mot de passe chiffré
      domaine
    });

    await newprof.save();

    res.status(201).json({ message: "✅ Utilisateur créé avec succès !" });
  } catch (error) {
    console.error("Erreur /register :", error);
    res.status(500).json({ message: "Erreur lors de l'inscription", error });
  }
});


// ✅ Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));

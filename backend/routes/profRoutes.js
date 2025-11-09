const router = require('express').Router();
const prof = require("../models/profModel");

// GET ALL
router.get('/', async (req, res) => {
  // code getAll ici ou appelle ton controller
});

// GET BY ID
router.get('/:id', async (req, res) => {
  try {
    const profid = req.params.id;
    if (!profid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID invalide" });
    }
    const profFound = await prof.findById(profid);
    if (!profFound) return res.status(404).json({ message: "Prof non trouvé" });
    res.json(profFound);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST (create)
router.post('/', async (req, res) => {
  try {
    const newProf = new prof(req.body);
    await newProf.save();
    res.status(201).json({ message: "✅ prof ajouté avec succès !" });
  } catch (error) {
    res.status(500).json({ message: "❌ Erreur serveur", error });
  }
});


// PUT /:id (update)
router.put('/:id', async (req, res) => {
  try {
    const profid = req.params.id;
    if (!profid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const updatedProf = await prof.findByIdAndUpdate(profid, req.body, { new: true });
    if (!updatedProf) {
      return res.status(404).json({ message: "Prof non trouvé" });
    }

    res.json({ message: "✅ Prof mis à jour avec succès", updatedProf });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// PUT /:id (update)
// DELETE /:id (delete)

module.exports = router;

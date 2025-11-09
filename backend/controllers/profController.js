const prof = require('../models/profModel'); // variable prof recupere la structure du tableau des etudiants de la base de données 
exports.getAll = async (req, res) => res.json(await prof.find()); //
exports.create = async (req, res) => res.status(201).json(await prof.create(req.body));
exports.update = async (req, res) => res.json(await prof.findByIdAndUpdate(req.params.id, req.body, { new: true }));
exports.remove = async (req, res) => { await prof.findByIdAndDelete(req.params.id); res.status(204).end(); };

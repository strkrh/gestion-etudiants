const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Définition du schéma pour prof
const profSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
  },
  prenom: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  domaine: {
    type: String,
    required: true,
  }
});

// Middleware pre-save : hache le mot de passe si celui-ci a été modifié ou est nouveau
profSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
const prof = mongoose.model("Prof", profSchema, "prof"); // ✅
module.exports = prof;

// Création et exportation du modèle Prof


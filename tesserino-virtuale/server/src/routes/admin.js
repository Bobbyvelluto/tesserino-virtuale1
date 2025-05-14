const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Login admin
router.post('/login', async (req, res) => {
  try {
    console.log('Richiesta login ricevuta:', req.body);
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    console.log('Admin trovato:', admin);

    if (!admin) {
      console.log('Admin non trovato');
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const isMatch = await admin.comparePassword(password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non valide' });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ message: error.message });
  }
});

// Middleware per verificare il token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id);

    if (!admin) {
      throw new Error();
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Autenticazione richiesta' });
  }
};

// Route protetta per creare un nuovo admin
router.post('/register', auth, async (req, res) => {
  try {
    const admin = new Admin({
      username: req.body.username,
      password: req.body.password
    });

    const newAdmin = await admin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 
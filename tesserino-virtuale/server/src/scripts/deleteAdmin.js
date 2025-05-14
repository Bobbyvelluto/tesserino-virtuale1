require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const username = process.argv[2] || 'admin';

const deleteAdmin = async () => {
  try {
    await connectDB();
    const res = await Admin.deleteOne({ username });
    if (res.deletedCount > 0) {
      console.log(`Admin '${username}' eliminato con successo.`);
    } else {
      console.log(`Nessun admin '${username}' trovato.`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Errore nell\'eliminazione dell\'admin:', error);
    process.exit(1);
  }
};

deleteAdmin(); 
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const username = process.argv[2] || 'admin';
const password = process.argv[3] || 'admin123';

const createAdmin = async () => {
  try {
    await connectDB();
    
    const admin = new Admin({
      username,
      password
    });

    await admin.save();
    console.log(`Admin creato con successo! Username: ${username}`);
    process.exit(0);
  } catch (error) {
    console.error('Errore nella creazione dell\'admin:', error);
    process.exit(1);
  }
};

createAdmin(); 
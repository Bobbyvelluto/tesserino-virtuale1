require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connessione al database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/students', require('./routes/students'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server in esecuzione sulla porta ${PORT}`);
}); 
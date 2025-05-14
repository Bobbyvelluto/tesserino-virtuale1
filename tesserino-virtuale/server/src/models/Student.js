const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  date: Date,
  isUsed: {
    type: Boolean,
    default: false
  }
});

const tesserinoSchema = new mongoose.Schema({
  attivatoIl: {
    type: Date,
    default: Date.now
  },
  lessons: [lessonSchema]
});

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  telefono: {
    type: String,
    required: true,
    unique: true
  },
  tesserini: [tesserinoSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Inizializza 1 tesserino con 10 lezioni non utilizzate per ogni nuovo studente
studentSchema.pre('save', function(next) {
  if (this.isNew) {
    this.tesserini = [{
      attivatoIl: new Date(),
      lessons: Array(10).fill().map(() => ({ isUsed: false }))
    }];
  }
  next();
});

module.exports = mongoose.model('Student', studentSchema); 
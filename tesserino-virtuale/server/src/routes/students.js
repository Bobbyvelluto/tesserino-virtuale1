const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Ottieni tutti gli studenti
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().select('-__v');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Ottieni uno studente specifico
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-__v');
    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Crea un nuovo studente
router.post('/', async (req, res) => {
  const student = new Student({
    name: req.body.name,
    telefono: req.body.telefono
  });

  try {
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Aggiorna una lezione
router.patch('/:id/lessons/:lessonIndex', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }

    const lessonIndex = parseInt(req.params.lessonIndex);
    if (lessonIndex < 0 || lessonIndex >= student.lessons.length) {
      return res.status(400).json({ message: 'Indice lezione non valido' });
    }

    student.lessons[lessonIndex].isUsed = true;
    student.lessons[lessonIndex].date = new Date();

    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Annulla una lezione (modulo) già usata
router.patch('/:id/lessons/:lessonIndex/undo', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }
    const lessonIndex = parseInt(req.params.lessonIndex);
    if (lessonIndex < 0 || lessonIndex >= student.lessons.length) {
      return res.status(400).json({ message: 'Indice lezione non valido' });
    }
    student.lessons[lessonIndex].isUsed = false;
    student.lessons[lessonIndex].date = null;
    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Modifica nome e telefono di uno studente
router.patch('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }
    if (req.body.name) student.name = req.body.name;
    if (req.body.telefono) student.telefono = req.body.telefono;
    const updatedStudent = await student.save();
    res.json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Elimina uno studente
router.delete('/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }
    res.json({ message: 'Studente eliminato' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Aggiungi un nuovo tesserino a uno studente
router.post('/:id/tesserini', async (req, res) => {
  console.log('DEBUG numLessons:', req.body.numLessons);
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Studente non trovato' });
    }
    const numLessons = req.body.numLessons || 10; // Default 10 se non specificato
    student.tesserini.push({
      attivatoIl: new Date(),
      lessons: Array(numLessons).fill().map(() => ({ isUsed: false }))
    });
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Annulla una lezione su un tesserino specifico
router.patch('/:id/tesserini/:tessIndex/lessons/:lessonIndex/undo', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const tessIndex = parseInt(req.params.tessIndex);
    const lessonIndex = parseInt(req.params.lessonIndex);
    if (!student || !student.tesserini[tessIndex]) {
      return res.status(404).json({ message: 'Studente o tesserino non trovato' });
    }
    const lesson = student.tesserini[tessIndex].lessons[lessonIndex];
    if (!lesson) {
      return res.status(400).json({ message: 'Indice lezione non valido' });
    }
    lesson.isUsed = false;
    lesson.undoDate = new Date();
    lesson.date = null;
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Marca una lezione come usata su un tesserino specifico
router.patch('/:id/tesserini/:tessIndex/lessons/:lessonIndex/use', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    const tessIndex = parseInt(req.params.tessIndex);
    const lessonIndex = parseInt(req.params.lessonIndex);
    if (!student || !student.tesserini[tessIndex]) {
      return res.status(404).json({ message: 'Studente o tesserino non trovato' });
    }
    const lesson = student.tesserini[tessIndex].lessons[lessonIndex];
    if (!lesson) {
      return res.status(400).json({ message: 'Indice lezione non valido' });
    }
    lesson.isUsed = true;
    lesson.date = new Date();
    lesson.undoDate = null;
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 
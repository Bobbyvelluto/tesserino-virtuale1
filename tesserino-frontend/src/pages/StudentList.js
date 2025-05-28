import React, { useState } from 'react';
import axios from 'axios';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const StudentList = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTessType, setSelectedTessType] = useState(null);
  const [newStudent, setNewStudent] = useState({ name: '', telefono: '' });
  const [openTessDialog, setOpenTessDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;

  const handleChange = (event) => {
    setNewStudent({ ...newStudent, [event.target.name]: event.target.value });
  };

  const handleTessTypeChange = (event) => {
    setSelectedTessType(event.target.value);
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!selectedTessType) {
      alert("Seleziona il tipo di tesserino!");
      return;
    }
    setIsSaving(true);
    try {
      const res = await axios.post(`${apiUrl}/api/students`, newStudent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      await axios.post(`${apiUrl}/api/students/${res.data._id}/tesserini`, { numLessons: selectedTessType }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOpen(false);
      setOpenTessDialog(false);
      setNewStudent({ name: '', telefono: '' });
      setSelectedTessType(null);
      // fetchStudents(); // decommenta se hai la funzione
    } catch (error) {
      console.error("Errore nell'aggiunta dello studente:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Bottone per aprire il dialog di aggiunta studente */}
      <Button onClick={() => setOpen(true)}>Aggiungi Studente</Button>
      {/* Dialog per inserire nome e telefono */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Aggiungi Nuovo Studente</DialogTitle>
        <DialogContent>
          <input
            placeholder="Nome"
            value={newStudent.name}
            onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
          />
          <input
            placeholder="Telefono"
            value={newStudent.telefono}
            onChange={e => setNewStudent({ ...newStudent, telefono: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={() => { setOpen(false); setOpenTessDialog(true); }}>Avanti</Button>
        </DialogActions>
      </Dialog>
      {/* Dialog per selezionare il tipo di tesserino */}
      <Dialog open={openTessDialog} onClose={() => setOpenTessDialog(false)}>
        <DialogTitle>Scegli il tipo di tesserino</DialogTitle>
        <DialogContent>
          <Button
            variant={selectedTessType === 10 ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => setSelectedTessType(10)}
            sx={{ m: 1 }}
          >
            Tesserino 10 moduli
          </Button>
          <Button
            variant={selectedTessType === 5 ? 'contained' : 'outlined'}
            color="secondary"
            onClick={() => setSelectedTessType(5)}
            sx={{ m: 1 }}
          >
            Tesserino 5 moduli
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTessDialog(false)}>Annulla</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvataggio...' : 'Salva'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default StudentList; 
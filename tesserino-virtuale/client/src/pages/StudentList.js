import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Visibility as VisibilityIcon, ContentCopy as ContentCopyIcon, QrCode as QrCodeIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { saveAs } from 'file-saver';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', telefono: '' });
  const [qrOpen, setQrOpen] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [editStudent, setEditStudent] = useState({ _id: '', name: '', telefono: '' });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://192.168.1.8:5050/api/students', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Errore nel caricamento degli studenti:', error);
    }
  };

  const handleAddStudent = async () => {
    try {
      await axios.post('http://192.168.1.8:5050/api/students', newStudent, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setOpen(false);
      setNewStudent({ name: '', telefono: '' });
      fetchStudents();
    } catch (error) {
      console.error('Errore nell\'aggiunta dello studente:', error);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      try {
        await axios.delete(`http://192.168.1.8:5050/api/students/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchStudents();
      } catch (error) {
        alert('Errore nell\'eliminazione dello studente');
      }
    }
  };

  // Funzione per ottenere l'IP locale del server invece di localhost
  function getServerOrigin() {
    // Sostituisci 'localhost' con l'IP locale del server
    const origin = window.location.origin;
    if (origin.includes('localhost')) {
      // Inserisci qui il tuo IP locale, ad esempio:
      return origin.replace('localhost', '192.168.1.8');
    }
    return origin;
  }

  const handleCopyLink = (id) => {
    const url = `${getServerOrigin()}/student/${id}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url)
        .then(() => alert('Link tesserino copiato!'))
        .catch(() => alert('Copia non riuscita, copia manualmente il link: ' + url));
    } else {
      window.prompt('Copia manualmente il link:', url);
    }
  };

  const handleShowQR = (id) => {
    setQrValue(`${getServerOrigin()}/student/${id}`);
    setQrOpen(true);
  };

  const handleCloseQR = () => {
    setQrOpen(false);
    setQrValue('');
  };

  const handleEditStudent = (student) => {
    setEditStudent(student);
    setEditOpen(true);
  };

  const handleEditStudentSave = async () => {
    try {
      await axios.patch(`http://192.168.1.8:5050/api/students/${editStudent._id}`, {
        name: editStudent.name,
        telefono: editStudent.telefono,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEditOpen(false);
      setEditStudent({ _id: '', name: '', telefono: '' });
      fetchStudents();
    } catch (error) {
      alert('Errore nella modifica dello studente');
    }
  };

  const getLessons = (student) =>
    student && student.tesserini && Array.isArray(student.tesserini) && student.tesserini.length > 0 && Array.isArray(student.tesserini[student.tesserini.length - 1].lessons)
      ? student.tesserini[student.tesserini.length - 1].lessons
      : [];

  const filteredStudents = students.filter(student => {
    const lessons = getLessons(student);
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || student.telefono.includes(search);
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && lessons.some(l => !l.isUsed);
    if (filter === 'finished') return matchesSearch && lessons.length > 0 && lessons.every(l => l.isUsed);
    return true;
  });

  const exportCSV = () => {
    const header = ['Nome', 'Telefono', 'Lezioni Usate', 'Lezioni Totali', 'Storico Lezioni'];
    const rows = students.map(s => [
      s.name,
      s.telefono,
      s.lessons.filter(l => l.isUsed).length,
      s.lessons.length,
      s.lessons.map((l, i) => `#${i+1}:${l.isUsed ? 'Usata' : (l.date ? 'Annullata' : 'Disponibile')}@${l.date ? new Date(l.date).toLocaleString('it-IT') : '-'}`).join(' | ')
    ]);
    const csv = [header, ...rows].map(r => r.map(x => `"${x}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'studenti_tesserini.csv');
  };

  const studentsInScadenza = students.filter(
    s => getLessons(s).filter(l => !l.isUsed).length <= 2
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Lista Studenti
        </Typography>
        {studentsInScadenza.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Attenzione: {studentsInScadenza.length} studente/i stanno per terminare il tesserino!
            {studentsInScadenza.map(s => ` [${s.name} (${s.telefono})]`).join(', ')}
          </Alert>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          <TextField
            placeholder="Cerca per nome o telefono"
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: 260 }}
          />
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={(e, v) => v && setFilter(v)}
            size="small"
          >
            <ToggleButton value="all">Tutti</ToggleButton>
            <ToggleButton value="active">Con lezioni residue</ToggleButton>
            <ToggleButton value="finished">Tesserino esaurito</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ mb: 2 }}
        >
          Aggiungi Studente
        </Button>
        <Button
          variant="outlined"
          sx={{ ml: 2, mb: 2 }}
          onClick={exportCSV}
        >
          Esporta CSV
        </Button>
        <List>
          {filteredStudents.map((student) => (
            <ListItem key={student._id} divider>
              <ListItemText
                primary={student.name}
                secondary={student.telefono}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => navigate(`/student/${student._id}`)}
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleCopyLink(student._id)}
                  sx={{ ml: 1 }}
                >
                  <ContentCopyIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleShowQR(student._id)}
                  sx={{ ml: 1 }}
                >
                  <QrCodeIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleEditStudent(student)}
                  sx={{ ml: 1 }}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => handleDeleteStudent(student._id)}
                  sx={{ ml: 1 }}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Aggiungi Nuovo Studente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefono"
            type="tel"
            fullWidth
            value={newStudent.telefono}
            onChange={(e) => setNewStudent({ ...newStudent, telefono: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annulla</Button>
          <Button onClick={handleAddStudent} variant="contained">
            Aggiungi
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={qrOpen} onClose={handleCloseQR}>
        <DialogTitle>QR Code Tesserino</DialogTitle>
        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {qrValue && (
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrValue)}`} alt="QR Code" />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Modifica Studente</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome"
            fullWidth
            value={editStudent.name}
            onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefono"
            type="tel"
            fullWidth
            value={editStudent.telefono}
            onChange={(e) => setEditStudent({ ...editStudent, telefono: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Annulla</Button>
          <Button onClick={handleEditStudentSave} variant="contained">Salva</Button>
        </DialogActions>
      </Dialog>

      {/* Tabella dettagliata studenti */}
      <Box sx={{ mt: 4, overflowX: 'auto', borderRadius: 2, border: '1px solid #90caf9', background: '#fff' }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1976d2', mb: 1, fontSize: 18 }}>
          Tabella dettagliata studenti e lezioni
        </Typography>
        <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: '13px', minWidth: 600 }}>
          <thead>
            <tr style={{ background: '#e3f2fd' }}>
              <th style={{ border: '1px solid #90caf9', padding: '4px 6px' }}>Nome</th>
              <th style={{ border: '1px solid #90caf9', padding: '4px 6px' }}>Telefono</th>
              {Array.from({length: 10}).map((_,i) => (
                <th key={i} style={{ border: '1px solid #90caf9', padding: '2px 3px', width: 48, minWidth: 36, fontSize: '11px' }}>L{i+1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td style={{ border: '1px solid #90caf9', padding: '4px 6px', whiteSpace: 'nowrap' }}>{s.name}</td>
                <td style={{ border: '1px solid #90caf9', padding: '4px 6px', whiteSpace: 'nowrap' }}>{s.telefono}</td>
                {Array.from({length: 10}).map((_,i) => {
                  const lessons = getLessons(s);
                  const l = lessons[i];
                  return (
                    <td key={i} style={{ border: '1px solid #90caf9', padding: '2px 3px', color: l ? (l.isUsed ? '#d32f2f' : (l.date ? '#ff9800' : '#43a047')) : '#aaa', whiteSpace: 'nowrap', fontSize: '11px', width: 48, minWidth: 36 }}>
                      {l ? (l.isUsed ? 'Usata' : (l.date ? 'Annullata' : 'Disponibile')) : ''}
                      <br/>{l && l.date ? new Date(l.date).toLocaleDateString('it-IT') : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Container>
  );
}

export default StudentList; 
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Tooltip,
  IconButton,
  Snackbar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import ShareIcon from '@mui/icons-material/Share';

function StudentCard() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [showPwaHint, setShowPwaHint] = useState(() => {
    return localStorage.getItem('hidePwaHint') !== '1';
  });
  const [showUndoAlert, setShowUndoAlert] = useState(false);
  const [undoLessonIndex, setUndoLessonIndex] = useState(null);
  const [showLessonInfo, setShowLessonInfo] = useState(false);
  const [lessonInfo, setLessonInfo] = useState({});
  const [openTessDialog, setOpenTessDialog] = useState(false);

  useEffect(() => {
    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await axios.get(`https://tesserino-virtuale1.onrender.com/api/students/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setStudent(response.data);
    } catch (error) {
      console.error('Errore nel caricamento dello studente:', error);
    }
  };

  const handleUndoLesson = async (lessonIndex) => {
    try {
      await axios.patch(
        `https://tesserino-virtuale1.onrender.com/api/students/${id}/lessons/${lessonIndex}/undo`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      fetchStudent();
      setUndoLessonIndex(lessonIndex);
      setShowUndoAlert(true);
    } catch (error) {
      alert('Errore nell\'annullamento della lezione');
    }
  };

  const handleClosePwaHint = () => {
    setShowPwaHint(false);
    localStorage.setItem('hidePwaHint', '1');
  };

  const handleAvailableLessonClick = (lessonIndex, lesson) => {
    if (lesson.date) {
      setLessonInfo({
        number: lessonIndex + 1,
        date: new Date(lesson.date).toLocaleString('it-IT', {
          day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'
        })
      });
      setShowLessonInfo(true);
    }
  };

  const getLessons = (student) =>
    student && student.tesserini && Array.isArray(student.tesserini) && student.tesserini.length > 0 && Array.isArray(student.tesserini[student.tesserini.length - 1].lessons)
      ? student.tesserini[student.tesserini.length - 1].lessons
      : [];

  const CardSVG = () => (
    <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginBottom: 8}}>
      <rect x="2" y="2" width="56" height="36" rx="8" fill="#ff9800" stroke="#795548" strokeWidth="4"/>
      <circle cx="30" cy="20" r="10" fill="#fff8e1" stroke="#1976d2" strokeWidth="2"/>
      <text x="30" y="25" textAnchor="middle" fontFamily="Oswald, Impact, Arial" fontWeight="bold" fontSize="10" fill="#1976d2">WBBS</text>
    </svg>
  );
  const HandSVG = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: 6, verticalAlign: 'middle'}}>
      <path d="M8 24c0 2 2 4 4 4h8c2 0 4-2 4-4v-8c0-2-2-4-4-4h-2V6a2 2 0 0 0-4 0v6H12c-2 0-4 2-4 4v8z" fill="#ffb300" stroke="#795548" strokeWidth="2"/>
      <circle cx="16" cy="8" r="2" fill="#fff8e1" stroke="#1976d2" strokeWidth="1"/>
    </svg>
  );
  const MenuSVG = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{verticalAlign: 'middle', marginRight: 4}}>
      <rect y="4" width="24" height="3" rx="1.5" fill="#795548"/>
      <rect y="10.5" width="24" height="3" rx="1.5" fill="#795548"/>
      <rect y="17" width="24" height="3" rx="1.5" fill="#795548"/>
    </svg>
  );

  const handleNewTesserino = (numLessons) => async () => {
    try {
      await axios.post(`https://tesserino-virtuale1.onrender.com/api/students/${id}/tesserini`, { numLessons }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOpenTessDialog(false);
      fetchStudent();
    } catch (error) {
      alert('Errore nella creazione del tesserino');
    }
  };

  const yellowMod = '#ffeb3b';
  const nameBoxColor = '#43a047';

  if (!student) {
    return (
      <Container>
        <Typography>Caricamento...</Typography>
      </Container>
    );
  }

  if (!student || !student.tesserini || !Array.isArray(student.tesserini) || student.tesserini.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Dati studente non disponibili o nessun tesserino attivo.
        </Typography>
        <Button
          variant="contained"
          color="success"
          onClick={() => setOpenTessDialog(true)}
        >
          Crea nuovo tesserino
        </Button>
        <Dialog open={openTessDialog} onClose={() => setOpenTessDialog(false)}>
          <DialogTitle>Scegli il tipo di tesserino</DialogTitle>
          <DialogContent>
            <Button variant="contained" color="primary" onClick={handleNewTesserino(10)} sx={{ m: 1 }}>
              Tesserino 10 moduli
            </Button>
            <Button variant="contained" color="secondary" onClick={handleNewTesserino(5)} sx={{ m: 1 }}>
              Tesserino 5 moduli
            </Button>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenTessDialog(false)}>Annulla</Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      p: 0,
      m: 0,
      bgcolor: '#fff8e1',
    }}>
      <Box sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 400,
        minHeight: 500,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        mb: 2,
      }}>
        {/* Sfondo immagine e overlay */}
        <img
          src="/main.jpg"
          alt="Boxe BG"
          style={{
            width: '100%',
            height: 'auto',
            border: '4px solid #b71c1c',
            borderRadius: '8px',
            display: 'block',
          }}
        />
        {/* Badge lezioni: mostra solo il numero effettivo di moduli del tesserino attivo */}
        <Box sx={{
          position: 'absolute',
          left: 0,
          bottom: 70,
          width: '100%',
          zIndex: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5,
        }}>
          {getLessons(student).map((lesson, lessonIndex) => (
            <Box
              key={lessonIndex}
              sx={{
                width: 38,
                height: 52,
                borderRadius: 6,
                bgcolor: yellowMod,
                border: '2.5px solid #43a047',
                boxShadow: '0 2px 8px #1976d233',
                opacity: 0.92,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 18,
                color: '#1976d2',
                mb: 0,
                transition: 'all 0.2s',
                boxSizing: 'border-box',
                '&:hover': {
                  boxShadow: '0 0 8px #43a047',
                  transform: 'scale(1.08)',
                  background: 'linear-gradient(135deg, #fffde7 0%, #fff9c4 100%)',
                },
              }}
            >
              <Box sx={{ background: 'orange', borderRadius: 3, px: 0.7, py: 0.2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {lessonIndex + 1}
              </Box>
            </Box>
          ))}
        </Box>
        {/* Nome allievo SOTTO i moduli, con padding e sfondo verde */}
        <Box sx={{
          position: 'absolute',
          left: 0,
          bottom: 10,
          width: '100%',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Box sx={{
            bgcolor: nameBoxColor,
            borderRadius: 3,
            px: 3,
            py: 1.5,
            boxShadow: '0 2px 8px #43a04755',
            border: '2px solid #fffde7',
            minWidth: 120,
            textAlign: 'center',
          }}>
            <Typography
              align="center"
              sx={{
                fontFamily: "'Oswald', Impact, Arial, sans-serif",
                fontWeight: 900,
                letterSpacing: 2,
                color: '#fff',
                textShadow: '0 2px 8px #222b',
                m: 0,
                fontSize: 22,
                textTransform: 'uppercase',
                lineHeight: 1.1,
                px: 1.5,
                borderRadius: 3,
              }}
            >
              {student.name}
            </Typography>
          </Box>
        </Box>
      </Box>
      {/* Snackbar avviso annullamento modulo e info lezione annullata rimangono per UX admin, ma non c'è più storico lezioni */}
    </Container>
  );
}

export default StudentCard; 
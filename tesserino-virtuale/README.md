# Tesserino Virtuale

Un'applicazione web per gestire i tesserini delle lezioni degli studenti.

## Requisiti

- Node.js (v14 o superiore)
- MongoDB
- npm o yarn

## Installazione

1. Clona il repository
2. Installa le dipendenze del backend:
```bash
cd server
npm install
```

3. Installa le dipendenze del frontend:
```bash
cd ../client
npm install
```

## Configurazione

1. Crea un file `.env` nella cartella `server` con il seguente contenuto:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tesserino-virtuale
JWT_SECRET=il_tuo_segreto_molto_sicuro
```

## Avvio dell'applicazione

1. Avvia il server MongoDB
2. Avvia il backend:
```bash
cd server
npm run dev
```

3. In un nuovo terminale, avvia il frontend:
```bash
cd client
npm start
```

L'applicazione sarà disponibile all'indirizzo `http://localhost:3000`

## Funzionalità

- Login admin
- Gestione studenti (aggiunta, visualizzazione)
- Visualizzazione tesserini con 10 lezioni
- Annullamento lezioni con data e ora
- Interfaccia responsive e moderna

## Tecnologie utilizzate

- Frontend: React, Material-UI
- Backend: Node.js, Express
- Database: MongoDB
- Autenticazione: JWT 
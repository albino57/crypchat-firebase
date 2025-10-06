import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

//--- INÍCIO DAS ADIÇÕES ---
import { db } from './firebaseConfig' //Importa nossa conexão com o DB
import { connectFirestoreEmulator } from 'firebase/firestore' //Importa a função do emulador

//Conecta ao emulador local do Firestore que está rodando na porta 8080
connectFirestoreEmulator(db, '127.0.0.1', 8080);
//--- FIM DAS ADIÇÕES ---

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
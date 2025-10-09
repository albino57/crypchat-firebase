import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './pages/ThemeManager.jsx'


//--- INÍCIO DAS ADIÇÕES ---
import { db, app } from './firebaseConfig'; //Importa nossa conexão com o DB
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator } from 'firebase/firestore'; //Importa a função do emulador

//Conecta ao emulador local do Firestore que está rodando na porta 8080
if (import.meta.env.DEV) {
  //Conecta ao emulador do Firestore
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  
  //Conecta ao emulador de Autenticação
  const auth = getAuth(app);
  connectAuthEmulator(auth, "http://127.0.0.1:9099"); //A porta padrão é a 9099
}
//--- FIM DAS ADIÇÕES ---

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
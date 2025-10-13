//Importa as funções
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

//Objeto de configuração
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig); //Inicializar o Firebase
const auth = getAuth(app);
const db = getFirestore(app); //Inicializar o Firestore e exportá-lo para uso em outros arquivos

//Conecta aos emuladores SE estivermos em ambiente de desenvolvimento
if (import.meta.env.DEV) {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  console.log("Firebase conectado aos emuladores locais.");
}

export { app, auth, db }; //Código para poder usar o 'db' no resto do app
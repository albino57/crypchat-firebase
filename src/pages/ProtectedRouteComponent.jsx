// src/pages/ProtectedRoute.jsx
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth'; //Importa o hook
import { Navigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';


function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  //Enquanto o Firebase está verificando se existe um usuário logado, mostra uma tela de "Carregando
  if (loading) { 
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  //Se após a verificação existir um usuário
  if (user) {
    return children; //renderiza a página filha (no nosso caso, a ChatPage)
  }

  return <Navigate to="/" replace />;   //Caso contrário redirecionamos para a página de login
}

export default ProtectedRoute;
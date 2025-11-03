import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

const ChatPage = lazy(() => import('./pages/ChatPage')); //Importa a ChatPage em modo preguiçoso 

import ProtectedRouteComponent from './pages/ProtectedRouteComponent.jsx'; //Importa rota protegida

function App() {
  return (
    <Suspense fallback={<div className="h-screen flex justify-center items-center">Carregando...</div>}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route 
          path="/chat" 
          element={
            <ProtectedRouteComponent>
              <ChatPage />
            </ProtectedRouteComponent>
          } 
        />
      </Routes>
    </Suspense>
  );
}

export default App;
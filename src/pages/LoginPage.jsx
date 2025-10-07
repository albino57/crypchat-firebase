import React from 'react';
import { useNavigate } from 'react-router-dom';
import viteLogo from '/vite.svg';

//↓-------------- ↓LOGIN PAGE↓ --------------↓
function LoginPage() {
    const navigate = useNavigate();
    
    const handleLogin = (event) => {
    event.preventDefault(); // Impede que a página recarregue
    console.log("Navegando para a página de chat...");
    navigate('/chat'); // Navega para a rota "/chat"
  };

  return (
    
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-surface p-10 rounded-lg shadow-lg w-full max-w-sm text-center">   

        <img src="/logo.png" alt="CrypChat Logo" className="w-32 h-32 mx-auto mb-4" /> {/*Imagem do logo*/}

        <h1 className="text-primary text-4xl font-bold mb-2">CrypChat</h1>       
        <p className="text-text-secondary mb-8">Seu chat Anônimo🔒</p>

        <form onSubmit={handleLogin}>
          <div className="text-left mb-4">
            <input 
              type="text" 
              placeholder="Usuário"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="text-left mb-6">
            <input 
              type="password" 
              placeholder="Senha"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full p-3 bg-primary text-white font-bold rounded cursor-pointer hover:bg-primary-dark transition-colors"
          >
            Conectar
          </button>
        </form>
        
        <div className="mt-6">
          <a href="#" className="text-sm text-text-secondary hover:underline">
            Solicitar Acesso
          </a>
        </div>
      </div>
    </div>
  );
}
//↑-------------- ↑LOGIN PAGE↑ --------------↑

export default LoginPage;
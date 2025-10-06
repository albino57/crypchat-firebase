import React from 'react';
import { useNavigate } from 'react-router-dom';

//↓-------------- ↓LOGIN PAGE↓ --------------↓
function LoginPage() {
    const navigate = useNavigate();
    
    const handleLogin = (event) => { //Função
    event.preventDefault(); // Impede que a página recarregue
    console.log("Navegando para a página de chat...");
    navigate('/chat'); // 4. Navega para a rota "/chat"
  };

  return (
    
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-surface p-10 rounded-lg shadow-lg w-full max-w-sm text-center">      
        <h1 className="text-primary text-3xl font-bold mb-2">CrypChat</h1>       
        <p className="text-text-secondary mb-8">Faça login para continuar</p>

        <form onSubmit={handleLogin}>
          <div className="text-left mb-4">
            <label className="block mb-1 text-sm font-medium text-text-primary">Usuário</label>
            <input 
              type="text" 
              placeholder="Seu nome de usuário"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="text-left mb-6">
            <label className="block mb-1 text-sm font-medium text-text-primary">Senha</label>
            <input 
              type="password" 
              placeholder="Sua senha"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full p-3 bg-primary text-white font-bold rounded cursor-pointer hover:bg-primary-dark transition-colors"
          >
            Entrar
          </button>
        </form>
        
        <div className="mt-6">
          <a href="#" className="text-sm text-text-secondary hover:underline">
            Não tem uma conta? Registre-se
          </a>
        </div>
      </div>
    </div>
  );
}
//↑-------------- ↑LOGIN PAGE↑ --------------↑

export default LoginPage;
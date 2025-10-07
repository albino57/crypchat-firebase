import SunMoonIcon from '../SunMoonIcon';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeManager.jsx';

//↓-------------- ↓Ícones para os botões de tema (SVG)↓ --------------↓
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
    <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
  </svg>
);
//↑-------------- ↑Fim dos Ícones↑ --------------↑


//↓-------------- ↓LOGIN PAGE↓ --------------↓
function LoginPage() {
    const navigate = useNavigate();
    const { theme, cycleTheme } = useTheme();

    const handleLogin = (event) => {
    event.preventDefault(); // Impede que a página recarregue
    console.log("Navegando para a página de chat...");
    navigate('/chat'); // Navega para a rota "/chat"
    };

  return (
    
    <div className="flex justify-center items-center min-h-screen bg-background">

      <div className="relative bg-surface p-10 rounded-lg shadow-lg w-full max-w-sm text-center">

        {/*Div do tema*/}
        <div className="absolute top-4 right-4">
          <button onClick={cycleTheme} title="Mudar Tema" className="w-8 h-8 rounded-full flex items-center justify-center transition-colors">
            {/*Renderiza um ícone diferente dependendo do tema atual */}
            {theme === 'light' && <span className="text-yellow-400"><SunIcon /></span>}
            {theme === 'gray' && <SunMoonIcon />}
            {theme === 'dark' && <span className="text-gray-400"><MoonIcon /></span>}
          </button>
        </div>

        <div className="flex justify-center items-center gap-2 mb-2">
            <h1 className="text-primary text-4xl font-bold">CrypChat</h1>    
            <img src="/logo.png" alt="CrypChat Logo" className="w-14 h-14 mb-2" /> {/*Imagem do logo*/}
        </div>
        

        
        <p className="text-text-secondary mb-8">Seu chat Anônimo</p>

        <form onSubmit={handleLogin}>
          <div className="text-left mb-4 font-bold">
            <input 
              type="text" 
              placeholder="👤Usuário"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="text-left mb-6 font-bold">
            <input 
              type="password" 
              placeholder="🔑Senha"
              className="w-full p-2 border border-gray-300 rounded bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
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
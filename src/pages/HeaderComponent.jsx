import React from 'react';
import {SunIcon, SunMoonIcon, MoonIcon} from './SunMoonIcon.jsx';
import { useTheme } from './ThemeManager.jsx';

function HeaderComponent() {
  const { theme, cycleTheme } = useTheme();
  
  return (
    <header className="flex justify-between items-center h-full px-4 bg-surface border-b border-gray-200 dark:border-gray-700 gray:border-gray-600 transition-colors">

      {/*Lado Esquerdo: Título */}
      <div>
        <h1 className="text-xl font-bold text-primary">CrypChat</h1>
      </div>

      {/*Centro: Tema */}
      <div>
        <div>
          <button onClick={cycleTheme} title="Mudar Tema" className="w-8 h-8 rounded-full flex items-center justify-center transition-colors">
            {/*Renderiza um ícone diferente dependendo do tema atual */}
            {theme === 'light' && <SunIcon/>}
            {theme === 'gray' && <SunMoonIcon/>}
            {theme === 'dark' && <MoonIcon/>}
          </button>
        </div>
      </div>

      {/*Informações do Usuário e Logout (placeholders) */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-text-secondary font-bold">Usuário</span>
        <button className="bg-primary text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-primary-dark transition-colors">Sair</button>
      </div>

    </header>
  );
}

export default HeaderComponent;
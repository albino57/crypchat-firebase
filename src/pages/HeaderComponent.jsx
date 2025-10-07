import React, { useState, useEffect, useRef } from 'react';
import { SunIcon, SunMoonIcon, MoonIcon } from './SunMoonIcon.jsx';
import { useTheme } from './ThemeManager.jsx';

function HeaderComponent({ isCollapsed, onToggle }) {
  const { theme, cycleTheme } = useTheme();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => { //Adiciona um ouvinte de cliques na página inteira
    function handleClickOutside(event) { //Função que será chamada a cada clique
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { //Se o menu estiver aberto e o clique foi fora do menu, fecha o menu
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside); //Adiciona o ouvinte de cliques

    return () => { //Função remove o ouvinte quando o componente não for mais usado
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]); //O efeito depende da referência do dropdown


  return (
    <header className="flex justify-between items-center h-full px-4 bg-surface border-b border-gray-200 dark:border-gray-700 gray:border-gray-600 transition-colors">

      {/*-----Lado Esquerdo: Título-----*/}
      <div className="flex items-center gap-3">
        <button onClick={onToggle} title="Alternar Sidebar" className="flex items-center gap-1 p-1 rounded-md hover:bg-background transition-colors">
          <h1 className="text-xl font-bold text-primary">CrypChat</h1>
          <span className="text-lg">
            {isCollapsed ? "▶️" : "◀️"}
          </span>
        </button>

      </div>

      {/*-----Centro: Tema-----*/}
      <div>
        <div>
          <button onClick={cycleTheme} title="Mudar Tema" className="w-8 h-8 rounded-full flex items-center justify-center transition-colors">
            {/*Renderiza um ícone diferente dependendo do tema atual */}
            {theme === 'light' && <SunIcon />}
            {theme === 'gray' && <SunMoonIcon />}
            {theme === 'dark' && <MoonIcon />}
          </button>
        </div>
      </div>

      {/*-----Lado Direito: Usuário e DropDown-----*/}
      <div className="relative" ref={dropdownRef}> {/**ref={dropdownRef} precisa estar aqui para o React sabe que essa é a Div que deve ser monitorada*/}

        {/*Botão que abre/fecha o menu */}
        <button
          onClick={() => setDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 p-1 rounded-md hover:bg-background"
        >

          <span className="text-sm text-text-secondary font-bold">Usuário</span>
          {/*Ícone de seta para baixo*/}
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" /></svg>
        </button>

        {/*Se 'isDropdownOpen' for true */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-surface rounded-md shadow-lg border border-gray-200 dark:border-gray-700 gray:border-gray-600 z-10">
            {/*<hr className="border-gray-200 dark:border-gray-700 gray:border-gray-600" />*/}{/*AQUI SERÁ USADO DEPOIS PARA MAIS COISAS*/}
            <a href="#" className="block px-4 py-2 text-sm text-red-500 hover:bg-background">Sair</a>
          </div>
        )}

      </div>

    </header>
  );
}

export default HeaderComponent;
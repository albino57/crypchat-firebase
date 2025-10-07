/* eslint-disable react-refresh/only-export-components */
//src/pages/ThemeManager.js

import React, { createContext, useState, useContext, useEffect } from 'react';

//Criação do "MOLDE" (CONTEXT), define o formato do "cofre" de informações sobre o tema
const ThemeContext = createContext();

//Componente "PROVEDOR", ele guarda o tema atual e tem a função para trocá-lo
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // 'light', 'gray', ou 'dark'

  //Função que faz o ciclo dos temas
  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('gray');
    } else if (theme === 'gray') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  //Efeito que roda toda vez que a variável 'theme' muda
  useEffect(() => {
    const root = window.document.documentElement; //Pega o elemento <html> da página
    root.classList.remove('light', 'gray', 'dark'); //Limpa as classes de tema antigas para não haver conflito
    root.classList.add(theme); //Adiciona a classe do tema atual ao <html>, e é ela que vai ativar as cores certas no CSS
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

//"ATALHO" para usar o tema, uma função para que os componentes possam facilmente pegar o tema atual e trocá-lo.
export function useTheme() {
    return useContext(ThemeContext);
}
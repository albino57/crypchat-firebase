/* eslint-disable react-refresh/only-export-components */
//src/pages/ThemeManager.js

// src/pages/ThemeManager.js

import React, { createContext, useState, useContext, useEffect } from 'react';

// ========================================================================
// BLOCO 1: A CRIAÇÃO DO "MOLDE" (CONTEXT)
// Apenas define o formato do nosso "cofre" de informações sobre o tema.
// ========================================================================
const ThemeContext = createContext();

// ========================================================================
// BLOCO 2: O COMPONENTE "PROVEDOR"
// Este é o componente que vai "abraçar" todo o nosso app.
// Ele guarda o tema atual e tem a função para trocá-lo.
// ========================================================================
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // 'light', 'gray', ou 'dark'

  // Função que faz o ciclo dos temas
  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('gray');
    } else if (theme === 'gray') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  // Efeito que roda toda vez que a variável 'theme' muda
  useEffect(() => {
    const root = window.document.documentElement; // Pega o elemento <html> da página

    // Limpa as classes de tema antigas para não haver conflito
    root.classList.remove('light', 'gray', 'dark');

    // Adiciona a classe do tema atual ao <html>
    // É essa classe que vai ativar as cores certas no nosso CSS
    root.classList.add(theme);
  }, [theme]);


  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ========================================================================
// BLOCO 3: O "ATALHO" PARA USAR O TEMA
// Uma função simples para que nossos componentes possam facilmente
// pegar o tema atual e a função para trocá-lo.
// ========================================================================

export function useTheme() {
    return useContext(ThemeContext);
}
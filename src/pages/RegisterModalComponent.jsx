// src/pages/RegisterModalComponent.jsx

import React from 'react';

function RegisterModalComponent({ isOpen, onClose }) {
  // Se a prop 'isOpen' for false, o componente não renderiza nada.
  if (!isOpen) {
    return null;
  }

  return (
    // Fundo escurecido (overlay) que cobre a tela inteira
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-20">

      {/* O card do Modal */}
      <div className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-xs m-4">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Solicitar Acesso</h2>

        <form>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-text-primary text-left"></label>
            <input 
              type="text" 
              placeholder="👤Crie o Usuário"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800 text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium text-text-primary text-left"></label>
            <input 
              type="password" 
              placeholder="🔑Crie a Senha"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800 text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-4 mt-8">
            <button 
              type="button" 
              onClick={onClose} 
              className="py-2 px-4 rounded-md text-text-secondary hover:bg-black/10 dark:hover:bg-white/10"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="py-2 px-6 bg-primary text-white font-bold rounded-md hover:bg-primary-dark"
            >
              Solicitar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterModalComponent;
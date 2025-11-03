// src/pages/VersionModalComponent.jsx
import React from 'react';

export const APP_VERSION = "v0.7.1";
export const APP_LastVersion = " 21/10/25 | v0.7.1-Implementada Modal de Versões...";

//Exemplo: export const APP_LastVersion = " 21/10/25 | v0.7.1-Implementada Modal de Versões...";
//<li>Implementada a Sessão Única Ativa (Logout automático via FCM).</li>

function VersionModalComponent({ isOpen, onClose }) { //O componente precisa receber as props isOpen e onClose

  if (!isOpen) return null; //Se o modal não estiver aberto, não renderiza nada

  return (
    //CAMADA ESCURA DE FUNDO (BACKDROP)
    //Fixo na tela, com fundo semitransparente (bg-black/50)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}>

      {/*---↓ CORPO do MODAL ↓---*/}
      <div
        className="bg-surface p-6 rounded-lg shadow-2xl w-full max-w-md transform transition-all"

        //Evita que cliques no corpo fechem o modal
        onClick={(e) => e.stopPropagation()}
      >

        {/*CABEÇALHO*/}
        <div className="flex justify-between items-center border-b pb-3 mb-4 border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-primary">Histórico de Versões</h2>

          {/*BOTÃO FECHAR (X)*/}
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-red-500 transition-colors"
          >
            &times;
          </button>
        </div>

        {/* CONTEÚDO */}
        <div className="max-h-80 overflow-y-auto pr-2 text-text-primary">

          {/* VERSÃO ATUAL */}

          <div className="mb-4 p-3 bg-background rounded-md border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-text-primary">v0.7.1</h3>
            <p className="text-sm text-text-secondary italic">21 de Outubro de 2025</p>
            <ul className="list-disc list-inside mt-2 text-sm ml-2">
              <li>Implementada Modal de Versões.</li>
              <li>Corrigido o bug de notificações duplicadas.</li>
              <li>Melhorias na segurança pós-logout.</li>
            </ul>
          </div>

          <div className="mb-4 p-3 bg-background rounded-md border border-gray-300 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-text-primary">v0.7.0</h3>
            <p className="text-sm text-text-secondary italic">20 de Outubro de 2025</p>
            <ul className="list-disc list-inside mt-2 text-sm ml-2">
              <li>Implementada funcionalidade de Notificações Push.</li>
            </ul>
          </div>

        </div>

        {/*RODAPÉ DO MODAL*/}
        <div className="text-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700"> {/*border-t cria uma linha bonitinha para ajudar na visualização*/}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary-dark transition-colors"
          >
            Ok :D
          </button>
        </div>

      </div>
      {/*---↑ CORPO do MODAL ↑---*/}
    </div>
  );
}

export default VersionModalComponent;
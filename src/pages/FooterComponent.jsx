// src/pages/FooterComponent.jsx
import React, { useState } from 'react';
import VersionModalComponent from './VersionModalComponent.jsx';
import { APP_VERSION, APP_LastVersion} from './VersionModalComponent.jsx';

//const versao = 

function FooterComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false); //Cria um estado para controlar se o modal está aberto ou fechado

  return (
    <footer className="bg-surface h-full flex justify-center p-2 border-r border-t border-gray-200 dark:border-gray-700 gray:border-gray-600 transition-colors">

      <div className="flex flex-col">
        <p className="text-xs text-center select-none">
          Powered by Albino_57 - {APP_VERSION}
        </p>

        <p className="text-xs text-center select-none mt-2">
          {APP_LastVersion}
        </p>

        {/*---↓ DIV do MODAL ↓---*/}
        <div className="text-right mt-1">
          <a href="#"
            onClick={(e) => {
              e.preventDefault(); //Impede que a página "pule" para o topo
              setIsModalOpen(true); //Muda o estado para 'true', fazendo o modal aparecer
            }}
            className="text-sm text-red-500 hover:underline">
            →Versões
          </a>
        </div>
        <VersionModalComponent
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
        {/*---↑ DIV do MODAL ↑---*/}
      </div>
    </footer>
  );
}
export default FooterComponent;


import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

//Ícone de "avião de papel" para o botão de Enviar
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11zM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493z"/>
  </svg>
);

function MessageInputComponent() {
  return (
    // O container geral que ocupa todo o espaço do grid (100px de altura)
    // Usamos flex para centralizar a área de texto verticalmente
    <div className="bg-surface h-full p-2 flex items-end border-t border-gray-200 dark:border-gray-700 gray:border-gray-600 transition-colors">
      
      {/* Usamos 'relative' para poder posicionar o botão de envio 'dentro' da área de texto */}
      <div className="relative w-full">
        
        {/* 2. Substitua a tag <textarea> por <TextareaAutosize> */}
        <TextareaAutosize
          placeholder="Digite sua mensagem..."
          className="w-full p-3 pr-14 rounded-lg resize-none bg-background border border-gray-300 dark:border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          minRows={2} // Começa com a altura de 2 linhas
          maxRows={8} // Cresce até no máximo 6 linhas, depois ativa o scroll
        />

        {/*Botão de Enviar posicionado de forma absoluta*/}
        <button title="Enviar Mensagem" className="absolute bottom-7 right-6 text-primary hover:text-primary-dark transition-colors disabled:text-gray-400" disabled>
          <SendIcon />
        </button>

      </div>
    </div>
  );
}

export default MessageInputComponent;
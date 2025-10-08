import React from 'react';

function MessageAreaComponent() {
  return (
    
    <div className="bg-background h-full p-4 flex flex-col overflow-y-auto"> {/* "h-full" ocupa toda a altura disponível no grid | "p-4" um padding interno para as mensagens não colarem nas bordas | "flex flex-col" prepara o container para empilhar as mensagens verticalmente | "overflow-y-auto" -> se o conteúdo (mensagens) for maior que a altura, cria uma barra de rolagem APENAS nesta área. */}
      
      {/* Placeholder para quando não houver mensagens */}
      <div className="m-auto text-center text-text-secondary">
        <p className="font-medium">Selecione um contato</p>
        <p className="text-sm">para começar a conversar.</p>
      </div>

      {/* No futuro, as mensagens do chat serão renderizadas aqui */}

    </div>
  );
}

export default MessageAreaComponent;
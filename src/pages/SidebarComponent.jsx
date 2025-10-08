//src/pages/SidebarComponent
import React from 'react';

const ContactItem = ({ name, isSelected, isCollapsed }) => {
  
  return (
    // Container de cada contato
    <div 
      className={`flex items-center p-1 rounded-md cursor-pointer transition-colors 
                 ${isSelected ? 'bg-primary/20' : 'hover:bg-black/10 dark:hover:bg-white/10 gray:hover:bg-white/10'} 
                 ${isCollapsed ? 'justify-center' : ''}`}
    >

      {/*O Nome do Contato (só aparece se a sidebar NÃO estiver encolhida) */}
      {!isCollapsed && (
        <span className="ml-3 font-medium text-text-primary truncate">
          {name}
        </span>
      )}
    </div>
  );
};


function SidebarComponent({ isCollapsed }) {
  // Dados de exemplo. No futuro, isso virá do Firestore.
  const contacts = [
    { id: 1, name: 'Rafael', selected: false },
    { id: 2, name: 'Albino', selected: false },
    { id: 3, name: 'Administrador', selected: false },
  ];

  return (
    // O container principal da sidebar
    <div className="bg-surface h-full p-2 flex flex-col gap-1 border-r border-gray-200 dark:border-gray-700 gray:border-gray-600 transition-colors overflow-hidden">
      {contacts.map(contact => (
        <ContactItem 
          key={contact.id} 
          name={contact.name}
          isSelected={contact.selected}
          isCollapsed={isCollapsed}
        />
      ))}
    </div>
  );
}

export default SidebarComponent;
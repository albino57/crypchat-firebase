//src/pages/SidebarComponent
import React from 'react';
import { db, app } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

const auth = getAuth(app); //Inicializa o serviço de autenticação

const ContactItem = ({ contact, isSelected, isCollapsed, onSelect }) => {
    const avatarInitial = contact.name ? contact.name.charAt(0).toUpperCase() : '?';

    return (
        <div
            onClick={onSelect}
            className={`flex items-center p-2 rounded-md cursor-pointer transition-colors ${isSelected ? 'bg-primary/20' : 'hover:bg-black/10 dark:hover:bg-white/10 gray:hover:bg-white/10'}`}
        >
            {/*Avatar */}
            <div className="w-9 h-9 rounded-full bg-primary flex-shrink-0 flex items-center justify-center font-bold text-white">
                {avatarInitial}
            </div>
            {/*Nome do Contato (só aparece se a sidebar NÃO estiver encolhida)*/}
            {!isCollapsed && (
                <span className="ml-3 font-medium text-text-primary truncate">
                    {contact.name}
                </span>
            )}
        </div>
    );
};

function SidebarComponent({ isCollapsed, selectedContact, onSelectContact }) {
    const [currentUser] = useAuthState(auth); //Pega o usuário logado atualmente
    const [usersSnapshot, loading, error] = useCollection(collection(db, 'users')); //Busca a coleção de todos os usuários

    return (
        <div className="bg-surface h-full p-2 flex flex-col gap-2 border-r border-gray-200 dark:border-gray-700 gray:border-gray-600 transition-colors overflow-hidden">

            {!isCollapsed && (
                <div className="relative px-2">
                    <input
                        type="text"
                        placeholder="Adicionar Amigo..."
                        className="w-full p-2 pl-3 pr-10 rounded-md bg-background border border-gray-200 dark:border-gray-700 gray:border-gray-600 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button title="Adicionar Amigo"
                        className="absolute inset-y-0 right-2 flex items-center justify-center w-8 h-full text-text-secondary hover:text-primary transition-colors"
                    > <span className="text-xl font-bold">🔍</span>
                    </button>
                </div>
            )}

            <p className="p-2 text-xs font-bold text-text-secondary uppercase">
                Conversas
            </p>

            {/*Lógica da Lista de Contatos*/}
            <div className="flex-1 overflow-y-auto">
                {error && <strong>Erro: {JSON.stringify(error)}</strong>}
                {loading && <span className="p-2 ...">Carregando usuários...</span>}

                {usersSnapshot && usersSnapshot.docs
                    
                    .filter(doc => doc.id !== currentUser?.uid)//Filtra a lista para não mostrar o próprio usuário
                    //Mapeia e exibe os outros usuários
                    .map(doc => {
                        const user = { id: doc.id, ...doc.data() };
                        //Usamos o email como nome por enquanto
                        const contact = { id: user.id, name: user.nome || user.email };

                        return (
                            <ContactItem
                                key={contact.id}
                                contact={contact}
                                isSelected={selectedContact?.id === contact.id}
                                isCollapsed={isCollapsed}
                                onSelect={() => onSelectContact(contact)}
                            />
                        );
                    })}
            </div>

        </div>
    );
}

export default SidebarComponent;
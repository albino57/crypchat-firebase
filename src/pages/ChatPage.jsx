import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { app } from '../firebaseConfig';

import HeaderComponent from './HeaderComponent.jsx';
import SidebarComponent from './SidebarComponent.jsx';
import MessageInputComponent from './MessageInputComponent.jsx';
import MessageAreaComponent from './MessageAreaComponent.jsx';
import FooterComponent from './FooterComponent.jsx';

const auth = getAuth(app); //Inicializa o serviço de autenticação

function ChatPage() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); //Sibebar está visível
    const [selectedContact, setSelectedContact] = useState(null); //Salva o estado de seleção do usuário lá da Sibebar.

    const [currentUser] = useAuthState(auth); //Identifica e pega o usuário logado
    const [chatId, setChatId] = useState(null); //Estado para guardar o ID do chat

    //Pede permissão para notificações assim que a página de chat carrega
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }
    }, []); //O array vazio [] garante que este código só rode uma vez

    //Efeito que roda quando o contato selecionado muda
    useEffect(() => {
        if (currentUser && selectedContact) {
            //Lógica para criar um ID de chat único e consistente
            const uids = [currentUser.uid, selectedContact.id].sort();
            const combinedId = uids.join('_');
            setChatId(combinedId);
            //console.log("ID da sala de chat privada:", combinedId); //Para poder ver funcionando
        }
    }, [currentUser, selectedContact]); //Roda de novo se o usuário logado ou o contato mudar

    const toggleSidebar = () => { //Função para alternar o estado da SideBar
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    //Cria uma nova função para lidar com a seleção de contato
    const handleSelectContact = (contact) => {
        setSelectedContact(contact);

        //Verifica o tamanho da tela do navegador, 640px é o breakpoint 'sm'
        if (window.innerWidth < 640) {
            setIsSidebarCollapsed(true);//Se a tela for pequena (mobile), força o fechamento da sidebar
        }
    };

    return (
        //Chamada de todos os Components↓↓
        <div className="flex justify-center items-center h-dvh bg-background">
            <div className={`w-full h-full md:w-[768px] md:h-[80vh] md:rounded-lg md:shadow-lg grid grid-rows-[50px_1fr_auto]
                overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'grid-cols-[0px_1fr]' : 'grid-cols-[1fr_1fr] sm:grid-cols-[1fr_2fr]'}`}>{/*sm:grid-cols-[1fr_2fr] para telas maiores que 640px */}

                <div className="col-span-2">
                    <HeaderComponent isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
                </div>

                <div className="">
                    <SidebarComponent
                        isCollapsed={isSidebarCollapsed}
                        selectedContact={selectedContact}     //Seleciona o estado de seleção do usuário lá da Sibebar.
                        onSelectContact={handleSelectContact} //Aplica o estado de seleção do usuário lá da Sibebar.
                    />
                </div>

                <div className="bg-background overflow-hidden">
                    <MessageAreaComponent selectedContact={selectedContact} chatId={chatId} />
                </div>

                <div>
                    <FooterComponent />
                </div>

                <div className="bg-surface col-start-2">
                    <MessageInputComponent chatId={chatId} />
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
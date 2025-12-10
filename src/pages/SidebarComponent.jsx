// src/pages/SidebarComponent.jsx
import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions'; //chama Cloud Functions
import { db, app } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, limit } from 'firebase/firestore'; //para queries específicas
import { useCollection } from 'react-firebase-hooks/firestore';
import { useUserName } from '../hooks/useUserName';

//Inicializa os serviços
const auth = getAuth(app);
const functions = getFunctions(app);
const sendFriendRequest = httpsCallable(functions, 'sendFriendRequest'); //Cloud Function
const acceptFriendRequest = httpsCallable(functions, 'acceptFriendRequest');
const rejectFriendRequest = httpsCallable(functions, 'rejectFriendRequest');

// --- ÍCONES
const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M10.97 4.97a.75.75 0 0 1 1.07.022l3.22 3.22a.75.75 0 0 1-.022 1.07l-6 6a.75.75 0 0 1-1.07-.022l-3.22-3.22a.75.75 0 0 1 .022-1.07l6-6a.75.75 0 0 1 1.07-.022z" />
    </svg>
);
// --- ÍCONES

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

//-----↓ COMPONENTE QUE BUSCA O NOME E RENDERIZA ↓-----
const FriendContactItem = ({ friendContact, selectedContact, isCollapsed, onSelectContact }) => {
    //O friendContact.id é o UID do amigo
    const { userName, isLoading } = useUserName(friendContact.id);

    //Cria o objeto de contato que o ContactItem espera lá em baixo no código.
    const contactDisplay = {
        id: friendContact.id,
        name: isLoading ? 'Carregando...' : userName
    };

    return (
        <ContactItem
            key={contactDisplay.id}
            contact={contactDisplay}
            isSelected={selectedContact?.id === contactDisplay.id}
            isCollapsed={isCollapsed}
            //Quando selecionado, passa o objeto com o ID e o NOME.
            onSelect={() => onSelectContact(contactDisplay)}
        />
    );
};
//-----↑ COMPONENTE QUE BUSCA O NOME E RENDERIZA ↑-----


//-----↓ ITEM DE REQUERIMENTO DE PEDIDO ↓-----
const PendingRequestItem = ({ request, onAccept, onReject }) => {
    const { userName: senderName, isLoading } = useUserName(request.senderId);
    const avatarInitial = senderName ? senderName.charAt(0).toUpperCase() : '?';

    return (
        <div className="flex items-center justify-between p-2 rounded-md transition-colors bg-yellow-100 dark:bg-yellow-900 mb-1">
            <div className="flex items-center flex-grow">
                {/*Avatar*/}
                <div className="w-8 h-8 rounded-full bg-yellow-500 flex-shrink-0 flex items-center justify-center font-bold text-white text-sm">
                    {avatarInitial}
                </div>
                {/*Nome do Contato*/}
                <span className="ml-3 font-medium text-sm text-text-primary overflow-hidden break-words">
                    Convite de <span className="font-bold">{isLoading ? 'Carregando Nome⏳' : senderName}</span>
                </span>
            </div>
            {/* Botão de Negar */}
            <button
                title="Rejeitar"
                onClick={() => onReject(request.id)} //Chama a função com o ID do pedido
                className="p-1 rounded-full text-red-600 hover:bg-red-200 dark:text-red-400 dark:hover:bg-red-900 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" /></svg>
            </button>

            {/*Botão de Aceitar*/}
            <button
                onClick={() => onAccept(request)}
                className="bg-green-600 text-white text-xs font-bold py-1 px-2 rounded hover:bg-green-700 transition-colors"
            >
                Aceitar
            </button>
        </div>
    );
};
//-----↑ ITEM DE REQUERIMENTO DE PEDIDO ↑-----

//-----↓ COMPONENTE PRINCIPAL ↓-----
function SidebarComponent({ isCollapsed, selectedContact, onSelectContact }) {
    const [currentUser] = useAuthState(auth); //Pega o usuário logado atualmente
    const [searchEmail, setSearchEmail] = useState('');
    const [searchStatus, setSearchStatus] = useState({ message: '', type: '' });
    const [isSearching, setIsSearching] = useState(false);

    //-----↓ LÓGICA DO CONVITE ↓-----
    const handleSendRequest = async (e) => {
        e.preventDefault();
        if (!searchEmail.trim() || !currentUser) return;

        setIsSearching(true);
        setSearchStatus({ message: '', type: '' });

        try {
            const response = await sendFriendRequest({
                senderId: currentUser.uid,
                recipientEmail: searchEmail.trim()
            });

            setSearchStatus({
                message: response.data.message || "Pedido de amizade enviado!",
                type: 'success'
            });
            setSearchEmail('');

        } catch (error) {
            console.error("Erro ao enviar pedido de amizade:", error);
            const errorMessage = error.details?.message || "Ocorreu um erro ao enviar o pedido.";
            setSearchStatus({
                message: errorMessage,
                type: 'error'
            });
        } finally {
            setIsSearching(false);
        }
    };
    //-----↑ LÓGICA DO CONVITE ↑-----


    //-----↓ LÓGICA DE CONVITES RECEBIDOS ↓-----
    const receivedRequestsQuery = currentUser
        ? query(
            collection(db, 'friendRequests'),
            where('recipientId', '==', currentUser.uid), //O usuário atual é o destinatário
            where('status', '==', 'pending') //Apenas convites pendentes
        )
        : null;

    //Hook para ouvir os convites recebidos
    const [requestsSnapshot, loadingRequests] = useCollection(receivedRequestsQuery);

    //Mapeia os convites para facilitar o uso na UI
    const pendingRequests = requestsSnapshot?.docs.map(doc => ({
        id: doc.id,
        senderId: doc.data().senderId,
        //O nome do remetente precisará ser buscado via Cloud Function ou uma query futura
        senderName: doc.data().senderId,
    })) || [];
    //-----↑ LÓGICA DE CONVITES RECEBIDOS ↑-----


    //-----↓ LÓGICA AMIGOS PARA ACEITAR ↓-----
    const handleAcceptRequest = async (request) => {
        try {
            const requestId = request.id; //ID do documento friendRequest que será atualizado para "accepted"

            await acceptFriendRequest({ requestId }); //Chama a Cloud Function para aceitar
            console.log(`Convite de ${request.senderName} aceito com sucesso!`);

        } catch (error) {
            console.error("Erro ao aceitar convite:", error);
        }
    };
    //-----↑ LÓGICA AMIGOS PARA ACEITAR ↑-----


    //-----↓ LÓGICA AMIGOS PARA REJEITAR ↓-----
    const handleRejectRequest = async (requestId) => {
        setIsSearching(true);
        try {
            //Chama a Cloud Function para rejeitar e excluir o pedido
            await rejectFriendRequest({ requestId: requestId });

            //O Firestore hook fará o refresh automaticamente
            console.log(`Pedido ${requestId} rejeitado com sucesso.`);

        } catch (error) {
            console.error("Erro ao rejeitar pedido:", error);
            alert(`Falha ao rejeitar pedido: ${error.message}`);
        } finally {
            setIsSearching(false);
        }
    };
    //-----↑ LÓGICA AMIGOS PARA REJEITAR ↑-----


    //-----↓ LÓGICA BUSCA SOMENTE POR AMIGOS ACEITOS ↓-----
    const friendsQuery = currentUser //A lista de contatos agora OUVE a subcoleção 'friends' do usuário atual.
        ? query(collection(db, 'users', currentUser.uid, 'friends'))
        : null;

    //Hook para ouvir apenas os amigos
    const [friendsSnapshot, loadingFriends, errorFriends] = useCollection(friendsQuery);

    //Mapeia os documentos de amigos. O ID do documento é o UID do amigo.
    const friendsList = friendsSnapshot?.docs.map(doc => ({
        id: doc.id,
        name: doc.id,
    })) || [];
    //-----↑ LÓGICA BUSCA SOMENTE POR AMIGOS ACEITOS ↑-----



    return (
        <div className="bg-surface h-full p-2 flex flex-col gap-2 border-r border-gray-200 dark:border-gray-700 gray:border-gray-600 transition-colors overflow-hidden">

            {/*-----↓ LÓGICA BUSCA E PEDIDO DE AMIZADE ↓-----*/}
            <div className={`p-2 border-b ${isCollapsed ? 'hidden' : 'block'}`}>
                <form onSubmit={handleSendRequest} className="relative flex items-center">
                    {/* Input de Email */}
                    <input
                        type="email"
                        placeholder="Buscar usuário por email..."
                        value={searchEmail}
                        onChange={(e) => setSearchEmail(e.target.value)}
                        required
                        className="w-full p-2 pr-10 text-sm rounded-lg border bg-background text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                        disabled={isSearching}
                    />
                    {/* Botão de Enviar */}
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-2 flex items-center justify-center w-8 h-full text-text-secondary hover:text-primary transition-colors"
                        title="Enviar Pedido de Amizade"
                        disabled={isSearching || searchEmail.trim() === ''}
                    >
                        <SearchIcon />
                    </button>
                </form>

                {/* Status da Busca (Sucesso/Erro) */}
                {searchStatus.message && (
                    <div className={`mt-2 p-1 text-xs rounded-md flex items-center gap-1 ${searchStatus.type === 'success'
                        ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100'
                        : 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'
                        }`}>
                        {searchStatus.type === 'success' && <CheckIcon />}
                        {searchStatus.message}
                    </div>
                )}
            </div>
            {/*-----↑ LÓGICA BUSCA E PEDIDO DE AMIZADE ↑-----*/}

            {/*-----↓ LÓGICA CONVITES PENDENTES ↓-----*/}
            {loadingRequests && (
                <div className="mt-2 p-2 text-sm text-text-secondary text-center">
                    Carregando convites...
                </div>
            )}

            {!loadingRequests && pendingRequests.length > 0 && (
                <div className="mt-2 p-2 border-t border-b border-gray-300 dark:border-gray-700">
                    <p className="text-xs font-bold text-red-500 uppercase mb-1">
                        {pendingRequests.length} Convite(s) Pendente(s)
                    </p>
                    {pendingRequests.map(request => (
                        <PendingRequestItem
                            key={request.id}
                            request={request}
                            onAccept={handleAcceptRequest}
                            onReject={handleRejectRequest}
                        />
                    ))}
                </div>
            )}
            {/*-----↑ LÓGICA CONVITES PENDENTES ↑-----*/}

            {/*-----↓ LÓGICA NOVA LISTA DE CONTATOS (Apenas Amigos) ↓-----*/}
            <p className="p-2 text-xs font-bold text-text-secondary uppercase">
                Conversas (Amigos)
            </p>

            <div className="flex-1 overflow-y-auto">
                {errorFriends && <strong>Erro: {JSON.stringify(errorFriends)}</strong>}
                {(loadingFriends || !currentUser) && <span className="p-2 ...">Carregando amigos...</span>}

                {friendsList.length === 0 && !loadingFriends && (
                    <p className="p-2 text-sm text-text-secondary">Nenhum amigo aceito. Busque um email acima para começar.</p>
                )}

                {/* Mapeia a nova lista de amigos */}
                {friendsList.map(contact => (
                    <FriendContactItem
                        key={contact.id}
                        friendContact={contact}
                        selectedContact={selectedContact}
                        isCollapsed={isCollapsed}
                        onSelectContact={onSelectContact}
                    />
                ))}
            </div>
            {/*-----↑ LÓGICA NOVA LISTA DE CONTATOS (Apenas Amigos) ↑-----*/}
        </div>
    );
}

export default SidebarComponent;
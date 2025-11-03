import React, {useEffect, useRef} from 'react';
import { db, app } from '../firebaseConfig'; //Importa a conexão com o banco
import { useAuthState } from 'react-firebase-hooks/auth'; //Importa o hook de estado do Auth
import { collection, query, orderBy } from 'firebase/firestore'; //Ferramentas do Firestore
import { useCollection } from 'react-firebase-hooks/firestore'; //O hook para coleções
import { getAuth } from 'firebase/auth';

const auth = getAuth(app); //Inicializa o serviço de autenticação

//O componente Message agora recebe o objeto da mensagem inteira e o ID do usuário logado
const Message = ({ message, currentUser }) => {
    const isSentByMe = message.uid === currentUser?.uid; //Verificação: a mensagem foi enviada por mim?

    return (
        //Alinha as mensagens na UI
        <div className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`p-2 px-4 rounded-2xl max-w-xs
                    ${isSentByMe
                        ? 'bg-primary text-white'
                        : 'bg-surface text-text-primary'}`
                }
            >
                {message.text}
            </div>
        </div>
    );
};

function MessageAreaComponent({ selectedContact, chatId }) {
    const [currentUser] = useAuthState(auth); //Pega o usuário logado aqui

    const [messagesSnapshot, loading, error] = useCollection(chatId ? query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt')) : null); //Só busca as mensagens se um 'chatId' existir

    const messagesEndRef = useRef(null); //Cria uma referência (uma "âncora")

    //Cria uma função para rolar para o final
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    //Usa o useEffect para chamar a função sempre que as mensagens mudarem
    useEffect(() => {
        scrollToBottom();
    }, [messagesSnapshot, currentUser, selectedContact]); //Roda sempre que as mensagens mudarem

    return (
        <div className="bg-background h-full p-4 flex flex-col overflow-hidden"> {/* "h-full" ocupa toda a altura disponível no grid | "p-4" um padding interno para as mensagens não colarem nas bordas | "flex flex-col" prepara o container para empilhar as mensagens verticalmente*/}

            {/*Lógica de Renderização Condicional*/}
            {selectedContact ? (
                //SE um contato ESTIVER selecionado, mostra a área de chat e um Mini-Header" é mostrado
                <>
                    <div className="text-center text-sm text-text-secondary pb-4 border-b border-gray-200 dark:border-gray-700 gray:border-gray-600">
                        Conversando com <span className="font-bold">{selectedContact.name}</span>
                    </div>

                    {/*A LISTA DE MENSAGENS*/}
                    <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                        {error && <strong>Erro: {JSON.stringify(error)}</strong>}
                        {loading && <span>Carregando mensagens...</span>}

                        {/*Passa o objeto da mensagem completo e o currentUser para o componente Message */}
                        {messagesSnapshot && messagesSnapshot.docs.map(doc => (
                            <Message key={doc.id} message={doc.data()} currentUser={currentUser} />
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </>
            ) : (
                //SE NENHUM contato estiver selecionado, mostra o placeholder
                <div className="m-auto text-center text-text-secondary">
                    <p className="font-medium">Selecione um contato</p>
                    <p className="text-sm">para começar a conversar.</p>
                </div>
            )}

            {/*No futuro, as mensagens do chat serão renderizadas aqui */}

        </div>
    );
}

export default MessageAreaComponent;
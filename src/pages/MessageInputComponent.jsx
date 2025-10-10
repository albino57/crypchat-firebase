import React, { useState, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import { db, app } from '../firebaseConfig'; //Importa as configs
import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; //Ferramentas para escrever no Firestore

const auth = getAuth(app); //Inicializa o serviço de autenticação

//Ícone de "avião de papel" para o botão de Enviar
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11zM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493z" />
    </svg>
);

function MessageInputComponent({ chatId }) {

    const [text, setText] = useState(''); //Estado para guardar o texto da mensagem
    const [currentUser] = useAuthState(auth); //Pega o usuário atualmente logado
    const textareaRef = useRef(null); //Cria uma referência

    //Função para enviar a mensagem
    const handleSendMessage = async (event) => {
        event.preventDefault(); //Impede que o formulário recarregue a página
        if (text.trim() === '' || !currentUser || !chatId) return; //Não envia mensagens vazias e nem sem selecionar um usuário :D

        const messagesRef = collection(db, 'chats', chatId, 'messages'); //Função do Firestore que cria uma referência para a collection

        try {
            //Adiciona um novo documento à coleção 'messages'
            await addDoc(messagesRef, {
                text: text,
                createdAt: serverTimestamp(), //Pega a forma do Firebase de garantir que a hora da mensagem seja precisa
                uid: currentUser.uid,       //O ID do usuário que enviou
            });

            setText(''); //Limpa a caixa de texto após o envio
            textareaRef.current.focus(); //Devolve o foco para a textarea!

        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
        }
    };

    return (
        //flex centraliza a área de texto verticalmente
        <div className="bg-surface h-full p-2 flex items-end border-t border-gray-200 dark:border-gray-700 gray:border-gray-600 transition-colors">
            <div className={`relative w-full ${!chatId ? 'opacity-50 cursor-not-allowed' : ''}`}> {/*div para controlar o estado visual (habilitado/desabilitado)*/}
                <form onSubmit={handleSendMessage} className="relative w-full"> {/*'relative' para poder posicionar o botão de envio 'dentro' da área de texto */}
                    <TextareaAutosize
                        ref={textareaRef} //Chama a referência na textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={chatId ? "Digite sua mensagem..." : "Selecione uma conversa para começar"}
                        className="w-full p-3 pr-14 rounded-lg resize-none bg-background border border-gray-300 dark:border-gray-700 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                        disabled={!chatId}
                        minRows={2} //Começa com a altura de 2 linhas
                        maxRows={7} //Cresce até no máximo 7 linhas, depois ativa o scroll.
                    />

                    {/*Botão de Enviar posicionado de forma absoluta*/}
                    <button title="Enviar Mensagem" className="absolute bottom-7 right-6 text-primary hover:text-primary-dark transition-colors disabled:text-gray-400"
                        disabled={text.trim() === '' || !chatId}> {/*disabled é para desativar se tiver mensagem no campo*/}
                        <SendIcon />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default MessageInputComponent;
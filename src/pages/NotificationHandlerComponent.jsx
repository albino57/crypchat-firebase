// src/pages/NotificationHandlerComponent.jsx
import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, app } from "../firebaseConfig";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions(app);
const saveDeviceToken = httpsCallable(functions, 'saveDeviceToken');

const NotificationHandler = ({ currentUser }) => {
    const [showNotificationBanner, setShowNotificationBanner] = useState(false);

    //Função isolada para pegar o token e salvar (reutilizável)
    const retrieveToken = async () => {
        try {
            const currentToken = await getToken(messaging, {
                vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
            });
            
            if (currentToken) {
                console.log("Token recuperado:", currentToken);
                await saveDeviceToken({ token: currentToken, userId: currentUser.uid });
                console.log("Token salvo no backend!");
            } else {
                console.log("Nenhum token de registro disponível.");
            }
        } catch (err) {
            console.log("Erro ao recuperar token:", err);
        }
    };

    //Função disparada pelo CLIQUE do usuário (Obrigatório para iOS)
    const handleManualActivation = async () => {
        try {
            const permission = await Notification.requestPermission();
            
            if (permission === "granted") {
                setShowNotificationBanner(false); //Esconde o banner
                await retrieveToken(); //Pega o token agora que temos permissão
                
                //Teste visual imediato
                new Notification("Notificações Ativadas", {
                    body: "Agora você receberá alertas do chat!",
                    icon: '/logo.png'
                });
            } else {
                alert("Você precisa permitir as notificações para saber quando receber mensagens.");
            }
        } catch (error) {
            console.error("Erro ao pedir permissão manual:", error);
        }
    };

    useEffect(() => {
        // 1.Verifica o status atual da permissão ao carregar
        if (Notification.permission === "granted") {
            //Se já permitiu antes, pega o token silenciosamente
            retrieveToken();
        } else if (Notification.permission === "default") {
            //Se ainda não permitiu, MOSTRA O BOTÃO (Necessário para iOS)
            setShowNotificationBanner(true);
        }

        //2.Configura o ouvinte de mensagens (Foreground)
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Mensagem recebida em primeiro plano:", payload);
            
            // Adaptação para ler de 'data' se 'notification' vier vazio [faz referência no arquivo index.ts em functions/src]
            const notificationTitle = payload.notification?.title || payload.data?.title || "Nova Mensagem";
            const notificationBody = payload.notification?.body || payload.data?.body || "Verifique o seu chat.";

            new Notification(notificationTitle, {
                body: notificationBody,
                icon: '/logo.png'
            });
        });

        return () => {
            unsubscribe();
        };
    }, []); //Array vazio = roda apenas na montagem do componente

    //Se não precisar mostrar o banner, não renderiza nada
    if (!showNotificationBanner) return null;

    //Renderiza o Banner de Permissão (Estilo Tailwind)
    return (
        <div className="fixed top-0 left-0 w-full z-50 bg-indigo-600 text-white p-4 shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 transition-all duration-300">
            <div className="text-sm font-medium text-center sm:text-left">
                <p>📣 Ative as notificações para não perder nenhuma mensagem do chat!</p>
            </div>
            <button
                onClick={handleManualActivation}
                className="bg-white text-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-sm text-sm whitespace-nowrap"
            >
                Ativar Notificações
            </button>
        </div>
    );
};

export default NotificationHandler;
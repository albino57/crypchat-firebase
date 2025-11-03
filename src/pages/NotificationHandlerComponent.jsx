// src/pages/NotificationHandlerComponent.jsx
import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging, app } from "../firebaseConfig";
import { getFunctions, httpsCallable } from "firebase/functions";

const functions = getFunctions(app);
const saveDeviceToken = httpsCallable(functions, 'saveDeviceToken');


const NotificationHandler = ({ currentUser }) => {
    useEffect(() => {
        const requestForToken = async () => {
            try {
                const permission = await Notification.requestPermission();

                if (permission === "granted") {
                    const currentToken = await getToken(messaging, {
                        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
                    });
                    console.log("Token do dispositivo atual:", currentToken);

                    //Chama a Cloud Function para salvar o token
                    await saveDeviceToken({ token: currentToken, userId: currentUser.uid });
                    console.log("Token do dispositivo salvo no backend!");
                } else {
                    console.log("Não foi possível obter permissão para notificar.");
                }
            } catch (err) {
                console.log("Ocorreu um erro ao recuperar o token. ", err);
            }
        };

        requestForToken();

        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Mensagem recebida. ", payload);
            // Lógica para exibir a notificação no app

            // 1. EXTRAIA DADOS DA MENSAGEM
            const notificationTitle = payload.notification?.title || "Nova Mensagem";
            const notificationBody = payload.notification?.body || "Verifique o seu chat.";

            // 2. EXIBA UMA NOTIFICAÇÃO DE SISTEMA MANUALMENTE
            // IMPORTANTE: Isso só deve ser feito se a janela não estiver em foco
            // (Mas para o teste, vamos forçar a exibição)
            new Notification(notificationTitle, {
                body: notificationBody,
                icon: '/logo.png'
            });
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return null;
};

export default NotificationHandler;
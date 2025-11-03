//functions/src/index.ts
import { onCall, HttpsError } from "firebase-functions/v2/https"; //Adiciona 'HttpsError' para enviar erros formatados para o frontend
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

// ---↓ CONEXÃO MANUAL PARA EMULADORES ↓---
if (process.env.FUNCTIONS_EMULATOR === "true") {
    logger.info("MODO EMULADOR DETECTADO - Forçando conexão local para todos os serviços.");
    process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
    process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
    process.env.GCLOUD_PROJECT = "crypchat-fb23e"; //ID do projeto
    const serviceAccount = require("../../secrets/crypchat-fb23e-firebase-adminsdk-fbsvc-d06c845994.json"); //Importe a chave de serviço localmente para o emulador
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    //Inicialização padrão para produção
    admin.initializeApp();
}
// ---↑ CONEXÃO MANUAL PARA EMULADORES ↑---

//-----↓ CLOUD FUNCTION PARA NOTIFICAÇÃO ↓-----
export const saveDeviceToken = onCall({ maxInstances: 5 }, async (request) => {
    const { token, userId } = request.data;
    if (!token || !userId) {
        throw new HttpsError('invalid-argument', 'Token e userId são obrigatórios.');
    }

    try {
        // Salva o token no Firestore, associado ao usuário
        await admin.firestore().collection('users').doc(userId).update({
            deviceToken: token // Adiciona o campo `deviceToken` ao documento do usuário
        });
        logger.info(`Token para o usuário ${userId} salvo com sucesso.`);
        return { status: "success" };
    } catch (error: any) {
        logger.error("Erro ao salvar o token:", error);
        throw new HttpsError('internal', 'Erro ao salvar o token do dispositivo.');
    }
});
//-----↑ CLOUD FUNCTION PARA NOTIFICAÇÃO ↑-----

//-----↓ CLOUD FUNCTION PARA REMOVER TOKEN ↓-----
export const deleteDeviceToken = onCall({ maxInstances: 5 }, async (request) => {
    const { userId } = request.data; //O userId para saber de quem remover
    if (!userId) {
        throw new HttpsError('invalid-argument', 'O userId é obrigatório.');
    }

    try {
        //Remove o campo 'deviceToken' do documento do usuário
        await admin.firestore().collection('users').doc(userId).update({
            deviceToken: admin.firestore.FieldValue.delete() //Comando do Firestore para REMOVER o campo
        });
        logger.info(`Token do usuário ${userId} removido após logout.`);
        return { status: "success" };
    } catch (error: any) {
        logger.error("Erro ao remover o token:", error);
        throw new HttpsError('internal', 'Erro ao remover o token do dispositivo no logout.');
    }
});
//-----↑ CLOUD FUNCTION PARA REMOVER TOKEN ↑-----

import { onDocumentCreated } from "firebase-functions/v2/firestore";
logger.info("--- Antes do export const sendNotificationOnMessage ---");
export const sendNotificationOnMessage = onDocumentCreated(
    "chats/{chatId}/messages/{messageId}", //O caminho da coleção de mensagens
    async (event) => {
        logger.info("--- Função sendNotificationOnMessage Acionada! ---");
        const snapshot = event.data;
        if (!snapshot) {
            logger.info("Nenhum dado no snapshot.");
            return;
        }

        const messageData = snapshot.data();
        const recipientId = messageData.recipientId; //Supondo que seja salvo o ID do destinatário na mensagem
        const senderName = messageData.senderName;

        // 1. Obter o token do destinatário
        const userDoc = await admin.firestore().collection('users').doc(recipientId).get();
        const recipientToken = userDoc.data()?.deviceToken;

        logger.info(`Mensagem de ${senderName} para ID: ${recipientId}`);

        if (!recipientToken) {
            logger.info(`Nenhum token encontrado para o usuário ${recipientId}.`);
            return;
        }

        // 2. Criar a mensagem de notificação
        const message = {
            notification: {
                title: `Nova Mensagem de ${senderName}`,
                body: messageData.text,
            },
            token: recipientToken,
        };

        // 3. Enviar a notificação via FCM
        try {
            const response = await admin.messaging().send(message);
            logger.info("Notificação enviada com sucesso:", response);
        } catch (error) {
            logger.error("Erro ao enviar notificação:", error);
        }
    }
);

//-----↓ CLOUD FUNCTION ↓-----
export const createUserAccount = onCall({ maxInstances: 10 }, async (request) => {//Marca a função como 'async'

    logger.info("Iniciando processo de criação de conta para:", request.data.email);

    const nome = request.data.nome;
    const email = request.data.email;
    const password = request.data.password;

    if (!password || password.length < 6) { //Validação básica dos dados recebidos
        throw new HttpsError('invalid-argument', 'A senha precisa ter pelo menos 6 caracteres.');
    }
    if (!email) {
        throw new HttpsError('invalid-argument', 'O campo de email é obrigatório.');
    }

    try {
        //É aqui que o Firebase faz a senha "hash"
        const userRecord = await admin.auth().createUser({ //Usa o Admin SDK para criar o usuário no Firebase Authentication
            displayName: nome,
            email: email,
            password: password,
        });

        logger.info("Usuário criado com sucesso no Auth:", userRecord.uid);


        //Salva as informações do usuário também no Firestore
        await admin.firestore().collection("users").doc(userRecord.uid).set({
            nome: nome,
            email: userRecord.email,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info(`Documento do usuário ${userRecord.uid} salvo no Firestore.`);


        return { //Retorna uma resposta de sucesso para o frontend
            status: "success",
            message: `Usuário ${userRecord.email} criado com sucesso.`,
            uid: userRecord.uid,
        };

    } catch (error: any) { //'any' para evitar erros de tipo do TypeScript no 'error.code'
        logger.error("Erro ao criar usuário:", error);

        //Envia um erro específico de volta para o frontend se o email já existir
        if (error.code === 'auth/email-already-exists') {
            throw new HttpsError('already-exists', 'Este email já está em uso por outra conta.');
        }

        // Para qualquer outro erro inesperado
        throw new HttpsError('internal', 'Ocorreu um erro inesperado ao criar o usuário.');
    }
});
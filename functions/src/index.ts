// functions/src/index.ts
import { onCall, HttpsError } from "firebase-functions/v2/https"; //Adiciona 'HttpsError' para enviar erros formatados para o frontend
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

// -----↓ CONEXÃO MANUAL PARA EMULADORES ↓-----
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
// -----↑ CONEXÃO MANUAL PARA EMULADORES ↑-----

//-------------------------------------------------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------------------------------------------

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

//-------------------------------------------------------------------------------------------------------------------------------

//-----↓ CLOUD FUNCTION PARA NOTIFICAÇÃO VIA FCM ↓-----
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

        //1.Obtem o token do destinatário
        const userDoc = await admin.firestore().collection('users').doc(recipientId).get();
        const recipientToken = userDoc.data()?.deviceToken;

        logger.info(`Mensagem de ${senderName} para ID: ${recipientId}`);

        if (!recipientToken) {
            logger.info(`Nenhum token encontrado para o usuário ${recipientId}.`);
            return;
        }

        //2.Cria a mensagem de notificação (Modificado para data-only [faz referência no arquivo firebase-messaging-sw.js])
        const message = {
            //OBRIGATÓRIO para iOS acordar.
            notification: {
                title: `Nova Mensagem de ${senderName}`,
                body: messageData.text,
            },
            //OBRIGATÓRIO para evitar duplicidade.
            webpush: {
                notification: {
                    tag: 'chat-message', //MESMA tag do seu Service Worker
                    renotify: true,
                    icon: '/logo.png'
                }
            },
            // Dados extras para seu front usar se precisar
            data: {
                title: `Nova Mensagem de ${senderName}`,
                body: messageData.text,
                type: 'chat_msg'
            },
            token: recipientToken,
        };

        //3.Envia a notificação via FCM
        try {
            const response = await admin.messaging().send(message);
            logger.info("Notificação enviada com sucesso:", response);
        } catch (error) {
            logger.error("Erro ao enviar notificação:", error);
        }
    }
);
//-----↑ CLOUD FUNCTION PARA NOTIFICAÇÃO VIA FCM ↑-----

//-------------------------------------------------------------------------------------------------------------------------------

//-----↓ CLOUD FUNCTION PARA CRIAR USUÁRIO ↓-----
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
//-----↑ CLOUD FUNCTION PARA CRIAR USUÁRIO ↑-----

//-------------------------------------------------------------------------------------------------------------------------------

// -----↓ CLOUD FUNCTION PARA ENVIAR CONVITE ↓-----
export const sendFriendRequest = onCall({ maxInstances: 5 }, async (request) => {
    const { senderId, recipientEmail } = request.data;

    if (!senderId || !recipientEmail) {
        throw new HttpsError('invalid-argument', 'Sender ID e Email do destinatário são obrigatórios.');
    }

    try {
        // 1. Encontrar o UID do destinatário pelo email
        const userRecords = await admin.auth().getUserByEmail(recipientEmail);
        const recipientId = userRecords.uid;

        if (senderId === recipientId) {
            throw new HttpsError('invalid-argument', 'Você não pode adicionar a si mesmo.');
        }

        // 2. Verificar se o pedido já existe (para evitar duplicidade)
        const existingRequest = await admin.firestore().collection('friendRequests')
            .where('senderId', 'in', [senderId, recipientId]) // Verifica A->B ou B->A
            .where('recipientId', 'in', [senderId, recipientId])
            .limit(1).get();

        if (!existingRequest.empty && existingRequest.docs[0].data().status === 'pending') {
            throw new HttpsError('already-exists', 'Um pedido de amizade já está pendente entre vocês.');
        }

        // 3. Criar o novo documento de pedido
        await admin.firestore().collection('friendRequests').add({
            senderId: senderId,
            recipientId: recipientId,
            status: 'pending',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        logger.info(`Pedido enviado: ${senderId} -> ${recipientId}`);
        return { status: "success", message: "Pedido de amizade enviado com sucesso." };

    } catch (error: any) {
        logger.error("Erro ao enviar pedido:", error);
        if (error.code === 'auth/user-not-found') {
            throw new HttpsError('not-found', 'Usuário com este email não encontrado.');
        }
        throw new HttpsError('internal', 'Erro interno ao processar o pedido.');
    }
});
// -----↑ CLOUD FUNCTION PARA ENVIAR CONVITE ↑-----

//-------------------------------------------------------------------------------------------------------------------------------

// -----↓ CLOUD FUNCTION PARA BUSCAR NOME POR UID ↓-----
export const fetchUserName = onCall({ maxInstances: 5 }, async (request) => {
    const { userId } = request.data;

    if (!userId) {
        throw new HttpsError('invalid-argument', 'O userId é obrigatório.');
    }

    try {
        //Busca o documento do usuário na coleção 'users'
        const userDoc = await admin.firestore().collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return { name: "Usuário Desconhecido" };
        }

        const userData = userDoc.data();

        //Retorna o nome, garantindo que o campo exista no documento
        return { name: userData?.nome || 'Usuário Sem Nome' };

    } catch (error: any) {
        logger.error(`Erro ao buscar nome para UID ${userId}:`, error);
        throw new HttpsError('internal', 'Erro ao buscar nome do usuário.');
    }
});
// -----↑ CLOUD FUNCTION PARA BUSCAR NOME POR UID ↑-----

//-------------------------------------------------------------------------------------------------------------------------------

// -----↓ CLOUD FUNCTION PARA ACEITAR CONVITE ↓-----
export const acceptFriendRequest = onCall({ maxInstances: 5 }, async (request) => {
    //0. VERIFICAÇÃO DE AUTENTICAÇÃO
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'A função deve ser chamada por um usuário autenticado.');
    }
    const callerId = request.auth.uid; // ID de quem está chamando a função (o usuário logado)

    const { requestId } = request.data;

    if (!requestId) {
        throw new HttpsError('invalid-argument', 'O ID do pedido (requestId) é obrigatório.');
    }

    const db = admin.firestore();
    let senderId: string;
    let recipientId: string;

    try {
        await db.runTransaction(async (transaction) => {
            const requestRef = db.collection('friendRequests').doc(requestId);
            const requestDoc = await transaction.get(requestRef);

            //Validação de existência e estado
            if (!requestDoc.exists || requestDoc.data()?.status !== 'pending') {
                throw new HttpsError('failed-precondition', 'Pedido não encontrado ou já foi processado.');
            }

            senderId = requestDoc.data()?.senderId;
            recipientId = requestDoc.data()?.recipientId;

            if (!senderId || !recipientId) {
                throw new HttpsError('internal', 'Dados de remetente/destinatário incompletos.');
            }

            //1. VERIFICAÇÃO DE SEGURANÇA CRÍTICA: Quem está aceitando é o destinatário?
            if (callerId !== recipientId) {
                throw new HttpsError('permission-denied', 'Você não tem permissão para aceitar este pedido.');
            }

            //2. Atualiza o status do pedido para 'accepted'
            transaction.update(requestRef, {
                status: 'accepted',
                acceptedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            //3. Cria a relação de amizade para o REMETENTE (/users/A/friends/B)
            const senderFriendsRef = db.collection('users').doc(senderId).collection('friends').doc(recipientId);
            transaction.set(senderFriendsRef, { addedAt: admin.firestore.FieldValue.serverTimestamp() });

            //4. Cria a relação de amizade para o DESTINATÁRIO (/users/B/friends/A)
            const recipientFriendsRef = db.collection('users').doc(recipientId).collection('friends').doc(senderId);
            transaction.set(recipientFriendsRef, { addedAt: admin.firestore.FieldValue.serverTimestamp() });
        });

        //logger.info(`Amizade aceita entre: ${senderId} e ${recipientId}`);
        return { status: "success", message: "Amizade aceita com sucesso." };

    } catch (error: any) {
        logger.error("Erro ao aceitar pedido:", error);
        // Garante que erros HttpsError sejam repassados corretamente
        if (error.code) {
            throw error;
        }
        throw new HttpsError('internal', 'Erro ao aceitar pedido de amizade.');
    }
});
// -----↑ CLOUD FUNCTION PARA ACEITAR CONVITE ↑-----

//-------------------------------------------------------------------------------------------------------------------------------

// -----↓ CLOUD FUNCTION PARA REJEITAR CONVITE ↓-----
export const rejectFriendRequest = onCall({ maxInstances: 5 }, async (request) => {

    if (!request.auth) {//VERIFICAÇÃO DE SEGURANÇA
        throw new HttpsError('unauthenticated', 'A função deve ser chamada por um usuário autenticado.');
    }

    //Certifica que o usuário está autenticado
    const recipientId = request.auth.uid;
    if (!recipientId) {
        throw new HttpsError('unauthenticated', 'O usuário deve estar logado.');
    }

    const { requestId } = request.data; //O ID do documento do pedido na coleção friendRequests

    if (!requestId) {
        throw new HttpsError('invalid-argument', 'O requestId é obrigatório.');
    }

    const db = admin.firestore();

    try {
        await db.runTransaction(async (transaction) => {
            const requestRef = db.collection('friendRequests').doc(requestId);
            const requestDoc = await transaction.get(requestRef);

            if (!requestDoc.exists) {
                //Se o pedido não existir, consideramos que a operação está completa
                logger.warn(`Tentativa de rejeitar pedido inexistente: ${requestId}`);
                return;
            }

            //Validação extra para garantir que só o destinatário pode deletar
            if (requestDoc.data()?.recipientId !== recipientId) {
                throw new HttpsError('permission-denied', 'Você não tem permissão para rejeitar este pedido.');
            }

            //Deleta o pedido de amizade
            transaction.delete(requestRef);
        });

        logger.info(`Pedido de amizade ${requestId} rejeitado e excluído.`);
        return { status: "success", message: "Pedido de amizade rejeitado com sucesso." };

    } catch (error: any) {
        logger.error("Erro ao rejeitar pedido:", error);
        throw new HttpsError('internal', 'Erro ao rejeitar pedido de amizade.');
    }
});
// -----↑ CLOUD FUNCTION PARA REJEITAR CONVITE ↑-----
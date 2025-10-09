//functions/src/index.ts
import { onCall, HttpsError } from "firebase-functions/v2/https"; //Adiciona 'HttpsError' para enviar erros formatados para o frontend
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();

//-----↓ CLOUD FUNCTION ↓-----
export const createUserAccount = onCall({ maxInstances: 10 }, async (request) => {//Marca a função como 'async'

    logger.info("Iniciando processo de criação de conta para:", request.data.email);

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
            email: email,
            password: password,
        });

        logger.info("Usuário criado com sucesso no Auth:", userRecord.uid);

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
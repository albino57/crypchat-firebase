// src/functions/index.ts
import {setGlobalOptions} from "firebase-functions";
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();

setGlobalOptions({ maxInstances: 10 });


//----------↓ PRIMEIRA CLOUD FUNCTION ↓----------

export const createUserAccount = onCall((request) => {

  const email = request.data.email || "email.de.teste@exemplo.com";   //'request.data' conteria os dados enviados pelo nosso frontend (ex: email, senha)

  logger.info(`Recebida tentativa de registro para o email: ${email}`); //'logger.info' é o "console.log" do backend.

  return { // Esta é a resposta que a função envia de volta para o frontend.
    status: "success",
    message: `Função createUserAccount executada com sucesso para o email ${email}.`,
  };
});
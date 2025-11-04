/* eslint-disable no-undef */

//ESTE ARQUIVO É UM EXEMPLO, NO SEU PROJETO, mude "Suas chaves AQUI" pela suas chaves reais de projeto.

// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/12.4.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.4.0/firebase-messaging-compat.js");

// Inicialize o app Firebase no service worker com os valores fixos.

//↓↓ Mude "Sua chave AQUI" pela sua chaves reais de projeto. ↓↓
firebase.initializeApp({
  apiKey: "Sua chave AQUI",
  authDomain: "Sua chave AQUI",
  projectId: "Sua chave AQUI",
  storageBucket: "Sua chave AQUI",
  messagingSenderId: "Sua chave AQUI",
  appId: "Sua chave AQUI",
  vapidKey: "Sua chave AQUI"
});
//↑↑ Mude "Suas chaves AQUI" pela suas chaves reais de projeto. ↑↑

// Instância do Firebase Messaging para lidar com mensagens em segundo plano.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Mensagem em segundo plano recebida ", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png", // Use um caminho da sua pasta public
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
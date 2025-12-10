// src/hooks/useUserName.js
import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../firebaseConfig';

const functions = getFunctions(app);
const fetchUserName = httpsCallable(functions, 'fetchUserName');

//Cache para evitar buscas repetidas ao Firestore
const nameCache = {};

export function useUserName(userId) {
    const [userName, setUserName] = useState(userId); //Inicializa com o ID (fallback)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        //Verifica o cache primeiro
        if (nameCache[userId]) {
            setUserName(nameCache[userId]);
            setIsLoading(false);
            return;
        }

        //Busca na Cloud Function
        const loadName = async () => {
            setIsLoading(true);
            try {
                const response = await fetchUserName({ userId });
                const name = response.data.name || userId; 
                
                setUserName(name);
                nameCache[userId] = name; //Salva no cache
            } catch (error) {
                console.error("Falha ao buscar nome do usuário:", error);
                setUserName("Erro ao carregar nome"); //Mensagem de erro
            } finally {
                setIsLoading(false);
            }
        };

        loadName();
    }, [userId]);

    return { userName, isLoading };
}
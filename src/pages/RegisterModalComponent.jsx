// src/pages/RegisterModalComponent.jsx
import React, { useState } from 'react';
import { app } from '../firebaseConfig'; //Importa a instância 'app'
import { getFunctions, httpsCallable } from 'firebase/functions'; //Importa as ferramentas das Functions

function RegisterModalComponent({ isOpen, onClose }) {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) { return null; } //Se a prop 'isOpen' for false, o componente não renderiza nada.

    //-----↓ Conexão Cloud Functions ↓-----

    const handleRegister = async (event) => {
        event.preventDefault();
        setError(''); //Limpa erros antigos

        try {
            const functions = getFunctions(app); //Conecta ao serviço de Cloud Functions
            const createUser = httpsCallable(functions, 'createUserAccount'); //Pega a referência da função 'createUserAccount'

            //Chama a função no backend, enviando os dados
            console.log(`Enviando para o backend: ${email}`);
            const result = await createUser({ nome: nome, email: email, password: password });

            console.log("Resposta do backend:", result.data);
            alert('Sucesso! Verifique os consoles do navegador e do emulador.');
            onClose(); //Fecha o modal

        } catch (err) {
            console.error("Erro ao chamar a Cloud Function:", err);
            setError("Ocorreu um erro esquisito ao registrar. Tente mais uma vez outra hora.");
        }
        // --- FIM DA MUDANÇA ---
    };

    //-----↑ Conexão Cloud Functions ↑-----

    return (
        //Fundo escurecido que cobre a tela inteira
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-20">

            {/*O card do Modal */}
            <div className="bg-surface p-8 rounded-xl shadow-lg w-full max-w-xs m-4">
                <h2 className="text-2xl font-bold text-primary mb-6 text-center">Solicitar Acesso</h2>

                <form onSubmit={handleRegister}> {/*Conecta função ao 'onSubmit' do formulário*/}
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-text-primary text-left"></label>
                        <input
                            type="text"
                            placeholder="👤Seu Nome"
                            value={nome} //Conecta este input ao estado 'usuario'
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800 text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium text-text-primary text-left"></label>
                        <input
                            type="email"
                            placeholder="✉️Seu E-mail"
                            value={email} //Conecta este input ao estado 'email'
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800 text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-1 text-sm font-medium text-text-primary text-left"></label>
                        <input
                            type="password"
                            placeholder="🔑Sua a Senha"
                            value={password} //Conecta este input ao estado 'password'
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800 text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {/*Exibe uma mensagem de erro para o usuário, caso exista*/}
                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    {/*Botões de ação */}
                    <div className="flex justify-end gap-4 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 rounded-md text-text-secondary hover:bg-black/10 dark:hover:bg-white/10"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-6 bg-primary text-white font-bold rounded-md hover:bg-primary-dark"
                        >
                            Solicitar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RegisterModalComponent;
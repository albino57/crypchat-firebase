import { db } from './firebaseConfig'; // Importa a conexão do nosso arquivo de config
import { doc, setDoc } from 'firebase/firestore'; // Importa funções do Firestore

function App() {

  // Função que será chamada quando o botão for clicado
  const handleTestClick = async () => {
    console.log("Botão clicado! Enviando dados para o emulador...");
    try {
      // Cria uma referência para um documento com ID "teste01" dentro de uma coleção "test_collection"
      const testDocRef = doc(db, "test_collection", "teste01");
      
      // Envia os dados para esse documento
      await setDoc(testDocRef, { 
        message: "Conexão funcionando!",
        timestamp: new Date() 
      });

      console.log("Dados enviados com sucesso!");
      alert("Dados enviados! Verifique a Emulator UI.");

    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Ocorreu um erro. Verifique o console.");
    }
  };

  return (
    <div>
      <h1>Teste de Conexão com Emulador Firestore</h1>
      <button onClick={handleTestClick} style={{ fontSize: '1.2rem', padding: '10px' }}>
        Testar Conexão
      </button>
    </div>
  )
}

export default App
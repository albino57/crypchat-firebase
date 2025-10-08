import React, { useState } from 'react';
import HeaderComponent from './HeaderComponent.jsx';
import SidebarComponent from './SidebarComponent.jsx';
import MessageInputComponent from './MessageInputComponent.jsx';
// import MessageAreaComponent from './MessageAreaComponent.jsx';

function ChatPage() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); //Sibebar está visível
    const toggleSidebar = () => { //Função para alternar o estado
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        //Chamada de todos os Components↓↓
        <div className="flex justify-center items-center h-screen bg-background">
            <div className={`w-full h-full md:w-[768px] md:h-[80vh] md:rounded-lg md:shadow-lg grid grid-rows-[50px_1fr_100px]
                overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'grid-cols-[0px_1fr]' : 'grid-cols-[1fr_3fr]'}`}>

                <div className="col-span-2">
                    <HeaderComponent isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
                </div>

                <div className="row-span-2">
                    <SidebarComponent isCollapsed={isSidebarCollapsed} />
                </div>

                {/* Placeholder para a área de mensagens no futuro */}
                <div className="bg-background">
                    {/* Futuro MessageAreaComponent */}
                </div>

                {/* Placeholder para a área de input no futuro */}
                <div className="bg-surface col-start-2">
                    <MessageInputComponent/>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
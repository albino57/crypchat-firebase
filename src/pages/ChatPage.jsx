import React, { useState } from 'react';
import HeaderComponent from './HeaderComponent.jsx';
// import SidebarComponent from './components/Sidebar';
// import MessageAreaComponent from './components/MessageArea';
// import MessageInputComponent from './components/MessageInput';

function ChatPage() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); //Sibebar está visível
    const toggleSidebar = () => { //Função para alternar o estado
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="flex justify-center items-center h-screen bg-background">
            <div className={`w-full h-full md:w-[768px] md:h-[70vh] md:rounded-lg md:shadow-lg grid grid-rows-[50px_1fr_100px]
                overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'grid-cols-[60px_1fr]' : 'grid-cols-[1fr_3fr]'}`}>

                <div className="col-span-2">
                    <HeaderComponent isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
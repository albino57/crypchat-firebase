import React from 'react';
import HeaderComponent from './HeaderComponent.jsx';
// import SidebarComponent from './components/Sidebar';
// import MessageAreaComponent from './components/MessageArea';
// import MessageInputComponent from './components/MessageInput';

function ChatPage() {
    return (
        <div className="flex justify-center items-center h-screen bg-background">
            <div className="w-full h-full md:w-[768px] md:h-[70vh] md:rounded-lg md:shadow-lg grid grid-rows-[50px_1fr_100px] grid-cols-[1fr_3fr] overflow-hidden">

                <div className="col-span-2">
                    <HeaderComponent/>
                </div>
            </div>
        </div>
    );
}

export default ChatPage;
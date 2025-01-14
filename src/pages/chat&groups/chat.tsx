import {useState} from "react";
import QuestionsAndChats from "../../components/layout/questions&chats";
import GroupList from "../../components/questions&chats/GroupList";
import ChatItem from "../../components/questions&chats/ChatItem";

function Chat() {
    const [activeTab, setActiveTab] = useState("chats");

    const chatList = [
      {
        name: "Ayub Ali",
        message:
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa...",
        unreadCount: 2,
        time: "05:30 AM",
      },
      {
        name: "John Doe",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing...",
        unreadCount: 0,
        time: "04:15 AM",
      },
      {
        name: "Sarah Smith",
        message: "Duis aute irure dolor in reprehenderit...",
        unreadCount: 3,
        time: "Yesterday",
      },
      {
        name: "David Warner",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing...",
        unreadCount: 0,
        time: "04:15 AM",
      },
      {
        name: "Mark Johnson",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing...",
        unreadCount: 0,
        time: "04:15 AM",
      },
    ];
  
  return (
  <QuestionsAndChats>
    <div className="flex gap-6 border-b mb-4">
          <button 
            className={`pb-2 ${activeTab === 'chats' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('chats')}
          >
            Chats
          </button>
          <button 
            className={`pb-2 ${activeTab === 'groups' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('groups')}
          >
            Groups
          </button>
        </div>
  
        {activeTab === 'chats' ? (
          <div className="flex h-[600px] border rounded-lg">
            {/* Left Side - People List (50%) */}
            <div className="w-1/2 overflow-y-auto p-4 space-y-3 border-r">
              {/* Mapping through chat items */}
              {chatList.map((chat, index) => (
                <ChatItem
                  key={index}
                  name={chat.name}
                  message={chat.message}
                  unreadCount={chat.unreadCount}
                  time={chat.time}
                />
              ))}
            </div>
  
            {/* Right Side - Chat Area (50%) */}
            <div className="w-1/2 flex flex-col bg-white">
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b">
                <div className="w-10 h-10 rounded-full bg-gray-300" />
                <h3 className="font-medium">Saqlain Haider</h3>
              </div>
  
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="text-center mb-4">
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
  
                {/* Received Messages */}
                <div className="space-y-2 mb-4">
                  <div className="flex flex-col max-w-[80%]">
                    <p className="bg-gray-100 rounded-lg p-3 inline-block">
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa
                    </p>
                    <span className="text-xs text-gray-500 mt-1">09:16 AM</span>
                  </div>
                  <div className="flex flex-col max-w-[80%]">
                    <p className="bg-gray-100 rounded-lg p-3 inline-block">
                      cupidatat non proident, sunt in culpa
                    </p>
                    <span className="text-xs text-gray-500 mt-1">09:15 AM</span>
                  </div>
                </div>
  
                {/* Sent Messages */}
                <div className="space-y-2">
                  <div className="flex flex-col items-end">
                    <p className="bg-[#49b5da] text-white rounded-lg p-3 max-w-[80%]">
                      Excepteur sint occaecat cupidatat non proident, sunt in culpa
                      qui officia deserunt mollit anim id es
                    </p>
                    <span className="text-xs text-gray-500 mt-1">09:15 AM</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="bg-[#49b5da] text-white rounded-lg p-3 max-w-[80%]">
                      cupidatat non proident
                    </p>
                    <span className="text-xs text-gray-500 mt-1">09:12 AM</span>
                  </div>
                </div>
              </div>
  
              {/* Message Input Area */}
              <div className="p-4 border-t">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Type something..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-400"
                  />
                  <div className="absolute right-2 flex items-center gap-2">
                    <button className="p-1">
                      <span className="text-gray-400">B</span>
                    </button>
                    <button className="p-1">
                      <span className="text-gray-400">😊</span>
                    </button>
                    <button className="p-1">
                      <span className="text-gray-400">📎</span>
                    </button>
                    <button className="bg-primary-blue text-white px-4 py-1 rounded-lg">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <GroupList />
        )}
        
  </QuestionsAndChats>
  )
}

export default Chat;

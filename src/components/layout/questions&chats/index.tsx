// import React from "react";
// import { useState } from "react";
import SearchIcon from "../../../assets/icons/search.svg"
// import ChatItem from "./ChatItem";
// import GroupList from "./GroupList";

function QuestionsAndChats({ children }: any) {
 
  return (
    <div className="bg-white sm:p-[2rem] p-[1rem] h-[100vh] flex flex-col gap-10 overflow-auto relative">
      {/* Input and Button Container */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Questions & Chats</h1>
        <p>Connect and Collaborate with Fellow Researchers</p>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-[85%]">
          <img
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            src={SearchIcon}
            alt="search-icon"
          />
          <input
            type="text"
            placeholder="Search"
            className="w-full p-2 py-3 pl-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <i className="fas fa-search"></i>
          </span>
        </div>
        <button className="bg-[#1DAEDE] text-white w-[15%] py-3 px-3 rounded-lg">
          Search
        </button>
      </div>

      {children}
    </div>
  );
}

export default QuestionsAndChats;
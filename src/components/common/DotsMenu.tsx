// import { useState } from "react";
import folderIcon from "../../assets/icons/add_folder.svg";
import shareIcon from "../../assets/icons/share.svg";
import downloadIcon from "../../assets/icons/download.svg";
import groupIcon from "../../assets/icons/group.svg";
import chatIcon from "../../assets/icons/chat.png";
import qrIcon from "../../assets/icons/qr_code_scanner.svg";


function DotsMenu() {

  return (

    <>
     
        <div className=" bg-white rounded-lg shadow-lg border border-gray-200 w-64 py-2 ">
          {/* Menu Items */}
          <div className="flex flex-col">
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left">
              <img src={folderIcon} alt="" className="w-5 h-5" />
              <span className="text-gray-700">Add</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left">
              <img src={shareIcon} alt="" className="w-5 h-5" />
              <span className="text-gray-700">Share via Wechat</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left">
              <img src={downloadIcon} alt="" className="w-5 h-5" />
              <span className="text-gray-700">Download</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left">
              <img src={groupIcon} alt="" className="w-5 h-5" />
              <span className="text-gray-700">Group</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left">
              <img src={chatIcon} alt="" className="w-5 h-5" />
              <span className="text-gray-700">Chat</span>
            </button>
            <button className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 w-full text-left">
              <img src={qrIcon} alt="" className="w-5 h-5" />
              <span className="text-gray-700">Generate QR code</span>
            </button>
          </div>
        </div>
     
    </>
  );
}

export default DotsMenu;

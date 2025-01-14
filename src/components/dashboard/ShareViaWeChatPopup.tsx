import React from "react";

import RedCrossCloseIcon from "../../assets/icons/RedCrossClose.svg";

interface ShareViaWeChatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  dataRow: any;
}

const ShareViaWeChatPopup: React.FC<ShareViaWeChatPopupProps> = ({
  isOpen,
  onClose,
  dataRow,
}) => {
  console.log("Share via Popup", dataRow);
  if (!isOpen) return null;

  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg sm:p-6 p-4 relative lg:w-[845px] sm:w-[600px] w-[320px] flex flex-col ">
        <div className="flex justify-between items-center">
          <img
            onClick={onClose}
            src={RedCrossCloseIcon}
            className="absolute right-[-20px] top-[-20px] cursor-pointer"
            alt="Close"
          />
        </div>

        <p className="text-black text-[32px] font-bold font-poppins justify-center flex">
          Coming Soon
        </p>
      </div>
    </div>
  );
};

export default ShareViaWeChatPopup;

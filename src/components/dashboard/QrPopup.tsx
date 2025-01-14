import React from "react";

import QR_Dummy from "../../assets/icons/qr_dummy.svg";
import RedCrossCloseIcon from "../../assets/icons/RedCrossClose.svg";

interface QrPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const QrPopup: React.FC<QrPopupProps> = ({ isOpen, onClose }) => {
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

        <p className="text-gray-500 text-[32px] font-[500] font-poppins">
          Scan QR code
        </p>
        <div className="flex flex-col justify-center items-center mt-6">
          <img className=" w-30 h-30" src={QR_Dummy} />
        </div>
      </div>
    </div>
  );
};

export default QrPopup;

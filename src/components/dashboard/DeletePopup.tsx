import React from "react";
import { useSelector } from "react-redux";

import { selectLanguage } from "../../redux/languageSlice";
import { translate } from "../../utils/i18n";

import RedCrossCloseIcon from "../../assets/icons/RedCrossClose.svg";
interface DeletePopupProps {
  isOpen: boolean;
  onClose: () => void;
  dataRow?: any;
  handleDelete: (dataRow_id: any, type: "folder" | "files" | "uploads") => void;
  deletePopupRef: any;
  type: "folder" | "files" | "uploads"; // Added type prop to differentiate between folder and file
}

const DeletePopup: React.FC<DeletePopupProps> = ({
  isOpen,
  onClose,
  dataRow,
  handleDelete,
  deletePopupRef,
  type,
}) => {
  if (!isOpen) return null;

  const handleDeleteClick = () => {
    handleDelete(dataRow._id, type); // Using _id for both folder and file
    onClose();
  };

  const selectedLanguage = useSelector(selectLanguage);

  return (
    <div
      ref={deletePopupRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg sm:p-6 p-4 relative lg:w-[845px] sm:w-[600px] w-[320px] flex flex-col gap-[2rem]">
        <div className="flex justify-between items-center">
          <div className="text-black font-semibold font-poppins text-2xl">
            {type === "folder"
              ? translate("Delete Folder", selectedLanguage)
              : translate("Delete File", selectedLanguage)}
          </div>

          <img
            onClick={onClose}
            src={RedCrossCloseIcon}
            className="absolute right-[-20px] top-[-20px] cursor-pointer"
            alt="Close"
          />
        </div>
        <p className="text-gray-600 font-poppins text-[1rem]">
          {translate("Are you sure you want to delete", selectedLanguage)}{" "}
          <span className="font-bold">{`"${translate(
            type,
            selectedLanguage
          )}"`}</span>{" "}
          ?{" "}
          {translate(
            "Deleting this will permanently remove all content",
            selectedLanguage
          )}
          {". "}
          {translate("This action cannot be undone", selectedLanguage)}
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="border border-red-600 text-red-600 font-semibold py-2 px-6 rounded-md w-[160px] h-[50px]"
          >
            {translate("No", selectedLanguage)}
          </button>
          <button
            onClick={handleDeleteClick}
            className="bg-[#1DAEDE] text-white font-semibold py-2 px-6 rounded-md w-[160px] h-[50px]"
          >
            {translate("Yes", selectedLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;

import React from "react";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../redux/languageSlice";
import { translate } from "../../utils/i18n";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  cancelBtnText: string;
  deleteBtnText: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  cancelBtnText,
  deleteBtnText,
}) => {
  if (!isOpen) return null;

  const selectedLanguage = useSelector(selectLanguage);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] sm:w-[400px]">
        <h2 className="text-lg font-bold mb-4">{message}</h2>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onCancel}
            className=" bg-red-400 text-black px-4 py-2 rounded-md"
          >
            {translate(cancelBtnText, selectedLanguage)}
          </button>
          <button
            onClick={onConfirm}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            {translate(deleteBtnText, selectedLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;

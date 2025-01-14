import { useState } from "react";
import { translate } from "../../utils/i18n";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../redux/languageSlice";

import UserIcon from "../../assets/icons/user.svg";
import fileIdImg from "../../assets/images/id.png";
import DeleteConfirmationModal from "../dashboard/DeleteConfirmModal";
import AxiosInterceptor from "../../AxiosInterceptor";
import { toast } from "react-toastify";

function FileAccessPermission() {
  const selectedLanguage = useSelector(selectLanguage);

  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [fileId, setFileId] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await AxiosInterceptor.SECURE_API.put(
        `/user/give-access`,
        {
          fileId: fileId,
          requestedUserId: userId,
        }
      );
      toast.success("Allow the file successfully");
      console.log("response", response);
    } catch (error) {
      console.error("File cannot be accessed", error);
    } finally {
      setIsAccessOpen(false);
    }
  };

  const handleFileAccess = () => {
    setIsAccessOpen(true);
  };

  const handleDeny = () => {
    setIsAccessOpen(false);
  };

  return (
    <div className="h-auto w-auto">
      <div className="bg-white p-[2rem] h-[100vh] flex flex-col gap-10 overflow-auto relative">
        <div className="flex flex-col justify-start gap-6">
          <div className="flex flex-col justify-start gap-[1rem]">
            <p className="text-[#484848] text-center font-poppins text-2xl font-[600]">
              {translate("Permission Access", selectedLanguage)}
            </p>
            <p className="text-[#828282] font-poppins text-sm">
              {translate(
                "You can easily view detailed information about your storage usage and manage your files effectively",
                selectedLanguage
              )}
            </p>
          </div>
          <div className="flex w-full flex-col bg-[#1DAEDE] bg-opacity-[5%] p-[2rem] gap-[0.5rem] justify-start">
            <form className="flex flex-col gap-4">
              <div className="flex items-center border border-gray-300 rounded-md h-12">
                <img className="w-6 h-6 ml-3" src={UserIcon} alt="user-icon" />
                <input
                  id="user_id"
                  name="user_id"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  type="text"
                  className="w-full outline-none border-none px-3 py-2"
                  placeholder={translate("User Id", selectedLanguage)}
                />
              </div>
              <div className="flex items-center border border-gray-300 rounded-md h-12">
                <img
                  className="w-6 h-6 ml-3"
                  src={fileIdImg}
                  alt="email-icon"
                />
                <input
                  id="file_id"
                  name="file_id"
                  value={fileId}
                  onChange={(e) => setFileId(e.target.value)}
                  type="text"
                  className="w-full outline-none border-none px-3 py-2"
                  placeholder={translate("File Id", selectedLanguage)}
                />
              </div>
              <div className="pt-8">
                <button
                  type="button"
                  disabled={userId.trim() === "" || fileId.trim() === ""}
                  onClick={(e) => {
                    handleFileAccess();
                    e.preventDefault();
                  }}
                  className="bg-[#1DAEDE] w-full cursor-pointer flex items-center justify-center rounded-md h-12 disabled:bg-slate-400"
                >
                  <p className="text-white">
                    {translate("Access File", selectedLanguage)}
                  </p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Use Access or Deny */}
      <DeleteConfirmationModal
        isOpen={isAccessOpen}
        onConfirm={handleSubmit}
        onCancel={handleDeny}
        message={translate(
          "Are you sure you want to Access or Deny the file?",
          selectedLanguage
        )}
        cancelBtnText="Deny"
        deleteBtnText="Access"
      />
    </div>
  );
}

export default FileAccessPermission;

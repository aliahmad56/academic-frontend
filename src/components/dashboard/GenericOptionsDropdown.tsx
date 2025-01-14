import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import RenamePopup from "./RenamePopup";
import DeletePopup from "./DeletePopup";
import MoveToPopUp from "./MoveToPopUp";
import UploadFilePopup from "./UploadFilePopup";
import AxiosInterceptor from "../../AxiosInterceptor";
import { removeLoading, setLoading } from "../../redux/loadingSlice";
import ShareViaWeChatPopup from "./ShareViaWeChatPopup";
import {
  removeFileFromFolder,
  removeFolderFromRedux,
  selectFolders,
  updateFolderInRedux,
} from "../../redux/folderSlice";
import {
  removeFileFromRedux,
  removeFileFromReduxById,
  updateFileInRedux,
} from "../../redux/fileSlice";
import { removeUpload, updateUpload } from "../../redux/uploadSlice";
import {
  removeSpecificUpload,
  updateSpecificUpload,
} from "../../redux/specificUploadSlice";
import { selectLanguage } from "../../redux/languageSlice";
import { translate } from "../../utils/i18n";
import {
  removeSpecificFileFromRedux,
  updateSpecificFileInRedux,
} from "../../redux/specificFileSlice";

import ShareWeChatIcon from "../../assets/icons/share.svg";
import DownloadIcon from "../../assets/icons/download.svg";
import RenameIcon from "../../assets/icons/rename.svg";
import MoveIcon from "../../assets/icons/move.svg";
import PermissionsIcon from "../../assets/icons/permissions.svg";
import DeleteIcon from "../../assets/icons/delete.svg";
interface GenericDropdownProps {
  type: "folder" | "files" | "uploads";
  rowData: any;
  threeDotRef: any;
  renamePopupRef: any;
  deletePopupRef: any;
  moveToPopupRef: any;
  permissionsPopupRef?: any;
  closeDropDownCallBack: () => void;
  onDownload: (downloadFile: any) => void;
}

const GenericOptionsDropdown: React.FC<GenericDropdownProps> = ({
  type,
  rowData,
  closeDropDownCallBack,
  threeDotRef,
  renamePopupRef,
  deletePopupRef,
  onDownload,
  moveToPopupRef,
  permissionsPopupRef,
}) => {
  const [isRenamePopupOpen, setIsRenamePopupOpen] = useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
  const [isMovePopupOpen, setIsMovePopupOpen] = useState(false);
  const [isUploadFilePopup, setIsUploadFilePopup] = useState(false);
  const [isShareViaWeChatPopupOpen, setIsShareViaWeChatPopupOpen] =
    useState(false);

  const dispatch = useDispatch();
  const selectedLanguage = useSelector(selectLanguage);
  const foldersFileFromRedux = useSelector(selectFolders);

  const handleOptionClick = (action: string) => {
    // Add your action handling logic here
    switch (action) {
      case "Rename":
        setIsRenamePopupOpen(true);
        break;
      case "Share via WeChat":
        setIsShareViaWeChatPopupOpen(true);
        break;
      //  In Case of download we just simply download the file
      case "Download":
        onDownload(rowData.url);
        break;
      case "Delete":
        setIsDeletePopupOpen(true);
        break;
      case "Move":
        setIsMovePopupOpen(true);
        break;
      case "Permissions":
        setIsUploadFilePopup(true);
        break;
      default:
        break;
    }
  };
  const handleRename = (dataRow_id: any, name: string) => {
    let data = {};
    dispatch(setLoading());

    let endpoint = "";
    if (type === "folder") {
      endpoint = `/user/rename-folder/${dataRow_id}`;
      data = { newName: name };
    } else if (type === "files" || type == "uploads") {
      endpoint = `/user/rename-file`;
      data = { fileId: dataRow_id, fileName: name };
    }

    AxiosInterceptor.SECURE_API.post(endpoint, data)
      .then((response) => {
        if (type === "folder" && response?.data?.status === true) {
          const updatedName = response?.data?.updatedName || name;
          translate("Folder renamed successfully", selectedLanguage);

          dispatch(
            updateFolderInRedux({
              ...rowData,
              folderName: updatedName,
            })
          );
          dispatch(removeLoading());
          setIsRenamePopupOpen(false);
        } else if (type === "files" && response?.data?.status === true) {
          const updatedName = response?.data?.updatedName || name;
          translate("File renamed successfully", selectedLanguage);
          dispatch(removeLoading());
          setIsRenamePopupOpen(false);

          dispatch(
            updateFileInRedux({
              ...rowData,
              fileName: updatedName,
            })
          );
          dispatch(
            updateSpecificFileInRedux({
              ...rowData,
              fileName: updatedName,
            })
          );
          // TODO Convert the change in redux for files here
          // * Done!!!
        } else if (type === "uploads" && response?.data?.status === true) {
          const updatedName = response?.data?.updatedName || name;
          translate("Upload renamed successfully", selectedLanguage);
          dispatch(removeLoading());
          setIsRenamePopupOpen(false);
          dispatch(
            updateUpload({
              ...rowData, // Existing upload data
              fileName: updatedName, // Update the name
            })
          );
          dispatch(
            updateSpecificUpload({
              ...rowData, // Existing upload data
              fileName: updatedName, // Update the name
            })
          );
        } else {
          dispatch(removeLoading());
          toast.error(translate("Something went wrong", selectedLanguage));
          setIsRenamePopupOpen(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        toast.error(translate("Something went wrong", selectedLanguage));
        dispatch(removeLoading());
        setIsRenamePopupOpen(false);
      });
  };

  const handleDelete = (
    dataRow_id: any,
    type: "folder" | "files" | "uploads"
  ) => {
    const endpoint =
      type === "folder"
        ? `/user/delete-folder/${dataRow_id}`
        : `/user/delete-file/${dataRow_id}`;

    const folder = foldersFileFromRedux.find((folder) =>
      folder.files.includes(dataRow_id)
    );

    const folderId = folder ? folder?._id : null;

    dispatch(setLoading());
    AxiosInterceptor.SECURE_API.delete(endpoint)
      .then((response) => {
        if (response?.data?.status === true) {
          dispatch(removeLoading());
          setIsDeletePopupOpen(false);
          translate("Deletion successful", selectedLanguage);
          dispatch(removeFileFromReduxById(dataRow_id));
          dispatch(removeUpload(dataRow_id));
          dispatch(removeSpecificFileFromRedux(dataRow_id));
          dispatch(removeSpecificUpload(dataRow_id));
          dispatch(
            removeFileFromFolder({
              folderId,
              fileId: dataRow_id,
            })
          );

          if (type === "folder") {
            dispatch(removeFolderFromRedux(dataRow_id));
            toast.success(
              translate("Folder Successfully Deleted", selectedLanguage)
            );
          } else if (type === "files") {
            dispatch(removeFileFromRedux(dataRow_id));
            toast.success(
              translate("File successfully Deleted", selectedLanguage)
            );
          } else if (type === "uploads") {
            dispatch(removeSpecificUpload(dataRow_id));
          }
        } else {
          dispatch(removeLoading());
          toast.error(response.data.message);
          translate("Failed to Delete", selectedLanguage);
          setIsDeletePopupOpen(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error?.response?.data?.message);
        toast.error(translate("Something went wrong", selectedLanguage));
        dispatch(removeLoading());
        setIsDeletePopupOpen(false);
      });
  };

  const renderOptions = () => {
    switch (type) {
      case "folder":
        return (
          <>
            <DropdownItem
              icon={ShareWeChatIcon}
              text={translate("Share via WeChat", selectedLanguage)}
              onClick={() => handleOptionClick("Share via WeChat")}
            />
            <DropdownItem
              icon={RenameIcon}
              text={translate("Rename", selectedLanguage)}
              onClick={() => handleOptionClick("Rename")}
            />
            <DropdownItem
              icon={DeleteIcon}
              text={translate("Delete", selectedLanguage)}
              onClick={() => handleOptionClick("Delete")}
            />
          </>
        );
      case "files":
        return (
          <>
            <DropdownItem
              icon={ShareWeChatIcon}
              text={translate("Share via WeChat", selectedLanguage)}
              onClick={() => handleOptionClick("Share via WeChat")}
            />
            <DropdownItem
              icon={DownloadIcon}
              text={translate("Download", selectedLanguage)}
              onClick={() => handleOptionClick("Download")}
            />
            <DropdownItem
              icon={RenameIcon}
              text={translate("Rename", selectedLanguage)}
              onClick={() => handleOptionClick("Rename")}
            />
            <DropdownItem
              icon={MoveIcon}
              text={translate("Move", selectedLanguage)}
              onClick={() => handleOptionClick("Move")}
            />
            <DropdownItem
              icon={DeleteIcon}
              text={translate("Delete", selectedLanguage)}
              onClick={() => handleOptionClick("Delete")}
            />
          </>
        );
      case "uploads":
        return (
          <>
            <DropdownItem
              icon={ShareWeChatIcon}
              text={translate("Share via WeChat", selectedLanguage)}
              onClick={() => handleOptionClick("Share via WeChat")}
            />
            <DropdownItem
              icon={DownloadIcon}
              text={translate("Download", selectedLanguage)}
              onClick={() => handleOptionClick("Download")}
            />
            <DropdownItem
              icon={RenameIcon}
              text={translate("Rename", selectedLanguage)}
              onClick={() => handleOptionClick("Rename")}
            />
            <DropdownItem
              icon={MoveIcon}
              text={translate("Move", selectedLanguage)}
              onClick={() => handleOptionClick("Move")}
            />
            <DropdownItem
              icon={PermissionsIcon}
              text={translate("Permissions", selectedLanguage)}
              onClick={() => handleOptionClick("Permissions")}
            />
            <DropdownItem
              icon={DeleteIcon}
              text={translate("Delete", selectedLanguage)}
              onClick={() => handleOptionClick("Delete")}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className="top-[15px] z-10 absolute right-0 mt-2 origin-top-right bg-white border border-[#1DAEDE] rounded-md shadow-lg w-[230px]"
        ref={threeDotRef}
      >
        {renderOptions()}
      </div>
      {isRenamePopupOpen && (
        <RenamePopup
          isOpen={isRenamePopupOpen}
          onClose={() => {
            setIsRenamePopupOpen(false);
            closeDropDownCallBack();
          }}
          dataRow={rowData}
          handleRename={handleRename}
          renamePopupRef={renamePopupRef}
        />
      )}
      {isDeletePopupOpen && (
        <DeletePopup
          isOpen={isDeletePopupOpen}
          onClose={() => setIsDeletePopupOpen(false)}
          dataRow={rowData}
          handleDelete={handleDelete}
          deletePopupRef={deletePopupRef}
          type={type}
        />
      )}
      {isMovePopupOpen && (
        <MoveToPopUp
          isOpen={isMovePopupOpen}
          onClose={() => {
            setIsMovePopupOpen(false);
            closeDropDownCallBack();
          }}
          dataRow={rowData}
          moveToPopupRef={moveToPopupRef}
        />
      )}
      {isUploadFilePopup && (
        <UploadFilePopup
          isOpen={isUploadFilePopup}
          onClose={() => {
            setIsUploadFilePopup(false);
            closeDropDownCallBack();
          }}
          dataRow={rowData}
          permissionsPopupRef={permissionsPopupRef}
        />
      )}
      {isShareViaWeChatPopupOpen && (
        <ShareViaWeChatPopup
          isOpen={isShareViaWeChatPopupOpen}
          onClose={() => {
            setIsShareViaWeChatPopupOpen(false);
            closeDropDownCallBack();
          }}
          dataRow={rowData}
        />
      )}
    </>
  );
};

const DropdownItem: React.FC<{
  icon: string;
  text: string;
  onClick: () => void;
}> = ({ icon, text, onClick }) => (
  <div
    className="cursor-pointer flex items-center px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] gap-4"
    onClick={onClick}
  >
    <img src={icon} className="w-5 h-5 mr-2" alt={`${text} icon`} />
    <p>{text}</p>
  </div>
);

export default GenericOptionsDropdown;

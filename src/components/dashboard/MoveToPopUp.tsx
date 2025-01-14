import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AxiosInterceptor from "../../AxiosInterceptor";
import { selectLanguage } from "../../redux/languageSlice";
import { translate } from "../../utils/i18n";

import { setSpecificFilesInRedux } from "../../redux/specificFileSlice";
import { setFilesInRedux } from "../../redux/fileSlice";
import {
  addFileToFolder,
  removeFileFromFolder,
  selectFolders,
} from "../../redux/folderSlice";
import {
  removeLoading,
  selectLoading,
  setLoading,
} from "../../redux/loadingSlice";
import Loader from "../common/Loader";
import Spinner from "../common/Spinner";

import RedCrossCloseIcon from "../../assets/icons/RedCrossClose.svg";
import YellowFolderIcon from "../../assets/icons/yellow_folder.svg";
interface MovePopupProps {
  isOpen: boolean;
  onClose: () => void;
  dataRow?: any;
  moveToPopupRef: any;
}

const MoveToPopUp: React.FC<MovePopupProps> = ({
  isOpen,
  onClose,
  dataRow,
  moveToPopupRef,
}) => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(selectLanguage);
  const isLoading = useSelector(selectLoading);
  const [activeTab, setActiveTab] = useState<string>("Folders");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchingCategories, setFetchingCategories] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const folders = useSelector(selectFolders);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const fetchCategories = async (page: number = 1) => {
    setFetchingCategories(true);
    try {
      const response = await AxiosInterceptor.SECURE_API.get(
        `/user/categories?page=${page}`
      );
      if (response?.data?.status === true) {
        const fetchedCategories = response.data.allCategoryDetails;
        setCategories(fetchedCategories);
        setTotalPages(response.data.totalPages);
        setCurrentPage(page);
      } else {
        console.error("Error fetching categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setFetchingCategories(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchCategories(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchCategories(currentPage - 1);
    }
  };

  const handleMoveButtonClick = async () => {
    if (!selectedFolderId) {
      setErrorMessage("Please select a folder.");
      return;
    }

    dispatch(setLoading());

    const data = {
      fileId: dataRow._id,
      folderId: selectedFolderId,
      ...(selectedCategoryId && { categoryId: selectedCategoryId }), // categoryId is optional
    };

    // Find the current folder of the file
    let currentFolder: any = null;
    folders.forEach((folder: any) => {
      if (folder.files.includes(dataRow._id)) {
        currentFolder = folder;
      }
    });

    // Check if the file is being moved to the same folder
    if (currentFolder?._id === selectedFolderId) {
      toast.error(
        translate("File is already in this folder", selectedLanguage)
      );
      dispatch(removeLoading());
      return;
    }

    try {
      const response = await AxiosInterceptor.SECURE_API.post(
        "/user/move-file",
        data
      );

      if (response.data.status === true) {
        toast.success(translate("File moved successfully", selectedLanguage));

        // Fetch updated files from the server
        const filesResponse = await AxiosInterceptor.SECURE_API.get(
          "/user/folders/user-files"
        );
        if (filesResponse?.data?.status === true) {
          const { userFiles, currentPage, totalFiles, totalPages } =
            filesResponse.data;

          // Update the Redux store with the latest files after moving
          dispatch(
            setSpecificFilesInRedux({
              specific_files: userFiles,
              currentPage,
              totalFiles,
              totalPages,
            })
          );
          dispatch(
            setFilesInRedux({
              files: userFiles,
              currentPage,
              totalFiles,
              totalPages,
            })
          );

          // Remove the file from the current folder in Redux
          if (currentFolder?._id) {
            dispatch(
              removeFileFromFolder({
                folderId: currentFolder._id,
                fileId: dataRow._id,
              })
            );
          }

          // Add the file to the new folder in Redux
          dispatch(
            addFileToFolder({
              folderId: selectedFolderId,
              fileId: dataRow._id,
            })
          );

          onClose(); // Close the popup after a successful move
        } else {
          toast.error("Error fetching updated files");
        }
      }
    } catch (error) {
      toast.error("Error moving file");
      console.error("Error moving file" + ":", error);
    } finally {
      dispatch(removeLoading());
    }
  };

  useEffect(() => {
    if (activeTab === "Categories") {
      fetchCategories(1);
    }
  }, [activeTab]);

  if (!isOpen) return null;

  return (
    <div
      ref={moveToPopupRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      {!isLoading && <Loader />}
      <div className="bg-white rounded-lg shadow-lg sm:p-6 p-4 relative lg:w-[845px] sm:w-[600px] w-[320px] flex flex-col gap-[2rem]">
        <div className="flex justify-between items-center">
          <div className="text-black font-semibold font-poppins text-2xl">
            {translate("Move", selectedLanguage)} "{dataRow?.title}"
          </div>
          <img
            onClick={onClose}
            src={RedCrossCloseIcon}
            className="absolute right-[-20px] top-[-20px] cursor-pointer"
            alt="Close"
          />
        </div>

        <div className="text-sm font-medium text-center text-gray-500 border-b-2 dark:text-gray-400">
          <div className="sm:border-gray-200">
            <ul className="flex sm:flex-wrap -mb-px justify-start gap-[1rem]">
              {["Folders", "Categories"].map((ele) => (
                <li
                  onClick={() => handleTabClick(ele)}
                  key={ele}
                  className="cursor-pointer"
                >
                  <div
                    className={`${
                      activeTab === ele
                        ? "text-[#1DAEDE] border-b-[#1DAEDE]"
                        : ""
                    } inline-block sm:px-4 sm:py-2 p-2 text-[16px] font-poppins border-b-2 border-transparent font-bold rounded-t-lg hover:text-gray-400`}
                  >
                    {translate(ele, selectedLanguage)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="overflow-y-auto h-[300px]">
          {activeTab === "Folders" && (
            <div className="flex flex-col gap-2 h-full">
              {folders.length > 0 ? (
                folders.map((folder) => (
                  <div
                    key={folder._id}
                    onClick={() => setSelectedFolderId(folder._id)}
                    className={`flex items-center gap-2 px-2 py-3 cursor-pointer border-b-[1px] ${
                      selectedFolderId === folder._id
                        ? "bg-[#1DAEDE] bg-opacity-[10%]"
                        : "hover:bg-[#1DAEDE] hover:bg-opacity-[5%]"
                    }`}
                  >
                    <img
                      src={YellowFolderIcon}
                      alt="folder-icon"
                      className="w-5 h-5"
                    />
                    <span>{folder.folderName}</span>
                  </div>
                ))
              ) : (
                <div className="flex justify-center items-center h-full">
                  <p className="text-gray-500">No Folders Found</p>
                </div>
              )}
            </div>
          )}
          {activeTab === "Categories" &&
            (fetchingCategories ? (
              <div className="flex justify-center flex-col items-center h-full">
                <Spinner />
              </div>
            ) : categories.length > 0 ? (
              <div className="flex flex-col gap-2 ">
                {categories.map((category: any, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedCategoryId(category._id)}
                    className={`flex items-center gap-2 p-2 cursor-pointer border-b-[1px] ${
                      selectedCategoryId === category._id
                        ? "bg-[#1DAEDE] bg-opacity-[10%]"
                        : "hover:bg-[#1DAEDE] hover:bg-opacity-[5%]"
                    }`}
                  >
                    <span>{category.categoryName}</span>
                  </div>
                ))}
                <div className="flex justify-between p-2 mt-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm ${
                      currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    {translate("Previous", selectedLanguage)}
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 text-sm ${
                      currentPage === totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-blue-600 hover:text-blue-800"
                    }`}
                  >
                    {translate("Next", selectedLanguage)}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No Categories Found</p>
              </div>
            ))}
        </div>

        {errorMessage && (
          <div className="text-red-600 font-bold text-center mt-4">
            {errorMessage}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white rounded-md px-4 py-2"
            onClick={handleMoveButtonClick}
          >
            {translate("Move", selectedLanguage)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveToPopUp;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import CreateNewPopup from "./CreateNewPopup";
import AxiosInterceptor from "../../AxiosInterceptor";
import { removeLoading, setLoading } from "../../redux/loadingSlice";
import { addFolderInRedux, selectFolders } from "../../redux/folderSlice";
import Spinner from "../common/Spinner";
import { translate } from "../../utils/i18n";
import { selectLanguage } from "../../redux/languageSlice";

import RedCrossCloseIcon from "../../assets/icons/RedCrossClose.svg";
import BlackFilesIcon from "../../assets/icons/black_files.svg";
import BlueAddFolderIcon from "../../assets/icons/blue_add_folder.svg";
import FolderIcon from "../../assets/icons/folder.svg";
import DropDownIcon from "../../assets/icons/dropdown_arrow.svg";
import BlueAddCategoryIcon from "../../assets/icons/blue_add_category.svg";
import BlackCategory from "../../assets/icons/black_category.svg";

const validationSchema = Yup.object().shape({
  fileName: Yup.string().required("File name is required"),
  folderId: Yup.string().required("Folder is required"), // Changed to folderId
  categoryId: Yup.string().required("Category is required"), // Changed to categoryId
});

interface AddToFolderPopupProps {
  isOpen: boolean;
  onClose: () => void;
  // folderOptions: any;
  selectedSearchRowData: any;
  folderOrCategoryAdded?: boolean;
  setFolderOrCategoryAdded?: any;
  setUpdateData: React.Dispatch<React.SetStateAction<boolean>>;
  updateData: boolean;
}

const AddToFolderPopup: React.FC<AddToFolderPopupProps> = ({
  isOpen,
  onClose,
  // folderOptions,
  folderOrCategoryAdded,
  setFolderOrCategoryAdded,
  selectedSearchRowData,
  setUpdateData,
  updateData,
}) => {
  const selectedLanguage = useSelector(selectLanguage);
  const [isFolderDropDownOpen, setIsFolderDropDownOpen] = useState(false);
  const [isCategoryDropDownOpen, setIsCategoryDropDownOpen] = useState(false);
  const [isCreateNewFolderPopUpOpen, setIsCreateNewFolderPopUpOpen] =
    useState(false);
  const [isCreateNewCategoryPopUpOpen, setIsCreateNewCategoryPopUpOpen] =
    useState(false);

  const foldersFromRedux = useSelector(selectFolders);
  const [categories, setCategories] = useState<any>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [fetchingCategories, setFetchingCategories] = useState(false);

  const dispatch = useDispatch();

  const handleToggleFolderDropdown = () => {
    setIsFolderDropDownOpen(!isFolderDropDownOpen);
  };

  const handleToggleCategoryDropdown = () => {
    setIsCategoryDropDownOpen(!isCategoryDropDownOpen);
  };

  const handleCreateNewFolder = () => {
    setIsCreateNewFolderPopUpOpen(true);
  };

  const handleCreateNewCategory = () => {
    setIsCreateNewCategoryPopUpOpen(true);
  };

  const fetchCategories = async (page = 1) => {
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

  const handleCreate = async (name: string, type: "folder" | "category") => {
    dispatch(setLoading());

    try {
      if (type === "folder") {
        const data = { folderName: name };

        const response = await AxiosInterceptor.SECURE_API.post(
          "/user/create-folder",
          data
        );

        if (response?.data?.status === true) {
          const newFolder = response?.data?.newFolder;

          // Append the new folder to Redux state
          dispatch(addFolderInRedux([newFolder]));

          // setFolders((prevFolders: any) => [...prevFolders, newFolder]);
          toast.success("Folder created successfully");
        } else {
          toast.error(translate("Failed to create folder", selectedLanguage));
        }
      } else if (type === "category") {
        const data = { categoryName: name };

        const response = await AxiosInterceptor.SECURE_API.post(
          "/user/create-category",
          data
        );

        if (response?.data?.status === true) {
          const { categoryName } = response?.data?.newCategory;

          if (categoryName) {
            setCategories((prevCategories: any) => [
              ...prevCategories,
              response?.data?.newCategory,
            ]);
            toast.success(
              translate("Category created successfully", selectedLanguage)
            );
          } else {
            toast.error(translate("Something went wrong", selectedLanguage));
          }
        } else {
          toast.error(translate("Failed to create category", selectedLanguage));
        }
      }
    } catch (error) {
      //@ts-ignore
      if (error?.response?.status === 401) {
        toast.error(
          translate(
            "Guest user restriction, please login with an actual email",
            selectedLanguage
          )
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setFolderOrCategoryAdded(!folderOrCategoryAdded);
      setIsCreateNewFolderPopUpOpen(false);
      setIsCreateNewCategoryPopUpOpen(false);
      dispatch(removeLoading());
    }
  };

  const handleAddToFolder = async (values: any) => {
    dispatch(setLoading());
    try {
      const response = await AxiosInterceptor.SECURE_API.post(
        `/user/addfilefolder`, // Use POST instead of GET
        {
          folderId: values.folderId,
          fileId: values.fileId,
          categoryId: values.categoryId,
        }
      );

      if (response?.data?.status === true) {
        setUpdateData(!updateData);
        // Handle success (e.g., show a success message, update state, etc.)
        toast.success("File Successfully Add to Folder");
      } else {
        console.error("Error adding file to folder");
        toast.error("Failed to add file to Folder");
      }
    } catch (error) {
      console.error("Error adding file to folder:", error);
      toast.error("Access request is sent to owner for this file");
    } finally {
      dispatch(removeLoading());
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      fetchCategories(1);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg sm:p-6 p-4 relative lg:w-[845px] sm:w-[600px] w-[300px] flex flex-col gap-[2rem]">
        <img
          onClick={onClose}
          src={RedCrossCloseIcon}
          className="absolute right-[-20px] top-[-20px] cursor-pointer"
          alt="close-icon"
        />
        <h2 className="text-2xl font-bold">
          {translate("Add to Folder", selectedLanguage)}{" "}
        </h2>

        <Formik
          initialValues={{
            fileName: selectedSearchRowData?.fileName,
            fileId: selectedSearchRowData?._id || "", // Store the file _id here
            folderId: "", // Store the folder _id here
            categoryId: "", // Store the category _id here
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddToFolder}
        >
          {({ setFieldValue, values }) => (
            <Form className="flex flex-col gap-[2rem]">
              <div className="flex flex-col gap-[0.5rem]">
                <label>{translate("File Name", selectedLanguage)}</label>
                <div className="flex items-center border border-gray-300 rounded-md h-12">
                  <img
                    className="w-6 h-6 ml-3"
                    src={BlackFilesIcon}
                    alt="file-icon"
                  />
                  <Field
                    name="fileName"
                    type="text"
                    className="w-full outline-none border-none px-3 py-2 font-semibold"
                    value={selectedSearchRowData?.fileName || ""}
                  />
                </div>
                <ErrorMessage
                  name="fileName"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              <div className="flex justify-between items-center">
                <div className="text-gray-500 font-semibold text-[18px]">
                  {translate("Folder", selectedLanguage)}
                </div>
                {/* Create Folder */}
                <div
                  className="border border-[#1DAEDE] w-[160px] h-[48px] rounded-md flex flex-col items-center justify-center cursor-pointer"
                  onClick={handleCreateNewFolder}
                >
                  <div className="flex justify-evenly items-center w-full">
                    <img
                      src={BlueAddFolderIcon}
                      className="w-6 h-6"
                      alt="add-icon"
                    />
                    <p className="text-[#1DAEDE]">
                      {" "}
                      {translate("Create New", selectedLanguage)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col relative">
                <div
                  className="flex items-center border border-gray-300 rounded-md h-12 relative cursor-pointer"
                  onClick={handleToggleFolderDropdown}
                >
                  <img
                    className="w-6 h-6 ml-3"
                    src={FolderIcon}
                    alt="folder-icon"
                  />
                  <div className="w-full px-3 py-2 text-[14px]">
                    {foldersFromRedux.find(
                      (option: any) => option._id === values.folderId
                    )?.folderName || translate("Select", selectedLanguage)}
                  </div>
                  <img
                    className="w-4 h-4 absolute right-2"
                    src={DropDownIcon}
                    alt="dropdown-icon"
                  />
                </div>
                {isFolderDropDownOpen && (
                  <div className="flex flex-col border border-gray-300 rounded-md w-full h-auto h-max-[150px] overflow-auto">
                    {foldersFromRedux.map((option: any, index: any) => (
                      <div
                        key={index}
                        className="px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] cursor-pointer text-[14px]"
                        onClick={() => {
                          setFieldValue("folderId", option._id); // Store the folder _id
                          setIsFolderDropDownOpen(false);
                        }}
                      >
                        {option.folderName}
                      </div>
                    ))}
                  </div>
                )}
                <ErrorMessage
                  name="folderId"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              {/* Create New Category */}
              <div className="flex justify-between items-center">
                <div className="text-gray-500 font-semibold text-[18px]">
                  {translate("Category", selectedLanguage)}
                </div>
                <div
                  className="border border-[#1DAEDE] w-[160px] h-[48px] rounded-md flex flex-col items-center justify-center cursor-pointer"
                  onClick={handleCreateNewCategory}
                >
                  <div className="flex justify-evenly items-center w-full">
                    <img
                      src={BlueAddCategoryIcon}
                      className="w-6 h-6"
                      alt="add-icon"
                    />
                    <p className="text-[#1DAEDE]">
                      {translate("Create New", selectedLanguage)}{" "}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col relative">
                <div
                  className="flex items-center border border-gray-300 rounded-md h-12 relative cursor-pointer"
                  onClick={handleToggleCategoryDropdown}
                >
                  <img
                    className="w-6 h-6 ml-3"
                    src={BlackCategory}
                    alt="category-icon"
                  />
                  <div className="w-full px-3 py-2 text-[14px]">
                    {categories.find(
                      (category: any) => category._id === values.categoryId
                    )?.categoryName || translate("Select", selectedLanguage)}
                  </div>
                  <img
                    className="w-4 h-4 absolute right-2"
                    src={DropDownIcon}
                    alt="dropdown-icon"
                  />
                </div>
                {isCategoryDropDownOpen && (
                  <div
                    className="flex flex-col border border-gray-300 rounded-md w-full h-full overflow-auto"
                    style={{ maxHeight: "200px" }}
                  >
                    {fetchingCategories ? (
                      <div className="flex justify-center items-center py-4">
                        <Spinner />
                      </div>
                    ) : (
                      <>
                        {categories.map((category: any, index: any) => (
                          <div
                            key={index}
                            className="px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] cursor-pointer text-[14px]"
                            onClick={() => {
                              setFieldValue("categoryId", category._id); // Store the category _id
                              setIsCategoryDropDownOpen(false);
                            }}
                          >
                            {category.categoryName}
                          </div>
                        ))}
                        <div className="flex justify-between p-2">
                          <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 text-sm border  rounded-md ${
                              currentPage === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-[#1DAEDE] hover:text-black hover:font-semibold border-[#1DAEDE]"
                            }`}
                          >
                            {translate("Previous", selectedLanguage)}
                          </button>
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 text-sm border rounded-md  ${
                              currentPage === totalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-[#1DAEDE] hover:text-black hover:font-semibold border-[#1DAEDE]"
                            }`}
                          >
                            {translate("Next", selectedLanguage)}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <ErrorMessage
                  name="categoryId"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              <button
                type="submit"
                className="bg-[#1DAEDE] text-white font-semibold py-2 px-4 rounded-md self-end"
              >
                {translate("Add", selectedLanguage)}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {/* Popup for creating new folder and category */}
      <CreateNewPopup
        onClose={() => {
          setIsCreateNewFolderPopUpOpen(false);
          setIsCreateNewCategoryPopUpOpen(false);
        }}
        isOpen={isCreateNewFolderPopUpOpen || isCreateNewCategoryPopUpOpen}
        title={
          isCreateNewFolderPopUpOpen
            ? translate("Create New Folder", selectedLanguage)
            : translate("Create New Category", selectedLanguage)
        }
        onCreate={(name) =>
          isCreateNewFolderPopUpOpen
            ? handleCreate(name, "folder")
            : handleCreate(name, "category")
        }
      />
    </div>
  );
};

export default AddToFolderPopup;

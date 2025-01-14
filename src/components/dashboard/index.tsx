import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import QrPopup from "./QrPopup";

import AxiosInterceptor from "../../AxiosInterceptor";
import { translate } from "../../utils/i18n";
import { selectLanguage } from "../../redux/languageSlice";

import Spinner from "../common/Spinner";
import Loader from "../common/Loader";
import UploadFilePopup from "./UploadFilePopup";
import CreateNewPopup from "./CreateNewPopup";
import FilterDropdown from "./FilterDropDown";
import GenericOptionsDropdown from "./GenericOptionsDropdown";
import AddToFolderPopup from "./AddToFolderPopup";

import { selectAuth } from "../../redux/authSlice";
import {
  removeLoading,
  selectLoading,
  setLoading,
} from "../../redux/loadingSlice";
import {
  setFilesInRedux,
  selectFiles,
  selectCurrentFilePage,
  selectTotalFilePages,
  setPaginatedFilesInRedux,
} from "../../redux/fileSlice";

import {
  addFolderInRedux,
  selectFolders,
  setFoldersInRedux,
} from "../../redux/folderSlice";

import {
  selectCategories,
  selectCurrentCategoryPage,
  selectTotalCategoryPages,
  setPaginatedCategoriesInRedux,
} from "../../redux/categoriesSlice";
import {
  selectSpecificCurrentPage,
  selectSpecificFiles,
  selectSpecificTotalFiles,
  selectSpecificTotalPages,
  setPaginatedSpecificFilesInRedux,
  setSpecificFilesInRedux,
} from "../../redux/specificFileSlice";
import {
  selectCurrentUploadPage,
  selectTotalUploadPages,
  selectTotalUploads,
  selectUploads,
  setUploadsInRedux,
} from "../../redux/uploadSlice";
import {
  selectCurrentspecificUploadPage,
  selectSpecificUploads,
  selectTotalSpecificUploadsPages,
  setSpecificUploadsInRedux,
} from "../../redux/specificUploadSlice";

import BackArrowIcon from "../../assets/icons/back_arrow.svg";
import ThreeDotsIcons from "../../assets/icons/three_dots.svg";
import AddFolderIcon from "../../assets/icons/add_folder.svg";
import ShareWeChatIcon from "../../assets/icons/share.svg";
import QrCodeIcon from "../../assets/icons/qr_code_scanner.svg";
import NothingAdded from "../../assets/icons/Nothing Added.svg";
import SearchIcon from "../../assets/icons/search.svg";
import PlusIcon from "../../assets/icons/plus.svg";
import DropDownArrow from "../../assets/icons/dropdown_arrow.svg";
import YellowFolderIcon from "../../assets/icons/yellow_folder.svg";
import FilesIcon from "../../assets/icons/files.svg";
import NewFolderIcon from "../../assets/icons/new_folder.svg";
import UploadFileIcon from "../../assets/icons/upload_file.svg";
import NewCategoriesIcon from "../../assets/icons/categories.svg";

// Hardcoded Values
const tabs = ["All", "Folders", "Files", "Uploads"];

function Dashboard() {
  // Chekcing if Guest is logged in or a user
  const auth = useSelector(selectAuth);

  //Language fron redux
  const selectedLanguage = useSelector(selectLanguage);

  // Search Validation Schema
  const searchValidationSchema = (selectedLanguage: string) =>
    Yup.object().shape({
      search: Yup.string()
        .required(translate("Search is required", selectedLanguage)) // Translate the required message
        .min(
          3,
          translate("Search must be at least 3 characters", selectedLanguage)
        ), // Translate the min message
    });

  // Folder data from redux store
  const foldersFromRedux = useSelector(selectFolders);

  // Categories Data from reduxx store
  const categoriesFromRedux = useSelector(selectCategories);
  const categoriesCurrentPage = useSelector(selectCurrentCategoryPage);
  const categoriesTotalPages = useSelector(selectTotalCategoryPages);

  // Files Data from redux
  const filesFromRedux = useSelector(selectFiles);

  const fileCurrentPage = useSelector(selectCurrentFilePage);
  const fileTotalPages = useSelector(selectTotalFilePages);

  // Specific Files data from redux
  const specificFilesFromRedux = useSelector(selectSpecificFiles);
  const specificFileCurrentPage = useSelector(selectSpecificCurrentPage);
  const speificFileTotalPages = useSelector(selectSpecificTotalPages);
  const specificTotalFiles = useSelector(selectSpecificTotalFiles);

  // Uploads Data from redux
  const uploadsFromRedux = useSelector(selectUploads);
  const uploadsCurrentPage = useSelector(selectCurrentUploadPage);
  const uploadsTotalPages = useSelector(selectTotalUploadPages);
  const uploadsTotalCount = useSelector(selectTotalUploads);

  //  Specific Uploads Data From Redux
  const specificUploadsFromRedux = useSelector(selectSpecificUploads);
  const specificUploadsCurrentPage = useSelector(
    selectCurrentspecificUploadPage
  );
  const specificUploadsTotalPages = useSelector(
    selectTotalSpecificUploadsPages
  );

  // Fetching Loader state from Redux store
  const loaderState = useSelector(selectLoading);
  const loading: boolean = loaderState?.loading || false;
  const dispatch = useDispatch();

  // Defining the References
  const newDropDownRef: any = useRef();
  const allDropDownRef: any = useRef();
  const threeDotFoldersRef: any = useRef();
  const threeDotFilesRef: any = useRef();
  const threeDotUplaodsRef: any = useRef();
  const renamePopupRef: any = useRef(null);
  const deletePopupRef: any = useRef(null);
  const moveToPopupRef: any = useRef(null);
  const permissionsPopupRef: any = useRef(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tabs State
  const [activeTab, setActiveTab] = useState<number>(0);

  // The Filter/Caategories DropDown
  const [isFilterSearchDropDownOpen, setFilterSearchDropDownOpen] =
    useState(false);
  const [selectedFilter, setSelectedFilter] = useState(
    translate("All", selectedLanguage)
  );
  const [newDropdownVisible, setNewDropdownVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [searchResults, setSearchResults] = useState<any>([]);
  const [selectedSearchRowData, setSelectedSearchRowData] = useState(null);

  // Search Results
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Dropdown state for the the three dots shown in the search elements.
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Popup states
  const [openAddToFolderPopUp, setOpenAddToFolderPopup] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [openQRpopUp, setOpenQRpopUp] = useState(false);
  const [isUploadPopupOpen, setUploadPopupOpen] = useState(false);
  const [isCreateNewFolderPopUpOpen, setIsCreateNewFolderPopUpOpen] =
    useState(false);
  const [isCreateNewCategoryPopUpOpen, setIsCreateNewCategoryPopUpOpen] =
    useState(false);

  // Dropdown Ids for the the three dots of each folder , files and uplaods
  const [openFolderOptionsDropDownId, setOpenFolderOptionsDropDownId] =
    useState<string | null>(null);
  const [openFilesOptionsDropDownId, setOpenFilesOptionsDropDownId] = useState<
    string | null
  >(null);
  const [openUploadOptionsDropDownId, setOpenUploadOptionsDropDownId] =
    useState<string | null>(null);

  const [fetchingCategories, setFetchingCategories] = useState<boolean>(true);
  const [fetchingFolders, setFetchingFolders] = useState<boolean>(true);
  const [fetchingFiles, setFetchingFiles] = useState<boolean>(true);
  const [fetchingUpload, setFetchingUploads] = useState<boolean>(true);
  const [fetchingSpecificFiles, setFetchingSpecificFiles] =
    useState<boolean>(true);
  const [fetchingSpecificUploads, setFetchingSpecificUploads] =
    useState<boolean>(true);

  const [folderOrCategoryAdded, setFolderOrCategoryAdded] = useState(false);

  const [firstFetch, setFirstFetch] = useState(false);

  const [folderFiles, setFolderFiles] = useState<any[]>([]);
  const [showFolderFiles, setShoWFolderFiles] = useState(false);

  useEffect(() => {
    setSelectedFilter(translate("All", selectedLanguage));
  }, [selectedLanguage]);

  // Use Effect to fetch the initial categories
  useEffect(() => {
    if (!auth.isGuest) {
      setFetchingCategories(true);
      AxiosInterceptor.SECURE_API.get("/user/categories")
        .then((response) => {
          if (response?.data?.status === true) {
            dispatch(
              setPaginatedCategoriesInRedux({
                allCategoryDetails: response.data.allCategoryDetails,
                currentPage: response.data.currentPage,
                totalPages: response.data.totalPages,
                totalCategories: response.data.totalCategories,
              })
            );
          } else {
            console.log("Error");
          }
          setFetchingCategories(false);
        })
        .catch((error) => {
          console.error("Error:", error?.response?.data?.message);
          setFetchingCategories(false);
        });
    }
  }, [updateData]);

  //Use Effect to manipulate dropdown closing
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //Use Effect to get the initial  Uploads
  useEffect(() => {
    if (!auth.isGuest) {
      AxiosInterceptor.SECURE_API.get("/user/folders/files")
        .then((response) => {
          if (response?.data?.status === true) {
            const { totalPages, currentPage, uploadFiles, totalFiles } =
              response.data;

            setFetchingUploads(false);
            const uploadsFiles = uploadFiles.filter(
              (uploadFile: any) => uploadFile.copiedFile === false
            );

            dispatch(
              setUploadsInRedux({
                uploads: uploadsFiles,
                currentUploadPage: currentPage,
                totalUploads: totalFiles,
                totalUploadPages: uploadFiles.length === 0 ? 1 : totalPages,
              })
            );

            dispatch(
              setSpecificUploadsInRedux({
                specific_uploads: uploadsFiles,
                currentspecificUploadPage: currentPage,
                totalSpecificUploads: totalFiles,
                totalSpecificUploadsPages:
                  uploadFiles.length === 0 ? 1 : totalPages,
              })
            );

            setFetchingSpecificUploads(false);
            setFirstFetch(true);
          } else {
            console.log("Error");
          }
          setFetchingFolders(false);
          setFetchingUploads(false);
          setFetchingSpecificUploads(false);
        })
        .catch((error) => {
          console.error("Error:", error);
          setFetchingFolders(false);
          setFetchingUploads(false);
          setFetchingSpecificUploads(false);
        });
    }
  }, [updateData]);

  // Initial fetching of files and folders
  useEffect(() => {
    if (!auth.isGuest) {
      AxiosInterceptor.SECURE_API.get("/user/folders/user-files")
        .then((response) => {
          if (response?.data?.status === true) {
            const { totalPages, folders, currentPage, userFiles, totalFiles } =
              response.data;

            setFetchingFolders(false);
            dispatch(setFoldersInRedux(folders));

            setFetchingSpecificFiles(false);

            dispatch(
              setSpecificFilesInRedux({
                specific_files: userFiles, // This should be an array of File objects
                currentPage: currentPage, // Replace with actual currentPage value
                totalFiles: totalFiles, // Replace with actual totalFiles value
                totalPages: totalPages, // Replace with actual totalPages value
              })
            );

            setFetchingFiles(false);
            dispatch(
              setFilesInRedux({
                files: userFiles, // This should be an array of File objects
                currentPage: currentPage, // Replace with actual currentPage value
                totalFiles: totalFiles, // Replace with actual totalFiles value
                totalPages: totalPages, // Replace with actual totalPages value
              })
            );

            setFirstFetch(true);
          } else {
            console.log("Error");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setFetchingFiles(false);
          setFetchingSpecificFiles(false);
        });
    }
  }, [updateData]);

  // function to handle the dropdown closing
  const handleClickOutside = (event: any) => {
    // --------Manipulating the drop downs for New Button , All , Folders , Files and Upload---------------s

    // * Filter Categories dropDown Ref
    if (
      allDropDownRef.current &&
      !allDropDownRef.current.contains(event.target)
    )
      setFilterSearchDropDownOpen(false);

    // * NEW BUTTON dropDown Ref
    if (
      newDropDownRef.current &&
      !newDropDownRef.current.contains(event.target)
    )
      setNewDropdownVisible(false);

    // * Specific Folders dropDown Ref
    if (
      threeDotFoldersRef.current &&
      !threeDotFoldersRef.current.contains(event.target) &&
      !renamePopupRef.current?.contains(event.target) &&
      !deletePopupRef.current?.contains(event.target)
    ) {
      setOpenFolderOptionsDropDownId(null);
    }

    // * Specific Files dropDown Ref
    if (
      threeDotFilesRef.current &&
      !threeDotFilesRef.current.contains(event.target) &&
      !renamePopupRef.current?.contains(event.target) &&
      !deletePopupRef.current?.contains(event.target) &&
      !moveToPopupRef.current?.contains(event.target)
    ) {
      setOpenFilesOptionsDropDownId(null);
    }

    // * Specific Uplaods dropDown Ref
    if (
      threeDotUplaodsRef.current &&
      !threeDotUplaodsRef.current.contains(event.target) &&
      !renamePopupRef.current?.contains(event.target) &&
      !deletePopupRef.current?.contains(event.target) &&
      !moveToPopupRef.current?.contains(event.target) &&
      !permissionsPopupRef.current?.contains(event.target)
    ) {
      setOpenUploadOptionsDropDownId(null);
    }
  };

  const handleThreeDotsClick = (id: number) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };
  const handleFoldersOptionThreeDotsClick = (id: string) => {
    setOpenFolderOptionsDropDownId(
      openFolderOptionsDropDownId === id ? null : id
    );
  };
  const handleFilesOptionThreeDotsClick = (id: string) => {
    setOpenFilesOptionsDropDownId(
      openFilesOptionsDropDownId === id ? null : id
    );
  };
  const handleUploadOptionThreeDotsClick = (id: string) => {
    setOpenUploadOptionsDropDownId(
      openUploadOptionsDropDownId === id ? null : id
    );
  };

  const handleNewDropdownClick = () => {
    setNewDropdownVisible(!newDropdownVisible);
  };

  const handleSearchButtonClick = (values: { search: string }) => {
    setIsLoading(true);
    AxiosInterceptor.SECURE_API.get(
      `user/searchfolderfiles/?query=${values.search}`
    )
      .then((response) => {
        if (response?.data?.status === true) {
          const { files } = response?.data;
          setIsLoading(false);
          setShowSearchResults(true);
          setSearchResults([...files]);
        } else {
          console.log("Error");
        }
      })
      .catch((error) => {
        console.error("Error:", error?.response?.data?.message);
        toast.error(translate("Something went wrong", selectedLanguage));
        setIsLoading(false);
      });
  };

  const handleFilterSearchDropdownClick = () => {
    setFilterSearchDropDownOpen(!isFilterSearchDropDownOpen);
  };

  const handleFilterSelect = (filter: any) => {
    setSelectedFilter(filter.categoryName);
    fetchFilesAndFoldersByCategory(filter._id);
    setFilterSearchDropDownOpen(false);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadPopupOpen(true);
      setNewDropdownVisible(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    setUploadPopupOpen(false);
    setNewDropdownVisible(false);
  };

  const handleCreateNewFolderClick = () => {
    setIsCreateNewFolderPopUpOpen(!isCreateNewFolderPopUpOpen);
    setNewDropdownVisible(false);
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
          const new_response = await AxiosInterceptor.SECURE_API.get(
            `/user/categories`
          );
          if (new_response.data.status === true) {
            dispatch(
              setPaginatedCategoriesInRedux({
                allCategoryDetails: new_response.data.allCategoryDetails,
                currentPage: new_response.data.currentPage,
                totalPages: new_response.data.totalPages,
                totalCategories: new_response.data.totalCategories,
              })
            );
          } else {
            toast.error("Category added, failed to update on dashboard");
          }

          toast.success(
            translate("Category created successfully", selectedLanguage)
          );
        } else {
          toast.error(translate("Failed to create category", selectedLanguage));
        }
      }
    } catch (error) {
      console.log("error", error);
      //@ts-ignore
      if (error?.response?.status === 401) {
        toast.error(
          translate(
            "Guest user restriction, please login with an actual email",
            selectedLanguage
          )
        );
      } else {
        // @ts-ignore
        toast.error(translate(error.response.data.message, selectedLanguage));
      }
    } finally {
      setIsCreateNewFolderPopUpOpen(false);
      setIsCreateNewCategoryPopUpOpen(false);
      dispatch(removeLoading());
    }
  };

  const handleCreateNewCategoryClick = () => {
    setIsCreateNewCategoryPopUpOpen(!isCreateNewCategoryPopUpOpen);
    setNewDropdownVisible(false);
  };

  const backArrowClick = () => {
    setShowSearchResults(false);
    setShoWFolderFiles(false);
  };

  const handleAddFolderClick = (rowData: any) => {
    setSelectedSearchRowData(rowData);
    setOpenAddToFolderPopup(true);
    setOpenDropdownId(null); // close the dropdown when we open popup
  };

  // Implement the we chat here
  const handleShareViaWeChatClick = () => {
    console.log("test2");
  };

  const handleGenerateQrClick = () => {
    setOpenQRpopUp(true);
    setOpenDropdownId(null); // close the dropdown when we open popup
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    // Close all dropdowns when switching tabs
    setOpenFolderOptionsDropDownId(null);
    setOpenFilesOptionsDropDownId(null);
    setOpenUploadOptionsDropDownId(null);
    setNewDropdownVisible(false);
  };

  const handleDownload = (downloadURL: string) => {
    // Create an anchor element
    const link = document.createElement("a");
    link.href = downloadURL;
    link.target = "_blank"; // Open in a new tab
    link.download = ""; // This will trigger the download if the URL is directly downloadable

    // Append the anchor to the document body
    document.body.appendChild(link);

    // Programmatically click the anchor to trigger the download
    link.click();

    // Remove the anchor from the document
    document.body.removeChild(link);

    // Close dropdowns
    setOpenFilesOptionsDropDownId(null);
    setOpenUploadOptionsDropDownId(null);
  };

  const handleGenericOptionsDropDownCloseAll = () => {
    setOpenFolderOptionsDropDownId(null);
    setOpenFilesOptionsDropDownId(null);
    setOpenUploadOptionsDropDownId(null);
    setNewDropdownVisible(false);
  };

  // Function to call the Categories again if Next or  Previous button located in the Filter/Category dropdown is clicked ( pagination)
  const fetchCategories = async (page: number) => {
    setFetchingCategories(true);
    try {
      const response = await AxiosInterceptor.SECURE_API.get(
        `/user/categories?page=${page}`
      );
      if (response?.data?.status === true) {
        dispatch(
          setPaginatedCategoriesInRedux({
            allCategoryDetails: response.data.allCategoryDetails,
            currentPage: response.data.currentPage,
            totalPages: response.data.totalPages,
            totalCategories: response.data.totalCategories,
          })
        );
      } else {
        console.error("Error fetching categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setFetchingCategories(false);
    }
  };

  // Function to fetch the Uploads again if Next or  Previous button located below the uploads shown is clicked ( pagination)
  // ! The API used here also bring ths folders but we won't use them as of now
  const fetchUploads = async (
    page: number,
    type: "uploads" | "specific-uploads"
  ) => {
    try {
      const response = await AxiosInterceptor.SECURE_API.get(
        `/user/folders/files?page=${page}`
      );

      if (response?.data?.status === true) {
        const { totalPages, currentPage, uploadFiles, totalFiles } =
          response.data;

        if (type === "uploads") {
          setFetchingUploads(false);
          dispatch(
            setUploadsInRedux({
              uploads: uploadFiles,
              currentUploadPage: currentPage,
              totalUploads: totalFiles,
              totalUploadPages: totalPages,
            })
          );
        } else if (type === "specific-uploads") {
          setFetchingSpecificUploads(false);

          dispatch(
            setSpecificUploadsInRedux({
              specific_uploads: uploadFiles,
              currentspecificUploadPage: currentPage,
              totalSpecificUploads: totalFiles,
              totalSpecificUploadsPages: totalPages,
            })
          );
        }
      } else {
        console.log("Error");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      if (type === "uploads") {
        setFetchingFiles(false);
      } else if (type === "specific-uploads") {
        setFetchingSpecificUploads(false);
      }
    }
  };

  const fetchFiles = async (
    page: number,
    type: "files" | "specific-files",
    categoryId?: string // Optional categoryId parameter
  ) => {
    try {
      // Construct the URL with page and categoryId if provided
      let url = `/user/folders/user-files?page=${page}`;
      if (categoryId) {
        url += `&categoryId=${categoryId}`; // Append categoryId to the URL if it exists
      }

      const response = await AxiosInterceptor.SECURE_API.get(url);

      if (response?.data?.status === true) {
        const { totalPages, currentPage, userFiles, totalFiles } =
          response.data;

        if (type === "files") {
          dispatch(
            setPaginatedFilesInRedux({
              files: userFiles, // This should be an array of File objects
              currentPage: currentPage, // Replace with actual currentPage value
              totalFiles: totalFiles, // Replace with actual totalFiles value
              totalPages: totalPages, // Replace with actual totalPages value
            })
          );
        } else if (type === "specific-files") {
          setFetchingSpecificFiles(false);

          dispatch(
            setPaginatedSpecificFilesInRedux({
              specific_files: userFiles, // This should be an array of File objects
              currentPage: currentPage, // Replace with actual currentPage value
              totalFiles: totalFiles, // Replace with actual totalFiles value
              totalPages: totalPages, // Replace with actual totalPages value
            })
          );
        }
      } else {
        console.log("Error fetching files");
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      if (type === "files") {
        setFetchingFiles(false);
      } else if (type === "specific-files") {
        setFetchingSpecificFiles(false);
      }
    }
  };

  const fetchFilesAndFoldersByCategory = async (categoryId: string) => {
    dispatch(setLoading());
    try {
      // Construct the URL for fetching files by categoryId
      const url = `/user/folders/user-files?categoryId=${categoryId}`;

      const response = await AxiosInterceptor.SECURE_API.get(url);

      if (response?.data?.status === true) {
        const { userFiles, currentPage, totalPages, totalFiles, folders } =
          response.data; // Extract userFiles from the response

        // Dispatch the fetched files to Redux or handle them as needed
        dispatch(
          setPaginatedFilesInRedux({
            files: userFiles, // This should be an array of File objects
            currentPage: currentPage, // Replace with actual currentPage value
            totalFiles: totalFiles, // Replace with actual totalFiles value
            totalPages: totalPages, // Replace with actual totalPages value
          })
        );

        dispatch(setFoldersInRedux(folders));
      } else {
        console.log("Error fetching files");
      }
    } catch (error) {
      console.error("Error fetching files by category:", error);
      toast.error(translate("Filtering Failed", selectedLanguage));
    } finally {
      dispatch(removeLoading());
    }
  };

  // ------------Pagination functions for the Filter/Category Dropdown-----------------
  const handlePrevPage = () => {
    if (categoriesCurrentPage > 1) {
      fetchCategories(categoriesCurrentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (categoriesCurrentPage < categoriesTotalPages) {
      fetchCategories(categoriesCurrentPage + 1);
    }
  };
  // --------------------------------------------------------------------------------------------

  // -------------------------Pagination function for the files-------------------------------
  const handlePrevFilePage = () => {
    setFetchingFiles(true);
    if (fileCurrentPage > 1) {
      fetchFiles(fileCurrentPage - 1, "files");
    }
  };
  const handleNextFilePage = () => {
    setFetchingFiles(true);
    if (fileCurrentPage < fileTotalPages) {
      fetchFiles(fileCurrentPage + 1, "files");
    }
  };

  const handlePrevSpecificFilePage = () => {
    setFetchingSpecificFiles(true);
    if (specificFileCurrentPage > 1) {
      fetchFiles(specificFileCurrentPage - 1, "specific-files");
    }
  };

  const handleNextSpecificFilePage = () => {
    setFetchingSpecificFiles(true);
    if (specificFileCurrentPage < speificFileTotalPages) {
      fetchFiles(specificFileCurrentPage + 1, "specific-files");
    }
  };
  // -----------------------------------------------------------------------------------------

  // ----------------------------Pagination functions for the uploads-------------------------------
  const handlePrevUploadPage = () => {
    setFetchingUploads(true);
    if (uploadsCurrentPage > 1) {
      fetchUploads(uploadsCurrentPage - 1, "uploads");
    }
  };
  const handleNextUploadPage = () => {
    setFetchingUploads(true);
    if (uploadsCurrentPage < uploadsTotalPages) {
      fetchUploads(uploadsCurrentPage + 1, "uploads");
    }
  };

  const handlePrevSpecificUploadPage = () => {
    setFetchingSpecificUploads(true);
    if (specificUploadsCurrentPage > 1) {
      fetchUploads(specificUploadsCurrentPage - 1, "specific-uploads");
    }
  };
  const handleNextSpecificUploadPage = () => {
    setFetchingSpecificUploads(true);
    if (specificUploadsCurrentPage < specificUploadsTotalPages) {
      fetchUploads(specificUploadsCurrentPage + 1, "specific-uploads");
    }
  };

  const handleFolderClick = async (folderId: string) => {
    dispatch(setLoading());
    try {
      // Show the loader when fetching files
      const response = await AxiosInterceptor.SECURE_API.get(
        `/user/getfolderfiles/${folderId}`
      );
      if (response?.data?.status === true) {
        setFolderFiles(response.data.filesDetail.files); // Store the fetched files in the state
      } else {
        toast.error(
          translate("Error fetching files in the folder", selectedLanguage)
        );
      }
    } catch (error) {
      console.error("Error fetching folder files:", error);
      toast.error("Error fetching folder files");
    } finally {
      dispatch(removeLoading()); // Hide the loader after fetching files
      setShoWFolderFiles(true);
    }
  };

  // -------------------------------------------------------------------------------------------------
  // Rendered Content based of selected Tab

  const renderContent = () => {
    if (
      auth.isGuest ||
      (foldersFromRedux.length === 0 &&
        filesFromRedux.length === 0 &&
        uploadsFromRedux.length === 0 &&
        firstFetch === true)
    ) {
      return (
        <div className="flex w-full justify-center flex-col gap-4 items-center h-[60vh]">
          <img
            src={NothingAdded}
            alt="Nothing added yet!"
            className="w-36 h-36"
          />
          <p className="text-gray-500">
            {" "}
            {translate("Nothing added yet", selectedLanguage)} !
          </p>
        </div>
      );
    }

    if (activeTab === 0) {
      // All
      return (
        <>
          <div className="flex flex-col gap-14">
            {/* Folders */}
            <div className="flex justify-between">
              <div className="  text-[24px] font-bold text-gray-500  text-xl font-poppins">
                {translate("Folders", selectedLanguage)}
              </div>
              <FilterDropdown
                fetchingCategories={fetchingCategories} // boolean check to show loader
                filterRef={allDropDownRef}
                selectedFilter={selectedFilter}
                selectedLanguage={selectedLanguage}
                isFilterSearchDropDownOpen={isFilterSearchDropDownOpen}
                categories={categoriesFromRedux} // main data
                handleFilterSearchDropdownClick={
                  handleFilterSearchDropdownClick
                }
                handleFilterSelect={handleFilterSelect} // change selected option
                // ------pagination------
                handlePrevPage={handlePrevPage}
                handleNextPage={handleNextPage}
                currentPage={categoriesCurrentPage}
                totalPages={categoriesTotalPages}
                // -------------------------
              />
            </div>
            <div className="w-full flex justify-start flex-wrap gap-2">
              {fetchingFolders ? (
                <div className="flex w-full justify-center flex-col gap-4 items-center">
                  <Spinner />
                  <h2> {translate("Fetching Folders", selectedLanguage)}</h2>
                </div>
              ) : foldersFromRedux.length > 0 ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] w-full">
                  {foldersFromRedux.map((folder: any) => (
                    <div
                      key={folder._id}
                      className="bg-[#8282820D] h-[48px] flex items-center p-2 rounded-md hover:border hover:border-[#1DAEDE] transition-all duration-300 cursor-pointer"
                      onClick={() => handleFolderClick(folder._id)} // Attach double-click event
                    >
                      <img
                        src={YellowFolderIcon}
                        className="w-5 h-5 mr-2"
                        alt="folder-icon"
                      />
                      <div className="flex justify-between items-center w-full gap-2">
                        <h3 className="font-poppins text-[#484848] text-sm">
                          {folder?.folderName}
                        </h3>
                        <p className="text-sm text-[#828282]">
                          {folder.files.length}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex w-full justify-center flex-col gap-4 items-center">
                  <h2> {translate("No folders found", selectedLanguage)}</h2>
                </div>
              )}
            </div>

            {/* Files */}
            <div>
              <p className="text-[24px] font-bold text-gray-500  text-xl font-poppins">
                {translate("Files", selectedLanguage)}
              </p>
            </div>
            <div className="w-full flex justify-start flex-wrap gap-6">
              {fetchingFiles ? (
                <div className="flex w-full justify-center flex-col gap-4 items-center">
                  <Spinner />
                  <h2> {translate("Fetching Files", selectedLanguage)}...</h2>
                </div>
              ) : (
                <div className="w-full">
                  <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] w-full">
                    {filesFromRedux.length > 0 ? (
                      <div className="w-full">
                        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] w-full">
                          {filesFromRedux
                            .slice(0, 10)
                            .map((file: any, index: any) => (
                              <div
                                key={index}
                                className="bg-[#8282820D]  h-[100px] flex items-center p-2 my-2  rounded-md flex-col justify-center gap-4"
                              >
                                <img
                                  src={FilesIcon}
                                  className="w-5 h-5"
                                  alt="file-icon"
                                />
                                <h3 className="font-poppins text-[#484848] text-sm text-center">
                                  {file?.fileName}
                                </h3>
                              </div>
                            ))}
                        </div>

                        <div className="flex justify-between p-2">
                          <button
                            onClick={handlePrevFilePage}
                            disabled={fileCurrentPage === 1}
                            className={`px-3 py-1 text-sm border  rounded-md ${
                              fileCurrentPage === 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-[#1DAEDE] hover:text-black hover:font-semibold border-[#1DAEDE]"
                            }`}
                          >
                            {translate("Previous", selectedLanguage)}
                          </button>
                          <button
                            onClick={handleNextFilePage}
                            disabled={fileCurrentPage === fileTotalPages}
                            className={`px-3 py-1 text-sm border rounded-md  ${
                              fileCurrentPage === fileTotalPages
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-[#1DAEDE] hover:text-black hover:font-semibold border-[#1DAEDE]"
                            }`}
                          >
                            {translate("Next", selectedLanguage)}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex w-full justify-center flex-col gap-4 items-center">
                        <h2>
                          {" "}
                          {translate("No files found", selectedLanguage)}{" "}
                        </h2>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Uploads */}
            <div className="flex">
              <p className="text-[24px] font-bold text-gray-500  text-xl font-poppins">
                {translate("Uploads", selectedLanguage)}
              </p>
            </div>
            <div className="w-full flex justify-start flex-wrap gap-6">
              {fetchingUpload === true ? (
                <div className="flex w-full justify-center flex-col gap-4 items-center">
                  <Spinner />
                  <h2> {translate("Fetching Uploads", selectedLanguage)}</h2>
                </div>
              ) : uploadsFromRedux.length > 0 ? (
                <div className="w-full">
                  <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] w-full">
                    {uploadsFromRedux.map((upload: any, index: any) => (
                      <div
                        key={index}
                        className="bg-[#8282820D]  h-[100px] flex items-center p-2 my-2  rounded-md flex-col justify-center gap-4"
                      >
                        <img
                          src={FilesIcon}
                          className="w-5 h-5"
                          alt="upload-icon"
                        />
                        <h3 className="font-poppins text-[#484848] text-sm text-center">
                          {upload?.fileName}
                        </h3>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between p-2">
                    <button
                      onClick={handlePrevUploadPage}
                      disabled={uploadsCurrentPage === 1}
                      className={`px-3 py-1 text-sm border  rounded-md ${
                        uploadsCurrentPage === 1
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#1DAEDE] hover:text-black hover:font-semibold border-[#1DAEDE]"
                      }`}
                    >
                      {translate("Previous", selectedLanguage)}
                    </button>
                    <button
                      onClick={handleNextUploadPage}
                      disabled={uploadsCurrentPage === uploadsTotalPages}
                      className={`px-3 py-1 text-sm border rounded-md  ${
                        uploadsCurrentPage === uploadsTotalPages
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#1DAEDE] hover:text-black hover:font-semibold border-[#1DAEDE]"
                      }`}
                    >
                      {translate("Next", selectedLanguage)}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex w-full justify-center flex-col gap-4 items-center">
                  <h2> {translate("No uploads found", selectedLanguage)}</h2>
                </div>
              )}
            </div>
          </div>
        </>
      );
    } else if (activeTab === 1) {
      // Folders
      return (
        <div className=" w-full flex  flex-col justify-start flex-wrap gap-2">
          <div className="flex justify-between items-start">
            <div className="  text-[24px] font-bold text-gray-500  text-xl font-poppins">
              {translate("Folders", selectedLanguage)}{" "}
              <span className="text-[16px]"> ({foldersFromRedux.length})</span>
            </div>
            <FilterDropdown
              fetchingCategories={fetchingCategories}
              filterRef={allDropDownRef}
              selectedFilter={selectedFilter}
              selectedLanguage={selectedLanguage}
              isFilterSearchDropDownOpen={isFilterSearchDropDownOpen}
              categories={categoriesFromRedux}
              handleFilterSearchDropdownClick={handleFilterSearchDropdownClick}
              handleFilterSelect={handleFilterSelect}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
              currentPage={categoriesCurrentPage}
              totalPages={categoriesTotalPages}
            />
          </div>

          {foldersFromRedux.map((folder: any, index: any) => (
            <div
              key={folder._id}
              className={`w-full h-[48px] flex items-center p-2 my-2  ${
                index !== foldersFromRedux.length - 1 ? "border-b-2" : ""
              }`}
            >
              <img
                src={YellowFolderIcon}
                className="w-5 h-5 mr-2"
                alt="folder-icon"
              />
              <div className="flex justify-between items-center w-full gap-2 relative">
                <h3 className="font-poppins text-[#484848] text-sm">
                  {folder?.folderName}
                </h3>
                <img
                  onClick={() => handleFoldersOptionThreeDotsClick(folder._id)}
                  src={ThreeDotsIcons}
                  alt="three_dots.svg"
                  className="w-3 h-4 cursor-pointer"
                />
                {openFolderOptionsDropDownId === folder._id && (
                  <div className="absolute right-0 top-[0px]">
                    <GenericOptionsDropdown
                      threeDotRef={threeDotFoldersRef}
                      type={"folder"}
                      rowData={folder}
                      closeDropDownCallBack={
                        handleGenericOptionsDropDownCloseAll
                      }
                      // ? We have to pass the onDownload function here as well for typescript checks
                      // ?  but further ahead the Folder's Download option is commented out
                      onDownload={handleDownload}
                      renamePopupRef={renamePopupRef}
                      deletePopupRef={deletePopupRef}
                      moveToPopupRef={moveToPopupRef}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      );
    } else if (activeTab === 2) {
      // Files
      return (
        <div className=" w-full flex  flex-col justify-start  gap-2 h-full">
          <div className="flex justify-between items-start">
            <div className="  text-[24px] font-bold text-gray-500  text-xl font-poppins">
              {translate("Files", selectedLanguage)}
              <span className="text-[16px]"> ({specificTotalFiles})</span>
            </div>
            <FilterDropdown
              fetchingCategories={fetchingCategories}
              filterRef={allDropDownRef}
              selectedFilter={selectedFilter}
              selectedLanguage={selectedLanguage}
              isFilterSearchDropDownOpen={isFilterSearchDropDownOpen}
              categories={categoriesFromRedux}
              handleFilterSearchDropdownClick={handleFilterSearchDropdownClick}
              handleFilterSelect={handleFilterSelect}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
              currentPage={categoriesCurrentPage}
              totalPages={categoriesTotalPages}
            />
          </div>
          {fetchingSpecificFiles === true ? (
            <div className="flex justify-center items-center flex-col h-full">
              <Spinner />
            </div>
          ) : (
            <div className="flex gap-4 flex-col">
              {specificFilesFromRedux.map((file: any, index: any) => (
                <div
                  key={file._id}
                  className={`w-full h-[48px] flex items-center p-2 my-2  ${
                    index !== filesFromRedux.length - 1 ? "border-b-2" : ""
                  }`}
                >
                  <img
                    src={FilesIcon}
                    className="w-5 h-5 mr-2"
                    alt="file-icon"
                  />

                  <div className="flex justify-between items-center w-full gap-2 relative">
                    <h3 className="font-poppins text-[#484848] text-sm">
                      {file?.fileName}
                    </h3>
                    <img
                      onClick={() => handleFilesOptionThreeDotsClick(file._id)}
                      src={ThreeDotsIcons}
                      alt="three_dots.svg"
                      className="w-3 h-4 cursor-pointer"
                    />
                    {openFilesOptionsDropDownId === file._id && (
                      <div className="absolute right-0 top-[0px]">
                        <GenericOptionsDropdown
                          threeDotRef={threeDotFilesRef}
                          type={"files"}
                          rowData={file}
                          closeDropDownCallBack={
                            handleGenericOptionsDropDownCloseAll
                          }
                          onDownload={handleDownload}
                          renamePopupRef={renamePopupRef}
                          deletePopupRef={deletePopupRef}
                          moveToPopupRef={moveToPopupRef}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between p-2">
            <button
              onClick={handlePrevSpecificFilePage}
              disabled={specificFileCurrentPage === 1}
              className={`px-3 py-1 text-sm border  rounded-md ${
                specificFileCurrentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#1DAEDE] hover:text-black hover:font-semibold border-[#1DAEDE]"
              }`}
            >
              {translate("Previous", selectedLanguage)}
            </button>
            <button
              onClick={handleNextSpecificFilePage}
              disabled={specificFileCurrentPage === speificFileTotalPages}
              className={`px-3 py-1 text-sm border rounded-md  ${
                specificFileCurrentPage === speificFileTotalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#1DAEDE] hover:text-black hover:font-semibold border-[#1DAEDE]"
              }`}
            >
              {translate("Next", selectedLanguage)}
            </button>
          </div>
        </div>
      );
    } else if (activeTab === 3) {
      // Uploads
      return (
        <div className=" w-full flex justify-start gap-2 flex-col">
          <div className="flex justify-between items-start">
            <div className="  text-[24px] font-bold text-gray-500  text-xl font-poppins">
              {translate("Your Uploads", selectedLanguage)}
              <span className="text-[16px]"> ({uploadsTotalCount})</span>
            </div>
            <FilterDropdown
              fetchingCategories={fetchingCategories}
              filterRef={allDropDownRef}
              selectedFilter={selectedFilter}
              selectedLanguage={selectedLanguage}
              isFilterSearchDropDownOpen={isFilterSearchDropDownOpen}
              categories={categoriesFromRedux}
              handleFilterSearchDropdownClick={handleFilterSearchDropdownClick}
              handleFilterSelect={handleFilterSelect}
              handlePrevPage={handlePrevPage}
              handleNextPage={handleNextPage}
              currentPage={categoriesCurrentPage}
              totalPages={categoriesTotalPages}
            />
          </div>

          {fetchingSpecificUploads === true ? (
            <div className="flex justify-center items-center flex-col h-full">
              <Spinner />
            </div>
          ) : (
            <div className="flex gap-4 flex-col">
              {specificUploadsFromRedux.map((upload: any, index: any) => (
                <div
                  key={upload._id}
                  className={`w-full h-[48px] flex items-center p-2 my-2  ${
                    index !== uploadsFromRedux.length - 1 ? "border-b-2" : ""
                  }`}
                >
                  <img
                    src={FilesIcon}
                    className="w-5 h-5 mr-2"
                    alt="upload-icon"
                  />

                  <div className="flex justify-between items-center w-full gap-2 relative">
                    <h3 className="font-poppins text-[#484848] text-sm">
                      {upload?.fileName}
                    </h3>
                    <img
                      onClick={() =>
                        handleUploadOptionThreeDotsClick(upload._id)
                      }
                      src={ThreeDotsIcons}
                      alt="three_dots.svg"
                      className="w-3 h-4 cursor-pointer"
                    />
                    {openUploadOptionsDropDownId === upload._id && (
                      <div className="absolute right-0 top-[0px]">
                        <GenericOptionsDropdown
                          threeDotRef={threeDotUplaodsRef}
                          type={"uploads"}
                          rowData={upload}
                          closeDropDownCallBack={
                            handleGenericOptionsDropDownCloseAll
                          }
                          onDownload={handleDownload}
                          renamePopupRef={renamePopupRef}
                          deletePopupRef={deletePopupRef}
                          moveToPopupRef={moveToPopupRef}
                          permissionsPopupRef={permissionsPopupRef}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-between p-2">
            <button
              onClick={handlePrevSpecificUploadPage}
              disabled={specificUploadsCurrentPage === 1}
              className={`px-3 py-1 text-sm border  rounded-md ${
                specificUploadsCurrentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#1DAEDE] hover:text-black hover:font-semibold border-[#1DAEDE]"
              }`}
            >
              {translate("Previous", selectedLanguage)}
            </button>
            <button
              onClick={handleNextSpecificUploadPage}
              disabled={
                specificUploadsCurrentPage === specificUploadsTotalPages
              }
              className={`px-3 py-1 text-sm border rounded-md  ${
                specificUploadsCurrentPage === specificUploadsTotalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#1DAEDE] hover:text-black hover:font-semibold border-[#1DAEDE]"
              }`}
            >
              {translate("Next", selectedLanguage)}
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="h-auto w-auto ">
      {loading && <Loader />}
      <div
        className="bg-white sm:p-[1.5rem] p-[1.5rem] h-[100vh] flex flex-col gap-10 overflow-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <Formik
          initialValues={{ search: "" }}
          validateOnBlur={false}
          validateOnChange={false}
          validationSchema={searchValidationSchema(selectedLanguage)} // Update schema based on language
          onSubmit={handleSearchButtonClick}
        >
          {({ handleChange, handleBlur, values, validateForm }) => {
            // Trigger form revalidation on language change
            useEffect(() => {
              validateForm(); // Re-run form validation when language changes
            }, [selectedLanguage]);

            return (
              <Form className="flex items-center justify-between gap-5 sm:flex-row flex-col">
                {(showSearchResults || showFolderFiles) && (
                  <img
                    onClick={backArrowClick}
                    src={BackArrowIcon}
                    className="w-6 h-6 cursor-pointer"
                  />
                )}

                <div className="flex w-full items-start gap-4">
                  <div className="flex flex-col gap-[0.5rem] w-full ">
                    <div className="flex items-center border border-gray-300 rounded-md h-12 w-full">
                      <img
                        className="w-6 h-6 ml-3"
                        src={SearchIcon}
                        alt="search-icon"
                      />
                      <Field
                        id="search"
                        name="search"
                        type="search"
                        className="w-full outline-none border-none px-3 py-2"
                        placeholder={translate("Search", selectedLanguage)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.search}
                      />
                    </div>
                    <ErrorMessage
                      name="search"
                      component="div"
                      className="text-red-600 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center gap-3 sm:w-auto"
                  >
                    <div className="sm:w-[165px] h-[48px] flex items-center cursor-pointer justify-center border rounded-md bg-[#1DAEDE] w-full">
                      <p className="text-white">
                        {translate("Search", selectedLanguage)}
                      </p>
                    </div>
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>

        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Spinner />
          </div>
        ) : showSearchResults ? (
          searchResults.length > 0 ? (
            <div className="flex flex-col gap-6">
              {searchResults.map((result: any) => (
                <div
                  key={result._id}
                  className="bg-white border border-gray-300 rounded-md p-4 shadow-sm hover:border-[#1DAEDE] flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center relative">
                    <div className="font-poppins font-bold text-lg">
                      {result.authorName}
                    </div>
                    <img
                      onClick={() => handleThreeDotsClick(result._id)}
                      src={ThreeDotsIcons}
                      alt="three_dots.svg"
                      className="w-3 h-4 cursor-pointer"
                    />

                    {/* Three Dots Dropdown */}
                    {openDropdownId === result._id && (
                      <div className=" top-[15px] z-10 absolute right-0 mt-2 origin-top-right bg-white border border-[#1DAEDE] rounded-md shadow-lg w-[230px]">
                        {/* Add To Folder */}
                        <div
                          onClick={() => handleAddFolderClick(result)}
                          className="cursor-pointer flex items-center px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] gap-4"
                        >
                          <img
                            src={AddFolderIcon}
                            className="w-5 h-5 mr-2"
                            alt="Upload File"
                          />
                          <p> {translate("Add", selectedLanguage)} </p>
                        </div>

                        {/* Share Via Wechat */}
                        <div
                          onClick={handleShareViaWeChatClick}
                          className="cursor-pointer flex items-center px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] gap-4"
                        >
                          <img
                            src={ShareWeChatIcon}
                            className="w-5 h-5 mr-2"
                            alt="share Via We Chat"
                          />
                          <p>
                            {" "}
                            {translate("Share Via WeChat", selectedLanguage)}
                          </p>
                        </div>
                        {/* Generate QR code */}
                        <div
                          onClick={handleGenerateQrClick}
                          className="cursor-pointer flex items-center px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] gap-4"
                        >
                          <img
                            src={QrCodeIcon}
                            className="w-5 h-5 mr-2"
                            alt="Qr Code"
                          />
                          <p>
                            {" "}
                            {translate("Generate QR Code", selectedLanguage)}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-red-500 font-poppins text-sm mb-2 italic font-[400]">
                    {result.publicationYear || "No Year Provided"}
                  </p>
                  <h3 className="font-poppins text-base font-semibold text-[#484848]">
                    {result.title || "No title given"}
                  </h3>
                  <p className="font-poppins text-sm text-gray-600">
                    {result.summary || "Temporary summary for now"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center flex-col h-[70vh] font-semibold text-2xl">
              {" "}
              {translate("No Records found", selectedLanguage)}
            </div>
          )
        ) : showFolderFiles ? (
          <div>
            <p className="text-[24px] font-bold text-gray-500  text-xl font-poppins">
              {translate("Files in Folder", selectedLanguage)}
            </p>
            <div className="w-full flex justify-start flex-wrap gap-6">
              {folderFiles.length > 0 ? (
                <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(240px,1fr))] w-full">
                  {folderFiles.map((file: any, index: any) => (
                    <div
                      key={index}
                      className="bg-[#8282820D] h-[100px] flex items-center p-2 my-2 rounded-md flex-col justify-center gap-4"
                    >
                      <img
                        src={FilesIcon}
                        className="w-5 h-5"
                        alt="file-icon"
                      />
                      <h3 className="font-poppins text-[#484848] text-sm text-center">
                        {file?.fileName}
                      </h3>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex w-full justify-center flex-col gap-4 items-center">
                  <h2> {translate("No files found", selectedLanguage)}</h2>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-5 ">
              <p className="text-[#484848] font-poppins text-[24px] font-bold">
                {translate("Main Library", selectedLanguage)}
              </p>

              {/* New Button */}
              <div className="flex items-center relative" ref={newDropDownRef}>
                <div
                  className="sm:w-[130px] w-[80px] h-[48px] flex items-center cursor-pointer justify-evenly border rounded-md border-[#1DAEDE]"
                  onClick={handleNewDropdownClick}
                >
                  <img className="w-4 h-4" src={PlusIcon} alt="plus-icon" />
                  <p className="text-[#1DAEDE] hidden sm:block">
                    {" "}
                    {translate("New", selectedLanguage)}
                  </p>
                  <img
                    className="w-4 h-4"
                    src={DropDownArrow}
                    alt="dropdown-icon"
                  />
                </div>

                {/* The New Button DropDown */}
                {newDropdownVisible && (
                  <div
                    ref={newDropDownRef}
                    className="sm:left-[-95px]  top-[40px] z-10 absolute right-0 mt-2 origin-top-right bg-white border border-[#1DAEDE] rounded-md shadow-lg w-[230px]"
                  >
                    <div
                      onClick={handleUploadClick}
                      className="cursor-pointer flex items-center px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] gap-4 "
                    >
                      <img
                        src={UploadFileIcon}
                        className="w-5 h-5 mr-2"
                        alt="Upload File"
                      />
                      <p> {translate("Upload File", selectedLanguage)}</p>
                    </div>

                    {/* Hidden file input for upload file*/}
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf,.docx" // Restrict to .pdf and .docx files
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />

                    {/* Create New Folder */}
                    <div
                      onClick={handleCreateNewFolderClick}
                      className="cursor-pointer flex items-center px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] gap-4 "
                    >
                      <img
                        src={NewFolderIcon}
                        className="w-5 h-5 mr-2"
                        alt="Create New Folder"
                      />
                      <p> {translate("Create New Folder", selectedLanguage)}</p>
                    </div>

                    {/* Create New Category */}
                    <div
                      onClick={handleCreateNewCategoryClick}
                      className="cursor-pointer flex items-center px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] gap-4"
                    >
                      <img
                        src={NewCategoriesIcon}
                        className="w-5 h-5 mr-2"
                        alt="Create New Category"
                      />
                      <p>
                        {" "}
                        {translate("Create New Category", selectedLanguage)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main div containing the tabs render Content */}
            <div className="flex flex-col gap-14">
              {/* Tabs */}
              <div className="text-sm font-medium text-center text-gray-500 border-b-2  dark:text-gray-400   ">
                <div className=" sm:border-gray-200">
                  {/* Tabs for larger screens */}
                  <ul className="flex sm:flex-wrap -mb-px justify-evenly sm:justify-normal">
                    {tabs.map((tab, index) => (
                      <li
                        onClick={() => handleTabClick(index)}
                        key={index}
                        className=" cursor-pointer"
                      >
                        <div
                          className={`${
                            activeTab === index
                              ? "text-[#1DAEDE] border-b-[#1DAEDE]"
                              : ""
                          } inline-block sm:px-4 sm:py-2 p-2 text-[16px] font-poppins border-b-2 border-transparent font-bold rounded-t-lg hover:text-gray-400`}
                        >
                          {translate(tab, selectedLanguage)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Render Content Based on Active Tab */}
              {renderContent()}
            </div>
          </>
        )}
      </div>

      {/* Upload File Popup */}
      <UploadFilePopup
        isOpen={isUploadPopupOpen}
        onClose={() => setUploadPopupOpen(false)}
        onFileRemove={handleFileRemove}
        file={selectedFile}
        permissionsPopupRef={permissionsPopupRef}
      />

      {/* Popup for creating new Folder and category */}
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

      {/* Popup For Add To folder */}
      <AddToFolderPopup
        isOpen={openAddToFolderPopUp}
        onClose={() => setOpenAddToFolderPopup(false)}
        selectedSearchRowData={selectedSearchRowData}
        folderOrCategoryAdded={folderOrCategoryAdded}
        setFolderOrCategoryAdded={setFolderOrCategoryAdded}
        setUpdateData={setUpdateData}
        updateData={updateData}
      />

      {/* Popup for QR Code */}
      <QrPopup isOpen={openQRpopUp} onClose={() => setOpenQRpopUp(false)} />
    </div>
  );
}

export default Dashboard;

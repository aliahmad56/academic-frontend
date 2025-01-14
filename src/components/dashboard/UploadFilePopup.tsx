import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Dropdown from "./UploadPopupComponents/Dropdown";

import * as yup from "yup";
import { Formik } from "formik";

import AxiosInterceptor from "../../AxiosInterceptor";
import { selectLanguage } from "../../redux/languageSlice";
import { translate } from "../../utils/i18n";

import { removeLoading, setLoading } from "../../redux/loadingSlice";
import { addUpload, updateUpload } from "../../redux/uploadSlice";
import { selectAuth, updateUsedStorage } from "../../redux/authSlice";
import {
  addSpecificUpload,
  updateSpecificUpload,
} from "../../redux/specificUploadSlice";

import FilesIcon from "../../assets/icons/files.svg";
import BlackFilesIcon from "../../assets/icons/black_files.svg";
import RedCrossCloseIcon from "../../assets/icons/RedCrossClose.svg";
import RedCrossIcon from "../../assets/icons/RedCross.svg";
import UserIcon from "../../assets/icons/user.svg";
import CalendarIcon from "../../assets/icons/calender.svg";
import CopyRightIcon from "../../assets/icons/copy_rights.svg";
import DownloadIcon from "../../assets/icons/download.svg";
import PrivateIcon from "../../assets/icons/private.svg";

const currentYear = new Date().getFullYear();

const optionsCopyRight = [
  {
    label: "Unique intellectual product",
    value: "Unique intellectual product",
  },
  {
    label: "Shared intellectual property",
    value: "Shared intellectual property",
  },
  {
    label: "Institution-owned intellectual property",
    value: "institution-owned intellectual property",
  },
];

const optionsDownloadPermissions = [
  { label: "Free", value: "Free" },
  { label: "Applied Via email", value: "Applied Via email" },
  {
    label: "Download from the institutions website",
    value: "Download from the institutions website",
  },
];

const optionsPermissions = [
  { label: "Public", value: "Public" },
  { label: "Private", value: "Private" },
  { label: "Shared", value: "Shared" },
];

const dataSchema = (selectedLanguage: string) =>
  yup.object().shape({
    author_name: yup
      .string()
      .required(translate("Author name is required", selectedLanguage)),
    publication_year: yup
      .number()
      .typeError(
        translate("Publication Year must be a number", selectedLanguage)
      )
      .required(translate("Publication Year is required", selectedLanguage))
      .min(
        1900,
        translate("Publication Year cannot be before 1900", selectedLanguage)
      )
      .max(
        currentYear,
        translate("Publication Year cannot be later than", selectedLanguage) +
          ` ${currentYear}`
      )
      .integer(
        translate("Publication Year must be an integer", selectedLanguage)
      ),
    copy_rights_license_type: yup
      .string()
      .required(translate("Copy Rights license is required", selectedLanguage)),
    download_permissions: yup
      .string()
      .required(translate("Download Permission is required", selectedLanguage)),
    permissions: yup
      .string()
      .required(translate("Permission is required", selectedLanguage)),
  });

interface UploadFilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onFileRemove?: () => void;
  file?: File | null;
  dataRow?: any;
  setSpecificUploads?: any;
  setUploads?: any;
  permissionsPopupRef: any;
}

const UploadFilePopup: React.FC<UploadFilePopupProps> = ({
  isOpen,
  onClose,
  file,
  onFileRemove,
  dataRow,
  permissionsPopupRef,
}) => {
  const [visibility, setVisibility] = useState(
    dataRow?.searchVisibility || false
  );

  const dispatch = useDispatch();
  const user = useSelector(selectAuth);
  const selectedLanguage = useSelector(selectLanguage);

  const handleFileSubmission = (submissionData: any) => {
    dispatch(setLoading());

    const {
      author_name,
      publication_year,
      copy_rights_license_type,
      download_permissions,
      permissions,
      file,
      title,
      visibility,
    } = submissionData;

    const fileSubmissionData: any = {
      authorName: author_name,
      publicationYear: publication_year,
      copyRightType: copy_rights_license_type,
      downloadPermission: download_permissions,
      permission: permissions,
      searchVisibility: visibility,
      file: file,
    };

    if (!dataRow) {
      fileSubmissionData.title = title;
    } else {
      fileSubmissionData.fileId = dataRow._id;
    }

    const apiEndpoint = dataRow ? "/user/update-file" : "/user/upload-file";
    const requestMethod = dataRow ? "put" : "post";

    AxiosInterceptor.SECURE_API[requestMethod](
      apiEndpoint,
      fileSubmissionData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
      .then((response) => {
        if (response?.data?.status === true) {
          if (!dataRow) {
            const newFile = {
              ...fileSubmissionData,
              fileName: file?.name,
              _id: response.data.file._id || dataRow._id,
              ...response.data.file,
            };

            dispatch(addUpload(newFile));
            dispatch(addSpecificUpload(newFile));
          } else {
            const newFile = {
              ...dataRow,
              ...fileSubmissionData,
              ...response.data.file,
            };

            dispatch(updateUpload(newFile));
            dispatch(updateSpecificUpload(newFile));
          }

          if (file) {
            const updatedUsedStorage =
              (user?.userProfile?.usedStorage || 0) + file.size;
            dispatch(updateUsedStorage(updatedUsedStorage));
          }

          toast.success(
            dataRow
              ? translate("File updated successfully", selectedLanguage)
              : translate("File uploaded successfully", selectedLanguage)
          );
          dispatch(removeLoading());
          onClose();
        } else {
          dispatch(removeLoading());
          toast.error(translate("Failed to update", selectedLanguage));
          onClose();
        }
      })
      .catch((error) => {
        console.error("Error:", error);

        if (error?.response?.status === 401) {
          toast.error(
            translate(
              "Guest user restriction, please login with an actual email",
              selectedLanguage
            )
          );
        } else {
          toast.error(translate("Something went wrong", selectedLanguage));
        }

        dispatch(removeLoading());
        onClose();
      });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      ref={permissionsPopupRef}
    >
      <div
        className={`bg-white rounded-lg shadow-lg sm:p-6 p-4 relative lg:w-[845px] sm:w-[600px] w-[300px] flex flex-col ${
          file ? "sm:gap-[2rem] gap-[0.3rem]" : "gap-[1rem]"
        }`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-[32px] font-semibold text-gray-500 font-poppins ">
            {translate(file ? "Upload File" : "Permissions", selectedLanguage)}
          </h2>

          <img
            onClick={onClose}
            src={RedCrossCloseIcon}
            className="absolute right-[-20px] top-[-20px] cursor-pointer"
          />
        </div>
        <div className="flex justify-between">
          {file ? (
            <div className="my-4 flex items-center">
              <img src={FilesIcon} alt="File Icon" className="w-6 h-6 mr-2" />
              <p>{file.name}</p>
            </div>
          ) : (
            <div className="bg-[#8282820D] w-auto h-[80px] flex items-center p-2 my-2  rounded-md flex-col justify-center gap-4">
              <img src={FilesIcon} className="w-5 h-5 mr-2" alt="file-icon" />
              <h3 className="font-poppins text-[#484848] text-sm text-center">
                {dataRow?.fileName}
              </h3>
            </div>
          )}
          {file && (
            <img
              onClick={onFileRemove}
              src={RedCrossIcon}
              className="cursor-pointer"
            />
          )}
        </div>

        {file && <div className="border-gray-500 border-t-[1px] w-full " />}

        <div className="flex items-center mb-4">
          <div className="flex flex-col gap-2 sm:w-full w-[75%]">
            <p className="sm:text-xl text-[1rem] text-gray-600 font-semibold font-poppins">
              {translate("Manage Search Visibility", selectedLanguage)}
            </p>
            <p className="sm:text-sm text-[12px] text-gray-600">
              {translate(
                "You can decide which of your uploaded files can be found through search.",
                selectedLanguage
              )}
            </p>
          </div>
          <label className="switch ml-auto">
            <input
              type="checkbox"
              checked={visibility}
              onChange={(e) => setVisibility(e.target.checked)}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <Formik
          initialValues={{
            author_name: dataRow?.authorName || "",
            publication_year: dataRow?.publicationYear || "",
            copy_rights_license_type: dataRow?.copyRightType || "",
            download_permissions: dataRow?.downloadPermission || "",
            permissions: dataRow?.permission || "",
            visibility: dataRow?.searchVisibility || false,
            title: dataRow?.title || "",
          }}
          validationSchema={dataSchema(selectedLanguage)}
          validateOnBlur={true}
          validateOnChange={true}
          onSubmit={(values) => {
            const data = { ...values, visibility, file };
            handleFileSubmission(data);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-4">
                {/* Author Name */}
                <div className="flex flex-col gap-2">
                  <label className="font-poppins font-[400] text-[16px]">
                    {translate("Author Name", selectedLanguage)}
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md h-12 m-0">
                    <img
                      className="w-6 h-6 ml-3"
                      src={UserIcon}
                      alt="user-icon"
                    />
                    <input
                      id="author_name"
                      name="author_name"
                      type="text"
                      className="w-full outline-none border-none px-3 py-2 text-sm"
                      placeholder={translate("Name", selectedLanguage)}
                      value={values.author_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                  {errors.author_name && touched.author_name && (
                    <p className="text-red-700 text-sm">
                      {/* @ts-ignore */}
                      {errors?.author_name}
                    </p>
                  )}
                </div>
                {/* Publication Year */}
                <div className="flex flex-col gap-2">
                  <label className="font-poppins font-[400] text-[16px]">
                    {translate("Publication Year", selectedLanguage)}
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md h-12">
                    <img
                      className="w-6 h-6 ml-3"
                      src={CalendarIcon}
                      alt="calendar-icon"
                    />
                    <input
                      id="publication_year"
                      name="publication_year"
                      type="number"
                      className="w-full outline-none border-none px-3 py-2 text-sm"
                      placeholder={translate("Year", selectedLanguage)}
                      value={values.publication_year}
                      onChange={handleChange}
                      min="1900"
                      max={currentYear.toString()}
                      step="1"
                      onInput={(e: any) => {
                        if (e.target.value.length > 4) {
                          e.target.value = e.target.value.slice(0, 4);
                        }
                      }}
                    />
                  </div>
                  {errors.publication_year && (
                    <p className="text-red-700 text-sm">
                      {/* @ts-ignore */}
                      {errors.publication_year}
                    </p>
                  )}
                </div>

                {/* Copy Rights */}
                <Dropdown
                  label={translate("Copyright License Type", selectedLanguage)}
                  icon={CopyRightIcon}
                  name="copy_rights_license_type"
                  value={values.copy_rights_license_type}
                  options={optionsCopyRight.map((option) => ({
                    ...option,
                    label: translate(option.label, selectedLanguage),
                  }))}
                  onChange={handleChange}
                  //@ts-ignore
                  error={errors.copy_rights_license_type}
                />
                {/* Download Permissions */}
                <Dropdown
                  label={translate("Download Permissions", selectedLanguage)}
                  icon={DownloadIcon}
                  name="download_permissions"
                  value={values.download_permissions}
                  options={optionsDownloadPermissions.map((option) => ({
                    ...option,
                    label: translate(option.label, selectedLanguage),
                  }))}
                  onChange={handleChange}
                  error={errors.download_permissions}
                />
                {/* Permissions */}
                <Dropdown
                  label={translate("Permissions", selectedLanguage)}
                  icon={PrivateIcon}
                  name="permissions"
                  value={values.permissions}
                  options={optionsPermissions.map((option) => ({
                    ...option,
                    label: translate(option.label, selectedLanguage),
                  }))}
                  onChange={handleChange}
                  error={errors.permissions}
                />
                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label className="font-poppins font-[400] text-[16px]">
                    {translate("Title", selectedLanguage)}
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md h-12">
                    <img
                      className="w-6 h-6 ml-3"
                      src={BlackFilesIcon}
                      alt="file-icon"
                    />
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className="w-full outline-none border-none px-3 py-2 text-sm"
                      placeholder={translate("Title", selectedLanguage)}
                      value={values.title}
                      disabled={!!dataRow}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.title && (
                    //@ts-ignore
                    <p className="text-red-700 text-sm">{errors.title}</p>
                  )}
                </div>
              </div>
              <div className="flex justify-end ">
                <button
                  type="submit"
                  className="w-[30%] bg-[#1DAEDE]  cursor-pointer flex items-center justify-center rounded-md h-12 hover:bg-[#2ca3ca]"
                >
                  <p className="text-white">
                    {translate("Upload", selectedLanguage)}
                  </p>
                </button>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UploadFilePopup;

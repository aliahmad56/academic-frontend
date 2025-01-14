import React from "react";
import { useSelector } from "react-redux";

import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { selectLanguage } from "../../redux/languageSlice";
import { translate } from "../../utils/i18n";

import RedCrossCloseIcon from "../../assets/icons/RedCrossClose.svg";
interface RenamePopupProps {
  isOpen: boolean;
  onClose: () => void;
  dataRow?: any;
  renamePopupRef: any;
  handleRename: (dataRow: any, newName: string, type: string) => void;
}

const RenamePopup: React.FC<RenamePopupProps> = ({
  isOpen,
  onClose,
  dataRow,
  handleRename,
  renamePopupRef,
}) => {
  const selectedLanguage = useSelector(selectLanguage);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be at most 50 characters long"),
  });

  const handleSubmit = (
    values: { name: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    handleRename(dataRow?._id, values.name, dataRow?.type);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={renamePopupRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white rounded-lg shadow-lg sm:p-6 p-4 relative lg:w-[845px] sm:w-[600px] w-[320px] flex flex-col gap-[2rem]">
        <div className="flex justify-between items-center">
          <img
            onClick={onClose}
            src={RedCrossCloseIcon}
            className="absolute right-[-20px] top-[-20px] cursor-pointer"
            alt="Close"
          />
          <div className="text-black font-semibold font-poppins text-2xl">
            {translate("Rename", selectedLanguage)}
          </div>
        </div>

        <Formik
          initialValues={{
            name: dataRow?.folderName || dataRow?.fileName || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, values }) => (
            <Form className="flex gap-5 w-full flex-col sm:flex-row">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center border border-gray-300 rounded-md h-12 w-full">
                  <Field
                    id="name"
                    name="name"
                    type="text"
                    className="w-full outline-none border-none px-3 py-2"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                </div>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-700 text-sm"
                />
              </div>

              <div className="w-full flex items-center gap-3 sm:w-auto">
                <button
                  type="submit"
                  className="sm:w-[165px] h-[48px] flex items-center cursor-pointer justify-center border rounded-md bg-[#1DAEDE] w-full text-white"
                >
                  {translate("Rename", selectedLanguage)}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RenamePopup;

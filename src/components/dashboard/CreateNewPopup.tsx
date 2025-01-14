import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import { selectLanguage } from "../../redux/languageSlice";
import { translate } from "../../utils/i18n";

import RedCrossCloseIcon from "../../assets/icons/RedCrossClose.svg";
interface CreateNewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  title: string;
}
const validationSchema = (selectedLanguage: string) =>
  Yup.object().shape({
    folderName: Yup.string()
      .trim()
      .required(translate("Name is required", selectedLanguage)) // Translated required message
      .min(
        3,
        translate("Name must be at least 3 characters long", selectedLanguage)
      ) // Translated min message
      .max(
        50,
        translate("Name must be at most 50 characters long", selectedLanguage)
      ), // Translated max message
  });

const CreateNewPopup: React.FC<CreateNewPopupProps> = ({
  isOpen,
  onClose,
  onCreate,
  title,
}) => {
  const selectedLanguage = useSelector(selectLanguage);

  const handleSubmit = (
    values: { folderName: string },
    { resetForm }: { resetForm: () => void }
  ) => {
    onCreate(values.folderName);
    resetForm();

    // We have already defiend the setLoading slice to set the state to true without passing any parameter.
  };

  if (!isOpen) return null;

  return (
    <div className=" fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg sm:p-6 p-4 relative lg:w-[845px] sm:w-[600px] w-[320px] flex flex-col gap-[2rem]">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <img
            onClick={onClose}
            src={RedCrossCloseIcon}
            className="absolute right-[-20px] top-[-20px] cursor-pointer"
            alt="Close"
          />
        </div>

        <Formik
          initialValues={{ folderName: "" }}
          validationSchema={validationSchema(selectedLanguage)} // Pass the schema with updated language
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, values, validateForm }) => {
            // Re-run validation on language change
            useEffect(() => {
              validateForm(); // Trigger form validation when language changes
            }, [selectedLanguage]);

            return (
              <Form className="flex gap-5 w-full flex-col sm:flex-row">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center border border-gray-300 rounded-md h-12 w-full">
                    <Field
                      id="folderName"
                      name="folderName"
                      type="text"
                      className="w-full outline-none border-none px-3 py-2"
                      placeholder={translate("Name", selectedLanguage)} // Translate placeholder
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.folderName}
                    />
                  </div>
                  <ErrorMessage
                    name="folderName"
                    component="div"
                    className="text-red-700 text-sm"
                  />
                </div>

                <div className="w-full flex items-center gap-3 sm:w-auto">
                  <button
                    type="submit"
                    className="sm:w-[165px] h-[48px] flex items-center cursor-pointer justify-center border rounded-md bg-[#1DAEDE] w-full text-white"
                  >
                    {translate("Create", selectedLanguage)}{" "}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default CreateNewPopup;

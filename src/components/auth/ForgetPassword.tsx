import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import * as yup from "yup";
import { Formik } from "formik";

import AxiosInterceptor from "../../AxiosInterceptor";
import Loader from "../common/Loader";
import { translate } from "../../utils/i18n";
import { selectLanguage } from "../../redux/languageSlice";
import { selectLoading } from "../../redux/loadingSlice";
import LanguageDropdown from "../layout/LanguageDropDown";

import Logo from "../../assets/images/logo.png";
import Logo1 from "../../assets/icons/logo1.svg";
import EmailIcon from "../../assets/icons/email.svg";

interface dataTypes {
  email: string;
}

const data: dataTypes = {
  email: "",
};

const dataSchema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("Email is required*"),
});

function ForgetPassword() {
  const navigate = useNavigate();
  const selectedLanguage = useSelector(selectLanguage); // Get the selected language from Redux
  const loaderState = useSelector(selectLoading);
  const loading: boolean = loaderState?.loading || false; // Get the loading state for language change
  const [redirectLoading, setRedirectLoading] = useState(false);

  const handleResetPasswordButtonClick = (data: any) => {
    localStorage.setItem("forgot-email", data?.email);
    setRedirectLoading(true); // Start loading
    AxiosInterceptor.Api.post("/user/forgetpassword", data)
      .then(() => {
        toast.success(translate("OTP sent successfully", selectedLanguage));
        setTimeout(() => {
          navigate("/otp");
          setRedirectLoading(false);
        }, 2000);
      })
      .catch(() => {
        toast.error(translate("Error sending OTP", selectedLanguage));
        // toast.error(error?.response?.data?.message);
        setRedirectLoading(false);
      });
  };

  return (
    <div>
      {redirectLoading && <Loader />}
      {loading && <Loader />} {/* Show loader when language is changing */}
      <div className="min-h-screen flex xl:flex-row">
        <div className="w-full hidden xl:w-1/2 bg-custom-gradient md:flex items-center justify-center">
          <div className="flex flex-col items-center justify-center">
            <img className="w-72 h-72" src={Logo} alt="Logo" />
            <div className="py-4 text-center">
              <p className="font-poppins text-white text-2xl font-semibold">
                {translate("Welcome Back My Friend!", selectedLanguage)}
              </p>
              <p className="font-poppins text-lg font-normal text-white">
                {translate("Continue where you left off.", selectedLanguage)}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full xl:w-1/2 flex flex-col items-center justify-center py-8 px-4 md:px-8 lg:px-16">
          <div className="flex w-full justify-end">
            <LanguageDropdown /> {/* Language dropdown at the top */}
          </div>
          <Formik
            initialValues={data}
            validationSchema={dataSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={(values) => {
              const data = { ...values };
              handleResetPasswordButtonClick(data);
            }}
          >
            {({ values, errors, handleChange, handleSubmit }) => (
              <div className="flex flex-col items-center justify-center w-full">
                <div>
                  <img src={Logo1} alt="logo" />
                </div>
                <div className="flex flex-col text-center justify-center py-4">
                  <p className="text-gray-800 text-2xl font-medium font-poppins">
                    {translate("Forget Password", selectedLanguage)}
                  </p>
                  <p className="text-gray-600 font-poppins py-2 text-base font-normal">
                    {translate(
                      "No worries, we will send you reset instructions",
                      selectedLanguage
                    )}
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <form className="flex flex-col gap-4">
                    <div className="flex items-center border border-gray-300 rounded-md h-12">
                      <img
                        className="w-6 h-6 ml-3"
                        src={EmailIcon}
                        alt="email-icon"
                      />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="w-full outline-none border-none px-3 py-2"
                        placeholder={translate("Email", selectedLanguage)}
                        value={values.email}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-700 text-sm ">{errors.email}</p>
                    )}

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          handleSubmit();
                          e.preventDefault();
                        }}
                        className="bg-[#1DAEDE] w-full cursor-pointer flex items-center justify-center rounded-md h-12"
                      >
                        <p className="text-white">
                          {translate("Reset Password", selectedLanguage)}
                        </p>
                      </button>
                    </div>
                  </form>

                  <div className="pt-8 ">
                    <div
                      onClick={() => navigate("/login")}
                      className="flex items-center gap-3 justify-center cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                        />
                      </svg>

                      <p className="text-[#484848] text-[14px] font-poppins font-[400] ">
                        {translate("Back to Login", selectedLanguage)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;

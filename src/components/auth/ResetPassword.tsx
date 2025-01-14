import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import * as yup from "yup";
import { Formik } from "formik";

import AxiosInterceptor from "../../AxiosInterceptor";
import Loader from "../common/Loader";
import { selectLanguage } from "../../redux/languageSlice";
import { selectLoading } from "../../redux/loadingSlice";
import LanguageDropdown from "../layout/LanguageDropDown";
import { translate } from "../../utils/i18n";

import Logo from "../../assets/images/logo.png";
import Logo1 from "../../assets/icons/logo1.svg";
import LockIcon from "../../assets/icons/lock.svg";

interface dataTypes {
  cpassword: string;
  password: string;
}

const data: dataTypes = {
  cpassword: "",
  password: "",
};

const dataSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/,
      "Password must contain at least one capital letter, one special character, and one number"
    )
    .required("Password is required*"),
  cpassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required*"),
});

function ResetPassword() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [cshowPassword, setCShowPassword] = useState<boolean>(false);
  const [redirectLoading, setRedirectLoading] = useState(false);

  const selectedLanguage = useSelector(selectLanguage); // Get selected language from Redux
  const loaderState = useSelector(selectLoading); // Get loading state from Redux
  const loading: boolean = loaderState?.loading || false; // Handle loading state

  const handleResetPasswordButtonClick = (data: any) => {
    const modifiedData = {
      password: data.password,
      otp: localStorage.getItem("forgot-OTP"),
    };

    localStorage.setItem("forgot-email", data?.email);
    setRedirectLoading(true); // Start loading
    AxiosInterceptor.SECURE_API.post("/user/resetpassword", modifiedData)
      .then(() => {
        toast.success(
          translate("Password changed successfully", selectedLanguage)
        );
        setTimeout(() => {
          navigate("/login");
          setRedirectLoading(false); // Stop loading
        }, 2000);
      })
      .catch(() => {
        // toast.error(
        //   translate(error?.response?.data?.message, selectedLanguage)
        // );
        toast.error(translate("Failed to change password", selectedLanguage));
        setRedirectLoading(false); // Stop loading
      });
  };

  return (
    <>
      {redirectLoading && <Loader />}
      {loading && <Loader />}

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
            <LanguageDropdown /> {/* Add Language Dropdown */}
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
                    {translate("Set New Password", selectedLanguage)}
                  </p>
                  <p className="text-gray-600 font-poppins py-2 text-base font-normal">
                    {translate(
                      "Must be at least 8 characters",
                      selectedLanguage
                    )}
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <form className="flex flex-col gap-4">
                    <div className="flex items-center border border-gray-300 rounded-md h-12 px-3">
                      <img className="w-6 h-6" src={LockIcon} alt="lock-icon" />
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="w-full outline-none border-none px-3 py-2"
                        placeholder={translate("Password", selectedLanguage)}
                        value={values.password}
                        onChange={handleChange}
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="cursor-pointer"
                      >
                        {showPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {errors.password && (
                      <p className="text-red-700 text-sm ">{errors.password}</p>
                    )}
                    <div className="flex items-center border border-gray-300 rounded-md h-12 px-3">
                      <img className="w-6 h-6" src={LockIcon} alt="lock-icon" />
                      <input
                        id="cpassword"
                        name="cpassword"
                        type={cshowPassword ? "text" : "password"}
                        className="w-full outline-none border-none px-3 py-2"
                        placeholder={translate(
                          "Confirm Password",
                          selectedLanguage
                        )}
                        value={values.cpassword}
                        onChange={handleChange}
                      />
                      <div
                        onClick={() => setCShowPassword(!cshowPassword)}
                        className="cursor-pointer"
                      >
                        {cshowPassword ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {errors.cpassword && (
                      <p className="text-red-700 text-sm ">
                        {errors.cpassword}
                      </p>
                    )}

                    <div className="pt-8">
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

                  <div className="py-2">
                    <div
                      onClick={() => navigate("/login")}
                      className=" flex items-center gap-3 justify-center cursor-pointer"
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
                          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                        />
                      </svg>

                      <p className="text-[#484848] text-[14px] font-poppins font-[400]">
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
    </>
  );
}

export default ResetPassword;

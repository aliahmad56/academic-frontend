import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google"; // Import the Google login hook

import * as yup from "yup";
import { Formik } from "formik";

import AxiosInterceptor from "../../AxiosInterceptor";
import Loader from "../common/Loader";
import { login } from "../../redux/authSlice"; // Import the login action
import { setLanguage, selectLanguage } from "../../redux/languageSlice"; // Import language actions
import { translate } from "../../utils/i18n";
import LanguageDropdown from "../layout/LanguageDropDown";
import { selectLoading } from "../../redux/loadingSlice";

import { FaStaylinked } from "react-icons/fa6";
import Logo from "../../assets/images/logo.png";
import Logo1 from "../../assets/icons/logo1.svg";
import EmailIcon from "../../assets/icons/email.svg";
import LockIcon from "../../assets/icons/lock.svg";
import DownIcon from "../../assets/icons/down.svg";
import GoogleIcon from "../../assets/icons/Google.svg";
import WeChatIcon from "../../assets/icons/Wechat.svg";
import UserIcon from "../../assets/icons/user.svg";

interface dataTypes {
  name: string;
  email: string;
  password: string;
  availReferralCode?: string;
}

const data: dataTypes = {
  name: "",
  email: "",
  password: "",
  availReferralCode: "",
};

const dataSchema = yup.object().shape({
  name: yup
    .string()
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .required("Name is required*"),
  password: yup
    .string()
    .matches(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/,
      "Password must contain at least one capital letter, one special character, and one number"
    )
    .required("Password is required*"),
  email: yup
    .string()
    .email("Invalid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("Email is required*"),
});

function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCodeFromParams = searchParams.get("referralCode");

  const dispatch = useDispatch();
  const selectedLanguage = useSelector(selectLanguage); // Get selected language
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [redirectLoading, setRedirectLoading] = useState(false);

  const loaderState = useSelector(selectLoading);
  const loading: boolean = loaderState?.loading || false;

  const [showReferralField, setShowReferralField] = useState<boolean>(false);

  useEffect(() => {
    setShowReferralField(!!referralCodeFromParams);
  }, [referralCodeFromParams]);

  const handleDropdownClick = () => {
    if (isOpen) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      setIsOpen(true);
    }
  };

  const handleSignUpFormSubmit = (formData: any) => {
    const { availReferralCode, ...rest } = formData;

    const data = referralCodeFromParams ? { availReferralCode, ...rest } : rest;

    AxiosInterceptor.Api.post("/user/signup", data)
      .then(() => {
        toast.success(translate("Sign up successful", selectedLanguage));
        setRedirectLoading(false);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error:", error?.response?.data?.message);
        setRedirectLoading(false);
        toast.error(translate("Sign up failed", selectedLanguage));
      });
  };

  // Google Sign-In logic for Sign-Up
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setRedirectLoading(true);
      AxiosInterceptor.Api.post("/user/auth/google/callback", {
        accessToken: tokenResponse.access_token,
      })
        .then((response) => {
          const { name, email } = response.data.userData;
          const token = response.data.accessToken;

          // Dispatch the login action to populate the Redux store
          dispatch(
            login({
              name,
              email,
              accessToken: token,
              isGuest: false,
              userProfile: response.data.userData, // Entire user profile data
            })
          );
          dispatch(setLanguage("English"));

          toast.success(translate("Sign in successful", selectedLanguage));

          // Store the token in local storage for maintaining session when refreshed
          localStorage.setItem("token", token);
          localStorage.setItem("isGuest", "false");

          setTimeout(() => {
            navigate("/");
            setRedirectLoading(false);
          }, 2000);
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error(translate("Sign up failed", selectedLanguage));
          setRedirectLoading(false);
        });
    },
    onError: (errorResponse) => {
      console.error("Google Sign Up Error:", errorResponse);
      toast.error(translate("Google Sign Up Failed", selectedLanguage));
    },
  });

  return (
    <div>
      {redirectLoading && <Loader />}
      {loading && <Loader />}

      <div className="min-h-screen flex  xl:flex-row">
        <div className="w-full hidden xl:w-1/2 bg-custom-gradient  md:flex items-center justify-center">
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
            <LanguageDropdown />
          </div>
          <Formik
            initialValues={{
              ...data,
              availReferralCode: referralCodeFromParams || "",
            }}
            validationSchema={dataSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={(values) => {
              const data = { ...values };
              setRedirectLoading(true);
              handleSignUpFormSubmit(data);
            }}
          >
            {({ values, errors, handleChange, handleSubmit }) => (
              <div className="flex flex-col items-center justify-center w-full">
                <div>
                  <img src={Logo1} alt="logo" />
                </div>
                <div className="flex flex-col text-center justify-center py-4">
                  <p className="text-gray-800 text-2xl font-medium font-poppins">
                    {translate("Sign Up", selectedLanguage)}
                  </p>
                  <p className="text-gray-600 font-poppins py-2 text-base font-normal">
                    {translate(
                      "Enter the following credentials to log in to your account.",
                      selectedLanguage
                    )}
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <form className="flex flex-col gap-4">
                    <div className="flex items-center border border-gray-300 rounded-md h-12">
                      <img
                        className="w-6 h-6 ml-3"
                        src={UserIcon}
                        alt="user-icon"
                      />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="w-full outline-none border-none px-3 py-2"
                        placeholder={translate("Name", selectedLanguage)}
                        value={values.name}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-700 text-sm ">{errors.name}</p>
                    )}
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

                    {/* Conditional Referral input */}
                    {showReferralField && (
                      <div className="flex items-center border border-gray-300 rounded-md h-12">
                        <FaStaylinked className="w-6 h-6 ml-3" />
                        <input
                          id="availReferralCode"
                          name="availReferralCode"
                          type="number"
                          className="w-full outline-none border-none px-3 py-2"
                          placeholder={translate(
                            "Referral Code",
                            selectedLanguage
                          )}
                          value={values.availReferralCode}
                          onChange={handleChange}
                        />
                      </div>
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
                          {translate("Sign Up", selectedLanguage)}
                        </p>
                      </button>
                    </div>
                  </form>
                  <div className="flex items-center justify-center mt-4">
                    <div className="border-b border-gray-300 w-16" />
                    <p className="px-2 text-gray-600 text-base font-poppins">
                      {translate("Or", selectedLanguage)}
                    </p>
                    <div className="border-b border-gray-300 w-16" />
                  </div>
                  <div className="mt-4">
                    <p className="text-gray-800 text-base font-poppins font-normal">
                      {translate("Sign up options", selectedLanguage)}
                    </p>
                    <div className="relative w-full">
                      <div
                        onClick={handleDropdownClick}
                        className="flex items-center cursor-pointer justify-between mt-4 border border-gray-300 rounded-md h-12 px-4"
                      >
                        <p className="text-gray-600 font-poppins text-sm font-normal">
                          {translate("Select", selectedLanguage)}
                        </p>
                        <img src={DownIcon} alt="Dropdown Icon" />
                      </div>
                      {(isOpen || isAnimating) && (
                        <div
                          className={`absolute bg-white top-[40px] py-2 z-50 flex flex-col cursor-pointer justify-between border border-t-0 border-gray-300 rounded-b-md h-20 w-full ${
                            isOpen ? "animate-slideDown" : "animate-slideUp"
                          }`}
                        >
                          <div
                            onClick={() => googleLogin()}
                            className="py-1 flex items-center cursor-pointer gap-2 px-4 hover:bg-custom-light-blue"
                          >
                            <img src={GoogleIcon} alt="Google" />
                            <p className="text-sm text-gray-600 font-normal">
                              {translate("Google", selectedLanguage)}
                            </p>
                          </div>
                          <div className="py-1 flex items-center cursor-pointer gap-2 px-4 hover:bg-custom-light-blue">
                            <img src={WeChatIcon} alt="WeChat" />
                            <p className="text-sm text-gray-600 font-normal">
                              {translate("WeChat", selectedLanguage)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={isOpen ? `pt-24` : "pt-12"}>
                      <p className="text-center text-gray-800 text-base font-poppins">
                        {translate(
                          "Already have an account?",
                          selectedLanguage
                        )}
                      </p>
                      <div className="py-4">
                        <button
                          onClick={() => navigate("/login")}
                          className="border border-[#1DAEDE] w-full cursor-pointer flex items-center justify-center rounded-md h-12"
                        >
                          <p className="text-[#1DAEDE] font-poppins">
                            {translate("Log in", selectedLanguage)}
                          </p>
                        </button>
                      </div>
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

export default SignUp;

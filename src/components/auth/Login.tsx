import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import * as yup from "yup";
import { Formik } from "formik";

// Google imports
import { useGoogleLogin } from "@react-oauth/google";
import { selectLanguage, setLanguage } from "../../redux/languageSlice";

import { translate } from "../../utils/i18n";
import LanguageDropdown from "../layout/LanguageDropDown";
import { selectLoading } from "../../redux/loadingSlice";
import Loader from "../common/Loader";
import AxiosInterceptor from "../../AxiosInterceptor";
import { login } from "../../redux/authSlice";

import Logo from "../../assets/images/logo.png";
import Logo1 from "../../assets/icons/logo1.svg";
import EmailIcon from "../../assets/icons/email.svg";
import LockIcon from "../../assets/icons/lock.svg";
import DownIcon from "../../assets/icons/down.svg";
import GoogleIcon from "../../assets/icons/Google.svg";
import WeChatIcon from "../../assets/icons/Wechat.svg";

interface dataTypes {
  email: string;
  password: string;
}

const data: dataTypes = {
  email: "",
  password: "",
};

const dataSchema = yup.object().shape({
  password: yup.string().required("Password is required*"),
  email: yup
    .string()
    .email("Invalid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email address"
    )
    .required("Email is required*"),
});

function Login() {
  const navigate = useNavigate();

  // const auth = useSelector(selectAuth);
  // console.log('auth', auth);
  const dispatch = useDispatch();
  const selectedLanguage = useSelector(selectLanguage);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCheck, setIsCheck] = useState(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [redirectLoading, setRedirectLoading] = useState(false);
  const loaderState = useSelector(selectLoading);
  const loading: boolean = loaderState?.loading || false;

  useEffect(() => {}, [selectedLanguage]);

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

  const handleLoginFormSubmit = (data: any) => {
    setRedirectLoading(true); // Start loading

    AxiosInterceptor.SECURE_API.post("/user/login", data)
      .then((response) => {
        // console.log('Success:', response.data);
        const { name, email } = response.data.user;
        const token = response.data.accessToken;

        // Dispatch the login action to populate the Redux store
        // dispatch(
        //   login({
        //     name,
        //     email,
        //     accessToken: token,
        //     isGuest: false,
        //   })
        // );
        dispatch(
          login({
            name,
            email,
            accessToken: token,
            isGuest: false,
            userProfile: response.data.user, // Entire user profile data
          })
        );
        dispatch(setLanguage(selectedLanguage));

        // Display success toast notification

        toast.success(translate("Login successful", selectedLanguage));

        // Store the token  in local storage for mainting session when refreshed
        localStorage.setItem("token", token);
        localStorage.setItem("isGuest", "false");
        // localStorage.setItem('language', 'en');
        // localStorage.setItem('user-email', email);

        // Redirect the user after a short delay
        setTimeout(() => {
          navigate("/");
          setRedirectLoading(false); // Stop loading
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error?.response?.data?.message);
        // toast.error(error?.response?.data?.message);
        toast.error(translate("Login Failed", selectedLanguage));
        setRedirectLoading(false); // Stop loading
      });
  };

  const handleCheck = (e: any) => {
    setIsCheck(e.target.checked);
  };

  const handleGuestLogin = () => {
    setRedirectLoading(true); // Start loading

    const guestUserProfile = {
      researcher: null,
      _id: "",
      name: "guest",
      email: "guest@gmail.com",
      password: null,
      resetPasswordOtp: null,
      subscriptionId: "",
      subscriptionStatus: "",
      subscriptionPlatform: null,
      usedStorage: 0,
      storageLimit: 0,
      referralCode: "0",
      availReferralCode: "0",
    };

    dispatch(
      login({
        name: "guest",
        email: "guest@gmail.com",
        accessToken: "temptokenforguest",
        isGuest: true,
        userProfile: guestUserProfile, // Entire user profile data
      })
    );

    // dispatch(setLanguage('en'));
    localStorage.setItem("token", "temptokenforguest");
    localStorage.setItem("isGuest", "true");

    // Welcome message for the guest
    setTimeout(() => {
      toast.success(translate("Welcome Dear Guest", selectedLanguage));

      navigate("/");
      setRedirectLoading(false); // Stop loading
    }, 2000);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      // console.log('Google Login Success:', tokenResponse);
      setRedirectLoading(true);
      // Send the Google access token to your backend to handle the login
      AxiosInterceptor.Api.post("/user/auth/google/callback", {
        accessToken: tokenResponse.access_token,
      })
        .then((response) => {
          // Extract necessary data from the response
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

          dispatch(setLanguage("en"));
          // Display success toast notification
          toast.success(translate("Login successful", selectedLanguage));

          // Store the token in local storage for maintaining session when refreshed
          localStorage.setItem("token", token);
          localStorage.setItem("isGuest", "false");

          // Redirect the user after a short delay
          setTimeout(() => {
            navigate("/");
            setRedirectLoading(false); // Stop loading
          }, 2000);
        })
        .catch((error) => {
          console.error("Error:", error);
          // toast.error(error?.response?.data?.message);
          toast.error(translate("Login Failed", selectedLanguage));
          setRedirectLoading(false); // Stop loading
        });
    },
    onError: (errorResponse) => {
      console.error("Google Login Error:", errorResponse);
      toast.error(translate("Google Login Failed", selectedLanguage));
    },
  });

  return (
    <div>
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
                {translate("Continue where you left off", selectedLanguage)}
              </p>
            </div>
          </div>
        </div>
        <div className="w-full xl:w-1/2 flex flex-col items-center justify-center py-8 px-4 md:px-8 lg:px-16">
          <div className="flex w-full justify-end">
            <LanguageDropdown />
          </div>
          <Formik
            initialValues={data}
            validationSchema={dataSchema}
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={(values) => {
              const data = { ...values };
              handleLoginFormSubmit(data);
            }}
          >
            {({ values, errors, handleChange, handleSubmit }) => (
              <div className="flex flex-col items-center justify-center w-full">
                <div>
                  <img src={Logo1} alt="logo" />
                </div>
                <div className="flex flex-col text-center justify-center py-4">
                  <p className="text-gray-800 text-2xl font-medium font-poppins">
                    {translate("Log in", selectedLanguage)}
                  </p>
                  <p className="text-gray-600 font-poppins py-2 text-base font-normal">
                    {translate(
                      "Enter the following credentials to log in to your account",
                      selectedLanguage
                    )}
                  </p>
                </div>
                <div className="w-full max-w-md">
                  <form className="flex flex-col gap-4">
                    <div className="flex items-center border border-gray-300 rounded-md h-12 px-3">
                      <img
                        className="w-6 h-6"
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
                    <p
                      onClick={() => navigate("/forget-password")}
                      className="text-right text-[#1DAEDE] text-sm font-poppins font-medium cursor-pointer"
                    >
                      {translate("Forgot Password?", selectedLanguage)}
                    </p>
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isCheck}
                          onChange={handleCheck}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span>
                          {isCheck ? "Keep me logged in" : "Keep me logged in"}
                        </span>
                      </label>
                    </div>
                    <div className="pt-6">
                      <button
                        type="button"
                        onClick={(e) => {
                          handleSubmit();
                          e.preventDefault();
                        }}
                        className="bg-[#1DAEDE] w-full cursor-pointer flex items-center justify-center rounded-md h-12"
                      >
                        <p className="text-white">
                          {translate("Log in", selectedLanguage)}
                        </p>
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={handleGuestLogin}
                        className="bg-[#1dde27] w-full cursor-pointer flex items-center justify-center rounded-md h-12"
                      >
                        <p className="text-white">
                          {translate("Continue as Guest", selectedLanguage)}
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
                      {translate("Sign in options", selectedLanguage)}
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

                            {/* 
                            <GoogleLogin
                              onSuccess={(credentialResponse) => {
                                console.log(credentialResponse);
                              }}
                              onError={() => {
                                console.log('Login Failed');
                              }}
                            /> */}
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
                        {translate("Dont have an account?", selectedLanguage)}
                      </p>
                      <div className="py-4">
                        <button
                          onClick={() => navigate("/signup")}
                          className="border border-[#1DAEDE] w-full cursor-pointer flex items-center justify-center rounded-md h-12"
                        >
                          <p className="text-[#1DAEDE] font-poppins">
                            {" "}
                            {translate("Sign Up", selectedLanguage)}{" "}
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

export default Login;

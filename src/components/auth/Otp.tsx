import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OtpInput from "react-otp-input";

import AxiosInterceptor from "../../AxiosInterceptor";
import Loader from "../common/Loader";
import { translate } from "../../utils/i18n";
import { selectLanguage } from "../../redux/languageSlice";
import LanguageDropdown from "../layout/LanguageDropDown";
import { selectLoading } from "../../redux/loadingSlice";

import Logo from "../../assets/images/logo.png";
import Logo1 from "../../assets/icons/logo1.svg";

function Otp() {
  const email = localStorage.getItem("forgot-email");
  const navigate = useNavigate();
  const selectedLanguage = useSelector(selectLanguage);

  const [otp, setOtp] = useState("");
  const userRef = useRef(null);

  const [redirectLoading, setRedirectLoading] = useState(false);

  const loaderState = useSelector(selectLoading);
  const loading: boolean = loaderState?.loading || false;

  const inputStyle = {
    border: "1px solid #c3cfd9",
    marginRight: "20px",
    borderRadius: "4px",
    width: "50px",
    height: "50px",
    outlineColor: "#005085",
  };

  // const inputStyleError = {
  //   border: '1px solid #BB5727 ',
  //   margin: '7px',
  //   borderRadius: '4px',
  //   width: '40px',
  //   height: '40px',
  //   outline: 'none',
  //   color: '#BB5727',
  // };
  const containerStyle = {};

  useEffect(() => {
    const handleKeyPress = (event: any) => {
      if (event.key === "Enter") {
        if (userRef.current && otp.length === 4) {
          handleOTPverifyButtonClick(otp);
        }
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [otp]);

  const handleOTPverifyButtonClick = (otp: any) => {
    const data = {
      resetPasswordOtp: otp,
    };

    setRedirectLoading(true); // Start loading
    AxiosInterceptor.SECURE_API.post("/user/verifyotp", data)
      .then(() => {
        // console.log('Success:', response.data.message);
        // toast.success(response.data.message);
        toast.success(translate("OTP Verified", selectedLanguage));
        localStorage.setItem("forgot-OTP", data.resetPasswordOtp);
        setTimeout(() => {
          navigate("/reset-password");
          setRedirectLoading(false); // Stop loading
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error?.response?.data?.message);
        // toast.error(error?.response?.data?.message);
        toast.error(translate("OTP verification failed", selectedLanguage));
        setRedirectLoading(false); // Stop loading
      });
  };

  const handleResendOTPlinkClick = () => {
    setRedirectLoading(true); // Start loading
    const data = {
      email: localStorage.getItem("forgot-email"),
    };

    AxiosInterceptor.SECURE_API.post("/user/forgetpassword", data)
      .then(() => {
        // console.log('Success:', response.data);

        toast.success(translate("OTP RE-sent successfuly", selectedLanguage));
        setTimeout(() => {
          navigate("/otp");
          setRedirectLoading(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Error:", error?.response?.data?.message);
        // toast.error(error?.response?.data?.message);
        toast.error(translate("Failed to resend OTP", selectedLanguage));
        setRedirectLoading(false);
      });
  };

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
        <div className="w-full xl:w-1/2 flex flex-col items-center justify-center py-8">
          <div className="flex w-full justify-end mr-[4rem]">
            <LanguageDropdown />
          </div>
          <div>
            <img src={Logo1} alt="logo" />
          </div>
          <div className="flex flex-col text-center justify-center py-4">
            <p className="text-gray-800 text-2xl font-medium font-poppins">
              {translate("Password Reset", selectedLanguage)}
            </p>
            <p className="text-gray-600 font-poppins py-2 text-base font-normal">
              {translate("We have sent a code to", selectedLanguage)} {email}
            </p>
          </div>

          <div ref={userRef} className="py-4">
            <OtpInput
              containerStyle={containerStyle}
              inputStyle={inputStyle}
              value={otp}
              onChange={setOtp}
              numInputs={4}
              inputType="number"
              renderInput={(props) => <input {...props} />}
            />
          </div>
          <div className="pt-6">
            <button
              type="button"
              onClick={(e) => {
                handleOTPverifyButtonClick(otp);
                e.preventDefault();
              }}
              className="bg-[#1DAEDE] w-[350px] cursor-pointer flex items-center justify-center rounded-md h-12"
            >
              <p className="text-white">
                {" "}
                {translate("Continue", selectedLanguage)}
              </p>
            </button>
          </div>
          <div className="flex items-center justify-center gap-1 pt-8">
            <p className="text-[#484848] text-[16px] font-poppins font-[400]">
              {translate("Did not receive the email?", selectedLanguage)}
            </p>
            <p
              className="text-[#1DAEDE] text-[16px] font-poppins font-[400] underline cursor-pointer"
              onClick={handleResendOTPlinkClick}
            >
              {translate("click to resend", selectedLanguage)}
            </p>
          </div>
          <div className="py-2">
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
    </div>
  );
}

export default Otp;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import folderIcon from "../../assets/icons/folder.svg";
import Logo from "../../assets/images/logo.png";
import Logo1 from "../../assets/icons/logo1.svg";
import DownIcon from "../../assets/icons/down.svg";

function Storage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

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

  return (
    <div className="min-h-screen flex  xl:flex-row">
      <div className="w-full hidden xl:w-1/2 bg-custom-gradient  md:flex items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <img className="w-72 h-72" src={Logo} alt="Logo" />
          <div className="py-4 text-center">
            <p className="font-poppins text-white text-2xl font-semibold">
              Welcome Back My Friend!
            </p>
            <p className="font-poppins text-lg font-normal text-white">
              Continue where you left off.
            </p>
          </div>
        </div>
      </div>
      <div className="w-full xl:w-1/2 flex flex-col items-center justify-center py-8 px-4 md:px-8 lg:px-16">
        <div className="flex flex-col items-center justify-center w-full">
          <div>
            <img src={Logo1} alt="logo" />
          </div>
          <div className="flex flex-col text-center justify-center py-4">
            <p className="text-gray-800 text-2xl font-medium font-poppins">
              Choose Storage Plans
            </p>
            <p className="text-gray-600 font-poppins py-2 text-base font-normal">
              You can see storage details on the home screen.
            </p>
          </div>
          <div className="w-full max-w-md">
            <div className="mt-4">
              <div className="relative w-full">
                <div
                  onClick={handleDropdownClick}
                  className="flex items-center cursor-pointer justify-between mt-4 border border-gray-300 rounded-md h-12 px-4"
                >
                  <div className=" flex items-center gap-3">
                    <img src={folderIcon} alt="folderIcon" />
                    <p className="text-gray-600 font-poppins text-sm font-normal">
                      Select
                    </p>
                  </div>
                  <img src={DownIcon} alt="Dropdown Icon" />
                </div>
                {(isOpen || isAnimating) && (
                  <div
                    className={`absolute bg-white top-[40px] py-2 z-50 flex flex-col cursor-pointer justify-between border border-t-0 border-gray-300 rounded-b-md h-auto w-full ${
                      isOpen ? "animate-slideDown" : "animate-slideUp"
                    }`}
                  >
                    <div className="py-1 flex items-center cursor-pointer gap-2 px-4 hover:bg-custom-light-blue">
                      <p className="text-sm text-gray-600 font-normal">1GB</p>
                    </div>
                    <div className="py-1 flex items-center cursor-pointer gap-2 px-4 hover:bg-custom-light-blue">
                      <p className="text-sm text-gray-600 font-normal">32GB</p>
                    </div>
                    <div className="py-1 flex items-center cursor-pointer gap-2 px-4 hover:bg-custom-light-blue">
                      <p className="text-sm text-gray-600 font-normal">100GB</p>
                    </div>
                  </div>
                )}
              </div>
              <div className={isOpen ? `pt-24` : "pt-12"}>
                <div className="py-4">
                  <button
                    onClick={() => navigate("/signup")}
                    className="border bg-[#1DAEDE] w-full cursor-pointer flex items-center justify-center rounded-md h-12"
                  >
                    <p className="text-white font-poppins">Continue</p>
                  </button>
                </div>
              </div>
              <div className="py-2">
                <div
                  onClick={() => navigate("/login")}
                  className=" flex items-center gap-3  justify-center cursor-pointer"
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

                  <p className="text-[#484848] text-[14px] font-poppins font-[400]">
                    Back to Login
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Storage;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { translate } from "../../utils/i18n";

import { selectLanguage, setLanguage } from "../../redux/languageSlice";
import { removeLoading, setLoading } from "../../redux/loadingSlice";

import AmericanFlag from "../../assets/icons/american_flag.svg";
import DropdownIcon from "../../assets/icons/down.svg";
import ChineseFlag from "../../assets/icons/chinese-flag.png";

function LanguageDropdown() {
  const [isOpen, setIsOpen] = useState(false); // Internal state for opening/closing the dropdown
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectLanguage); // Get the current language from Redux

  const toggleDropdown = () => {
    setIsOpen(!isOpen); // Toggle the dropdown open/close state
  };

  const handleLanguageChange = (newLanguage: string) => {
    const languageCode = newLanguage === "English" ? "en" : "ch";
    dispatch(setLoading());

    setTimeout(() => {
      dispatch(setLanguage(languageCode)); // Update the language in Redux store
      dispatch(removeLoading()); // Remove the loading indicator after 2 seconds
    }, 2000); // 2000 milliseconds = 2 seconds
    setIsOpen(false); // Close the dropdown after selecting a language
  };

  return (
    <div className="relative inline-block text-left">
      <button
        className="inline-flex justify-center items-center w-full rounded-md p-2 bg-gray-100 border border-gray-300 text-sm font-medium hover:bg-gray-50"
        id="options-menu"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={toggleDropdown} // Toggle the dropdown when button is clicked
      >
        <span className="flex items-center sm:gap-2">
          {currentLanguage === "en" ? (
            <>
              <img className="w-5 h-5" src={AmericanFlag} alt="flag-icon" />
              <p className="sm:block hidden">
                {translate("English", currentLanguage)}
              </p>
            </>
          ) : (
            <>
              <img className="w-6 h-6 mr-1" src={ChineseFlag} alt="flag-icon" />
              <p className="sm:block hidden">
                {translate("Chinese", currentLanguage)}
              </p>
            </>
          )}
        </span>
        <img
          className="-mr-1 ml-2 h-5 w-5 text-gray-400 sm:block hidden"
          src={DropdownIcon}
          alt="dropdown-icon"
        />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div
              onClick={() => handleLanguageChange("English")}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
              role="menuitem"
            >
              <img
                className="w-5 h-5 mr-2"
                src={AmericanFlag}
                alt="flag-icon"
              />
              <p className="font-semibold">
                {translate("languageLabel.English", currentLanguage)}
              </p>
            </div>
            <div
              onClick={() => handleLanguageChange("Chinese")}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
              role="menuitem"
            >
              <img className="w-6 h-6 mr-1" src={ChineseFlag} alt="flag-icon" />
              <p className="font-semibold">
                {translate("languageLabel.Chinese", currentLanguage)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LanguageDropdown;

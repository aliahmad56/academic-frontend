import React, { useState } from "react";
import { useSelector } from "react-redux";

import { selectLanguage } from "../../../redux/languageSlice";
import { translate } from "../../../utils/i18n";

import DropDownIcon from "../../../assets/icons/dropdown_arrow.svg";
interface Option {
  label: string;
  value: string;
}

interface UploadFileDropDowns {
  label: string;
  icon: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: any;
}

const Dropdown: React.FC<UploadFileDropDowns> = ({
  label,
  icon,
  name,
  value,
  options,
  onChange,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLanguage = useSelector(selectLanguage);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectOption = (value: string) => {
    const event = {
      target: {
        name,
        value,
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange(event);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="font-poppins font-[400] text-[16px]">{label}</label>
      <div
        className="flex items-center border border-gray-300 rounded-md h-12 relative cursor-pointer"
        onClick={handleToggleDropdown}
      >
        <img className="w-6 h-6 ml-3" src={icon} alt="icon" />
        <div className="w-full px-3 py-2 text-[14px]">
          {options.find((option) => option.value === value)?.label ||
            translate("Select", selectedLanguage)}
        </div>
        <img
          className="w-4 h-4 absolute right-2"
          src={DropDownIcon}
          alt="dropdown-icon"
        />
      </div>
      {isOpen && (
        <div className="absolute top-[70px] z-10 right-0 mt-2 bg-white border border-[#1DAEDE] rounded-md shadow-lg w-full">
          <div className="flex flex-col">
            {options.map((option, index) => (
              <div
                key={index}
                className="px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] cursor-pointer text-[14px]"
                onClick={() => handleSelectOption(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-red-700 text-sm">{error}</p>}
    </div>
  );
};

export default Dropdown;

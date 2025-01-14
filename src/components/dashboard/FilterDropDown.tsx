import React from "react";

import { translate } from "../../utils/i18n"; // Import translate function
import Spinner from "../common/Spinner";

import DropDownArrow from "../../assets/icons/dropdown_arrow.svg";
import RedCross from "../../assets/icons/RedCross.svg";
interface DropdownProps {
  selectedFilter: string;
  isFilterSearchDropDownOpen: boolean;
  categories: any;
  handleFilterSearchDropdownClick: () => void;
  handleFilterSelect: (filter: string) => void;
  handlePrevPage: () => void;
  handleNextPage: () => void;
  filterRef?: any;
  fetchingCategories?: boolean;
  currentPage: number;
  totalPages: number;
  selectedLanguage: string; // Add the selected language prop
}

const FilterDropdown: React.FC<DropdownProps> = ({
  selectedFilter,
  isFilterSearchDropDownOpen,
  categories,
  handleFilterSearchDropdownClick,
  handleFilterSelect,
  handlePrevPage,
  handleNextPage,
  filterRef,
  fetchingCategories,
  currentPage,
  totalPages,
  selectedLanguage, // Get selected language from props
}) => {
  return (
    <div className="relative" ref={filterRef}>
      <div
        className="inline-flex items-center px-4 py-2 text-gray-500 bg-white border border-gray-300 rounded-md hover:text-gray-700 focus:outline-none gap-3 cursor-pointer"
        onClick={handleFilterSearchDropdownClick}
      >
        <p className="text-gray-500 font-[500]">{selectedFilter}</p>
        <img className="w-3 h-3" src={DropDownArrow} alt="dropdown-icon" />
      </div>
      {isFilterSearchDropDownOpen && (
        <div className="top-[30px] z-10 absolute right-0 mt-[0.7rem] origin-top-right bg-white border border-gray-500 rounded-md shadow-lg w-[230px] max-h-[250px]">
          <ul className="overflow-y-auto max-h-[180px]">
            {fetchingCategories ? (
              <div className="flex justify-center items-center h-[100px] m-4 flex-col gap-4">
                <Spinner />
                <h2>
                  {translate("Fetching Categories", selectedLanguage)}
                </h2>{" "}
                {/* Translated */}
              </div>
            ) : categories.length <= 0 ? (
              <div className="flex justify-center items-center h-[100px] m-4 flex-col font-[600] gap-4">
                <img src={RedCross} alt="No categories found" />
                <h2>
                  {translate("No categories found", selectedLanguage)}
                </h2>{" "}
                {/* Translated */}
              </div>
            ) : (
              categories.map((category: any, index: any) => (
                <li
                  key={index}
                  onClick={() => handleFilterSelect(category)}
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-[rgba(29,174,222,0.15)] gap-4 cursor-pointer font-[500]"
                  style={{ wordBreak: "break-word" }}
                >
                  {category.categoryName}
                </li>
              ))
            )}
          </ul>
          <div className="flex justify-between p-2 border-t border-gray-300">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {translate("Previous", selectedLanguage)} {/* Translated */}
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {translate("Next", selectedLanguage)} {/* Translated */}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;

// import React from 'react'
import { useState, useEffect } from "react";
import SideBar from "./SideBar";
import threeDots from "../../assets/icons/three_dots.svg";
import SearchIcon from "../../assets/icons/search.svg";
import DotsMenu from "../common/DotsMenu";

function SearchSection() {
  const [isOpen, setIsOpen] = useState(false);

  const handleDotModal = () => {
    console.log("Modal Clicked");
    setIsOpen(true);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    const modalElement = document.getElementById("dots-menu-modal");
    if (modalElement && !modalElement.contains(event.target as Node)) {
      console.log("Modal CLosed");

      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", handleOutsideClick);
    } else {
      document.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [isOpen]);
  return (
    <>
      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-grow p-6">
          {/* Customize Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Customize your Sidebar</h2>
            <div className="flex space-x-4">
              <button className="px-4 py-2 border rounded-full text-gray-700 hover:bg-gray-200">
                Essay Assistance
              </button>
              <button className="px-4 py-2 border rounded-full text-gray-700 hover:bg-gray-200">
                Questions & Chats
              </button>
              <button className="px-4 py-2 border rounded-full text-gray-700 hover:bg-gray-200">
                Researcher
              </button>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white p-6  rounded-lg shadow mb-6">
            <div className="flex flex-col space-y-4">
              {/* Search Bar */}
              <div className="flex items-center space-x-4 pl-0 relative">
                <img
                  className="absolute left-7 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  src={SearchIcon}
                  alt="search-icon"
                />
                <input
                  type="text"
                  placeholder="Human Computer Interaction"
                  className="input-field flex-grow pl-10"
                />
                <button className="px-4 py-2 bg-primary-blue text-white rounded-lg">
                  Search
                </button>
              </div>

              <div className="flex justify-between pt-3">
                <p className="text-base font-semibold">Filters</p>
                <p className="text-[#DE1D1D] font-semibold cursor-pointer">
                  Reset Filters
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center justify-between gap-4 text-gray-500">
                <select className="input-field flex-1 bg-white border border-gray-300 p-2 rounded-lg ">
                  <option>Publication Date</option>
                </select>
                <select className="input-field flex-1 bg-white border border-gray-300 p-2 rounded-lg ">
                  <option>More than 50</option>
                </select>
                <select className="input-field flex-1 bg-white border border-gray-300 p-2 rounded-lg">
                  <option>IEEE</option>
                </select>
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-4 py-5">
              Your Search Results
            </h3>

            {/* Result 1 */}
            <div className="bg-white p-4 rounded-lg mb-4 border relative">
              <button
                className="absolute top-4 right-4"
                onClick={handleDotModal}
                id="dots-menu-modal"
              >
                <img
                  src={threeDots}
                  alt="menu"
                  className="w-5 h-5 cursor-pointer hover:bg-gray-100 rounded-full p-1"
                />
              </button>
              <h4 className="font-bold py-1">Issa, Isaias</h4>
              <p className="text-md text-[#DE1D1D] italic">12 Feb, 2022</p>
              <p className="py-2 font-medium text-base">
                Have We Taken On Too Much? A Critical Review of the Sustainable
                HCI Landscape...
              </p>
              <p className="mt-2 text-gray-700">
                International Conference on Human Factors in Computing Systems
              </p>
              {isOpen && (
                <div className="absolute top-8 right-6">
                  <DotsMenu />
                </div>
              )}
            </div>

            {/* Result 2 */}
            <div className="bg-white p-4 rounded-lg mb-4 border">
              <h4 className="font-bold py-1">Issa, Isaias</h4>
              <p className="text-md text-[#DE1D1D] italic">12 Feb, 2022</p>
              <p className="py-2 font-medium text-base">
                Adaptive Interfaces: Customizing User Interactions Based on
                Behavioral Data
              </p>
              <p className="mt-2 text-gray-700">Sustainable Design</p>
            </div>

            <div className="bg-white p-4 rounded-lg mb-4 border">
              <h4 className="font-bold py-1">Issa, Isaias</h4>
              <p className="text-md text-[#DE1D1D] italic">12 Feb, 2022</p>
              <p className="py-2 font-medium text-base">
                Adaptive Interfaces: Customizing User Interactions Based on
                Behavioral Data
              </p>
              <p className="mt-2 text-gray-700">Sustainable Design</p>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="w-1/5 bg-gray-100 h-screen sticky top-0 ">
          <SideBar />
        </div>
      </div>
    </>
  );
}

export default SearchSection;

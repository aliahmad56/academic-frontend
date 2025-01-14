// import React from "react";
import apiImage from "../../assets/apiImage.jpeg";

function SideBar() {
  return (
    <div className="h-screen p-6 bg-white">
    <h2 className="text-3xl font-semibold mb-6">Stay Ahead in Your Field</h2>
    <div className="flex flex-col gap-6">
      {/* Card 1 */}
      <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
        <img src={apiImage} alt="Exclusive Insights" className="w-24 h-24 mb-4" />
        <h1 className="text-lg font-semibold text-center">
          Unlock Exclusive Insights and Discoveries.
        </h1>
      </div>
      {/* Card 2 */}
      <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
        <img src={apiImage} alt="Research Papers" className="w-24 h-24 mb-4" />
        <h5 className="text-base font-medium text-center text-gray-600">
          Access the Latest Research Papers and Publications Here.
        </h5>
      </div>
      {/* Card 3 */}
      <div className="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
        <img src={apiImage} alt="Tools and Resources" className="w-24 h-24 mb-4" />
        <h1 className="text-lg font-semibold text-center">
          Gain Access to Cutting-edge Tools and Resources.
        </h1>
      </div>
    </div>
  </div>
  
  );
}

export default SideBar;

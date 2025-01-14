import { useState } from "react";
import SearchIcon from "../../assets/icons/search.svg";
import Followers from "./FollowersList";
import Following from "./FollowingList";
import AllUsers from "./UsersList";

function Connections() {
  const [selectedTab, setSelectedTab] = useState("Followers");
  const [searchQuery, setSearchQuery] = useState("");

  const handleTabClick = (tabName: string) => {
    setSelectedTab(tabName);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Followers":
        return <Followers searchQuery={searchQuery} />;
      case "Following":
        return <Following searchQuery={searchQuery} />;
      case "All Users":
        return <AllUsers searchQuery={searchQuery} />;
      default:
        return <Followers searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow min-h-screen">
      {/* Header */}
      <h2 className="text-2xl font-semibold mb-1">Connections</h2>
      <p className="text-gray-500 mb-4">
        Here's where you can view and manage your followers and the people you follow.
      </p>

      {/* Search Bar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-[85%]">
          <img
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            src={SearchIcon}
            alt="search-icon"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full p-2 py-3 pl-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
        <button className="bg-[#1DAEDE] text-white w-[15%] py-3 px-3 rounded-lg">
          Search
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-4 text-sm">
        {["Followers", "Following", "All Users"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`pb-2 mr-4 ${
              selectedTab === tab
                ? "text-[#1DAEDE] border-b-2 border-[#1DAEDE] font-medium"
                : "text-gray-500 hover:text-[#1DAEDE]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}

export default Connections;
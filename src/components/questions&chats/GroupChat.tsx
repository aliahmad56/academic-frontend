import React, { useState } from "react";
import EditGroupModal from "../../shared/modals/EditGroupModal ";
import GroupActionsModal from "../../shared/modals/GroupActionsModal";
import AddMembersModal from "../../shared/modals/AddMembersModal";
import threeDots from "../../assets/icons/three_dots.svg";
import GroupDotsMenu from "../common/GroupDotsMenu";

// interface Group {
//   color: string; // Tailwind class names like 'bg-blue-500'
//   icon: React.ReactNode; // Icon as a JSX element or string
//   title: string;
//   description: string;
// }

const groups = {
  name: "Health & Wellness Circle",
  visibility: "Public",
  members: [
    { name: "Ahmed", avatar: "https://via.placeholder.com/40", role: "Admin" },
    { name: "Saqib", avatar: "https://via.placeholder.com/40" },
    { name: "Haider", avatar: "https://via.placeholder.com/40" },
  ],
};

const availableMembers = [
  "John Doe",
  "Jane Smith",
  "Mike Johnson",
  "Sarah Wilson",
  "Tom Brown",
  "Emma Davis",
];

const GroupChat: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [groupMembers, setGroupMembers] = useState(groups.members);

  // const [actionModalIsOpen, setActionModalIsOpen] = useState(false);
  const [isExitGroupOpen, setIsExitGroupOpen] = useState(false);
  const [isDeleteGroupOpen, setIsDeleteGroupOpen] = useState(false);
  const [isOpenDots, setIsOpenDots] = useState(false);

  const handleEditGroupModal = () => {
    setIsModalOpen(true);
  };

  const handleAddGroupModal = () => {
    setAddModalOpen(true);
  };

  const handleExitGroupModal = () => {
    setIsExitGroupOpen(true);
  };

  const handleDeleteGroupModal = () => {
    setIsDeleteGroupOpen(true);
  };

  const handleModalClose = (modalType: "exit" | "delete") => {
    if (modalType === "exit") {
      setIsExitGroupOpen(false);
    } else if (modalType === "delete") {
      setIsDeleteGroupOpen(false);
    }
  };

  const handleDotsPopup = () => {
    setIsOpenDots(true);
  };
  const closeMenu = () => {
    setIsOpenDots(false);
  };

  const handleCloseAddModal = () => {
    setAddModalOpen(false);
  };
  const handleAddMembers = (selectedMembers: string[]) => {
    // Convert selected member names to member objects
    const newMembers = selectedMembers.map((name) => ({
      name,
      avatar: "https://via.placeholder.com/40",
    }));

    // Update group members
    setGroupMembers([...groupMembers, ...newMembers]);
    handleCloseAddModal();
  };

  // const handleExitGroupModal = () => {
  //   setIsExitGroupOpen(true);
  // };

  // const handleDeleteGroupModal = () => {
  //   setIsDeleteGroupOpen(true);
  // };

  return (
    <>
      {/* <div className="p-6 max-w-screen max-h-screen"> */}
      {/* Back Button */}
      {/* <button
          // onClick={onBack}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Groups
        </button> */}

      {/* <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden"> */}
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow min-h-full">
        <div className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center text-white font-bold rounded-full`}
              ></div>
              <div className="ml-4">
                <h1 className="text-lg font-semibold">Group</h1>
                <p className="text-sm text-gray-500">Chat</p>
              </div>
            </div>

            <button className="mr-5" onClick={handleDotsPopup}>
              <img src={threeDots} alt="Options" />
            </button>
          </div>
          {/* <div className="flex space-x-4 text-gray-500">
            <i className="fas fa-phone"></i>
            <i className="fas fa-ellipsis-v"></i>
          </div> */}
          {isOpenDots && (
            <div className="absolute top-[40px] -right-10 z-10  rounded-lg p-4">
              <GroupDotsMenu
                handleEditModal={handleEditGroupModal}
                handleAddModal={handleAddGroupModal}
                handleExitModal={handleExitGroupModal}
                handleDeleteModal={handleDeleteGroupModal}
                closeMenu={closeMenu}
              />
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex items-center p-4 border-b border-gray-300">
          <div className="relative flex-grow">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search in conversation"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button className="ml-4 bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Search
          </button>
          
        </div>

        {/* Chat Messages */}
        <div className="p-4 space-y-4">
          <p className="text-sm text-gray-500 text-center">Yesterday</p>
          {/* Received Message */}
          <div className="flex items-start space-x-4">
            <img
              src="/api/placeholder/40/40"
              alt="Saqib"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h4 className="text-sm font-semibold">Saqib</h4>
              <div className="bg-gray-200 text-gray-800 rounded-lg p-3 mt-1 max-w-sm">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa.
              </div>
              <div className="bg-gray-200 text-gray-800 rounded-lg p-3 mt-1 max-w-sm">
                cupidatat non proident, sunt in culpa.
              </div>
              <p className="text-xs text-gray-500 mt-1">09:16 AM</p>
            </div>
          </div>

          {/* Sent Message */}
          <div className="flex items-start justify-end space-x-4">
            <div>
              <div className="bg-primary-blue text-white rounded-lg p-3 mt-1 max-w-sm">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est laborum.
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">09:15 AM</p>
            </div>
          </div>

          {/* Received Message */}
          <div className="flex items-start space-x-4">
            <img
              src="/api/placeholder/40/40"
              alt="Haider"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h4 className="text-sm font-semibold">Haider</h4>
              <div className="bg-gray-200 text-gray-800 rounded-lg p-3 mt-1 max-w-sm">
                cupidatat non proident, sunt in culpa.
              </div>
              <p className="text-xs text-gray-500 mt-1">09:12 AM</p>
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-300">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Type something..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button className="bg-primary-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600">
              Send
            </button>
          </div>
        </div>
        {/* </div> */}
      </div>

      <EditGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        group={groups}
      />

      <AddMembersModal
        isOpen={addModalOpen}
        onClose={handleCloseAddModal}
        members={availableMembers}
        onAdd={handleAddMembers}
      />
      <GroupActionsModal
        actionModalIsOpen={isExitGroupOpen}
        title={"Exit Group"}
        closeModal={() => handleModalClose("exit")}
        description={
          "Are you sure you want to exit this group? Exiting the group will remove you as a member, and you will no longer have access to group discussions and resources."
        }
      />
      <GroupActionsModal
        actionModalIsOpen={isDeleteGroupOpen}
        title={"Delete Group"}
        closeModal={() => handleModalClose("delete")}
        description={
          "Are you sure you want to delete this group? Deleting the group will permanently remove all group content and members. This action cannot be undone."
        }
      />
    </>
  );
};

export default GroupChat;

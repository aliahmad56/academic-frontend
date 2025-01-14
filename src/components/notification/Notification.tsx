import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { translate } from "../../utils/i18n";

import { RootState, AppDispatch } from "../../redux/store";
import { selectLanguage } from "../../redux/languageSlice";
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
  deleteAllNotification,
  markAllAsRead,
} from "../../redux/notificationSlice";
import DeleteConfirmationModal from "../dashboard/DeleteConfirmModal";
import Spinner from "../common/Spinner";

import { FaRegMessage } from "react-icons/fa6";
import DeleteIcon from "../../assets/icons/del.svg";
import TickIcon from "../../assets/icons/tick.svg";

function Notification() {
  const tabs = ["All", "Read", "Unread"];
  const dispatch: AppDispatch = useDispatch();

  const { notifications, unreadCount, isFetching } = useSelector(
    (state: RootState) => state.notifications
  );
  const selectedLanguage = useSelector(selectLanguage);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleTooltip, setVisibleTooltip] = useState<string | null>(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  const showTooltip = (id: string) => setVisibleTooltip(id);
  const hideTooltip = () => setVisibleTooltip(null);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 1200);
  };

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch notifications based on the active tab (all, read, unread)
  useEffect(() => {
    if (activeTab === 0) dispatch(fetchNotifications("all"));
    else if (activeTab === 1) dispatch(fetchNotifications("read"));
    else if (activeTab === 2) dispatch(fetchNotifications("unread"));
  }, [activeTab, dispatch]);

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleDeleteSelectedRows = () => {
    selectedRows.forEach((id: string) => dispatch(deleteNotification([id])));
    setSelectedRows([]);
  };

  const handleDeleteAllClick = () => {
    setIsDeleteAllModalOpen(true); // Open modal
  };

  const handleDeleteAllConfirm = () => {
    dispatch(deleteAllNotification()); // Call API to delete all notifications
    setIsDeleteAllModalOpen(false); // Close modal
  };

  const handleModalCancel = () => {
    setIsDeleteAllModalOpen(false); // Close modal without deleting
  };

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead([id])); // Dispatch markAsRead thunk here
  };

  return (
    <div className="h-auto w-auto">
      {/* {isFetching && <Loader />} */}
      <div className="bg-white p-8">
        <div className="flex items-center xl:flex-row mb-8 flex-col justify-between gap-[1rem]">
          <div className="py-6">
            <p className="text-[#484848] sm:text-start text-center font-poppins text-[24px] font-[500]">
              {translate("Notifications", selectedLanguage)}
            </p>
            <p className="text-[#828282] text-[14px] font-poppins">
              {translate("You have", selectedLanguage)} {unreadCount}{" "}
              {translate("unread notifications", selectedLanguage)}.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:flex-row flex-col">
            {selectedRows.length > 0 && (
              <button
                onClick={handleDeleteSelectedRows}
                className="bg-red-500 text-white w-[185px] h-[48px] flex items-center cursor-pointer justify-center border border-[#DE1D1D] rounded-md"
              >
                {translate("Delete Selected Row(s)", selectedLanguage)}
              </button>
            )}
            <div
              onClick={handleDeleteAllClick}
              className="w-[185px] h-[48px] flex items-center cursor-pointer justify-center border border-[#DE1D1D] rounded-md"
            >
              <p className="text-[#DE1D1D]">
                {translate("Delete all", selectedLanguage)}
              </p>
            </div>
            <div
              onClick={handleMarkAllAsRead}
              className="w-[185px] h-[48px] flex items-center cursor-pointer justify-center border border-[#1DAEDE] rounded-md"
            >
              <p className="text-[#1DAEDE]">
                {translate("Mark all as Read", selectedLanguage)}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200">
            <ul className="flex mb-4">
              {tabs.map((tab, index) => (
                <li
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className="me-2"
                >
                  <div
                    className={`inline-block px-4 py-2 text-[16px] font-poppins border-b-2 border-transparent rounded-t-lg ${
                      activeTab === index
                        ? "text-[#1DAEDE] border-b-[#1DAEDE]"
                        : "hover:text-gray-400"
                    }`}
                  >
                    {translate(tab, selectedLanguage)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {isFetching ? (
            <div className="flex justify-center w-full flex-col items-center h-[60vh] gap-4">
              <Spinner />
              <p>{translate("Fetching Notifications", selectedLanguage)}</p>
            </div>
          ) : notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                className={`flex items-center justify-between ${
                  notification.IsRead ? "opacity-50" : ""
                }`}
                key={notification._id}
              >
                <div className="flex items-center sm:gap-6 gap-3">
                  <input
                    className="w-[18px] h-[18px] border-[#e4e4e4e5] cursor-pointer"
                    type="checkbox"
                    checked={selectedRows.includes(notification._id)}
                    onChange={() => handleSelectRow(notification._id)}
                  />
                  <div className="py-4 relative">
                    <p className="break-words text-[#484848] font-poppins text-[16px] font-[500]">
                      {translate(
                        notification.notificationTitle,
                        selectedLanguage
                      )}
                    </p>

                    <div
                      className="cursor-pointer w-[100%] text-[#828282] py-1 font-poppins text-[14px] font-[500] break-words"
                      onMouseEnter={() => showTooltip(notification._id)}
                      onMouseLeave={hideTooltip}
                    >
                      {translate(
                        notification.notificationMessage,
                        selectedLanguage
                      )}
                    </div>

                    {isMobile && visibleTooltip === notification._id && (
                      <div
                        className="absolute bg-gray-700 text-white text-xs rounded p-2"
                        style={{
                          top: "100%",
                          left: "0",
                          zIndex: 10,
                          whiteSpace: "normal",
                          maxWidth: "200px",
                        }}
                      >
                        {translate(
                          notification.notificationMessage,
                          selectedLanguage
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {activeTab !== 1 && (
                  <div className="flex items-center justify-center gap-4">
                    {notification.IsRead === false ? (
                      <div
                        className="w-[185px] h-[48px] flex items-center cursor-pointer justify-center border border-green-500 rounded-md"
                        onClick={() => handleMarkAsRead(notification._id)}
                      >
                        <p className="text-black">
                          {translate("Mark as read", selectedLanguage)}
                        </p>
                      </div>
                    ) : (
                      <img
                        className="cursor-pointer"
                        src={TickIcon}
                        alt="Tick"
                      />
                    )}

                    <img
                      className="cursor-pointer"
                      src={DeleteIcon}
                      alt="Delete"
                      onClick={() =>
                        dispatch(deleteNotification([notification._id]))
                      }
                    />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="flex w-full justify-center flex-col gap-4 items-center h-[40vh]">
              <FaRegMessage style={{ width: "50px", height: "50px" }} />
              <p className="text-gray-500">
                {" "}
                {translate("No Message", selectedLanguage)} !
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Use DeleteConfirmationModal */}
      <DeleteConfirmationModal
        isOpen={isDeleteAllModalOpen}
        onConfirm={handleDeleteAllConfirm}
        onCancel={handleModalCancel}
        message={translate(
          "Are you sure you want to delete all notifications?",
          selectedLanguage
        )}
        cancelBtnText={translate("Cancel", selectedLanguage)}
        deleteBtnText={translate("Delete", selectedLanguage)}
      />
    </div>
  );
}

export default Notification;

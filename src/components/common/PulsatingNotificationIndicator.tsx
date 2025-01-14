import React from "react";

import NotificationIcon from "../../assets/icons/NotificationIcon.svg";

interface PulsatingNotificationIndicatorProps {
  iconButtonClick: () => void;
  notificationStatus: boolean;
}

const PulsatingNotificationIndicator: React.FC<
  PulsatingNotificationIndicatorProps
> = ({ iconButtonClick, notificationStatus }) => {
  return (
    <div className="relative " onClick={iconButtonClick}>
      {/* Notification Icon */}
      <img
        className="h-6 w-6 shrink-0 cursor-pointer"
        src={NotificationIcon}
        alt="Notification"
        // Triggering the passed iconButtonClick function
      />

      {/* Conditionally show the Pulsating Ring if notifications are available */}
      {notificationStatus && (
        <>
          {/* Pulsating Ring */}
          <span className="absolute top-[0.15rem] right-[1px] flex h-3 w-3 ">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 cursor-pointer"></span>
          </span>
        </>
      )}
    </div>
  );
};

export default PulsatingNotificationIndicator;

import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import Dashboard from "../dashboard/index";
import Plan from "../plan/Plan";
import Checkout from "../plan/Checkout";
import Notification from "../notification/Notification";
import Contact from "../contact/Contact";
import Refferrals from "../referrals";
import StorageManagement from "../storage-mangment";
import Loader from "../common/Loader";
import LanguageDropdown from "./LanguageDropDown";

import AxiosInterceptor from "../../AxiosInterceptor";
import { bytesToGB } from "../../utils/FileSize";
import { translate } from "../../utils/i18n";

import { clearInfo } from "../../redux/checkoutSlice";
import { clearPayPalInfo } from "../../redux/paypalCheckoutSlice";
import { logout, removeSubscription, selectAuth } from "../../redux/authSlice";
import { removeLoading, setLoading } from "../../redux/loadingSlice";

import { selectLanguage } from "../../redux/languageSlice";
import PulsatingNotificationIndicator from "../common/PulsatingNotificationIndicator";
import ConfirmCancelSubscription from "../dashboard/ConfirmCancelSubsciption";
import { selectNotifications } from "../../redux/notificationSlice";

import { HiOutlineLogin } from "react-icons/hi";
import UserIcon from "../../assets/icons/user (1).svg";
import DownIcon from "../../assets/icons/dropdown_arrow.svg";
import StatusGreenIcon from "../../assets/images/status_green.png";
import StatusRedIcon from "../../assets/images/status_red.png";
import StausYellowIcon from "../../assets/images/status_yellow.png";
import CancelSubscriptionIcon from "../../assets/icons/cancel_subscription.svg";
import SettingsIcon from "../../assets/icons/settings.svg";
import favIcon from "../../assets/icons/favorite.svg";

import LogoutIcon from "../../assets/icons/logout.svg";
import HomeIcon from "../../assets/icons/Home.svg";
import Logo from "../../assets/icons/Logo.svg";
import ReferrelIcon from "../../assets/icons/Referrel.svg";
import StorageIcon from "../../assets/icons/Storage.svg";
import UpgradePlanIcon from "../../assets/icons/UpgradePlan.svg";
import FileAccessPermissionIcon from "../../assets/images/confidential.png";
import FileAccessPermission from "../permission";
import SearchSection from "../search";
import Settings from "../settings/Settings";
import ResearcherRegistration from "../registration";
import Connections from "../connections";
import UserFiles from "../connections/UserFiles";
import Chat from "../../pages/chat&groups/chat";
import MainChatPage from "../../pages/chat&groups";
import GroupChat from "../questions&chats/GroupChat";

const navigation = [
  {
    id: 1,
    name: "Home",
    href: "/",
    icon: HomeIcon,
    current: true,
  },
  {
    id: 2,
    name: "Referrals",
    href: "/referrals",
    icon: ReferrelIcon,
    current: false,
  },
  {
    id: 3,
    name: "Questions & Chats",
    href: "/qnc",
    icon: ReferrelIcon,
    current: false,
  },
  {
    id: 3,
    name: "Researcher",
    href: "/researcher",
    icon: ReferrelIcon,
    current: false,
  },
];

const storageLinks = [
  {
    id: 1,
    name: "File Access Permission",
    href: "/file-access-permission",
    icon: FileAccessPermissionIcon,
    current: false,
  },
  {
    id: 2,
    name: "Storage Management",
    href: "/storage-mangement",
    icon: StorageIcon,
    current: false,
  },
];

// const settingsLinks = [
//   {
//     id: 1,
//     name: "Account Settings",
//     href: "/account-settings",
//     icon: SettingsIcon,
//     current: false,
//   },
// ];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout() {
  // Translation

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectAuth);

  const subscriptionPlatform = user?.userProfile?.subscriptionPlatform;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [storageDropdown, setStorageDropdown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const selectedLanguage = useSelector(selectLanguage);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [redirectLoading, setRedirectLoading] = useState(false);

  const [usedPercentage, setUsedPercentage] = useState(0);

  const notifications = useSelector(selectNotifications);
  const handleSettingsNavigation = () => {
    navigate("/account-settings");
  };
  // Check if there's any unread notification
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.IsRead
  );

  // const toggleSettingsDropdown = () => {
  //   setIsSettingsDropdownOpen((prev) => !prev);
  // };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const storageToggle = () => {
    setStorageDropdown((prev) => !prev);
  };

  useEffect(() => {}, [selectedLanguage]);

  useEffect(() => {
    const usedStorageInBytes = user?.userProfile?.usedStorage || 0;
    const storageLimitInGB = user?.userProfile?.storageLimit || 1; // Default to 1 to avoid division by zero

    // Convert bytes to GB using the bytesToGB function
    const usedStorageInGB = parseFloat(bytesToGB(usedStorageInBytes));

    // Calculate the percentage of used storage
    const percentage = (usedStorageInGB / storageLimitInGB) * 100;
    setUsedPercentage(percentage);
  }, [
    user?.userProfile?.usedStorage,
    user?.userProfile?.storageLimit,
    user?.userProfile?.subscriptionStatus,
  ]);

  const handleSignOutClick = () => {
    setRedirectLoading(true); // Stop loading
    dispatch(logout());

    setTimeout(() => {
      navigate("/");
      localStorage.removeItem("token");
      localStorage.removeItem("isGuest");
      setRedirectLoading(false); // Stop loading
      dispatch(clearInfo());
      dispatch(clearPayPalInfo());
      toast.success("Logout successful");
    }, 1000);
  };

  const handleSignUp = () => {
    setRedirectLoading(true);
    dispatch(logout());

    setTimeout(() => {
      navigate("/signup");
      localStorage.removeItem("token");
      localStorage.removeItem("isGuest");
      setRedirectLoading(false);
      dispatch(clearInfo());
      dispatch(clearPayPalInfo());
    }, 1000);
  };
  const handleCancelSubscription = async () => {
    try {
      dispatch(setLoading());

      const response =
        subscriptionPlatform === "stripe"
          ? await AxiosInterceptor.SECURE_API.put("/user/cancel-subscription")
          : await AxiosInterceptor.SECURE_API.post(
              "/user/cancel-subscription-paypal",
              {
                subscription_id: user?.userProfile?.subscriptionId,
                reason: "Not intrested",
              }
            );

      if (response.data.status === true) {
        toast.success("Subscription cancelled successfully");
        dispatch(removeSubscription());
      } else {
        toast.error(response.data.message || "Failed to cancel subscription");
      }
    } catch (error: any) {
      console.error("Error cancelling subscription:", error);

      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error("Unauthorized request. Please log in again");
      } else if (error.response?.status === 400) {
        toast.error("Bad request. Please try again");
      } else {
        toast.error("Something went wrong. Please try again later");
      }
    } finally {
      dispatch(removeLoading());
    }
  };

  const handleCancelSubscriptionClick = () => {
    setShowPopup(true); // show the confirmation popup
  };

  const handleDelete = () => {
    handleCancelSubscription(); // Call the actual cancel subscription function
    setShowPopup(false); // Close the popup after cancel
  };

  const handleCancel = () => {
    setShowPopup(false); // Close the popup without canceling
  };

  return (
    <>
      {redirectLoading && <Loader />}
      <div>
        <Transition show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <TransitionChild
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div className="fixed inset-0 flex">
              <TransitionChild
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative mr-16 flex  max-w-xs ">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-[75%] top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <XMarkIcon
                          className="h-6 w-6 text-gray-500"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </TransitionChild>

                  {/* Mobile View */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 ring-1 ring-white/10 w-[275px]">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="mt-4 h-14 w-auto"
                        src={Logo}
                        alt="logo.svg"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2  space-y-1">
                            {/* Render the Dashboard item only */}
                            {navigation
                              .filter((item) => item.name === "Home")
                              .map((item) => (
                                <li key={item.name}>
                                  <Link
                                    to={item.href}
                                    className={classNames(
                                      location.pathname === item.href
                                        ? "bg-[#1DAEDE0D] text-[#484848]"
                                        : "hover:bg-[#1DAEDE0D] hover:text-[#484848]",
                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                    )}
                                  >
                                    <img
                                      className="h-6 w-6 shrink-0"
                                      src={item.icon}
                                      alt={item.name}
                                    />
                                    {translate(item.name, selectedLanguage)}
                                  </Link>
                                </li>
                              ))}

                            {/* Mobile More Dropdown */}
                            <li>
                              <button
                                onClick={toggleDropdown}
                                className="group flex justify-between w-full rounded-md p-2 mt-2 text-sm leading-6 font-semibold bg-[#1DAEDE0D] text-[#484848] hover:bg-[#1DAEDE0D]"
                              >
                                {translate("Favorites", selectedLanguage)}
                                <img
                                  className="pt-2 shrink-0"
                                  src={DownIcon}
                                  alt="Dropdown Icon"
                                />
                              </button>

                              {/* Dropdown Links (Mobile view) */}
                              {isDropdownOpen && (
                                <>
                                  <ul className="pl-3 pt-3">
                                    {navigation
                                      .filter((item) => item.name !== "Home")
                                      .map((item) => (
                                        <li key={item.name}>
                                          <Link
                                            to={item.href}
                                            className={classNames(
                                              location.pathname === item.href
                                                ? "bg-[#1DAEDE0D] text-[#484848]"
                                                : "hover:bg-[#1DAEDE0D] hover:text-[#484848]",
                                              "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                            )}
                                          >
                                            <img
                                              className="h-6 w-6 shrink-0"
                                              src={item.icon}
                                              alt={item.name}
                                            />
                                            {translate(
                                              item.name,
                                              selectedLanguage
                                            )}
                                          </Link>
                                        </li>
                                      ))}
                                  </ul>

                                  {/* storge Plan button  */}
                                  <ul
                                    role="list"
                                    className="flex flex-1 flex-col gap-y-5"
                                  >
                                    <li>
                                      <button
                                        onClick={storageToggle}
                                        className="group flex w-full justify-between rounded-md p-2 mt-2 text-sm leading-6 font-semibold bg-[#1DAEDE0D] text-[#484848] hover:bg-[#1DAEDE0D]"
                                      >
                                        {translate(
                                          "Storage Plan",
                                          selectedLanguage
                                        )}
                                        <img
                                          className="pt-2 shrink-0"
                                          src={DownIcon}
                                          alt="Dropdown Icon"
                                        />
                                      </button>
                                    </li>
                                    {/* Storage Dropdown  */}
                                    {storageDropdown && (
                                      <ul className="pl-3">
                                        {storageLinks.map((item) => (
                                          <li key={item.name}>
                                            <Link
                                              to={item.href}
                                              className={classNames(
                                                location.pathname === item.href
                                                  ? "bg-[#1DAEDE0D] text-[#484848]"
                                                  : "hover:bg-[#1DAEDE0D] hover:text-[#484848]",
                                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                              )}
                                            >
                                              <img
                                                className="h-6 w-6 shrink-0"
                                                src={item.icon}
                                                alt={item.name}
                                              />
                                              {translate(
                                                item.name,
                                                selectedLanguage
                                              )}
                                            </Link>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </ul>
                                  {/* {item.name ===
                                              "Storage Management" && ( */}
                                  <div className="mt-4">
                                    <div className="w-full mx-auto flex flex-col justify-start gap-2">
                                      {/* Progress bar container */}
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                          className={`h-2 rounded-full transition-all duration-[2000ms] ease-in-out ${
                                            usedPercentage >= 80
                                              ? "bg-red-500"
                                              : usedPercentage >= 60
                                              ? "bg-yellow-500"
                                              : "bg-[#1DAEDE]"
                                          }`}
                                          style={{
                                            width: `${
                                              user.isGuest ? 0 : usedPercentage
                                            }%`,
                                          }}
                                        />
                                      </div>
                                      {/* Storage details */}
                                      <div className="flex items-start text-sm space-y-0 space-x-1">
                                        <span className="text-gray-600 font-medium">
                                          {user.isGuest === true
                                            ? 0
                                            : parseFloat(
                                                bytesToGB(
                                                  user?.userProfile?.usedStorage
                                                )
                                              ) || 0}{" "}
                                          {translate("GB", selectedLanguage)}
                                        </span>
                                        <span className="text-gray-400">
                                          {translate("of", selectedLanguage)}
                                        </span>
                                        <span className="text-gray-600 font-medium">
                                          {user.isGuest === true
                                            ? 0
                                            : user?.userProfile?.storageLimit ||
                                              0}{" "}
                                          {translate("GB", selectedLanguage)}
                                        </span>
                                        <span className="text-gray-400">
                                          {translate("used", selectedLanguage)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Desktop View */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-['#FFFFFE'] px-6 pb-4 pt-5">
            <div className="flex h-16 justify-center shrink-0 items-center">
              <img className="h-16 w-auto" src={Logo} alt="Your Company" />
            </div>
            <nav className="flex flex-1 flex-col">
              {/* Side Bar Options */}
              <ul role="list" className="flex flex-1 flex-col gap-y-4">
                {navigation
                  .filter((item) => item.name === "Home")
                  .map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={classNames(
                          location.pathname === item.href
                            ? "bg-[#1DAEDE0D] text-[#484848]"
                            : "hover:bg-[#1DAEDE0D] hover:text-[#484848]",
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                        )}
                      >
                        <img
                          className="h-6 w-6 shrink-0"
                          src={item.icon}
                          alt={item.name}
                        />
                        {translate(item.name, selectedLanguage)}
                      </Link>
                    </li>
                  ))}

                {/* More Dropdown */}
                <li>
                  <button
                    onClick={toggleDropdown}
                    className="group flex justify-between w-full rounded-md p-2 text-sm leading-6 font-semibold bg-[#1DAEDE0D] text-[#484848] hover:bg-[#1DAEDE0D]"
                  >
                    <img
                      className="w-7 h-7" // Adjust width and height as needed
                      src={favIcon}
                      alt="Your Icon"
                    />
                    <p className="mr-20">
                      {translate("Favorites", selectedLanguage)}
                    </p>
                    <img
                      className="pt-2 pl-5 items-end shrink-0"
                      src={DownIcon}
                      alt="Dropdown Icon"
                    />
                  </button>

                  {/* Dropdown Links */}
                  {isDropdownOpen && (
                    <>
                      <ul className="pl-6 pt-2">
                        {navigation
                          .filter((item) => item.name !== "Home")
                          .map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.href}
                                className={classNames(
                                  location.pathname === item.href
                                    ? "bg-[#1DAEDE0D] text-[#484848]"
                                    : "hover:bg-[#1DAEDE0D] hover:text-[#484848]",
                                  "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                )}
                              >
                                <img
                                  className="h-6 w-6 shrink-0"
                                  src={item.icon}
                                  alt={item.name}
                                />
                                {translate(item.name, selectedLanguage)}
                              </Link>
                            </li>
                          ))}
                      </ul>

                      {/* storge Plan button  */}
                      <ul
                        role="list"
                        className="flex flex-1 flex-col gap-y-4 pt-2"
                      >
                        <li>
                          <button
                            onClick={storageToggle}
                            className="group flex w-full justify-between rounded-md p-2 text-sm leading-6 font-semibold bg-[#1DAEDE0D] text-[#484848] hover:bg-[#1DAEDE0D]"
                          >
                            {translate("Storage Plan", selectedLanguage)}
                            <img
                              className="pt-2 shrink-0"
                              src={DownIcon}
                              alt="Dropdown Icon"
                            />
                          </button>
                        </li>
                        {/* Storage Dropdown  */}
                        {storageDropdown && (
                          <ul className="pl-6 pt-2">
                            {storageLinks.map((item) => (
                              <li key={item.name}>
                                <Link
                                  to={item.href}
                                  className={classNames(
                                    location.pathname === item.href
                                      ? "bg-[#1DAEDE0D] text-[#484848]"
                                      : "hover:bg-[#1DAEDE0D] hover:text-[#484848]",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <img
                                    className="h-6 w-6 shrink-0"
                                    src={item.icon}
                                    alt={item.name}
                                  />
                                  {translate(item.name, selectedLanguage)}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                        {/* {item.name === "Storage Management" && ( */}
                        <div className="mt-4">
                          <div className="w-full mx-auto flex flex-col justify-start gap-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-[2000ms] ease-in-out ${
                                  usedPercentage >= 80
                                    ? "bg-red-500"
                                    : usedPercentage >= 60
                                    ? "bg-yellow-500"
                                    : "bg-[#1DAEDE]"
                                }`}
                                style={{
                                  width: `${
                                    user.isGuest ? 0 : usedPercentage
                                  }%`,
                                }}
                              />
                            </div>
                            <div className="flex items-end mb-2">
                              <span className="text-gray-600 font-medium text-sm">
                                {user.isGuest === true
                                  ? 0
                                  : parseFloat(
                                      bytesToGB(user?.userProfile?.usedStorage)
                                    ) || 0}{" "}
                                {translate("GB", selectedLanguage)}
                              </span>
                              <span className="text-gray-400 text-sm mx-1">
                                of
                              </span>
                              <span className="text-gray-600 text-sm font-medium">
                                {user.isGuest === true
                                  ? 0
                                  : user?.userProfile?.storageLimit || 0}{" "}
                                {translate("GB", selectedLanguage)}
                              </span>
                              <span className="text-gray-400 text-sm ml-1">
                                {translate("used", selectedLanguage)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </ul>
                    </>
                  )}
                </li>

                {/* Inside the navigation ul, after the Favorites dropdown */}
                
              </ul>
            </nav>
            {/* Upgrade Plan */}
            <div key="upgrade-plan">
              <Link
                to={"/plan"}
                className={classNames(
                  location.pathname === "/plan"
                    ? "bg-[#1DAEDE0D] text-[#484848]"
                    : "hover:bg-[#1DAEDE0D] hover:text-[#484848]",
                  "group flex gap-x-3 rounded-md p-2 leading-6 text-[#484848]"
                )}
              >
                <img
                  className="h-6 w-6 shrink-0"
                  src={UpgradePlanIcon}
                  alt="Upgrade Plan"
                />
                {translate("Upgrade Plan", selectedLanguage)}
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 py-2 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />

            <div className="flex items-center gap-2">
              {(user?.userProfile?.subscriptionStatus === "active" ||
                user?.userProfile?.subscriptionStatus === "ACTIVE") && (
                <>
                  <img
                    className="h-6 w-6"
                    src={StatusGreenIcon}
                    alt="Active Status"
                  />
                  <p className="font-semibold text-green-500 sm:block hidden">
                    {translate("Active", selectedLanguage)}
                  </p>
                </>
              )}
              {user?.userProfile?.subscriptionStatus === "APPROVAL_PENDING" && (
                <>
                  <img
                    className="h-6 w-6"
                    src={StausYellowIcon}
                    alt="Pending Status"
                  />
                  <p className="font-semibold text-yellow-500 sm:block hidden"></p>
                </>
              )}
              {(!user?.userProfile?.subscriptionStatus ||
                user?.userProfile?.subscriptionStatus === "canceled" ||
                !("subscriptionStatus" in user?.userProfile)) && (
                <>
                  <img
                    className="h-6 w-6"
                    src={StatusRedIcon}
                    alt="No Subscription Status"
                  />
                  <p className="font-semibold text-red-500 sm:block hidden">
                    {translate("No Subscription", selectedLanguage)}
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-1 flex-row-reverse gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6">
                <LanguageDropdown />

                <PulsatingNotificationIndicator
                  notificationStatus={hasUnreadNotifications} // True if any notification is unread
                  iconButtonClick={() => navigate("/notifications")} // Handle click event
                />
                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center rounded-full p-2 hover:bg-gray-300 hover:cursor-pointer transition duration-300 ease-in-out">
                    <img
                      className={`h-8 w-8 rounded-full ${
                        user?.userProfile?.profilepic
                          ? ""
                          : "border border-black p-1"
                      }`}
                      src={user?.userProfile?.profilepic || UserIcon}
                      alt="User Avatar"
                      onError={(e) => {
                        e.currentTarget.src = UserIcon; // Fallback to default icon
                      }}
                    />
                  </MenuButton>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <MenuItems className="absolute right-0 z-10 mt-1.5 w-56 origin-top-right rounded-md bg-white  shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                      <div className="flex justify-end cursor-pointer" onClick={() => navigate("/user")}>
                        <div className="p-4  flex flex-col justify-end ">
                          <p className="text-sm font-medium text-gray-900">
                            {user?.name || translate("User", selectedLanguage)}
                          </p>
                          <p className="text-sm text-gray-500  text-end">
                            {user.isGuest
                              ? translate("Guest", selectedLanguage)
                              : translate("User", selectedLanguage)}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-gray-200 ">
                        <MenuItem
                          as="div"
                          className="block p-4 text-sm text-gray-700 cursor-pointer hover:bg-[#1DAEDE] focus:bg-[#1DAEDE] pt-2"
                          onClick={handleSettingsNavigation}
                        >
                          <div className="flex justify-start  items-center gap-4 flex-row-reverse">
                            <img
                              className="inline-block h-auto w-[22px]  "
                              src={SettingsIcon}
                              alt="Settings Icon"
                            />
                            <p className="font-[4000] font-poppins ">
                              {translate("Account Setting", selectedLanguage)}
                            </p>
                          </div>
                        </MenuItem>
                        {user?.userProfile?.subscriptionStatus &&
                          user?.userProfile?.subscriptionStatus !==
                            "canceled" && (
                            <MenuItem
                              as="div"
                              disabled
                              className="block p-[1rem] text-sm text-gray-700 cursor-pointer hover:bg-[#de1d1d] focus:bg-[#de1d1d] pt-2"
                            >
                              <div
                                className="flex justify-start items-center gap-4 flex-row-reverse"
                                onClick={handleCancelSubscriptionClick}
                              >
                                <img
                                  className="inline-block h-auto w-[17px]"
                                  src={CancelSubscriptionIcon}
                                  alt="Settings Icon"
                                />
                                <p className="font-[4000] font-poppins">
                                  {translate(
                                    "Cancel Subscription",
                                    selectedLanguage
                                  )}
                                </p>
                              </div>
                            </MenuItem>
                          )}

                        {showPopup && (
                          <ConfirmCancelSubscription
                            message="Are you sure you want to cancel your subscription?"
                            onDelete={handleDelete} // Call delete function on confirm
                            onCancel={handleCancel} // Close popup on cancel
                          />
                        )}

                        <MenuItem
                          as="div"
                          className="block p-4 text-sm text-gray-700 cursor-pointer hover:bg-[#1DAEDE] focus:bg-[#1DAEDE]"
                        >
                          <div
                            onClick={handleSignOutClick}
                            className="flex justify-start  items-center gap-4 flex-row-reverse"
                          >
                            <img
                              className="inline-block h-auto w-[20px] "
                              src={LogoutIcon}
                              alt="Logout Icon"
                            />
                            <p> {translate("Logout", selectedLanguage)}</p>
                          </div>
                        </MenuItem>
                        {user.isGuest && (
                          <MenuItem
                            as="div"
                            className="block p-4 text-sm text-gray-700 cursor-pointer hover:bg-[#1DAEDE] focus:bg-[#1DAEDE]"
                          >
                            <div
                              onClick={handleSignUp}
                              className="flex justify-start  items-center gap-4 flex-row-reverse"
                            >
                              <HiOutlineLogin className="h-auto w-[20px]" />
                              <p> {translate("SignUp", selectedLanguage)}</p>
                            </div>
                          </MenuItem>
                        )}
                      </div>
                    </MenuItems>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <main className="py-6 sm:py-10 bg-[#F5F5F5] sm:px-8 px-6">
            <div className="">
              {location.pathname === "/" && <Dashboard />}
              {location.pathname === "/plan" && <Plan />}
              {location.pathname === "/search" && <SearchSection />}

              {location.pathname === "/checkout" && <Checkout />}
              {location.pathname === "/notifications" && <Notification />}
              {location.pathname === "/contacts" && <Contact />}
              {location.pathname === "/referrals" && <Refferrals />}
              {location.pathname === "/file-access-permission" && (
                <FileAccessPermission />
              )}
              {location.pathname === "/storage-mangement" && (
                <StorageManagement />
              )}
              {location.pathname === "/account-settings" && <Settings />}
              {location.pathname === "/researcher" && (
                <ResearcherRegistration />
              )}
              {location.pathname === "/qnc" && <MainChatPage />}
              {location.pathname === "/qnc/chats" && <Chat />}
              {location.pathname === "/qnc/chats/group" && <GroupChat />}
              {location.pathname === "/connections" && <Connections />}
              {location.pathname === "/user" && <UserFiles />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

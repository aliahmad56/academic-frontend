import { useRoutes, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";
import SignUp from "./components/auth/SignUp";
import Login from "./components/auth/Login";
import ForgetPassword from "./components/auth/ForgetPassword";
import Otp from "./components/auth/Otp";
import ResetPassword from "./components/auth/ResetPassword";
import Plan from "./components/plan/Plan";
import Checkout from "./components/plan/Checkout";
import Notification from "./components/notification/Notification";
import Refferrals from "./components/referrals";
import StorageManagment from "./components/storage-mangment";
import FileAccessPermission from "./components/permission";
import SearchSection from "./components/search";
import Settings from "./components/settings/Settings";
import ResearcherRegistration from "./components/registration";
import Connections from "./components/connections";
import UserFiles from "./components/connections/UserFiles";
import Chat from "./pages/chat&groups/chat";
import MainChatPage from "./pages/chat&groups";
import GroupChat from "./components/questions&chats/GroupChat";

const Routes = () => {
  const token = localStorage.getItem("token");

  const PrivateRoutes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "plan",
          element: <Plan />,
        },
        
        {
          path: "checkout",
          element: <Checkout />,
        },
        {
          path: "notifications",
          element: <Notification />,
        },
        {
          path: 'search',
          element: <SearchSection/>
        },
        {
          path: "referrals",
          element: <Refferrals />,
        },
        {
          path: "storage-mangement",
          element: <StorageManagment />,
        },
        {
          path: "account-settings",
          element: <Settings/>,                

        },
        {
          path: "researcher",
          element: <ResearcherRegistration/>,
        },
        {
          path: "connections",
          element: <Connections/>
        },
        {
          path: "qnc",
          element: <MainChatPage/>
        },
        {
          path: "qnc/chats",
          element: <Chat/>
        },
        {
          path: "/qnc/chats/group",
          element: <GroupChat/>
        },
        {
          path: "/user",
          element: <UserFiles/>
        },
        {
          path: "file-access-permission",
          element: <FileAccessPermission />,
        },

      ],              
    },

    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ];

  const PublicRoutes = [
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/forget-password",
      element: <ForgetPassword />,
    },
    {
      path: "/otp",
      element: <Otp />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
    },
    {
      path: "*",
      element: <Navigate to="/login" />,
    },
  ];

  // const CombinedRoutes = [...PrivateRoutes, ...PublicRoutes];
  const routes = token ? PrivateRoutes : PublicRoutes;

  let element = useRoutes(routes);
  return element;
};

export default Routes;

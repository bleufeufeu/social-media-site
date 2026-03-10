import App from "./App";
import Home from "./pages/Home/Home";
import Signup from "./pages/Signup/Signup";
import Login from "./pages/Login/Login";
import TokenRedirect from "./pages/TokenRedirect/TokenRedirect";
import Users from "./pages/Users/Users";
import UserIndividual from "./pages/UserIndividual/UserIndividual";
import PostIndividual from "./pages/PostIndividual/PostIndividual";
import Settings from "./pages/Settings/Settings";
import SettingsSecurity from "./pages/SettingsSecurity/SettingsSecurity";
import SettingsProfile from "./pages/SettingsProfile/SettingsProfile";
import Hashtag from "./pages/Hashtag/Hashtag";
import SettingsPrivacy from "./pages/SettingsPrivacy/SettingsPrivacy";

const routes = [
  {
    path: "/",
    element: <App />,
    children: [
        {
            index: true,
            element: <Home />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/auth/success",
          element: <TokenRedirect />,
        },
        {
          path: "/users",
          element: <Users />,
        },
        {
          path: "/u/:userId",
          element: <UserIndividual />,
        },
        {
          path: "/p/:postId",
          element: <PostIndividual />,
        },
        {
          path: "/hashtag/:hashtagName",
          element: <Hashtag />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
        {
          path: "/settings/security",
          element: <SettingsSecurity />,
        },
        {
          path: "/settings/privacy",
          element: <SettingsPrivacy />,
        },
        {
          path: "/settings/profile",
          element: <SettingsProfile />,
        }
    ],
  },
];

export default routes;
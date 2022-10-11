import Create from "./pages/Create";
import Home from "./pages/Home";
import List from "./pages/List";
import Map from "./pages/Map";
import ProfilePage from "./pages/ProfilePage";

export const routes = [
  {
    key: "home-route",
    title: "Home",
    path: "/",
    enabled: true,
    component: Home,
  },
  {
    key: "create-route",
    title: "Create",
    path: "/create",
    enabled: true,
    component: Create,
  },
  {
    key: "map-route",
    title: "Map",
    path: "/map",
    enabled: true,
    component: Map,
  },
  {
    key: "list-route",
    title: "List",
    path: "/list",
    enabled: true,
    component: List,
  },
  {
    key: "profile-route",
    title: "Profile",
    path: "/profile",
    enabled: true,
    component: ProfilePage,
  },
];

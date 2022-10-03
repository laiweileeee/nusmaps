import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import ListPage from "./pages/ListPage";
import MapPage from "./pages/MapPage";
import ProfilePage from "./pages/ProfilePage";

export const routes = [
  {
    key: "home-route",
    title: "Home",
    path: "/",
    enabled: true,
    component: HomePage,
  },
  {
    key: "create-route",
    title: "Create",
    path: "/create",
    enabled: true,
    component: CreatePage,
  },
  {
    key: "map-route",
    title: "Map",
    path: "/map",
    enabled: true,
    component: MapPage,
  },
  {
    key: "list-route",
    title: "List",
    path: "/list",
    enabled: true,
    component: ListPage,
  },
  {
    key: "profile-route",
    title: "Profile",
    path: "/profile",
    enabled: true,
    component: ProfilePage,
  },
];

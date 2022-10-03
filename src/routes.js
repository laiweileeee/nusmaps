import Create from "./pages/CreatePage";
import Home from "./pages/HomePage";

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
    component: Create,
  },
  {
    key: "list-route",
    title: "List",
    path: "/list",
    enabled: true,
    component: Create,
  },
  {
    key: "profile-route",
    title: "Profile",
    path: "/profile",
    enabled: true,
    component: Create,
  },
];

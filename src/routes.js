import Create from "./pages/Create";
import Home from "./pages/Home";
import ListView from "./pages/ListView";
import Map from "./pages/MapView";
import Profile from "./pages/Profile";

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
    title: "ListView",
    path: "/list",
    enabled: true,
    component: ListView,
  },
  {
    key: "profile-route",
    title: "Profile",
    path: "/profile",
    enabled: true,
    component: Profile,
  },
];

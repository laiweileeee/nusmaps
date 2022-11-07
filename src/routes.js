import Create from "./pages/Create";
import ListView from "./pages/ListView";
import Map from "./pages/MapView";
import Profile from "./pages/Profile";
import Edit from "./pages/Edit";

export const routes = [
  // {
  //   key: "home-route",
  //   title: "Home",
  //   path: "/",
  //   enabled: true,
  //   component: Map,
  // },
  {
    key: "create-route",
    title: "Create",
    path: "/create",
    enabled: true,
    component: Create,
  },
  {
    key: "edit-route",
    title: "Edit",
    path: "/edit",
    enabled: true,
    component: Edit,
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

import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeConfig } from "./theme/theme";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as routerLink,
} from "react-router-dom";
import { routes as appRoutes } from "./routes";

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CssBaseline,
  Paper,
  Typography,
} from "@mui/material";
import MapIcon from "@mui/icons-material/Map";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TopAppBar from "./components/TopAppBar";

import { AuthProvider } from "./contexts/AuthProvider";

// define theme
const theme = createTheme(themeConfig);

function App() {
  const [value, setValue] = React.useState("map");

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        {/* Reset CSS */}
        <CssBaseline>
          <Box height="100vh" display="flex" flexDirection="column">
            <Router>
              <TopAppBar />
              {/*<Navbar />*/}
              <Routes>
                {appRoutes.map((route) => (
                  <Route
                    key={route.key}
                    path={route.path}
                    element={<route.component />}
                  />
                ))}
              </Routes>

              {/* Bottom Nav */}
              <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
                <BottomNavigation
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                >
                  <BottomNavigationAction
                    label="Map"
                    value="map"
                    icon={<MapIcon />}
                    component={routerLink}
                    to={"/map"}
                  />
                  <BottomNavigationAction
                    label="List"
                    value="lists"
                    icon={<FormatListBulletedIcon />}
                    component={routerLink}
                    to={"/list"}
                  />
                  <BottomNavigationAction
                    label="Profile"
                    value="profile"
                    icon={<AccountCircleIcon />}
                    component={routerLink}
                    to={"/profile"}
                  />
                </BottomNavigation>
              </Paper>
            </Router>
          </Box>
        </CssBaseline>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

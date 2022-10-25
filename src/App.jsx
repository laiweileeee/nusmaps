import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { themeConfig } from "./theme/theme";

import {
  BrowserRouter as Router,
  Link as routerLink,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { routes as appRoutes } from "./routes";

import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  CssBaseline,
  Paper,
} from "@mui/material";
import { Map, FormatListBulleted, AccountCircle } from "@mui/icons-material";

import { AuthProvider } from "./contexts/AuthProvider";
import { LocationProvider } from "./contexts/LocationProvider";

// define theme
const theme = createTheme(themeConfig);

function App() {
  const [value, setValue] = useState(
    window.location.pathname === "/list" ||
      window.location.pathname === "/profile"
      ? window.location.pathname
      : "/map"
  );

  return (
    <AuthProvider>
      <LocationProvider>
        <ThemeProvider theme={theme}>
          {/* Reset CSS */}
          <CssBaseline>
            <Box height="100vh" display="flex" flexDirection="column">
              <Router>
                <Routes>
                  <Route path="/" element={<Navigate to="/map" />} />
                  {appRoutes.map((route) => (
                    <Route
                      key={route.key}
                      path={route.path}
                      element={<route.component />}
                    />
                  ))}
                </Routes>

                {/* Bottom Nav */}
                <Paper
                  sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                  }}
                >
                  <BottomNavigation
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                  >
                    <BottomNavigationAction
                      label="Map"
                      value="/map"
                      icon={<Map />}
                      component={routerLink}
                      to={"/map"}
                    />
                    <BottomNavigationAction
                      label="List"
                      value="/list"
                      icon={<FormatListBulleted />}
                      component={routerLink}
                      to={"/list"}
                    />
                    <BottomNavigationAction
                      label="Profile"
                      value="/profile"
                      icon={<AccountCircle />}
                      component={routerLink}
                      to={"/profile"}
                    />
                  </BottomNavigation>
                </Paper>
              </Router>
            </Box>
          </CssBaseline>
        </ThemeProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;

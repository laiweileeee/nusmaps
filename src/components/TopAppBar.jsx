import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import InputBase from "@mui/material/InputBase";

import { Search } from "@mui/icons-material";
import { styled, alpha } from "@mui/material/styles";
import { Button } from "@mui/material";

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect } from "react";

export default function MenuAppBar() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    const provider = new GoogleAuthProvider();
    await signInWithPopup(getAuth(), provider);
  }

  async function signOutUser() {
    // Sign out of Firebase.
    await signOut(getAuth());
    setAuth(false);
  }

  function initFirebaseAuth() {
    // Listen to auth state changes.
    onAuthStateChanged(getAuth(), authStateObserver);
  }

  // Triggers when the auth state change for instance when the user signs-in or signs-out.
  function authStateObserver(user) {
    if (user) {
      // User is signed in!
      // Get the signed-in user's profile pic and name.
      const userName = getAuth().currentUser.displayName;
      console.log("current user ", getAuth().currentUser);
      // setAuth(true);

      // Set the user's profile pic and name.

      // Show user's profile and sign-out button.

      // Hide sign-in button.

      // We save the Firebase Messaging Device token and enable notifications.
      // saveMessagingDeviceToken();
    } else {
      // User is signed out!
      // Hide user's profile and sign-out button.
      // Show sign-in button.
    }
  }

  // Returns true if a user is signed-in.
  function isUserSignedIn() {
    return !!getAuth().currentUser;
  }

  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
      width: "auto",
    },
  }));

  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create("width"),
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        width: "12ch",
        "&:focus": {
          width: "20ch",
        },
      },
    },
  }));

  initFirebaseAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/*<FormGroup>*/}
      {/*  <FormControlLabel*/}
      {/*    control={*/}
      {/*      <Switch*/}
      {/*        checked={auth}*/}
      {/*        onChange={handleChange}*/}
      {/*        aria-label="login switch"*/}
      {/*      />*/}
      {/*    }*/}
      {/*    label={auth ? "Logout" : "Login"}*/}
      {/*  />*/}
      {/*</FormGroup>*/}
      <AppBar position="static" sx={{ pt: 1 }}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          {auth ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
              </Menu>
            </div>
          ) : (
            <div>
              <Button color="inherit" variant="text" onClick={signIn}>
                Login
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

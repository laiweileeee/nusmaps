// src/pages/Home.js
import React from "react";
import GoogleButton from "react-google-button";
import { useContext } from "react";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { AuthContext } from "../contexts/AuthProvider";
import Box from "@mui/material/Box";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { CircularProgress } from "@mui/material";
const LoginButton = () => {
  // fetch auth object from AuthProvider without prop drilling
  const { signIn } = useContext(AuthContext);
  // sessionStorage.setItem("loginLoading", false);

  const loginLoading = sessionStorage.getItem("loginLoading");

  // TODO: Add backdrop loader for sign in delay

  if (loginLoading === "true") {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <CircularProgress sx={{ marginBottom: 2 }} />
        Logging in...
      </Box>
    );
  }

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <GoogleButton color="inherit" variant="text" onClick={signIn}>
        Login
      </GoogleButton>
    </Box>
  );
};

export default LoginButton;

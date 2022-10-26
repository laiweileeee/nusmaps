// src/pages/Home.js
import React from "react";
import GoogleButton from "react-google-button";
import { useContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { AuthContext } from "../contexts/AuthProvider";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import Typography from "@mui/material/Typography";

const LoginButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // fetch user and auth object from AuthProvider without prop drilling
  const { user, auth } = useContext(AuthContext);
  const handleSignOut = async () => {
    await signOutUser();
    setAnchorEl(null);
  };
  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      console.log("current user from provider (if)", user);
    } else {
      setIsLoggedIn(false);
      console.log("current user from provider (else)", user);
    }
  }, [user]);

  // TODO: Add backdrop loader for sign in delay
  async function signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    const provider = new GoogleAuthProvider();
    const userRef = collection(db, "users");

    await signInWithPopup(auth, provider).then(async (cred) => {
      const q = query(userRef, where("uid", "==", cred.user.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        console.log(cred.user.email);
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          displayName: cred.user.displayName,
          photoURL: cred.user.photoURL,
          email: cred.user.email,
          bio: "",
        });
      }
      console.log(cred.user);
    });
  }

  async function signOutUser() {
    // Sign out of Firebase.
    await signOut(auth);
  }

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {isLoggedIn ? (
        <Stack
          direction="column"
          spacing={3}
          sx={{ justifyContent: "center", alignItems: "center" }}
        ></Stack>
      ) : (
        <GoogleButton color="inherit" variant="text" onClick={signIn}>
          Login
        </GoogleButton>
      )}
    </Box>
  );
};

export default LoginButton;

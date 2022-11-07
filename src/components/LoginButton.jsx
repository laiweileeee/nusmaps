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

const LoginButton = () => {
  // fetch auth object from AuthProvider without prop drilling
  const { auth } = useContext(AuthContext);

  // TODO: Add backdrop loader for sign in delay
  async function signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    const provider = new GoogleAuthProvider();
    const userRef = collection(db, "users");

    await signInWithRedirect(auth, provider).then(async (cred) => {
      const q = query(userRef, where("uid", "==", cred.user.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        await setDoc(doc(db, "users", cred.user.uid), {
          uid: cred.user.uid,
          displayName: cred.user.displayName,
          photoURL: cred.user.photoURL,
          email: cred.user.email,
          bio: "",
        });
      }
    });
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

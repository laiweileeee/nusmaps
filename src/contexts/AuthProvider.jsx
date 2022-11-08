import React, { useEffect, useState, createContext } from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  async function signIn() {
    sessionStorage.setItem("loginLoading", "true");
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
  useEffect(() => {
    auth.onAuthStateChanged(setUser);
    sessionStorage.setItem("loginLoading", "false");
  }, []);

  return (
    <AuthContext.Provider value={{ user, auth, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};

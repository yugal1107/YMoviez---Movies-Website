// UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { app } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const UserContext = createContext();

export const useAuth = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    // const unsubscribe = auth.onAuthStateChanged((user) => {
    //   setCurrentUser(user);
    //   setLoading(false);
    // });

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        setCurrentUser(user);
        setLoading(false);
        // ...
      } else {
        setLoading(false);
        setCurrentUser(null); // User is signed out
        // ...
      }
    });

    // return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user: currentUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

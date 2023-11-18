import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  signInUser: (email: string, password: string) => void;
  logOutUser: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }
  return context;
};

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = (props: UserContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(null);
      setError("");
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const registerUser = (email: string, username: string, password: string) => {
    setLoading(true);
    setError(null);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return updateProfile(userCredential.user, {
          displayName: username,
        });
      })
      .then(() => addUserToDatabase(username))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const addUserToDatabase = async (username: string) => {
    const docRef = doc(db, "users", username);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Found user.");
    } else {
      console.log("No such user!");

      try {
        await setDoc(doc(db, "users", username), {});
      } catch (e) {
        console.error("Error adding document: ", e);
        return;
      }
    }
  };

  const signInUser = (email: string, password: string) => {
    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => console.log(res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const logOutUser = () => {
    signOut(auth);
    setUser(null);
  };

  const forgotPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
  };

  const contextValue = {
    user,
    loading,
    error,
    registerUser,
    signInUser,
    logOutUser,
    forgotPassword,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};

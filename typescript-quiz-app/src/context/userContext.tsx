import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  User,
  setPersistence,
  browserLocalPersistence,
  updatePassword,
  deleteUser,
  updateEmail,
  sendEmailVerification,
  browserSessionPersistence,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { ReactNode } from "react";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  signInUser: (email: string, password: string, rememberMe: boolean) => void;
  logOutUser: () => void;
  forgotPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string) => void;
  handleDeleteUser: () => void;
  changeEmail: (email: string) => void;
  sendVerificationEmail: () => void;
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
      .then(() => {
        addUserToDatabase(username);
        sendVerificationEmail();
      })
      .catch((err) => {
        if (err.code) {
          // Check for specific Firebase error codes
          switch (err.code) {
            case "auth/email-already-in-use":
              setError("Email already in use");
              break;
            case "auth/invalid-email":
              setError("Invalid email");
              break;
            case "auth/weak-password":
              setError("Password should be at least 6 characters");
              break;
            default:
              setError(err.toString());
              console.log(err);
          }
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
  };

  const addUserToDatabase = async (username: string) => {
    const userId = auth.currentUser?.uid;

    try {
      await setDoc(doc(db, "usernames", username), {
        uid: auth.currentUser?.uid,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      return;
    }

    if (userId === undefined) {
      console.log("user is not defined.");
      return;
    }

    try {
      await setDoc(doc(db, "users", userId), {});
    } catch (e) {
      console.error("Error adding document: ", e);
      return;
    }
  };

  const signInUser = (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);
    setError(null);

    const remember = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence;

    setPersistence(auth, remember)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            if (err.code) {
              // Check for specific Firebase error codes
              console.log(err);
              console.log(err.code);

              switch (err.code) {
                case "auth/invalid-email":
                  setError("Invalid email address");
                  break;
                case "auth/invalid-login-credentials":
                  setError("Invalid login credentials");
                  break;

                case "auth/too-many-requests":
                  setError(
                    "This account has been temporarily disabled due to many failed login attempts. Please try again later."
                  );
                  break;
                default:
                  setError("An error occurred. Please try again.");
              }
            } else {
              setError(err.message);
            }
          })
          .finally(() => {
            setLoading(false);
            // onClose();
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const logOutUser = () => {
    signOut(auth);
    setUser(null);
  };

  const forgotPassword = (email: string) => {
    toast.success("Sent password reset email");
    return sendPasswordResetEmail(auth, email);
  };

  const changePassword = (newPassword: string) => {
    const user = auth.currentUser;

    if (user === null) {
      return;
    }

    updatePassword(user, newPassword)
      .then(() => {
        // Update successful.
        toast.success("Password changed");
      })
      .catch((error) => {
        // An error ocurred
        // ...
        console.log(error);
        toast.error("Error changing password. Refresh the page and try again");
      });
  };

  const handleDeleteUser = () => {
    const user = auth.currentUser;

    if (user === null) {
      return;
    }

    deleteUser(user)
      .then(() => {
        // User deleted.
        toast.success("Deleted user. Sad to see you go!");
      })
      .catch((error) => {
        // An error ocurred
        // ...
        console.log(error);
        toast.error("Error deleting account. Refresh the page and try again");
      });
  };

  const changeEmail = (email: string) => {
    const user = auth.currentUser;

    if (user === null) {
      return;
    }

    updateEmail(user, email)
      .then(() => {
        // Email updated!
        // ...
        toast.success("Email changed");
      })
      .catch((error) => {
        // An error occurred
        // ...
        console.log(error);

        if (error.code === "auth/operation-not-allowed") {
          toast.error(
            "You need to verify your current email before changing it. Resent a new verification email"
          );
          sendVerificationEmail();
        } else {
          toast.error("Error changing email");
        }
      });
  };

  const sendVerificationEmail = () => {
    const user = auth.currentUser;

    if (user === null) {
      return;
    }

    sendEmailVerification(user).then(() => {
      // Email verification sent!
      // ...
    });
  };

  const contextValue = {
    user,
    loading,
    error,
    registerUser,
    signInUser,
    logOutUser,
    forgotPassword,
    changePassword,
    changeEmail,
    handleDeleteUser,
    sendVerificationEmail,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
    </UserContext.Provider>
  );
};

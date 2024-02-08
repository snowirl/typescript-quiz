import { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  User,
  inMemoryPersistence,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
  Input,
} from "@nextui-org/react";
import { FaEyeSlash, FaEye } from "react-icons/fa6";
import { toast } from "sonner";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  registerUser: (email: string, username: string, password: string) => void;
  signInUser: (email: string, password: string, rememberMe: boolean) => void;
  logOutUser: () => void;
  forgotPassword: (email: string) => Promise<void>;
  onOpen: () => void;
  setWhichModal: (modal: string) => void;
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

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const [whichModal, setWhichModal] = useState<string>("login");
  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const [didSearch, setDidSearch] = useState(false);
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  let typingTimer: NodeJS.Timeout | null = null;
  const [username, setUserName] = useState("");
  const usernameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(null);
      setError("");
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (typingTimer !== null) {
      clearTimeout(typingTimer);
    }

    typingTimer = setTimeout(() => {
      checkUsernameAvailability();
    }, 500);
    // Cleanup the timer on component unmount
    return () => {
      if (typingTimer !== null) {
        clearTimeout(typingTimer);
      }
    };
  }, [username]);

  const checkUsernameAvailability = async () => {
    if (!usernameRef.current) {
      setDidSearch(false);
      return;
    }

    setDidSearch(false);

    try {
      const docRef = doc(
        db,
        "users",
        usernameRef.current.value.toLowerCase().trim()
      );

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Found user.");
        setIsUserAvailable(false);
        setDidSearch(true);
      } else {
        console.log("No such user!");
        setIsUserAvailable(true);
        setDidSearch(true);
      }
    } catch (e) {
      setDidSearch(false);
    }
  };

  const handleSignupSubmit = () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passRef.current?.value;

    if (username && email && password) {
      if (isUserAvailable) {
        registerUser(email, username, password);
      }

      checkUsernameAvailability();
    }
  };

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
        onClose();
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
          setLoginError(err.message);
        }
      })
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

  const signInUser = (email: string, password: string, rememberMe: boolean) => {
    setLoading(true);

    const remember = rememberMe ? browserLocalPersistence : inMemoryPersistence;

    setPersistence(auth, remember)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then((res) => {
            console.log(res);
            onClose();
          })
          .catch((err) => {
            if (err.code) {
              // Check for specific Firebase error codes
              switch (err.code) {
                case "auth/invalid-email":
                  setLoginError("Invalid email address");
                  break;
                case "auth/invalid-login-credentials":
                  setLoginError("Invalid login credentials");
                  break;
                default:
                  setLoginError("Invalid email address");
              }
            } else {
              setLoginError(err.message);
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
    onClose();
    toast.success("Sent password reset email");
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
    onOpen,
    setWhichModal,
  };

  const handleModalSubmit = () => {
    const email = emailRef.current?.value;
    const password = passRef.current?.value;

    if (email && password) {
      signInUser(email, password, rememberMe);
    }
  };

  return (
    <UserContext.Provider value={contextValue}>
      {props.children}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={false}
      >
        <ModalContent className="w-[425px] min-w-[100%] min-h-full p-2 text-black dark:text-white rounded-md">
          {whichModal === "login" ? (
            <>
              <ModalHeader className="flex flex-col gap-1 dark">
                Log in to your account
              </ModalHeader>
              <ModalBody className="pt-2 pb-2 space-y-2 bg-red-200">
                <form className="space-y-3" id="signup" action="#">
                  <Input
                    isRequired
                    type="email"
                    label="Email"
                    labelPlacement="inside"
                    variant="flat"
                    size="sm"
                    ref={emailRef}
                    required
                  />
                  <Input
                    isRequired
                    type={isPasswordVisible ? "text" : "password"}
                    label="Password"
                    labelPlacement="inside"
                    variant="flat"
                    size="sm"
                    ref={passRef}
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isPasswordVisible ? (
                          <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <FaEye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                </form>
                <div className="flex justify-between text-xs">
                  <Checkbox
                    isSelected={rememberMe}
                    onValueChange={setRememberMe}
                  >
                    Remember me
                  </Checkbox>
                  <button
                    className="font-semibold text-base underline"
                    onClick={() => {
                      setWhichModal("forgot");
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              </ModalBody>
              <ModalFooter className="py-4">
                <div className="flex-grow space-y-4">
                  <div>
                    <Button
                      color="primary"
                      variant="solid"
                      className="w-full font-semibold"
                      radius="md"
                      onPress={() => handleModalSubmit()}
                    >
                      Log in
                    </Button>
                  </div>
                  {loginError ? (
                    <div className="bg-rose-600 py-4 rounded-lg text-center">
                      <p className="font-semibold px-2 text-white text-sm">
                        {loginError}
                      </p>
                    </div>
                  ) : null}
                  <div className="justify-center text-center items-center">
                    <button
                      className="font-semibold"
                      onClick={() => {
                        setWhichModal("signup");
                      }}
                    >
                      Don't have an account?
                    </button>
                  </div>
                </div>
              </ModalFooter>
            </>
          ) : null}
          {whichModal === "signup" ? (
            <>
              <ModalHeader className="flex flex-col gap-1 dark">
                Create an account
              </ModalHeader>
              <ModalBody className="pt-2 pb-2 space-y-0">
                {didSearch ? (
                  isUserAvailable ? (
                    <span className="text-green-600 font-semibold">
                      Username is available.
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold">
                      Username is not available.
                    </span>
                  )
                ) : null}

                <Input
                  isRequired
                  type="text"
                  label="Username"
                  labelPlacement="inside"
                  size="sm"
                  variant="flat"
                  ref={usernameRef}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUserName(e.target.value)
                  }
                />

                <Input
                  isRequired
                  type="email"
                  label="Email"
                  labelPlacement="inside"
                  size="sm"
                  variant="flat"
                  ref={emailRef}
                />
                <Input
                  isRequired
                  type={isPasswordVisible ? "text" : "password"}
                  label="Password"
                  labelPlacement="inside"
                  size="sm"
                  variant="flat"
                  ref={passRef}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleVisibility}
                    >
                      {isPasswordVisible ? (
                        <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <FaEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                />
                <div className="flex items-center text-gray-500 dark:text-gray-300">
                  {/* <div className="flex-1 border-t border-gray-300"></div>
                  <div className="mx-4">or</div>
                  <div className="flex-1 border-t border-gray-300"></div> */}
                </div>
                {/* <Button className="font-semibold" variant="bordered">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    alt="Google G logo"
                  />
                  Sign up with Google
                </Button> */}
                <Checkbox className="text-semibold">
                  <p className="text-xs">
                    By signing up, you are creating a Studucky account, and you
                    agree to Studucky's Terms of Use and Privacy Policy.
                  </p>
                </Checkbox>
              </ModalBody>
              <ModalFooter className="py-2">
                <div className="flex-grow space-y-4">
                  <div>
                    <Button
                      color="primary"
                      variant="solid"
                      onPress={() => handleSignupSubmit()}
                      className="w-full font-bold"
                      radius="md"
                    >
                      Create account
                    </Button>
                  </div>
                  {error ? (
                    <div className="bg-rose-600 py-4 rounded-lg text-center">
                      <p className="font-semibold px-2 text-white text-sm">
                        {error}
                      </p>
                    </div>
                  ) : null}
                  <div className="justify-center text-center items-center">
                    <button
                      className="font-semibold"
                      onClick={() => {
                        setWhichModal("login");
                      }}
                    >
                      Have an account?
                    </button>
                  </div>
                </div>
              </ModalFooter>
            </>
          ) : null}
          {whichModal === "forgot" ? (
            <>
              <ModalHeader className="flex flex-col gap-1 dark">
                Reset your password
              </ModalHeader>
              <ModalBody className="pt-2 pb-2 space-y-2">
                <form className="space-y-3" id="restart" action="#">
                  <Input
                    isRequired
                    type="email"
                    label="Email"
                    labelPlacement="inside"
                    variant="flat"
                    size="sm"
                    ref={emailRef}
                  />
                </form>
              </ModalBody>
              <ModalFooter className="py-4">
                <div className="flex-grow space-y-4">
                  <div>
                    <Button
                      color="primary"
                      variant="solid"
                      className="w-full font-semibold"
                      radius="md"
                      onPress={() =>
                        forgotPassword(
                          emailRef?.current?.value ? emailRef.current.value : ""
                        )
                      }
                    >
                      Send email
                    </Button>
                  </div>
                  <div className="justify-center text-center items-center">
                    <button
                      className="font-semibold"
                      onClick={() => {
                        setWhichModal("login");
                      }}
                    >
                      Have an account?
                    </button>
                  </div>
                </div>
              </ModalFooter>
            </>
          ) : null}
        </ModalContent>
      </Modal>
    </UserContext.Provider>
  );
};

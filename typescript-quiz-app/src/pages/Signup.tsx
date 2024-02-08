import {
  Input,
  Card,
  CardBody,
  Button,
  Checkbox,
  Image,
} from "@nextui-org/react";
import StuduckyCircleLogo from "../assets/StuduckyCircle.svg";
import { FormEvent, useState, useRef, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useUserContext } from "../context/userContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Signup = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const usernameRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [didCheckUsername, setDidCheckUsername] = useState(false);
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  let typingTimer: NodeJS.Timeout | null = null;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [size, setSize] = useState<"md" | "lg">("md"); // Default size is 'md'

  const { registerUser, user, error } = useUserContext();

  const navigate = useNavigate();

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)"); // Adjust the breakpoint as needed

    // If the media query matches (i.e., it's a mobile device), set the size to 'lg'
    const handleMediaChange = (event: MediaQueryListEvent) => {
      setSize(event.matches ? "lg" : "md");
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    // Set initial size based on the current match
    setSize(mediaQuery.matches ? "lg" : "md");

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (email === "") {
      setEmailInvalid(false);
      return;
    }

    setEmailInvalid(validateEmail(email) ? false : true);
    return;
  }, [email]);

  useEffect(() => {
    if (user) {
      navigate("/sets/recents");
    }
  }, [user]);

  useEffect(() => {
    if (typingTimer !== null) {
      clearTimeout(typingTimer);
    }

    typingTimer = setTimeout(() => {
      checkUsernameAvailability();
    }, 600);
    // Cleanup the timer on component unmount
    return () => {
      if (typingTimer !== null) {
        clearTimeout(typingTimer);
      }
    };
  }, [username]);

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Allow alphanumeric characters and underscores
    if (/^[a-zA-Z0-9_]+$/.test(value) || value === "") {
      setUsername(value);
    }
  };

  const checkUsernameAvailability = async () => {
    if (!usernameRef.current) {
      setDidCheckUsername(false);
      return;
    }

    setDidCheckUsername(false);

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
        setDidCheckUsername(true);
      } else {
        console.log("No such user!");
        setIsUserAvailable(true);
        setDidCheckUsername(true);
      }
    } catch (e) {
      setDidCheckUsername(false);
    }
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const username = usernameRef.current?.value;
    const password = passRef.current?.value;

    if (emailInvalid || emailRef.current?.value === "") {
      setEmailInvalid(true);
      emailRef.current?.focus();
      return;
    }

    if (!isUserAvailable) {
      usernameRef.current?.focus();
      return;
    }

    if (email && username && password) {
      registerUser(email, username, password);
    }
  };

  return (
    <div className="bg-white text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen">
      {error ? (
        <div className="bg-rose-500 w-full h-10 flex justify-center items-center">
          <p className="text-white font-semibold text-sm">{error}</p>
        </div>
      ) : null}

      <div className="md:pt-20 pt-10 space-y-5 flex justify-center items-center">
        <Card
          shadow="none"
          className="w-full max-w-[550px] md:mx-10 mx-4 bg-black/0"
          radius="md"
        >
          <CardBody className="md:px-12 px-4 md:py-8 py-4">
            <div className="space-y-4 max-w-[1050px] justify-center">
              <div className="flex justify-center items-center h-14">
                <button onClick={() => navigate("/")}>
                  <Image src={StuduckyCircleLogo} alt="Logo" className="w-14" />
                </button>
              </div>
              <div>
                <p className="text-xl font-semibold text-center">
                  Create a new account
                </p>
              </div>
              <form className="space-y-4" onSubmit={handleFormSubmit}>
                <div className="pt-4 pb-2 space-y-10">
                  <Input
                    type="email"
                    variant="bordered"
                    label="Email address"
                    size={size}
                    labelPlacement="outside"
                    placeholder="Enter your email"
                    isInvalid={emailInvalid}
                    errorMessage={
                      emailInvalid ? "Please enter a valid email" : null
                    }
                    onValueChange={setEmail}
                    ref={emailRef}
                  />
                  <Input
                    type="text"
                    variant="bordered"
                    label="Username"
                    size={size}
                    labelPlacement="outside"
                    placeholder="Enter a unique username"
                    isInvalid={!isUserAvailable && didCheckUsername}
                    errorMessage={
                      !isUserAvailable && didCheckUsername ? (
                        "Username is taken"
                      ) : didCheckUsername ? (
                        <span className="text-green-600">
                          Username is available
                        </span>
                      ) : null
                    }
                    ref={usernameRef}
                    value={username}
                    onChange={handleUsernameChange}
                  />
                  <Input
                    label="Password"
                    type={isPasswordVisible ? "text" : "password"}
                    placeholder="Enter your password"
                    variant="bordered"
                    size={size}
                    ref={passRef}
                    labelPlacement="outside"
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
                </div>{" "}
                <div className="flex items-center justify-between">
                  <Checkbox isRequired>
                    <p className="text-xs">
                      By signing up, you are creating a Studucky account, and
                      you agree to Studucky's Terms of Use and Privacy Policy.
                    </p>
                  </Checkbox>
                </div>
                <div className="">
                  <Button
                    type="submit"
                    color="primary"
                    size={size}
                    className="font-semibold w-full"
                  >
                    Create account
                  </Button>
                </div>
              </form>

              <div className="flex justify-center items-center pt-4">
                <button
                  className="hover:underline"
                  onClick={() => navigate("/login")}
                >
                  <p className="text-base font-semibold">Have an account?</p>
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Signup;

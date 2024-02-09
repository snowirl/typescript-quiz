import {
  Input,
  Card,
  CardBody,
  Button,
  Checkbox,
  Image,
} from "@nextui-org/react";
import StuduckyCircleLogo from "../assets/StuduckyCircle.svg";
import { FormEvent, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaXmark } from "react-icons/fa6";
import { useUserContext } from "../context/userContext";
import { toast } from "sonner";

const Login = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [size, setSize] = useState<"md" | "lg">("md"); // Default size is 'md'

  const { signInUser, user, error } = useUserContext();

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
    if (size === "lg" && error) {
      toast.error(error);
    }
  }, [error]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passRef.current?.value;

    if (emailInvalid || emailRef.current?.value === "") {
      setEmailInvalid(true);
      emailRef.current?.focus();
      return;
    }

    if (passRef.current?.value === "") {
      passRef.current?.focus();
      return;
    }

    if (email && password) {
      signInUser(email, password, rememberMe);
    }
  };

  return (
    <div className="bg-white text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen">
      {error ? (
        <div className="hidden bg-rose-500 w-full min-h-10 py-2 px-2 md:flex justify-center items-center">
          <p className="text-white font-semibold text-sm">{error}</p>
        </div>
      ) : null}
      <div className="w-full absolute  top-10 justify-center flex pb-0 h-20">
        <div className="w-full  max-w-[800px] flex justify-end">
          <Button
            isIconOnly
            variant="light"
            size="md"
            className="m-4 z-10"
            onClick={() => navigate("/")}
          >
            <FaXmark className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="md:pt-20 pt-10 space-y-5 flex justify-center items-center">
        <Card
          shadow="none"
          className="bg-black/0 w-full max-w-[550px] md:mx-10 mx-4"
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
                  Log in to your account
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
                </div>
                <div className="">
                  <Button
                    type="submit"
                    color="primary"
                    size={size}
                    className="font-semibold w-full"
                  >
                    Log in
                  </Button>
                </div>
              </form>
              <div className="flex items-center justify-between">
                <Checkbox isSelected={rememberMe} onValueChange={setRememberMe}>
                  Remember me
                </Checkbox>
                <button className="hover:underline">
                  <p className="text-base">Forgot password?</p>
                </button>
              </div>
              <div className="flex justify-center items-center pt-4">
                <button className="hover:underline">
                  <p
                    className="text-base font-semibold"
                    onClick={() => navigate("/signup")}
                  >
                    Don't have an account?
                  </p>
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Login;

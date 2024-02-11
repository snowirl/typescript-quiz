import { Input, Card, CardBody, Button, Image } from "@nextui-org/react";
import StuduckyCircleLogo from "../assets/StuduckyCircle.svg";
import { FormEvent, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaXmark } from "react-icons/fa6";
import { useUserContext } from "../context/userContext";
import { toast } from "sonner";

const Signup = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");

  const [emailInvalid, setEmailInvalid] = useState(false);
  const [size, setSize] = useState<"md" | "lg">("md"); // Default size is 'md'

  const { error, forgotPassword } = useUserContext();

  const navigate = useNavigate();

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
    if (size === "lg" && error) {
      toast.error(error);
    }
  }, [error]);

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.value;

    if (emailInvalid || emailRef.current?.value === "") {
      setEmailInvalid(true);
      emailRef.current?.focus();
      return;
    }

    if (email) {
      forgotPassword(email);
    }
  };

  return (
    <div className="bg-white text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen">
      {error ? (
        <div className="hidden bg-rose-500 w-full h-10 md:flex justify-center items-center">
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
                  Forgot Password
                </p>
                <p className="text-center pt-4">
                  We will send you an email to reset your password.
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
                </div>
                <div className="">
                  <Button
                    type="submit"
                    color="primary"
                    size={size}
                    className="font-semibold w-full"
                  >
                    Email Me
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

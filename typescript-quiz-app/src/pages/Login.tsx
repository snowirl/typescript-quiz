import { Input, Card, CardBody, Button, Checkbox } from "@nextui-org/react";
import StuduckyCircleLogo from "../assets/StuduckyCircle.svg";
import { FormEvent, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useUserContext } from "../context/userContext";

const Login = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { signInUser, user, error } = useUserContext();

  const navigate = useNavigate();

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

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

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passRef.current?.value;

    if (emailInvalid) {
      emailRef.current?.focus();
      return;
    }

    if (email && password) {
      signInUser(email, password, rememberMe);
    }
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen">
      {error ? (
        <div className="bg-rose-500 w-full h-10 flex justify-center items-center">
          <p className="text-white font-semibold text-sm">{error}</p>
        </div>
      ) : null}

      <div className="md:pt-20 pt-10 space-y-5 flex justify-center items-center">
        <Card
          shadow="sm"
          className="w-full max-w-[550px] md:mx-10 mx-4"
          radius="md"
        >
          <CardBody className="md:px-12 px-8 md:py-8 py-8">
            <div className="space-y-4 max-w-[1050px] justify-center">
              <div className="flex justify-center items-center">
                <button onClick={() => navigate("/")}>
                  <img src={StuduckyCircleLogo} alt="Logo" className="w-14" />
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
                    size="md"
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
                    size="md"
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
                    size="md"
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

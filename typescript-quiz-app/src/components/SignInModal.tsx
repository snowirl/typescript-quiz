import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Checkbox,
  Link,
} from "@nextui-org/react";
import { useUserContext } from "../context/userContext";
import { useRef, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

interface SignInModalProps {
  isLogInModalOpen: boolean;
  setIsLogInModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isSignUpModalOpen: boolean;
  setIsSignUpModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignInModal = (props: SignInModalProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const { signInUser, error } = useUserContext();

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  useEffect(() => {
    if (props.isLogInModalOpen) {
      if (!isOpen) {
        onOpen();
      } else {
        onClose();
      }
    } else {
      onClose();
    }
  }, [props.isLogInModalOpen]);

  useEffect(() => {
    if (!isOpen) {
      props.setIsLogInModalOpen(false);
    }
  }, [onOpenChange]);

  const handleModalSubmit = () => {
    const email = emailRef.current?.value;
    const password = passRef.current?.value;

    if (email && password) {
      signInUser(email, password);
    }
  };

  const handleOpenSignUpModal = () => {
    props.setIsSignUpModalOpen(true);
  };

  return (
    <>
      <Button
        color="default"
        variant="light"
        className="font-semibold"
        radius="md"
        onPress={onOpen}
      >
        Login
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent className="w-[425px] p-2 text-black dark:text-white rounded-md">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 dark">
                Log in to your account
              </ModalHeader>
              <ModalBody className="pt-2 pb-2 space-y-2">
                <form className="space-y-2" id="signup" action="#">
                  <Input
                    isRequired
                    type="email"
                    label="Email"
                    labelPlacement="inside"
                    variant="flat"
                    size="sm"
                    ref={emailRef}
                  />
                  <Input
                    isRequired
                    type={isVisible ? "text" : "password"}
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
                        {isVisible ? (
                          <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                        ) : (
                          <FaEye className="text-2xl text-default-400 pointer-events-none" />
                        )}
                      </button>
                    }
                  />
                </form>
                <div className="flex justify-between text-xs">
                  <Checkbox>Remember me</Checkbox>
                  <Link href="#" className="font-semibold">
                    Forgot password?
                  </Link>
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
                        onClose();
                        handleOpenSignUpModal();
                      }}
                    >
                      Don't have an account?
                    </button>
                  </div>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignInModal;

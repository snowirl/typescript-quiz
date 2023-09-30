import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Link,
} from "@nextui-org/react";
import { useUserContext } from "../context/userContext";
import { useRef } from "react";

const SignUpModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const { registerUser, error } = useUserContext();

  const handleModalSubmit = () => {
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passRef.current?.value;

    if (username && email && password) {
      registerUser(email, username, password);
    }
  };
  return (
    <>
      <Button
        color="primary"
        className="font-semibold px-5"
        size="md"
        onPress={onOpen}
      >
        Sign up
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent className="w-[400px] p-2 text-black dark:text-white rounded-md">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 dark">
                Create an account
              </ModalHeader>
              <ModalBody className="pt-2 pb-2 space-y-2">
                <Input
                  type="text"
                  label="Username"
                  labelPlacement="inside"
                  variant="faded"
                  size="sm"
                  ref={usernameRef}
                />
                <Input
                  type="email"
                  label="Email"
                  labelPlacement="inside"
                  variant="faded"
                  size="sm"
                  ref={emailRef}
                />
                <Input
                  type="password"
                  label="Password"
                  labelPlacement="inside"
                  variant="faded"
                  size="sm"
                  ref={passRef}
                />
                {/* <div className="flex justify-between text-xs">
                  <Checkbox>Remember me</Checkbox>
                  <Link href="#" underline="hover">
                    Forgot password?
                  </Link>
                </div> */}
              </ModalBody>
              <ModalFooter className="py-4">
                <div className="flex-grow space-y-4">
                  <div>
                    <Button
                      color="primary"
                      variant="solid"
                      onPress={() => handleModalSubmit()}
                      className="w-full rounded-md font-semibold"
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
                    <Link href="#" underline="hover">
                      Have an account?
                    </Link>
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

export default SignUpModal;

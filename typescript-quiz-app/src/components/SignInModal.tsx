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
import { useRef } from "react";

const SignInModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const { signInUser, error } = useUserContext();

  const handleModalSubmit = () => {
    const email = emailRef.current?.value;
    const password = passRef.current?.value;

    if (email && password) {
      signInUser(email, password);
    }
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
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 dark">
                Log in to your account
              </ModalHeader>
              <ModalBody className="pt-2 pb-2 space-y-2">
                <form className="space-y-2">
                  <Input
                    type="email"
                    label="Email"
                    labelPlacement="inside"
                    variant="flat"
                    size="sm"
                    ref={emailRef}
                  />
                  <Input
                    type="password"
                    label="Password"
                    labelPlacement="inside"
                    variant="flat"
                    size="sm"
                    ref={passRef}
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
                    <Link href="#" className="font-semibold">
                      Don't have an account?
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

export default SignInModal;

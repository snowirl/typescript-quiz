import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Link,
  Input,
} from "@nextui-org/react";
import { useUserContext } from "../context/userContext";
import { useRef, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const SignUpModal = () => {
  const [isUserAvailable, setIsUserAvailable] = useState(false);
  let typingTimer: NodeJS.Timeout | null = null;
  const [username, setUserName] = useState("");

  const [didSearch, setDidSearch] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const usernameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);

  const { registerUser, error } = useUserContext();

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

  const handleModalSubmit = () => {
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
          {() => (
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
                  type="email"
                  label="Email"
                  labelPlacement="inside"
                  size="sm"
                  variant="flat"
                  ref={emailRef}
                />
                <Input
                  type="password"
                  label="Password"
                  labelPlacement="inside"
                  size="sm"
                  variant="flat"
                  ref={passRef}
                />
              </ModalBody>
              <ModalFooter className="py-4">
                <div className="flex-grow space-y-4">
                  <div>
                    <Button
                      color="primary"
                      variant="solid"
                      onPress={() => handleModalSubmit()}
                      className="w-full font-semibold"
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
                    <Link href="#">Have an account?</Link>
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

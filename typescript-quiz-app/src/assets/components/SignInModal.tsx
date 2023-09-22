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

const SignInModal = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button
        color="default"
        variant="light"
        className="font-semibold rounded-md"
        size="md"
        onPress={onOpen}
      >
        Login
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent className="w-[400px] p-2 text-black dark:text-white rounded-md">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 dark">
                Sign in to your account
              </ModalHeader>
              <ModalBody className="pt-2 pb-2 space-y-2">
                <Input
                  type="email"
                  label="Email"
                  labelPlacement="inside"
                  variant="faded"
                  size="sm"
                />
                <Input
                  type="password"
                  label="Password"
                  labelPlacement="inside"
                  variant="faded"
                  size="sm"
                />
                <div className="flex justify-between text-xs">
                  <Checkbox>Remember me</Checkbox>
                  <Link href="#" underline="hover">
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
                      onPress={onClose}
                      className="w-full rounded-md font-semibold"
                    >
                      Log in
                    </Button>
                  </div>
                  <div className="justify-center text-center items-center">
                    <Link href="#" underline="hover">
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

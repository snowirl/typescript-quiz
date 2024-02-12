import {
  Card,
  CardBody,
  Avatar,
  Button,
  Input,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FaEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { useRef, ChangeEvent, useState, useEffect } from "react";
import { Switch } from "@nextui-org/react";
import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "next-themes";
import { useUserContext } from "../context/userContext";
import { toast } from "sonner";
import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab } from "@nextui-org/react";

const Settings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passRef = useRef<HTMLInputElement | null>(null);
  const passRef2 = useRef<HTMLInputElement | null>(null);

  const deleteRef = useRef<HTMLInputElement | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [tab, setTab] = useState("account");
  const [email, setEmail] = useState("");
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [deleteUsername, setDeleteUsername] = useState(""); // for delete account
  const [deleteInvalid, setDeleteInvalid] = useState(true);
  const { theme, setTheme } = useTheme();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);
  const toggleVisibility2 = () => setIsPasswordVisible2(!isPasswordVisible2);

  const { changePassword, changeEmail, handleDeleteUser } = useUserContext();

  const navigate = useNavigate();

  const validateEmail = (value: string) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const handleButtonClick = () => {
    // Trigger the file input when the button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  useEffect(() => {
    if (email === "") {
      setEmailInvalid(false);
      return;
    }

    setEmailInvalid(validateEmail(email) ? false : true);
    return;
  }, [email]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleImageUpload(event);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (auth === null) {
      console.log("Error: auth is null.");
      return;
    }
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected.");
      return;
    }

    const storage = getStorage();

    const userId = auth.currentUser?.uid;

    const storageRef = ref(storage, `profilePictures/${userId}`);

    let newDownloadURL = "";

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");

        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          newDownloadURL = downloadURL;
          handleProfilePicChange(newDownloadURL);
        });
      })
      .catch((error) => {
        return console.error("Error uploading the file:", error);
        // Handle the error, e.g., show an error message to the user
      });
  };

  const handleProfilePicChange = async (pictureUrl: string) => {
    const currentUser = auth.currentUser;

    if (currentUser !== null) {
      updateProfile(currentUser, {
        photoURL: pictureUrl,
      })
        .then(() => {
          // Profile updated!
          // ...
          // setProfilePic(pictureUrl);
        })
        .catch((error) => {
          // An error occurred
          // ...
          console.log(error);
        });
    }
  };

  const changeTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const handleChangePassword = () => {
    if (passRef.current === null || passRef2.current === null) {
      toast.error("Password is empty");
      return;
    }

    if (passRef.current.value.length < 6 || passRef2.current.value.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (passRef.current.value !== passRef2.current.value) {
      toast.error("Passwords do not match");
      return;
    }

    changePassword(passRef.current.value);
  };

  const handleChangeEmail = () => {
    if (emailInvalid || email === "") {
      toast.error("Not a valid email");
      return;
    }

    changeEmail(email);
  };

  useEffect(() => {
    if (!auth.currentUser?.displayName) {
      setDeleteInvalid(true);
      return;
    }

    if (deleteUsername === auth.currentUser?.displayName) {
      setDeleteInvalid(false);
    } else {
      setDeleteInvalid(true);
    }

    return;
  }, [deleteUsername]);

  const handleDeleteAccount = async () => {
    if (deleteInvalid) {
      toast.error("Username does not match");
    } else {
      handleDeleteUser();
      const userId = auth.currentUser?.displayName ?? null;

      if (userId) {
        try {
          await deleteDoc(doc(db, "usernames", userId));
          navigate("/");
        } catch (e) {
          console.log("Error deleting username");
        }
      }
    }
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <Card shadow="sm" className="shadow-gray-100/10">
            <CardBody>
              <div className="justify-center md:flex">
                <div className="flex md:hidden justify-center">
                  <Tabs
                    aria-label="Options"
                    variant="underlined"
                    selectedKey={tab}
                    onSelectionChange={(key: React.Key) =>
                      setTab(key.toString())
                    }
                    size="sm"
                  >
                    <Tab key="account" title="Account"></Tab>
                    <Tab key="preferences" title="Preferences"></Tab>
                    <Tab key="password" title="Password"></Tab>
                    <Tab key="delete" title="Delete"></Tab>
                  </Tabs>
                </div>
                <div className="hidden md:flex">
                  <div className="h-full text-lg space-y-2 border border-r-2 border-y-0 border-l-0 py-2 w-[140px] pr-2 border-black/10 dark:border-white/10">
                    <Button
                      variant="light"
                      color={tab === "account" ? "primary" : "default"}
                      className="w-full font-semibold justify-start"
                      onClick={() => setTab("account")}
                    >
                      Account
                    </Button>
                    <Button
                      variant="light"
                      color={tab === "preferences" ? "primary" : "default"}
                      className="w-full font-semibold justify-start"
                      onClick={() => setTab("preferences")}
                    >
                      Preferences
                    </Button>

                    <Button
                      variant="light"
                      color={tab === "password" ? "primary" : "default"}
                      className="w-full font-semibold justify-start"
                      onClick={() => setTab("password")}
                    >
                      Password
                    </Button>
                    <Button
                      variant="light"
                      color={tab === "delete" ? "danger" : "danger"}
                      className="w-full font-semibold justify-start"
                      onClick={() => setTab("delete")}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
                {tab === "account" ? (
                  <div className="flex flex-col justify-start items-start space-y-4 w-full px-4 my-4">
                    <div className="space-y-4 items-center w-full"></div>
                    <p className="text-xl font-semibold">
                      Change Profile Picture
                    </p>
                    <div className="items-center flex space-x-2">
                      <Avatar
                        src={auth.currentUser?.photoURL ?? ""}
                        size="lg"
                      />
                      <Button
                        variant="flat"
                        size="md"
                        onClick={handleButtonClick}
                        className="font-semibold"
                      >
                        <FaEdit /> Change Profile Picture
                      </Button>
                    </div>
                    <div className="space-y-4 w-full">
                      <Divider className="w-full" />

                      <p className="text-xl font-semibold">
                        Change Email Address - Coming Soon
                      </p>

                      <p className="text-sm">
                        Current Email: {auth.currentUser?.email}
                      </p>

                      <Input
                        isDisabled
                        type="email"
                        variant="bordered"
                        size="md"
                        labelPlacement="outside"
                        placeholder="Enter your new email"
                        isInvalid={emailInvalid}
                        errorMessage={
                          emailInvalid ? "Please enter a valid email" : null
                        }
                        onValueChange={setEmail}
                        ref={emailRef}
                        className="w-60"
                      />
                      <Button
                        isDisabled
                        variant="solid"
                        size="md"
                        color="primary"
                        className="font-semibold"
                        onClick={handleChangeEmail}
                      >
                        <FaEdit /> Change Email
                      </Button>
                    </div>

                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    {/* <div className="space-y-2">
                      <Checkbox defaultSelected>
                        <p className="text-sm flex items-center">
                          <FaLock className="mx-1" />
                          Private Account
                        </p>
                        <p className="text-xs text-black/50 dark:text-white/50">
                          Toggling on will hide your account and sets from
                          search
                        </p>
                      </Checkbox>
                    </div> */}
                  </div>
                ) : null}
                {tab === "preferences" ? (
                  <div className="flex flex-col justify-start items-start space-y-3 w-full px-4 my-4">
                    <div className="py-2">
                      <p className="font-semibold text-xl pb-4">
                        Toggle Dark Mode
                      </p>
                      <Switch
                        defaultSelected
                        size="md"
                        color="primary"
                        thumbIcon={({ isSelected, className }) =>
                          isSelected ? (
                            <LuMoon className={className} />
                          ) : (
                            <LuSun className={className} />
                          )
                        }
                        isSelected={theme === "dark" ? true : false}
                        onChange={() => changeTheme()}
                      >
                        Current mode: {theme}
                      </Switch>
                    </div>
                  </div>
                ) : null}

                {tab === "password" ? (
                  <div className="flex flex-col justify-start items-start space-y-3 w-full px-4 my-4">
                    <p className="font-semibold text-xl">Change Password</p>
                    <div className="">
                      <Input
                        label="New Password"
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Enter your password"
                        variant="bordered"
                        size="md"
                        ref={passRef}
                        labelPlacement="outside"
                        className="pt-2"
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
                      <Input
                        label="Retype New Password"
                        type={isPasswordVisible2 ? "text" : "password"}
                        placeholder="Enter your password"
                        variant="bordered"
                        size="md"
                        ref={passRef2}
                        className="py-4"
                        labelPlacement="outside"
                        endContent={
                          <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility2}
                          >
                            {isPasswordVisible2 ? (
                              <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <FaEye className="text-2xl text-default-400 pointer-events-none" />
                            )}
                          </button>
                        }
                      />
                      <Button
                        color="primary"
                        className="font-semibold"
                        onClick={handleChangePassword}
                      >
                        Change Password
                      </Button>
                    </div>
                  </div>
                ) : null}
                {tab === "delete" ? (
                  <div className="flex flex-col justify-start items-start space-y-3 w-full px-4 my-4">
                    <p className="font-semibold text-xl">Delete Your Account</p>
                    <div className=" w-full justify-start items-start flex">
                      <Button
                        color="danger"
                        className="font-semibold"
                        variant="solid"
                        size="md"
                        onClick={onOpen}
                      >
                        Delete Account
                      </Button>
                      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent className="text-black dark:text-gray-100">
                          {(onClose) => (
                            <>
                              <ModalHeader className="flex flex-col gap-1">
                                Delete Account
                              </ModalHeader>
                              <ModalBody>
                                <p>
                                  We're sorry to see you go! Before you proceed,
                                  please take a moment to consider the
                                  following:<br></br> <br></br>1. Deleting your
                                  account will permanently remove all your data,
                                  including study materials and progress.
                                  <br></br>
                                  <br></br> 2. This action cannot be undone.
                                  Once deleted, your account cannot be
                                  recovered.<br></br>
                                </p>
                                <p className="pt-4 font-semibold">
                                  Please type in your username to confirm
                                  deletion: {auth.currentUser?.displayName}
                                </p>
                                <Input
                                  size="lg"
                                  labelPlacement="outside"
                                  placeholder="Enter your username"
                                  ref={deleteRef}
                                  value={deleteUsername}
                                  onValueChange={setDeleteUsername}
                                />
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  color="primary"
                                  variant="light"
                                  onPress={onClose}
                                  className="font-semibold"
                                >
                                  Close
                                </Button>
                                <Button
                                  color="danger"
                                  onPress={handleDeleteAccount}
                                  className="font-semibold"
                                >
                                  Delete Account
                                </Button>
                              </ModalFooter>
                            </>
                          )}
                        </ModalContent>
                      </Modal>
                    </div>
                  </div>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

import { FaMagnifyingGlass } from "react-icons/fa6";
import { useUserContext } from "../context/userContext";
import AvatarContainer from "./AvatarContainer";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Link } from "react-router-dom";

import { useNavigate } from "react-router-dom";
import "react-modern-drawer/dist/index.css";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import StuduckyLogo from "../assets/StuduckyIcon.svg";
import StuduckyLogoDark from "../assets/studuckylogo-dark.svg";

import StuduckyCircleLogo from "../assets/StuduckyCircle.svg";
import { FaFolder } from "react-icons/fa6";
import { HiSquare2Stack } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa";
import { auth, db } from "../firebase";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "sonner";

const NavigationMenu = () => {
  const [searchInput, setSearchInput] = useState("");
  const [colorSelected, setColorSelected] = useState("zinc");
  const [isCreating, setIsCreating] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [didLookForUser, setDidLookForUser] = useState(false);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const {
    isOpen: isOpenReportModal,
    onOpen: onOpenReportModal,
    onOpenChange: onOpenChangeReportModal,
    onClose: OnCloseReportModal,
  } = useDisclosure();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      setDidLookForUser(true);
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  const colors = [
    "zinc",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "teal",
    "cyan",
    "blue",
    "indigo",
    "violet",
    "fuchsia",
    "pink",
    "rose",
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    // Optionally, you can perform additional actions here
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Additional handling, such as triggering the search
    if (searchInput.length <= 0) {
      return;
    }

    const containsSearch = location.pathname.includes("search");
    if (!containsSearch) {
      navigate(`/search/sets/${searchInput}`);
    } else {
      if (location.pathname.includes("sets")) {
        navigate(`/search/sets/${searchInput}`);
      } else if (location.pathname.includes("users")) {
        navigate(`/search/users/${searchInput}`);
      }
    }
  };

  const createNewFolder = async () => {
    console.log("Create folder");

    if (!isCreating) {
      setIsCreating(true);
    } else {
      return;
    }

    const userID: string | null = auth.currentUser?.uid ?? null;

    if (userID === null) {
      return;
    }

    try {
      await addDoc(collection(db, "users", userID, "folders"), {
        folderName: folderName,
        folderColor: colorSelected,
      });
    } catch (e) {
      console.error("Error adding document: ", e);

      return;
    }

    setIsCreating(false);
    setColorSelected("zinc");
    setFolderName("");
    navigate("/sets/folders");
    toast.success("Successfully created folder");
    OnCloseReportModal();
  };

  const handleOpenFolderModal = () => {
    if (user) {
      onOpenReportModal();
    } else {
      toast.warning("Please log in to create a new folder");
    }
  };

  const handleCreateStudySet = () => {
    if (user) {
      navigate("/create/new");
    } else {
      toast.warning("Please log in to create a new set");
    }
  };

  return (
    <div className=" bg-gray-100 text-black dark:text-gray-100 py-1 dark:bg-dark-2">
      <div className="flex justify-between px-4 py-1 pb-3 mx-auto max-w-[1200px]">
        <div className=" space-y-2 w-full block lg:hidden">
          <div className="flex lg:hidden relative justify-between px-1 py-1 items-center space-x-2 w-full ">
            <div className="flex space-x-1">
              <Sidebar />
              <img src={StuduckyCircleLogo} alt="Logo" className="w-11" />
            </div>
            <div>
              {didLookForUser ? (
                <div className="space-x-2 flex">
                  {user ? (
                    <AvatarContainer />
                  ) : (
                    <div className="space-x-2">
                      <Button
                        color="default"
                        variant="light"
                        className="font-semibold"
                        radius="md"
                        to={"/login"}
                        as={Link}
                      >
                        Login
                      </Button>
                      <Button
                        color="primary"
                        className="font-semibold px-5"
                        size="md"
                        to={"/signup"}
                        as={Link}
                      >
                        Sign up
                      </Button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex lg:hidden relative w-full justify-center">
            <form onSubmit={handleSubmit} className="w-full mx-2">
              <Button
                type="submit"
                className="absolute left-[8px] top-1/2 transform -translate-y-1/2 rounded-l-full rounded-r-none"
                radius="full"
                isIconOnly
                variant="light"
                size="md"
              >
                <FaMagnifyingGlass />
              </Button>

              <input
                placeholder="Search sets, users"
                className="description w-full  rounded-full pl-12"
                type="text"
                onChange={handleInputChange}
              />
              {/* <input type="submit" className="hidden" /> */}
            </form>
          </div>
        </div>

        <div className="lg:hidden"> </div>
        {/* <div className="md:hidden">
          {/* <img src={StuduckyCircleLogo} alt="Logo" className="w-12 mr-2" /> */}
        {/* </div> */}
        <div className="items-center hidden lg:flex">
          <button onClick={() => navigate("/")} className="flex items-center">
            {/* <StuduckyLogo /> */}

            <img
              src={StuduckyLogoDark}
              alt="Logo"
              className="w-36 hidden dark:block"
            />

            <img src={StuduckyLogo} alt="Logo" className="w-36 dark:hidden" />
          </button>

          <div className="space-x-2">
            <div className="px-4 flex space-x-6">
              <Button
                to={"/sets/recents"}
                as={Link}
                className="font-semibold text-sm flex items-center"
                variant="light"
              >
                Your Sets
              </Button>

              <Dropdown className="dropdown">
                <DropdownTrigger>
                  {/* <button className="font-semibold text-sm flex items-center ">
                    Create <FaAngleDown className="text-sm ml-1" />
                  </button> */}

                  <Button
                    isIconOnly
                    color="primary"
                    radius="full"
                    variant="solid"
                    size="md"
                  >
                    <FaPlus />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Static Actions"
                  className="text-black/80 dark:text-white/80"
                >
                  <DropdownItem
                    key="new"
                    onClick={() => handleCreateStudySet()}
                  >
                    <div className="flex space-x-2 items-center">
                      <HiSquare2Stack className="w-4 h-4" />
                      <p>Study Set</p>
                    </div>
                  </DropdownItem>
                  <DropdownItem key="copy" onPress={handleOpenFolderModal}>
                    <div className="flex space-x-2 items-center">
                      <FaFolder className="w-4 h-4" />
                      <p>Folder</p>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Modal
                isOpen={isOpenReportModal}
                onOpenChange={onOpenChangeReportModal}
                size="sm"
              >
                <ModalContent className="text-black dark:text-gray-100">
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Create new folder
                      </ModalHeader>
                      <ModalBody>
                        {/* <p className="text-sm font-semibold">Folder name</p> */}
                        <Input
                          type="text"
                          labelPlacement="outside"
                          placeholder="Folder name"
                          // value={folderName}
                          variant="faded"
                          color="primary"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFolderName(e.target.value)
                          }
                        />
                        <div></div>
                        <div className="flex flex-wrap justify-start">
                          {colors.map((color, num) => (
                            <button
                              key={num}
                              onClick={() => setColorSelected(color)}
                              className={`bg-${color}-500 h-7 w-7 my-1 rounded-full mx-1 mb-1 ${
                                colorSelected === color
                                  ? "outline outline-4 outline-yellow-400 duration-100"
                                  : "outline-yellow-400"
                              }`}
                            ></button>
                          ))}
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                          className="font-semibold"
                        >
                          Close
                        </Button>
                        <Button
                          color="primary"
                          onPress={() => createNewFolder()}
                          className="font-semibold"
                        >
                          Create
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </div>
          <div className="flex items-center relative mx-2">
            <form onSubmit={handleSubmit}>
              <Button
                type="submit"
                className="absolute left-[0px] top-1/2 transform -translate-y-1/2 rounded-l-full rounded-r-none"
                radius="full"
                isIconOnly
                variant="light"
                size="md"
              >
                <FaMagnifyingGlass />
              </Button>
              <input
                placeholder="Search sets, users"
                className="description md:w-[280px] xl:w-[400px] rounded-full pl-12"
                type="text"
                onChange={handleInputChange}
              />
            </form>
          </div>
        </div>
        {/* <div className="flex md:hidden"></div> */}
        {didLookForUser ? (
          <div className="space-x-2 lg:flex items-center hidden">
            {user ? (
              <AvatarContainer />
            ) : (
              <div className="space-x-2">
                <Button
                  to={"/login"}
                  as={Link}
                  color="default"
                  variant="light"
                  className="font-semibold"
                  radius="md"
                >
                  Login
                </Button>
                <Button
                  color="primary"
                  className="font-semibold px-5"
                  size="md"
                  to={"/signup"}
                  as={Link}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default NavigationMenu;

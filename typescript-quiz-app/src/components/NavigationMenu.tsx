import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useUserContext } from "../context/userContext";
import AvatarContainer from "./AvatarContainer";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

import { useNavigate } from "react-router-dom";
import "react-modern-drawer/dist/index.css";
import Sidebar from "./Sidebar";
import { useState } from "react";
import StuduckyLogo from "../assets/StuduckyIcon.svg";
import StuduckyCircleLogo from "../assets/StuduckyCircle.svg";
import { FaFolder } from "react-icons/fa6";
import { HiSquare2Stack } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa";

const NavigationMenu = () => {
  const [searchInput, setSearchInput] = useState("");
  const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { user } = useUserContext();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    // Optionally, you can perform additional actions here
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Additional handling, such as triggering the search
    navigate(`/search/${searchInput}`);
  };

  return (
    <div className=" bg-gray-100 text-black dark:text-gray-100 py-1 dark:bg-dark-2">
      <div className="flex justify-between px-4 py-1 pb-3 mx-auto max-w-[1200px]">
        <div className="flex md:hidden relative justify-center items-center space-x-4">
          <Sidebar />
        </div>
        <div className="md:hidden"> </div>
        <div className="md:hidden">
          <img src={StuduckyCircleLogo} alt="Logo" className="w-12 mr-2" />
        </div>
        <div className="items-center hidden md:flex">
          <button className="flex items-center" onClick={() => navigate("/")}>
            {/* <StuduckyLogo /> */}

            <img src={StuduckyLogo} alt="Logo" className="w-36" />
            {/* <Chip className="mx-2 h-6 px-0 bg-dark-2 text-white dark:bg-white dark:text-black rounded-[4px]">
              <p className="font-semibold  text-xs">Beta</p>
            </Chip> */}
          </button>

          <div className="space-x-2">
            <div className="px-4 flex space-x-6">
              <button
                className="font-semibold text-sm flex items-center"
                onClick={() => navigate("/sets/recents")}
              >
                Your Sets
              </button>

              <Dropdown>
                <DropdownTrigger>
                  {/* <button className="font-semibold text-sm flex items-center ">
                    Create <FaAngleDown className="text-sm ml-1" />
                  </button> */}
                  <Button
                    isIconOnly
                    color="primary"
                    className="rounded-full"
                    variant="solid"
                  >
                    <FaPlus className="w-4 h-4" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Static Actions"
                  className="text-black/80 dark:text-white/80"
                >
                  <DropdownItem
                    key="new"
                    onClick={() => navigate("/create/new")}
                  >
                    <div className="flex space-x-2 items-center">
                      <HiSquare2Stack className="w-4 h-4" />
                      <p>Study Set</p>
                    </div>
                  </DropdownItem>
                  <DropdownItem key="copy">
                    <div className="flex space-x-2 items-center">
                      <FaFolder className="w-4 h-4" />
                      <p>Folder</p>
                    </div>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          <div className="flex items-center relative mx-2">
            <form onSubmit={handleSubmit}>
              <FaMagnifyingGlass className="w-4 h-4 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                placeholder="Search sets, users"
                className="description md:w-[280px] xl:w-[400px] rounded-full pl-12"
                type="text"
                onChange={handleInputChange}
              />
              <input type="submit" className="hidden" />
            </form>
          </div>
        </div>
        <div></div>
        <div className="space-x-2 flex items-center">
          {user ? (
            <AvatarContainer />
          ) : (
            <div className="space-x-2">
              <SignInModal
                isLogInModalOpen={isLogInModalOpen}
                setIsLogInModalOpen={setIsLogInModalOpen}
                isSignUpModalOpen={isSignUpModalOpen}
                setIsSignUpModalOpen={setIsSignUpModalOpen}
              />
              <SignUpModal
                isLogInModalOpen={isLogInModalOpen}
                setIsLogInModalOpen={setIsLogInModalOpen}
                isSignUpModalOpen={isSignUpModalOpen}
                setIsSignUpModalOpen={setIsSignUpModalOpen}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;

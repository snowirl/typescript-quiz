import { Switch, Chip } from "@nextui-org/react";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { useTheme } from "next-themes";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useUserContext } from "../context/userContext";
import AvatarContainer from "./AvatarContainer";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import "react-modern-drawer/dist/index.css";
import logo from "../assets/logo2.png";
import textLogo from "../assets/Studucky.png";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const NavigationMenu = () => {
  const [searchInput, setSearchInput] = useState("");
  const { theme, setTheme } = useTheme();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();

  const changeTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

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
      <div className="flex justify-between px-4 py-3 mx-auto max-w-[1200px]">
        <div className="flex md:hidden relative">
          <Sidebar />
        </div>

        <div className="space-x-4 items-center hidden md:flex">
          <button className="flex items-center" onClick={() => navigate("/")}>
            <img src={textLogo} alt="Logo" className="w-20 hidden lg:block" />

            <img src={logo} alt="Logo" className="w-10" />
            <Chip className="mx-2 h-6 px-0 bg-dark-2 text-white dark:bg-white dark:text-black rounded-[4px]">
              <p className="font-semibold  text-xs">Beta</p>
            </Chip>
          </button>

          <div className="space-x-2">
            <Button
              color={`${
                location.pathname.includes("sets/") ? "primary" : "default"
              }`}
              onClick={() => navigate("/sets/recents")}
              className="font-semibold"
              variant="light"
            >
              Sets
            </Button>

            <Button
              color={"primary"}
              variant={`${
                location.pathname.includes("create/") ? "flat" : "flat"
              }`}
              onPress={() => navigate("/create/new")}
              className="font-semibold"
            >
              Create
            </Button>
          </div>
          <div className="flex items-center relative">
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
          <Switch
            aria-label="Automatic updates"
            size="sm"
            onClick={() => changeTheme()}
            isSelected={theme === "dark" ? true : false}
          />
          {user ? (
            <AvatarContainer />
          ) : (
            <div className="space-x-2">
              <SignInModal />
              <SignUpModal />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationMenu;

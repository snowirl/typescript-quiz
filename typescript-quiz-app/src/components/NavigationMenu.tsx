import { Switch, Tabs, Tab } from "@nextui-org/react";
import { Link } from "react-router-dom";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { useTheme } from "next-themes";
import { FaBars, FaXmark, FaMagnifyingGlass } from "react-icons/fa6";
import { useUserContext } from "../context/userContext";
import AvatarContainer from "./AvatarContainer";
import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { useLocation } from "react-router-dom";
import { Input } from "@nextui-org/react";
import logo from "../assets/logo2.png";
import Sidebar from "./Sidebar";

const NavigationMenu = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [tabKey, setTabKey] = useState("none");

  useEffect(() => {
    if (location.pathname.includes("sets")) {
      setTabKey("sets");
    } else if (location.pathname === "/") {
      setTabKey("home");
    } else {
      setTabKey("none");
    }
  }, [location]);

  const changeTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const handleCreateButtonMenu = () => {
    navigate("/create/new");
    setOpen(false);
  };

  const handleTabButton = (key: React.Key) => {
    if (key === "sets") {
      navigate("/sets/recents");
    } else if (key === "home") {
      navigate("/");
    }
  };

  return (
    <div className=" bg-gray-100 text-black dark:text-gray-100 py-1 dark:bg-[#0f0f11]">
      <div className="flex justify-between px-4 py-3 mx-auto max-w-[1200px]">
        <div className="flex md:hidden relative">
          <Sidebar />
        </div>

        <div className="space-x-4 items-center hidden md:flex">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
          <div className="space-x-2">
            <Button
              variant="light"
              onPress={() => navigate("/create/new")}
              className="font-semibold"
            >
              Home
            </Button>
            <Button
              variant="light"
              onPress={() => navigate("/sets/recents")}
              className="font-semibold"
            >
              Sets
            </Button>

            <Button
              color="primary"
              variant="solid"
              onPress={() => navigate("/create/new")}
              className="font-semibold"
            >
              Create
            </Button>
          </div>
          <div className="flex items-center">
            <Input
              variant="bordered"
              placeholder="Search sets, users"
              className="bg-white dark:bg-dark-1 w-auto lg:w-[300px]"
              type="text"
              color="primary"
              startContent={<FaMagnifyingGlass className="w-5 h-5" />}
            />
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

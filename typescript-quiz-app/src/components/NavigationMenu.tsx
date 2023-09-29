import { Switch } from "@nextui-org/react";
import { Link } from "react-router-dom";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import { useTheme } from "next-themes";
import { FaBars } from "react-icons/fa6";
import { useUserContext } from "../context/userContext";
import AvatarContainer from "./AvatarContainer";

const NavigationMenu = () => {
  const { theme, setTheme } = useTheme();
  const { user } = useUserContext();

  const changeTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  return (
    <div className=" bg-gray-100 text-black dark:text-gray-100 py-1 dark:bg-[#0f0f11]">
      <div className="flex justify-between px-4 py-3 mx-auto max-w-[1200px]">
        <div className="flex md:hidden relative">
          <button className="icon-btn px-2.5">
            <FaBars className="w-5 h-5" />
          </button>
        </div>
        <div className="space-x-4 items-center hidden md:flex">
          <Link to="/">
            <button className="text-sm px-4 py-3 font-semibold">Home</button>
          </Link>
          <Link to="sets">
            <p className="text-sm px-4 py-3 font-semibold">Sets</p>
          </Link>

          <Link to="/create/new">
            <button className="text-sm px-4 py-3 font-semibold">Create</button>
          </Link>
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

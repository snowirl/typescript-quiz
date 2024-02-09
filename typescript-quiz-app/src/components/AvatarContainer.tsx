import { auth } from "../firebase";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import { useUserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  LuSun,
  LuMoon,
  LuSettings,
  LuLogOut,
  LuUserCircle,
} from "react-icons/lu";

const AvatarContainer = () => {
  const { logOutUser } = useUserContext();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const changeTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };
  return (
    <div>
      <div className="flex justify-center items-center space-x-2">
        <p className="font-semibold text-sm">{auth.currentUser?.displayName}</p>
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              showFallback={auth.currentUser?.photoURL ? false : true}
              src={auth.currentUser?.photoURL ?? ""}
              className="cursor-pointer"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            className="text-black dark:text-gray-100 font-bold text-lg"
            variant="solid"
          >
            <DropdownItem
              key="new"
              className="font-semibold"
              onClick={() =>
                navigate(`/profile/${auth.currentUser?.displayName}`)
              }
            >
              <div className="flex items-center space-x-2">
                <LuUserCircle />
                <p>Profile</p>
              </div>
            </DropdownItem>
            <DropdownItem key="dark" onClick={() => changeTheme()}>
              {theme === "dark" ? (
                <div className="flex items-center space-x-2">
                  <LuSun />
                  <p>Light mode</p>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <LuMoon />
                  <p>Dark mode</p>
                </div>
              )}
            </DropdownItem>
            <DropdownItem key="copy" onClick={() => navigate("/settings")}>
              <div className="flex items-center space-x-2">
                <LuSettings />
                <p>Settings</p>
              </div>
            </DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              onClick={() => logOutUser()}
            >
              <div className="flex items-center space-x-2">
                <LuLogOut />
                <p>Sign out</p>
              </div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default AvatarContainer;

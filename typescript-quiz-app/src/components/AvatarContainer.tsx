import { auth } from "../firebase";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import { useUserContext } from "../context/userContext";

const AvatarContainer = () => {
  const { logOutUser } = useUserContext();
  return (
    <div>
      <div className="flex justify-center items-center space-x-2">
        <p className="font-semibold text-sm">{auth.currentUser?.displayName}</p>
        <Dropdown>
          <DropdownTrigger>
            <Avatar
              showFallback
              src="https://images.unsplash.com/broken"
              className="cursor-pointer"
            />
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Static Actions"
            className="text-black dark:text-gray-100 font-bold text-lg"
          >
            <DropdownItem key="new" className="font-semibold">
              Profile
            </DropdownItem>
            <DropdownItem key="copy">Settings</DropdownItem>
            <DropdownItem
              key="delete"
              className="text-danger"
              color="danger"
              onClick={() => logOutUser()}
            >
              Sign out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </div>
  );
};

export default AvatarContainer;

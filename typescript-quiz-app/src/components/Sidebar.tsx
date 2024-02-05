import Drawer from "react-modern-drawer";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import { FaXmark, FaBars } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateButtonMenu = () => {
    setOpen(false);
    navigate("create/new");
  };

  const handleYourSetsButton = () => {
    setOpen(false);
    navigate("sets/recents");
  };

  const handleHome = () => {
    setOpen(false);
    navigate("/");
  };

  return (
    <div>
      <Button
        isIconOnly
        variant="light"
        radius="full"
        size="lg"
        className=""
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaBars className="w-5 h-5" />
      </Button>

      <Drawer open={open} direction="left" className="">
        <div className="text-left text-base px-4 bg-white dark:bg-dark-1 h-full">
          <div className="text-left pt-2 pb-4">
            <Button
              className="icon-btn"
              onClick={() => setOpen(false)}
              isIconOnly
              variant="light"
              radius="full"
              size="lg"
            >
              <FaXmark className="w-5 h-5" />
            </Button>
          </div>
          <div className="w-full space-y-3">
            <Button
              className="font-semibold w-full text-left justify-start"
              onClick={() => handleHome()}
              variant="light"
              size="lg"
            >
              Home
            </Button>
            <Button
              className="font-semibold w-full text-left justify-start"
              onClick={() => handleYourSetsButton()}
              variant="light"
              size="lg"
            >
              Your sets
            </Button>
            <Button
              className="font-semibold w-full text-left justify-start"
              onClick={() => handleCreateButtonMenu()}
              variant="solid"
              color="primary"
              size="lg"
            >
              Create new set
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;

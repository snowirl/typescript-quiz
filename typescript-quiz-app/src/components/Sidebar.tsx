import Drawer from "react-modern-drawer";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import { FaXmark, FaBars } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [tabKey, setTabKey] = useState("none");

  return (
    <div>
      <Button
        isIconOnly
        variant="light"
        radius="full"
        onClick={() => setOpen((prev) => !prev)}
      >
        <FaBars className="w-5 h-5" />
      </Button>

      <Drawer open={open} direction="left" className="">
        <div className="text-left text-base px-4 bg-white dark:bg-dark-1 h-full">
          <div className="text-left pt-2">
            <button className="icon-btn" onClick={() => setOpen(false)}>
              <FaXmark className="w-5 h-5" />
            </button>
          </div>
          <div className="w-full">
            <Link to="/">
              <button
                className=" px-4 py-3 font-semibold"
                onClick={() => setOpen(false)}
              >
                Home
              </button>
            </Link>
          </div>
          <div>
            <Link to="/sets">
              <button
                className=" px-4 py-3 font-semibold"
                onClick={() => setOpen(false)}
              >
                Sets
              </button>
            </Link>
          </div>
          <div className="w-full">
            <Button
              color="primary"
              className="px-4 py-3 font-semibold w-full text-base"
              // onClick={() => handleCreateButtonMenu()}
            >
              Create
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Sidebar;

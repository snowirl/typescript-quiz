import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { Button } from "@nextui-org/react";

const SetOptionsButton = () => {
  return (
    <div>
      <Button
        isIconOnly
        variant="light"
        size="sm"
        className=" hover:text-blue-600"
      >
        <IoEllipsisHorizontalSharp className="w-5 h-5 " />
      </Button>
    </div>
  );
};

export default SetOptionsButton;

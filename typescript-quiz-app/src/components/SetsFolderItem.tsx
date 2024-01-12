import { FaFolder } from "react-icons/fa6";
import { Card, CardBody, Button } from "@nextui-org/react";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { Chip } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface SetsFolderItemProps {
  folderName: string;
  folderColor: string;
  folderID: string;
}

const SetsFolderItem = (props: SetsFolderItemProps) => {
  return (
    <div className="mx-2 my-2 cursor-pointer">
      <Card shadow="sm">
        <CardBody className="py-3 flex space-y-3">
          <div className="flex items-center space-x-2 mr-8">
            <FaFolder className={`h-6 w-6 text-${props.folderColor}-500`} />
            <p className="text-sm overflow-ellipsis overflow-hidden line-clamp-1">
              {props.folderName}
            </p>

            <Dropdown>
              <DropdownTrigger>
                <Button
                  size="sm"
                  isIconOnly
                  aria-label="Folder settings"
                  className="absolute right-2"
                  radius="md"
                  variant="light"
                >
                  <IoEllipsisHorizontalSharp className="w-5 h-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                className="text-black/80 dark:text-white/80 max-w-[200px]"
              >
                <DropdownItem key="new" startContent={<FaEdit />}>
                  Edit
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                  startContent={<FaTrash />}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <Chip size="sm">2 sets</Chip>
        </CardBody>
      </Card>
    </div>
  );
};

export default SetsFolderItem;

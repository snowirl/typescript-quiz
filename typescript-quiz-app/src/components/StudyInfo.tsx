import { Card, CardHeader, CardBody } from "@nextui-org/react";
import {
  IoEllipsisHorizontalSharp,
  IoShareOutline,
  IoWarningOutline,
} from "react-icons/io5";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
} from "@nextui-org/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FaFolderPlus, FaRegCopy } from "react-icons/fa6";

interface StudyInfoProps {
  username: string;
  description: string;
  profilePictureURL: string;
}

const StudyInfo = (props: StudyInfoProps) => {
  return (
    <Card radius="lg" className="p-1" shadow="md">
      <CardHeader>
        <div className="flex justify-around flex-grow">
          <div className="flex-grow text-left">
            <div className="flex space-x-2 items-center">
              <Avatar
                showFallback
                src={props.profilePictureURL}
                className="cursor-pointer"
              />
              <p className="font-semibold">{props.username}</p>
            </div>
          </div>
          <div className="flex-grow flex justify-end">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="md" radius="full" variant="light">
                  <IoEllipsisHorizontalSharp className="w-5 h-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Static Actions"
                className="text-black dark:text-white space-y-0"
              >
                <DropdownItem key="edit" startContent={<FaEdit />}>
                  Edit
                </DropdownItem>
                <DropdownItem key="folder" startContent={<FaFolderPlus />}>
                  Add to folder
                </DropdownItem>
                <DropdownItem key="copy" startContent={<FaRegCopy />}>
                  Create a copy
                </DropdownItem>
                <DropdownItem key="share" startContent={<IoShareOutline />}>
                  Share
                </DropdownItem>
                <DropdownItem
                  color="warning"
                  key="report"
                  variant="flat"
                  startContent={<IoWarningOutline />}
                >
                  Report
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
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-sm">{props.description}</p>
      </CardBody>
    </Card>
  );
};

export default StudyInfo;

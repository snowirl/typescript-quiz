import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Avatar,
} from "@nextui-org/react";

interface StudyInfoProps {
  username: string;
  description: string;
  profilePictureURL: string;
}

const StudyInfo = (props: StudyInfoProps) => {
  return (
    <Card className="rounded-lg" shadow="md">
      <CardHeader className="py-2">
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
                className="text-black dark:text-white"
              >
                <DropdownItem key="new">New file</DropdownItem>
                <DropdownItem key="copy">Copy link</DropdownItem>
                <DropdownItem key="edit">Edit file</DropdownItem>
                <DropdownItem
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  Delete file
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

import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

interface StudyInfoProps {
  username: string;
  description: string;
}

const StudyInfo = (props: StudyInfoProps) => {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <div className="flex justify-around flex-grow px-2">
          <div className="flex-grow text-left">
            <p className="text-sm">Created by</p>
            <p className="font-bold">{props.username}</p>
          </div>
          <div className="flex-grow flex justify-end">
            <Dropdown>
              <DropdownTrigger>
                <button className="icon-btn  py-0 px-1.5">
                  <IoEllipsisHorizontalSharp className="w-8 h-6" />
                </button>
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
        <p className="pt-2 text-sm">{props.description}</p>
      </CardBody>
    </Card>
  );
};

export default StudyInfo;

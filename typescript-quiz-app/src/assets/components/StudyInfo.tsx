import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

const StudyInfo = () => {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <div className="flex justify-around flex-grow px-2">
          <div className="flex-grow text-left">
            <p className="text-sm">Created by</p>
            <p className="font-bold">Spencer</p>
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
        <p className="pt-2 text-sm">
          As a recovering avoidant, I can tell you that I had been totally
          capable of romantic commitment and was always in long-term
          relationships that lasted from 2-8 years. The issue with avoidants
          isn't that they don't love their partners. Still, when the heat gets
          turned up and they feel anxiety, their default coping mechanism is to
          avoid and find alone time away from the source of anxiety (which a lot
          of time is, unfortunately, their partner). More clingy, naggy demands
          will make them retreat even more. Let them be to go to their cave and
          find stability, then they'll come out once they clear their head.
        </p>
      </CardBody>
    </Card>
  );
};

export default StudyInfo;

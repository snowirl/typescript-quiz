import { FaFolder } from "react-icons/fa6";
import { Card, CardBody } from "@nextui-org/react";

interface SetsFolderItemProps {
  folderName: string;
  folderColor: string;
  folderID: string;
}

const SetsFolderItem = (props: SetsFolderItemProps) => {
  return (
    <div className="mx-2 my-2 cursor-pointer">
      <Card shadow="sm">
        <CardBody className="py-3">
          <div className="flex items-center space-x-2">
            <FaFolder className={`h-6 w-6 text-${props.folderColor}-500`} />
            <p className="text-sm">{props.folderName}</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SetsFolderItem;

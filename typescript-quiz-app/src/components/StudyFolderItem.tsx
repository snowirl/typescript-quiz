import { FaFolder } from "react-icons/fa6";
import { Button } from "@nextui-org/react";

interface StudyFolderItemProps {
  folderName: string;
  folderColor: string;
  folderID: string;
  selectedFolder: string | null;
  setSelectedFolder: React.Dispatch<React.SetStateAction<string | null>>;
}

const StudyFolderItem = (props: StudyFolderItemProps) => {
  return (
    <div className="cursor-pointer mx-2">
      <Button
        className=" w-full justify-start"
        variant={props.selectedFolder === props.folderID ? "solid" : "light"}
        onClick={() => props.setSelectedFolder(props.folderID)}
        color={props.selectedFolder === props.folderID ? "primary" : "default"}
      >
        <div className="flex items-center space-x-2 mr-8">
          <FaFolder className={`h-6 w-6 text-${props.folderColor}-500`} />
          <p className="text-sm overflow-ellipsis overflow-hidden line-clamp-1">
            {props.folderName}
          </p>
        </div>
      </Button>
    </div>
  );
};

export default StudyFolderItem;

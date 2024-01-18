import SetCard from "./SetCard";
import { FaFolder } from "react-icons/fa6";
import { DocumentData } from "firebase/firestore";

interface SetsFoldersContentsProps {
  selectedFolderData: DocumentData | undefined;
}

const SetsFolderContents = (props: SetsFoldersContentsProps) => {
  return (
    <div className="space-y-4 my-6 mx-4 text-left">
      <div className="flex space-x-2 items-center">
        <FaFolder
          className={`h-5 w-5 text-${props.selectedFolderData?.folderColor}-500`}
        />
        <p>{props.selectedFolderData?.folderName}</p>
      </div>
      {props.selectedFolderData?.sets !== undefined
        ? props.selectedFolderData.sets.map((id: string, index: number) => (
            <SetCard key={index} deckId={id}></SetCard>
          ))
        : null}
    </div>
  );
};

export default SetsFolderContents;

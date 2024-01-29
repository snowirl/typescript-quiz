import {
  IoEllipsisHorizontalSharp,
  IoShareOutline,
  IoWarningOutline,
} from "react-icons/io5";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import { FaFolderPlus, FaRegCopy, FaTrash } from "react-icons/fa6";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  doc,
  deleteDoc,
  DocumentData,
  arrayUnion,
  collection,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { useDisclosure } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useState } from "react";
import StudyFolderItem from "./StudyFolderItem";
import { useEffect } from "react";

interface SetOptionsButtonProps {
  username: string;
  deckId?: string | null;
}

const SetOptionsButton = (props: SetOptionsButtonProps) => {
  const userID = auth.currentUser?.displayName ?? null;
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [_isLoading, setIsLoading] = useState<boolean>(true);
  const [folderList, setFolderList] = useState<DocumentData | null>(null);
  const [folderIDs, setFolderIDs] = useState<DocumentData | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  useEffect(() => {
    if (!isFolderModalOpen) {
      return;
    }
    handleFindFolders();
  }, [isFolderModalOpen]);

  const editLink = () => {
    if (props.deckId) {
      navigate(`/create/${props.deckId}`);
    }
  };

  const deleteSet = async () => {
    if (
      props.deckId === null ||
      userID === null ||
      props.deckId === undefined
    ) {
      return;
    }
    const setRef = doc(db, "users", userID, "decks", props.deckId);

    try {
      await deleteDoc(setRef);
    } catch (e) {
      console.log("Error:  " + e);
      toast.error("Error deleting set.");
      onClose();
      return;
    }

    const cardRef = doc(db, "users", userID, "cards", props.deckId);

    try {
      await deleteDoc(cardRef);
    } catch (e) {
      console.log("Error:  " + e);
      toast.error("Error deleting set.");
      onClose();
      return;
    }

    onClose();
    toast.success("Deleted set.");
    console.log("deleted.");
  };

  const handleFindFolders = async () => {
    setSelectedFolder(null);

    if (userID === null) {
      console.log("User is null. Cannot find folders.");
      return;
    }

    let list: DocumentData = [];
    let idList: DocumentData = [];
    const setsRef = collection(db, "users", userID, "folders");
    const q = query(setsRef);

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
        idList.push(doc.id);
      });
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }

    console.log(list);
    console.log(userID);

    setFolderList(list);
    setFolderIDs(idList);
    setIsLoading(false);
  };

  const handleAddSetToFolder = async () => {
    if (userID === null || selectedFolder === null || props.deckId === null) {
      console.log("User is null. Cannot find folders.");
      return;
    }

    try {
      await setDoc(
        doc(db, "users", userID, "folders", selectedFolder),
        {
          sets: arrayUnion(props.deckId),
        },
        { merge: true }
      );
    } catch (e) {
      console.log(e);
    }

    setIsFolderModalOpen(false);
    toast.success("Added set to folder"),
      {
        toastId: "success1",
      };
  };

  const copyTextToClipBoard = () => {
    if (props.deckId !== null) {
      navigator.clipboard.writeText(
        window.location.origin + `/study/${props.deckId}`
      );
      toast.success("Set link copied to clipboard");
    } else {
      toast.error("Unable to copy set link, try again");
    }
  };

  return (
    <div>
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly variant="light" size="sm">
            <IoEllipsisHorizontalSharp className="w-5 h-5 " />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Static Actions"
          className="text-black dark:text-white space-y-0"
        >
          <DropdownItem
            key="edit"
            startContent={<FaEdit />}
            className={userID === props.username ? "flex" : "hidden"}
            onPress={editLink}
          >
            Edit
          </DropdownItem>
          <DropdownItem
            key="folder"
            startContent={<FaFolderPlus />}
            onPress={() => setIsFolderModalOpen(true)}
          >
            Add to folder
          </DropdownItem>
          <DropdownItem key="copy" startContent={<FaRegCopy />}>
            Create a copy
          </DropdownItem>
          <DropdownItem
            key="share"
            startContent={<IoShareOutline />}
            onClick={copyTextToClipBoard}
          >
            Share
          </DropdownItem>
          <DropdownItem
            color="warning"
            key="report"
            variant="flat"
            startContent={<IoWarningOutline />}
            isDisabled={true}
          >
            Report
          </DropdownItem>
          <DropdownItem
            key="delete"
            className={
              userID === props.username ? "flex text-danger" : "hidden"
            }
            color="danger"
            startContent={<FaTrash />}
            onPress={() => onOpen()}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black dark:text-white font-bold">
                Delete set
              </ModalHeader>
              <ModalBody>
                <p className="text-zinc-700 dark:text-zinc-200 font-semibold">
                  Are you sure you want to delete this set?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={onClose}
                  className="font-semibold"
                >
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => deleteSet()}
                  className="font-semibold"
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isFolderModalOpen}
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black dark:text-white bg-gray-100 dark:bg-dark-2">
                Add to folder
              </ModalHeader>
              <ModalBody className="bg-gray-100 dark:bg-dark-2">
                <div className="space-y-2 grid grid-cols-1 items-start max-h-[400px] overflow-y-auto">
                  {folderList !== null ? (
                    folderList
                      // .slice(recentsIndex * 5, recentsIndex * 5 + 5)
                      .map((folder: DocumentData, index: number) => (
                        <StudyFolderItem
                          folderName={folder.folderName}
                          folderColor={folder.folderColor}
                          key={index}
                          folderID={
                            folderIDs !== null ? folderIDs[index] : "Error"
                          }
                          selectedFolder={selectedFolder}
                          setSelectedFolder={setSelectedFolder}
                        />
                      ))
                  ) : (
                    <Spinner />
                  )}
                </div>
              </ModalBody>
              <ModalFooter className=" bg-gray-100 dark:bg-dark-2">
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => setIsFolderModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={handleAddSetToFolder}
                  isDisabled={selectedFolder === null ? true : false}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SetOptionsButton;

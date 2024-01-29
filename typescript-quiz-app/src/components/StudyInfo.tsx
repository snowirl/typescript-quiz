import { Card, CardHeader, CardBody, Spinner } from "@nextui-org/react";
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import {
  DocumentData,
  collection,
  query,
  getDocs,
  doc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import StudyFolderItem from "./StudyFolderItem";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import SetOptionsButton from "./SetOptionsButton";

interface StudyInfoProps {
  username: string;
  description: string;
  profilePictureURL: string;
  deckId: string | null;
}

const StudyInfo = (props: StudyInfoProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [_isLoading, setIsLoading] = useState<boolean>(true);
  const [folderList, setFolderList] = useState<DocumentData | null>(null);
  const [folderIDs, setFolderIDs] = useState<DocumentData | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const userID = auth.currentUser?.displayName ?? null;
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      handleFindFolders();
    }
  }, [isOpen]);

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

    onClose();
    toast.success("Added set to folder"),
      {
        toastId: "success1",
      };
  };

  const editLink = () => {
    navigate(`/create/${props.deckId}`);
  };

  return (
    <>
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
              <SetOptionsButton
                username={props.username}
                deckId={props.deckId}
              />

              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  {(onClose) => (
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
                                    folderIDs !== null
                                      ? folderIDs[index]
                                      : "Error"
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
                          onPress={onClose}
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
          </div>
        </CardHeader>
        <CardBody>
          <p className="text-sm">{props.description}</p>
        </CardBody>
      </Card>
    </>
  );
};

export default StudyInfo;

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../firebase";
import { FaFolderPlus } from "react-icons/fa6";
import { toast } from "sonner";
import { useUserContext } from "../context/userContext";

interface SetsCreateFolderProps {
  refreshFolders: () => void;
  folderCount: number;
}

const SetsCreateFolder = (props: SetsCreateFolderProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [colorSelected, setColorSelected] = useState("zinc");
  const [folderName, setFolderName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { user } = useUserContext();

  const colors = [
    "zinc",
    "red",
    "orange",
    "amber",
    "yellow",
    "lime",
    "green",
    "teal",
    "cyan",
    "blue",
    "indigo",
    "violet",
    "fuchsia",
    "pink",
    "rose",
  ];

  // to add new colors, make sure to add them in the safelist in tailwind.config.js

  const createNewFolder = async (func: () => void) => {
    if (user === null) {
      toast.error("No user signed in");
      return;
    }

    if (props.folderCount >= 30) {
      toast.error("Maximum folders created");
      return;
    }

    if (!isCreating) {
      setIsCreating(true);
    } else {
      return;
    }
    const userID: string | null = auth.currentUser?.uid ?? null;

    if (userID !== null) {
      try {
        await addDoc(collection(db, "users", userID, "folders"), {
          folderName: folderName,
          folderColor: colorSelected,
        });
      } catch (e) {
        console.error("Error adding document: ", e);

        return;
      }
    }

    setIsCreating(false);
    setColorSelected("zinc");
    setFolderName("");
    func(); // runs the on close function
    props.refreshFolders();
    toast.success("Successfully created folder");
  };
  return (
    <div className="">
      <Button onClick={onOpen} color="default" className="font-semibold">
        <FaFolderPlus />
        New Folder
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
        <ModalContent className="text-black dark:text-gray-100">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new folder
              </ModalHeader>
              <ModalBody>
                {/* <p className="text-sm font-semibold">Folder name</p> */}
                <Input
                  type="text"
                  labelPlacement="outside"
                  placeholder="Folder name"
                  value={folderName}
                  variant="faded"
                  color="primary"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFolderName(e.target.value)
                  }
                />
                <div></div>
                <div className="flex flex-wrap justify-start">
                  {colors.map((color, num) => (
                    <button
                      key={num}
                      onClick={() => setColorSelected(color)}
                      className={`bg-${color}-500 h-7 w-7 my-1 rounded-full mx-1 mb-1 ${
                        colorSelected === color
                          ? "outline outline-4 outline-yellow-400 duration-100"
                          : "outline-yellow-400"
                      }`}
                    ></button>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="font-semibold"
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => createNewFolder(onClose)}
                  className="font-semibold"
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SetsCreateFolder;

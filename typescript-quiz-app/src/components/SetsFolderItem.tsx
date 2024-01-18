import { FaFolder } from "react-icons/fa6";
import {
  Card,
  CardBody,
  Button,
  useDisclosure,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { Chip } from "@nextui-org/react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { db } from "../firebase";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";

interface SetsFolderItemProps {
  folderName: string;
  folderColor: string;
  folderID: string;
  sets: string[];
  setSelectedFolder: React.Dispatch<React.SetStateAction<number>>;
  index: number;
  refreshFolders: () => void;
}

const SetsFolderItem = (props: SetsFolderItemProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [colorSelected, setColorSelected] = useState(props.folderColor);
  const [folderName, setFolderName] = useState(props.folderName);
  const [_isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userID = auth.currentUser?.displayName ?? null;

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

  const editFolder = async () => {
    if (userID === null) {
      console.log("No user found. Cannot edit folder.");
      return;
    }
    setIsCreating(true);

    try {
      await setDoc(doc(db, "users", userID, "folders", props.folderID), {
        folderName: folderName,
        folderColor: colorSelected,
      });

      toast.success("Folder updated!");
    } catch (e) {
      console.log(e);
      toast.error("Error updating folder");
    }
    setIsCreating(false);
    onOpenChange();
    props.refreshFolders();
  };

  const deleteFolder = async () => {
    if (userID === null) {
      console.log("No user found. Cannot edit folder.");
      return;
    }
    setIsCreating(true);

    try {
      await deleteDoc(doc(db, "users", userID, "folders", props.folderID));

      toast.success("Folder deleted!");
    } catch (e) {
      console.log(e);
      toast.success("Could not delete folder.");
    }
    setIsCreating(false);
    setIsModalOpen(false);
    props.refreshFolders();
  };

  return (
    <div className="mx-2 my-2">
      <button
        className="w-full"
        onClick={() => props.setSelectedFolder(props.index)}
      >
        <Card shadow="sm">
          <CardBody className="py-3 flex space-y-3">
            <div className="flex items-center space-x-2 mr-8">
              <FaFolder className={`h-5 w-5 text-${props.folderColor}-500`} />
              <p className="text-base overflow-ellipsis overflow-hidden line-clamp-1">
                {props.folderName}
              </p>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    size="sm"
                    isIconOnly
                    aria-label="Folder settings"
                    className="absolute right-2"
                    radius="md"
                    variant="light"
                  >
                    <IoEllipsisHorizontalSharp className="w-5 h-5" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Static Actions"
                  className="text-black/80 dark:text-white/80 max-w-[200px]"
                >
                  <DropdownItem
                    key="new"
                    startContent={<FaEdit />}
                    onClick={onOpen}
                  >
                    Edit
                  </DropdownItem>
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    startContent={<FaTrash />}
                    onClick={() => setIsModalOpen(true)}
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
            <Chip size="sm">
              {props.sets?.length ?? 0}{" "}
              {props.sets?.length == 1 ? "set" : "sets"}
            </Chip>
          </CardBody>
        </Card>
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
        <ModalContent className="text-black dark:text-gray-100">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit folder
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
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={editFolder}>
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isModalOpen} hideCloseButton={true}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black dark:text-gray-100">
                Delete folder
              </ModalHeader>
              <ModalBody className="space-y-2">
                <p className="text-black text-base dark:text-gray-200">
                  Are you sure you want to delete this folder? This cannot be
                  undone.
                </p>
                <div className="flex items-center space-x-2 mr-8">
                  <FaFolder
                    className={`h-5 w-5 text-${props.folderColor}-500`}
                  />
                  <p className="text-base overflow-ellipsis overflow-hidden line-clamp-1 text-black dark:text-gray-100">
                    {props.folderName}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => setIsModalOpen(false)}
                  className="font-semibold"
                >
                  Close
                </Button>
                <Button
                  color="danger"
                  onPress={() => deleteFolder()}
                  className="font-semibold"
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SetsFolderItem;

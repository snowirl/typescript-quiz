import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  User,
  Chip,
  Spinner,
  Skeleton,
} from "@nextui-org/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  query,
  where,
  collectionGroup,
  getDocs,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  collection,
  orderBy,
  addDoc,
  serverTimestamp,
  deleteDoc,
  DocumentData,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

interface SetCardProps {
  deckId?: string;
}

const SetCard = (props: SetCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deck, setDeck] = useState<DocumentData | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid ?? "Error";
  const deckId = props?.deckId ?? "Error";

  useEffect(() => {
    initializeDeck();
  }, [deckId]);

  const initializeDeck = async () => {
    setIsLoading(true);

    const q = query(collectionGroup(db, "decks"), where("id", "==", deckId));

    try {
      const docRef = await getDocs(q);

      setDeck(docRef.docs[0].data());
    } catch (e) {
      console.log("error occurred: " + e);
    }
    setIsLoading(false);
  };

  const deleteSet = async () => {
    const setRef = doc(db, "users", userId, "decks", deckId);

    try {
      await deleteDoc(setRef);
    } catch (e) {
      onClose();
      console.log("Error:  " + e);
      return;
    }

    console.log("deleted.");

    onClose();
  };
  return (
    <div>
      <Card className="w-full">
        <CardHeader className="pb-0">
          <div className="flex justify-between w-full">
            <div className="flex-grow-1">
              <User
                name={deck?.username}
                // description="Product Designer"
                avatarProps={{
                  src: "https://i.pravatar.cc/150?u=a04258114e29026702d",
                  size: "md",
                }}
              />
            </div>

            <div className="flex-grow-1">
              <button className="icon-btn">
                <FaEdit className="text-blue-600" />
              </button>
              <button className="icon-btn" onClick={() => onOpen()}>
                <FaTrash className="text-rose-600" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardBody
          className="py-0 cursor-pointer"
          onClick={() => navigate(`/study/${deck?.id}`)}
        >
          <div className="text-left">
            <p className="font-bold text-lg">{deck?.title}</p>
            <p className="text-sm text-zinc-600">{deck?.description}</p>
          </div>
        </CardBody>
        <CardFooter className="pt-2">
          <Chip size="sm" className="mt-1">
            <p className="font-semibold text-xs">{deck?.cardsLength} cards</p>
          </Chip>
        </CardFooter>
      </Card>
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
    </div>
  );
};

export default SetCard;

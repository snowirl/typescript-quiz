import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Avatar,
} from "@nextui-org/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  query,
  where,
  collectionGroup,
  getDocs,
  doc,
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
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";

interface SetCardProps {
  deckId?: string;
}

const SetCard = (props: SetCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deck, setDeck] = useState<DocumentData | null>(null);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [isPicLoading, setIsPicLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid ?? "Error";
  const deckId = props?.deckId ?? null;

  useEffect(() => {
    if (deckId) {
      initializeDeck();
    }
  }, [deckId]);

  useEffect(() => {
    if (deck === null) {
      return;
    }

    getImageByUserId(deck?.owner); // get user pfp
  }, [deck]);

  const initializeDeck = async () => {
    setIsLoading(true);

    const q = query(collectionGroup(db, "decks"), where("id", "==", deckId));

    try {
      const docRef = await getDocs(q);

      setDeck(docRef.docs[0].data());
    } catch (e) {
      console.log("error occurred: " + e);
      if (
        e instanceof TypeError &&
        e.message.includes(
          "Cannot read properties of undefined (reading 'data')"
        )
      ) {
        // Execute your function when the specific error occurs
        handleDeleteActivitySet();
      } else {
        // Handle other errors
        console.log(e);
      }
    }

    setIsLoading(false);
  };

  const handleDeleteActivitySet = async () => {
    if (deckId === null) {
      return;
    }
    // deletes reents set when there is an undefined error retrieving it, so most likely deleted or privated.
    const setRef = doc(db, "users", userId, "activity", deckId);

    try {
      await deleteDoc(setRef);
    } catch (e) {
      console.log("Error:  " + e);
      return;
    }

    console.log("deleted.");
  };

  const getImageByUserId = async (userId: string) => {
    const storage = getStorage();
    const jpgImagePath = `/profilePictures/${userId}`;
    const pngImagePath = `profilePictures/${userId}`;

    try {
      // Check if the image is a JPG
      const jpgDownloadUrl = await getDownloadURL(ref(storage, jpgImagePath));

      if (jpgDownloadUrl) {
        setProfilePictureURL(jpgDownloadUrl);
        setIsPicLoading(false);
      }
    } catch (error) {
      //   console.log("error here....");
      // If JPG fetch fails, check if the image is a PNG
      try {
        const pngDownloadUrl = await getDownloadURL(ref(storage, pngImagePath));

        if (pngDownloadUrl) {
          setProfilePictureURL(pngDownloadUrl);
          setIsPicLoading(false);
        }
      } catch (error) {
        // Handle the case when no image is found for the given user ID
        // console.log("error here....");
        setIsPicLoading(false);
        return null;
      }

      setIsPicLoading(false);
    }
  };

  const deleteSet = async () => {
    if (deckId === null) {
      return;
    }
    const setRef = doc(db, "users", userId, "decks", deckId);

    try {
      await deleteDoc(setRef);
    } catch (e) {
      onClose();
      console.log("Error:  " + e);
      return;
    }

    const cardRef = doc(db, "users", userId, "cards", deckId);

    try {
      await deleteDoc(cardRef);
    } catch (e) {
      onClose();
      console.log("Error:  " + e);
      return;
    }

    console.log("deleted.");

    onClose();
  };
  return (
    <motion.div
      initial={{ opacity: 0, translateY: 5 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        ease: "linear",
        duration: 0.3,
      }}
    >
      {deck ? (
        <Card className="w-full p-1" shadow="sm" radius="lg">
          <CardHeader className="px-2 pt-2 pb-1">
            <div className="flex justify-between w-full">
              <div className="flex-grow-1">
                {isPicLoading ? (
                  <Skeleton circle className="w-9 h-9" enableAnimation />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Avatar src={profilePictureURL} className="" />
                    <p className="font-semibold">{deck?.username}</p>
                  </div>
                )}
              </div>
              {isLoading ? null : (
                <div
                  className={
                    deck?.owner === auth.currentUser?.uid ? "" : "hidden"
                  }
                >
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    className=" hover:text-blue-600"
                    onClick={() => navigate(`/create/${deck?.id}`)}
                  >
                    <FaEdit className="w-4 h-4 " />
                  </Button>

                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    className="text-rose-600"
                    onClick={() => onOpen()}
                  >
                    <FaTrash className="w-4 h-4 " />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardBody
            className="pt-1 pb-1 px-2 cursor-pointer"
            onClick={() => navigate(`/study/${deck?.id}`)}
          >
            <div className="text-left">
              {isLoading ? (
                <Skeleton className="w-1/3" enableAnimation />
              ) : (
                <p className="font-bold text-lg">{deck?.title}</p>
              )}
              {isLoading ? (
                <Skeleton className="w-full" count={2} enableAnimation />
              ) : (
                <p
                  className="text-sm text-zinc-600 overflow-ellipsis line-clamp-2
            "
                >
                  {deck?.description}
                </p>
              )}
            </div>
          </CardBody>
          <CardFooter className="pt-1 pb-2 px-2">
            {isLoading ? null : (
              <Chip size="sm" className="mt-1">
                <p className="font-semibold text-xs">
                  {deck?.cardsLength} cards
                </p>
              </Chip>
            )}
          </CardFooter>
        </Card>
      ) : null}

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
    </motion.div>
  );
};

export default SetCard;

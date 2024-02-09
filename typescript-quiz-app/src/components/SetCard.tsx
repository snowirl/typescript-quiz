import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
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
import { Button } from "@nextui-org/react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion } from "framer-motion";
import { IoIosRemove } from "react-icons/io";
import SetOptionsButton from "./SetOptionsButton";
import { FaLock } from "react-icons/fa";

interface SetCardProps {
  deckId?: string | null;
  removeSetFromFolder?: (set: string) => void;
}

const SetCard = (props: SetCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [deck, setDeck] = useState<DocumentData | null>(null);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [isPicLoading, setIsPicLoading] = useState(true);
  const navigate = useNavigate();
  const userId = auth.currentUser?.displayName ?? null;
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

    setDisabled(false);

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
    if (deckId === null || userId === null) {
      return;
    }

    setDisabled(true);
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

  const navigateToDeck = () => {
    if (disabled) {
      return;
    }

    navigate(`/study/${deck?.id}`);
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
      <Card
        className={disabled ? "w-full p-1 opacity-50" : "w-full p-1 shadow-sm"}
        shadow="none"
        radius="lg"
      >
        <CardHeader className="px-2 pt-2 pb-1">
          <div className="flex justify-between w-full">
            <div className="flex-grow-1">
              <div className="flex items-center space-x-2">
                <Avatar
                  src={profilePictureURL}
                  className=""
                  fallback={!isPicLoading ? false : true}
                />
                <p className="font-semibold">{deck?.username}</p>
              </div>
            </div>

            {isLoading || props.removeSetFromFolder ? null : (
              <div
                className={
                  deck?.owner === auth.currentUser?.displayName ? "" : "hidden"
                }
              ></div>
            )}

            {props.removeSetFromFolder !== undefined &&
            props.deckId !== undefined &&
            props.deckId !== null ? (
              <div className="flex">
                <Tooltip
                  content="Remove set from folder"
                  delay={750}
                  className="text-black dark:text-white"
                >
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    radius="md"
                    className="text-rose-600"
                    onClick={() =>
                      props.removeSetFromFolder?.(props.deckId ?? "hi")
                    }
                    // or use:
                    // onClick={() => props.removeSetFromFolder && props.removeSetFromFolder(props.deckId)}
                  >
                    <IoIosRemove className="w-5 h-5" />
                  </Button>
                </Tooltip>
                {/* <SetOptionsButton
                    username={deck?.username}
                    deckId={props.deckId}
                  /> */}
              </div>
            ) : (
              // Log a message or add a placeholder if the condition is not met
              <div className="flex items-center space-x-2">
                {deck?.private ? (
                  <Tooltip
                    content="This set is private"
                    className="text-black dark:text-gray-100"
                    delay={500}
                  >
                    <div className="">
                      <FaLock className="w-3 h-3 text-black/80 dark:text-gray-100" />
                    </div>
                  </Tooltip>
                ) : null}
                {disabled ? null : (
                  <SetOptionsButton
                    username={deck?.username}
                    deckId={props.deckId}
                  />
                )}
              </div>
            )}
          </div>

          {/* {isLoading || props.removeSetFromFolder ? null} */}
        </CardHeader>
        <CardBody
          className="pt-1 pb-1 px-2 cursor-pointer"
          onClick={navigateToDeck}
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
                {disabled ? "Error finding set" : ""}
                {deck?.description}
              </p>
            )}
          </div>
        </CardBody>
        <CardFooter className="pt-1 pb-2 px-2">
          {isLoading || disabled ? null : (
            <Chip size="sm" className="mt-1">
              <p className="font-semibold text-xs">{deck?.cardsLength} cards</p>
            </Chip>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SetCard;

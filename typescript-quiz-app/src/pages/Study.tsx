import { SliderValue } from "@nextui-org/react";
import StudyButtons from "../components/StudyButtons";
import StudyCard from "../components/StudyCard";
import StudyInfo from "../components/StudyInfo";
import StudyCardPreview from "../components/StudyCardPreview";
import { Flashcard } from "../assets/globalTypes";
import { useState, useEffect } from "react";
import arrayShuffle from "array-shuffle";
import { BsFillHeartFill } from "react-icons/bs";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import {
  query,
  where,
  collectionGroup,
  getDocs,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { DocumentData } from "firebase/firestore";
import { useUserContext } from "../context/userContext";
import { useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@nextui-org/react";
import { useAnimationControls } from "framer-motion";
import StudyNav from "../components/StudyNav";
import { toast } from "sonner";
import LoadingContainer from "../components/LoadingContainer";
import { Slider } from "@nextui-org/react";

const flashcards: Flashcard[] = [
  {
    front: "",
    back: "",
    cardId: "1",
  },
];

const Study = () => {
  const [deckData, setDeckData] = useState<DocumentData | null>(null);
  const [originalDeck, setOriginalDeck] = useState(flashcards); // original deck
  const [currentDeck, setCurrentDeck] = useState(flashcards); // currently using deck we have modified
  const [currentCard, setCurrentCard] = useState(flashcards[0]); // currently using card
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipSpeed, setFlipSpeed] = useState(0.35);
  const [isFrontFirst, setIsFrontFirst] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isStarredOnly, setIsStarredOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [starredList, setStarredList] = useState<string[] | null>(null);
  const [shouldSaveData, setShouldSaveData] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [isAnimating, setIsAnimating] = useState(false); // if card is animating
  const [isInitial, setIsInitial] = useState(true);
  const controls = useAnimationControls(); // for card animation
  const [error, setError] = useState<string>("");

  let { id } = useParams();
  const pageID: string = id ?? "";
  let userID: string | null = auth.currentUser?.uid ?? null;
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { isOpen, onOpen: onOpenLockedModal, onOpenChange } = useDisclosure(); // for locked modal

  const isFavoritedRef = useRef(isFavorited); // to get the most updated version // This took forever to figure out, dont brek
  const starredListRef = useRef(starredList);

  useEffect(() => {
    initializeDeckInfo();
    window.scrollTo({
      top: 0,
    });
  }, []);

  useEffect(() => {
    if (user === null) {
      return;
    }

    userID = auth.currentUser?.uid ?? null; // make sure isnt error, also [user] so it isnt null

    const intervalId = setInterval(() => {
      // Use the values from the refs, which are always up-to-date

      // Your logic here using the current values
      checkAndSaveData();
    }, 20000);

    return () => clearInterval(intervalId);
  }, [user]);

  useEffect(() => {
    isFavoritedRef.current = isFavorited;
    starredListRef.current = starredList;

    const activityData = {
      isFavorited: isFavoritedRef.current,
      starredList: starredListRef.current,
    };

    if (deckData?.id && activityData) {
      if (isInitial) {
        setShouldSaveData(true);
      } else {
        localStorage.setItem(
          `activity/${deckData.id}`,
          JSON.stringify(activityData)
        );
      }
    }
  }, [isFavorited, starredList]);

  useEffect(() => {
    if (deckData !== null) {
      initializeDeck();
      getImageByUserId(deckData.owner);

      const activityData = localStorage.getItem(`activity/${deckData?.id}`);

      // console.log(activityData);

      if (activityData === null) {
        // if we do not have anything in local storage find online
        // Do something with the value if needed
        initializeActivity();
      } else {
        const parsedActivityData = JSON.parse(activityData);
        setIsFavorited(parsedActivityData.isFavorited);
        setStarredList(parsedActivityData.starredList);
        console.log("GOT LOCAL ACTIVITY.");
        handleSaveData();
      }
    }
  }, [deckData]);

  useEffect(() => {
    setCurrentCard(currentDeck[0]);
    setIndex(0);
  }, [currentDeck]);

  useEffect(() => {
    if (shouldSaveData && user && !isInitial) {
      toast.dismiss();

      toast(
        <div className="flex text-base p-0 m-0 items-center justify-between w-full dark:bg-dark-1 dark:text-white">
          <div className="w-full flex justify-start">
            <p className="font-semibold">Unsaved changes</p>
          </div>
          <div className="flex w-full justify-end">
            <Button
              color="primary"
              className="font-bold h-9 w-9 right-0"
              onClick={() => handleSaveData()}
            >
              Save
            </Button>
          </div>
        </div>,
        { duration: Infinity }
      );
      console.log("ran....");
    } else {
    }

    if (shouldSaveData && isInitial) {
      // save on initial
      handleSaveData();
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldSaveData) {
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        // Standard for most browsers
        event.returnValue = message;
        // For some older browsers
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldSaveData]);

  useEffect(() => {
    // for arrow functions
    const handleKeyPress = (event: KeyboardEvent) => {
      // Do something when any key is pressed

      // You can perform additional logic based on the key pressed
      if (event.key === "ArrowLeft") {
        decrementIndex();
      } else if (event.key === "ArrowRight") {
        incrementIndex();
      } else if (event.key === " ") {
        event.preventDefault();
        flipCard();
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentDeck, index, isAnimating, isFlipped]);

  const initializeDeckInfo = async () => {
    setIsLoading(true);

    const q = query(collectionGroup(db, "decks"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      setDeckData(docRef.docs[0].data());

      // console.log(docRef.docs[0].data());
    } catch (e) {
      console.log("error occurred: " + e);
      setError("undefined");
      onOpenLockedModal();
      setIsLoading(false);
    }
  };

  const initializeDeck = async () => {
    if (deckData?.private && deckData.owner !== userID) {
      console.log("ERROR... DECK IS PRIVATE!");
      setError("private");
      onOpenLockedModal();
      setIsLoading(false);
      return;
    }
    // different function because cards are in a different place for preview purposes
    const q = query(collectionGroup(db, "cards"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      // console.log(docRef.docs[0].data());

      setOriginalDeck(docRef.docs[0].data().cards);
      setCurrentDeck(docRef.docs[0].data().cards);
      setCurrentCard(docRef.docs[0].data().cards[index]);
    } catch (e) {
      console.log("error occurred: " + e);

      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const initializeActivity = async () => {
    if (userID === null) {
      return;
    }
    const q = doc(db, "users", userID, "activity", pageID);
    try {
      const docRef = await getDoc(q);
      setStarredList(docRef.data()?.starred);
      setIsFavorited(docRef.data()?.favorited);
    } catch (e) {
      console.log("error occurred: " + e);
    }
  };

  const handleStarCard = (flashcard: Flashcard) => {
    if (user === null) {
      toast.warning("No user signed in");
      return;
    }
    if (starredList !== undefined && starredList !== null) {
      if (starredList.indexOf(flashcard.cardId) > -1) {
        let index = starredList.indexOf(flashcard.cardId);
        console.log("Card already starred. Removing card.");
        setStarredList([
          ...starredList.slice(0, index),
          ...starredList.slice(index + 1),
        ]);
      } else {
        setStarredList([...starredList, flashcard.cardId]); // add card
      }
    } else {
      setStarredList([flashcard.cardId]);
      console.log("starred list is null");
    }

    setShouldSaveData(true);
  };

  const handleSaveData = async () => {
    if (isSaving || user === null || userID === null) {
      return;
    } else {
      setIsSaving(true);
      if (!isInitial) {
        toast.dismiss();
      }
      //
    }

    if (isFavoritedRef === undefined || starredListRef === undefined) {
    }

    const activityData = localStorage.getItem(`activity/${deckData?.id}`);
    let parsedActivityData = null;

    if (activityData !== null) {
      parsedActivityData = JSON.parse(activityData);
      console.log("found local storage.");
    }
    try {
      const starredValue =
        parsedActivityData?.starredList !== undefined
          ? parsedActivityData.starredList
          : starredListRef.current ?? null;

      await setDoc(
        doc(db, "users", userID, "activity", pageID),
        {
          docId: pageID,
          favorited: parsedActivityData
            ? parsedActivityData.isFavorited !== undefined
              ? parsedActivityData.isFavorited
              : isFavoritedRef.current
            : isFavoritedRef.current ?? null,

          starred: starredValue,
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.log("error occurred: " + e);
      toast.error("Error saving data!");
      setIsSaving(false);
      return;
    }

    console.log("Saved.");

    if (!isInitial) {
      toast.dismiss();
      toast.success("Saved!");
    }

    localStorage.removeItem(`activity/${deckData?.id}`);
    setShouldSaveData(false);
    setIsSaving(false);
    setIsInitial(false);
  };

  useEffect(() => {
    shuffleDeck(!isShuffled);
  }, [isStarredOnly]);

  useEffect(() => {
    if (deckData === null) {
      return;
    }
    setTimeout(() => {
      setCurrentCard(currentDeck[index]);
    }, 300);
  }, [index]);

  const incrementIndex = () => {
    console.log(currentDeck.length - 1);
    if (index < currentDeck.length - 1) {
      console.log("Before increment:", index);
      setIndex((prevIndex) => prevIndex + 1);
      animateCard(true);
      console.log("After increment:", index);
    }
  };

  const decrementIndex = () => {
    if (index > 0) {
      setIndex((prevIndex) => prevIndex - 1);
      animateCard(false);
    }
  };

  const animateCard = (isGoingUp: boolean) => {
    if (isAnimating) {
      return;
    }
    sequence(isGoingUp);
    setIsAnimating(true);
    setTimeout(() => {
      if (isFrontFirst && isFlipped) {
        setFlipSpeed(0);
        flipCard();
      } else if (!isFrontFirst && !isFlipped) {
        setFlipSpeed(0);
        flipCard();
      }
      setIsAnimating(false);
    }, 300);
  };

  async function sequence(isUp: boolean) {
    await controls.start({
      opacity: 0,
      x: isUp ? 25 : -25,
      rotateZ: isUp ? 0.2 : -0.2,
      y: -5,
      transition: { duration: 0.15 },
    });
    await controls.start({
      opacity: 0,
      rotateZ: isUp ? -0.2 : 0.2,
      x: isUp ? -25 : 25,
      transition: { duration: 0.15 },
    });
    await controls.start({
      opacity: 1,
      x: 0,
      rotateZ: 0,
      y: 0,
      transition: { duration: 0.15 },
    });
  }

  const shuffleDeck = (bool: boolean) => {
    if (bool) {
      if (
        isStarredOnly &&
        starredList !== null &&
        starredList !== undefined &&
        starredList.length > 0
      ) {
        setCurrentDeck(
          originalDeck.filter((flashcard) =>
            starredList?.includes(flashcard.cardId)
          )
          // const starredCards = cardList.filter(card => starredList.includes(card.cardId));
        );
      } else {
        setCurrentDeck(originalDeck);
      }
      setIsShuffled(false);
    } else {
      if (
        isStarredOnly &&
        starredList !== null &&
        starredList !== undefined &&
        starredList.length > 0
      ) {
        setCurrentDeck(
          arrayShuffle(
            originalDeck.filter((flashcard) =>
              starredList?.includes(flashcard.cardId)
            )
          )
        );
      } else {
        setCurrentDeck(arrayShuffle(originalDeck));
      }

      setIsShuffled(true);
    }
  };

  const changeStarredSelected = (val: string) => {
    if (val === "starred") {
      setIsStarredOnly(true);
    } else {
      setIsStarredOnly(false);
    }

    setIndex(0);
  };

  const changeInitialCardSide = (val: string) => {
    if (val === "front") {
      setIsFrontFirst(true);

      if (isFlipped) {
        setIsFlipped(false);
      }
    } else {
      setIsFrontFirst(false);

      if (!isFlipped) {
        setIsFlipped(true);
      }
    }
  };

  const flipCard = () => {
    setIsFlipped((prevFlipped) => !prevFlipped);
    setTimeout(() => {
      setFlipSpeed(0.35);
    }, 150);
  };

  const checkAndSaveData = () => {
    setShouldSaveData((prevShouldSaveData) => {
      if (prevShouldSaveData) {
        console.log("Saving data...");
        handleSaveData();
      } else {
        console.log("nothing has changed, do not need to save.");
      }

      return prevShouldSaveData; // Return the previous value
    });
  };

  const handleFavorite = () => {
    if (user === null) {
      console.log("No user signed in...");
      toast.warning("No user signed in");
      return;
    }
    setIsFavorited((prev) => !prev);
    setShouldSaveData(true);
  };

  const getImageByUserId = async (userId: string) => {
    const storage = getStorage();
    const jpgImagePath = `/profilePictures/${userId}`;
    const pngImagePath = `profilePictures/${userId}`;

    try {
      // Check if the image is a JPG
      const jpgImageRef = ref(storage, jpgImagePath);
      const jpgDownloadUrl = await getDownloadURL(jpgImageRef);
      setProfilePictureURL(jpgDownloadUrl);
    } catch (jpgError) {
      console.log(jpgError);
      // If JPG fetch fails, check if the image is a PNG
      try {
        const pngImageRef = ref(storage, pngImagePath);
        const pngDownloadUrl = await getDownloadURL(pngImageRef);
        setProfilePictureURL(pngDownloadUrl);
      } catch (pngError) {
        // Handle the case when no image is found for the given user ID
        console.log(pngError);
        return null;
      }
    }
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen">
      <div className="flex justify-center">
        {isLoading ? (
          <LoadingContainer />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-[825px] w-full flex-grow space-y-3 px-4"
          >
            <p className="font-bold text-2xl">{deckData?.title}</p>
            <div className="flex justify-between relative">
              <div></div>
              <div className="flex w-full items-center justify-center relative">
                <p className="font-semibold text-sm">
                  {index + 1} / {currentDeck.length}
                </p>
              </div>

              <div className="absolute -top-4 right-0">
                <Tooltip
                  content="Favorite"
                  className="text-black dark:text-white"
                >
                  <Button
                    isIconOnly
                    size="md"
                    onClick={() => handleFavorite()}
                    variant="light"
                    radius="lg"
                    color={isFavorited ? "danger" : "default"}
                  >
                    <BsFillHeartFill
                      className={
                        isFavorited
                          ? "w-4 h-4 text-danger"
                          : "w-4 h-4 text-gray-500"
                      }
                    />
                  </Button>
                </Tooltip>
              </div>
            </div>
            <div className="w-full"></div>

            {/* <Progress
              aria-label="Loading..."
              value={((index + 1) / currentDeck.length) * 100}
              className=""
              size="sm"
            /> */}
            <Slider
              aria-label="Progress Slider"
              step={1}
              maxValue={currentDeck.length - 1}
              minValue={0}
              defaultValue={0.4}
              value={index}
              className=""
              size="sm"
              hideThumb
              onChange={(value: SliderValue) => setIndex(+value.toString())}
            />

            <StudyNav deckId={id ?? "undefined"} />

            <motion.div
              initial={{ x: 0 }}
              // onClick={handleCardClick}
              animate={controls}
              // opacity: isCardVisible ? 1 : 0,
              //   x: !isCardVisible ? (isMovingLeft ? -55 : 55) : 0,
              //   rotateZ: !isCardVisible ? (isMovingLeft ? -1 : 1) : 0,
              transition={{
                duration: 0.15,
                type: "spring",
                stiffness: 500,
                damping: 38,
              }}
            >
              <StudyCard
                flashcard={currentCard}
                isFlipped={isFlipped}
                isShuffled={isShuffled}
                shuffleDeck={shuffleDeck}
                changeStarredSelected={changeStarredSelected}
                isStarredOnly={isStarredOnly}
                isFrontFirst={isFrontFirst}
                flipCard={flipCard}
                changeInitialCardSide={changeInitialCardSide}
                flipSpeed={flipSpeed}
                handleStarCard={handleStarCard}
                isStarred={starredList?.includes(currentCard.cardId) ?? false}
              />
            </motion.div>
            <StudyButtons
              index={index}
              setIndex={setIndex}
              length={currentDeck.length}
              incrementIndex={() => incrementIndex()}
              decrementIndex={() => decrementIndex()}
              deckId={id ?? "undefined"}
            />

            <StudyInfo
              owner={deckData?.owner}
              username={deckData?.username}
              description={deckData?.description}
              profilePictureURL={profilePictureURL}
              deckId={pageID}
            />

            <p className="text-left font-semibold pt-4">
              All cards ({originalDeck.length})
            </p>
            {originalDeck.map((flashcard) => (
              <StudyCardPreview
                key={flashcard.cardId}
                flashcard={flashcard}
                isStarred={starredList?.includes(flashcard.cardId)}
                handleStarCard={handleStarCard}
              />
            ))}
            <div className="pt-10"></div>
          </motion.div>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">
                {error === "private" ? "Private Flashcard Set" : null}
                {error === "undefined" ? "No Set Found" : null}
              </ModalHeader>
              <ModalBody>
                <p className="text-black dark:text-gray-200">
                  {error === "private"
                    ? "This flashcard set is private and the owner must change it to public for access."
                    : null}
                  {error === "undefined"
                    ? "This flashcard set is possibly deleted or unable to be found."
                    : null}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => navigate(-1)}
                  className="font-semibold"
                >
                  Go back
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Study;

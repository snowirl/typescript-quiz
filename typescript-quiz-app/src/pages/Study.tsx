import { Progress, Spinner } from "@nextui-org/react";
import StudyButtons from "../components/StudyButtons";
import StudyCard from "../components/StudyCard";
import StudyInfo from "../components/StudyInfo";
import StudyCardPreview from "../components/StudyCardPreview";
import { Flashcard } from "../assets/globalTypes";
import { useState, useEffect } from "react";
import arrayShuffle from "array-shuffle";
import { BsFillHeartFill } from "react-icons/bs";
import { animate, motion } from "framer-motion";
import { useParams } from "react-router-dom";
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

const flashcards: Flashcard[] = [
  {
    front: "What is the capital of Italy?",
    back: "Rome",
    cardId: "1",
    isStarred: false,
  },
  {
    front: "In which century was the Colosseum built?",
    back: "1st century AD",
    cardId: "2",
    isStarred: true,
  },
  {
    front: "Who was the first Roman Emperor?",
    back: "Augustus (Octavian)",
    cardId: "3",
    isStarred: false,
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
  const [shouldSaveData, setShouldSaveData] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // if card is animating

  let { id } = useParams();
  const pageID: string = id ?? "";
  let userID: string = auth.currentUser?.uid ?? "Error";
  const { user } = useUserContext();
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure(); // for locked modal

  const isFavoritedRef = useRef(isFavorited); // to get the most updated version // This took forever to figure out, dont brek
  const starredListRef = useRef(starredList);

  useEffect(() => {
    initializeDeckInfo();
  }, []);

  useEffect(() => {
    if (user === null) {
      return;
    }

    userID = auth.currentUser?.uid ?? "Error"; // make sure isnt error, also [user] so it isnt null

    const intervalId = setInterval(() => {
      // Use the values from the refs, which are always up-to-date

      // Your logic here using the current values
      checkAndSaveData();
    }, 30000);

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
      localStorage.setItem(
        `activity/${deckData.id}`,
        JSON.stringify(activityData)
      );
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

  const initializeDeckInfo = async () => {
    setIsLoading(true);

    const q = query(collectionGroup(db, "decks"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      setDeckData(docRef.docs[0].data());

      // console.log(docRef.docs[0].data());
    } catch (e) {
      console.log("error occurred: " + e);
      setIsLoading(false);
    }
  };

  const initializeDeck = async () => {
    if (deckData?.private && deckData.owner !== userID) {
      console.log("ERROR... DECK IS PRIVATE!");
      onOpen();
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
    const q = doc(db, "users", userID, "activity", pageID);
    try {
      const docRef = await getDoc(q);
      setStarredList(docRef.data()?.starred);
      setIsFavorited(docRef.data()?.favorited);
      // console.log(docRef.data());
    } catch (e) {
      console.log("error occurred: " + e);
    }
  };

  const handleStarCard = (flashcard: Flashcard) => {
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
    const activityData = localStorage.getItem(`activity/${deckData?.id}`);
    let parsedActivityData = null;

    if (activityData !== null) {
      parsedActivityData = JSON.parse(activityData);
    }
    try {
      await setDoc(
        doc(db, "users", userID, "activity", pageID),
        {
          docId: pageID,
          favorited: parsedActivityData.isFavorited ?? isFavoritedRef.current,
          starred:
            parsedActivityData.starredList ?? starredListRef.current ?? [],
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );
    } catch (e) {
      console.log("error occurred: " + e);
      return;
    }

    console.log("Saved.");
    localStorage.removeItem(`activity/${deckData?.id}`);
    setShouldSaveData(false);
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
    if (index < currentDeck.length - 1) {
      setIndex((prevIndex) => prevIndex + 1);
      animateCard(true);
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

    setIsAnimating(true);
    setIsCardVisible(false);
    setIsMovingLeft(!isGoingUp);
    setTimeout(() => {
      if (isFrontFirst && isFlipped) {
        setFlipSpeed(0);
        flipCard();
      } else if (!isFrontFirst && !isFlipped) {
        setFlipSpeed(0);
        flipCard();
      }

      setIsCardVisible(true);
      // setCurrentCard(currentDeck[index]); // wait til we are visible to set card to index
      setIsAnimating(false);
    }, 300);
  };
  const shuffleDeck = (bool: boolean) => {
    if (bool) {
      if (isStarredOnly && starredList !== null && starredList.length > 0) {
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
      if (isStarredOnly && starredList !== null && starredList.length > 0) {
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
    setIsFlipped(!isFlipped);
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
          <Spinner />
        ) : (
          <div className="max-w-[800px] flex-grow space-y-4 px-4">
            <p className="font-bold text-2xl">{deckData?.title}</p>
            <div className="flex justify-between relative">
              <div></div>
              <div>
                <p className="font-semibold text-sm">
                  {index + 1} / {currentDeck.length}
                </p>
              </div>
              <div></div>

              <div className="absolute -top-2 right-0">
                <Tooltip
                  content="Favorite"
                  className="text-black dark:text-white"
                >
                  <button
                    className="icon-btn active:scale-95"
                    onClick={() => handleFavorite()}
                  >
                    <BsFillHeartFill
                      className={
                        isFavorited
                          ? "w-5 h-5 text-rose-500"
                          : "w-5 h-5 text-gray-500"
                      }
                    />
                  </button>
                </Tooltip>
              </div>
            </div>

            <Progress
              aria-label="Loading..."
              value={((index + 1) / currentDeck.length) * 100}
              className=""
              size="sm"
            />
            <motion.div
              initial={{ x: 0 }}
              // onClick={handleCardClick}
              animate={{
                opacity: isCardVisible ? 1 : 0,
                x: !isCardVisible ? (isMovingLeft ? -55 : 55) : 0,
                rotateZ: !isCardVisible ? (isMovingLeft ? -1 : 1) : 0,
              }}
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
              username={deckData?.username}
              description={deckData?.description}
              profilePictureURL={profilePictureURL}
            />
            <p className="text-left font-semibold pt-4">
              All cards ({originalDeck.length})
            </p>
            {originalDeck.map((flashcard) => (
              <StudyCardPreview key={flashcard.cardId} flashcard={flashcard} />
            ))}
            <div className="pt-10"></div>
          </div>
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">
                Private Flashcard Set
              </ModalHeader>
              <ModalBody>
                <p className="text-black dark:text-gray-200">
                  This flashcard set is private and the owner must change it to
                  public for access.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={() => navigate("/")}>
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

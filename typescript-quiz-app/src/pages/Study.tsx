import { Progress, Spinner } from "@nextui-org/react";
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

const flashcards: Flashcard[] = [
  {
    front: "What is the capital of Italy?",
    back: "Rome",
    cardId: 1,
    isStarred: false,
  },
  {
    front: "In which century was the Colosseum built?",
    back: "1st century AD",
    cardId: 2,
    isStarred: true,
  },
  {
    front: "Who was the first Roman Emperor?",
    back: "Augustus (Octavian)",
    cardId: 3,
    isStarred: false,
  },
  {
    front: "What river flows through Rome?",
    back: "Tiber River",
    cardId: 4,
    isStarred: true,
  },
  {
    front: "Which famous fountain is located in Rome's Trevi District?",
    back: "Trevi Fountain",
    cardId: 5,
    isStarred: false,
  },
  {
    front: "What is the Vatican City's status in relation to Rome?",
    back: "It is an independent city-state surrounded by Rome.",
    cardId: 6,
    isStarred: true,
  },
  {
    front: "Which ancient Roman road connected Rome to the south of Italy?",
    back: "Appian Way (Via Appia)",
    cardId: 7,
    isStarred: false,
  },
  {
    front: "Who was the Roman goddess of love and beauty?",
    back: "Venus",
    cardId: 8,
    isStarred: false,
  },
  {
    front:
      "Which famous Roman philosopher was sentenced to death by drinking hemlock?",
    back: "Socrates",
    cardId: 9,
    isStarred: false,
  },
  {
    front: "What is the official language of ancient Rome?",
    back: "Latin",
    cardId: 10,
    isStarred: false,
  },
];

const Study = () => {
  const [deckData, setDeckData] = useState<DocumentData | null>(null);
  const [originalDeck, setOriginalDeck] = useState(flashcards); // original deck
  const [currentDeck, setCurrentDeck] = useState(flashcards); // currently using deck we have modified
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flipSpeed, setFlipSpeed] = useState(0.35);
  const [isFrontFirst, setIsFrontFirst] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isStarredOnly, setIsStarredOnly] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false); // if card is animating
  const [isLoading, setIsLoading] = useState(true);
  const [starredList, setStarredList] = useState<string[] | null>(null);
  const [shouldSaveData, setShouldSaveData] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState("");
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
    initializeActivity();

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
  }, [isFavorited, starredList]);

  useEffect(() => {
    if (deckData !== null) {
      initializeDeck();
      getImageByUserId(deckData.owner);
    }
  }, [deckData]);

  const initializeDeckInfo = async () => {
    setIsLoading(true);

    const q = query(collectionGroup(db, "decks"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      setDeckData(docRef.docs[0].data());

      console.log(docRef.docs[0].data());
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

      console.log(docRef.docs[0].data());

      setOriginalDeck(docRef.docs[0].data().cards);
      setCurrentDeck(docRef.docs[0].data().cards);
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
      console.log(docRef.data());
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
    try {
      await setDoc(
        doc(db, "users", userID, "activity", pageID),
        {
          docId: pageID,
          favorited: isFavoritedRef.current,
          starred: starredListRef.current ?? [],
          timestamp: serverTimestamp(),
        },
        { merge: true }
      );

      console.log("Data saved.");
    } catch (e) {
      console.log("error occurred: " + e);
      return;
    }

    console.log("Saved.");
    setShouldSaveData(false);
  };

  useEffect(() => {
    shuffleDeck(!isShuffled);
  }, [isStarredOnly]);

  useEffect(() => {
    if (isFrontFirst && isFlipped) {
      flipCard();
      setFlipSpeed(0);
    } else if (!isFrontFirst && !isFlipped) {
      flipCard();
      setFlipSpeed(0);
    }
  }, [index]);
  const shuffleDeck = (bool: boolean) => {
    if (bool) {
      if (isStarredOnly && starredList !== null) {
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
      if (isStarredOnly && starredList !== null) {
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
    } else {
      setIsFrontFirst(false);
    }

    setIndex(0);
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
    setTimeout(() => {
      setFlipSpeed(0.35);
    }, 300);
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
                <button className="icon-btn" onClick={() => handleFavorite()}>
                  <BsFillHeartFill
                    className={
                      isFavorited
                        ? "w-5 h-5 text-rose-500"
                        : "w-5 h-5 text-gray-500"
                    }
                  />
                </button>
              </div>
            </div>

            <Progress
              aria-label="Loading..."
              value={((index + 1) / currentDeck.length) * 100}
              className=""
              size="sm"
            />
            <motion.div
              initial={{ opacity: 1 }}
              transition={{ duration: 0.15, type: "tween" }}
              // animate={controls}
            >
              <StudyCard
                flashcard={currentDeck[index]}
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
                isStarred={
                  starredList?.includes(currentDeck[index].cardId) ?? false
                }
              />
            </motion.div>
            <StudyButtons
              index={index}
              setIndex={setIndex}
              length={currentDeck.length}
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

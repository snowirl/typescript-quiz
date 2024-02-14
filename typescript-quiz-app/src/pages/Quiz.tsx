import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useParams, useNavigate } from "react-router-dom";
import {
  DocumentData,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { Flashcard } from "../assets/globalTypes";
import {
  Button,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
} from "@nextui-org/react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaGear } from "react-icons/fa6";
import QuizCard from "../components/QuizCard";
import arrayShuffle from "array-shuffle";

const flashcards: Flashcard[] = [
  {
    front: "",
    back: "",
    cardId: "1",
  },
];

const Quiz = () => {
  const [_isLoading, setIsLoading] = useState(true);
  const [deckData, setDeckData] = useState<DocumentData | null>(null);
  const [originalDeck, setOriginalDeck] = useState(flashcards); // original deck
  const [shuffledDeck, setShuffledDeck] = useState<Flashcard[] | null>(null); // currently using deck we have modified
  const [_starredList, setStarredList] = useState<string[] | null>(null);
  const [isStarredOnly, setIsStarredOnly] = useState(false);
  const [box0, setBox0] = useState<Flashcard[] | null>(null); // wrong, initial
  const [box1, setBox1] = useState<Flashcard[] | null>(null);
  const [box2, setBox2] = useState<Flashcard[] | null>(null);
  const [box3, setBox3] = useState<Flashcard[] | null>(null);
  const [box4, setBox4] = useState<Flashcard[] | null>(null); // mastered
  const [currentCardList, setCurrentCardList] =
    useState<Flashcard[]>(flashcards); // current cards from a box
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFrontFirst, setIsFrontFirst] = useState(false);
  const boxOrder = [1, 1, 2, 1, 1, 2, 1, 1, 3];
  const [boxIndex, setBoxIndex] = useState(0); // which order we are in box order
  const [didStart, setDidStart] = useState(false);

  const userID = auth?.currentUser?.displayName ?? null;
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (id !== undefined) {
        initializeDeckInfo();
      }
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  useEffect(() => {
    if (deckData) {
      initializeDeck();
      initializeActivity();
    }
  }, [deckData]);

  useEffect(() => {
    if (shuffledDeck) {
      if (!didStart) {
        drawCards();
        setDidStart(true);
      }
    }
  }, [shuffledDeck]);

  useEffect(() => {
    if (!box1) {
      return;
    }

    if (boxIndex === 0 || boxIndex === 3 || boxIndex === 6) {
      setCurrentCardList(box1);
    }
  }, [box1]);

  const initializeDeckInfo = async () => {
    setIsLoading(true);

    const q = query(collectionGroup(db, "decks"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      setDeckData(docRef.docs[0].data());
    } catch (e) {
      console.log("error occurred: " + e);
      setIsLoading(false);
    }
  };

  const initializeDeck = async () => {
    if (deckData?.private && deckData.owner !== userID) {
      setIsLoading(false);
      return;
    }

    const q = query(collectionGroup(db, "cards"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      setOriginalDeck(docRef.docs[0].data().cards);
      setShuffledDeck(arrayShuffle(docRef.docs[0].data().cards));
    } catch (e) {
      console.log("error occurred: " + e);

      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const initializeActivity = async () => {
    if (userID === null || id === undefined) {
      return;
    }
    const q = doc(db, "users", userID, "activity", id);
    try {
      const docRef = await getDoc(q);
      setStarredList(docRef.data()?.starred);
    } catch (e) {
      console.log("error occurred: " + e);
    }
  };

  const drawCards = () => {
    const maxCardsToDraw = 10;

    if (!shuffledDeck) {
      return;
    }

    if (shuffledDeck.length > 0) {
      // Determine the number of cards to draw (up to a maximum of 10)
      const cardsToDraw = Math.min(maxCardsToDraw, shuffledDeck.length);

      // Draw the specified number of cards from the shuffled deck
      const drawnCards = shuffledDeck.slice(0, cardsToDraw);

      // Update the current deck and current card list
      setShuffledDeck(
        shuffledDeck.filter((card) => !drawnCards.includes(card))
      );

      setBox1((prevBox1) => {
        if (prevBox1 === null) {
          // If box1 is initially null, set it to the drawn cards
          return drawnCards;
        } else {
          // If box1 already has cards, concatenate the drawn cards
          return [...prevBox1, ...drawnCards];
        }
      });

      setCurrentCardIndex(0);

      // Log the drawn cards or perform other actions
      console.log("Drawn Cards:", drawnCards);
    } else {
      console.log("No cards remaining in the current deck.");
      // Handle the case where there are no cards remaining in the current deck
    }
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="space-y-5 flex justify-center items-center ">
        <div className="max-w-[1000px] flex-grow space-y-2 mx-4 pb-10">
          <div className="space-x-2 flex justify-between mx-1">
            <div className="w-1/3 space-x-2 flex items-center">
              <Button onClick={() => navigate(`/study/${id}`)}>
                <IoIosArrowRoundBack className="w-7 h-7" /> Back
              </Button>
            </div>

            <div className="w-1/3  flex justify-end space-x-2 items-center">
              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button isIconOnly>
                    <FaGear />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-4 py-3">
                    <Checkbox
                    //   isSelected={isStarredOnly}
                    //   onValueChange={setIsStarredOnly}
                    >
                      Starred cards only
                    </Checkbox>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <p>{deckData ? deckData.title : "Loading..."}</p>
            <Progress aria-label="Loading..." value={60} size="sm" />
          </div>
          <QuizCard
            flashcard={currentCardList[currentCardIndex]}
            isFrontFirst={isFrontFirst}
          />
        </div>
      </div>
    </div>
  );
};

export default Quiz;

import { useState, useEffect, ChangeEvent } from "react";
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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaGear } from "react-icons/fa6";
import QuizCard from "../components/QuizCard";
import arrayShuffle from "array-shuffle";
import QuizRoundBreak from "../components/QuizRoundBreak";

const flashcards: Flashcard[] = [
  {
    front: "",
    back: "",
    cardId: "1",
  },
];

const Quiz = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [deckData, setDeckData] = useState<DocumentData | null>(null);
  const [originalDeck, setOriginalDeck] = useState(flashcards); // original deck
  const [shuffledDeck, setShuffledDeck] = useState<Flashcard[] | null>(null); // currently using deck we have modified
  const [starredList, setStarredList] = useState<string[] | null>(null);
  const [isStarredOnly, setIsStarredOnly] = useState(false);
  const [box0, setBox0] = useState<Flashcard[] | null>(null); // wrong, initial
  const [box1, setBox1] = useState<Flashcard[] | null>(null);
  const [box2, setBox2] = useState<Flashcard[] | null>(null);
  const [box3, setBox3] = useState<Flashcard[] | null>(null);
  const [box4, setBox4] = useState<Flashcard[] | null>(null); // mastered
  const [currentCardList, setCurrentCardList] = useState<Flashcard[] | null>(
    null
  ); // current cards from a box
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const boxOrder = [1, 1, 2, 1, 1, 2, 1, 1, 3];
  const [boxIndex, setBoxIndex] = useState(-1); // which order we are in box order
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );
  const [correctIndex, setCorrectIndex] = useState(0);
  const [isBreak, setIsBreak] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false); // so our chip on card doesn't flicker when skipping index
  const [answerWith, setAnswerWith] = useState("term");
  const [answerWithPending, setAnswerWithPending] = useState("term");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [correctCards, setCorrectCards] = useState<Flashcard[] | null>(null);
  const [wrongCards, setWrongCards] = useState<Flashcard[] | null>(null);

  const userID = auth?.currentUser?.uid ?? null;
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
    if (!box1) {
      return;
    }
  }, [box1]);

  useEffect(() => {
    setCorrectIndex(Math.floor(Math.random() * 4));
    setSelectedAnswerIndex(null);
  }, [currentCardIndex]);

  useEffect(() => {
    if (shuffledDeck === null) {
      return;
    }
    if (!isStart) {
      setBoxIndex(0);
      setIsStart(true);
    }
  }, [shuffledDeck]);

  useEffect(() => {
    if (!isBreak) {
      setCorrectCards(null);
      setWrongCards(null);
    }
  }, [isBreak]);

  useEffect(() => {
    if (shuffledDeck === null) {
      return;
    }

    setIsRetrying(false);

    if (boxIndex === 0 || boxIndex === 3 || (boxIndex === 6 && isStart)) {
      if (shuffledDeck.length > 0) {
        drawCards();
      } else {
        console.log("No more cards to draw....");
        nextRound();
      }
    } else if (boxIndex === 1 || boxIndex === 4 || boxIndex === 7) {
      if (box0 !== null) {
        setCurrentCardList(arrayShuffle(box0));
        setCurrentCardIndex(0);
        setBox0(null);
        setIsRetrying(true);
      } else {
        console.log("No wrong cards, moving on.");
        setIsBreak(true);
      }
    } else if (boxOrder[boxIndex] === 2) {
      if (box2 !== null) {
        setCurrentCardList(arrayShuffle(box2));
        setCurrentCardIndex(0);
        setBox2(null);
      } else {
        console.log("No box 2 cards, moving on.");
        nextRound();
      }
      console.log("got here.");
    } else if (boxOrder[boxIndex] === 3) {
      if (box3 !== null) {
        setCurrentCardList(arrayShuffle(box3));
        setCurrentCardIndex(0);
        setBox3(null);
      } else {
        console.log("No box 3 cards, moving on.");
        nextRound();
      }
    }
  }, [boxIndex]);

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
      console.log(docRef.data());
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

      if (box0 !== null) {
        setCurrentCardList(arrayShuffle([...box0, ...drawnCards]));
      } else {
        setCurrentCardList(drawnCards);
      }

      setCurrentCardIndex(0);

      // Log the drawn cards or perform other actions
      // console.log("Drawn Cards:", drawnCards);
    } else {
      console.log("No cards remaining in the current deck.");
      // Handle the case where there are no cards remaining in the current deck
    }
  };

  const selectAnswer = (index: number) => {
    if (currentCardList === null || selectedAnswerIndex !== null) {
      return;
    }

    setSelectedAnswerIndex(index);

    if (index === correctIndex) {
      handleBoxPlacementCorrect();
    } else {
      handleBoxPlacementWrong();
    }
  };

  const handleBoxPlacementWrong = () => {
    if (currentCardList === null) {
      return;
    }

    const cardToMove = currentCardList[currentCardIndex];

    let updatedBox0 = null;

    if (box0 === null) {
      updatedBox0 = [cardToMove];
    } else {
      updatedBox0 = [...box0, cardToMove];
    }
    setBox0(updatedBox0); // ALL MOVE TO BOX 0

    if (wrongCards === null) {
      setWrongCards([cardToMove]);
    } else {
      setWrongCards([...wrongCards, cardToMove]);
    }
  };

  const handleBoxPlacementCorrect = () => {
    if (currentCardList === null) {
      return;
    }

    const cardToMove = currentCardList[currentCardIndex];

    if (boxOrder[boxIndex] === 1) {
      let updatedBox2 = null;

      if (box2 === null) {
        updatedBox2 = [cardToMove];
      } else {
        updatedBox2 = [...box2, cardToMove];
      }

      setBox2(updatedBox2);
    } else if (boxOrder[boxIndex] === 2) {
      let updatedBox3 = null;

      if (box3 === null) {
        updatedBox3 = [cardToMove];
      } else {
        updatedBox3 = [...box3, cardToMove];
      }
      setBox3(updatedBox3);
    } else if (boxOrder[boxIndex] === 3) {
      let updatedBox4 = null;

      if (box4 === null) {
        updatedBox4 = [cardToMove];
      } else {
        updatedBox4 = [...box4, cardToMove];
      }
      setBox4(updatedBox4);
    }

    if (correctCards === null) {
      setCorrectCards([cardToMove]);
    } else {
      setCorrectCards([...correctCards, cardToMove]);
    }
  };

  const nextCard = () => {
    if (currentCardList === null) {
      return;
    }
    if (currentCardIndex < currentCardList.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      // Handle the case where there are no more cards (optional)
      console.log("No more cards");
      console.log("Box 0: " + box0);
      console.log("Box 1: " + box1);
      console.log("Box 2: " + box2);
      console.log("Box 3: " + box3);
      console.log("Box 4: " + box4);

      if (boxIndex === 0 || boxIndex === 3 || boxIndex === 6) {
        nextRound(); // auto go next round if we are these
      } else {
        setIsRetrying(false);
        setIsBreak(true);
      }
    }
  };

  const nextRound = () => {
    if (checkIfDone()) {
      console.log("Done with the quiz...");
      return;
    }
    const nextIndex = boxIndex + 1;

    if (nextIndex < boxOrder.length) {
      setBoxIndex(boxIndex + 1);
    } else {
      setBoxIndex(0);
    }

    setIsBreak(false);
    setSelectedAnswerIndex(null);
  };

  const checkIfDone = () => {
    // change when starred is added.
    if (box4 !== null && originalDeck) {
      if (box4.length >= originalDeck.length) {
        return true;
      } else {
        return false;
      }
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "") {
      console.log(e.target.value);
      setAnswerWithPending(e.target.value);
    }
  };

  const getStarredDeck = () => {
    if (starredList !== null) {
      console.log(starredList);

      // Filter the original deck based on the starredList
      const newDeck = originalDeck.filter((flashcard) =>
        starredList.includes(flashcard.cardId)
      );

      // Shuffle the new deck
      setShuffledDeck(arrayShuffle(newDeck));
    }
  };
  const resetLearn = () => {
    setBox0(null);
    setBox1(null);
    setBox2(null);
    setBox3(null);
    setBox4(null);
    setBoxIndex(-1);
    setIsStart(false);
    setCurrentCardIndex(0);
    setCurrentCardList(null);
    setSelectedAnswerIndex(null);
    setIsBreak(false);
    setCorrectCards(null);
    setWrongCards(null);
    setIsRetrying(false);
    setAnswerWith(answerWithPending);

    if (isStarredOnly) {
      getStarredDeck();
    } else {
      setShuffledDeck(arrayShuffle(originalDeck));
    }

    onClose();
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
              <Button onClick={() => onOpen()} isIconOnly>
                <FaGear />
              </Button>
            </div>
          </div>
          <div className="space-y-4 pb-2">
            <p className="font-semibold">
              {deckData ? deckData.title : "Loading..."}
            </p>
            {/* <p>{boxOrder[boxIndex]}</p> */}
            <Progress
              aria-label="Loading..."
              value={
                currentCardList
                  ? (currentCardIndex / (currentCardList.length - 1)) * 100
                  : 0
              }
              size="sm"
            />
          </div>
          {!isLoading ? (
            !isBreak ? (
              <QuizCard
                flashcard={
                  currentCardList ? currentCardList[currentCardIndex] : null
                }
                originalDeck={originalDeck}
                selectedAnswerIndex={selectedAnswerIndex}
                selectAnswer={selectAnswer}
                correctIndex={correctIndex}
                boxIndex={boxIndex}
                isRetrying={isRetrying}
                answerWith={answerWith}
              />
            ) : (
              <QuizRoundBreak
                nextRound={nextRound}
                correctCards={correctCards}
                wrongCards={wrongCards}
              />
            )
          ) : (
            <Spinner />
          )}
        </div>
      </div>

      {selectedAnswerIndex !== null && !isBreak ? (
        <div className="">
          <Button
            size="lg"
            color="primary"
            className="font-semibold"
            onClick={nextCard}
          >
            Continue
          </Button>
        </div>
      ) : null}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">
                Learn Options
              </ModalHeader>
              <ModalBody className="text-black/90 dark:text-gray-100">
                <div className="space-y-4">
                  <Checkbox
                    onValueChange={setIsStarredOnly}
                    isSelected={isStarredOnly}
                  >
                    Starred only
                  </Checkbox>
                  <div className="py-1">
                    <Select
                      label="Answer with"
                      labelPlacement="outside"
                      placeholder=""
                      value={answerWithPending}
                      defaultSelectedKeys={[answerWithPending]}
                      className="text-base"
                      size="md"
                      onChange={handleSelectChange}
                    >
                      <SelectItem
                        key="term"
                        value="term"
                        isDisabled={answerWithPending === "term" ? true : false}
                        className="text-black dark:text-white"
                      >
                        Term
                      </SelectItem>
                      <SelectItem
                        key="def"
                        value="definition"
                        isDisabled={answerWithPending === "def" ? true : false}
                        className="text-black dark:text-white"
                      >
                        Definition
                      </SelectItem>
                      {/* <SelectItem
                        key="mixed"
                        value="mixed"
                        isDisabled={
                          answerWithPending === "mixed" ? true : false
                        }
                        className="text-black dark:text-white"
                      >
                        Mixed
                      </SelectItem> */}
                    </Select>
                  </div>
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
                  onPress={resetLearn}
                  className="font-semibold"
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="py-4"></div>
    </div>
  );
};

export default Quiz;

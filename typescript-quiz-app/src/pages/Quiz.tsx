import {
  Card,
  CardBody,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Switch,
} from "@nextui-org/react";
import LearnAnswers from "../components/QuizAnswers";
import { Progress, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import axios from "axios";
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
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import { Flashcard } from "../assets/globalTypes";
import arrayShuffle from "array-shuffle";
import { FaGear } from "react-icons/fa6";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";

const Quiz = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionFirst, _setIsQuestionFirst] = useState(true);
  // const [isShuffled, setIsShuffled] = useState(true);
  const [deckData, setDeckData] = useState<DocumentData | null>(null);
  const [originalDeck, setOriginalDeck] = useState<Flashcard[] | null>(null);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null); // currently using card
  const [cardsLeft, setCardsLeft] = useState<Flashcard[] | null>(null); // cards left to learn
  const [boxOne, setBoxOne] = useState<Flashcard[] | null>(null);
  const [boxOnePending, setBoxOnePending] = useState<Flashcard[] | null>(null);
  // const [boxTwo, setBoxTwo] = useState<Flashcard[] | null>(null);
  const [boxTwoPending, setBoxTwoPending] = useState<Flashcard[] | null>(null);
  // const [boxThree, setBoxThree] = useState<Flashcard[] | null>(null);
  // const [boxThreePending, setBoxThreePending] = useState<Flashcard[] | null>(
  //   null
  // );
  // const boxOrder = [1, 1, 2, 1, 1, 2, 1, 1, 3];
  const [boxIndex, _setBoxIndex] = useState(0);
  const [currentBox, _setCurrentBox] = useState(0);
  const [distractors, setDistractors] = useState<string[] | null>(null); // cards left to learn
  const [storedDistractors, setStoredDistractors] = useState<string[] | null>(
    null
  ); // distractors stored in advance
  const [randomIndex, setRandomIndex] = useState(0); // for which slot the correct answer will be
  const [isCorrect, setIsCorrect] = useState(false); // for which slot the correct answer will be

  let { id } = useParams();

  useEffect(() => {
    initializeDeck();
  }, []);

  useEffect(() => {
    if (!isLoading && boxOne === null && boxIndex === 0 && deckData !== null) {
      startLearn();
    }
  }, [isLoading]);

  useEffect(() => {
    if (boxOne !== null && boxOne.length > 0) {
      changeCurrentCard();
      console.log("Box one: ");
      console.log(boxOne);
    }
  }, [boxOne]);

  useEffect(() => {
    if (currentCard !== null) {
      changeAnswers();
    }
  }, [currentCard]);

  useEffect(() => {
    if (distractors !== null) {
      console.log(distractors);
    }
  }, [distractors]);

  const initializeDeck = async () => {
    setIsLoading(true);

    const q = query(collectionGroup(db, "cards"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      setDeckData(docRef.docs[0].data());
      setCardsLeft(docRef.docs[0].data().cards);
      setOriginalDeck(docRef.docs[0].data().cards);

      console.log(docRef.docs[0].data().cards);
      setIsLoading(false);
    } catch (e) {
      console.log("error occurred: " + e);
      setIsLoading(false);
    }
  };

  // const handleShuffleDeck = () => {
  //   if (cardsLeft !== null) {
  //     setCardsLeft(arrayShuffle(cardsLeft));
  //   }
  // };

  const startLearn = () => {
    console.log("Starting Quiz.");
    drawCards(10);
  };

  const drawCards = (num: number) => {
    if (cardsLeft && cardsLeft.length > 0) {
      // Clone the cardsLeft array to avoid mutating the original state
      const remainingCards = [...cardsLeft];

      // Take the first 10 cards and update boxOne state
      const selectedCards = remainingCards.slice(
        0,
        Math.min(num, remainingCards.length)
      );

      // Create a new array with both the original and new cards in boxOne
      const newBoxOne = boxOne ? [...boxOne, ...selectedCards] : selectedCards;
      setBoxOne(newBoxOne);

      // Update cardsLeft by removing the selected cards
      setCardsLeft(remainingCards.slice(selectedCards.length));
    } else {
      console.log("No more cards to draw.");
    }
  };

  const nextCard = () => {
    if (boxOne !== null && boxOne.length - 1 > 0) {
      handleAnswer(isCorrect);
    }
  };

  const changeCurrentCard = async () => {
    if (boxOne && boxOne.length > 0) {
      console.log(boxOne[0]);
      setCurrentCard(boxOne[0]);

      if (storedDistractors !== null) {
        console.log("used stored distractors...");
        setDistractors(storedDistractors);
      }

      // Fetch the next card and initiate ChatGPT API call
      const nextCard = boxOne[1];
      if (nextCard !== undefined) {
        await callChatGPT(nextCard, true);
      }
    } else {
      if (boxOne) {
        setCurrentCard(boxOne[0]);
        setDistractors(storedDistractors);
      }
      console.log("No more cards in the box.");
    }
  };

  const changeAnswers = () => {
    if (currentCard !== null) {
      generateRandomIndex(); // randomize which answer will be the correct one

      if (storedDistractors === null) {
        generateRandomDistractors();
      } else {
        setDistractors(storedDistractors);
        setStoredDistractors(null);
      }
    }
  };

  const callChatGPT = (flashcard: Flashcard, isNext: boolean) => {
    // FOR CHATGPT API
    console.log(flashcard);

    const prompt = isQuestionFirst ? flashcard.front : flashcard.back;

    axios
      .post("http://localhost:8080/chat", { prompt })
      .then((res) => {
        if (isNext) {
          setStoredDistractors(splitAnswers(res.data));
        } else {
          setDistractors(splitAnswers(res.data));
        }

        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const generateRandomIndex = () => {
    const newIndex = Math.floor(Math.random() * 4);
    setRandomIndex(newIndex);
  };

  const splitAnswers = (inputString: string): string[] => {
    // Use a regular expression to match the answers without the letters
    const answerMatches = inputString.match(/[A-D]\.\s*(.+)/gi);

    if (answerMatches) {
      // Extract and return the answers in an array
      return answerMatches.map((answer) =>
        answer.replace(/[a-d]\.\s*/i, "").trim()
      );
    } else {
      return [];
    }
  };

  const generateRandomDistractors = () => {
    if (originalDeck !== null) {
      if (!isQuestionFirst) {
        const allBacks = originalDeck.map((flashcard) => flashcard.back);
        const shuffledBacks = arrayShuffle(allBacks);
        const selectedDistractors = shuffledBacks.slice(0, 4);
        setDistractors(selectedDistractors);
      } else {
        const allFronts = originalDeck.map((flashcard) => flashcard.front);
        const shuffledFronts = arrayShuffle(allFronts);
        const selectedDistractors = shuffledFronts.slice(0, 4);
        setDistractors(selectedDistractors);
      }

      console.log("Used shuffled distractors instead of ChatGPT.");
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (currentBox === 0 && currentCard) {
      if (isCorrect) {
        if (boxTwoPending) {
          setBoxTwoPending([...boxTwoPending, currentCard]);
        } else {
          setBoxTwoPending([currentCard]);
        }

        console.log("Correct!");
      } else {
        if (boxOnePending) {
          setBoxOnePending([...boxOnePending, currentCard]);
        } else {
          setBoxOnePending([currentCard]);
        }

        console.log("Wrong!");
      }

      setBoxOne((prevBoxOne) =>
        prevBoxOne
          ? prevBoxOne.filter((card) => card.cardId !== currentCard.cardId)
          : []
      );
    }
  };
  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-2">
      <div className="flex justify-center">
        <div className="max-w-[900px] space-y-2 px-4 flex-grow-1 w-full">
          <p className="text-center text-base font-semibold">Round 1</p>
          <div className="flex justify-between">
            <div></div>
            <div></div>

            <Popover placement="top" offset={10}>
              <PopoverTrigger>
                <Button isIconOnly variant="light">
                  <FaGear className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-1 py-2 space-y-4">
                  <RadioGroup
                    label="Initial Side"
                    orientation="horizontal"
                    // defaultValue={props.isFrontFirst ? "front" : "back"}
                    // onChange={(event) =>
                    //   props.changeInitialCardSide(event.target.value)
                    // }
                  >
                    <Radio value="front">Front</Radio>
                    <Radio value="back">Back</Radio>
                  </RadioGroup>
                  <Divider className="my-4" />
                  <RadioGroup
                    label="Filter Cards"
                    orientation="horizontal"
                    // onChange={(event) =>
                    //   // props.changeStarredSelected(event.target.value)
                    // }
                    // defaultValue={props.isStarredOnly ? "starred" : "all"}
                  >
                    <Radio value="all">All</Radio>
                    <Radio value="starred">Starred Only</Radio>
                  </RadioGroup>
                  <Divider className="my-4" />
                  <div className="text-center">
                    <p className="text-gray-800 dark:text-gray-400 py-2">
                      Shuffle Cards
                    </p>
                    <Switch
                      aria-label="Shuffle Cards"
                      size="sm"
                      // isSelected={props.isShuffled}
                      // onChange={() => props.shuffleDeck(props.isShuffled)}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* <p className="text-center text-sm font-semibold">
            {1 + " / " + boxOne?.length}
          </p> */}
          <Progress
            aria-label="Loading..."
            value={boxOne ? 100 - ((boxOne.length - 1) / 10) * 100 : 0}
            className="py-2"
            size="sm"
          />
          {distractors ? (
            <Card className="h-[500px]">
              <CardBody className="space-y-8 p-12">
                <p className="text-left text-xl font-semibold pb-24">
                  {currentCard
                    ? isQuestionFirst
                      ? currentCard.back
                      : currentCard.front
                    : null}
                </p>
                <div className="items-end flex flex-grow justify-center w-full h-full">
                  <LearnAnswers
                    currentCard={currentCard}
                    distractors={distractors}
                    correctAnswer={
                      currentCard
                        ? isQuestionFirst
                          ? currentCard.front
                          : currentCard.back
                        : null
                    }
                    correctIndex={randomIndex}
                    setIsCorrect={setIsCorrect}
                  />
                </div>
              </CardBody>
            </Card>
          ) : null}
          <div className="items-center py-2">
            <Button
              size="lg"
              color="primary"
              className="font-semibold"
              onClick={() => nextCard()}
            >
              Next Card
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

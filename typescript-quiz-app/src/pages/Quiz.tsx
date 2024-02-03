import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Switch,
} from "@nextui-org/react";
import QuizAnswers from "../components/QuizAnswers";
import { Progress, Button } from "@nextui-org/react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  query,
  where,
  collectionGroup,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "../firebase";
import { Flashcard } from "../assets/globalTypes";
import arrayShuffle from "array-shuffle";
import { FaGear } from "react-icons/fa6";
import QuizRoundBreak from "../components/QuizRoundBreak";
import { motion } from "framer-motion";

const Quiz = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isQuestionFirst, _setIsQuestionFirst] = useState(true);
  // const [isShuffled, setIsShuffled] = useState(true);
  const [deckData, setDeckData] = useState<DocumentData | null>(null);
  const [originalDeck, setOriginalDeck] = useState<Flashcard[] | null>(null);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null); // currently using card
  const [cardsLeft, setCardsLeft] = useState<Flashcard[] | null>(null); // cards left to learn
  const [currentBox, setCurrentBox] = useState<Flashcard[] | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(-1); // which order we are in box order
  const [boxOne, setBoxOne] = useState<Flashcard[]>([]);
  const [boxTwo, setBoxTwo] = useState<Flashcard[]>([]);
  const [boxThree, setBoxThree] = useState<Flashcard[]>([]);
  const boxOrder = [1, 1, 2, 1, 1, 2, 1, 1, 3];
  const [boxIndex, setBoxIndex] = useState(0); // which order we are in box order
  const [distractors, setDistractors] = useState<string[] | null>(null); // cards left to learn
  const [storedDistractors, setStoredDistractors] = useState<string[] | null>(
    null
  ); // distractors stored in advance
  const [randomIndex, setRandomIndex] = useState(0); // for which slot the correct answer will be
  const [showCorrect, setShowCorrect] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isRoundBreak, setIsRoundBreak] = useState(false);
  const [cardsCorrect, setCardsCorrect] = useState<Flashcard[] | null>(null);
  const [cardsWrong, setCardsWrong] = useState<Flashcard[] | null>(null);
  const [cardsStudied, setCardsStudied] = useState(0);

  let { id } = useParams();

  useEffect(() => {
    initializeDeck();
  }, []);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Do something when any key is pressed
      console.log("Key pressed:", event.key);

      // You can perform additional logic based on the key pressed
      if (event.key !== "Enter" && showCorrect) {
        console.log("Enter key pressed");
        nextCard();
        // Perform specific actions for Enter key
      }
    };

    // Attach the event listener when the component mounts
    document.addEventListener("keydown", handleKeyPress);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentCardIndex, showCorrect]);

  useEffect(() => {
    if (
      !isLoading &&
      currentBox === null &&
      boxIndex === 0 &&
      deckData !== null
    ) {
      startLearn();
    }
  }, [isLoading]);

  useEffect(() => {
    if (currentBox !== null) {
      changeCurrentCard();
    }
  }, [currentCardIndex]);

  useEffect(() => {
    if (currentCard !== null) {
      changeAnswers();
    }
  }, [currentCard]);

  useEffect(() => {
    // run when we show answers
    if (showCorrect) {
      handleAnswer(isCorrect);
    }
  }, [showCorrect]);

  useEffect(() => {
    // run when we show answers
    if (currentBox !== null) {
      handleWhichRound();
    }
  }, [boxIndex]);

  const initializeDeck = async () => {
    setIsLoading(true);

    const q = query(collectionGroup(db, "cards"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      setDeckData(docRef.docs[0].data());
      setCardsLeft(docRef.docs[0].data().cards);
      setOriginalDeck(docRef.docs[0].data().cards);

      // console.log(docRef.docs[0].data().cards);
      setIsLoading(false);
    } catch (e) {
      console.log("error occurred: " + e);
      setIsLoading(false);
    }
  };

  const startLearn = () => {
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
      setCurrentBox(newBoxOne);
      setBoxOne(newBoxOne);
      setCurrentCardIndex(0);

      // Update cardsLeft by removing the selected cards
      setCardsLeft(remainingCards.slice(selectedCards.length));
    } else {
      console.log("No more cards to draw.");
      nextRound();
    }
  };

  const nextCard = () => {
    if (currentBox !== null && currentCardIndex < currentBox.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      roundBreak();
    }
  };

  const roundBreak = () => {
    setIsRoundBreak(true);
    console.log(boxOne);
    console.log(boxTwo);
    console.log(boxThree);
  };

  const nextRound = () => {
    setIsRoundBreak(false);

    if (boxIndex < boxOrder.length - 1) {
      setBoxIndex(boxIndex + 1);
    } else if (boxOne && boxTwo && boxThree) {
      if (boxOne.length > 0 || boxTwo.length > 0 || boxThree.length > 0) {
        setBoxIndex(0);
      } else {
        // DONE
        console.log("No more cards to study. You finished!");
      }
    }
  };

  const handleWhichRound = () => {
    setCurrentCardIndex(0);

    if (boxIndex === 0 || boxIndex === 3 || boxIndex === 6) {
      if (cardsLeft && cardsLeft.length > 0) {
        drawCards(5);
      } else {
        nextRound();
      }
    } else if (boxIndex == 1 || boxIndex == 4 || boxIndex == 7) {
      if (boxOne && boxOne.length > 0) {
        setCurrentBox(boxOne);
      } else {
        nextRound();
      }
    } else if (boxIndex == 2 || boxIndex == 5) {
      if (boxTwo && boxTwo.length > 0) {
        setCurrentBox(boxTwo);
      } else {
        nextRound();
      }
    } else {
      if (boxThree && boxThree.length > 0) {
        setCurrentBox(boxThree);
      } else {
        nextRound();
      }
    }
  };

  const changeCurrentCard = async () => {
    if (currentBox) {
      setCurrentCard(currentBox[currentCardIndex]);

      if (storedDistractors !== null) {
        setDistractors(storedDistractors);
      }

      // Fetch the next card and initiate ChatGPT API call
      const nextCard = currentBox[currentCardIndex + 1];
      if (nextCard !== undefined) {
        await callChatGPT(nextCard, true);
      }
    } else {
      if (currentBox) {
        setCurrentCard(currentBox[currentCardIndex]);
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

    const prompt = isQuestionFirst ? flashcard.front : flashcard.back;

    axios
      .post("http://localhost:8080/chat", { prompt })
      .then((res) => {
        if (isNext) {
          setStoredDistractors(splitAnswers(res.data));
        } else {
          setDistractors(splitAnswers(res.data));
        }
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

      // console.log("Used shuffled distractors instead of ChatGPT.");
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    setCardsStudied((prevCardsStudied) => prevCardsStudied + 1);

    if (currentCard && boxOne && boxTwo && boxThree) {
      const boxOneIndices = [0, 1, 3, 4, 6, 7];
      const boxTwoIndices = [2, 5];
      const boxThreeIndex = 8;

      if (isCorrect) {
        if (boxOneIndices.includes(boxIndex)) {
          // Move to boxTwo from boxOne
          setBoxTwo((prevBoxTwo) => [...(prevBoxTwo || []), currentCard]);

          setBoxOne((prevBoxOne) =>
            prevBoxOne.filter((card) => card.cardId !== currentCard.cardId)
          );
        } else if (boxTwoIndices.includes(boxIndex)) {
          // Move to boxThree from boxTwo
          setBoxThree((prevBoxThree) => [...(prevBoxThree || []), currentCard]);

          setBoxTwo((prevBoxTwo) =>
            prevBoxTwo
              ? prevBoxTwo.filter((card) => card.cardId !== currentCard.cardId)
              : []
          );
        } else if (boxThreeIndex === boxIndex) {
          // Do something specific for box three when mastered
          // For now, let's just move it back to boxOne

          setBoxThree((prevBoxThree) =>
            prevBoxThree
              ? prevBoxThree.filter(
                  (card) => card.cardId !== currentCard.cardId
                )
              : []
          );
        }

        setCardsCorrect((prevCardsCorrect) => [
          ...(prevCardsCorrect || []),
          currentCard,
        ]);
      } else {
        // Incorrect answer, move to boxOne
        if (!boxOneIndices.includes(boxIndex)) {
          setBoxOne((prevBoxOne) =>
            prevBoxOne ? [...prevBoxOne, currentCard] : [currentCard]
          );

          if (boxTwoIndices.includes(boxIndex)) {
            // If it was in boxTwo, remove it from there
            setBoxTwo((prevBoxTwo) =>
              prevBoxTwo
                ? prevBoxTwo.filter(
                    (card) => card.cardId !== currentCard.cardId
                  )
                : []
            );
          } else if (boxThreeIndex === boxIndex) {
            // If it was in boxThree, remove it from there
            setBoxThree((prevBoxThree) =>
              prevBoxThree
                ? prevBoxThree.filter(
                    (card) => card.cardId !== currentCard.cardId
                  )
                : []
            );
          }
        }

        setCardsWrong((prevCardsWrong) => [
          ...(prevCardsWrong || []),
          currentCard,
        ]);
      }
    }
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-2">
      <div className="flex justify-center">
        <div className="max-w-[900px] space-y-2 px-4 flex-grow-1 w-full">
          <div className="flex justify-center relative py-2">
            <div className="flex-grow flex justify-center items-center">
              <p className="text-center text-base font-semibold">Round 1</p>
              {/* <p className="text-center text-base font-semibold">
                Box index: {boxIndex}
              </p> */}
            </div>
            <div className="flex-grow flex justify-end absolute right-0">
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
          </div>
          <Progress
            aria-label="Loading..."
            value={
              currentBox
                ? (currentCardIndex / (currentBox.length - 1)) * 100
                : 0
            }
            className="py-2"
            size="sm"
          />
          {!isRoundBreak ? (
            distractors ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
              >
                <Card className="min-h-[500px] max-h-[800px]">
                  <CardHeader className="absolute">
                    {boxIndex == 1 || boxIndex == 4 || boxIndex == 7 ? (
                      <Chip color="danger">
                        <p className=" font-semibold">Let's try that again.</p>
                      </Chip>
                    ) : null}
                  </CardHeader>
                  <CardBody className="space-y-8 p-12">
                    <p className="text-left text-xl font-semibold pb-24">
                      {currentCard
                        ? isQuestionFirst
                          ? currentCard.back
                          : currentCard.front
                        : null}
                    </p>
                    <div className="items-end flex flex-grow justify-center w-full h-full">
                      <QuizAnswers
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
                        showCorrect={showCorrect}
                        setShowCorrect={setShowCorrect}
                      />
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ) : null
          ) : (
            <QuizRoundBreak
              nextRound={() => nextRound()}
              cardsCorrect={cardsCorrect}
              cardsWrong={cardsWrong}
              cardsStudied={cardsStudied}
            />
          )}
          {showCorrect && !isRoundBreak ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="items-center py-2 space-y-2"
            >
              <Button
                size="lg"
                color="primary"
                className="font-semibold"
                onClick={() => nextCard()}
              >
                Next Card
              </Button>
              <p className="font-semibold">Tap any key to keep going!</p>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Quiz;

import TestQuestion from "../components/TestQuestion";
import { Button, Checkbox, Chip, Divider } from "@nextui-org/react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { FaGear } from "react-icons/fa6";
import {
  query,
  collectionGroup,
  where,
  getDocs,
  doc,
  getDoc,
  DocumentData,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Flashcard } from "../assets/globalTypes";
import { useState, useEffect, ChangeEvent } from "react";
import TestContainer from "../components/TestContainer";
import { motion } from "framer-motion";

const flashcards: Flashcard[] = [
  {
    front: "",
    back: "",
    cardId: "1",
  },
];

const Test = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const {
    isOpen: sureIsOpen,
    onOpen: sureOnOpen,
    onOpenChange: sureOnOpenChange,
    onClose: sureOnClose,
  } = useDisclosure();
  const {
    isOpen: lockedIsOpen,
    onOpen: lockedOnOpen,
    onOpenChange: lockedOnOpenChange,
  } = useDisclosure();
  const navigate = useNavigate();
  const { id } = useParams();
  const userID = auth.currentUser?.displayName ?? null;

  const [deckData, setDeckData] = useState<DocumentData | null>(null);
  const [score, setScore] = useState(0);
  const [numberOfCards, setNumberOfCards] = useState(0);
  const [error, setError] = useState("");
  const [initialDeck, setInitialDeck] = useState(flashcards);
  const [currentDeck, setCurrentDeck] = useState(flashcards); // currently using deck we have modified
  const [isLoading, setIsLoading] = useState(true); // currently using card
  const [starredList, setStarredList] = useState<string[]>([]);
  const [didStartTest, setDidStartTest] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(20);
  const [numberOfQuestionsPending, setNumberOfQuestionsPending] = useState(20);
  const [isStarredOnly, setIsStarredOnly] = useState(false);
  const [answerWith, setAnswerWith] = useState("term");
  const [answerWithPending, setAnswerWithPending] = useState("term"); // so we don't change the test automatically
  const [finishedTest, setFinishedTest] = useState(false);
  const [correctCards, setCorrectCards] = useState<Flashcard[]>([]);
  const [wrongCards, setWrongCards] = useState<Flashcard[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [triedToSubmit, setTriedToSubmit] = useState(false); // let the questions know which ones are missing answers when user submits

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
      lockedOnOpen();
      setIsLoading(false);
    }
  };

  const initializeDeck = async () => {
    if (deckData?.private && deckData.owner !== userID) {
      lockedOnOpen();

      setIsLoading(false);
      setError("private");
      return;
    }

    const q = query(collectionGroup(db, "cards"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      setInitialDeck(docRef.docs[0].data().cards);
    } catch (e) {
      console.log("error occurred: " + e);
      setError("undefined");

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

  const handleCreateNewTest = () => {
    setDidStartTest(false);
    setIsLoading(true);

    const timeOutId = setTimeout(() => {
      // so test doesn't flicker when we make a new one.
      setDidStartTest(true);
      setIsLoading(false);
    }, 300);

    shuffleDeck();
    setWrongCards([]);
    setCorrectCards([]);
    setFinishedTest(false);
    setIsReviewing(false);
    onClose();
    setAnswerWith(answerWithPending);
    setTriedToSubmit(false);
    setNumberOfQuestions(numberOfQuestionsPending);

    window.scrollTo({ top: 0, behavior: "smooth" });

    useEffect(() => {
      return () => {
        clearTimeout(timeOutId);
      };
    }, []); // Empty dependency array means it will only run on mount and unmount
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    // Check if the value is a number and within the specified range
    if (!isNaN(value) && value >= 0 && value <= 50) {
      setNumberOfQuestionsPending(value);
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "") {
      console.log(e.target.value);
      setAnswerWithPending(e.target.value);
    }
  };

  const shuffleDeck = () => {
    const starredCards = initialDeck.filter((card) =>
      starredList?.includes(card.cardId)
    );

    let shuffledDeck: Flashcard[] = [];

    if (isStarredOnly) {
      shuffledDeck = [...starredCards].sort(() => Math.random() - 0.5);
    } else {
      shuffledDeck = [...initialDeck].sort(() => Math.random() - 0.5);
    }

    setCurrentDeck(shuffledDeck);
  };

  const generateWrongAnswers = (correctAnswer: Flashcard) => {
    const wrongAnswers: Flashcard[] = [];
    const allFlashcardsExceptCorrect = currentDeck.filter(
      (card) => card !== correctAnswer
    );

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(
        Math.random() * allFlashcardsExceptCorrect.length
      );
      const wrongFlashcard = allFlashcardsExceptCorrect[randomIndex];
      allFlashcardsExceptCorrect.splice(randomIndex, 1);
      wrongAnswers.push(wrongFlashcard);
    }

    return wrongAnswers;
  };

  const handleAnswer = (flashcard: Flashcard, isCorrect: boolean) => {
    if (isCorrect) {
      // Add the flashcard to the correctCards array
      setCorrectCards((prevCorrectCards) => [...prevCorrectCards, flashcard]);

      // Remove the flashcard from the wrongCards array if it contains it
      setWrongCards((prevWrongCards) =>
        prevWrongCards.filter((card) => card !== flashcard)
      );
    } else {
      // Add the flashcard to the wrongCards array
      setWrongCards((prevWrongCards) => [...prevWrongCards, flashcard]);

      // Remove the flashcard from the correctCards array if it contains it
      setCorrectCards((prevCorrectCards) =>
        prevCorrectCards.filter((card) => card !== flashcard)
      );
    }
  };

  const handleSubmitTest = (submitAnyway: boolean) => {
    if (
      correctCards.length + wrongCards.length >=
        Math.min(numberOfQuestions, currentDeck.length) ||
      submitAnyway
    ) {
      console.log("Done");
      setTriedToSubmit(false);
      sureOnClose();
    } else {
      console.log(currentDeck.length);
      console.log("not done.");
      setTriedToSubmit(true);
      sureOnOpen();
      return;
    }
    setFinishedTest(true);
    setIsReviewing(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReview = () => {
    setIsReviewing(true);
  };

  const handleOpenModal = () => {
    onOpen();
  };

  useEffect(() => {
    // handles the score
    const totalCards = wrongCards.length + correctCards.length;
    const numberOfCards = Math.min(numberOfQuestions, currentDeck.length);

    if (totalCards > 0) {
      const calculatedScore = (correctCards.length / numberOfCards) * 100;
      setScore(calculatedScore);
    } else {
      // Handle the case where there are no cards (to prevent division by zero)
      setScore(0);
    }
  }, [wrongCards, correctCards]);

  useEffect(() => {
    // set the number of cards
    setNumberOfCards(Math.min(numberOfQuestions, currentDeck?.length));
  }, [numberOfQuestions, currentDeck]);

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="space-y-5 flex justify-center items-center ">
        <div className="max-w-[1000px] flex-grow space-y-4 mx-4 pb-10">
          <motion.div
            initial={{ opacity: 0.75 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <p className="font-semibold">{deckData?.title ?? "Loading..."}</p>
          </motion.div>
          <div className="space-x-2 flex justify-between mx-1">
            <div className="space-x-2 flex items-center relative justify-between w-full">
              <Button onClick={() => navigate(`/study/${id}`)} className="z-10">
                <IoIosArrowRoundBack className="w-7 h-7" /> Back
              </Button>
              <div></div>
              {/* {deckData ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="md:absolute w-full"
                >
                  <p className="font-semibold">{deckData?.title}</p>
                </motion.div>
              ) : null} */}

              <Button isIconOnly onClick={() => onOpen()}>
                <FaGear />
              </Button>
              <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">
                        Test Options
                      </ModalHeader>
                      <ModalBody className="text-black/90 dark:text-gray-100">
                        <div className="space-y-6">
                          <div className="flex items-center space-x-2 justify-start">
                            <input
                              step={5}
                              type="number"
                              className="w-[72px] h-8 description rounded-lg bg-gray-100 dark:bg-dark-2"
                              min={5}
                              max={50}
                              onChange={handleInputChange}
                              value={numberOfQuestionsPending}
                            />
                            <p className="text-base">Questions</p>
                          </div>
                          <div className="flex space-x-1 justify-start w-full">
                            <Checkbox
                              size="lg"
                              isSelected={isStarredOnly}
                              onValueChange={setIsStarredOnly}
                              isDisabled={
                                starredList?.length > 4 ? false : true
                              }
                            >
                              <p className="text-base">Starred only</p>
                            </Checkbox>
                            {starredList?.length < 4 ||
                            starredList === null ||
                            starredList === undefined ? (
                              <Chip
                                color="warning"
                                size="sm"
                                className="font-semibold opacity-60"
                              >
                                <p className="font-semibold">
                                  Needs at least 5 starred cards
                                </p>
                              </Chip>
                            ) : null}
                          </div>

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
                                isDisabled={
                                  answerWithPending === "term" ? true : false
                                }
                                className="text-black dark:text-white"
                              >
                                Term
                              </SelectItem>
                              <SelectItem
                                key="def"
                                value="definition"
                                isDisabled={
                                  answerWithPending === "def" ? true : false
                                }
                                className="text-black dark:text-white"
                              >
                                Definition
                              </SelectItem>
                              <SelectItem
                                key="mixed"
                                value="mixed"
                                isDisabled={
                                  answerWithPending === "mixed" ? true : false
                                }
                                className="text-black dark:text-white"
                              >
                                Mixed
                              </SelectItem>
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
                          onPress={handleCreateNewTest}
                          className="font-semibold"
                        >
                          Create New Test
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
              <Modal isOpen={sureIsOpen} onOpenChange={sureOnOpenChange}>
                <ModalContent className="text-black dark:text-white">
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1 text-black dark:text-white">
                        Unanswered Questions
                      </ModalHeader>
                      <ModalBody>
                        <p>
                          It seems you haven't answered all the questions on the
                          test. Are you sure you want to submit it without
                          answering all questions?
                        </p>
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
                          onPress={() => handleSubmitTest(true)}
                          className="font-semibold"
                        >
                          Submit Anyway
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
              <Modal
                isOpen={lockedIsOpen}
                onOpenChange={lockedOnOpenChange}
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
                            ? "This flashcard set is possibly deleted or does not exist."
                            : null}
                        </p>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="primary"
                          onPress={() => navigate("/")}
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
          </div>
          {finishedTest && isReviewing ? (
            <div className="relative pb-3 pt-6">
              <div className="w-full flex justify-center space-y-2">
                <div>
                  <p className="font-semibold text-2xl">
                    {score.toFixed(0)} / 100
                  </p>
                </div>
              </div>

              <div className="absolute items-start justify-start md:flex space-x-0 md:space-x-2 space-y-1 md:space-y-0 bottom-0 left-0">
                <div className="flex justify-start">
                  <Chip color="success" className="font-semibold" size="md">
                    <p className="font-semibold">
                      {correctCards.length} Correct
                    </p>
                  </Chip>
                </div>
                <div className="flex justify-start">
                  <Chip color="danger" className="font-semibold" size="md">
                    <p className="font-semibold">
                      {numberOfCards - correctCards.length} Wrong
                    </p>
                  </Chip>
                </div>
              </div>
            </div>
          ) : null}

          <div className={finishedTest ? (!isReviewing ? "hidden" : "") : ""}>
            {didStartTest && initialDeck.length > 1 ? (
              <motion.div
                initial={{ opacity: 0, translateY: 10 }}
                animate={{
                  opacity: 1,
                  translateY: 0,
                }}
                transition={{ type: "spring", duration: 0.8 }}
                className="space-y-4"
              >
                <Card shadow="sm">
                  {Array.from({
                    length: numberOfCards,
                  }).map((_, index) => (
                    <div key={index}>
                      <TestQuestion
                        flashcard={currentDeck[index]}
                        answerWith={answerWith}
                        index={index}
                        generateWrongAnswers={generateWrongAnswers}
                        handleAnswer={handleAnswer}
                        finishedTest={finishedTest}
                        triedToSubmit={triedToSubmit}
                      />
                      <div className="px-8">
                        {index < numberOfCards - 1 && (
                          <div className="px-2">
                            <Divider />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </Card>
                {!isReviewing ? (
                  <Button
                    color="primary"
                    size="lg"
                    className="font-semibold"
                    onClick={() => handleSubmitTest(false)}
                  >
                    Submit Test
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    size="lg"
                    className="font-semibold"
                    onClick={() => onOpen()}
                  >
                    Create New Test
                  </Button>
                )}
              </motion.div>
            ) : null}
          </div>
          {finishedTest && !isReviewing ? (
            <TestContainer
              correctCards={correctCards}
              wrongCards={wrongCards}
              score={score}
              numberOfCards={numberOfCards}
              handleReview={handleReview}
              handleOpenModal={handleOpenModal}
            />
          ) : null}
          {!didStartTest && !isReviewing && !isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-[300px] flex justify-center items-center"
            >
              <Button
                color="primary"
                size="lg"
                className="font-semibold"
                onClick={() => onOpen()}
              >
                Create New Test
              </Button>
            </motion.div>
          ) : null}
          {!didStartTest && isLoading && !isReviewing ? <Spinner /> : null}
        </div>
      </div>
    </div>
  );
};

export default Test;

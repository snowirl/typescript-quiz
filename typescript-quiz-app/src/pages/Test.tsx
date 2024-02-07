import TestQuestion from "../components/TestQuestion";
import { Button, Checkbox, Divider } from "@nextui-org/react";
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
} from "@nextui-org/react";
import { FaGear } from "react-icons/fa6";
import {
  query,
  collectionGroup,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { Flashcard } from "../assets/globalTypes";
import { useState, useEffect, ChangeEvent } from "react";
import TestContainer from "../components/TestContainer";

const flashcards: Flashcard[] = [
  {
    front: "",
    back: "",
    cardId: "1",
  },
];

const Test = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const navigate = useNavigate();
  const { id } = useParams();
  const userID = auth.currentUser?.displayName ?? null;

  const [initialDeck, setInitialDeck] = useState(flashcards);
  const [currentDeck, setCurrentDeck] = useState(flashcards); // currently using deck we have modified
  const [_isLoading, setIsLoading] = useState(true); // currently using card
  const [starredList, setStarredList] = useState<string[]>([]);
  const [didStartTest, setDidStartTest] = useState(false);
  const [numberOfQuestions, setNumberOfQuestions] = useState(20);
  const [isStarredOnly, setIsStarredOnly] = useState(false);
  const [answerWith, setAnswerWith] = useState("term");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (id !== undefined) {
        initializeDeck();
        initializeActivity();
      }
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  const initializeDeck = async () => {
    // if (deckData?.private && deckData.owner !== userID) {
    //   console.log("ERROR... DECK IS PRIVATE!");
    //   setIsLoading(false);
    //   return;
    // }
    // different function because cards are in a different place for preview purposes
    const q = query(collectionGroup(db, "cards"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      console.log(docRef.docs[0].data().cards);

      setInitialDeck(docRef.docs[0].data().cards);
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

  const handleCreateNewTest = () => {
    onClose();
    setDidStartTest(true);
    shuffleDeck();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);

    // Check if the value is a number and within the specified range
    if (!isNaN(value) && value >= 0 && value <= 50) {
      setNumberOfQuestions(value);
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "") {
      console.log(e.target.value);
      setAnswerWith(e.target.value);
    }
  };

  const shuffleDeck = () => {
    const starredCards = initialDeck.filter((card) =>
      starredList?.includes(card.cardId)
    );

    console.log(starredCards);

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

  // useEffect(() => {
  //   shuffleDeck();
  // }, [isStarredOnly]);

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="space-y-5 flex justify-center items-center ">
        <div className="max-w-[800px] flex-grow space-y-4 mx-4 pb-10">
          <div className="space-x-2 flex justify-between mx-1">
            <div className="w-1/3 space-x-2 flex items-center">
              <Button onClick={() => navigate(`/study/${id}`)}>
                <IoIosArrowRoundBack className="w-7 h-7" /> Back
              </Button>
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
                              type="number"
                              placeholder="10"
                              className="w-[72px] h-8 description rounded-lg bg-gray-100 dark:bg-dark-2"
                              min={0}
                              max={50}
                              onChange={handleInputChange}
                              value={numberOfQuestions}
                            />
                            <p className="text-base">Questions</p>
                          </div>
                          <div className="flex space-x-1 justify-start w-full">
                            <Checkbox
                              size="lg"
                              isSelected={isStarredOnly}
                              onValueChange={setIsStarredOnly}
                              isDisabled={starredList.length < 5}
                            >
                              <p className="text-base">Starred only</p>
                            </Checkbox>
                          </div>
                          <div className="py-1">
                            <Select
                              label="Answer with"
                              labelPlacement="outside"
                              placeholder=""
                              value={answerWith}
                              defaultSelectedKeys={[answerWith]}
                              className="text-base"
                              size="md"
                              onChange={handleSelectChange}
                            >
                              <SelectItem
                                key="term"
                                value="term"
                                isDisabled={
                                  answerWith === "term" ? true : false
                                }
                                className="text-black dark:text-white"
                              >
                                Term
                              </SelectItem>
                              <SelectItem
                                key="def"
                                value="definition"
                                isDisabled={answerWith === "def" ? true : false}
                                className="text-black dark:text-white"
                              >
                                Definition
                              </SelectItem>
                              <SelectItem
                                key="mixed"
                                value="mixed"
                                isDisabled={
                                  answerWith === "mixed" ? true : false
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
                          Create new test
                        </Button>
                      </ModalFooter>
                    </>
                  )}
                </ModalContent>
              </Modal>
            </div>
          </div>
          {didStartTest ? (
            <div className="space-y-4">
              <Card shadow="sm">
                {Array.from({
                  length: Math.min(numberOfQuestions, currentDeck.length),
                }).map((_, index) => (
                  <div key={index}>
                    <TestQuestion
                      flashcard={currentDeck[index]}
                      answerWith={answerWith}
                      index={index}
                      generateWrongAnswers={generateWrongAnswers}
                    />
                    <div className="px-8">
                      {index <
                        Math.min(
                          numberOfQuestions - 1,
                          currentDeck.length - 1
                        ) && (
                        <div className="px-8">
                          <Divider />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </Card>
              <Button color="primary" size="lg" className="font-semibold">
                Submit Test
              </Button>
            </div>
          ) : (
            <TestContainer />
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;

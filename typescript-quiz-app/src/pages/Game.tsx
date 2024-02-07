import GameCard from "../components/GameCard";
import { useState, useEffect } from "react";
import { Button, Checkbox } from "@nextui-org/react";
import { FaArrowRotateLeft } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  query,
  collectionGroup,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { Flashcard } from "../assets/globalTypes";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GameContainer from "../components/GameContainer";
import { auth } from "../firebase";
import { Popover, PopoverTrigger, PopoverContent } from "@nextui-org/react";
import { motion, useAnimation } from "framer-motion";

const flashcards: Flashcard[] = [
  {
    front: "",
    back: "",
    cardId: "1",
  },
];

interface GameFlashCard {
  cardId: string;
  content: string;
  image?: string;
}

const Game = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // const [deckData, setDeckData] = useState<DocumentData | null>(null);
  const [_originalDeck, setOriginalDeck] = useState(flashcards); // original deck
  const [currentDeck, setCurrentDeck] = useState(flashcards); // currently using deck we have modified
  const [_isLoading, setIsLoading] = useState(true); // currently using card
  const [gameCards, setGameCards] = useState<GameFlashCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<GameFlashCard | null>(null);
  const [selectedCard2, setSelectedCard2] = useState<GameFlashCard | null>(
    null
  );
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameState, setGameState] = useState("");
  const [completedCardIds, setCompletedCardIds] = useState<string[]>([]);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [newHighScore, setNewHighScore] = useState(false);
  const [starredList, setStarredList] = useState<string[] | null>(null);
  const [isStarredOnly, setIsStarredOnly] = useState(false);
  const userID = auth?.currentUser?.displayName ?? null;
  const { id } = useParams();
  const navigate = useNavigate();
  const controls = useAnimation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      if (id !== undefined) {
        initializeDeck();
        initializeActivity();
      }
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    } else if (!isRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (isGameStarted) {
      handleRestartGame();
    }
  }, [isStarredOnly]);

  useEffect(() => {
    // Check if time is 120 seconds and stop the game
    if (isGameStarted && time >= 120) {
      setIsGameStarted(false);
    }
  }, [time]);

  useEffect(() => {
    if (isGameStarted) {
      handleRandomizeCards();
      setTime(0);
      setIsRunning(true);
      setHasPlayed(true);
    } else {
      setCompletedCardIds([]);
      setGameState("");
      setIsRunning(false);
      checkIfHighScore(time);
    }
  }, [isGameStarted]);

  useEffect(() => {
    if (currentDeck) {
      handleRandomizeCards();
    }
  }, [currentDeck]);

  useEffect(() => {
    if (completedCardIds.length >= gameCards.length / 2) {
      setIsGameStarted(false);
    }
  }, [completedCardIds]);

  useEffect(() => {
    if (selectedCard === null || selectedCard2 === null) {
      return;
    }

    if (selectedCard?.cardId === selectedCard2?.cardId) {
      setGameState("correct");
    } else {
      setGameState("wrong");
      handlePenalty();
    }
  }, [selectedCard2]);

  useEffect(() => {
    if (gameState === "") {
      return;
    }

    const delay = 175;

    const timeoutId = setTimeout(() => {
      if (gameState === "correct" && selectedCard) {
        setSelectedCard(null);
        setSelectedCard2(null);
        setCompletedCardIds((prevCompletedCardIds) => [
          ...prevCompletedCardIds,
          selectedCard.cardId,
        ]);
      } else if (gameState === "wrong") {
        setSelectedCard(null);
        setSelectedCard2(null);
      }

      setGameState("");
    }, delay);
    return () => clearTimeout(timeoutId);
  }, [gameState]);

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

      setOriginalDeck(docRef.docs[0].data().cards);
      setCurrentDeck(docRef.docs[0].data().cards);
    } catch (e) {
      console.log("error occurred: " + e);

      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const handleRandomizeCards = () => {
    let shuffledDeck: Flashcard[] = [];
    if (starredList && isStarredOnly) {
      const starredCards = currentDeck.filter((card) =>
        starredList?.includes(card.cardId)
      );

      shuffledDeck = [...starredCards].sort(() => Math.random() - 0.5);
    } else {
      shuffledDeck = [...currentDeck].sort(() => Math.random() - 0.5);
    }

    const slicedDeck = shuffledDeck.slice(0, 6);
    const gameCards: GameFlashCard[] = [];

    slicedDeck.forEach((card) => {
      // Create a game card for the question
      const questionCard: GameFlashCard = {
        cardId: card.cardId,
        content: card.front, // Replace with the actual property representing the question
      };

      // Create a game card for the answer
      const answerCard: GameFlashCard = {
        cardId: card.cardId,
        content: card.back, // Replace with the actual property representing the answer
        image: card?.backImage,
      };

      // Add the question and answer cards to the gameCards array
      gameCards.push(questionCard, answerCard);
    });

    const shuffledGameCards = [...gameCards].sort(() => Math.random() - 0.5);
    setGameCards(shuffledGameCards);
  };

  const handleSelectCard = (card: GameFlashCard) => {
    if (completedCardIds.includes(card.cardId)) {
      // prevent clicking cards you already gotten correct
      return;
    }
    if (selectedCard === null) {
      setSelectedCard(card);
    } else if (selectedCard2 === null && card !== selectedCard) {
      setSelectedCard2(card);
    } else if (selectedCard === card) {
      setSelectedCard(null);
    }

    console.log(card);
  };

  const checkIfHighScore = (score: number) => {
    if (highScore === 0) {
      setHighScore(score);
      setNewHighScore(true);
    } else if (highScore > score) {
      setHighScore(score);
      setNewHighScore(true);
    } else {
      setNewHighScore(false);
    }
  };

  const handleRestartGame = () => {
    if (!isGameStarted) {
      return;
    }
    handleRandomizeCards();
    setTime(0);
    setIsRunning(true);
    setHasPlayed(true);
    setCompletedCardIds([]);
    setGameState("");
    setSelectedCard(null);
    setSelectedCard2(null);
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

  const handlePenalty = async () => {
    setTime(time + 1);

    await controls.start({
      opacity: 0,
      translateY: 0,
      transition: { duration: 0.1 },
      /* Add other animation properties if needed */
    });
    await controls.start({
      opacity: 1,
      translateY: -10,
      transition: { duration: 0.2 },
      /* Add other animation properties if needed */
    });

    // Set opacity back to 1
    await controls.start({
      opacity: 0,
      transition: { duration: 0.4 },
      translateY: -20,

      /* Add other animation properties if needed */
    });
  };

  return (
    <div className="flex justify-center bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="w-full max-w-[1000px] mx-6 text-left space-y-4">
        <div className="space-x-2 flex justify-between mx-1">
          <div className="w-1/3 space-x-2 flex items-center">
            <Button onClick={() => navigate(`/study/${id}`)}>
              <IoIosArrowRoundBack className="w-7 h-7" /> Back
            </Button>
          </div>
          <div className="w-1/3 flex justify-center">
            <p className="font-semibold text-lg">{time.toFixed(1)}</p>
          </div>
          <motion.div
            initial={{ opacity: 0, translateY: 0 }}
            animate={controls}
            className="absolute left-[52%]"
          >
            <p className="font-bold text-rose-500">+1</p>
          </motion.div>
          <div className="w-1/3  flex justify-end space-x-2 items-center">
            {highScore !== 0 ? (
              <p className="font-semibold mr-2 flex">
                <span className="hidden md:flex px-2">High score: </span>
                <span className="flex">{highScore.toFixed(1)}</span>
              </p>
            ) : null}
            <Button isIconOnly onClick={() => handleRestartGame()}>
              <FaArrowRotateLeft />
            </Button>

            <Popover placement="bottom">
              <PopoverTrigger>
                <Button isIconOnly>
                  <FaGear />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="px-4 py-3">
                  <Checkbox
                    isSelected={isStarredOnly}
                    onValueChange={setIsStarredOnly}
                  >
                    Starred cards only
                  </Checkbox>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        {isGameStarted ? (
          <div className=" justify-center grid grid-cols-3 md:grid-cols-4 items-center pb-10">
            {gameCards.map((card, index) => (
              <GameCard
                key={index}
                card={card}
                handleSelectCard={handleSelectCard}
                selectedCard={selectedCard}
                selectedCard2={selectedCard2}
                completedCardIds={completedCardIds}
                gameState={gameState}
              />
            ))}
          </div>
        ) : (
          <GameContainer
            setIsGameStarted={() => setIsGameStarted(true)}
            hasPlayed={hasPlayed}
            time={time}
            newHighScore={newHighScore}
          />
        )}
      </div>
    </div>
  );
};

export default Game;

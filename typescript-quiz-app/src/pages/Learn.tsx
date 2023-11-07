import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import LearnAnswers from "../components/LearnAnswers";
import { Progress } from "@nextui-org/react";
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

const flashcards: Flashcard[] = [
  {
    front: "What is the capital of Italy?",
    back: "Rome",
    cardId: "1",
  },
  {
    front: "In which century was the Colosseum built?",
    back: "1st century AD",
    cardId: "2",
  },
  {
    front: "Who was the first Roman Emperor?",
    back: "Augustus (Octavian)",
    cardId: "3",
  },
];

const Learn = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deckData, setDeckData] = useState<DocumentData | null>(null);
  const [currentCard, setCurrentCard] = useState(flashcards[0]); // currently using card
  const [cardsLeft, setCardsLeft] = useState<Flashcard[] | null>(null); // cards left to learn
  const [boxOne, setBoxOne] = useState<Flashcard[] | null>(null);
  const [boxTwo, setBoxTwo] = useState<Flashcard[] | null>(null);
  const [boxThree, setBoxThree] = useState<Flashcard[] | null>(null);
  const boxOrder = [1, 1, 2, 1, 1, 2, 1, 1, 3];
  const boxIndex = useState(0);

  let { id } = useParams();

  useEffect(() => {
    initializeDeck();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      startLearn();
    }
  }, [isLoading]);

  const initializeDeck = async () => {
    setIsLoading(true);

    const q = query(collectionGroup(db, "cards"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      setDeckData(docRef.docs[0].data());
      setCardsLeft(docRef.docs[0].data().cards);

      console.log(docRef.docs[0].data().cards);
      setIsLoading(false);
    } catch (e) {
      console.log("error occurred: " + e);
      setIsLoading(false);
    }
  };

  const startLearn = () => {
    drawCards();
  };

  const drawCards = () => {
    if (cardsLeft && cardsLeft.length > 0) {
      // Clone the cardsLeft array to avoid mutating the original state
      const remainingCards = [...cardsLeft];

      // Shuffle the array to get random cards
      arrayShuffle(remainingCards);

      // Take the first 10 cards and update boxOne state
      const selectedCards = remainingCards.slice(
        0,
        Math.min(10, remainingCards.length)
      );

      // Create a new array with both the original and new cards in boxOne
      const newBoxOne = boxOne ? [...boxOne, ...selectedCards] : selectedCards;
      setBoxOne(newBoxOne);

      // Update cardsLeft by removing the selected cards
      setCardsLeft(remainingCards.slice(selectedCards.length));

      console.log(newBoxOne);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    // FOR CHATGPT API
    e.preventDefault();
    console.log(prompt);

    axios
      .post("http://localhost:8080/chat", { prompt })
      .then((res) => {
        setResponse(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] space-y-2 px-4 flex-grow-1 w-full">
          <p className="text-center text-base font-semibold">Round 1</p>
          <p className="text-center text-sm font-semibold">0 of 7</p>
          <Progress
            aria-label="Loading..."
            value={((0 + 1) / 3) * 100}
            className="py-2"
            size="sm"
          />
          <Card>
            <CardBody className="space-y-8 p-12">
              <p className="text-center text-lg font-semibold">
                {currentCard.front}
              </p>

              <LearnAnswers />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Learn;

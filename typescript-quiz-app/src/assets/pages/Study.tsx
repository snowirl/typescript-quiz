import { Progress } from "@nextui-org/react";
import StudyButtons from "../components/StudyButtons";
import StudyCard from "../components/StudyCard";
import StudyInfo from "../components/StudyInfo";
import { Flashcard } from "../globalTypes";
import { useState } from "react";
import arrayShuffle from "array-shuffle";

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
  const [originalDeck, setOriginalDeck] = useState(flashcards); // original deck
  const [currentDeck, setCurrentDeck] = useState(flashcards); // currently using deck
  const [index, setIndex] = useState(0);
  const [isFrontFirst, setIsFrontFirst] = useState(true);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isStarredOnly, setIsStarredOnly] = useState(false);

  const shuffleDeck = (bool: boolean) => {
    if (bool) {
      setCurrentDeck(originalDeck);
      setIsShuffled(false);
    } else {
      setCurrentDeck(arrayShuffle(originalDeck));
      setIsShuffled(true);
    }
  };

  const changeStarredSelected = (val: string) => {
    if (val === "starred") {
      setIsStarredOnly(true);
    } else {
      setIsStarredOnly(false);
    }
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-[#0f0f11]">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <p className="font-bold text-2xl">Rome Flashcards</p>
          <p className="font-semibold text-sm">
            {index + 1} / {flashcards.length}
          </p>
          <p>{currentDeck[0].front}</p>
          <Progress
            aria-label="Loading..."
            value={((index + 1) / currentDeck.length) * 100}
            className=""
            size="sm"
          />
          <StudyCard
            flashcard={currentDeck[index]}
            isShuffled={isShuffled}
            shuffleDeck={shuffleDeck}
            changeStarredSelected={changeStarredSelected}
          />
          <StudyButtons
            index={index}
            setIndex={setIndex}
            length={currentDeck.length}
          />
          <StudyInfo />
          <div className="pt-10"></div>
        </div>
      </div>
    </div>
  );
};

export default Study;

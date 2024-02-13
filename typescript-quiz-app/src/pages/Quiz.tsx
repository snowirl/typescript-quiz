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
  const [_originalDeck, setOriginalDeck] = useState(flashcards); // original deck
  const [_currentDeck, setCurrentDeck] = useState(flashcards); // currently using deck we have modified
  const [_starredList, setStarredList] = useState<string[] | null>(null);

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

      console.log(docRef.docs[0].data().cards);

      setOriginalDeck(docRef.docs[0].data().cards);
      setCurrentDeck(docRef.docs[0].data().cards);
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
            <p>Title</p>
            <Progress
              aria-label="Loading..."
              value={60}
              className="max-w-full"
              size="sm"
            />
          </div>
          <QuizCard />
        </div>
      </div>
    </div>
  );
};

export default Quiz;

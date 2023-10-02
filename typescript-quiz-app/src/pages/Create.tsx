import { useEffect, useState } from "react";
import { Flashcard } from "../assets/globalTypes";
import { Button, Checkbox } from "@nextui-org/react";
import CreateCard from "../components/CreateCard";
import TextareaAutosize from "react-textarea-autosize";
import { uid } from "uid";
import { FaPlus, FaLock, FaL } from "react-icons/fa6";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import { useNavigate, useParams } from "react-router-dom";
import Alert from "../components/Alert";
import { query, collectionGroup, where, getDocs } from "firebase/firestore";
import { useUserContext } from "../context/userContext";

const Create = () => {
  const flashcard: Flashcard = {
    front: "",
    back: "",
    cardId: uid(),
    isStarred: false,
  };
  const navigate = useNavigate();
  const { user } = useUserContext();
  let { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [flashcardList, setFlashcardList] = useState([flashcard]);
  const [isCreating, setIsCreating] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorText, setErrorText] = useState(
    "An error occurred. Please try again."
  );

  useEffect(() => {
    if (id !== "new" && user !== null) {
      initializeDeck();
    }
  }, [user]);

  const handleCardAdd = () => {
    setFlashcardList([...flashcardList, flashcard]);
  };

  const handleCardDelete = (index: number) => {
    const list = [...flashcardList];
    list.splice(index, 1);
    setFlashcardList(list);
  };

  const handleCardChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    const list: Flashcard[] = [...flashcardList]; // Replace `YourCardType` with the actual type of the card object in your list
    list[index][name] = value;
    setFlashcardList(list);
  };

  const handleCreateSet = async () => {
    if (!isCreating) {
      setIsCreating(true);
      setHasError(false);
    } else {
      console.log("Already trying to create set.");
      return;
    }

    const userID: string = auth.currentUser?.uid ?? "Error";
    const displayName: string = auth.currentUser?.displayName ?? "Error";

    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Found user.");
    } else {
      console.log("No such user!");

      try {
        await setDoc(doc(db, "users", userID), {});
      } catch (e) {
        setHasError(true);
        console.error("Error adding document: ", e);
        setIsCreating(false);
        return;
      }
    }
    // Creates User in DB if they are not found
    let docId: string = id ?? "new";

    if (id === "new") {
      // check if we are a new set or overriding an existing one...
      try {
        const docRef = await addDoc(collection(db, "users", userID, "decks"), {
          title: title,
          description: description,
          created: serverTimestamp(),
          private: isPrivate,
          owner: userID,
          username: displayName,
          cardsLength: flashcardList.length,
        });
        console.log("Document written with ID: ", docRef.id);
        docId = docRef.id;
      } catch (e) {
        setHasError(true);
        console.error("Error adding document: ", e);
        setIsCreating(false);
        return;
      }

      // Creates Set for User in DB

      try {
        const docRef = await setDoc(
          doc(db, "users", userID, "decks", docId),
          {
            id: docId,
          },
          { merge: true }
        );
      } catch (e) {
        setHasError(true);
        console.error("Error adding document: ", e);
        setIsCreating(false);

        return;
      }
    } else {
      // here is the part for editing a set...
      try {
        const docRef = await setDoc(
          doc(db, "users", userID, "decks", docId),
          {
            title: title,
            description: description,
            private: isPrivate,
            owner: userID,
            username: displayName,
            cardsLength: flashcardList.length,
          },
          { merge: true }
        );
        console.log("Edited!");
      } catch (e) {
        setHasError(true);
        console.error("Error adding document: ", e);
        setIsCreating(false);
        return;
      }
    }

    try {
      // for putting the cards in a subcollection to save data..

      const docRef = await setDoc(
        doc(db, "users", userID, "decks", docId, "cards", docId),
        {
          id: docId,
          cards: flashcardList,
        }
      );
    } catch (e) {
      setHasError(true);
      console.error("Error adding document: ", e);
      setIsCreating(false);
    }

    // gives doc the ID of the set
    navigate(`/study/${docId}`);
    console.log("Created set.");
  };

  const initializeDeck = async () => {
    const q = query(collectionGroup(db, "decks"), where("id", "==", id));

    try {
      const docRef = await getDocs(q);

      if (docRef.docs[0].data().owner !== auth.currentUser?.uid) {
        setHasError(true);
        navigate("/create/new");
        setErrorText("Error: Cannot edit a deck you do not own.");
        throw new Error("You do not own this deck.");
      } else {
        setTitle(docRef.docs[0].data().title);
        setDescription(docRef.docs[0].data().description);
        setIsPrivate(docRef.docs[0].data().private);
        console.log(docRef.docs[0].data());
      }
    } catch (e) {
      console.log("error occurred: " + e);
      return;
    }

    const q1 = query(collectionGroup(db, "cards"), where("id", "==", id));

    try {
      const docRef = await getDocs(q1);
      setFlashcardList(docRef.docs[0].data().cards);
    } catch (e) {
      console.log("error occurred: " + e);
    }
  };

  const handleCardImageChange = (
    imageUrl: string,
    imageSide: string,
    index: number
  ) => {
    const list = [...flashcardList];
    list[index][`${imageSide}Image`] = imageUrl;
    setFlashcardList(list);
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-3 px-4">
          <Alert isHidden={!hasError} text={errorText} />
          <div className="flex justify-between items-center">
            <p className="text-left font-bold text-xl">Create a new set</p>
            <Button
              color="primary"
              className="font-semibold px-5"
              size="md"
              onClick={() => handleCreateSet()}
            >
              Create
            </Button>
          </div>

          <input
            placeholder="Title of your set"
            className="description h-12"
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <div className="flex justify-start">
            <Checkbox
              onChange={() => setIsPrivate((priv) => !priv)}
              isSelected={isPrivate}
            >
              <div className="flex justify-center items-center space-x-2">
                <FaLock />
                <p>Private</p>
              </div>
            </Checkbox>
          </div>
          <TextareaAutosize
            placeholder="Description of your set"
            minRows={4}
            className="description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />

          <div className="space-y-4">
            {flashcardList.map((flashcard: Flashcard, index: number) => (
              <div key={index} className="my-2">
                <CreateCard
                  flashcard={flashcard}
                  index={index}
                  handleCardDelete={handleCardDelete}
                  handleCardChange={handleCardChange}
                  handleCardImageChange={handleCardImageChange}
                />
              </div>
            ))}
          </div>
          <div className="justify-center  flex pt-4 pb-6">
            <Button
              isIconOnly
              color="primary"
              size="lg"
              className="font-semibold "
              onClick={() => handleCardAdd()}
            >
              <FaPlus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;

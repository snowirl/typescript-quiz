import { useEffect, useState } from "react";
import { Flashcard } from "../assets/globalTypes";
import { Button, Checkbox, useDisclosure } from "@nextui-org/react";
import CreateCard from "../components/CreateCard";
import TextareaAutosize from "react-textarea-autosize";
import { uid } from "uid";
import { FaPlus, FaLock } from "react-icons/fa6";
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
import { query, collectionGroup, where, getDocs } from "firebase/firestore";
import { useUserContext } from "../context/userContext";
import { toast } from "sonner";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

interface CreateObj {
  title: string;
  description: string;
  isPrivate: boolean;
  flashcardList: Flashcard[];
  isCopy: boolean;
  isNew: boolean;
  deckId: string;
}

const Create = () => {
  const flashcard: Flashcard = {
    front: "",
    back: "",
    cardId: uid(),
  };
  const navigate = useNavigate();
  const { user } = useUserContext();
  let { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [flashcardList, setFlashcardList] = useState<Flashcard[]>([
    {
      front: "",
      back: "",
      cardId: uid(),
    },
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [scrollTimeoutId, setScrollTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isCopy, setIsCopy] = useState(false);

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (
      id !== "new" &&
      user !== null &&
      !localStorage.getItem("unsaved-create")
    ) {
      initializeDeck();
    } else {
    }

    if (flashcardList.length === 0) {
      handleCardAdd();
    }

    if (user !== null) {
      getLocalStorage();
    }
  }, [user]);

  useEffect(() => {
    return () => {
      // Clear the timeout when the component unmounts
      if (scrollTimeoutId) {
        clearTimeout(scrollTimeoutId);
      }
    };
  }, [scrollTimeoutId]);

  useEffect(() => {
    if (flashcardList.length >= 5) {
      saveToLocalStorage();
    }
  }, [title, description, flashcardList, isPrivate, isCopy]);

  const handleCardAdd = () => {
    if (flashcardList.length >= 150) {
      toast.error("Card limit reached");
      return;
    }
    setFlashcardList([...flashcardList, flashcard]);

    if (flashcardList.length > 0) {
      const timeoutId: NodeJS.Timeout = setTimeout(() => {
        handleScrollToBottom();
      }, 0);

      setScrollTimeoutId(timeoutId);
    }
  };

  const handleCardDelete = (index: number) => {
    const list = [...flashcardList];
    list.splice(index, 1);
    setFlashcardList(list);
  };

  const handleCardChange = (flashcard: Flashcard, index: number) => {
    const list: Flashcard[] = [...flashcardList]; // Replace `YourCardType` with the actual type of the card object in your list
    list[index] = flashcard;
    setFlashcardList(list);
  };

  const handleCreateSet = async () => {
    if (user === null) {
      console.log("No user signed in...");
      toast.error("No user signed in.");
      return;
    }

    if (title.trim() === "") {
      // String is empty or contains only whitespace
      toast.error("Title cannot be empty.");
      return;
    }

    if (flashcardList.length <= 4) {
      toast.error("At least 5 cards are required for a set");
      return;
    }

    if (!isCreating) {
      setIsCreating(true);
    } else {
      console.log("Already trying to create set.");
      return;
    }

    const userID: string | null = auth.currentUser?.uid ?? null; // changed to display name in Algolia era
    const displayName: string | null = auth.currentUser?.displayName ?? null;

    if (!userID || !displayName) {
      return;
    }

    checkIfUserExists();

    let docId: string = id ?? "new";

    if (id === "new" || isCopy) {
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
        toast.success("New study set created");
      } catch (e) {
        console.error("Error adding document: ", e);
        setIsCreating(false);
        return;
      }

      // Creates Set for User in DB

      try {
        await setDoc(
          doc(db, "users", userID, "decks", docId),
          {
            id: docId,
          },
          { merge: true }
        );
      } catch (e) {
        console.error("Error adding document: ", e);
        toast.error("Error creating set");
        setIsCreating(false);

        return;
      }
    } else {
      // here is the part for editing a set...
      try {
        await setDoc(
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
        toast.success("Successfully edited set");
      } catch (e) {
        console.error("Error adding document: ", e);
        toast.error("Error editing set");
        setIsCreating(false);
        return;
      }
    }

    try {
      // for putting the cards in a subcollection to save data..

      await setDoc(doc(db, "users", userID, "decks", docId, "cards", docId), {
        id: docId,
        cards: flashcardList,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
      setIsCreating(false);
    }

    // gives doc the ID of the set
    navigate(`/study/${docId}`);
    localStorage.removeItem("unsaved-create");
    console.log("Created set.");
  };

  const initializeDeck = async () => {
    let newId: string | undefined = id;
    if (id?.includes("=copy")) {
      newId = id.replace(/=copy\s*$/, "");
      setIsCopy(true);
    } else {
      setIsCopy(false);
    }
    const q = query(collectionGroup(db, "decks"), where("id", "==", newId));

    try {
      const docRef = await getDocs(q);

      if (
        (docRef.docs[0].data().owner !== auth.currentUser?.uid &&
          !id?.includes("=copy")) ||
        (docRef.docs[0].data().private &&
          docRef.docs[0].data().owner !== auth.currentUser?.uid)
      ) {
        navigate("/create/new");
        toast.error("Error: Cannot edit a deck you do not own.");
        throw new Error("You do not own this deck.");
      } else {
        setTitle(docRef.docs[0].data().title);
        setDescription(docRef.docs[0].data().description);
        setIsPrivate(docRef.docs[0].data().private);
      }
    } catch (e) {
      console.log("error occurred: " + e);
      return;
    }

    const q1 = query(collectionGroup(db, "cards"), where("id", "==", newId));

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

  const handleScrollToBottom = () => {
    // Scroll to the bottom of the page
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth", // Optional: Adds smooth scrolling animation
    });
  };

  const checkIfUserExists = async () => {
    const userID: string | null = auth.currentUser?.uid ?? null; // changed to display name in Algolia era
    const displayName: string | null = auth.currentUser?.displayName ?? null;

    if (!userID || !displayName) {
      return;
    }

    const docRef = doc(db, "users", userID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Found user.");
    } else {
      console.log("No such user!");

      try {
        await setDoc(doc(db, "users", userID), {});
      } catch (e) {
        console.error("Error adding document: ", e);
        setIsCreating(false);
        return;
      }

      try {
        await setDoc(doc(db, "usernames", displayName), { uid: userID });
      } catch (e) {
        console.error("Error adding document: ", e);
        setIsCreating(false);
        return;
      }
    }
  };

  const saveToLocalStorage = () => {
    const newCreateObj: CreateObj = {
      title: title,
      description: description,
      isPrivate: isPrivate,
      flashcardList: flashcardList,
      isCopy: isCopy,
      isNew: id === "new" ? true : false,
      deckId: id === "new" ? "new" : id !== undefined ? id : "new",
    };
    localStorage.setItem(`unsaved-create`, JSON.stringify(newCreateObj));
  };

  const setLocalStorage = () => {
    navigate(`/create/new`);
    const unsavedData = localStorage.getItem("unsaved-create");

    if (unsavedData) {
      const parsedUnsave = JSON.parse(unsavedData);
      setTitle(parsedUnsave.title);
      setDescription(parsedUnsave.description);
      setIsPrivate(parsedUnsave.isPrivate);
      setFlashcardList(parsedUnsave.flashcardList);

      if (
        !parsedUnsave.isNew &&
        !parsedUnsave.isCopy &&
        parsedUnsave.deckId !== undefined
      ) {
        navigate(`/create/${parsedUnsave.deckId}`);
      }
    }

    onClose();
  };

  const getLocalStorage = () => {
    if (localStorage.getItem("unsaved-create")) {
      onOpen();
    }
  };

  const denyLocalStorage = () => {
    localStorage.removeItem("unsaved-create");

    onClose();

    if (user !== null && id !== "new") {
      initializeDeck();
    }
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <div className="flex justify-between items-center py-1">
            <p className="text-left font-bold text-xl">
              {!id?.includes("=copy") && !id?.includes("new")
                ? "Edit "
                : "Create "}
              Set
            </p>
            <Button
              color="primary"
              className="font-bold  text-sm h-11"
              size="md"
              onClick={() => handleCreateSet()}
            >
              {!id?.includes("=copy") && !id?.includes("new")
                ? "Save Changes ✨"
                : "Create Set ✨"}
            </Button>
          </div>

          <input
            placeholder="Title of your set"
            className="description text-lg py-3"
            color="primary"
            // size="sm"
            // radius="md"
            type="text"
            // variant="bordered"

            onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            defaultValue={title}
            maxLength={75}
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
            onBlur={(e) => setDescription(e.target.value)}
            defaultValue={description}
            maxLength={280}
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
          <div className="justify-center w-full py-2 flex pb-16">
            {flashcardList.length <= 249 ? (
              <Button
                color="primary"
                variant="flat"
                size="lg"
                className=" w-full h-14 text-base"
                onClick={() => handleCardAdd()}
              >
                <FaPlus />
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent className="text-black dark:text-white">
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Unsaved Set Found
              </ModalHeader>
              <ModalBody>
                <p>
                  It looks like you were working on a flashcard set that was not
                  saved. Would you like to retrieve your previous work, or start
                  a new flashcard set?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={denyLocalStorage}
                  className="font-semibold"
                >
                  Create New Set
                </Button>
                <Button
                  color="primary"
                  onPress={setLocalStorage}
                  className="font-semibold"
                >
                  Resume
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Create;

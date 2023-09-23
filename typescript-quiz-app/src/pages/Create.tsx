import { useState } from "react";
import { Flashcard } from "../assets/globalTypes";
import { Input } from "@nextui-org/react";
import CreateCard from "../components/CreateCard";

const Create = () => {
  const flashcard: Flashcard = {
    front: "Front",
    back: "Back",
    cardId: 1,
    isStarred: false,
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [flashcardList, setFlashcardList] = useState([flashcard, flashcard]);
  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-[#0f0f11] min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <Input size="md" type="email" label="Set name" variant="bordered" />
          <div>
            {flashcardList.map((flashcard: Flashcard, index: number) => (
              <div key={index} className="my-2">
                <CreateCard
                  flashcard={flashcard}
                  index={index}
                  //   handleCardDelete={handleCardDelete}
                  //   handleCardChange={handleCardChange}
                  //   handleCardImageChange={handleCardImageChange}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Create;

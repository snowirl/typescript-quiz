import { useState } from "react";
import { Flashcard } from "../assets/globalTypes";
import { Input, Button, Checkbox } from "@nextui-org/react";
import CreateCard from "../components/CreateCard";
import TextareaAutosize from "react-textarea-autosize";
import { uid } from "uid";
import { FaPlus } from "react-icons/fa6";

const Create = () => {
  const flashcard: Flashcard = {
    front: "",
    back: "",
    cardId: uid(),
    isStarred: false,
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [flashcardList, setFlashcardList] = useState([flashcard]);

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

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-[#0f0f11] min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <div className="flex justify-between items-center">
            <p className="text-left font-bold text-xl">Create a new set</p>
            <Button
              color="primary"
              className="font-semibold rounded-md px-5"
              size="lg"
            >
              Create
            </Button>
          </div>

          <Input
            size="lg"
            type="email"
            label="Set name"
            variant="bordered"
            className="bg-white rounded-xl"
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex justify-start">
            <Checkbox className="">Private</Checkbox>
          </div>
          <TextareaAutosize
            placeholder="Description for your set"
            minRows={4}
            className="w-full resize-none rounded-xl p-4 shadow-sm border-gray-200 border-2 focus:border-black duration-250"
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="space-y-4">
            {flashcardList.map((flashcard: Flashcard, index: number) => (
              <div key={index} className="my-2">
                <CreateCard
                  flashcard={flashcard}
                  index={index}
                  handleCardDelete={handleCardDelete}
                  handleCardChange={handleCardChange}
                />
              </div>
            ))}
          </div>
          <Button
            isIconOnly
            color="primary"
            className="font-semibold rounded-full"
            size="lg"
            onClick={() => handleCardAdd()}
          >
            <FaPlus />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Create;

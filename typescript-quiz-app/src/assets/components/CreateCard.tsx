import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Flashcard } from "../globalTypes";
import { FaTrash } from "react-icons/fa6";
import TextareaAutosize from "react-textarea-autosize";
import { Textarea } from "@nextui-org/react";

interface CreateCardProps {
  flashcard: Flashcard;
  index: number;
}

const CreateCard = (props: CreateCardProps) => {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <div className="flex justify-between flex-grow items-center px-2 py-1">
          <p className="text-sm font-semibold">{props.index + 1}</p>
          <button className="icon-btn">
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex space-x-2">
          <div className="flex-1 flex-grow">
            <TextareaAutosize className="w-full resize-none bg-transparent  border-b-2 border-black outline-none focus:border-blue-500 duration-150 overflow-hidden" />
          </div>
          <div className="flex-1 flex-grow">
            <TextareaAutosize className="w-full resize-none bg-transparent  border-b-2 border-black outline-none focus:border-blue-500 duration-150 overflow-hidden" />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CreateCard;

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Tooltip,
} from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import { FaTrash } from "react-icons/fa6";
import TextareaAutosize from "react-textarea-autosize";

interface CreateCardProps {
  flashcard: Flashcard;
  index: number;
  handleCardDelete: (val: number) => void;
  handleCardChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => void;
}

const CreateCard = (props: CreateCardProps) => {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <div className="flex justify-between flex-grow items-center px-2 py-1">
          <p className="text-sm font-semibold">{props.index + 1}</p>
          <Tooltip
            content="Delete"
            showArrow
            delay={1000}
            className="text-black dark:text-white"
          >
            <button
              className="icon-btn hover:text-rose-600"
              onClick={() => props.handleCardDelete(props.index)}
            >
              <FaTrash className="w-4 h-4 " />
            </button>
          </Tooltip>
        </div>
      </CardHeader>
      <CardBody>
        <div className="flex space-x-2">
          <div className="flex-1 flex-grow mr-6">
            <TextareaAutosize
              className="w-full resize-none bg-transparent  border-b-2 border-black outline-none focus:border-blue-500 duration-150 overflow-hidden"
              value={props.flashcard.front}
              onChange={(e) => props.handleCardChange(e, props.index)}
              name="front"
            />
          </div>
          <div className="flex-1 flex-grow ml-6">
            <TextareaAutosize
              className="w-full resize-none bg-transparent  border-b-2 border-black outline-none focus:border-blue-500 duration-150 overflow-hidden"
              value={props.flashcard.back}
              onChange={(e) => props.handleCardChange(e, props.index)}
              name="back"
            />
          </div>
        </div>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default CreateCard;

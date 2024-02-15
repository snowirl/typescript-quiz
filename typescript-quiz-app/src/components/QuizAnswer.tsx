import { Button } from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import { FaCheck, FaXmark } from "react-icons/fa6";

interface QuizAnswerProps {
  flashcard: Flashcard | null;
  wrongFlashcard: Flashcard | null;
  index: number;
  correctIndex: number;
  isFrontFirst: boolean;
  selectedAnswerIndex: number | null;
  selectAnswer: (index: number) => void;
}

const QuizAnswer = (props: QuizAnswerProps) => {
  return (
    <div className="w-full h-full">
      <div className="w-full h-full flex flex-col flex-grow md:flex-row md:space-x-2 md:space-y-0 space-y-2">
        <Button
          className={`h-full w-full py-4  flex-grow whitespace-normal`}
          variant={"flat"}
          onClick={() => props.selectAnswer(props.index)}
          color={`${
            props.selectedAnswerIndex !== null &&
            props.correctIndex === props.index
              ? "success"
              : props.selectedAnswerIndex !== null &&
                props.selectedAnswerIndex === props.index &&
                props.correctIndex !== props.index
              ? "danger"
              : "default"
          }`}
        >
          <div
            className={`absolute left-4 ${
              props.selectedAnswerIndex !== null &&
              props.correctIndex === props.index
                ? ""
                : "hidden"
            }`}
          >
            <FaCheck className="w-6 h-6" />
          </div>
          <div
            className={`absolute left-4 ${
              props.selectedAnswerIndex !== null &&
              props.selectedAnswerIndex === props.index &&
              props.correctIndex !== props.index
                ? ""
                : "hidden"
            }`}
          >
            <FaXmark className="w-6 h-6" />
          </div>
          <p className="whitespace-normal text-base px-8 text-left">
            {!props.isFrontFirst
              ? props.correctIndex === props.index
                ? props.flashcard?.front
                : props.wrongFlashcard?.front
              : null}
            {props.isFrontFirst
              ? props.correctIndex === props.index
                ? props.flashcard?.back
                : props.wrongFlashcard?.back
              : null}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default QuizAnswer;

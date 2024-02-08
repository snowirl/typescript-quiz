import { Button } from "@nextui-org/react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";

interface QuizAnswerItemProps {
  index: number;
  correctIndex: number;
  showCorrect: boolean;
  correctAnswer: string | null;
  selectedIndex: number;
  distractors: string[] | null;
  selectAnswer: (answerIndex: number) => void;
}

const LearnAnswerItem = (props: QuizAnswerItemProps) => {
  return (
    <div className="w-full">
      <div className="w-full h-full flex flex-col flex-grow md:flex-row md:space-x-2 md:space-y-0 space-y-2">
        <Button
          className={`h-full w-full py-4  flex-grow whitespace-normal`}
          color={`${
            props.index === props.correctIndex && props.showCorrect
              ? "success"
              : props.selectedIndex === props.index &&
                props.selectedIndex !== props.correctIndex &&
                props.showCorrect
              ? "danger"
              : "default"
          }`}
          variant={"flat"}
          onClick={() => props.selectAnswer(props.index)}
        >
          <p className="whitespace-normal text-base px-8">
            {props.correctIndex === props.index
              ? props.correctAnswer
              : props.distractors
              ? props.distractors[props.index]
              : null}
          </p>
          <div
            className={`absolute right-4 z-20 ${
              props.index === props.correctIndex && props.showCorrect
                ? ""
                : "hidden"
            }`}
          >
            <FaCircleCheck className="w-6 h-6" />
          </div>
          <div
            className={`absolute right-4 z-20 ${
              props.selectedIndex !== props.correctIndex &&
              props.showCorrect &&
              props.selectedIndex === props.index
                ? ""
                : "hidden"
            }`}
          >
            <FaCircleXmark className="w-6 h-6" />
          </div>
        </Button>
        <Button
          className={`h-full w-full flex-grow py-4 whitespace-normal`}
          color={`${
            props.index + 1 === props.correctIndex && props.showCorrect
              ? "success"
              : props.selectedIndex === props.index + 1 &&
                props.selectedIndex !== props.correctIndex &&
                props.showCorrect
              ? "danger"
              : "default"
          }`}
          variant={"flat"}
          onClick={() => props.selectAnswer(props.index + 1)}
        >
          <p className="whitespace-normal text-base px-8">
            {props.correctIndex === props.index + 1
              ? props.correctAnswer
              : props.distractors
              ? props.distractors[props.index + 1]
              : null}
          </p>
          <div
            className={`absolute right-4 z-20 ${
              props.index + 1 === props.correctIndex && props.showCorrect
                ? ""
                : "hidden"
            }`}
          >
            <FaCircleCheck className="w-6 h-6" />
          </div>
          <div
            className={`absolute right-4 z-20 ${
              props.selectedIndex !== props.correctIndex &&
              props.showCorrect &&
              props.selectedIndex === props.index + 1
                ? ""
                : "hidden"
            }`}
          >
            <FaCircleXmark className="w-6 h-6" />
          </div>
        </Button>
      </div>
    </div>
  );
};

export default LearnAnswerItem;

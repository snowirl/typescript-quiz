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

const QuizAnswerItem = (props: QuizAnswerItemProps) => {
  return (
    <div className="grow-1 grow-col flex w-full font-semibold">
      <Button
        className="py-4 h-full grow-1 grow-col w-full font-semibold"
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
    </div>
  );
};

export default QuizAnswerItem;

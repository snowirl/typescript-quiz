import { Button } from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";

interface QuizAnswerProps {
  flashcard: Flashcard;
}

const QuizAnswer = (props: QuizAnswerProps) => {
  return (
    <div className="w-full">
      <div className="w-full h-full flex flex-col flex-grow md:flex-row md:space-x-2 md:space-y-0 space-y-2">
        <Button
          className={`h-full w-full py-4  flex-grow whitespace-normal`}
          variant={"flat"}
        >
          <p className="whitespace-normal text-base px-8 text-left">
            {props.flashcard.back}
          </p>
        </Button>
      </div>
    </div>
  );
};

export default QuizAnswer;

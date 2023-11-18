import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Flashcard } from "../assets/globalTypes";
import toast from "react-hot-toast";
import QuizAnswerItem from "./QuizAnswerItem";

interface QuizAnswersProps {
  distractors: string[] | null;
  correctAnswer: string | null;
  correctIndex: number;
  setIsCorrect: Dispatch<SetStateAction<boolean>>;
  showCorrect: boolean;
  setShowCorrect: Dispatch<SetStateAction<boolean>>;
  currentCard: Flashcard | null;
}

const QuizAnswers = (props: QuizAnswersProps) => {
  const [canAnswer, setCanAnswer] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (props.currentCard) {
      props.setShowCorrect(false);
      setCanAnswer(true);
    }
  }, [props.currentCard]);

  const selectAnswer = (index: number) => {
    if (!canAnswer) {
      return;
    }
    setCanAnswer(false);
    setSelectedIndex(index);
    props.setShowCorrect(true);
    if (index === props.correctIndex) {
      console.log("Correct.");
      props.setIsCorrect(true);
      toast.dismiss();
      toast.success("Correct!", {
        duration: 4000,
      });
    } else {
      props.setIsCorrect(false);
      console.log("Wrong.");
      toast.dismiss();
      toast.error("Incorrect!", { duration: 4000 });
    }
  };

  return (
    <div className="flex w-full ">
      <div className="w-full space-y-2">
        <div className="w-full flex-col flex space-y-2">
          <div className="relative  w-full h-full space-x-0 md:space-x-2 flex md:flex-row flex-col space-y-2 md:space-y-0 justify-center items-center">
            <QuizAnswerItem
              index={0}
              correctIndex={props.correctIndex}
              showCorrect={props.showCorrect}
              correctAnswer={props.correctAnswer}
              selectedIndex={selectedIndex}
              distractors={props.distractors}
              selectAnswer={selectAnswer}
            />
            <QuizAnswerItem
              index={1}
              correctIndex={props.correctIndex}
              showCorrect={props.showCorrect}
              correctAnswer={props.correctAnswer}
              selectedIndex={selectedIndex}
              distractors={props.distractors}
              selectAnswer={selectAnswer}
            />
          </div>
          <div className="relative  w-full h-full flex md:flex-row flex-col space-y-2 md:space-y-0 md:space-x-2 justify-center items-center">
            <QuizAnswerItem
              index={2}
              correctIndex={props.correctIndex}
              showCorrect={props.showCorrect}
              correctAnswer={props.correctAnswer}
              selectedIndex={selectedIndex}
              distractors={props.distractors}
              selectAnswer={selectAnswer}
            />
            <QuizAnswerItem
              index={3}
              correctIndex={props.correctIndex}
              showCorrect={props.showCorrect}
              correctAnswer={props.correctAnswer}
              selectedIndex={selectedIndex}
              distractors={props.distractors}
              selectAnswer={selectAnswer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnswers;

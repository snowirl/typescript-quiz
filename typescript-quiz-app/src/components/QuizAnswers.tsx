import { Button, ButtonGroup } from "@nextui-org/react";
import { FaCircleCheck, FaCircleXmark } from "react-icons/fa6";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { Flashcard } from "../assets/globalTypes";
import toast from "react-hot-toast";

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
        <div className="flex w-full py-2">
          <div className="space-y-2 px-1 w-full">
            <div className="flex w-full">
              <ButtonGroup className="flex flex-grow space-x-2">
                <Button
                  className="py-4 h-full grow-1 w-full relative font-semibold"
                  color={`${
                    0 === props.correctIndex && props.showCorrect
                      ? "success"
                      : selectedIndex === 0 &&
                        selectedIndex !== props.correctIndex &&
                        props.showCorrect
                      ? "danger"
                      : "default"
                  }`}
                  variant={`${
                    (0 === props.correctIndex || 0 == selectedIndex) &&
                    props.showCorrect
                      ? "bordered"
                      : "ghost"
                  }`}
                  onClick={() => selectAnswer(0)}
                >
                  <p className="whitespace-normal text-base px-8">
                    {props.correctIndex === 0
                      ? props.correctAnswer
                      : props.distractors
                      ? props.distractors[0]
                      : null}
                  </p>
                  <div
                    className={`absolute right-4 z-20 ${
                      0 === props.correctIndex && props.showCorrect
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <FaCircleCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <div
                    className={`absolute right-4 z-20 ${
                      selectedIndex !== props.correctIndex &&
                      props.showCorrect &&
                      selectedIndex === 0
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <FaCircleXmark className="w-6 h-6 text-rose-500" />
                  </div>
                </Button>
                <Button
                  className="py-4 h-full relative grow-1 w-full font-semibold"
                  color={`${
                    1 === props.correctIndex && props.showCorrect
                      ? "success"
                      : selectedIndex === 1 &&
                        selectedIndex !== props.correctIndex &&
                        props.showCorrect
                      ? "danger"
                      : "default"
                  }`}
                  variant={`${
                    (1 === props.correctIndex || 1 == selectedIndex) &&
                    props.showCorrect
                      ? "bordered"
                      : "ghost"
                  }`}
                  onClick={() => selectAnswer(1)}
                >
                  <p className="whitespace-normal text-base px-8">
                    {props.correctIndex === 1
                      ? props.correctAnswer
                      : props.distractors
                      ? props.distractors[1]
                      : null}
                  </p>
                  <div
                    className={`absolute right-4 z-20 ${
                      1 === props.correctIndex && props.showCorrect
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <FaCircleCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <div
                    className={`absolute right-4 z-20 ${
                      selectedIndex !== props.correctIndex &&
                      props.showCorrect &&
                      selectedIndex === 1
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <FaCircleXmark className="w-6 h-6 text-rose-500" />
                  </div>
                </Button>
              </ButtonGroup>
            </div>
            <div className="flex w-full">
              <ButtonGroup className="flex flex-grow space-x-2">
                <Button
                  className="py-4 h-full grow-1 w-full relative font-semibold"
                  color={`${
                    2 === props.correctIndex && props.showCorrect
                      ? "success"
                      : selectedIndex === 2 &&
                        selectedIndex !== props.correctIndex &&
                        props.showCorrect
                      ? "danger"
                      : "default"
                  }`}
                  variant={`${
                    (2 === props.correctIndex || 2 == selectedIndex) &&
                    props.showCorrect
                      ? "bordered"
                      : "ghost"
                  }`}
                  onClick={() => selectAnswer(2)}
                >
                  <p className="whitespace-normal text-base px-8">
                    {props.correctIndex === 2
                      ? props.correctAnswer
                      : props.distractors
                      ? props.distractors[2]
                      : null}
                  </p>
                  <div
                    className={`absolute right-4 z-20 ${
                      2 === props.correctIndex && props.showCorrect
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <FaCircleCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <div
                    className={`absolute right-4 z-20 ${
                      selectedIndex !== props.correctIndex &&
                      props.showCorrect &&
                      selectedIndex === 2
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <FaCircleXmark className="w-6 h-6 text-rose-500" />
                  </div>
                </Button>

                <Button
                  className="py-4 h-full grow-1 w-full relative font-semibold"
                  color={`${
                    3 === props.correctIndex && props.showCorrect
                      ? "success"
                      : selectedIndex === 3 &&
                        selectedIndex !== props.correctIndex &&
                        props.showCorrect
                      ? "danger"
                      : "default"
                  }`}
                  variant={`${
                    (3 === props.correctIndex || 3 == selectedIndex) &&
                    props.showCorrect
                      ? "bordered"
                      : "ghost"
                  }`}
                  onClick={() => selectAnswer(3)}
                >
                  <p className="whitespace-normal text-base px-8">
                    {props.correctIndex === 3
                      ? props.correctAnswer
                      : props.distractors
                      ? props.distractors[3]
                      : null}
                  </p>
                  <div
                    className={`absolute right-4 z-20 ${
                      3 === props.correctIndex && props.showCorrect
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <FaCircleCheck className="w-6 h-6 text-green-500" />
                  </div>
                  <div
                    className={`absolute right-4 z-20 ${
                      selectedIndex !== props.correctIndex &&
                      props.showCorrect &&
                      selectedIndex === 3
                        ? ""
                        : "hidden"
                    }`}
                  >
                    <FaCircleXmark className="w-6 h-6 text-rose-500" />
                  </div>
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizAnswers;

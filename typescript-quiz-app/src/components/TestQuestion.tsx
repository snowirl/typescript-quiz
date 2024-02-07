import { RadioGroup, Radio } from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

interface TestQuestionProps {
  flashcard: Flashcard;
  answerWith: string;
  index: number;
  generateWrongAnswers: (card: Flashcard) => Flashcard[];
  handleAnswer: (
    card: Flashcard,
    isCorrect: boolean,
    index: number,
    selectedAnswerIndex: number
  ) => void;
  finishedTest: boolean;
  selectedAnswer: number;
}

const flashcards: Flashcard[] = [
  {
    front: "",
    back: "",
    cardId: "1",
  },
  {
    front: "",
    back: "",
    cardId: "2",
  },
  {
    front: "",
    back: "",
    cardId: "3",
  },
  {
    front: "",
    back: "",
    cardId: "4",
  },
];

const TestQuestion = (props: TestQuestionProps) => {
  const [mixed, setMixed] = useState("");
  const [wrongAnswers, setWrongAnswers] = useState<Flashcard[]>(flashcards);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (props.answerWith === "mixed") {
      const randomNumber = Math.random();
      const mixedValue = randomNumber < 0.5 ? "term" : "def";
      setMixed(mixedValue);
    } else {
      setMixed("");
    }
  }, [props.answerWith]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * 4);
    setCorrectAnswerIndex(randomIndex);

    setWrongAnswers(props.generateWrongAnswers(props.flashcard));
    setSelectedAnswerIndex(null);
  }, [props.flashcard]);

  const selectAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value) {
      case "0":
        setSelectedAnswerIndex(0);
        break;
      case "1":
        setSelectedAnswerIndex(1);
        break;
      case "2":
        setSelectedAnswerIndex(2);
        break;
      case "3":
        setSelectedAnswerIndex(3);
        break;
    }
  };

  useEffect(() => {
    if (selectedAnswerIndex !== null) {
      const isCorrect =
        selectedAnswerIndex === correctAnswerIndex ? true : false;
      props.handleAnswer(
        props.flashcard,
        isCorrect,
        props.index,
        selectedAnswerIndex
      );
    }
  }, [selectedAnswerIndex]);

  useEffect(() => {
    if (!props.finishedTest) {
      setSelectedAnswerIndex(null);
    }
  }, [props.finishedTest]);

  return (
    <div className="px-8 py-6 text-left space-y-6">
      <div className="flex items-start space-x-2">
        <div className="flex justify-center items-center space-x-2">
          {correctAnswerIndex === selectedAnswerIndex && props.finishedTest ? (
            <FaCheck className="text-green-500" />
          ) : null}
          {correctAnswerIndex !== selectedAnswerIndex && props.finishedTest ? (
            <FaXmark className="text-rose-500" />
          ) : null}
          <span className="text-base">{props.index + 1}.</span>
        </div>

        {props.answerWith === "term" || mixed === "term" ? (
          <>
            <span className="text-base">{props.flashcard.back}</span>
          </>
        ) : null}
        {props.answerWith === "def" || mixed === "def" ? (
          <>
            <span className="text-base">{props.flashcard.front}</span>
          </>
        ) : null}
      </div>

      <RadioGroup
        color={
          props.finishedTest
            ? correctAnswerIndex === props.selectedAnswer
              ? "success"
              : "danger"
            : "primary"
        }
        onChange={selectAnswer}
        isDisabled={props.finishedTest}
        defaultValue={
          props.finishedTest ? props?.selectedAnswer?.toString() : ""
        }
        value={selectedAnswerIndex?.toString() ?? ""}
      >
        <Radio value="0" className="opacity-100">
          <p
            className={
              props.finishedTest && correctAnswerIndex === 0
                ? "text-green-500 font-semibold"
                : props.finishedTest &&
                  correctAnswerIndex !== 0 &&
                  selectedAnswerIndex === 0
                ? "text-rose-500 font-semibold"
                : ""
            }
          >
            {correctAnswerIndex === 0
              ? props.answerWith === "term" || mixed === "term"
                ? props.flashcard.front
                : props.flashcard.back
              : props.answerWith === "term" || mixed === "term"
              ? wrongAnswers[0].front
              : wrongAnswers[0].back}
          </p>
        </Radio>
        <Radio value="1" className="opacity-100">
          <p
            className={
              props.finishedTest && correctAnswerIndex === 1
                ? "text-green-500 font-semibold"
                : props.finishedTest &&
                  correctAnswerIndex !== 1 &&
                  selectedAnswerIndex === 1
                ? "text-rose-500 font-semibold"
                : ""
            }
          >
            {correctAnswerIndex === 1
              ? props.answerWith === "term" || mixed === "term"
                ? props.flashcard.front
                : props.flashcard.back
              : props.answerWith === "term" || mixed === "term"
              ? wrongAnswers[1].front
              : wrongAnswers[1].back}
          </p>
        </Radio>
        <Radio value="2" className="opacity-100">
          <p
            className={
              props.finishedTest && correctAnswerIndex === 2
                ? "text-green-500 font-semibold"
                : props.finishedTest &&
                  correctAnswerIndex !== 2 &&
                  selectedAnswerIndex === 2
                ? "text-rose-500 font-semibold"
                : ""
            }
          >
            {correctAnswerIndex === 2
              ? props.answerWith === "term" || mixed === "term"
                ? props.flashcard.front
                : props.flashcard.back
              : props.answerWith === "term" || mixed === "term"
              ? wrongAnswers[2].front
              : wrongAnswers[2].back}
          </p>
        </Radio>
        <Radio value="3" className="opacity-100">
          <p
            className={
              props.finishedTest && correctAnswerIndex === 3
                ? "text-green-500 font-semibold"
                : props.finishedTest &&
                  correctAnswerIndex !== 3 &&
                  selectedAnswerIndex === 3
                ? "text-rose-500 font-semibold"
                : ""
            }
          >
            {correctAnswerIndex === 3
              ? props.answerWith === "term" || mixed === "term"
                ? props.flashcard.front
                : props.flashcard.back
              : props.answerWith === "term" || mixed === "term"
              ? wrongAnswers[3].front
              : wrongAnswers[3].back}
          </p>
        </Radio>
      </RadioGroup>
    </div>
  );
};

export default TestQuestion;

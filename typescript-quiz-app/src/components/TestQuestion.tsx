import { RadioGroup, Radio } from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import { useState, useEffect } from "react";
import { FaCheck } from "react-icons/fa";
import { FaXmark, FaTriangleExclamation } from "react-icons/fa6";

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
  triedToSubmit: boolean;
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
    <div
      className={
        props.triedToSubmit && selectedAnswerIndex === null
          ? "dark:bg-yellow-500/[.02] bg-yellow-100/20"
          : props.finishedTest && props.selectedAnswer === correctAnswerIndex
          ? "dark:bg-green-500/[.02] bg-green-100/20"
          : props.finishedTest && props.selectedAnswer !== correctAnswerIndex
          ? "dark:bg-red-500/[.02] bg-red-100/20"
          : ""
      }
    >
      <div className="px-8 py-6 text-left space-y-6">
        <div className="flex items-start space-x-2">
          <div className="flex justify-center items-center space-x-2">
            {props.triedToSubmit && selectedAnswerIndex === null ? (
              <FaTriangleExclamation className="text-yellow-500 dark:text-yellow-500" />
            ) : null}
            {correctAnswerIndex === selectedAnswerIndex &&
            props.finishedTest ? (
              <FaCheck className="text-green-500" />
            ) : null}
            {correctAnswerIndex !== selectedAnswerIndex &&
            props.finishedTest ? (
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
        {props.flashcard.backImage &&
        (props.answerWith == "term" || mixed === "term") ? (
          <img
            className="max-w-[200px] md:max-w-[350px] flex-grow lg:max-w-[500px] rounded-md max-h-full"
            // width={imageWidth}
            alt="card image"
            src={props.flashcard.backImage}
          />
        ) : null}

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
            <div className="space-y-2">
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
              {correctAnswerIndex === 0 ? (
                props.answerWith === "term" || mixed === "term" ? null : props
                    .flashcard.backImage ? (
                  <img
                    className="max-w-[200px] md:max-w-[350px] flex-grow lg:max-w-[500px] rounded-md max-h-full"
                    // width={imageWidth}
                    alt="card image"
                    src={props.flashcard.backImage}
                  />
                ) : null
              ) : props.answerWith === "term" ||
                mixed === "term" ? null : wrongAnswers[0].backImage ? (
                <img
                  className="max-w-[200px] md:max-w-[350px] flex-grow lg:max-w-[500px] rounded-md max-h-full"
                  // width={imageWidth}
                  alt="card image"
                  src={wrongAnswers[0].backImage}
                />
              ) : null}
            </div>
          </Radio>
          <Radio value="1" className="opacity-100">
            <div className="space-y-2">
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
              {correctAnswerIndex === 1 ? (
                props.answerWith === "term" || mixed === "term" ? null : props
                    .flashcard.backImage ? (
                  <img
                    className="max-w-[200px] md:max-w-[350px] flex-grow lg:max-w-[500px] rounded-md max-h-full"
                    // width={imageWidth}
                    alt="card image"
                    src={props.flashcard.backImage}
                  />
                ) : null
              ) : props.answerWith === "term" ||
                mixed === "term" ? null : wrongAnswers[1].backImage ? (
                <img
                  className="max-w-[200px] md:max-w-[350px] flex-grow lg:max-w-[500px] rounded-md max-h-full"
                  // width={imageWidth}
                  alt="card image"
                  src={wrongAnswers[1].backImage}
                />
              ) : null}
            </div>
          </Radio>
          <Radio value="2" className="opacity-100">
            <div>
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
              {correctAnswerIndex === 2 ? (
                props.answerWith === "term" || mixed === "term" ? null : props
                    .flashcard.backImage ? (
                  <img
                    className="max-w-[200px] md:max-w-[350px] flex-grow lg:max-w-[500px] rounded-md max-h-full"
                    // width={imageWidth}
                    alt="card image"
                    src={props.flashcard.backImage}
                  />
                ) : null
              ) : props.answerWith === "term" ||
                mixed === "term" ? null : wrongAnswers[2].backImage ? (
                <img
                  className="max-w-[200px] md:max-w-[350px] flex-grow lg:max-w-[500px] rounded-md max-h-full"
                  // width={imageWidth}
                  alt="card image"
                  src={wrongAnswers[2].backImage}
                />
              ) : null}
            </div>
          </Radio>
          <Radio value="3" className="opacity-100">
            <div className="space-y-2">
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
              {correctAnswerIndex === 3 ? (
                props.answerWith === "term" || mixed === "term" ? null : props
                    .flashcard.backImage ? (
                  <img
                    className="max-w-[200px] md:max-w-[350px] flex-grow lg:max-w-[500px] rounded-md max-h-full"
                    // width={imageWidth}
                    alt="card image"
                    src={props.flashcard.backImage}
                  />
                ) : null
              ) : props.answerWith === "term" ||
                mixed === "term" ? null : wrongAnswers[3].backImage ? (
                <img
                  className="max-w-[200px] md:max-w-[350px] flex-grow lg:max-w-[500px] rounded-md max-h-full"
                  // width={imageWidth}
                  alt="card image"
                  src={wrongAnswers[3].backImage}
                />
              ) : null}
            </div>
          </Radio>
        </RadioGroup>
      </div>
    </div>
  );
};

export default TestQuestion;

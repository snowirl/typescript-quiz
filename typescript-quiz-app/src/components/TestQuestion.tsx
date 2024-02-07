import { RadioGroup, Radio } from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import { useState, useEffect } from "react";

interface TestQuestionProps {
  flashcard: Flashcard;
  answerWith: string;
  index: number;
  generateWrongAnswers: (card: Flashcard) => Flashcard[];
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
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(0);

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
  }, [props.flashcard]);

  const selectAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.value) {
      case "a":
        setSelectedAnswerIndex(0);
        break;
      case "b":
        setSelectedAnswerIndex(1);
        break;
      case "c":
        setSelectedAnswerIndex(2);
        break;
      case "d":
        setSelectedAnswerIndex(3);
        break;
    }
  };

  return (
    <div className="px-8 py-6 text-left space-y-6">
      <span className="text-base mr-2">{props.index + 1}.</span>
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

      <RadioGroup
        color={
          selectedAnswerIndex === correctAnswerIndex ? "success" : "danger"
        }
        onChange={selectAnswer}
      >
        <Radio value="a">
          <p>
            {correctAnswerIndex === 0
              ? props.answerWith === "term" || mixed === "term"
                ? props.flashcard.front
                : props.flashcard.back
              : props.answerWith === "term" || mixed === "term"
              ? wrongAnswers[0].front
              : wrongAnswers[0].back}
          </p>
        </Radio>
        <Radio value="b">
          <p>
            {correctAnswerIndex === 1
              ? props.answerWith === "term" || mixed === "term"
                ? props.flashcard.front
                : props.flashcard.back
              : props.answerWith === "term" || mixed === "term"
              ? wrongAnswers[1].front
              : wrongAnswers[1].back}
          </p>
        </Radio>
        <Radio value="c">
          <p>
            {correctAnswerIndex === 2
              ? props.answerWith === "term" || mixed === "term"
                ? props.flashcard.front
                : props.flashcard.back
              : props.answerWith === "term" || mixed === "term"
              ? wrongAnswers[2].front
              : wrongAnswers[2].back}
          </p>
        </Radio>
        <Radio value="d">
          <p>
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
      <p>Correct: {correctAnswerIndex}</p>
    </div>
  );
};

export default TestQuestion;

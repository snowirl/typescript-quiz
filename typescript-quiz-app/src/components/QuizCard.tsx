import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Chip,
  Image,
} from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import QuizAnswer from "./QuizAnswer";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface QuizCardProps {
  flashcard: Flashcard | null;
  originalDeck: Flashcard[] | null;
  selectedAnswerIndex: number | null;
  selectAnswer: (index: number) => void;
  correctIndex: number;
  boxIndex: number;
  isRetrying: boolean;
  answerWith: string;
}

const QuizCard = (props: QuizCardProps) => {
  const [wrongFlashcards, setWrongFlashcards] = useState<Flashcard[] | null>(
    null
  );
  const [isFrontFirst, setIsFrontFirst] = useState<boolean>(false);

  useEffect(() => {
    if (props.flashcard) {
      generateWrongAnswers(props.flashcard);
    }

    if (props.answerWith === "term") {
      setIsFrontFirst(false);
    } else if (props.answerWith === "def") {
      setIsFrontFirst(true);
    }
  }, [props.flashcard]);

  const generateWrongAnswers = (correctAnswer: Flashcard) => {
    if (!props.originalDeck) {
      console.log("no deck found.");
      return;
    }

    const wrongAnswers: Flashcard[] = [];
    const allFlashcardsExceptCorrect = props.originalDeck.filter(
      (card) => card.cardId !== correctAnswer.cardId
    );

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(
        Math.random() * allFlashcardsExceptCorrect.length
      );
      const wrongFlashcard = allFlashcardsExceptCorrect[randomIndex];
      allFlashcardsExceptCorrect.splice(randomIndex, 1);
      wrongAnswers.push(wrongFlashcard);
    }

    setWrongFlashcards(wrongAnswers);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card shadow="sm" className="min-h-[525px]">
        <CardHeader>
          {props.isRetrying ? (
            <Chip color="danger">
              <p className="font-semibold">Let's try that again</p>
            </Chip>
          ) : null}
        </CardHeader>
        <CardBody>
          <div className="px-4 lg:text-lg md:text-base text-sm text-center lg:text-left flex">
            <div
              className={
                props.flashcard?.backImage && !isFrontFirst ? "w-2/3" : "w-full"
              }
            >
              <p>
                {isFrontFirst
                  ? props?.flashcard?.front
                  : props?.flashcard?.back}
              </p>
            </div>
            {props.flashcard?.backImage ? (
              <div className="flex-grow justify-center flex items-center ml-2">
                {!isFrontFirst ? (
                  <Image
                    className="max-w-[200px] md:max-w-[350px] flex-grow lg:max-w-[400px] rounded-md max-h-full"
                    alt="card image"
                    src={props.flashcard?.backImage}
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </CardBody>
        <div className="space-y-2 px-4 pt-4">
          <div className="md:flex md:space-x-2 h-full space-y-2 md:space-y-0">
            <div className="md:w-1/2">
              <QuizAnswer
                flashcard={props.flashcard}
                wrongFlashcard={wrongFlashcards ? wrongFlashcards[0] : null}
                index={0}
                correctIndex={props.correctIndex}
                isFrontFirst={isFrontFirst}
                selectedAnswerIndex={props.selectedAnswerIndex}
                selectAnswer={props.selectAnswer}
              />
            </div>
            <div className="md:w-1/2">
              <QuizAnswer
                flashcard={props.flashcard}
                wrongFlashcard={wrongFlashcards ? wrongFlashcards[1] : null}
                index={1}
                correctIndex={props.correctIndex}
                isFrontFirst={isFrontFirst}
                selectedAnswerIndex={props.selectedAnswerIndex}
                selectAnswer={props.selectAnswer}
              />
            </div>
          </div>
          <div className="md:flex md:space-x-2 h-full space-y-2 md:space-y-0">
            <div className="md:w-1/2 ">
              <QuizAnswer
                flashcard={props.flashcard}
                wrongFlashcard={wrongFlashcards ? wrongFlashcards[2] : null}
                index={2}
                correctIndex={props.correctIndex}
                isFrontFirst={isFrontFirst}
                selectedAnswerIndex={props.selectedAnswerIndex}
                selectAnswer={props.selectAnswer}
              />
            </div>
            <div className="md:w-1/2">
              <QuizAnswer
                flashcard={props.flashcard}
                wrongFlashcard={wrongFlashcards ? wrongFlashcards[3] : null}
                index={3}
                correctIndex={props.correctIndex}
                isFrontFirst={isFrontFirst}
                selectedAnswerIndex={props.selectedAnswerIndex}
                selectAnswer={props.selectAnswer}
              />
            </div>
          </div>
        </div>

        <CardFooter className="py-2">{/* <p>Footer</p> */}</CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuizCard;

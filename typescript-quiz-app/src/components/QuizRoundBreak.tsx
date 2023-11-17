import {
  CircularProgress,
  Card,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flashcard } from "../assets/globalTypes";

interface QuizRoundBreakProps {
  nextRound: () => void;
  cardsCorrect: Flashcard[] | null;
  cardsWrong: Flashcard[] | null;
  cardsStudied: number;
}

const QuizRoundBreak = (props: QuizRoundBreakProps) => {
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (props.cardsStudied && props.cardsCorrect) {
      setProgressValue((props.cardsCorrect.length / props.cardsStudied) * 100);
    } else {
      setProgressValue(0);
    }
  }, [props.cardsStudied]);

  const getIndicatorColorClass = (value: number) => {
    if (value >= 80) {
      return "stroke-green-500";
    } else if (value >= 60) {
      return "stroke-yellow-500";
    } else if (value >= 40) {
      return "stroke-orange-500";
    } else {
      return "stroke-red-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
    >
      <Card>
        <CardBody className="justify-center items-center flex space-y-4">
          <div className="py-1 text-left w-full flex justify-between">
            <p className="text-2xl font-semibold">Great job! Keep going!</p>
            <Button
              color="primary"
              size="lg"
              className="font-semibold"
              onClick={() => props.nextRound()}
            >
              Continue
            </Button>
          </div>
          <div className="justify-center flex space-x-2 w-full">
            <div className="flex-grow flex flex-col items-center justify-center space-y-2">
              <CircularProgress
                aria-label="Loading..."
                classNames={{
                  svg: "w-36 h-36 drop-shadow-md",
                  indicator: getIndicatorColorClass(progressValue),
                  track: "stroke-black/10 dark:stroke-white/10",
                  value: "text-3xl font-semibold",
                }}
                value={progressValue}
                strokeWidth={4}
                showValueLabel={true}
              />
              <p className="font-semibold">
                Cards correct {props.cardsCorrect?.length} /{" "}
                {props.cardsStudied}
              </p>
            </div>
            {/* <div className="space-y-2 flex-grow">
              <div>
                <p>Correct: 30</p>
              </div>
              <div>
                <p>Wrong: 12</p>
              </div>
              <div>
                <p>Mastered: 7</p>
              </div>
            </div> */}
          </div>
        </CardBody>
        <CardFooter className="justify-center items-center pt-0"></CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuizRoundBreak;

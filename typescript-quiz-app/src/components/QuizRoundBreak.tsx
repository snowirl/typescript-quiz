import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  CircularProgress,
} from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import { useEffect, useState } from "react";

interface QuizRoundBreakProps {
  nextRound: () => void;
  correctCards: Flashcard[] | null;
  wrongCards: Flashcard[] | null;
}

const QuizRoundBreak = (props: QuizRoundBreakProps) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (props.correctCards) {
      let wrongCards = 0;
      if (props.wrongCards) {
        wrongCards = props.wrongCards.length;
      }
      const ratio =
        (props.correctCards.length / (props.correctCards.length + wrongCards)) *
        100;
      const score = Math.min(100, Math.max(0, ratio));
      setScore(score);
      getIndicatorColorClass(score);
    } else {
      setScore(0);
      getIndicatorColorClass(score);
    }
  }, [props.correctCards]);

  const getIndicatorColorClass = (value: number) => {
    if (value >= 80) {
      return "stroke-green-500";
    } else if (value >= 60) {
      return "stroke-yellow-500";
    } else if (value >= 40) {
      return "stroke-orange-500";
    } else {
      return "stroke-rose-500";
    }
  };

  return (
    <div className="w-full flex justify-center">
      <Card className="w-full">
        <CardHeader className="p-6">
          <p className="text-xl font-semibold">Results</p>
        </CardHeader>
        <CardBody className="px-6">
          <div className="space-y-4 text-center">
            <p className="text-xl"></p>
            <div className="w-full flex justify-center py-4">
              <CircularProgress
                aria-label="Loading..."
                classNames={{
                  svg: "w-36 h-36 drop-shadow-md",
                  indicator: getIndicatorColorClass(score),
                  track: "stroke-black/10 dark:stroke-white/10",
                  value: "text-3xl font-semibold",
                }}
                value={score}
                strokeWidth={4}
                showValueLabel={true}
              />
              <div className="absolute left-[70%] space-y-1">
                <div className="flex justify-start">
                  <Chip color="success" className="font-semibold" size="md">
                    <p className="font-semibold">
                      {props.correctCards?.length ?? 0} Correct
                    </p>
                  </Chip>
                </div>
                <div className="flex justify-start">
                  <Chip color="danger" className="font-semibold" size="md">
                    <p className="font-semibold">
                      {props.wrongCards?.length ?? 0} Wrong
                    </p>
                  </Chip>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="space-x-2 p-6">
          <div className="flex justify-center w-full space-x-2">
            <Button
              color="primary"
              className="font-semibold"
              size="lg"
              onClick={() => props.nextRound()}
            >
              Next Round
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizRoundBreak;

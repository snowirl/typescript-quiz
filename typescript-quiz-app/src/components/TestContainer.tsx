import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import { useState, useEffect } from "react";

interface TestContainerProps {
  correctCards: Flashcard[];
  wrongCards: Flashcard[];
  handleReview: () => void;
  handleOpenModal: () => void;
  numberOfCards: number;
}

const TestContainer = (props: TestContainerProps) => {
  const [score, setScore] = useState(0);
  const [text, setText] = useState("");
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

  useEffect(() => {
    const totalCards = props.wrongCards.length + props.correctCards.length;

    if (totalCards > 0) {
      const calculatedScore = (props.correctCards.length / totalCards) * 100;
      setScore(calculatedScore);
    } else {
      // Handle the case where there are no cards (to prevent division by zero)
      setScore(0);
    }
  }, [props.wrongCards, props.correctCards]);

  useEffect(() => {
    changeText(score);

    console.log(score);
  }, [score]);

  const getRandomEncouragement = (encouragementOptions: string[]): string => {
    const randomIndex = Math.floor(Math.random() * encouragementOptions.length);
    return encouragementOptions[randomIndex];
  };

  const changeText = (val: number) => {
    let encouragementText: string;

    if (val >= 0 && val <= 20) {
      const options = [
        "Keep pushing yourself, and your hard work will pay off!",
        "Learn from it, focus on your weak spots, and keep working hard. Improvement comes with persistence and dedication.",
        "Keep going, and you'll see your scores climb with consistent effort.",
        "Small steps lead to big achievements. Keep going!",
      ];
      encouragementText = getRandomEncouragement(options);
    } else if (val > 20 && val <= 40) {
      const options = [
        "You're making progress. Keep it up!",
        "Consistency is key. Keep going!",
        "Keep refining, and your scores will keep climbing.",
        "Every step forward is a step in the right direction. Great job!",
      ];
      encouragementText = getRandomEncouragement(options);
    } else if (val > 40 && val <= 60) {
      const options = [
        "You're making progress. Keep it up!",
        "Nice work! You're on the right path. Keep the momentum going!",
        "You're getting there! Stay focused and keep progressing.",
        "Your hard work is paying off. Keep up the good effort!",
      ];
      encouragementText = getRandomEncouragement(options);
    } else if (val > 60 && val <= 80) {
      const options = [
        "Fantastic! Keep up the high standard!",
        "Nice work! You're on the right path. Keep the momentum going!",
        "Outstanding job! You're excelling, so keep pushing for even greater heights!",
        "Impressive work! Keep honing your skills for continued success!",
      ];
      encouragementText = getRandomEncouragement(options);
    } else if (val > 80 && val <= 100) {
      const options = [
        "Wow! You're truly mastering the material. Keep up the exceptional work!",
        "Incredible! Keep aiming for excellence!",
        "Outstanding achievement! Continue your excellent work and strive for even higher goals!",
        "Congratulations! Your dedication and effort is paying off!",
      ];
      encouragementText = getRandomEncouragement(options);
    } else {
      encouragementText = "Invalid score. Please take the test again.";
    }

    setText(encouragementText);
  };

  return (
    <div>
      <Card>
        <CardHeader className="px-4">
          <p className="text-2xl font-semibold">Test Results</p>
        </CardHeader>
        <CardBody className="px-4">
          <div className="space-y-4 text-center">
            <p>{text}</p>
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
              <div className="absolute left-2/3">
                <p className="text-green-500 font-semibold">
                  Correct: {props.correctCards.length}
                </p>
                <p className="text-rose-500 font-semibold">
                  Wrong: {props.numberOfCards - props.correctCards.length}
                </p>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="space-x-2">
          <div className="flex justify-center w-full space-x-2">
            <Button
              color="primary"
              className="font-semibold"
              size="lg"
              onClick={() => props.handleReview()}
            >
              Review Results
            </Button>
            <Button
              color="primary"
              variant="light"
              className="font-semibold "
              size="lg"
              onClick={() => props.handleOpenModal()}
            >
              Create New Test
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestContainer;

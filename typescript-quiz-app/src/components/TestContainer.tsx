import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  CircularProgress,
  Chip,
} from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import { useState, useEffect } from "react";

interface TestContainerProps {
  correctCards: Flashcard[];
  wrongCards: Flashcard[];
  handleReview: () => void;
  handleOpenModal: () => void;
  numberOfCards: number;
  score: number;
}

const TestContainer = (props: TestContainerProps) => {
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
    changeText(props.score);
  }, [props.score]);

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
        "Your hard work will pay off. Keep up the good effort!",
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
          <p className="text-xl font-semibold">Test Results</p>
        </CardHeader>
        <CardBody className="px-4">
          <div className="space-y-4 text-center">
            <p>{text}</p>
            <div className="w-full flex justify-center py-4">
              <CircularProgress
                aria-label="Loading..."
                classNames={{
                  svg: "w-36 h-36 drop-shadow-md",
                  indicator: getIndicatorColorClass(props.score),
                  track: "stroke-black/10 dark:stroke-white/10",
                  value: "text-3xl font-semibold",
                }}
                value={props.score}
                strokeWidth={4}
                showValueLabel={true}
              />
              <div className="absolute left-[70%] space-y-1">
                <div className="flex justify-start">
                  <Chip color="success" className="font-semibold" size="md">
                    <p className="font-semibold">
                      {props.correctCards.length} Correct
                    </p>
                  </Chip>
                </div>
                <div className="flex justify-start">
                  <Chip color="danger" className="font-semibold" size="md">
                    <p className="font-semibold">
                      {props.numberOfCards - props.correctCards.length} Wrong
                    </p>
                  </Chip>
                </div>
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

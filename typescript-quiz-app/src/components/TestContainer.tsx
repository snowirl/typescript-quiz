import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  CircularProgress,
} from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";

interface TestContainerProps {
  correctCards: Flashcard[];
  wrongCards: Flashcard[];
  handleReview: () => void;
  handleOpenModal: () => void;
}

const TestContainer = (props: TestContainerProps) => {
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
    <div>
      <Card>
        <CardHeader className="px-4">
          <p className="text-2xl font-semibold">Test Results</p>
        </CardHeader>
        <CardBody className="px-4">
          <div className="space-y-4 text-center">
            <p>
              Great job! Your efforts are paying off, and you're on the path to
              success. Keep pushing yourself!
            </p>
            <div className="w-full flex justify-center py-4">
              <CircularProgress
                aria-label="Loading..."
                classNames={{
                  svg: "w-36 h-36 drop-shadow-md",
                  indicator: getIndicatorColorClass(
                    (props.correctCards.length /
                      (props.wrongCards.length + props.correctCards.length)) *
                      100
                  ),
                  track: "stroke-black/10 dark:stroke-white/10",
                  value: "text-3xl font-semibold",
                }}
                value={
                  (props.correctCards.length /
                    (props.wrongCards.length + props.correctCards.length)) *
                  100
                }
                strokeWidth={4}
                showValueLabel={true}
              />
              <div className="absolute left-2/3">
                <p className="text-green-500 font-semibold">
                  Correct: {props.correctCards.length}
                </p>
                <p className="text-rose-500 font-semibold">
                  Wrong: {props.wrongCards.length}
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

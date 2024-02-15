import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  CircularProgress,
} from "@nextui-org/react";

interface QuizRoundBreakProps {
  nextRound: () => void;
}

const QuizRoundBreak = (props: QuizRoundBreakProps) => {
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
                  indicator: getIndicatorColorClass(20),
                  track: "stroke-black/10 dark:stroke-white/10",
                  value: "text-3xl font-semibold",
                }}
                value={20}
                strokeWidth={4}
                showValueLabel={true}
              />
              <div className="absolute left-[70%] space-y-1">
                <div className="flex justify-start">
                  <Chip color="success" className="font-semibold" size="md">
                    <p className="font-semibold">0 Correct</p>
                  </Chip>
                </div>
                <div className="flex justify-start">
                  <Chip color="danger" className="font-semibold" size="md">
                    <p className="font-semibold">2 Wrong</p>
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

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import LearnAnswers from "../components/LearnAnswers";
import { Progress } from "@nextui-org/react";

const Learn = () => {
  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] space-y-4 px-4 flex-grow-1 w-full">
          <p className="text-center text-base font-semibold">Round 1</p>
          <Progress
            aria-label="Loading..."
            value={((0 + 1) / 3) * 100}
            className=""
            size="sm"
          />
          <Card>
            <CardBody className="space-y-8 p-12">
              <p className="text-center text-lg font-semibold">
                Which year were the Dallas Cowboys established?
              </p>
              <LearnAnswers />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Learn;

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Button, ButtonGroup } from "@nextui-org/react";

const LearnAnswers = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full space-y-2">
        <div className="flex w-full">
          <ButtonGroup className="flex flex-grow space-x-2">
            <Button
              className="py-6 h-full grow-1 w-full bg-white dark:bg-dark-1"
              color="default"
              variant="bordered"
            >
              <p className="whitespace-normal text-base">1960</p>
            </Button>
            <Button
              className="py-6 h-full grow-1 w-full bg-white dark:bg-dark-1"
              color="default"
              variant="bordered"
            >
              <p className="whitespace-normal text-base">1953</p>
            </Button>
          </ButtonGroup>
        </div>
        <div className="flex w-full">
          <ButtonGroup className="flex flex-grow space-x-2">
            <Button
              className="py-6 h-full grow-1 w-full bg-white dark:bg-dark-1"
              color="default"
              variant="bordered"
            >
              <p className="whitespace-normal text-base">1987</p>
            </Button>
            <Button
              className="py-6 h-full grow-1 w-full bg-white dark:bg-dark-1"
              color="default"
              variant="bordered"
            >
              <p className="whitespace-normal text-base">2001</p>
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default LearnAnswers;

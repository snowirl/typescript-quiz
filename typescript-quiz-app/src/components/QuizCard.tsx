import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import QuizAnswer from "./QuizAnswer";

interface QuizCardProps {
  flashcard: Flashcard;
  isFrontFirst: boolean;
}

const QuizCard = (props: QuizCardProps) => {
  return (
    <Card shadow="sm">
      <CardHeader>
        <p>Term</p>
      </CardHeader>
      <CardBody>
        <p>
          {props.isFrontFirst ? props.flashcard.front : props.flashcard.back}
        </p>
      </CardBody>
      <div className="space-y-2 px-4 pt-4">
        <div className="flex space-x-2">
          <div className="w-1/2">
            <QuizAnswer flashcard={props.flashcard} />
          </div>
          <div className="w-1/2">
            <QuizAnswer flashcard={props.flashcard} />
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="w-1/2">
            <QuizAnswer flashcard={props.flashcard} />
          </div>
          <div className="w-1/2">
            <QuizAnswer flashcard={props.flashcard} />
          </div>
        </div>
      </div>
      <CardFooter>{/* <p>Footer</p> */}</CardFooter>
    </Card>
  );
};

export default QuizCard;

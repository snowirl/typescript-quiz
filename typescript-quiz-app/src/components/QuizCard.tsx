import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

const QuizCard = () => {
  return (
    <Card shadow="sm">
      <CardHeader>
        <p>Term</p>
      </CardHeader>
      <CardBody>
        <p>Make beautiful websites regardless of your design experience.</p>
      </CardBody>
      <CardFooter>
        <p>Footer</p>
      </CardFooter>
    </Card>
  );
};

export default QuizCard;

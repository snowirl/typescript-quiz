import { RadioGroup, Radio, Card } from "@nextui-org/react";

const TestQuestion = () => {
  return (
    <div>
      <Card className="p-4 shadow-sm" shadow="none">
        <p className="text-lg">Question 1:</p>
        <RadioGroup>
          <Radio value="buenos-aires">Buenos Aires</Radio>
          <Radio value="sydney">Sydney</Radio>
          <Radio value="san-francisco">San Francisco</Radio>
          <Radio value="london">London</Radio>
        </RadioGroup>
      </Card>
    </div>
  );
};

export default TestQuestion;

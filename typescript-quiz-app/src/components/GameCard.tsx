import { Card } from "@nextui-org/react";

const GameCard = () => {
  return (
    <div className="m-1 cursor-pointer">
      <Card shadow="sm" radius="md">
        <div className="flex flex-col h-[180px] items-center overflow-y-autorounded-md">
          <p className="text-[20px] text-center my-auto">hi</p>
        </div>
      </Card>
    </div>
  );
};

export default GameCard;

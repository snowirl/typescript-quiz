import { Button } from "@nextui-org/react";

const GameCard = () => {
  return (
    <div className="m-1">
      <Button
        color="default"
        variant="faded"
        className="bg-white dark:bg-dark-1 w-full h-36 text-clip"
      >
        Game
      </Button>
    </div>
  );
};

export default GameCard;

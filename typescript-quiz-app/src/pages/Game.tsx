import GameCard from "../components/GameCard";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";

const Game = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // const [interval, setIntervalId] = useState<NodeJS.Timeout | undefined>(
  //   undefined
  // );

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    } else if (!isRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <div className="flex justify-center bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="w-full max-w-[1000px] mx-6 text-left space-y-4">
        <div className="space-x-2 flex justify-center">
          <p>{time.toFixed(1)}</p>
          <Button onClick={startStop}>Start</Button>
          <Button onClick={reset}>Reset</Button>
        </div>
        <div className=" justify-center grid grid-cols-3 md:grid-cols-4 items-center">
          <GameCard /> <GameCard /> <GameCard /> <GameCard />
          <GameCard /> <GameCard /> <GameCard /> <GameCard />
          <GameCard /> <GameCard /> <GameCard /> <GameCard />
        </div>
      </div>
    </div>
  );
};

export default Game;

import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

interface GameContainerProps {
  setIsGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  hasPlayed: boolean;
  time: number;
  newHighScore: boolean;
}

const GameContainer = (props: GameContainerProps) => {
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    if (props.newHighScore) {
      setIsExploding(true);
    } else {
      setIsExploding(false);
    }
  }, [props.newHighScore]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className=" h-[450px] flex justify-center items-center"
    >
      {!props.hasPlayed ? (
        <div className="space-y-4 text-center">
          <p className="text-xl">
            Match cards with the corresponding terms and definitions as fast as
            you can for the best time!
          </p>
          <Button
            color="primary"
            className="font-semibold"
            size="lg"
            onClick={() => props.setIsGameStarted(true)}
          >
            Start Game
          </Button>
        </div>
      ) : (
        <div className="space-y-4 text-center">
          {props.newHighScore ? (
            <p className="text-xl font-semibold py-2">New High Score!</p>
          ) : null}
          <p className="text-lg py-2 font-semibold">
            {props.time.toFixed(1)} seconds
          </p>

          <Button
            color="primary"
            className="font-semibold"
            size="lg"
            onClick={() => props.setIsGameStarted(true)}
          >
            Play Again
          </Button>
          <div className="absolute left-1/2 top-1/3">
            {isExploding ? (
              <ConfettiExplosion
                force={0.4}
                duration={2200}
                width={1000}
                particleCount={30}
              />
            ) : null}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GameContainer;

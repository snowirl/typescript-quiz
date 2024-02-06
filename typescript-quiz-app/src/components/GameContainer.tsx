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

      // Set a timeout to stop the explosion after a certain duration
      const timeoutId = setTimeout(() => {
        setIsExploding(false);
      }, 3000); // Adjust the duration as needed

      // Cleanup function to clear the timeout when the component unmounts
      return () => clearTimeout(timeoutId);
    } else {
      setIsExploding(false);
    }
  }, [props.newHighScore]);

  const playAgain = () => {
    setIsExploding(false);
    props.setIsGameStarted(true);
  };

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
            onClick={() => playAgain()}
          >
            Play Again
          </Button>

          <div className={isExploding ? "absolute left-1/2 top-1/3" : "hidden"}>
            {isExploding && (
              <ConfettiExplosion duration={2200} particleCount={24} />
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default GameContainer;

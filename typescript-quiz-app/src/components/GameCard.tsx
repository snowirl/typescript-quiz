import { Card } from "@nextui-org/react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface GameFlashCard {
  cardId: string;
  content: string;
}

interface GameCardProps {
  card: GameFlashCard;
  handleSelectCard: (card: GameFlashCard) => void;
  selectedCard: GameFlashCard | null;
  selectedCard2: GameFlashCard | null;
  completedCardIds: string[];
  gameState: string;
}

const GameCard = (props: GameCardProps) => {
  const controls = useAnimation();

  useEffect(() => {
    if (props.completedCardIds.includes(props.card.cardId)) {
      controls.start({ opacity: 0 /* other animation properties */ });
    } else {
      controls.start({ opacity: 1 /* other animation properties */ });
    }
  }, [props.completedCardIds]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={controls}
      exit={{ opacity: 0 }}
      className={
        props.completedCardIds.includes(props.card.cardId)
          ? " m-1"
          : "m-1 cursor-pointer"
      }
      onClick={() => props.handleSelectCard(props.card)}
    >
      <Card
        shadow="sm"
        radius="md"
        className={
          props.selectedCard === props.card ||
          props.selectedCard2 === props.card
            ? props.gameState === "correct"
              ? "ring ring-green-400"
              : props.gameState === "wrong"
              ? "ring ring-rose-400"
              : props.gameState === ""
              ? "ring ring-primary"
              : ""
            : "ring-0"
        }
      >
        <div className="flex flex-col h-[180px] items-center overflow-y-autorounded-md">
          <p className="text-sm md:text-[20px] text-center my-auto">
            {props.card.content}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default GameCard;

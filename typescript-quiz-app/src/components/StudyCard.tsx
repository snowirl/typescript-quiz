import StudyCardSide from "./StudyCardSide";
import ReactCardFlip from "react-card-flip";
import { Flashcard } from "../assets/globalTypes";
import { motion } from "framer-motion";

interface StudyCardProps {
  flashcard: Flashcard;
  shuffleDeck: (bool: boolean) => void;
  isShuffled: boolean;
  changeStarredSelected: (val: string) => void;
  isStarredOnly: boolean;
  isFlipped: boolean;
  isFrontFirst: boolean;
  flipCard: () => void;
  changeInitialCardSide: (val: string) => void;
  flipSpeed: number;
  handleStarCard: (flashcard: Flashcard) => void;
  isStarred: boolean;
}

const StudyCard = (props: StudyCardProps) => {
  return (
    <ReactCardFlip
      isFlipped={props.isFlipped}
      flipDirection="vertical"
      flipSpeedBackToFront={props.flipSpeed}
      flipSpeedFrontToBack={props.flipSpeed}
    >
      <StudyCardSide
        isFlipped={props.isFlipped}
        flashcard={props.flashcard}
        isShuffled={props.isShuffled}
        shuffleDeck={props.shuffleDeck}
        changeStarredSelected={props.changeStarredSelected}
        isStarredOnly={props.isStarredOnly} // is filtered by starred only
        isFrontFirst={props.isFrontFirst}
        flipCard={props.flipCard}
        changeInitialCardSide={props.changeInitialCardSide}
        isFront={true}
        handleStarCard={props.handleStarCard}
        isStarred={props.isStarred}
      />
      <StudyCardSide
        isFlipped={props.isFlipped}
        flashcard={props.flashcard}
        isShuffled={props.isShuffled}
        shuffleDeck={props.shuffleDeck}
        changeStarredSelected={props.changeStarredSelected}
        isStarredOnly={props.isStarredOnly}
        isFrontFirst={props.isFrontFirst}
        flipCard={props.flipCard}
        changeInitialCardSide={props.changeInitialCardSide}
        isFront={false}
        handleStarCard={props.handleStarCard}
        isStarred={props.isStarred}
      />
    </ReactCardFlip>
  );
};

export default StudyCard;

import { useState } from "react";
import StudyCardSide from "./StudyCardSide";
import ReactCardFlip from "react-card-flip";
import { Flashcard } from "../globalTypes";

interface StudyCardProps {
  flashcard: Flashcard;
  shuffleDeck: (bool: boolean) => void;
  isShuffled: boolean;
  changeStarredSelected: (val: string) => void;
}

const StudyCard = (props: StudyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <ReactCardFlip
      isFlipped={isFlipped}
      flipDirection="vertical"
      flipSpeedBackToFront={0.4}
      flipSpeedFrontToBack={0.4}
    >
      <StudyCardSide
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        text={props.flashcard.front}
        isShuffled={props.isShuffled}
        shuffleDeck={props.shuffleDeck}
        changeStarredSelected={props.changeStarredSelected}
        isStarred={props.flashcard.isStarred}
      />
      <StudyCardSide
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        text={props.flashcard.back}
        isShuffled={props.isShuffled}
        shuffleDeck={props.shuffleDeck}
        changeStarredSelected={props.changeStarredSelected}
        isStarred={props.flashcard.isStarred}
      />
    </ReactCardFlip>
  );
};

export default StudyCard;

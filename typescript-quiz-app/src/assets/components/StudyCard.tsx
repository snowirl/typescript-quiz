import { useState } from "react";
import StudyCardSide from "./StudyCardSide";
import ReactCardFlip from "react-card-flip";
import { Flashcard } from "../globalTypes";

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
}

const StudyCard = (props: StudyCardProps) => {
  return (
    <ReactCardFlip
      isFlipped={props.isFlipped}
      flipDirection="vertical"
      flipSpeedBackToFront={0.35}
      flipSpeedFrontToBack={0.35}
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
      />
    </ReactCardFlip>
  );
};

export default StudyCard;

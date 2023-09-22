import { useState } from "react";
import StudyCardSide from "./StudyCardSide";
import ReactCardFlip from "react-card-flip";
import { Flashcard } from "../globalTypes";

interface StudyCardProps {
  flashcard: Flashcard;
}

const StudyCard = (props: StudyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
      <StudyCardSide
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        text={props.flashcard.front}
      />
      <StudyCardSide
        isFlipped={isFlipped}
        setIsFlipped={setIsFlipped}
        text={props.flashcard.back}
      />
    </ReactCardFlip>
  );
};

export default StudyCard;

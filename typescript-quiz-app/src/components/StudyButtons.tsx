import { Button, ButtonGroup } from "@nextui-org/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

interface StudyButtonsProps {
  deckId: string;
  index: number;
  setIndex: (index: number) => void;
  length: number;
  incrementIndex: () => void;
  decrementIndex: () => void;
}

const StudyButtons = (props: StudyButtonsProps) => {
  return (
    <div>
      <div className="flex flex-grow">
        <ButtonGroup className="flex-grow">
          <Button
            className="flex-grow h-20"
            variant="light"
            onClick={() => props.decrementIndex()}
          >
            <BsArrowLeft className="w-10 h-10 " />
          </Button>
          <Button
            className="flex-grow h-20"
            variant="light"
            onClick={() => props.incrementIndex()}
          >
            <BsArrowRight className="w-10 h-10 " />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default StudyButtons;

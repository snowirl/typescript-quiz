import { Button, ButtonGroup } from "@nextui-org/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

interface StudyButtonsProps {
  deckId: string;
  index: number;
  setIndex: (index: number) => void;
  length: number;
  incrementIndex: () => void;
  decrementIndex: () => void;
}

const StudyButtons = (props: StudyButtonsProps) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex flex-grow">
        <ButtonGroup className="flex-grow">
          <Button
            className="flex-grow h-16"
            variant="light"
            color="default"
            onClick={() => props.decrementIndex()}
          >
            <BsArrowLeft className="w-10 h-10 " />
          </Button>
          <Button
            className="flex-grow h-16"
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

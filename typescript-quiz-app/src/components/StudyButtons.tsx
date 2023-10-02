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
        <ButtonGroup className="flex-grow space-x-2">
          <Button
            className="flex-grow h-24 bg-white dark:bg-[#18181B] shadow-sm"
            variant="light"
            color="default"
            onClick={() => props.decrementIndex()}
          >
            <BsArrowLeft className="w-10 h-10 " />
          </Button>
          <Button
            className="flex-grow h-24 bg-white dark:bg-[#18181B] shadow-sm"
            variant="light"
            onClick={() => props.incrementIndex()}
          >
            <BsArrowRight className="w-10 h-10 " />
          </Button>
        </ButtonGroup>
      </div>
      <div className="mt-3">
        <ButtonGroup className="flex-grow w-full">
          <Button
            className="flex-grow h-14 bg-white dark:bg-[#18181B] shadow-sm"
            variant="light"
            color="default"
            onClick={() => navigate(`/learn/${props.deckId}`)}
          >
            <p className="text-base font-semibold">Learn</p>
          </Button>
          <Button
            className="flex-grow h-14 bg-white dark:bg-[#18181B] shadow-sm"
            variant="light"
            onClick={() => navigate(`/test/${props.deckId}`)}
          >
            <p className="text-base font-semibold">Test</p>
          </Button>
          <Button
            className="flex-grow h-14 bg-white dark:bg-[#18181B] shadow-sm"
            variant="light"
            onClick={() => navigate(`/game/${props.deckId}`)}
          >
            <p className="text-base font-semibold">Game</p>
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default StudyButtons;

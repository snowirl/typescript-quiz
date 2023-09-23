import { Button, ButtonGroup } from "@nextui-org/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

interface StudyButtonsProps {
  index: number;
  setIndex: (index: number) => void;
  length: number;
}

const StudyButtons = (props: StudyButtonsProps) => {
  const incrementIndex = () => {
    if (props.index < props.length - 1) {
      props.setIndex(props.index + 1);
    }
  };

  const decrementIndex = () => {
    if (props.index > 0) {
      props.setIndex(props.index - 1);
    }
  };

  return (
    <div className="flex flex-grow">
      <ButtonGroup className="flex-grow space-x-2">
        <Button
          className="flex-grow h-24 bg-white dark:bg-[#18181B] shadow-sm"
          variant="light"
          color="default"
          onClick={() => decrementIndex()}
        >
          <BsArrowLeft className="w-10 h-10 " />
        </Button>
        <Button
          className="flex-grow h-24 bg-white dark:bg-[#18181B] shadow-sm"
          variant="light"
          onClick={() => incrementIndex()}
        >
          <BsArrowRight className="w-10 h-10 " />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default StudyButtons;

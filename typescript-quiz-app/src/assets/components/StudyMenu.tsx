import { Button, ButtonGroup } from "@nextui-org/react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

interface StudyMenuProps {
  index: number;
  setIndex: (index: number) => void;
  length: number;
}

const StudyMenu = (props: StudyMenuProps) => {
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
    <div className="flex flex-grow pb-10">
      <ButtonGroup className="flex-grow">
        <Button
          className="flex-grow h-24"
          variant="ghost"
          onClick={() => decrementIndex()}
        >
          <BsArrowLeft className="w-10 h-10" />
        </Button>
        <Button
          className="flex-grow h-24"
          variant="ghost"
          onClick={() => incrementIndex()}
        >
          <BsArrowRight className="w-10 h-10" />
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default StudyMenu;

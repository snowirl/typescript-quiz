import { ButtonGroup, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { FaRegLightbulb } from "react-icons/fa6";
import { FaRegClipboard } from "react-icons/fa";
import { GrGamepad } from "react-icons/gr";

interface StudyNavProps {
  deckId: string;
}

const StudyNav = (props: StudyNavProps) => {
  const navigate = useNavigate();
  return (
    <ButtonGroup className="flex-grow w-full h-12">
      <Button
        className="flex-grow h-full"
        variant="light"
        color="default"
        onClick={() => navigate(`/learn/${props.deckId}`)}
      >
        <div className="text-base font-semibold flex items-center space-x-2">
          <FaRegLightbulb className="w-4 h-4" />
          <p>Learn</p>
        </div>
      </Button>
      <Button
        className="flex-grow h-full"
        variant="light"
        onClick={() => navigate(`/test/${props.deckId}`)}
      >
        <div className="text-base font-semibold flex items-center space-x-2">
          <FaRegClipboard className="w-4 h-4" />
          <p>Test</p>
        </div>
      </Button>
      <Button
        className="flex-grow h-full"
        variant="light"
        onClick={() => navigate(`/game/${props.deckId}`)}
      >
        <div className="text-base font-semibold flex items-center space-x-2">
          <GrGamepad className="w-4 h-4" />
          <p>Game</p>
        </div>
      </Button>
    </ButtonGroup>
  );
};

export default StudyNav;

import { ButtonGroup, Button } from "@nextui-org/react";
import { FaRegLightbulb } from "react-icons/fa6";
import { FaRegClipboard } from "react-icons/fa";
import { MdOutlineVideogameAsset } from "react-icons/md";
import { Link } from "react-router-dom";

interface StudyNavProps {
  deckId: string;
}

const StudyNav = (props: StudyNavProps) => {
  return (
    <ButtonGroup className="flex-grow w-full h-10">
      <Button
        className="flex-grow h-full"
        variant="light"
        color="default"
        as={Link}
        to={`/learn/${props.deckId}`}
        size="sm"
      >
        <div className="text-base font-semibold flex items-center space-x-2">
          <FaRegLightbulb className="w-4 h-4" />
          <p>Learn</p>
        </div>
      </Button>
      <Button
        className="flex-grow h-full"
        variant="light"
        as={Link}
        to={`/test/${props.deckId}`}
        size="sm"
      >
        <div className="text-base font-semibold flex items-center space-x-2">
          <FaRegClipboard className="w-4 h-4" />
          <p>Test</p>
        </div>
      </Button>
      <Button
        className="flex-grow h-full"
        variant="light"
        as={Link}
        to={`/game/${props.deckId}`}
        size="sm"
      >
        <div className="text-base font-semibold flex items-center space-x-2">
          <MdOutlineVideogameAsset className="w-6 h-6" />
          <p>Game</p>
        </div>
      </Button>
    </ButtonGroup>
  );
};

export default StudyNav;

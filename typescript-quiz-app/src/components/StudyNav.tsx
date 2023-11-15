import { ButtonGroup, Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

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
        <p className="text-base font-semibold">Learn</p>
      </Button>
      <Button
        className="flex-grow h-full"
        variant="light"
        onClick={() => navigate(`/test/${props.deckId}`)}
      >
        <p className="text-base font-semibold">Test</p>
      </Button>
      <Button
        className="flex-grow h-full"
        variant="light"
        onClick={() => navigate(`/game/${props.deckId}`)}
      >
        <p className="text-base font-semibold">Game</p>
      </Button>
    </ButtonGroup>
  );
};

export default StudyNav;

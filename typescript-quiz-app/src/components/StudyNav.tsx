import { ButtonGroup, Button } from "@nextui-org/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const StudyNav = () => {
  const navigate = useNavigate();
  return (
    <ButtonGroup className="flex-grow w-full">
      <Button
        className="flex-grow h-14"
        variant="ghost"
        color="default"
        onClick={() => navigate(`/learn/${props.deckId}`)}
      >
        <p className="text-base font-semibold">Learn</p>
      </Button>
      <Button
        className="flex-grow h-14"
        variant="ghost"
        onClick={() => navigate(`/test/${props.deckId}`)}
      >
        <p className="text-base font-semibold">Test</p>
      </Button>
      <Button
        className="flex-grow h-14"
        variant="ghost"
        onClick={() => navigate(`/game/${props.deckId}`)}
      >
        <p className="text-base font-semibold">Game</p>
      </Button>
    </ButtonGroup>
  );
};

export default StudyNav;

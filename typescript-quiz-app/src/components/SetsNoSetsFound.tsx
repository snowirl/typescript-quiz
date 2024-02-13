import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const SetsNoSetsFound = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-2">
      <p className="font-semibold text-black/50 dark:text-white/70">
        No sets found
      </p>
      <Button
        className="font-semibold"
        color="primary"
        onPress={() => navigate("/create/new")}
      >
        Create New Set
      </Button>
    </div>
  );
};

export default SetsNoSetsFound;

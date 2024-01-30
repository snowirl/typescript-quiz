import GameCard from "../components/GameCard";

const Game = () => {
  return (
    <div className="flex justify-center bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="w-full max-w-[1000px] mx-6 text-left space-y-4">
        <div className=" justify-center grid grid-cols-3 md:grid-cols-4 items-center">
          <GameCard /> <GameCard /> <GameCard /> <GameCard />
          <GameCard /> <GameCard /> <GameCard /> <GameCard />
          <GameCard /> <GameCard /> <GameCard /> <GameCard />
        </div>
      </div>
    </div>
  );
};

export default Game;

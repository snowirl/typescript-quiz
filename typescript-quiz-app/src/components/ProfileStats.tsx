const ProfileStats = () => {
  return (
    <div className="py-6 flex w-full justify-around text-center">
      <div className="flex flex-col justify-center items-center space-y-2 flex-grow w-full">
        <p className="text-lg font-bold">Sets Created</p>
        <p className="text-base font-semibold">22</p>
      </div>
      <div className="flex flex-col justify-center items-center space-y-2 flex-grow w-full">
        <p className="text-lg font-bold">Cards Studied </p>
        <p className="text-base font-semibold">134</p>
      </div>
      <div className="flex flex-col justify-center items-center space-y-2 flex-grow w-full">
        <p className="text-lg font-bold">Highest Day Streak </p>
        <p className="text-base font-semibold">4 🔥</p>
      </div>
    </div>
  );
};

export default ProfileStats;

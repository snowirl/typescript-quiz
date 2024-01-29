import { Card, Avatar } from "@nextui-org/react";
import { auth } from "../firebase";
import SetCard from "../components/SetCard";
import { Pagination } from "@nextui-org/react";

const Profile = () => {
  return (
    <div className="flex justify-center bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="w-full max-w-[800px] mx-6 text-left space-y-4">
        <Card className="w-full bg-black/0 shadow-none p-0 m-0">
          <div className="justify-start text-left space-y-4 items-center pb-10">
            <div className="space-y-2 flex items-center space-x-2">
              <Avatar src={auth.currentUser?.photoURL ?? ""} size="lg" />
              <p className="text-xl font-semibold">
                {auth.currentUser?.displayName}
              </p>
            </div>
            <div>
              <p className="text-base">Here is my bio...</p>
            </div>
          </div>
        </Card>
        <p className="font-semibold text-base">Public Sets</p>
        <SetCard deckId={"6bjppJx6r5DnGfuENYBp"} />
        <SetCard deckId={"6bjppJx6r5DnGfuENYBp"} />
        <SetCard deckId={"6bjppJx6r5DnGfuENYBp"} />
        <SetCard deckId={"6bjppJx6r5DnGfuENYBp"} />
        <div className=" w-full flex justify-center pt-4 py-8">
          <Pagination initialPage={1} total={3} variant="faded" />
        </div>
      </div>
    </div>
  );
};

export default Profile;

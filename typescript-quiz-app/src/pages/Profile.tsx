import { Card, Avatar } from "@nextui-org/react";
import { auth } from "../firebase";

const Profile = () => {
  return (
    <div className="flex justify-center bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="w-full max-w-[800px] mx-6">
        <Card className="w-full">
          <div className="justify-start p-6 text-left space-y-4">
            <div className="space-y-2 flex items-center space-x-2">
              <Avatar src={auth.currentUser?.photoURL ?? ""} size="lg" />
              <p className="text-xl font-semibold">
                {auth.currentUser?.displayName}
              </p>
            </div>
            <div>{/* <p className="text-base">Here is my bio...</p> */}</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;

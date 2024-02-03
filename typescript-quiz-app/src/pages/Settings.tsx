import { Card, CardBody, Avatar, Button, Checkbox } from "@nextui-org/react";
import { FaEdit, FaLock } from "react-icons/fa";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { useRef, ChangeEvent, useState } from "react";
import { Switch } from "@nextui-org/react";
import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "next-themes";

const Settings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState("account");
  const { theme, setTheme } = useTheme();

  const handleButtonClick = () => {
    // Trigger the file input when the button is clicked
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleImageUpload(event);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (auth === null) {
      console.log("Error: auth is null.");
      return;
    }
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected.");
      return;
    }

    const storage = getStorage();

    const userId = auth.currentUser?.displayName;

    const storageRef = ref(storage, `profilePictures/${userId}`);

    let newDownloadURL = "";

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");

        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          newDownloadURL = downloadURL;
          handleProfilePicChange(newDownloadURL);
        });
      })
      .catch((error) => {
        return console.error("Error uploading the file:", error);
        // Handle the error, e.g., show an error message to the user
      });
  };

  const handleProfilePicChange = async (pictureUrl: string) => {
    const currentUser = auth.currentUser;

    if (currentUser !== null) {
      updateProfile(currentUser, {
        photoURL: pictureUrl,
      })
        .then(() => {
          // Profile updated!
          // ...
          // setProfilePic(pictureUrl);
        })
        .catch((error) => {
          // An error occurred
          // ...
          console.log(error);
        });
    }
  };

  const changeTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <Card>
            <CardBody>
              <div className="flex justify-center">
                <div className="">
                  <div className="h-full text-lg space-y-2 border border-r-2 border-y-0 border-l-0 py-2 w-[140px] pr-2 border-black/10 dark:border-white/10">
                    <Button
                      variant="light"
                      color={tab === "account" ? "primary" : "default"}
                      className="w-full font-semibold justify-start"
                      onClick={() => setTab("account")}
                    >
                      Account
                    </Button>
                    <Button
                      variant="light"
                      color={tab === "preferences" ? "primary" : "default"}
                      className="w-full font-semibold justify-start"
                      onClick={() => setTab("preferences")}
                    >
                      Preferences
                    </Button>
                    <Button
                      variant="light"
                      color={tab === "privacy" ? "primary" : "default"}
                      className="w-full font-semibold justify-start"
                      onClick={() => setTab("privacy")}
                    >
                      Privacy
                    </Button>
                    <Button
                      variant="light"
                      color={tab === "password" ? "primary" : "default"}
                      className="w-full font-semibold justify-start"
                      onClick={() => setTab("password")}
                    >
                      Password
                    </Button>
                  </div>
                </div>
                {tab === "account" ? (
                  <div className="flex flex-col justify-start items-start space-y-4 w-full mx-4 my-4">
                    <p className="text-sm">
                      Username: {auth.currentUser?.displayName}
                    </p>
                    <div className="flex space-x-2 items-center">
                      <p className="text-sm">
                        Email: {auth.currentUser?.email}
                      </p>
                      <Button variant="flat" size="sm">
                        <FaEdit /> Change Email
                      </Button>
                    </div>

                    <div className="items-center flex space-x-2">
                      <Avatar
                        src={auth.currentUser?.photoURL ?? ""}
                        size="lg"
                      />
                      <Button
                        variant="flat"
                        size="sm"
                        onClick={handleButtonClick}
                      >
                        <FaEdit /> Change Profile Picture
                      </Button>
                    </div>

                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    {/* <ProfileStats /> */}
                    <div className="space-y-2">
                      <Checkbox defaultSelected>
                        <p className="text-sm flex items-center">
                          <FaLock className="mx-1" />
                          Private Account
                        </p>
                        <p className="text-xs text-black/50 dark:text-white/50">
                          Toggling on will hide your account and sets from
                          search
                        </p>
                      </Checkbox>
                    </div>
                    <div className="py-2">
                      <Switch
                        defaultSelected
                        size="sm"
                        color="primary"
                        thumbIcon={({ isSelected, className }) =>
                          isSelected ? (
                            <LuMoon className={className} />
                          ) : (
                            <LuSun className={className} />
                          )
                        }
                        isSelected={theme === "dark" ? true : false}
                        onChange={() => changeTheme()}
                      >
                        Dark mode
                      </Switch>
                    </div>
                  </div>
                ) : null}
                {tab === "preferences" ? (
                  <div className="flex flex-col justify-start items-start space-y-3 w-full mx-4 my-4">
                    <p>Preferences</p>
                  </div>
                ) : null}
                {tab === "privacy" ? (
                  <div className="flex flex-col justify-start items-start space-y-3 w-full mx-4 my-4">
                    <p>Privacy</p>
                  </div>
                ) : null}
                {tab === "password" ? (
                  <div className="flex flex-col justify-start items-start space-y-3 w-full mx-4 my-4">
                    <p>Password</p>
                  </div>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

import { Card, CardBody, Avatar, Badge } from "@nextui-org/react";
import { FaEdit } from "react-icons/fa";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { useRef, ChangeEvent, useEffect, useState } from "react";
import ProfileStats from "../components/ProfileStats";

const Settings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const userId = auth.currentUser?.uid;

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

  // const getImageByUserId = async (userId: string) => {
  //   const storage = getStorage();
  //   const jpgImagePath = `/profilePictures/${userId}`;
  //   const pngImagePath = `profilePictures/${userId}`;

  //   try {
  //     // Check if the image is a JPG
  //     const jpgImageRef = ref(storage, jpgImagePath);
  //     const jpgDownloadUrl = await getDownloadURL(jpgImageRef);
  //     setProfilePicture(jpgDownloadUrl);
  //   } catch (jpgError) {
  //     console.log(jpgError);
  //     // If JPG fetch fails, check if the image is a PNG
  //     try {
  //       const pngImageRef = ref(storage, pngImagePath);
  //       const pngDownloadUrl = await getDownloadURL(pngImageRef);
  //       setProfilePicture(pngDownloadUrl);
  //     } catch (pngError) {
  //       // Handle the case when no image is found for the given user ID
  //       console.log(pngError);
  //       return null;
  //     }
  //   }
  // };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <Card>
            <CardBody>
              <div className="flex justify-center">
                {/* <p className="font-semibold text-sm">
                  {auth.currentUser?.displayName}
                </p> */}
                <div className="flex flex-col justify-center items-center space-y-3 w-full">
                  <p className="font-bold text-xl">Thundersalad</p>
                  <Badge
                    content={<FaEdit />}
                    color="primary"
                    className="w-8 h-8 bottom-3 cursor-pointer"
                    placement="bottom-right"
                    onClick={handleButtonClick}
                  >
                    <Avatar
                      src={auth.currentUser?.photoURL ?? ""}
                      className="w-20 h-20 text-large"
                    />
                  </Badge>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                  <ProfileStats />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;

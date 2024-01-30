import { Avatar, Card } from "@nextui-org/react";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { useState, useEffect } from "react";

interface ProfileCardProps {
  username: string;
}

const ProfileCard = (props: ProfileCardProps) => {
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [_isPicLoading, setIsPicLoading] = useState(true);

  useEffect(() => {
    if (props.username) {
      getImageByUserId(props.username);
    }
  }, []);

  const getImageByUserId = async (userId: string) => {
    const storage = getStorage();
    const jpgImagePath = `/profilePictures/${userId}`;
    const pngImagePath = `profilePictures/${userId}`;

    try {
      // Check if the image is a JPG
      const jpgDownloadUrlPromise = getDownloadURL(ref(storage, jpgImagePath));

      const jpgDownloadUrl = await jpgDownloadUrlPromise;

      if (jpgDownloadUrl) {
        setProfilePictureURL(jpgDownloadUrl);
        setIsPicLoading(false);
      }
    } catch (jpgError) {
      // If JPG fetch fails, check if the image is a PNG
      try {
        const pngDownloadUrlPromise = getDownloadURL(
          ref(storage, pngImagePath)
        );
        const pngDownloadUrl = await pngDownloadUrlPromise;

        if (pngDownloadUrl) {
          setProfilePictureURL(pngDownloadUrl);
          setIsPicLoading(false);
        }
        console.log(pngDownloadUrl);
      } catch (pngError) {
        // Handle the case when no image is found for the given user ID
        setIsPicLoading(false);
        // Optionally, you can log this error if needed
        // console.error(pngError);
        return null;
      }

      setIsPicLoading(false);
    }
  };

  return (
    <Card className="w-full p-1 my-2" shadow="sm" radius="lg">
      <div className="flex items-center space-x-2 p-2">
        <Avatar src={profilePictureURL} />
        <p>{props.username}</p>
      </div>
    </Card>
  );
};

export default ProfileCard;

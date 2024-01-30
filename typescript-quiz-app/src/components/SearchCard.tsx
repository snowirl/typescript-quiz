import Skeleton from "react-loading-skeleton";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  Avatar,
  CardBody,
  CardFooter,
  Chip,
} from "@nextui-org/react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

interface SearchCardProps {
  title: string;
  description: string;
  cardsLength: number;
  ownerId: string;
  username: string;
  id: string;
}

const SearchCard = (props: SearchCardProps) => {
  const [isLoading, _setIsLoading] = useState(false);
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [isPicLoading, setIsPicLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (props.ownerId === undefined) {
      return;
    }
    if (props.ownerId.length > 0) {
      getImageByUserId(props.ownerId);
    }
  }, [props.ownerId]);

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
    <Card className="w-full p-1" shadow="sm" radius="lg">
      <CardHeader className="px-2 pt-2 pb-1">
        <div className="flex justify-between w-full">
          <div className="flex-grow-1">
            {isPicLoading ? (
              <Skeleton circle className="w-9 h-9" enableAnimation />
            ) : (
              <div className="flex items-center space-x-2">
                <Avatar src={profilePictureURL} className="" />
                <p className="font-semibold">{props.username}</p>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardBody
        className="pt-1 pb-1 px-2 cursor-pointer"
        onClick={() => navigate(`/study/${props.id}`)}
      >
        <div className="text-left">
          {isLoading ? (
            <Skeleton className="w-1/3" enableAnimation />
          ) : (
            <p className="font-bold text-lg">{props.title}</p>
          )}
          {isLoading ? (
            <Skeleton className="w-full" count={2} enableAnimation />
          ) : (
            <p
              className="text-sm text-zinc-600 overflow-ellipsis line-clamp-2
      "
            >
              {props.description}
            </p>
          )}
        </div>
      </CardBody>
      <CardFooter className="pt-1 pb-2 px-2">
        {isLoading ? null : (
          <Chip size="sm" className="mt-1">
            <p className="font-semibold text-xs">{props.cardsLength} cards</p>
          </Chip>
        )}
      </CardFooter>
    </Card>
  );
};

export default SearchCard;

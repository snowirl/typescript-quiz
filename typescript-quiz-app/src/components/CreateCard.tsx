import {
  Card,
  CardHeader,
  CardBody,
  Tooltip,
  Image,
  Button,
  CardFooter,
} from "@nextui-org/react";
import { Flashcard } from "../assets/globalTypes";
import { FaTrash, FaImage } from "react-icons/fa6";
import TextareaAutosize from "react-textarea-autosize";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";

interface CreateCardProps {
  flashcard: Flashcard;
  index: number;
  handleCardDelete: (val: number) => void;
  handleCardChange: (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    index: number
  ) => void;
  handleCardImageChange: (url: string, side: string, val: number) => void;
}

const CreateCard = (props: CreateCardProps) => {
  const fileInputFrontRef = useRef<HTMLInputElement>(null);
  const fileInputBackRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = (side: string) => {
    // Trigger the file input when the button is clicked
    if (side === "front") {
      if (fileInputFrontRef.current) {
        fileInputFrontRef.current.click();
      }
    } else {
      if (fileInputBackRef.current) {
        fileInputBackRef.current.click();
      }
    }
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    side: string
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleImageUpload(event, side);
    }
  };

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    side: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected.");
      return;
    }
    const storage = getStorage();

    const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
    const randomChars = Math.random().toString(36).substring(2, 8); // Generate a random string

    const randomID = `${timestamp}_${randomChars}`;

    const storageRef = ref(storage, `deckPictures/${randomID}`);

    let newDownloadURL = "";

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");

        getDownloadURL(snapshot.ref).then((downloadURL) => {
          console.log("File available at", downloadURL);
          newDownloadURL = downloadURL;
          props.handleCardImageChange(
            newDownloadURL.toString(),
            side,
            props.index
          );
        });
      })
      .catch((error) => {
        return console.error("Error uploading the file:", error);
        // Handle the error, e.g., show an error message to the user
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        ease: "linear",
        duration: 0.15,
      }}
      exit={{ opacity: 0 }}
    >
      <Card className="bg-white dark:bg-dark-1" radius="md" shadow="sm">
        <CardHeader className="px-4">
          <div className="flex justify-between flex-grow items-center">
            <p className="text-base font-semibold">{props.index + 1}</p>
            <Tooltip
              content="Delete"
              showArrow
              delay={1000}
              className="text-black dark:text-white"
            >
              <Button
                className="hover:text-rose-600"
                variant="light"
                size="sm"
                radius="md"
                isIconOnly
                onClick={() => props.handleCardDelete(props.index)}
              >
                <FaTrash className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        </CardHeader>
        <CardBody className="pt-1">
          <div className="sm:flex sm:space-x-10 sm:mx-8 space-y-2 sm:space-y-0 mx-12">
            <div className="flex-1 flex-grow h-full space-y-1">
              <TextareaAutosize
                className="textarea"
                value={props.flashcard.front}
                onChange={(e) => props.handleCardChange(e, props.index)}
                placeholder="Enter term"
                name="front"
              />
              <div className="pl-0.5">
                <p className="text-sm text-zinc-600 dark:text-zinc-200 font-semibold">
                  Term
                </p>
                <div className="flex justify-between pt-1">
                  {/* <Button
                    isIconOnly
                    size="sm"
                    color="primary"
                    aria-label="Image"
                    radius="md"
                    onClick={() => handleButtonClick("front")}
                  >
                    <FaImage />
                  </Button> */}
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    style={{ display: "none" }}
                    ref={fileInputFrontRef}
                    onChange={(e) => handleFileChange(e, "front")}
                  />
                  <Image
                    className=""
                    width={150}
                    alt="frontImage"
                    src={props.flashcard.frontImage}
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 flex-grow h-full space-y-1">
              <TextareaAutosize
                className="textarea"
                value={props.flashcard.back}
                onChange={(e) => props.handleCardChange(e, props.index)}
                placeholder="Enter definition"
                name="back"
              />
              <div className="pl-0.5">
                <p className="text-sm text-zinc-600 dark:text-zinc-200 font-semibold">
                  Definition
                </p>
                <div className="flex justify-between pt-2">
                  <Button
                    isIconOnly
                    size="sm"
                    color="primary"
                    aria-label="Image"
                    onClick={() => handleButtonClick("back")}
                    radius="md"
                  >
                    <FaImage />
                  </Button>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    style={{ display: "none" }}
                    ref={fileInputBackRef}
                    onChange={(e) => handleFileChange(e, "back")}
                  />
                  <Image
                    className="max-w-[250px]"
                    alt="backImage"
                    src={props.flashcard.backImage}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter />
      </Card>
    </motion.div>
  );
};

export default CreateCard;

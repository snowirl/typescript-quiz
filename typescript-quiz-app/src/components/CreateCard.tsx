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
import { useRef, ChangeEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CreateCardProps {
  flashcard: Flashcard;
  index: number;
  handleCardDelete: (val: number) => void;
  handleCardChange: (flashcard: Flashcard, index: number) => void;
  handleCardImageChange: (url: string, side: string, val: number) => void;
}

const CreateCard = (props: CreateCardProps) => {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [image, setImage] = useState<string | undefined>("");
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
          setImage(newDownloadURL.toString());
        });
      })
      .catch((error) => {
        return console.error("Error uploading the file:", error);
        // Handle the error, e.g., show an error message to the user
      });
  };

  const handleImageDelete = () => {
    if (fileInputBackRef.current) {
      fileInputBackRef.current.value = "";
      props.handleCardImageChange("", "back", props.index);
    }
  };

  useEffect(() => {
    // // Reset the input values when the flashcard prop changes
    // // Use defaultValue to set the initial values
    // if (fileInputFrontRef.current) {
    //   fileInputFrontRef.current.value = props.flashcard.front;
    // }
    // if (fileInputBackRef.current) {
    //   fileInputBackRef.current.value = props.flashcard.back;
    // }
    setFront(props.flashcard.front);
    setBack(props.flashcard.back);
    setImage(props.flashcard.backImage);
  }, [props.flashcard]);

  const onInputDone = () => {
    let flashcard: Flashcard = {
      front: front,
      back: back,
      backImage: image ?? "",
      cardId: props.flashcard.cardId,
    };

    props.handleCardChange(flashcard, props.index);
  };

  return (
    <motion.div
      key={props.index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        ease: "linear",
        duration: 0.15,
      }}
      exit={{ opacity: 0 }}
    >
      <Card className="bg-white dark:bg-dark-1 shadow-sm" shadow="none">
        <CardHeader className="px-4">
          <div className="flex justify-between flex-grow items-center">
            <p className="text-base font-semibold">{props.index + 1}</p>
            {props.index > 0 ? (
              <Tooltip
                content="Delete"
                delay={750}
                className="text-black dark:text-white"
              >
                <Button
                  className="hover:text-rose-600"
                  variant="light"
                  size="sm"
                  radius="md"
                  color="default"
                  isIconOnly
                  onClick={() => props.handleCardDelete(props.index)}
                >
                  <FaTrash />
                </Button>
              </Tooltip>
            ) : null}
          </div>
        </CardHeader>
        <CardBody className="pt-1">
          <div className="sm:flex sm:space-x-10 sm:mx-8 space-y-2 sm:space-y-0 mx-4">
            <div className="flex-1 flex-grow h-full space-y-1">
              <TextareaAutosize
                className="textarea"
                value={front}
                onChange={(e) => setFront(e.target.value)}
                onBlur={onInputDone}
                placeholder="Enter term"
                name="front"
                maxLength={500}
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
                </div>
              </div>
            </div>
            <div className="flex-1 flex-grow h-full space-y-1">
              <TextareaAutosize
                className="textarea"
                value={back}
                onChange={(e) => setBack(e.target.value)}
                onBlur={onInputDone}
                placeholder="Enter definition"
                name="back"
                maxLength={500}
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
                    loading="lazy"
                  />
                  {props.flashcard.backImage ? (
                    <Button
                      isIconOnly
                      color="danger"
                      variant="light"
                      className="absolute right-4 z-10"
                      size="sm"
                      onClick={handleImageDelete}
                    >
                      <FaTrash />
                    </Button>
                  ) : null}
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

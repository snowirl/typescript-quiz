import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  RadioGroup,
  Radio,
  Switch,
  Divider,
  Button,
} from "@nextui-org/react";
import { FaStar, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import { Flashcard } from "../assets/globalTypes";
import { useState, useRef, useEffect } from "react";

interface StudyCardSideProps {
  isFlipped: boolean;
  flashcard: Flashcard;
  isShuffled: boolean;
  shuffleDeck: (bool: boolean) => void;
  changeStarredSelected: (val: string) => void;
  isStarredOnly: boolean;
  isFrontFirst: boolean;
  flipCard: () => void;
  changeInitialCardSide: (val: string) => void;
  isFront: boolean;
  handleStarCard: (flashcard: Flashcard) => void;
  isStarred: boolean;
}
const StudyCardSide = (props: StudyCardSideProps) => {
  const [speaking, setSpeaking] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    speechSynthesis.cancel();
    setSpeaking(false);
  }, [props.isFlipped]);

  const handleFooterClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Prevent the click event from propagating to child elements
    event.stopPropagation();
    // Add your logic here for handling CardFooter click
    props.flipCard();
  };

  const handleSpeak = () => {
    if (!speaking) {
      const utterance = new SpeechSynthesisUtterance(
        props.isFront ? props.flashcard.front : props.flashcard.back
      );
      speechSynthesis.speak(utterance);

      utterance.onstart = () => {
        setSpeaking(true);
      };

      utterance.onend = () => {
        setSpeaking(false);
      };
    } else {
      speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  return (
    <Card className="overflow-auto">
      <CardHeader
        className="flex gap-3 justify-between pb-0 cursor-pointer"
        onClick={handleFooterClick}
      >
        <p className="text-xs p-2">{props.isFront ? "Term" : "Definition"}</p>
        <Button
          isIconOnly
          size="md"
          radius="full"
          variant="light"
          onClick={() => props.handleStarCard(props.flashcard)}
        >
          <FaStar
            className={
              props.isStarred
                ? "w-5 h-5 text-yellow-500"
                : "w-5 h-5 text-gray-500"
            }
          />
        </Button>
      </CardHeader>
      <CardBody className="cursor-pointer" onClick={() => props.flipCard()}>
        <div className="flex flex-col h-[280px] items-center overflow-y-auto">
          <p className="text-[22px] text-center my-auto">
            {props.isFront ? props.flashcard.front : props.flashcard.back}
          </p>
          {(props.isFront && props.flashcard.frontImage) ||
          (!props.isFront && props.flashcard.backImage) ? (
            <img
              ref={imageRef}
              className="mt-4 max-w-[400px]"
              // width={imageWidth}
              alt="frontImage"
              src={
                props.isFront
                  ? props.flashcard.frontImage
                  : props.flashcard.backImage
              }
            />
          ) : null}
        </div>
      </CardBody>
      <CardFooter
        className="flex gap-3 justify-between pt-2 cursor-pointer"
        onClick={handleFooterClick}
      >
        <Button
          isIconOnly
          size="md"
          radius="full"
          variant="light"
          className="icon-btn"
          onClick={() => handleSpeak()}
        >
          {speaking ? (
            <FaVolumeUp className="w-5 h-5" />
          ) : (
            <FaVolumeMute className="w-5 h-5" />
          )}
        </Button>
        <Popover placement="top" offset={10}>
          <PopoverTrigger>
            <Button
              isIconOnly
              size="md"
              radius="full"
              variant="light"
              className="icon-btn"
            >
              <IoEllipsisHorizontalSharp className="w-5 h-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 space-y-4">
              <RadioGroup
                label="Initial Side"
                orientation="horizontal"
                defaultValue={props.isFrontFirst ? "front" : "back"}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  props.changeInitialCardSide(event.target.value)
                }
              >
                <Radio value="front">Term</Radio>
                <Radio value="back">Definition</Radio>
              </RadioGroup>
              <Divider className="my-4" />
              <RadioGroup
                label="Filter Cards"
                orientation="horizontal"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  props.changeStarredSelected(event.target.value)
                }
                defaultValue={props.isStarredOnly ? "starred" : "all"}
              >
                <Radio value="all">All</Radio>
                <Radio value="starred">Starred Only</Radio>
              </RadioGroup>
              <Divider className="my-4" />
              <div className="text-center">
                <p className="text-gray-800 dark:text-gray-400 py-2">
                  Shuffle Cards
                </p>
                <Switch
                  aria-label="Shuffle Cards"
                  size="sm"
                  isSelected={props.isShuffled}
                  onChange={() => props.shuffleDeck(props.isShuffled)}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </CardFooter>
    </Card>
  );
};

export default StudyCardSide;

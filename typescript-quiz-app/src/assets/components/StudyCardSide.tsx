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
} from "@nextui-org/react";
import { FaStar, FaVolumeUp } from "react-icons/fa";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";

interface StudyCardSideProps {
  isFlipped: boolean;
  setIsFlipped: (isFlipped: boolean) => void;
  text: string;
  isShuffled: boolean;
  shuffleDeck: (bool: boolean) => void;
  changeStarredSelected: (val: string) => void;
  isStarred: boolean;
}
const StudyCardSide = (props: StudyCardSideProps) => {
  return (
    <Card className="rounded-lg">
      <CardHeader className="flex gap-3 justify-between px-4 py-5">
        <p className="text-xs p-2">Front</p>
        <button className="icon-btn">
          <FaStar
            className={
              props.isStarred
                ? "w-5 h-5 text-yellow-500"
                : "w-5 h-5 text-gray-500"
            }
          />
        </button>
      </CardHeader>
      <CardBody
        className="flex justify-center items-center h-[280px] cursor-pointer"
        onClick={() => props.setIsFlipped(!props.isFlipped)}
      >
        <p className="text-lg">{props.text}</p>
      </CardBody>
      <CardFooter className="flex gap-3 justify-between px-4 py-5">
        <button className="icon-btn">
          <FaVolumeUp className="w-5 h-5" />
        </button>
        <Popover placement="top" offset={10}>
          <PopoverTrigger>
            <button className="icon-btn">
              <IoEllipsisHorizontalSharp className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-1 py-2 space-y-4">
              <RadioGroup label="Initial Side" orientation="horizontal">
                <Radio value="front">Front</Radio>
                <Radio value="back">Back</Radio>
              </RadioGroup>
              <Divider className="my-4" />
              <RadioGroup
                label="Filter Cards"
                orientation="horizontal"
                onChange={(event) =>
                  props.changeStarredSelected(event.target.value)
                }
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

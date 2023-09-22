import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { FaStar, FaVolumeUp } from "react-icons/fa";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";

interface StudyCardSideProps {
  isFlipped: boolean;
  setIsFlipped: (isFlipped: boolean) => void;
  text: string;
}
const StudyCardSide = (props: StudyCardSideProps) => {
  return (
    <Card>
      <CardHeader className="flex gap-3 justify-between px-4 py-5">
        <p className="text-sm">Front</p>
        <FaStar className="w-5 h-5 text-gray-500" />
      </CardHeader>
      <CardBody
        className="flex justify-center items-center h-[300px] cursor-pointer"
        onClick={() => props.setIsFlipped(!props.isFlipped)}
      >
        <p className="text-lg">{props.text}</p>
      </CardBody>
      <CardFooter className="flex gap-3 justify-between px-4 py-5">
        <FaVolumeUp className="w-5 h-5" />
        <IoEllipsisHorizontalSharp className="w-5 h-5" />
      </CardFooter>
    </Card>
  );
};

export default StudyCardSide;

import { FaStar } from "react-icons/fa6";
import { Flashcard } from "../assets/globalTypes";
import { Button, Card, CardBody, Image } from "@nextui-org/react";

interface StudyCardPreviewProps {
  flashcard: Flashcard;
  isStarred?: boolean;
  handleStarCard: (flashcard: Flashcard) => void;
}

const StudyCardPreview = (props: StudyCardPreviewProps) => {
  return (
    <Card className="shadow-sm  md:min-h-[40px]" shadow="none">
      <div className="py-1 px-1 absolute w-full flex justify-end">
        <Button
          isIconOnly
          size="sm"
          radius="lg"
          variant="light"
          color={props.isStarred ? "warning" : "default"}
          className="z-10"
          onClick={() => props.handleStarCard(props.flashcard)}
        >
          <FaStar
            className={
              props.isStarred
                ? "w-3 h-3 text-yellow-500"
                : "w-3 h-3 text-gray-500"
            }
          />
        </Button>
      </div>
      <CardBody>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 px-2">
            <p className="text-sm">{props.flashcard.front}</p>
          </div>
          <div className="bg-black/10 dark:bg-white/10 w-[2px] h-auto mx-4 hidden md:block"></div>
          <div className="bg-black/10 dark:bg-white/10 w-full h-[2px] my-4 md:hidden"></div>
          <div className="flex-1 px-4 space-y-4">
            <p className="text-sm">{props.flashcard.back}</p>

            {props.flashcard.backImage ? (
              <Image
                className="max-w-[300px]"
                alt="backImage"
                src={props.flashcard.backImage}
                loading="lazy"
              />
            ) : null}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default StudyCardPreview;

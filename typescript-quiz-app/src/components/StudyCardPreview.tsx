import { Flashcard } from "../assets/globalTypes";
import { Card, CardBody } from "@nextui-org/react";

interface StudyCardPreviewProps {
  flashcard: Flashcard;
}

const StudyCardPreview = (props: StudyCardPreviewProps) => {
  return (
    <Card className="rounded-lg " shadow="sm">
      <CardBody>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 px-2">
            <p className="text-sm">{props.flashcard.front}</p>
          </div>
          <div className="bg-black/10 dark:bg-white/10 w-[2px] h-auto mx-4 hidden md:block"></div>
          <div className="bg-black/10 dark:bg-white/10 w-full h-[2px] my-4 md:hidden"></div>
          <div className="flex-1 px-2">
            <p className="text-sm">{props.flashcard.back}</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default StudyCardPreview;

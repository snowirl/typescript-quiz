import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { FaEdit, FaTrash } from "react-icons/fa";

const SetCard = () => {
  return (
    <div>
      <Card>
        <CardBody>
          <div className="flex justify-end w-full">
            <button className="icon-btn">
              <FaEdit className="text-blue-600" />
            </button>
            <button className="icon-btn">
              <FaTrash className="text-rose-600" />
            </button>
          </div>
          <p className="text-center font-bold text-xl">Rome Flashcards</p>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default SetCard;

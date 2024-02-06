import TestQuestion from "../components/TestQuestion";
import { Button } from "@nextui-org/react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Test = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="space-y-5 flex justify-center items-center ">
        <div className="max-w-[800px] flex-grow space-y-4 mx-4 pb-10">
          <div className="space-x-2 flex justify-between mx-1">
            <div className="w-1/3 space-x-2 flex items-center">
              <Button onClick={() => navigate(`/study/${id}`)}>
                <IoIosArrowRoundBack className="w-7 h-7" /> Back
              </Button>
            </div>
          </div>
          <TestQuestion />
          <TestQuestion />
          <TestQuestion />
          <TestQuestion />
        </div>
      </div>
    </div>
  );
};

export default Test;

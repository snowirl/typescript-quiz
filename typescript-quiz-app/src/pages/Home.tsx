import { Button } from "@nextui-org/button";
import quizScreenshot from "../assets/quiz-screenshot.png";
import { Image } from "@nextui-org/react";
import { motion, Variants } from "framer-motion";

const cardVariants: Variants = {
  offscreen: {
    opacity: 0.2,
    y: 50,
  },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.4,
      duration: 1,
    },
  },
};

const Home = () => {
  return (
    <>
      <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
        <div className="space-y-5 flex justify-center items-center">
          <div className="space-y-4 max-w-[650px] mt-6 px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.6,
              }}
              className="space-y-4"
            >
              <p className="text-4xl font-bold">
                Dive into your new Flashcard Maker and Study App
              </p>
              <p>
                Welcome to Studucky, the ultimate flashcard maker and study app
                designed to make learning fun and simple. And it's completely
                free!
              </p>
              <div className="py-2">
                <Button size="lg" color="primary" className="font-semibold">
                  Sign up for free
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="flex justify-center w-full py-10 px-8 items-center">
          <div className="max-w-[900px] w-full">
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.8 }}
              variants={cardVariants}
            >
              <Image alt="NextUI hero Image" src={quizScreenshot} shadow="sm" />
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

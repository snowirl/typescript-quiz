import { Button } from "@nextui-org/button";
import quizScreenshot from "../assets/quiz-screenshot.png";
import { Image } from "@nextui-org/react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import SignUpModal from "../components/SignUpModal";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

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
  let { scrollYProgress } = useScroll();
  let y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsUserSignedIn(true);
      } else {
        setIsUserSignedIn(false);
      }
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  const handleOpenSignUpModal = () => {
    if (auth.currentUser === null) {
      setIsSignUpModalOpen(true);
    }
  };

  const navigateToCreate = () => {
    navigate("/create/new");
  };

  useEffect(() => {
    if (auth.currentUser === null) {
      setIsUserSignedIn(false);
    } else {
      setIsUserSignedIn(true);
    }
  }, [auth.currentUser]);

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
              className="space-y-4 relative"
            >
              <div className="relative z-10 space-y-6">
                <p className="text-4xl font-bold">
                  Dive into your new Flashcard Maker and Study App
                </p>
                <p>
                  Welcome to Studucky, the ultimate flashcard maker and study
                  app designed to make learning fun and simple. And it's
                  completely free!
                </p>
              </div>
              <motion.div
                style={{ y }}
                className="w-72 h-72 rounded-full bg-primary top-0 -left-20 absolute blur-2xl opacity-30"
              ></motion.div>
              <div className="py-2">
                {!isUserSignedIn ? (
                  <Button
                    size="lg"
                    color="primary"
                    className="font-semibold"
                    onPress={() => handleOpenSignUpModal()}
                  >
                    Sign up for free
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    color="primary"
                    className="font-semibold"
                    onPress={() => navigateToCreate()}
                  >
                    Create a new set
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="flex justify-center w-full py-10 px-8 items-center">
          <div className="max-w-[900px] w-full">
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: false, amount: 0.8 }}
              variants={cardVariants}
              className="z-10"
            >
              <Image
                alt="NextUI hero Image"
                src={quizScreenshot}
                shadow="sm"
                className="z-10"
              />
            </motion.div>
          </div>
        </div>
        <motion.div
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: false, amount: 0.8 }}
          variants={cardVariants}
          className="w-full bg-primary flex py-10 mt-72 justify-center"
        >
          <div className="w-full max-w-[1200px] flex justify-center items-center space-x-10">
            <div className="text-white w-1/3 space-y-2">
              <p className="font-bold text-xl ">Efficient Learning</p>
              <Image />
              <p>
                Users can create and access a variety of study materials,
                including flashcards and quizzes, making learning more
                efficient.
              </p>
            </div>
            <div className="text-white w-1/3 space-y-2">
              <p className="font-bold text-xl ">Efficient Learning</p>
              <Image />
              <p>
                Users can create and access a variety of study materials,
                including flashcards and quizzes, making learning more
                efficient.
              </p>
            </div>
            <div className="text-white w-1/3 space-y-2">
              <p className="font-bold text-xl ">Efficient Learning</p>
              <Image />
              <p>
                Users can create and access a variety of study materials,
                including flashcards and quizzes, making learning more
                efficient.
              </p>
            </div>
          </div>
        </motion.div>
        <div className="bg-gray-100 dark:bg-dark-2 w-full h-[800px]"></div>
        <SignUpModal
          isSignUpModalOpen={isSignUpModalOpen}
          setIsSignUpModalOpen={setIsSignUpModalOpen}
        />
      </div>
    </>
  );
};

export default Home;

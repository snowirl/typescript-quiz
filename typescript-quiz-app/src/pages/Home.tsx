import { Button } from "@nextui-org/button";
import StudyDark from "../assets/StudyDark.png";
import StudyLight from "../assets/StudyLight.png";
import { Image } from "@nextui-org/react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { BsFillLightningFill } from "react-icons/bs";
import { TfiWorld } from "react-icons/tfi";
import { FaCheck } from "react-icons/fa6";

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
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

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
                    variant="shadow"
                    className="font-semibold"
                    onPress={() => navigate("/signup")}
                  >
                    Sign Up For Free
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    color="primary"
                    variant="shadow"
                    className="font-semibold"
                    onPress={() => navigateToCreate()}
                  >
                    Create a New Set
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="flex justify-center w-full py-10 px-8 items-center">
          <div className="max-w-[1400px] w-full">
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: false, amount: 0.8 }}
              variants={cardVariants}
              className="z-10"
            >
              <Image
                alt="NextUI hero Image"
                src={theme === "dark" ? StudyDark : StudyLight}
                shadow="sm"
                className="z-10"
              />
            </motion.div>
          </div>
        </div>
        <motion.div className="w-full bg-primary py-10 mt-72 justify-center">
          <div className="py-4">
            {/* <p className="text-3xl font-semibold text-white">Benefits</p> */}
          </div>
          <div className="w-full flex justify-center items-center space-x-10 pt-14 pb-20">
            <div className="lg:flex w-full justify-center max-w-[2000px] space-y-24 lg:space-y-0">
              <div className="text-white lg:w-1/3  space-y-4 mx-8">
                <div className="flex justify-center py-4">
                  <BsFillLightningFill className="w-8 h-8" />
                </div>
                <p className="font-bold text-2xl ">Easy Setup</p>

                <p>
                  Get started in seconds! Our user-friendly interface makes
                  creating flashcard sets a breeze, so you can focus on
                  learning, not on navigating complex tools.
                </p>
              </div>
              <div className="text-white lg:w-1/3 space-y-4 mx-8">
                <div className="flex justify-center py-4">
                  <FaCheck className="w-8 h-8" />
                </div>
                <p className="font-bold text-2xl ">Save Your Progress</p>

                <p>
                  Never lose your focus as you effortlessly save your starred
                  cards, allowing you to seamlessly pick up right where you left
                  off.
                </p>
              </div>
              <div className="text-white lg:w-1/3 space-y-4 mx-8">
                <div className="flex justify-center py-4">
                  <TfiWorld className="w-8 h-8" />
                </div>
                <p className="font-bold text-2xl ">Study Anywhere</p>

                <p>
                  Study anytime, anywhere! Studucky is available on your mobile
                  device as well as your desktop computer.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="bg-gray-100 dark:bg-dark-2 w-full h-[800px]"></div>
      </div>
    </>
  );
};

export default Home;

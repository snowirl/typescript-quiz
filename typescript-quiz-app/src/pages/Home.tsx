import { Button } from "@nextui-org/button";
import { Image } from "@nextui-org/react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { BsFillLightningFill } from "react-icons/bs";
import { TfiWorld } from "react-icons/tfi";
import { FaCheck, FaCircleCheck } from "react-icons/fa6";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import StudyWhite from "../assets/StudyWhite.png";
import StudyDark from "../assets/StudyDark.png";
import LearnWhite from "../assets/LearnWhite.png";
import LearnDark from "../assets/LearnDark.png";
import TestWhite from "../assets/TestWhite.png";
import TestDark from "../assets/TestDark.png";
import GameWhite from "../assets/GameWhite.png";
import GameDark from "../assets/GameDark.png";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  const { theme } = useTheme();

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
                src={theme === "dark" ? StudyDark : StudyWhite}
                shadow="sm"
                className="z-10 shadow-xl dark:shadow-white/10"
              />
              <div className="flex w-full items-center justify-around pt-10">
                <div className="flex items-center space-x-2 ">
                  <FaCircleCheck className="text-green-500" />
                  <p>Customizable flashcards</p>
                </div>
                <div className="flex items-center space-x-2 ">
                  <FaCircleCheck className="text-green-500" />
                  <p>Simple interface</p>
                </div>
                <div className="flex items-center space-x-2 ">
                  <FaCircleCheck className="text-green-500" />
                  <p>Completely Free</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div className="w-full bg-zinc-800 py-10 mt-48 justify-center">
          <div className="py-4">
            {/* <p className="text-3xl font-semibold text-white">Benefits</p> */}
          </div>
          <div className="w-full flex justify-center items-center space-x-10 pt-0 pb-8">
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
                  Never lose your focus as you effortlessly save your flashcards
                  and activity, allowing you to seamlessly pick up right where
                  you left off.
                </p>
              </div>
              <div className="text-white lg:w-1/3 space-y-4 mx-8">
                <div className="flex justify-center py-4">
                  <TfiWorld className="w-8 h-8" />
                </div>
                <p className="font-bold text-2xl ">Study Anywhere</p>

                <p>
                  Study anytime, anywhere! Studucky is available on your mobile
                  device as well as your computer.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
        <div className="flex w-full justify-center">
          <div className="py-24 max-w-7xl w-full px-4 my-10">
            <Swiper
              cssMode={true}
              navigation={true}
              pagination={true}
              mousewheel={true}
              keyboard={true}
              modules={[Navigation, Pagination, Mousewheel, Keyboard]}
              className="mySwiper h-full"
              loop={true}
            >
              <SwiperSlide>
                <div className="h-fit relative">
                  <Image
                    alt="NextUI hero Image"
                    src={theme === "dark" ? LearnDark : LearnWhite}
                    shadow="none"
                    className=""
                  />
                  <div className="w-full space-y-4 rounded-xl px-2 py-2 mb-16 mt-10">
                    <p className="text-3xl font-semibold">Learn</p>
                    <p className="">
                      We use the Leitner System to quiz our users, which is a
                      spaced repetition technique designed to enhance the
                      efficiency of learning by strategically scheduling review
                      sessions for flashcards based on the user's mastery level.
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="h-fit relative">
                  <Image
                    alt="NextUI hero Image"
                    src={theme === "dark" ? TestDark : TestWhite}
                    shadow="none"
                    className=""
                  />
                  <div className="w-full space-y-4 rounded-xl px-2 py-2 mb-16 mt-10">
                    <p className="text-3xl font-semibold">Test</p>
                    <p className="">
                      Create customizable tests with up to 50 questions to test
                      your mastery of a subject, using any flashcard set you
                      create or find. Users can see their results and understand
                      their subject more with our test reviews. Users can also
                      take
                      <span className="font-semibold">
                        {" "}
                        unlimited free tests!
                      </span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="h-fit relative">
                  <Image
                    alt="NextUI hero Image"
                    src={theme === "dark" ? GameDark : GameWhite}
                    shadow="none"
                    className=""
                  />
                  <div className="w-full space-y-4 rounded-xl px-2 py-2 mb-16 mt-10">
                    <p className="text-3xl font-semibold">Game</p>
                    <p className="">
                      Race against the clock and your own memory as you connect
                      pairs across diverse categories, each challenging your
                      understanding. This makes learning and testing your
                      knowledge fun and engaging!
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div className="w-full bg-zinc-800 text-white my-10 py-10">
          {/* <div className="w-full mb-8 text-xl">
            <p className="text-center">Features</p>
          </div> */}
          <div className="w-full flex justify-center items-center">
            <div className="py-8 text-lg w-full lg:w-1/2 mx-10 grid grid-cols-1 lg:grid-cols-2 lg:gap-2 text-left space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-2">
                <FaCircleCheck />
                <p>Create unlimited flashcard sets</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCircleCheck />
                <p>Customizable flashcards with images</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCircleCheck />
                <p>Customizable profiles</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCircleCheck />
                <p>Search for public sets</p>
              </div>{" "}
              <div className="flex items-center space-x-2">
                <FaCircleCheck />
                <p>Matching flashcard game</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCircleCheck />
                <p>Unlimited Free Test Generator</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCircleCheck />
                <p>Quiz with spaced repetition algorithm</p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCircleCheck />
                <p>Customizable folders organize sets</p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-10 pb-20">
          {!isUserSignedIn ? (
            <Button
              size="lg"
              color="primary"
              className="font-semibold"
              onPress={() => navigate("/signup")}
            >
              Sign Up For Free
            </Button>
          ) : (
            <Button
              size="lg"
              color="primary"
              className="font-semibold"
              onPress={() => navigateToCreate()}
            >
              Create a New Set
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

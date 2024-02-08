import { Button } from "@nextui-org/button";
import quizScreenshot from "../assets/quiz-screenshot.png";
import { Image } from "@nextui-org/react";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { useEffect, useState, Fragment } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { Dialog, Transition } from "@headlessui/react";

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
  const { onOpen, setWhichModal } = useUserContext();
  const [isOpen, setIsOpen] = useState(true);

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
          <Transition appear show={isOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-10"
              onClose={() => setIsOpen(true)}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/25" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    <Dialog.Panel className="w-full h-[90vh] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900 flex justify-between"
                      >
                        Payment successful
                        <Button onClick={() => setIsOpen(false)}>X</Button>
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Your payment has been successfully submitted. We’ve
                          sent you an email with all of the details of your
                          order.
                        </p>
                        <input></input>
                        <input></input>
                        <input></input>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => setIsOpen(false)}
                        >
                          Got it, thanks!
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => setIsOpen(false)}
                        >
                          Got it, thanks!
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition>
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
                    onPress={() => {
                      onOpen(), setWhichModal("signup");
                    }}
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

        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      </div>
    </>
  );
};

export default Home;

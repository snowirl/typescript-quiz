import { motion } from "framer-motion";
import { useState } from "react";

const Home = () => {
  const [isCardVisible, setIsCardVisible] = useState(true);
  const [isMovingLeft, setIsMovingLeft] = useState(false);

  const handleCardClick = () => {
    console.log("clicked");
    setIsCardVisible(false);
    setTimeout(() => {
      setIsCardVisible(true);
    }, 300);
  };

  return (
    <>
      <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
        <p className="font-bold text-4xl text-center py-4 bg-gradient-to-b from-teal-400 to-teal-700 drop-shadow-lg  bg-clip-text text-transparent">
          Make beautiful websites regardless of your design experience.
        </p>
      </div>
    </>
  );
};

export default Home;

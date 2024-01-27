import { Button } from "@nextui-org/react";
import { FaDiscord } from "react-icons/fa";

const Footer = () => {
  const discordButtonLink = () => {
    // Navigate to the desired path
    window.open("https://discord.gg/yEwc9fjk37", "_blank");
  };

  return (
    <footer className="bg-white dark:bg-[#18181B]">
      <div className="w-full mx-auto max-w-screen-xl px-4 pt-4 pb-6 lg:flex md:items-center md:justify-between lg:space-y-4 space-y-4">
        <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © 2023{" "}
          <a href="https://studucky.com/" className="hover:underline">
            Studucky™
          </a>
          . All Rights Reserved.
        </span>
        <ul className="font-bold flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0 justify-center my-3">
          <li>
            <a href="/legal" className="mr-4 hover:underline md:mr-6 ">
              About
            </a>
          </li>
          <li>
            <a href="/legal" className="mr-4 hover:underline md:mr-6">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="/legal" className="mr-4 hover:underline md:mr-6">
              Licensing
            </a>
          </li>
          <li>
            <a href="/legal" className="hover:underline">
              Contact
            </a>
          </li>
        </ul>
        <Button
          className="bg-[#5865F2] text-white font-semibold"
          onClick={discordButtonLink}
        >
          <FaDiscord />
          Join Our Discord!
        </Button>
      </div>
    </footer>
  );
};

export default Footer;

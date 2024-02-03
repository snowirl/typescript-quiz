import { Tabs, Tab } from "@nextui-org/react";
import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { useUserContext } from "../context/userContext";
import { useLocation } from "react-router-dom";

const SetsPage = () => {
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [tab, setTab] = useState("recents");
  const navigate = useNavigate();
  const { user } = useUserContext();
  const location = useLocation();

  useEffect(() => {
    if (isInitialRender) {
      // Update the state to indicate that the initial render has occurred
      setIsInitialRender(false);
      // Do not run the effect on the initial render
      const pathnameArray = location.pathname.split("/");
      const endingPart = pathnameArray[pathnameArray.length - 1];
      changeTab(endingPart);

      return;
    }
    navigate(`/sets/${tab}`);

    // console.log(location.pathname);
  }, [tab]);

  const changeTab = (key: Key) => {
    setTab(key.toString());
  };

  return (
    <>
      <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 pt-6">
        <div className="flex justify-center">
          <div className="max-w-[800px] flex-grow space-y-4 px-4 pb-4">
            <div className="flex items-center justify-center w-full">
              {!user ? (
                <p className="text-base font-semibold border-yellow-800/40 border dark:text-white/70 text-yellow-800 dark:bg-yellow-800 bg-yellow-400/20  rounded-lg px-6 py-2 flex items-center justify-center">
                  <FaExclamationTriangle className="mr-2" />
                  Please log in to see your sets
                </p>
              ) : null}
            </div>

            <Tabs
              aria-label="Options"
              variant="underlined"
              selectedKey={tab}
              onSelectionChange={changeTab}
              className="font-semibold"
              color="primary"
            >
              <Tab key="recents" title="Recents"></Tab>
              <Tab key="favorites" title="Favorites"></Tab>
              <Tab key="folders" title="Folders"></Tab>
              <Tab key="created" title="Created Sets"></Tab>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default SetsPage;

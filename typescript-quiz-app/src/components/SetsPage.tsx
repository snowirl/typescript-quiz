import { Tabs, Tab } from "@nextui-org/react";
import { Key, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SetsPage = () => {
  const [tab, setTab] = useState("recents");
  const navigate = useNavigate();

  useEffect(() => {
    navigate(`/sets/${tab}`);
  }, [tab]);

  const changeTab = (key: Key) => {
    setTab(key.toString());
  };
  return (
    <>
      <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 pt-6">
        <div className="flex justify-center">
          <div className="max-w-[800px] flex-grow space-y-4 px-4">
            <Tabs
              aria-label="Options"
              variant="underlined"
              selectedKey={tab}
              onSelectionChange={(key) => changeTab(key)}
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

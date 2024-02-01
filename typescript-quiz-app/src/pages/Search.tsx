import { Tabs, Tab } from "@nextui-org/react";
    private: boolean;
import { useState, Key } from "react";
import SearchSets from "../components/SearchSets";
import SearchUsers from "../components/SearchUsers";
import { useParams } from "react-router-dom";

const Search = () => {
  const [tab, setTab] = useState("");
  const id = useParams();

  const changeTab = (key: Key) => {
    setTab(key.toString());
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-2 flex justify-center">
      <div className="max-w-[800px] w-[800px] flex flex-col items-center justify-start py-6 mx-4">
        <div className="w-full text-left px-1">
          <p className="text-black dark:text-white text-lg">
            Showing results for <span className="font-bold">{id.query}</span>
          </p>
        </div>
        <Tabs
          aria-label="Options"
          variant="underlined"
          color="primary"
          selectedKey={tab}
          onSelectionChange={changeTab}
          className="font-semibold pt-8 rounded-md w-full"
        >
          <Tab key="decks" title="Study Sets" className="w-full">
            <SearchSets />
          </Tab>
          <Tab key="users" title="Users" className="w-full">
            <SearchUsers />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Search;

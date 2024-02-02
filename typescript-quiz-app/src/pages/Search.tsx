import { Tabs, Tab } from "@nextui-org/react";
import { useState, Key, useEffect } from "react";
import SearchSets from "./SearchSets";
import SearchUsers from "./SearchUsers";
import { Outlet, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Search = () => {
  const [tab, setTab] = useState("sets");
  const [query, setQuery] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const changeTab = (key: Key) => {
    setTab(key.toString());
    navigate(`/search/${key}/${query}`);
    console.log(query);
  };

  useEffect(() => {
    const pathnameParts = location.pathname.split("/");
    const secondPart = pathnameParts[pathnameParts.length - 2];
    const lastPart = pathnameParts[pathnameParts.length - 1];
    setQuery(lastPart);
    setTab(secondPart);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-2 flex justify-center">
      <div className="max-w-[800px] w-[800px] flex-col items-center justify-start py-6 mx-4">
        <div className="w-full text-left px-1">
          {/* <p className="text-black dark:text-white text-lg">
            Showing results for <span className="font-bold">{id.query}</span>
          </p> */}
        </div>
        <Tabs
          aria-label="Options"
          variant="underlined"
          color="primary"
          selectedKey={tab}
          onSelectionChange={changeTab}
          className="font-semibold pt-8 rounded-md w-full"
        >
          <Tab key="sets" title="Study Sets" className="w-full"></Tab>
          <Tab key="users" title="Users" className="w-full"></Tab>
        </Tabs>
        <div>
          <Routes>
            <Route path="/sets/:query" element={<SearchSets />} />
            <Route path="/users/:query" element={<SearchUsers />} />
          </Routes>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Search;

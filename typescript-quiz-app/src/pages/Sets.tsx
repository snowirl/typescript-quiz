import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Pagination,
} from "@nextui-org/react";
import SetCard from "../components/SetCard";
import SetsCreatedSets from "../components/SetsCreatedSets";
import SetsRecentSets from "../components/SetsRecentSets";
import { useState } from "react";
import SetsFolders from "../components/SetsFolders";
import SetsFavorites from "../components/SetsFavorites";

const Sets = () => {
  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <Tabs aria-label="Options" variant="underlined">
            <Tab key="recents" title="Recents">
              <SetsRecentSets />
            </Tab>
            <Tab key="favorites" title="Favorites">
              <SetsFavorites />
            </Tab>
            <Tab key="folders" title="Folders">
              <SetsFolders />
            </Tab>
            <Tab key="created" title="Created Sets">
              <SetsCreatedSets />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Sets;

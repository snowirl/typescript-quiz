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
import { useState } from "react";

const Sets = () => {
  const [totalCount, setTotalCount] = useState(0); // number of docs in the searched array
  const [pageIndex, setPageIndex] = useState(1); // number of docs in the searched array
  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <Tabs aria-label="Options" variant="underlined">
            <Tab key="recents" title="Recents">
              <div className="space-y-4">
                <SetCard />
                <SetCard />
                <SetCard />
                <SetCard />
              </div>
            </Tab>
            <Tab key="favorites" title="Favorites">
              <Card>
                <CardBody>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </CardBody>
              </Card>
            </Tab>
            <Tab key="folders" title="Folders">
              <Card>
                <CardBody>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </CardBody>
              </Card>
            </Tab>
            <Tab key="created" title="Created Sets">
              <div className=" justify-center flex">
                <div className="flex-grow max-w-[625px]">
                  <SetsCreatedSets />
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Sets;

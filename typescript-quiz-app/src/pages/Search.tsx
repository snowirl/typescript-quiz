import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  Configure,
  useSearchBox,
  HitsPerPage,
} from "react-instantsearch";
import SearchCard from "../components/SearchCard";
import type { PaginationProps, SearchBoxProps } from "react-instantsearch";
import { Tabs, Tab } from "@nextui-org/react";
import { usePagination } from "react-instantsearch";
import { useState, useEffect, Key } from "react";
import { Pagination } from "@nextui-org/react";
import { useParams } from "react-router-dom"; // Import from React Router
import ProfileCard from "../components/ProfileCard";

interface HitProps {
  hit: {
    objectID: string;
    description: string;
    title: string;
    private: boolean;
    cardsLength: number;
    owner: string;
    username: string;
    id: string;
    // Add other properties if needed
  };
}

interface UserProps {
  hit: {
    objectID: string;
  };
}

function Hit({ hit }: HitProps) {
  return (
    <div className="w-full flex-grow my-3">
      <SearchCard
        title={hit.title}
        description={hit.description}
        cardsLength={hit.cardsLength}
        ownerId={hit.owner}
        username={hit.username}
        id={hit.id}
      />
    </div>
  );
}

function UserHit({ hit }: UserProps) {
  return (
    <div className="my-3">
      <ProfileCard username={hit.objectID} />
    </div>
  );
}

const Search = () => {
  const [tab, setTab] = useState("");
  const searchClient = algoliasearch(
    "1GUAKQV47F",
    "02a87f36136ca5f67302432b104bb80c"
  );

  const CustomSearchBox = (props: SearchBoxProps) => {
    const { refine } = useSearchBox(props);
    const id = useParams(); // Get the current location

    const [myQuery, setMyQuery] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setMyQuery(e.target.value);
      // Optionally, you can perform additional actions here
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Additional handling, such as triggering the search
      refine(myQuery);
    };

    useEffect(() => {
      console.log(id.query);
      if (id.query) {
        setMyQuery(id.query);
        refine(id.query);
      } else {
        console.log("NO QUERY...");
      }
    }, [id.query]);

    return (
      <form
        onSubmit={handleSubmit}
        className="space-x-2 items-center w-full hidden"
      >
        <input
          placeholder="Title of your set"
          className="description text-lg py-3 w-full"
          color="primary"
          // size="sm"
          // radius="md"
          type="text"
          // variant="bordered"
          onChange={handleInputChange}
          value={myQuery}
        />
        <input type="submit" className="bg-primary px-4 rounded-md h-10" />
      </form>
    );
  };

  const CustomPagination = (props: PaginationProps) => {
    const { nbPages, refine } = usePagination(props);

    return (
      <>
        <Pagination
          variant="faded"
          className={`${nbPages > 1 ? "block pt-6" : "hidden"}`}
          total={nbPages > 1 ? nbPages - 1 : 1}
          onChange={(e: number) => refine(e)}
        />
      </>
    );
  };

  const changeTab = (key: Key) => {
    setTab(key.toString());
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-2 flex justify-center">
      <div className="max-w-[800px] w-[800px] flex flex-col items-center justify-start py-6 mx-4">
        <div className="w-full text-left">
          <p className="text-black dark:text-white font-bold text-xl">
            Showing results for "{location.pathname}"
          </p>
        </div>

        <InstantSearch searchClient={searchClient} indexName={tab}>
          <CustomSearchBox searchAsYouType={false} />
          {tab === "decks" ? <Configure filters="private:false" /> : null}

          <Tabs
            aria-label="Options"
            variant="underlined"
            color="primary"
            selectedKey={tab}
            onSelectionChange={changeTab}
            className="font-semibold py-2 rounded-md"
          >
            <Tab key="decks" title="Study Sets"></Tab>
            <Tab key="users" title="Users"></Tab>
          </Tabs>
          {tab === "decks" ? (
            <Hits hitComponent={Hit} className="w-full py-2" />
          ) : null}
          {tab === "users" ? (
            <div className="w-full flex justify-center">
              <Hits
                hitComponent={UserHit}
                className="py-2 w-full justify-center max-w-[350px]"
              />
            </div>
          ) : null}

          {/* <Pagination className="text-black w-full bg-red-200 flex items-center" /> */}
          <CustomPagination />
          <HitsPerPage
            className="hidden"
            items={[{ label: "3 hits per page", value: 3, default: true }]}
          />
        </InstantSearch>
      </div>
    </div>
  );
};

export default Search;

import algoliasearch, { SearchClient } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  Configure,
  useSearchBox,
  HitsPerPage,
} from "react-instantsearch";
import SearchCard from "./SearchCard";
import type { PaginationProps, SearchBoxProps } from "react-instantsearch";
import { usePagination } from "react-instantsearch";
import { useState, useEffect } from "react";
import { Pagination } from "@nextui-org/react";
import { useParams } from "react-router-dom"; // Import from React Router
import {
  MultipleQueriesQuery,
  MultipleQueriesResponse,
} from "@algolia/client-search";

const algoliaClient = algoliasearch(
  "1GUAKQV47F",
  "02a87f36136ca5f67302432b104bb80c"
);

const searchClient: SearchClient = {
  ...algoliaClient,
  search(requests: readonly MultipleQueriesQuery[]) {
    const hasEmptyQuery = requests.every(({ params }) => !params?.query);

    if (hasEmptyQuery) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0,
          hitsPerPage: 0,
          exhaustiveNbHits: false,
          query: "",
          params: "",
        })),
      } as MultipleQueriesResponse<any>);
    }

    return algoliaClient.search(requests) as Promise<
      MultipleQueriesResponse<any>
    >;
  },
};

const CustomSearchBox = (props: SearchBoxProps) => {
  const [myQuery, setMyQuery] = useState("");
  const { refine } = useSearchBox(props);
  const id = useParams(); // Get the current location

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMyQuery(e.target.value);
    // Optionally, you can perform additional actions here
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Additional handling, such as triggering the search

    if (myQuery !== undefined && myQuery !== "") {
      refine(myQuery);
    }
  };

  useEffect(() => {
    if (id.query && id.query !== undefined) {
      setMyQuery(id.query);
      refine(id.query);
      console.log(id.query);
    } else {
      console.log("NO QUERY...");
    }
  }, [id.query]);

  useEffect(() => {
    console.log("QUERY: " + id.query);
  }, []);

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

const SearchSetsComponent = () => {
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

  return (
    <div>
      <InstantSearch searchClient={searchClient} indexName="decks">
        <CustomSearchBox searchAsYouType={false} />
        <Configure filters="private:false" />
        <Hits hitComponent={Hit} className="w-full py-2" />

        <CustomPagination />
        <HitsPerPage
          className="hidden"
          items={[{ label: "3 hits per page", value: 3, default: true }]}
        />
      </InstantSearch>
    </div>
  );
};

export default SearchSetsComponent;

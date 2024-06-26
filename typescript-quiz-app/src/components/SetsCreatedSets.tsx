import { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  limit,
  query,
  orderBy,
  getCountFromServer,
  DocumentData,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import SetCard from "./SetCard";
import { Pagination } from "@nextui-org/react";
import { useLocation } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { Spinner } from "@nextui-org/react";
import SetsNoSetsFound from "./SetsNoSetsFound";

const SetsCreatedSets = () => {
  const [deckCount, setDeckCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deckList, setDeckList] = useState<DocumentData | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const displayPerPage = 3;
  const userID = auth.currentUser?.uid ?? null;
  const location = useLocation();
  const { user } = useUserContext();

  useEffect(() => {
    if (location.pathname === "/sets/created" && user) {
      handleFindSets(0);
      getDeckCount();
    } else {
      setIsLoading(false);
    }

    return () => {
      if (location.pathname === "/sets/created") {
      }
    };
  }, [user, location.pathname]);

  useEffect(() => {
    if (location.pathname === "/sets/created" && user) {
      handleFindSets(pageIndex);
    }
  }, [pageIndex]);

  useEffect(() => {
    // localStorage.setItem("created-sets", JSON.stringify(deckList));
  }, [deckList]);

  const getDeckCount = async () => {
    if (deckCount > 0 || userID === null) {
      setIsLoading(false);
      return;
    }

    try {
      const coll = collection(db, "users", userID, "decks");
      const snapshot = await getCountFromServer(coll);
      setDeckCount(snapshot.data().count);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFindSets = async (pageNum: number) => {
    if (user === null || userID === null) {
      setIsLoading(false);
      return;
    }

    let list: DocumentData = [];
    const setsRef = collection(db, "users", userID, "decks");
    let q = query(
      setsRef,
      orderBy("created", "desc"),
      limit(displayPerPage * (pageNum + 1))
    );

    if ((pageNum + 1) * displayPerPage - deckList?.length < pageNum) {
      return;
    }

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }

    setDeckList(list);
    setIsLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-100 text-black dark:text-gray-100 min-h-screen dark:bg-dark-2 pt-6">
        <div className="flex justify-center flex-col  items-center">
          <div className="flex-grow space-y-4 px-4 h-[540px] w-full max-w-[800px]">
            {!isLoading ? (
              deckList !== null && deckList.length > 0 ? (
                deckList
                  .slice(
                    pageIndex * displayPerPage,
                    (pageIndex + 1) * displayPerPage
                  )
                  .map((deck: DocumentData, index: number) => (
                    <SetCard key={index} deckId={deck.id} />
                  ))
              ) : (
                <SetsNoSetsFound />
              )
            ) : (
              <Spinner />
            )}
          </div>
          <div className="flex-grow">
            {isLoading || Math.ceil(deckCount / displayPerPage) < 2 ? null : (
              <div className="flex justify-center py-4">
                <Pagination
                  size="lg"
                  total={Math.max(1, Math.ceil(deckCount / displayPerPage))}
                  initialPage={1}
                  variant="faded"
                  onChange={(num: number) => setPageIndex(num - 1)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetsCreatedSets;

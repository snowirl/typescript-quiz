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
import { useUserContext } from "../context/userContext";
import { useLocation } from "react-router-dom";

const SetsRecentSets = () => {
  const [deckCount, setDeckCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deckList, setDeckList] = useState<DocumentData | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const displayPerPage = 3;
  const { user } = useUserContext();
  const userID = auth.currentUser?.uid ?? "Error";

  const location = useLocation();

  useEffect(() => {
    if (user) {
      handleFindSets(0);
      getDeckCount();
    }
  }, [user]);

  useEffect(() => {
    if (location.pathname === "/sets/recents") {
      handleFindSets(pageIndex);
    }
  }, [pageIndex]);

  const getDeckCount = async () => {
    if (deckCount > 0) {
      return;
    }
    try {
      const coll = collection(db, "users", userID, "activity");
      const snapshot = await getCountFromServer(coll);
      setDeckCount(snapshot.data().count);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFindSets = async (pageNum: number) => {
    if (user === null) {
      return;
    }

    let list: DocumentData = [];
    const setsRef = collection(db, "users", userID, "activity");
    let q = query(
      setsRef,
      orderBy("timestamp", "desc"),
      limit(5 * (pageNum + 1))
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
          <div className="flex-grow space-y-4 px-4 min-h-[540px] w-full max-w-[800px]">
            {deckList !== null
              ? deckList
                  .slice(
                    pageIndex * displayPerPage,
                    (pageIndex + 1) * displayPerPage
                  )
                  .map((deck: DocumentData, index: number) => (
                    <SetCard key={index} deckId={deck.docId} />
                  ))
              : null}
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

export default SetsRecentSets;

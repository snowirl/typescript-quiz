import { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  limit,
  query,
  orderBy,
  getCountFromServer,
  DocumentData,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import SetCard from "./SetCard";
import { Pagination } from "@nextui-org/react";
import { useUserContext } from "../context/userContext";

const SetsFavorites = () => {
  const [deckCount, setDeckCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deckList, setDeckList] = useState<DocumentData | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const displayPerPage = 3;
  const { user } = useUserContext();

  const userID = auth.currentUser?.uid ?? "Error";

  useEffect(() => {
    if (location.pathname === "/sets/favorites" && user) {
      handleFindSets(0);
      getFavoritedDeckCount();
    }

    return () => {
      if (location.pathname === "/sets/favorites") {
      }
    };
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/sets/favorites" && user) {
      handleFindSets(pageIndex);
    }
  }, [pageIndex]);

  const getFavoritedDeckCount = async () => {
    if (deckCount > 0) {
      return;
    }

    try {
      const coll = collection(db, "users", userID, "activity");

      // Adding a query to filter activities with isFavorited: true
      const q = query(coll, where("favorited", "==", true));

      const snapshot = await getCountFromServer(q);
      setDeckCount(snapshot.data().count); // Use snapshot.size to get the count
    } catch (e) {
      console.log(e);
    }
  };

  const handleFindSets = async (pageNum: number) => {
    let list: DocumentData = [];
    const setsRef = collection(db, "users", userID, "activity");
    let q = query(
      setsRef,
      where("favorited", "==", true),
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
            {isLoading ? null : (
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

export default SetsFavorites;

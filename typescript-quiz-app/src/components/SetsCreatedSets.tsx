import { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  limit,
  query,
  orderBy,
  getCountFromServer,
  startAfter,
  DocumentData,
  endBefore,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import SetCard from "./SetCard";
import { Button, ButtonGroup } from "@nextui-org/react";

const SetsCreatedSets = () => {
  const [deckCount, setDeckCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deckList, setDeckList] = useState<DocumentData | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [lastDeck, setLastDeck] = useState<DocumentData | null>(null);

  const userID = auth.currentUser?.uid ?? "Error";

  useEffect(() => {
    handleFindSets(0);
    getDeckCount();
  }, []);

  const getDeckCount = async () => {
    try {
      const coll = collection(db, "users", userID, "decks");
      const snapshot = await getCountFromServer(coll);
      setDeckCount(snapshot.data().count);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFindSets = async (whichWay: number) => {
    // -1 go back one, 0 initialize, 1 next page
    // find your sets
    let list: DocumentData = [];
    const setsRef = collection(db, "users", userID, "decks");
    let q = query(setsRef, orderBy("created", "desc"), limit(5));

    if (whichWay === -1) {
      q = query(
        setsRef,
        orderBy("created", "desc"),
        limit(5),
        endBefore(lastDeck)
      );
      setPageIndex(pageIndex - 1);
    } else if (whichWay === 0) {
      q = query(setsRef, orderBy("created", "desc"), limit(5));
    } else if (whichWay === 1) {
      q = query(
        setsRef,
        orderBy("created", "desc"),
        limit(5),
        startAfter(lastDeck)
      );
      setPageIndex(pageIndex + 1);
    }

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setLastDeck(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }

    console.log(list);

    setDeckList(list);
    setIsLoading(false);
  };

  return (
    <div className="space-y-3">
      <div className="bg-gray-100 text-black dark:text-gray-100 min-h-screen dark:bg-dark-2 pt-6">
        <div className="flex justify-center">
          <div className="max-w-[800px] flex-grow space-y-4 px-4">
            {deckList !== null
              ? deckList
                  // .slice(recentsIndex * 5, recentsIndex * 5 + 5)
                  .map((deck: DocumentData, index: number) => (
                    <SetCard key={index} deckId={deck.id} />
                  ))
              : null}
            {isLoading ? null : (
              <div className="flex justify-center py-4">
                <ButtonGroup>
                  <Button
                    isDisabled={pageIndex === 0 ? true : false}
                    onClick={() => handleFindSets(-1)}
                  >
                    Previous
                  </Button>
                  <Button
                    isDisabled={(pageIndex + 1) * 5 >= deckCount}
                    onClick={() => handleFindSets(1)}
                  >
                    Next
                  </Button>
                </ButtonGroup>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetsCreatedSets;

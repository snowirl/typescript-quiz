import SetsCreateFolder from "./SetsCreateFolder";
import SetsFolderItem from "./SetsFolderItem";
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
import { useUserContext } from "../context/userContext";

const SetsFolders = () => {
  const [folderCount, setFolderCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [folderList, setFolderList] = useState<DocumentData | null>(null);
  const [folderIDs, setFolderIDs] = useState<DocumentData | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [lastFolder, setLastFolder] = useState<DocumentData | null>(null);
  const userID = auth.currentUser?.uid ?? "Error";
  const { user } = useUserContext();

  useEffect(() => {
    if (user === null) {
      return;
    }
    handleFindFolders(0);
    // getDeckCount();
  }, [user]);

  const handleFindFolders = async (whichWay: number) => {
    // -1 go back one, 0 initialize, 1 next page
    // find your sets
    let list: DocumentData = [];
    let idList: DocumentData = [];
    const setsRef = collection(db, "users", userID, "folders");
    let q = query(setsRef, orderBy("name", "desc"), limit(10));

    if (whichWay === -1) {
      q = query(
        setsRef,
        orderBy("name", "desc"),
        limit(10),
        endBefore(lastFolder)
      );
      setPageIndex(pageIndex - 1);
    } else if (whichWay === 0) {
      q = query(setsRef, limit(10));
    } else if (whichWay === 1) {
      q = query(
        setsRef,
        orderBy("name", "desc"),
        limit(10),
        startAfter(lastFolder)
      );
      setPageIndex(pageIndex + 1);
    }

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
        idList.push(doc.id);
      });
      setLastFolder(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }

    console.log(list);
    console.log(userID);

    setFolderList(list);
    setFolderIDs(idList);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 min-h-screen dark:bg-dark-2 pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <div className="mx-2 my-2 grid sm:grid-cols-2 grid-cols-1 md:grid-cols-3 items-center">
            {folderList !== null
              ? folderList
                  // .slice(recentsIndex * 5, recentsIndex * 5 + 5)
                  .map((folder: DocumentData, index: number) => (
                    <SetsFolderItem
                      folderName={folder.folderName}
                      folderColor={folder.folderColor}
                      key={index}
                      folderID={folderIDs !== null ? folderIDs[index] : "Error"}
                    />
                  ))
              : null}
            <div>
              <SetsCreateFolder />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetsFolders;

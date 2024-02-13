import SetsCreateFolder from "./SetsCreateFolder";
import SetsFolderItem from "./SetsFolderItem";
import { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  limit,
  query,
  DocumentData,
  getCountFromServer,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { useUserContext } from "../context/userContext";
import SetsFolderContents from "./SetsFolderContents";
import { Button, Pagination, Spinner } from "@nextui-org/react";
import { IoIosArrowRoundBack } from "react-icons/io";

const SetsFolders = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [folderList, setFolderList] = useState<DocumentData | null>(null);
  const [folderIDs, setFolderIDs] = useState<DocumentData>([]);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const userID = auth.currentUser?.uid ?? null;
  const { user } = useUserContext();
  const [folderCount, setFolderCount] = useState<number>(0);
  const displayPerPage = 6;

  useEffect(() => {
    if (user === null) {
      setIsLoading(false);
      return;
    }
    // handleFindFolders(0);
    getFolderCount();
  }, [user]);

  useEffect(() => {
    if (folderCount > 0) {
      handleFindFolders(pageIndex);
    }
  }, [pageIndex]);

  const refreshFolders = () => {
    setPageIndex(0);
    getFolderCount();
    // handleFindFolders(pageIndex);
  };

  const getFolderCount = async () => {
    if (userID === null) {
      return;
    }
    try {
      const coll = collection(db, "users", userID, "folders");
      const snapshot = await getCountFromServer(coll);
      setFolderCount(snapshot.data().count);
      if (snapshot.data().count === 0) {
        setIsLoading(false);
        setFolderList(null);
      } else {
        handleFindFolders(pageIndex);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleFindFolders = async (pageNum: number) => {
    if (user === null || userID === null) {
      return;
    }

    let list: DocumentData = [];
    let idList: DocumentData = [];
    const setsRef = collection(db, "users", userID, "folders");
    let q = query(setsRef, limit(displayPerPage * (pageNum + 1)));

    if ((pageNum + 1) * displayPerPage - folderList?.length < pageNum) {
      return;
    }

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
        idList.push(doc.id);
      });
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }

    setFolderList(list);
    console.log(list);
    setFolderIDs(idList);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-100 text-black dark:text-gray-100 min-h-screen dark:bg-dark-2 pt-6">
      <div className="flex justify-center">
        <div className="max-w-[800px] flex-grow space-y-4 px-4">
          <div className="mx-4 flex justify-start pb-1">
            {selectedFolder === null ? (
              <SetsCreateFolder
                refreshFolders={refreshFolders}
                folderCount={folderCount}
              />
            ) : (
              <Button
                className="font-semibold"
                onClick={() => setSelectedFolder(null)}
              >
                <IoIosArrowRoundBack className="w-7 h-7" /> Back
              </Button>
            )}
          </div>
          {isLoading ? (
            <Spinner />
          ) : (
            <div className="relative">
              <div
                className={
                  selectedFolder === null
                    ? " mx-2 my-2 grid sm:grid-cols-2 grid-cols-1 md:grid-cols-2 items-start lg:gap-4 gap-3"
                    : "hidden"
                }
              >
                {folderList !== null && folderList.length > 0 ? (
                  folderList
                    .slice(
                      pageIndex * displayPerPage,
                      (pageIndex + 1) * displayPerPage
                    )
                    // .slice(recentsIndex * 5, recentsIndex * 5 + 5)
                    .map((folder: DocumentData, index: number) => (
                      <SetsFolderItem
                        folderName={folder.folderName}
                        folderColor={folder.folderColor}
                        key={index}
                        folderID={
                          folderIDs !== null
                            ? folderIDs[index + pageIndex * displayPerPage]
                            : "Error"
                        }
                        sets={folder.sets}
                        setSelectedFolder={setSelectedFolder}
                        index={index + 1}
                        refreshFolders={refreshFolders}
                        pageIndex={pageIndex}
                      />
                    ))
                ) : (
                  <div className="w-full flex text-left">
                    <p className="font-semibold text-black/50 dark:text-white/70 pl-2">
                      No folders found
                    </p>
                  </div>
                )}
              </div>
              <div className={selectedFolder === null ? "hidden" : "block"}>
                {folderList === null ? (
                  <div></div>
                ) : (
                  <SetsFolderContents folderId={selectedFolder} />
                )}
              </div>
              {isLoading ||
              selectedFolder !== null ||
              Math.ceil(folderCount / displayPerPage) < 1 ? null : (
                <div className="flex justify-center py-8">
                  <Pagination
                    size="lg"
                    total={Math.max(1, Math.ceil(folderCount / displayPerPage))}
                    initialPage={pageIndex + 1}
                    variant="faded"
                    onChange={(num: number) => setPageIndex(num - 1)}
                    page={pageIndex + 1}
                    className={
                      Math.ceil(folderCount / displayPerPage) > 1
                        ? "block"
                        : "hidden"
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SetsFolders;

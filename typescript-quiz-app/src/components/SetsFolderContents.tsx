import SetCard from "./SetCard";
import { FaFolder } from "react-icons/fa6";
import {
  DocumentData,
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { auth, db } from "../firebase";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner, Pagination, Button } from "@nextui-org/react";

interface SetsFoldersContentsProps {
  folderId: string | null;
}

const SetsFolderContents = (props: SetsFoldersContentsProps) => {
  const userId = auth.currentUser?.uid ?? null;

  const [folderData, setFolderData] = useState<DocumentData | null>();
  const [isLoading, setIsLoading] = useState(true);

  const [setCount, setSetCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const displayPerPage = 3;

  const startIndex = pageIndex * displayPerPage;
  const endIndex = startIndex + displayPerPage;
  const displayedSets = folderData?.sets?.slice(startIndex, endIndex);

  useEffect(() => {
    console.log("hi");
    setPageIndex(0);
  }, []);

  useEffect(() => {
    // This function will be invoked when the component is mounted
    console.log("Component mounted");

    // Cleanup function to be invoked when the component is unmounted
    return () => {
      console.log("Component unmounted");
      // Run your cleanup or additional actions here
    };
  }, []);

  useEffect(() => {
    if (props.folderId) {
      setIsLoading(true);
      handleFindFolder();
    } else {
      setIsLoading(true);
      setFolderData(null);
    }

    setPageIndex(0);
  }, [props.folderId]);

  const handleFindFolder = async () => {
    if (userId === null || props.folderId === null) {
      return;
    }

    try {
      const folderRef = doc(db, "users", userId, "folders", props.folderId);

      const docSnap = await getDoc(folderRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setFolderData(docSnap.data());
        setSetCount(docSnap.data().sets?.length ?? 0);
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Error finding folder");
    }

    setIsLoading(false);
  };

  const removeSetFromFolder = async (deckId: string) => {
    if (
      userId === null ||
      props.folderId === undefined ||
      props.folderId === null
    ) {
      console.log("User is null. Cannot find folders.");
      return;
    }

    try {
      await updateDoc(
        doc(db, "users", userId, "folders", props.folderId.toString()),
        {
          sets: arrayRemove(deckId),
        }
      );
    } catch (e) {
      console.log(e);
      toast.error("Error removing set");
      return;
    }

    // props.handleFindFolders(0);

    toast.dismiss();

    toast(
      <div className="flex text-base p-0 m-0 items-center justify-between w-full dark:bg-dark-1 dark:text-white">
        <div className="w-full flex justify-start">
          <p className="font-semibold">Removed set</p>
        </div>
        <div className="w-full flex justify-end">
          <Button
            color="primary"
            className="font-bold h-9 w-9"
            onClick={() => undoSetToFolder(deckId)}
          >
            Undo
          </Button>
        </div>
      </div>,
      { duration: 10000 }
    );
    setPageIndex(0);

    handleFindFolder();
  };

  const undoSetToFolder = async (deckId: string) => {
    if (
      userId === null ||
      props.folderId === undefined ||
      props.folderId === null
    ) {
      console.log("User is null. Cannot find folders.");
      return;
    }

    try {
      await updateDoc(
        doc(db, "users", userId, "folders", props.folderId.toString()),
        {
          sets: arrayUnion(deckId),
        }
      );
    } catch (e) {
      console.log(e);
      toast.error("Error");
      return;
    }

    toast.dismiss();
    toast.success("Change undone");
    setPageIndex(0);
    handleFindFolder();
  };

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="space-y-4 my-6 mx-4 text-left">
          <div className="flex space-x-2 items-center">
            <FaFolder
              className={`h-5 w-5 text-${folderData?.folderColor}-500`}
            />
            <p>{folderData?.folderName}</p>
          </div>
          {displayedSets?.map((id: string, index: number) => (
            <SetCard
              key={index}
              deckId={id}
              removeSetFromFolder={removeSetFromFolder}
              folderId={props.folderId}
            ></SetCard>
          ))}
          {folderData && !isLoading ? (
            folderData?.sets?.length === 0 || folderData?.sets === undefined ? (
              <p className="text-2xl text-center font-semibold dark:text-white/40 text-black/40 py-6">
                No study sets found in this folder
              </p>
            ) : null
          ) : null}

          <div className="flex justify-center py-4">
            {isLoading || Math.ceil(setCount / displayPerPage) < 2 ? null : (
              <Pagination
                page={pageIndex + 1}
                size="lg"
                total={Math.max(1, Math.ceil(setCount / displayPerPage))}
                initialPage={pageIndex + 1}
                variant="faded"
                onChange={(num: number) => setPageIndex(num - 1)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SetsFolderContents;

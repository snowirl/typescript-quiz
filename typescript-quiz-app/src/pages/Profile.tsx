import { Card, Avatar, Spinner, Divider } from "@nextui-org/react";
import { db } from "../firebase";
import SetCard from "../components/SetCard";
import { Pagination } from "@nextui-org/react";
import {
  DocumentData,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  getCountFromServer,
  where,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getStorage, getDownloadURL, ref } from "firebase/storage";
import { auth } from "../firebase";

const Profile = () => {
  const [deckCount, setDeckCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [deckList, setDeckList] = useState<DocumentData | null>(null);
  const [pageIndex, setPageIndex] = useState<number>(0);
  const displayPerPage = 3;
  const { id } = useParams();
  const [profilePictureURL, setProfilePictureURL] = useState("");
  const [_isPicLoading, setIsPicLoading] = useState(true);

  // useEffect(() => {
  //   if (id !== undefined) {
  //     getImageByUserId(id);
  //     handleFindSets(0);
  //     getDeckCount();
  //   }
  // }, [id]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log("Signed in.");
      } else {
        console.log("Nope in.");
      }

      if (id !== undefined) {
        getImageByUserId(id);
        handleFindSets(0);
        getDeckCount();
      }
    });

    return () => unsubscribe(); // Cleanup the subscription when the component unmounts
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      handleFindSets(pageIndex);
    }
  }, [pageIndex]);

  const getDeckCount = async () => {
    if (deckCount > 0 || id === undefined) {
      return;
    }

    try {
      const coll = collection(db, "users", id, "decks");
      const snapshot = await getCountFromServer(coll);
      setDeckCount(snapshot.data().count);
    } catch (e) {
      console.log(e);
    }
  };

  const handleFindSets = async (pageNum: number) => {
    if (id === undefined) {
      return;
    }

    let list: DocumentData = [];
    const setsRef = collection(db, "users", id, "decks");

    let q = query(
      setsRef,
      orderBy("created", "desc"),
      where("private", "==", false),
      limit(5 * (pageNum + 1))
    );

    if (auth.currentUser?.displayName === id) {
      q = query(setsRef, orderBy("created", "desc"), limit(5 * (pageNum + 1)));
    }

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
    console.log(list);
  };

  const getImageByUserId = async (userId: string) => {
    const storage = getStorage();
    const jpgImagePath = `/profilePictures/${userId}`;
    const pngImagePath = `profilePictures/${userId}`;

    try {
      // Check if the image is a JPG
      const jpgDownloadUrl = await getDownloadURL(ref(storage, jpgImagePath));

      if (jpgDownloadUrl) {
        setProfilePictureURL(jpgDownloadUrl);
        setIsPicLoading(false);
      }
    } catch (error) {
      //   console.log("error here....");
      // If JPG fetch fails, check if the image is a PNG
      try {
        const pngDownloadUrl = await getDownloadURL(ref(storage, pngImagePath));

        if (pngDownloadUrl) {
          setProfilePictureURL(pngDownloadUrl);
          setIsPicLoading(false);
        }
      } catch (error) {
        // Handle the case when no image is found for the given user ID
        // console.log("error here....");
        setIsPicLoading(false);
        return null;
      }

      setIsPicLoading(false);
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 text-black dark:text-gray-100 dark:bg-dark-2 min-h-screen pt-6">
      <div className="w-full max-w-[800px] mx-6 text-left space-y-4">
        <Card className="w-full bg-black/0 shadow-none">
          <div className="justify-start text-left space-y-4 items-center pb-10">
            <div className="space-y-2 flex items-center space-x-2">
              <Avatar src={profilePictureURL ?? ""} size="lg" />
              <p className="text-xl font-semibold">{id}</p>
            </div>
            <div>{/* <p className="text-base">Here is my bio...</p> */}</div>
          </div>
        </Card>
        <div className="space-y-2">
          {id === auth.currentUser?.displayName ? (
            <p className="font-semibold text-base">Your Sets</p>
          ) : (
            <p className="font-semibold text-base">Public Sets</p>
          )}

          <Divider orientation="horizontal" />
        </div>

        {!isLoading ? (
          deckList !== null ? (
            deckList
              .slice(
                pageIndex * displayPerPage,
                (pageIndex + 1) * displayPerPage
              )
              .map((deck: DocumentData, index: number) => (
                <SetCard key={index} deckId={deck.id} />
              ))
          ) : null
        ) : (
          <Spinner />
        )}
        <div className=" w-full flex justify-center pt-6 py-8">
          <Pagination
            size="lg"
            total={Math.max(1, Math.ceil(deckCount / displayPerPage))}
            initialPage={1}
            variant="faded"
            onChange={(num: number) => setPageIndex(num - 1)}
            className={deckCount / displayPerPage <= 1 ? "hidden" : "block"}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;

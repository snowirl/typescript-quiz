import SetsCreatedSets from "../components/SetsCreatedSets";
import SetsRecentSets from "../components/SetsRecentSets";
import SetsFolders from "../components/SetsFolders";
import SetsFavorites from "../components/SetsFavorites";
import SetsPage from "../components/SetsPage";
import { Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

const Sets = () => {
  return (
    <>
      <Toaster
        position={"top-center"}
        reverseOrder={true}
        toastOptions={{
          className:
            "dark:bg-dark-1 dark:text-white px-3 py-2 text-sm font-semibold shadow- outline outline-1 outline-black/20  rounded-xl",
        }}
      />
      <SetsPage />
      <Routes>
        <Route index path="recents" element={<SetsRecentSets />} />
        <Route path="favorites" element={<SetsFavorites />} />
        <Route path="created" element={<SetsCreatedSets />} />
        <Route path="folders" element={<SetsFolders />} />
      </Routes>
      <Outlet />
    </>
  );
};

export default Sets;

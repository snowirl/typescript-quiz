import SetsCreatedSets from "../components/SetsCreatedSets";
import SetsRecentSets from "../components/SetsRecentSets";
import SetsFolders from "../components/SetsFolders";
import SetsFavorites from "../components/SetsFavorites";
import SetsPage from "../components/SetsPage";
import { Routes, Route, Outlet } from "react-router-dom";

const Sets = () => {
  return (
    <>
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

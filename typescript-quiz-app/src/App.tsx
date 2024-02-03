import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Study from "./pages/Study";
import Create from "./pages/Create";
import Sets from "./pages/Sets";
import NoPage from "./pages/NoPage";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Game from "./pages/Game";
import Test from "./pages/Test";
import Search from "./pages/Search";
import Legal from "./pages/Legal";
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        toastOptions={{
          className:
            "text-base border-none dark:bg-dark-1 dark:shadow-lg dark:shadow-white/5",
          classNames: {
            error: "dark:text-rose-300 dark:bg-rose-900 bg-white text-rose-500",
            success:
              "dark:text-green-400 dark:bg-green-900 bg-white text-green-600",
            warning: "text-yellow-400",
            info: "bg-blue-400",
          },
        }}
        richColors
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/study/:id" element={<Study />} />
          <Route path="/learn/:id" element={<Quiz />} />
          <Route path="/test/:id" element={<Test />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/sets/*" element={<Sets />} />
          <Route path="/create/:id" element={<Create />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/search/*" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

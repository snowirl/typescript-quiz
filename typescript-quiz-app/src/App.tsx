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
import Game from "./pages/Game";
import Test from "./pages/Test";
import Search from "./pages/Search";
import Legal from "./pages/Legal";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ScrollToTop from "./components/ScrollToTop";
import Forgot from "./pages/Forgot";
import Quiz from "./pages/Quiz";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        toastOptions={{
          className:
            "description text-base shadow-sm border-black/10 dark:bg-dark-1 bg-white dark:border-white/20 rounded-xl",
          classNames: {
            error: "dark:text-rose-300 dark:bg-rose-900 bg-white text-rose-500",
            success:
              "dark:text-green-400 dark:bg-green-900 bg-white text-green-600",
            warning:
              "text-yellow-600 dark:text-yellow-200 bg-yellow-50 dark:bg-yellow-700",
            info: "bg-blue-400",
          },
        }}
        richColors
      />
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot" element={<Forgot />} />
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

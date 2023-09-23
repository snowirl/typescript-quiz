import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./assets/pages/Layout";
import Home from "./assets/pages/Home";
import Study from "./assets/pages/Study";
import Create from "./assets/pages/Create";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/study" element={<Study />} />
          <Route path="/create" element={<Create />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

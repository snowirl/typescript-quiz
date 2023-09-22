import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./assets/pages/Layout";
import Home from "./assets/pages/Home";
import Study from "./assets/pages/Study";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/study" element={<Study />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

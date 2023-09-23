import { Outlet } from "react-router-dom";
import NavigationMenu from "../components/NavigationMenu";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <>
      <NavigationMenu />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;

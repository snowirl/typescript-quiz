import { Outlet } from "react-router-dom";
import NavigationMenu from "../components/NavigationMenu";

const Layout = () => {
  return (
    <>
      <NavigationMenu />
      <Outlet />
    </>
  );
};

export default Layout;

import { Outlet } from "react-router-dom";
import { NavBar } from "../components/NavBar";
import "../style/pages/Layout.css";

export function Layout() {
  return (
    <div className="layout">
      <NavBar />
      <Outlet />
    </div>
  );
}

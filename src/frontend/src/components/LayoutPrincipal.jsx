import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function LayoutPrincipal() {
  return (
    <div className="min-h-screen flex bg-pink-100">
      {/* Sidebar direto, sem <div> em volta, para acompanhar a altura da página */}
      <Sidebar />

      <main className="flex-1 min-w-0 p-4 sm:p-6 pt-20 md:pt-6">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutPrincipal;
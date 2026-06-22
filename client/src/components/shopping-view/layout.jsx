import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "../common/footer";

function ShoppingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white overflow-hidden">
      {/* common header */}
      <ShoppingHeader />
      <main className="flex flex-1 flex-col w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ShoppingLayout;

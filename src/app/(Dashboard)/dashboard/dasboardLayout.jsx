"use client";

import Footer from "@/Component/Shared/Footer/Footer";
import Navbar from "@/Component/Shared/Navbar/Navbar";
import { usePathname } from "next/navigation";


export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  const hideNavbar = pathname.startsWith("/dashboard");

  return (
    <>
      {!hideNavbar && (
        <header>
          <Navbar />
        </header>
      )}

      <main>{children}</main>


      {!hideNavbar && (
        <footer>
          <Footer />
        </footer>
      )}
    </>
  );
}
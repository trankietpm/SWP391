"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/sign-in" ||
    pathname === "/sign-up" ||
    pathname === "/admin" ||
    pathname === "/admin/stations" ||
    pathname === "/admin/vehicles" ||
    pathname === "/admin/staff" ||
    pathname === "/admin/users"||
    pathname === "/admin/bookings";
  
  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
      {!isAuthPage && <Footer />}
    </>
  );
};

export default ConditionalLayout;

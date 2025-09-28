import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
  title: "EVS Rent - Dịch vụ cho thuê xe máy điện và ô tô điện",
  description: "Dịch vụ cho thuê xe máy điện và ô tô điện hàng đầu Việt Nam. Cam kết mang đến trải nghiệm di chuyển xanh, tiết kiệm và thân thiện với môi trường.",
  icons: {
    icon: '/images/logo.png'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ConditionalLayout from "@/components/ConditionalLayout/ConditionalLayout";

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
        <ConditionalLayout>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConditionalLayout>
      </body>
    </html>
  );
}
import { Inter, Poppins, Roboto, Geist_Mono } from "next/font/google";
import "./globals.css";
import PublicNavbar from "./components/PublicNavbar";


const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-poppins",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-roboto",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "World Culture Marketplace",
  description: "Discover and explore global cultural products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${roboto.variable} ${geistMono.variable} antialiased`}
      >
        <PublicNavbar/>
        {children}
      </body>
    </html>
  );
}

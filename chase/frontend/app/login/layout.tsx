import "@/app/globals.scss";
import { Inter } from "next/font/google";
import Image from "next/image";

//TODO check the possibility of a route guard for logged in state

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chase | Login",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <div className="flex justify-stretch h-screen bg-gray-light">
          <div className="flex-1 flex justify-center">
            <div className="flex-1 flex flex-col justify-stretch items-center rounded-2xl shadow-md m-10 max-w-lg bg-white">
              {children}
            </div>
          </div>
          <div className="flex-1 overflow-hidden h-screen">
            <Image
              src="/stock/stock1.jpg"
              alt="Stock Image"
              width={1920}
              height={1080}
              style={{ objectFit: "cover", height: "100%" }}
            />
          </div>
        </div>
      </body>
    </html>
  );
}

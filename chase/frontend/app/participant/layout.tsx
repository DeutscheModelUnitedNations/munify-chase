import "@/app/globals.scss";
import { Inter } from "next/font/google";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <div className="flex h-screen w-screen bg-gray-light">
          <div className="m-5 rounded-3xl bg-white flex shadow-md w-full overflow-hidden">
            <div className="flex-1 flex">
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

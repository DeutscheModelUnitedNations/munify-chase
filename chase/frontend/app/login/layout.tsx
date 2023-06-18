import Image from "next/image";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}

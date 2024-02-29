"use client";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <div className="flex-1 flex flex-col justify-center items-center m-10">
        {children}
      </div>
    </div>
  );
}

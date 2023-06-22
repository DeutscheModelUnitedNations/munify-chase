import Navbar from "@/components/navbar/navbar";

export default function Participant_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-white shadow-md overflow-hidden">
      <Navbar />
      {children}
    </div>
  );
}

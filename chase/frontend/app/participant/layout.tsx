import Navbar from "@/components/navbar/navbar";

export default function Participant_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-gray-light">
      <div className="m-3 rounded-3xl bg-white flex shadow-md w-full overflow-hidden">
        <div className="flex-1 flex">
          <Navbar />
          {children}
        </div>
      </div>
    </div>
  );
}

import Navbar from "@/components/navbar/navbar";
import NavButton from "@/components/navbar/button";
import { faComment, faHouse, faScroll, faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";

export default function Participant_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-white shadow-md overflow-hidden">
      <Navbar>
        <NavButton icon={faHouse} link={"/participant/dashboard"} />
        <NavButton icon={faComment} link={"/participant/speakers"} />
        <NavButton icon={faSquarePollVertical} link={"/participant/voting"} />
        <NavButton icon={faScroll} link={"/participant/resolutions"} />
      </Navbar>
      {children}
    </div>
  );
}

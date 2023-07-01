import Navbar from "@/components/navbar/navbar";
import NavButton from "@/components/navbar/button";
import { faChalkboard, faComment, faHouse, faScroll, faSquarePollVertical, faUsersLine } from "@fortawesome/free-solid-svg-icons";

export default function Participant_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen bg-white text-primary-100 dark:bg-primary-100 dark:text-primary-900 shadow-md overflow-hidden">
      <Navbar>
        <NavButton icon={faHouse} link={"/chair/dashboard"} />
        <NavButton icon={faUsersLine} link={"/chair/attendees"} />
        <NavButton icon={faComment} link={"/chair/speakers"} />
        <NavButton icon={faSquarePollVertical} link={"/chair/voting"} />
        <NavButton icon={faChalkboard} link={"/chair/whiteboard"} />
        <NavButton icon={faScroll} link={"/chair/resolutions"} />
      </Navbar>
      {children}
    </div>
  );
}

import Navbar from "@/components/navbar/navbar";
import NavButton from "@/components/navbar/button";
import { faComment, faHouse, faScroll, faSquarePollVertical } from "@fortawesome/free-solid-svg-icons";

export default function Participant_Pages_Layout({
  children,
}: {
  children: React.ReactNode;
}) {

  // const { LL } = useI18nContext(); // TODO find a way to use this in the Navbar component (Layout.tsx)

  return (
    <div className="flex h-screen w-screen bg-white text-primary-100 dark:bg-primary-100 dark:text-primary-900 shadow-md overflow-hidden">
      <Navbar>
        <NavButton icon={faHouse} link={"/participant/dashboard"} title="Home" />
        <NavButton icon={faComment} link={"/participant/speakers"} title="Redeliste" />
        <NavButton icon={faSquarePollVertical} link={"/participant/voting"} title="Abstimmungen" />
        <NavButton icon={faScroll} link={"/participant/resolutions"} title="Resolutionen" />
      </Navbar>
      {children}
    </div>
  );
}

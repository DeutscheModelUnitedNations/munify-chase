import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export default function SmallInfoCard({
  icon,
  color,
  children,
}: {
  icon: IconProp;
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full flex gap-1">
      <div
        className={`w-20 h-16 ${
          color ?? "bg-primary-900 text-primary-500"
        } rounded-l-lg flex justify-center items-center`}
      >
        <FontAwesomeIcon icon={icon} className="text-2xl" />
      </div>
      <div className="w-full h-16 bg-primary-900 rounded-r-lg flex items-center p-4 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

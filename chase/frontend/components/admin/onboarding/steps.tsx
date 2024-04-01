import { useI18nContext } from "@/i18n/i18n-react";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faFlag,
  faGears,
  faMegaphone,
  faPodium,
  faTableTree,
  faUsers,
} from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { Steps } from "primereact/steps";

export default function OnboardingSteps({
  activeIndex,
}: {
  activeIndex: number;
}) {
  const { LL } = useI18nContext();
  const _router = useRouter();

  const items = [
    {
      template: ItemTemplate(
        faTableTree,
        LL.admin.onboarding.steps.STEP_1(),
        activeIndex,
        0,
      ),
    },
    {
      template: ItemTemplate(
        faUsers,
        LL.admin.onboarding.steps.STEP_2(),
        activeIndex,
        1,
      ),
    },
    {
      template: ItemTemplate(
        faPodium,
        LL.admin.onboarding.steps.STEP_3(),
        activeIndex,
        2,
      ),
    },
    {
      template: ItemTemplate(
        faFlag,
        LL.admin.onboarding.steps.STEP_4(),
        activeIndex,
        3,
      ),
    },
    {
      template: ItemTemplate(
        faMegaphone,
        LL.admin.onboarding.steps.STEP_5(),
        activeIndex,
        4,
      ),
    },
    {
      template: ItemTemplate(
        faGears,
        LL.admin.onboarding.steps.STEP_6(),
        activeIndex,
        5,
      ),
    },
  ];

  return (
    <Steps
      model={items}
      activeIndex={activeIndex}
      readOnly={false}
      className="w-full mb-8"
    />
  );
}

const ItemTemplate = (
  icon: IconProp,
  title: string,
  activeIndex: number,
  targetIndex: number,
) => {
  return (
    <div className="flex flex-col items-center z-50">
      <div
        className={`rounded-full ${
          activeIndex === targetIndex ? "bg-primary" : "bg-gray-200"
        } w-8 h-8 flex items-center justify-center mb-2`}
      >
        <FontAwesomeIcon
          icon={icon}
          className={`text-md ${
            activeIndex === targetIndex ? "text-white" : "text-black"
          } ${activeIndex < targetIndex && "opacity-20"}`}
        />
      </div>
      <div
        className={`text-sm ${
          activeIndex === targetIndex && "text-primary font-bold"
        }}`}
        style={{
          fontWeight: activeIndex === targetIndex ? "bold" : "normal",
        }}
      >
        {title}
      </div>
    </div>
  );
};

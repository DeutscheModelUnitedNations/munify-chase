import { Steps } from "primereact/steps";
import { useI18nContext } from "@/i18n/i18n-react";


export default function OnboardingSteps({ activeIndex }: { activeIndex: number }) {
  const { LL } = useI18nContext();

  const items = [
    {
      label: LL.admin.onboarding.steps.STEP_1(),
    },
    {
      label: LL.admin.onboarding.steps.STEP_2(),
    },
    {
      label: LL.admin.onboarding.steps.STEP_3(),
    },
    {
      label: LL.admin.onboarding.steps.STEP_4(),
    },
    {
      label: LL.admin.onboarding.steps.STEP_5(),
    },
  ];

  return <Steps model={items} activeIndex={activeIndex} className="w-full mb-8" />;
}

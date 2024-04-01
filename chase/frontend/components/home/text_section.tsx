import React from "react";
import Button from "../button";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { useRouter } from "next/navigation";

type TextSectionProps = {
  title: string;
  text: string;
  button?: {
    lable: string;
    link: string;
    faIcon?: IconDefinition;
  };
};

export default function TextSection({ title, text, button }: TextSectionProps) {
  const Router = useRouter();

  return (
    <>
      <h1
        className="text-3xl lg:text-4xl font-bold text-center lg:text-right text-slate-900 leading-tight"
        style={{ fontFamily: "Vollkorn" }}
      >
        {title}
      </h1>
      <div className="pb-10 lg:pb-0">
        <p className="text-md lg:text-lg text-center lg:text-left text-slate-900 leading-normal">
          {text}
        </p>
        {button && (
          <div className="pt-4 flex justify-center lg:justify-start">
            <Button
              label={button.lable}
              onClick={() => {
                //TODO this is not ideal, we should use actual anchor tags for this
                Router.push(button.link);
              }}
              faIcon={button.faIcon}
              className="mt-4"
            />
          </div>
        )}
      </div>
    </>
  );
}

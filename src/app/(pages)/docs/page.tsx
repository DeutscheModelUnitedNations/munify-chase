"use client";
import Navbar from "@/app/components/home/navbar";
import Button from "@/app/components/button";
import { useRouter } from "next/navigation";
import { useI18nContext } from "@/app/i18n/i18n-react";
import MarkdownReader from "@/app/components/home/md_reader";

export default function Docs() {
  const Router = useRouter();
  const { LL } = useI18nContext();

  return (
    <>
      <Navbar isDocs />
      <div className="w-full flex flex-col justify-center items-center md:px-4">
        <div className="flex flex-col gap-10 bg-white md:rounded-xl p-10 max-w-[900px] w-full mb-10">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl font-bold font-serif">{LL.docs.TITLE()}</h1>
            <p className="text-lg mt-2 mb-8 text-center">
              {LL.docs.DESCRIPTION()}
            </p>
            <Button
              label={LL.docs.BACK_TO_HOME()}
              faIcon="arrow-left"
              onClick={() => {
                Router.push("/");
              }}
            />
          </div>
          <MarkdownReader filename="docs" />
        </div>
      </div>
    </>
  );
}

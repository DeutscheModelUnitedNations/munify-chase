import React from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import Image from "next/image";

type CardProps = {
  src: string;
  alt: string;
  header: string;
  text: string;
};

export default function Card({ src, alt, header, text }: CardProps) {
  const { LL } = useI18nContext();

  return (
    <>
      <Image
        src={src}
        alt={alt}
        width={400}
        height={400}
        className="mb-10 h-40"
      />
      <h2
        className="text-3xl text-center font-bold mb-4"
        style={{ fontFamily: "Vollkorn" }}
      >
        {header}
      </h2>
      <p className="text-md text-center">{text}</p>
    </>
  );
}

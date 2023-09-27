import React, { useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import Image from "next/image";

export default function LandingHero() {
  const { LL } = useI18nContext();

  const availableIllustrations = [
    "/undraw/the_world_is_mine.svg",
    "/undraw/world.svg",
    "/undraw/around_the_world.svg",
  ];

  const availableBlobs = [
    "/misc/blobs/blob_1.svg",
    "/misc/blobs/blob_2.svg",
    "/misc/blobs/blob_3.svg",
    "/misc/blobs/blob_4.svg",
    "/misc/blobs/blob_5.svg",
  ];

  const [illustration, _setIllustration] = useState(
    Math.floor(Math.random() * availableIllustrations.length),
  );
  const [blob, _setBlob] = useState(
    Math.floor(Math.random() * availableBlobs.length),
  );

  return (
    <>
      <div className="relative flex items-center justify-center pt-52 pb-40">
        <Illustration
          availableIllustrations={availableIllustrations}
          chosenIllustration={illustration}
        />
        <Blob availableBlobs={availableBlobs} chosenBlob={blob} />
        <div className="flex flex-col items-end z-20 w-1/2 ">
          <h1
            className="text-6xl font-bold text-right text-slate-900 mb-4 leading-tight"
            style={{ fontFamily: "Vollkorn" }}
          >
            {LL.home.CAPTION()}
          </h1>
          <h2 className="text-2xl text-right text-slate-900 leading-normal">
            {LL.home.HERO_TEXT()}
          </h2>
        </div>
      </div>
    </>
  );
}

interface IllustrationProps {
  availableIllustrations: string[];
  chosenIllustration: number;
}

const Illustration = ({
  availableIllustrations,
  chosenIllustration,
}: IllustrationProps) => {
  return (
    <>
      <Image
        src={availableIllustrations[chosenIllustration]}
        alt="Logo"
        width={500}
        height={128}
        className="z-10"
      />
    </>
  );
};

interface BlobProps {
  availableBlobs: string[];
  chosenBlob: number;
}

const Blob = ({ availableBlobs, chosenBlob }: BlobProps) => {
  return (
    <>
      <Image
        src={availableBlobs[chosenBlob]}
        alt="Logo"
        width={800}
        height={128}
        className="absolute top-0 left-0 z-0"
      />
    </>
  );
};

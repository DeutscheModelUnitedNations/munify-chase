"use client";
import React, { useEffect, useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/button";
import { useRouter } from "next/navigation";
import {
  faBook,
  faQuestionCircle,
  faRightToBracket,
} from "@fortawesome/pro-solid-svg-icons";
import { motion } from "framer-motion";

export default function Navbar({
  isDocs = false,
  isFAQ = false,
  animate = false,
}: {
  isDocs?: boolean;
  isFAQ?: boolean;
  animate?: boolean;
}) {
  const { LL } = useI18nContext();
  const router = useRouter();

  const [modificator, setModificator] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Adjust the value '100' based on when you want the fade effect to start
      const newOpacity = Math.min(window.scrollY / 150, 1);
      setModificator(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed w-full px-8 py-4 top-0 left-0 flex gap-4 mb-8 items-center justify-center z-30"
        style={{
          backgroundColor: `rgba(255, 255, 255, ${modificator})`,
          boxShadow: `0 0 ${modificator * 20}px rgba(0, 0, 0, ${
            modificator / 6
          })`,
        }}
        initial={{ opacity: 0.5, y: -150 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          animate
            ? {
                duration: 2,
                delay: 2,
                type: "spring",
                damping: 20,
                stiffness: 70,
              }
            : {
                duration: 0,
                delay: 0,
              }
        }
      >
        <Link href="/">
          <Image
            src="/logo/png/chase_logo_blue.png"
            alt="Logo"
            width={110}
            height={110}
            className="absolute top-5 left-5 z-40"
          />
          <div className="ml-32 font-thin text-5xl">CHASE</div>
        </Link>
        <div className="flex-1" />
        <div className="flex gap-2">
          <Button
            label={LL.home.navbar.LOGIN_ADMIN()}
            onClick={() => router.push("/app/admin/new")}
            text
          />
          <Button
            label={LL.home.navbar.LOGIN_CHAIR()}
            onClick={() => router.push("/app/chair/dashboard")}
            text
          />
          <Button
            label={LL.home.navbar.LOGIN_PARTICIPANT()}
            onClick={() => router.push("/app/participant/dashboard")}
            text
          />
          <Button
            label={LL.home.navbar.DOCUMENTATION()}
            onClick={() => router.push("/pages/docs")}
            severity="secondary"
            faIcon={faBook}
            disabled={isDocs}
          />
          <Button
            label={LL.home.navbar.FAQ()}
            onClick={() => router.push("/pages/faq")}
            severity="secondary"
            faIcon={faQuestionCircle}
            disabled={isFAQ}
          />
          <Button
            label={LL.home.navbar.LOGIN_PARTICIPANT()}
            onClick={() => router.push("/pages/login")}
            faIcon={faRightToBracket}
          />
        </div>
      </motion.div>
    </>
  );
}

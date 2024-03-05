import React, { useState, useEffect } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import Markdown from "markdown-to-jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/pro-solid-svg-icons";
import styles from "./md_reader.module.css";
import { useToast } from "@/contexts/toast";

export default function MarkdownReader({ filename }: { filename: string }) {
  const { locale } = useI18nContext();
  const { toastError } = useToast();

  const [content, setContent] = useState<string>("");

  async function fetchContent() {
    await fetch(`/content/${filename}.md`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch content");
        }
        const data = await res.text();
        setContent(data);
      })
      .catch((err) => {
        toastError(err);
      });
  }

  useEffect(() => {
    fetchContent();
  }, [locale]);

  return (
    <>
      <div className="w-full flex flex-col items-center">
        {content === "" ? (
          <FontAwesomeIcon
            icon={faCircleNotch}
            size="3x"
            spin
            className="text-primary"
          />
        ) : (
          <Markdown className={styles.container}>{content}</Markdown>
        )}
      </div>
    </>
  );
}

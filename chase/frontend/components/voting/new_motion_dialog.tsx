import React, { useContext, useEffect, useState } from "react";
import { useI18nContext } from "@/i18n/i18n-react";
import { ToastContext } from "@/contexts/messages/toast";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { MotionTemplate } from "@/custom_types";
import { motionTemplates } from "@/motion_templates_de";
import Fuse from "fuse.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/components/button";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

interface NewMotionDialogProps {
  closeOverlay: () => void;
}

export default function NewMotionDialog({
  closeOverlay,
}: NewMotionDialogProps) {
  const { LL } = useI18nContext();
  const { showToast } = useContext(ToastContext);

  const [motionData, setMotionData] = useState<MotionTemplate[]>(motionTemplates);
  const [query, setQuery] = useState<string>("");
  const [filteredMotions, setFilteredMotions] = useState<MotionTemplate[]>([]);
  const [selectedMotion, setSelectedMotion] = useState<MotionTemplate | null>(
    null
  );
  const [fuse, setFuse] = useState<Fuse<MotionTemplate> | null>(null);

  useEffect(() => {
    const options = {
      keys: ["title"],
      includeScore: true,
    };
    setFuse(new Fuse(motionData, options));
  }, [motionData]);

  useEffect(() => {
    if (selectedMotion) {
      setQuery(selectedMotion.title);
    }
  }, [selectedMotion]);

  useEffect(() => {
    if (query === "") {
      setSelectedMotion(null);
    } else {
      const motion = motionData?.find((motion) => motion.title === query);
      if (motion) {
        setSelectedMotion(motion);
      }
    }
  }, [query]);

  const searchMotion = (event: AutoCompleteCompleteEvent) => {
    if (!fuse) return;

    let filteredMotions;
    if (!event.query.trim().length) {
      filteredMotions = motionData;
    } else {
      const results = fuse.search(event.query);
      filteredMotions = results.map((result) => result.item);
    }
    setFilteredMotions(filteredMotions);
  };

  const motionVisualTemplate = (item: MotionTemplate) => {
    return (
      <div className="flex items-center">
        <div className="">{item.title}</div>
      </div>
    );
  };

  const AddMotion = () => {
    if (selectedMotion) {
      showToast({
        severity: "success",
        summary: "Success", // TODO i18n
        detail: "Motion added", // TODO i18n
        sticky: false,
      });
      setSelectedMotion(null);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 mt-1">
        <AutoComplete
          value={selectedMotion}
          suggestions={filteredMotions}
          completeMethod={searchMotion}
          field={"title"}
          onChange={(e) => setSelectedMotion(e.value)}
          dropdown
          dropdownMode="blank"
          itemTemplate={motionVisualTemplate}
          placeholder={"Search for a motion"} // TODO i18n
          autoFocus
          autoHighlight
          forceSelection
          onKeyDown={(e) => {
            // This enables the user to press enter after selecting a country. It has the same effect as clicking the "Add" button.
            if (e.key === "Enter" && selectedMotion?.title) {
              AddMotion();
            }
          }}
        />
        <div className="flex gap-3 justify-end flex-wrap">
          <Button
            label={LL.chairs.speakersList.addSpeakerOverlay.BUTTON_CANCEL()}
            icon={<FontAwesomeIcon icon={faTimes} className="mr-2" />}
            onClick={closeOverlay}
            severity="danger"
            text
          />
          <Button
            label={LL.chairs.speakersList.addSpeakerOverlay.BUTTON_ADD_AND_CLOSE()}
            icon={<FontAwesomeIcon icon={faPlus} className="mr-2" />}
            onClick={() => {
              AddMotion();
              closeOverlay();
            }}
            text
          />
        </div>
      </div>
    </>
  );
}

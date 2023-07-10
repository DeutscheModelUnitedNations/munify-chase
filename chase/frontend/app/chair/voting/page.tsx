"use client";
import React, { useState } from "react";
import Motions from "@/components/voting/motions";
import VotingArea from "@/components/voting/voting";
import { useI18nContext } from "@/i18n/i18n-react";
import { motionTestData } from "@/test_data";
import { Motion } from "@/custom_types";
import { TabMenu } from "primereact/tabmenu";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileContract,
  faFileLines,
  faGavel,
  faHistory,
  faListOl,
  faSquarePollVertical,
} from "@fortawesome/free-solid-svg-icons";
import { SplitButton } from "primereact/splitbutton";
import { Dialog } from "primereact/dialog";
import NewMotionDialog from "@/components/voting/new_motion_dialog";
import { ToastProvider } from "@/contexts/messages/toast";

type Tabs = "current-motions" | "recent-motions" | "recent-votings";

export default function ChairVoting() {
  const { LL } = useI18nContext();

  const [openTab, setOpenTab] = useState<Tabs>("current-motions");
  const [data, setData] = useState<Motion[]>(motionTestData);
  const [activeMotionId, setActiveMotionId] = useState<string | undefined>(
    data[0].motionId,
  );

  const [newMotionDialogVisible, setNewMotionDialogVisible] = useState(false);

  // TODO: Add dialog for creating a new motion
  // TODO: Add dialog for creating a new voting out of a motion
  // TODO: Add dialog for changing the information of a voting

  return (
    <>
      <ToastProvider>
        <div className="flex-1 p-4 gap-4 flex-col justify-start">
          <div className="flex-1">
            <TabMenu
              model={[
                {
                  label: LL.participants.voting.ACTIVE_MOTIONS_TAB(),
                  icon: <FontAwesomeIcon icon={faGavel} className="mr-2" />,
                  command: () => {
                    setOpenTab("current-motions");
                  },
                },
                {
                  label: LL.participants.voting.RECENT_MOTIONS_TAB(),
                  icon: <FontAwesomeIcon icon={faHistory} className="mr-2" />,
                  command: () => {
                    setOpenTab("recent-motions");
                  },
                },
                {
                  label: LL.participants.voting.RECENT_VOTINGS_TAB(),
                  icon: (
                    <FontAwesomeIcon
                      icon={faSquarePollVertical}
                      className="mr-2"
                    />
                  ),
                  command: () => {
                    setOpenTab("recent-votings");
                  },
                },
              ]}
              className="mb-4"
            />
          </div>
          <div className="flex flex-col lg:flex-row gap-4 justify-start">
            <div className="w-full flex flex-col gap-4">
              {openTab === "current-motions" && (
                <>
                  <SplitButton
                    label={LL.chairs.voting.BUTTON_NEW_MOTION()}
                    icon={
                      <FontAwesomeIcon
                        icon={faGavel}
                        className="mr-2 text-xl"
                      />
                    }
                    className="w-full"
                    onClick={() => setNewMotionDialogVisible(true)}
                    model={[
                      {
                        label: "New Operative Clause Voting", // TODO i18n
                        icon: (
                          <FontAwesomeIcon
                            icon={faFileLines}
                            className="mr-2 text-xl"
                          />
                        ),
                        command: () => {
                          setNewMotionDialogVisible(true); // TODO Implement new OC voting dialog
                        },
                      },
                      {
                        label: "New Resolution Voting", // TODO i18n
                        icon: (
                          <FontAwesomeIcon
                            icon={faFileContract}
                            className="mr-2 text-xl"
                          />
                        ),
                        command: () => {
                          setNewMotionDialogVisible(true); // TODO Implement new resolution voting dialog
                        },
                      },
                    ]}
                  />
                  <Motions
                    motionData={motionTestData.filter(
                      (motion: Motion) =>
                        motion.status === "open" ||
                        motion.status === "in-voting",
                    )}
                    highlightedMotionId={activeMotionId}
                    setActiveMotion={setActiveMotionId}
                    chairOptions
                  />
                </>
              )}
              {openTab === "recent-motions" && (
                <Motions
                  motionData={motionTestData.filter(
                    (motion: Motion) =>
                      (motion.status === "passed" ||
                        motion.status === "failed") &&
                      motion.introducedBy !== "uno", // The introduced by filters all chair sind motions/votings (like a resolution voting shouldn't appear in the "Recent Motions" Tab)
                  )}
                  highlightedMotionId={activeMotionId}
                  setActiveMotion={setActiveMotionId}
                  chairOptions
                />
              )}
              {openTab === "recent-votings" && (
                <Motions
                  motionData={motionTestData.filter(
                    (motion: Motion) =>
                      (motion.status === "passed" ||
                        motion.status === "failed") &&
                      motion.voting !== undefined,
                  )}
                  highlightedMotionId={activeMotionId}
                  setActiveMotion={setActiveMotionId}
                  chairOptions
                />
              )}
            </div>
            <div className="w-full flex">
              <VotingArea
                votingData={
                  data.find((motion) => motion.motionId === activeMotionId)
                    ?.voting
                }
                chairOptions
              />
            </div>
          </div>
        </div>
        <Dialog
          visible={newMotionDialogVisible}
          onHide={() => setNewMotionDialogVisible(false)}
          className="w-full max-w-2xl"
        >
          <NewMotionDialog
            closeOverlay={() => setNewMotionDialogVisible(false)}
          />
        </Dialog>
      </ToastProvider>
    </>
  );
}

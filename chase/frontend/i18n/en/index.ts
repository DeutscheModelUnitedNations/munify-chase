import type { BaseTranslation } from "../i18n-types";

const en = {
  LOADING_PAGE: "Loading...",

  login: {
    USERNAME_PLACEHOLDER: "Username",
    PASSWORD_PLACEHOLDER: "Password",
    ADVANCE_BUTTON: "Advance",
    BACK_BUTTON: "Back",
    LOGIN_BUTTON: "Login",
    POWERED_BY: "Powered by",
    legalNotice: {
      SECTION_1: "I agree with the ",
      TERMS_LINK: "Terms of Use",
      SECTION_2:
        ". I also agree that this website uses cookies. You can find more information about this in our ",
      PRIVACY_LINK: "Privacy Policy",
      SECTION_3: ".",
    },
    participant: {
      OTHER_SIGH_IN: "Sign in as chair instead",
      COMMITTEE_LABEL: "Committee",
      COUNTRY_LABEL: "Country / NSA",
      committeeSelection: {
        HEADLINE: "Select the committee",
      },
    },
    chair: {
      OTHER_SIGN_IN: "Sign in as participant instead",
      WARNING_MESSAGE: "You are about to sign in as a chair.",
    },
  },

  participants: {
    dashboard: {
      widgetHeadlines: {
        SPEAKERS_LIST: "Speakers List",
        COMMENT_LIST: "Comment List",
        COMMITTEE_STATUS: "Committee Status",
        WHITEBOARD: "Whiteboard",
        DOCUMENTS: "Documents",
        ACTIONS: "Send Request",
      },
      timerWidget: {
        UNTIL_1: "until",
        UNTIL_2: "",
        TOAST_HEADLINE: "Time is up!",
        TOAST_MESSAGE: "Going back to formal debate.",
      },
      actionsWidget: {
        CHAIR_BUTTON: "Chair",
        RESEARCH_SERVICE_BUTTON: "Research Service",
        contactForm: {
          HEADLINE_CHAIR: "Send a Message to the Chair",
          HEADLINE_RESEARCH_SERVICE: "Send a Message to the Research Service",
          SUBJECT_PLACEHOLDER: "Subject",
          MESSAGE_PLACEHOLDER: "Message",
          CATEGORY_LABEL: "Category",
          CATEGORY_PLACEHOLDER: "Select a Category",
          CANCEL_BUTTON: "Cancel",
          SEND_BUTTON: "Send",
          INFO_MESSAGE:
            "This request will be viewed and checked by the chair first and then forwarded to the Research Service.",
          categoryOptions: {
            GUEST_SPEAKER: "Guest Speaker Request",
            FACT_CHECK: "Fact Check Request",
            INFORMATION: "Information Request",
            GENERAL_SECRETARY: "General Secretary Visit Request",
            OTHER: "Other",
          },
        },
      },
      documentsWidget: {
        SPONSORS: "signed Sponsors",
      },
    },

    speakersList: {
      SPEAKERS_LIST: "Speakers List",
      COMMENT_LIST: "Comment List",
      ADD_TO_LIST_BUTTON: "Speech",
      REMOVE_FROM_LIST_BUTTON: "Remove",
      LIST_CLOSED_BUTTON: "List Closed",
      LIST_CLOSED_MESSAGE: "List Closed",
      NO_SPEAKERS_MESSAGE: "No Speakers on the List",
    },

    voting: {
      ACTIVE_MOTIONS_TAB: "Motions on the Floor",
      RECENT_MOTIONS_TAB: "Recent Motions",
      RECENT_VOTINGS_TAB: "Recent Votings",
      NO_DATA_MOTIONS: "No open motions",
      VOTING_HEADLINE: "Voting",
      NO_DATA_VOTING: "No voting selected",
      votingInfo: {
        INTRODUCED_BY: "Introduced by",
        votingMode: {
          SUBSTANTIAL_VOTING: "Substantial Voting – Possibility to Abstain",
          PROCEDURAL_VOTING: "Procedural Voting – No Abstention",
        },
        majorityMode: {
          SIMPLE: "Simple Majority needed (50% + 1)",
          TWO_THIRDS: "Two-Thirds Majority needed (2/3)",
          THREE_QUARTERS: "Three-Quarters Majority needed (3/4)",
          CONSENSUS: "Consensus needed",
          SECURITY_COUNCIL: "Security Council (9/15 + no veto)",
        },
      },
      votingButtons: {
        IN_FAVOUR: "In Favour",
        AGAINST: "Against",
        ABSTENTION: "Abstention",

        REMAINING: "Remaining",

        VOTE_REGISTERED: "Vote Registered",
        VOTE_REGISTERED_MESSAGE: "Waiting for results...",
      },
      votingResults: {
        VOTING_SUCCESSFUL: "Voting Successful",
        VOTING_FAILED: "Voting Failed",
      },
      votingAlert: {
        VOTING_ALERT_HEADER: "New Vote Started",
        VOTING_ALERT_MESSAGE: "A new vote has been started. Please vote now.",
        BUTTON_ADVANCE: "To Voting",
        BUTTON_IGNORE: "Ignore",
      },
    },
  },

  chairs: {
    CHAIR: "Chair",
    attendance: {
      HEADLINE: "Attendance",
      PRESENT: "Present",
      ABSENT: "Absent",
      EXCUSED: "Excused",
    },
    whiteboard: {
      SAVE_BUTTON: "Save and publish",
      RESET_BUTTON: "Reset",
    },
    speakersList: {
      buttons: {
        START_TIMER: "Start Timer",
        PAUSE_TIMER: "Stop Timer",
        RESET_TIMER: "Reset Timer",
        REMOVE_TIME: "15s",
        ADD_TIME: "15s",
        NEXT_SPEAKER: "Next Speaker",
        ADD_TO_LIST: "Add to List",
        CLOSE_LIST: "Close List",
        OPEN_LIST: "Open List",
        CLEAR_LIST: "Reset List",
        CHANGE_SPEECH_TIME: "Change Speech Time",
      },
      addSpeakerOverlay: {
        HEADLINE: "Add Speaker to {{0}}",
        PLACEHOLDER: "Select a Speaker",
        BUTTON_CANCEL: "Cancel",
        BUTTON_ADD: "Add",
        BUTTON_ADD_AND_CLOSE: "Add and Close",
      },
      changeSpeechTimeOverlay: {
        HEADLINE: "Change Speech Time for {{0}}",
        BUTTON_CANCEL: "Cancel",
        BUTTON_SET: "Change",
      }
    },
  },
} satisfies BaseTranslation;

export default en;

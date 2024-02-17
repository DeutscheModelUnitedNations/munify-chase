import type { BaseTranslation } from "../i18n-types";

const en = {
  LOADING_PAGE: "Loading...",
  ERROR: "Error",

  NOT_FOUND: {
    NOT_FOUND: "Not found",
    BACK_TO_HOME: "Back to home",
  },

  home: {
    CAPTION: " for the digital age",
    HERO_TEXT: "This is where a catchy text about CHASE could be.",
    navbar: {
      LOGIN_ADMIN: "Admin",
      LOGIN_CHAIR: "Chair",
      DOCUMENTATION: "Documentation",
      FAQ: "FAQs",
      LOGIN_PARTICIPANT: "Login",
    },
    heroCards: {
      CARD_1_TITLE: "Debates",
      CARD_1_TEXT:
        "Handle speakers and comments lists with ease and efficiency. No more paper lists!",
      CARD_2_TITLE: "Voting",
      CARD_2_TEXT:
        "Handle motions and voting procedures with electronic voting and preprepared motions according to your rules of procedure.",
      CARD_3_TITLE: "Resolutions",
      CARD_3_TEXT:
        "Create and edit resolutions collaboratively with other delegates. No more paper or Google Docs!",
    },
    ABOUT_TITEL: "About CHASE",
    ABOUT_TEXT:
      "CHASE (CHAirSoftwarE) is a web application for the management of debates in Model United Nations conferences. It is designed to be used by chairs and delegates alike. CHASE enables Chairs to manage debates with ease while delegates can follow along and collaborate with other delegates in a intuitive and structured matter. CHASE is free and open source software.",
    MISSION_TITLE: "Our Mission",
    MISSION_TEXT:
      "CHASE is developed by members of the DMUN community. We want to provide a free and open source alternative to other existing debate management software. We want to make debate management more accessible to smaller conferences and make it easier for chairs to manage debates. CHASE is primarily developed for the german-speaking conferences of DMUN in Germany, which are MUN-SH, MUNBW and MUNBB, but we are always open to adapt CHASE to other conferences.",
    MISSION_BUTTON_LABEL: "Learn more about DMUN",
    CONTRIBUTE_TITEL: "Contribute",
    CONTRIBUTE_TEXT:
      "CHASE is part of open source initative 'MUNify' by DMUN. We are always looking for people who want to contribute to CHASE. If you have experience in web developement or just want to learn new skills, please visit our GitHub repository and get in touch!",
    CONTRIBUTE_BUTTON_LABEL: "Visit our GitHub",
    footer: {
      sitemap: {
        TITEL: "Sitemap",
        HOME: "Home",
        FAQ: "FAQs",
        DOCS: "Documentation",
        PRIVACY: "Privacy Policy",
      },
      imprint: {
        TITEL: "Imprint",
        ORGANISATION: "Deutsche Model United Nations (DMUN) e.V.",
        ADDRESS: "Birkenweg 1, 24235 Laboe",
        EMAIL: "vorstand@dmun.de",
        WEBSITE: "www.dmun.de",
      },
    },
  },

  admin: {
    login: {
      TITLE: "Admin Login",
      CONFERENCE_ID: "Conference ID",
      CREATE_INSTEAD: "Create",
      SUBMIT: "Login",
    },
    onboarding: {
      title: "Setup new Conference",
      conferenceName: "Conference Name",
      dates: "Dates",
      token: "Creation Token",
      login: "Login",
      submit: "Create",
      success: "Success",
      successDetails: "Conference created!",
      error: {
        title: "Error",
        wrongToken: "The token is invalid.",
        conferenceExists: "A conference with this name already exists.",
        generic: "An error occurred.",
      },

      SAVE_AND_QUIT: "Quit Setup",
      SAVE_AND_QUIT_MESSAGE:
        "Do you really want to quit the setup? When you quit, you can always continue later.",
      BUTTON_ADVANCE: "Continue",
      BUTTON_BACK: "Back",

      structure: {
        DELETE_ALL: "Delete All",
        DELETE_ALL_CONFIRM: "Are you sure you want to delete all committees?",
        ADD_COMMITTEE: "Add Committee",
        SUCCESS_ADD_COMMITTEE: "Committee added",
        EMPTY_MESSAGE:
          "No Committees yet. Click 'Add Committee' in the top right corner to create a new one.",
        COMMITTEE_LONG: "Name",
        COMMITTEE_SHORT: "Abbreviation",
        CATEGORY: "Category",
        FOOTER: "In total {{0}} committees.",
        input: {
          BUTTON_ADD: "Add",
          BUTTON_CANCEL: "Cancel",
          CATEGORY: "Category",
          CATEGORY_SWITCH_COMMITTEE: "Committee",
          CATEGORY_SWITCH_CRISIS: "Crisis",
          CATEGORY_SWITCH_ICJ: "ICJ",
          IS_SUBCOMMITTEE: "Is Sub-Committee",
          PARENT_COMMITTEE: "Parent Committee",
        },
        ERROR_NO_COMMITTEES: "No Committees found",
        ERROR_NO_COMMITTEES_DETAILS:
          "Please create a committee before continuing.",
      },

      teampool: {
        DELETE_ALL: "Delete All",
        UPLOAD_TEAM: "Upload CSV",
        ADD_TEAMMEMBER: "Add Team Member",
        EMPTY_MESSAGE:
          "No Team Members yet. Click 'Add Team Member' in the top right corner to create a new one.",
        FOOTER: "In total {{0}} team members.",
        ROLE: "Role",
        COUNT: "Count",
        roles: {
          ADMIN: "Admin",
          SECRETARIAT: "Secretariat",
          CHAIR: "Chair",
          COMMITTEE_ADVISOR: "Committee Advisor",
          NON_STATE_ACTOR: "Non-State Actor",
          PRESS_CORPS: "Press Corps",
          GUEST: "Guest",
          PARTICIPANT_CARE: "Participant Care",
          MISCELLANEOUS_TEAM: "Other Team",
        },
        input: {
          COUNT: "Count",
          BUTTON_ADD: "Add",
          BUTTON_CANCEL: "Cancel",
        },
      },

      committees: {
        CHAIRS: "Select Chairs",
        ADVISORS: "Select Committee Advisors",
        AGENDA_ITEMS: "Agenda Items",
        ADD_AGENDA_ITEM: "Add Agenda Item",
        ADD_ITEM_BUTTON: "Add",
      },

      delegations: {
        ADD_DELEGATION_BUTTON: "Add Delegation",
        DELEGATION_COLUMN: "Delegation",
        TOTAL_NUMBER_OF_DELEGATIONS: "Total",
        EMPTY_MESSAGE: "No Delegations found",
        add_delegation: {
          HEADLINE: "Add Delegation",
          SEARCH_PLACEHOLDER: "Search for a Delegation",
          BACK_BUTTON: "Back",
          ADD_BUTTON: "Add and Close",
          ADD_MORE_BUTTON: "Add",
        },
      },

      steps: {
        STEP_1: "Structure",
        STEP_2: "Team Pool",
        STEP_3: "Committees",
        STEP_4: "Delegations",
        STEP_5: "NSAs",
        STEP_6: "Configurations",
      },
    },
  },

  login: {
    EMAIL_PLACEHOLDER: "E-Mail",
    PASSWORD_PLACEHOLDER: "Password",
    ADVANCE_BUTTON: "Advance",
    BACK_BUTTON: "Back",
    LOGIN_BUTTON: "Login",
    LOGIN_TITLE: "Login",
    LOGIN_NOW: "Login now",
    NO_TOKEN: "The confirmation token is invalid or could not be found.",
    NO_EMAIL: "The email is invalid or could not be found.",
    EMAIL_CONFIRMED: "The email has been confirmed.",
    PASSKEY: "Passkey",
    EMAIL_CONFIRMED_SERVER_ERROR:
      "We could not confirm your email address. Please try again later.",
    CREATE_ACCOUNT: "Create Account",
    EMAIL_INVALID: "Email is invalid",
    CREATION_SUCCESS:
      "Account successfully created. Please confirm your e-mail address via the link in the e-mail we sent you to activate your account.",
    PASSWORD_INVALID:
      "The password is invalid. It must be at least 8 characters long and contain at least two upper case letters, three lower case letters, two numbers and one special character.",
    WHAT_ARE_PASSKEYS: "What are Passkeys?",
    PASSWORD: "Password",
    LOGIN_DESCRIPTION: "Please enter your credentials to continue.",
    ACCOUNT_NOT_YET_CREATED:
      "Great, an account with this e-mail address does not yet exist! Create account for this e-mail address with the following password:",
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

  navbar: {
    SETTINGS: "Settings",
    LOGOUT: "Logout",
    DASHBOARD: "Dashboard",
    CONFIGURATION: "Configuration",
    ATTENDEES: "Attendees",
    SPEAKERS: "Speakers List",
    VOTING: "Voting",
    WHITEBOARD: "Whiteboard",
    RESOLUTIONS: "Resolutions",
    PRESENTATION: "Presentation",
    NEWS: "Conference Press",
    BUG_REPORT: "Report a Bug",
  },

  settings: {
    colorTheme: {
      HEADLINE: "Color Mode",
      SYSTEM: "System",
      LIGHT: "Light",
      DARK: "Dark",
      CONTRAST: "Contrast",
    },
    language: {
      HEADLINE: "Language",
      SYSTEM: "System",
      ENGLISH: "English",
      GERMAN: "Deutsch",
    },
  },

  hub: {
    CHAIR_HUB_TITLE: "Chair Hub",
    NA_HUB_TITLE: "Non-State Actor's Hub",
    SELECT_COMMITTEE: "Select a Committee",
    NO_COMMITTEES: "No Committees found",
    LOGOUT: "Logout",
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
        UNTIL: "until {{0}}",
        TOAST_HEADLINE: "Time is up!",
        TOAST_MESSAGE: "Going back to formal debate.",
        defaultHeadlines: {
          FORMAL: "Formal Debate",
          INFORMAL: "Informal Caucus",
          PAUSE: "Pause",
          SUSPENSION: "Suspension",
        },
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
    dashboard: {
      overview: {
        TITLE: "Overview",
      },
      configurations: {
        TITLE: "Configurations",
        agenda: {
          TITLE: "Agenda Item Selection",
          DESCRIPTION: "Select the agenda item you want to activate.",
          PLACEHOLDER: "No Agenda Item Selected",
        },
        statusTimer: {
          TITLE: "Status Timer",
          DESCRIPTION: "Set the status of the committee. You can also set a custom name, that overrides the default status name while keeping the icon (e.g. 'Lunch Break' instead of default 'Pause').",
          PLACEHOLDER_DROPDOWN: "Select a Status",
          PLACEHOLDER_CUSTOM_TEXT: "Custom Name (optional)",
          PLACEHOLDER_TIME_UNITL: "until",
          BUTTON: "Save Status",
        },
      }
    },
    attendance: {
      HEADLINE: "Attendance",
      PRESENT: "Present",
      ABSENT: "Absent",
      EXCUSED: "Excused",
    },
    whiteboard: {
      SAVE_BUTTON: "Save and publish",
      RESET_BUTTON: "Reset",
      SUCCESS_TOAST: "Whiteboard saved",
      NO_CONTENT_TOAST: "Whiteboard is empty",
      NO_CONTENT_TOAST_DETAILS: "It seems like there was an error while loading the whiteboard or the whiteboard is empty. Please try to reload the page.",
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
        TOAST_ADDED_SUMMARY: "{{0}} added",
        TOAST_ADDED_DETAIL: "to the {{0}}",
      },
      changeSpeechTimeOverlay: {
        HEADLINE: "Change Speech Time for {{0}}",
        BUTTON_CANCEL: "Cancel",
        BUTTON_SET: "Change",
        PLACEHOLDER: "New Speech Time (mm:ss)",
        TOAST_SUCCESS: "Speech Time changed to {{0}} min",
        TOAST_SUCCESS_DETAIL: "for {{0}}",
        TOAST_WRONG_FORMAT: "Wrong Format",
      },
    },
    voting: {
      BUTTON_NEW_MOTION: "New Motion",
      BUTTON_CHANGE_INFO: "Change Info",
      BUTTON_RESET: "Restart Voting",
      BUTTON_DELETE: "Delete Voting",
    },
  },
} satisfies BaseTranslation;

export default en;

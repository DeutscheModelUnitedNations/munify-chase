import type { Translation } from "../i18n-types";

const de = {
  LOADING_PAGE: "Loading...",

  admin: {
    onboarding: {
      title: "Neue Konferenz erstellen",
      conferenceName: "Name der Konferenz",
      dates: "Zeitraum",
      token: "Erstellungstoken",
      login: "Anmelden",
      submit: "Erstellen",
      success: "Erfolg",
      successDetails: "Die Konferenz wurde erstellt!",
      error: {
        title: "Fehler",
        wrongToken: "Das Token ist ungültig.",
        conferenceExists: "Eine Konferenz mit diesem Namen existiert bereits.",
        generic: "Ein Fehler ist aufgetreten.",
      },

      SAVE_AND_QUIT: "Einrichtung beenden",
      SAVE_AND_QUIT_MESSAGE:
        "Willst du die Einrichtung wirklich beenden? Du kannst sie jederzeit später fortsetzen.",
      BUTTON_ADVANCE: "Weiter",
      BUTTON_BACK: "Zurück",

      structure: {
        DELETE_ALL: "Alles löschen",
        DELETE_ALL_CONFIRM: "Are you sure you want to delete all committees?",
        ADD_COMMITTEE: "Gremium hinzufügen",
        SUCCESS_ADD_COMMITTEE: "Gremium hinzugefügt",
        EMPTY_MESSAGE:
          "Keine Gremien vorhanden. Klicke oben rechts auf 'Gremium hinzufügen', um ein neues Gremium zu erstellen.",
        COMMITTEE_LONG: "Name",
        COMMITTEE_SHORT: "Abkürzung",
        CATEGORY: "Kategorie",
        FOOTER: "Insgesamt {{0}} Gremien.",
        input: {
          BUTTON_ADD: "Hinzufügen",
          BUTTON_CANCEL: "Abbrechen",
          CATEGORY: "Kategorie",
          CATEGORY_SWITCH_COMMITTEE: "Gremium",
          CATEGORY_SWITCH_CRISIS: "Krise",
          CATEGORY_SWITCH_ICJ: "IGH",
          IS_SUBCOMMITTEE: "Ist Vorlegendes Gremium / Untergremium",
          PARENT_COMMITTEE:
            "Beschlussfassendes Gremium / Übergeordnetes Gremium",
        },
        ERROR_NO_COMMITTEES: "Keine Gremien vorhanden",
        ERROR_NO_COMMITTEES_DETAILS:
          "Bitte erstelle ein Gremium, bevor du fortfährst.",
      },

      teampool: {
        DELETE_ALL: "Alle löschen",
        UPLOAD_TEAM: "CSV hochladen",
        ADD_TEAMMEMBER: "Teammitglied hinzufügen",
        EMPTY_MESSAGE:
          "Keine Teammitglieder vorhanden. Klicke oben rechts auf 'Teammitglied hinzufügen', um ein neues Teammitglied zu erstellen.",
        FOOTER: "Insgesamt {{0}} Teammitglieder.",
        NAME: "Name",
        ROLE: "Rolle",
      },

      steps: {
        STEP_1: "Struktur",
        STEP_2: "Teampool",
        STEP_3: "Gremien",
        STEP_4: "Delegationen",
        STEP_5: "Rollen",
      },
    },
  },

  login: {
    USERNAME_PLACEHOLDER: "Username",
    PASSWORD_PLACEHOLDER: "Passwort",
    ADVANCE_BUTTON: "Weiter",
    BACK_BUTTON: "Zurück",
    LOGIN_BUTTON: "Anmelden",
    POWERED_BY: "Ermöglicht durch",
    legalNotice: {
      SECTION_1: "Ich bin Einverstanden mit den ",
      TERMS_LINK: "Nutzungsbedingungen",
      SECTION_2:
        ". Außerdem bin ich damit einverstanden, dass diese Website Cookies verwendet. Mehr Informationen dazu finden Sie in unseren ",
      PRIVACY_LINK: "Datenschutzbestimmungen",
      SECTION_3: ".",
    },
    participant: {
      OTHER_SIGH_IN: "Stattdessen als Vorsitz anmelden",
      COMMITTEE_LABEL: "Gremium",
      COUNTRY_LABEL: "Staat / NA",
      committeeSelection: {
        HEADLINE: "Gremium auswählen",
      },
    },
    chair: {
      OTHER_SIGN_IN: "Stattdessen als Teilnehmer anmelden",
      WARNING_MESSAGE: "Sie sind im Begriff sich als Vorsitz anzumelden.",
    },
  },

  navbar: {
    SETTINGS: "Einstellungen",
    LOGOUT: "Logout",
    DASHBOARD: "Dashboard",
    CONFIGURATION: "Voreinstellungen",
    ATTENDEES: "Anwesenheit",
    SPEAKERS: "Redeliste",
    VOTING: "Abstimmungen",
    WHITEBOARD: "Whiteboard",
    RESOLUTIONS: "Resolutionen",
    PRESENTATION: "Präsentation",
    NEWS: "Konferenzpresse",
  },

  settings: {
    colorTheme: {
      HEADLINE: "Farbmodus",
      SYSTEM: "System",
      LIGHT: "Hell",
      DARK: "Dunkel",
      CONTRAST: "Kontrast",
    },
    language: {
      HEADLINE: "Sprache",
      SYSTEM: "System",
      ENGLISH: "English",
      GERMAN: "Deutsch",
    },
  },

  participants: {
    dashboard: {
      widgetHeadlines: {
        SPEAKERS_LIST: "Redeliste",
        COMMENT_LIST: "Fragen und Kurzbemerkungen",
        COMMITTEE_STATUS: "Debattenstatus",
        WHITEBOARD: "Whiteboard",
        DOCUMENTS: "Dokumente",
        ACTIONS: "Anfrage senden",
      },
      timerWidget: {
        UNTIL_1: "bis",
        UNTIL_2: "Uhr",
        TOAST_HEADLINE: "Zeit ist abgelaufen!",
        TOAST_MESSAGE: "Gehe zurück in die formelle Debatte.",
      },
      actionsWidget: {
        CHAIR_BUTTON: "Vorsitz",
        RESEARCH_SERVICE_BUTTON: "Wiss. Dienst",
        contactForm: {
          HEADLINE_CHAIR: "Sende dem Vorsitz eine Nachricht",
          HEADLINE_RESEARCH_SERVICE:
            "Sende dem Wissenschaftlichen Dienst (WD) eine Nachricht",
          SUBJECT_PLACEHOLDER: "Betreff",
          MESSAGE_PLACEHOLDER: "Nachricht",
          CATEGORY_LABEL: "Kategorie",
          CATEGORY_PLACEHOLDER: "Wähle eine Kategorie aus",
          CANCEL_BUTTON: "Abbrechen",
          SEND_BUTTON: "Senden",
          INFO_MESSAGE:
            "Diese Anfrage wird zunächst vom Vorsitz geprüft und erst dann an den Wissenschaftlichen Dienst weitergeleitet.",
          categoryOptions: {
            GUEST_SPEAKER: "Gastredner:in anfragen",
            FACT_CHECK: "Faktencheck",
            INFORMATION: "Informationsanfrage",
            GENERAL_SECRETARY: "Um Besuch des/der Generalsekretär:in bitten",
            OTHER: "Sonstiges",
          },
        },
      },
      documentsWidget: {
        SPONSORS: "signierte Unterstützer:innen",
      },
    },

    speakersList: {
      SPEAKERS_LIST: "Redeliste",
      COMMENT_LIST: "Fragen und Kurzbemerkungen",
      ADD_TO_LIST_BUTTON: "Redebeitrag",
      REMOVE_FROM_LIST_BUTTON: "Zurückziehen",
      LIST_CLOSED_BUTTON: "Liste Geschlossen",
      LIST_CLOSED_MESSAGE: "Liste Geschlossen",
      NO_SPEAKERS_MESSAGE: "Keine Redner:innen auf der Liste",
    },

    voting: {
      ACTIVE_MOTIONS_TAB: "Aktuelle Anträge",
      RECENT_MOTIONS_TAB: "Vergangene Anträge",
      RECENT_VOTINGS_TAB: "Vergangene Abstimmungen",
      NO_DATA_MOTIONS: "Aktuell keine Anträge",
      VOTING_HEADLINE: "Abstimmung",
      NO_DATA_VOTING: "Keine Abstimmung ausgewählt",
      votingInfo: {
        INTRODUCED_BY: "Eingebracht von",
        votingMode: {
          SUBSTANTIAL_VOTING: "Inhaltliche Abstimmung – Enthaltung möglich",
          PROCEDURAL_VOTING:
            "Prozessuale Abstimmung – keine Enthaltung möglich",
        },
        majorityMode: {
          SIMPLE: "Einfache Mehrheit erforderlich (50% + 1)",
          TWO_THIRDS: "Zwei-Drittel Mehrheit erforderlich (2/3)",
          THREE_QUARTERS: "Drei-Viertel Mehrheit erforderlich (3/4)",
          CONSENSUS: "Konsens erforderlich",
          SECURITY_COUNCIL:
            "Abstimmungsmodus des Sicherheitsrats (9/15 + no veto)",
        },
      },
      votingButtons: {
        IN_FAVOUR: "Dafür",
        AGAINST: "Dagegen",
        ABSTENTION: "Enthaltung",

        REMAINING: "Verbleibend",

        VOTE_REGISTERED: "Stimme registriert",
        VOTE_REGISTERED_MESSAGE: "Warten auf Ergebnis",
      },
      votingResults: {
        VOTING_SUCCESSFUL: "Abstimung Erfolgreich",
        VOTING_FAILED: "Abstimmung Fehlgeschlagen",
      },
      votingAlert: {
        VOTING_ALERT_HEADER: "Neue Abstimmung gestartet",
        VOTING_ALERT_MESSAGE:
          "Sie wurden zu einer neuen Abstimmung aufgerufen. Bitte nehmen Sie schnellstmöglich daran teil.",
        BUTTON_ADVANCE: "Zur Abstimmung",
        BUTTON_IGNORE: "Ignorieren",
      },
    },
  },

  chairs: {
    CHAIR: "Vorsitz",
    attendance: {
      HEADLINE: "Anwesenheit",
      PRESENT: "Anwesend",
      ABSENT: "Abwesend",
      EXCUSED: "Entschuldigt",
    },
    whiteboard: {
      SAVE_BUTTON: "Speichern und Veröffentlichen",
      RESET_BUTTON: "Zurücksetzen",
    },
    speakersList: {
      buttons: {
        START_TIMER: "Start",
        PAUSE_TIMER: "Stop",
        RESET_TIMER: "Zeit zurücksetzen",
        REMOVE_TIME: "15s",
        ADD_TIME: "15s",
        NEXT_SPEAKER: "Nächste Redner:in",
        ADD_TO_LIST: "Redebeitrag hinzufügen",
        CLOSE_LIST: "Liste schließen",
        OPEN_LIST: "Liste öffnen",
        CLEAR_LIST: "Liste zurücksetzen",
        CHANGE_SPEECH_TIME: "Redezeit ändern",
      },
      addSpeakerOverlay: {
        HEADLINE: "Redebeiträge zu {{0}} hinzufügen",
        PLACEHOLDER: "Suche nach Redner:innen",
        BUTTON_CANCEL: "Abbrechen",
        BUTTON_ADD: "Hinzufügen",
        BUTTON_ADD_AND_CLOSE: "Hinzufügen und schließen",
        TOAST_ADDED_SUMMARY: "{{0}} hinzugefügt",
        TOAST_ADDED_DETAIL: "zu {{0}}",
      },
      changeSpeechTimeOverlay: {
        HEADLINE: "Redezeit für {{0}} ändern",
        BUTTON_CANCEL: "Abbrechen",
        BUTTON_SET: "Ändern",
        PLACEHOLDER: "Neue Redezeit (mm:ss)",
        TOAST_SUCCESS: "Redezeit festgelegt auf {{0}} min",
        TOAST_SUCCESS_DETAIL: "für {{0}}",
        TOAST_WRONG_FORMAT: "Falsches Format",
      },
    },
    voting: {
      BUTTON_NEW_MOTION: "Neuer Antrag",
      BUTTON_CHANGE_INFO: "Infos Ändern",
      BUTTON_RESET: "Abstimmung neu starten",
      BUTTON_DELETE: "Abstimmung löschen",
    },
  },
} satisfies Translation;

export default de;

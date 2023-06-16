import {
  CommitteeStatus,
  CountryCode,
  NormalApiResponse,
  SpeakersListData,
  Document,
  Voting,
  Motion,
} from "@/custom_types";

export const myCountry: CountryCode = "cpv";

export const speakersListTestData: SpeakersListData = {
  currentSpeaker: {
    entryId: "1",
    countryCode: "unw",
    timer: {
      start: new Date(),
      durationMilliseconds: 1000 * 60 * 3,
      paused: true,
    },
  },
  list: [
    {
      entryId: "2",
      countryCode: "deu",
    },
    {
      entryId: "3",
      countryCode: "usa",
    },
    {
      entryId: "4",
      countryCode: "yem",
    },
    {
      entryId: "5",
      countryCode: "fra",
    },
    {
      entryId: "6",
      countryCode: "gbr",
    },
    {
      entryId: "7",
      countryCode: "jam",
    },
    {
      entryId: "8",
      countryCode: "cpv",
    },
    {
      entryId: "9",
      countryCode: "gmb",
    },
    {
      entryId: "10",
      countryCode: "jor",
    },
    {
      entryId: "11",
      countryCode: "lao",
    },
    {
      entryId: "12",
      countryCode: "ltu",
    },
    {
      entryId: "13",
      countryCode: "fsm",
    },
    {
      entryId: "14",
      countryCode: "omn",
    },
  ],
  closed: false,
};

export const commentListTestData: SpeakersListData = {
  currentSpeaker: {
    entryId: "1",
    countryCode: "cpv",
    timer: {
      start: new Date(),
      durationMilliseconds: 1000 * 20, // 20 test seconds
      paused: false,
    },
  },
  list: [
    {
      entryId: "3",
      countryCode: "usa",
    },
    {
      entryId: "4",
      countryCode: "yem",
    },
    {
      entryId: "5",
      countryCode: "fra",
    },
  ],
  closed: true,
};

export const committeeStatusTestData: CommitteeStatus = {
  status: "Informelle Sitzung",
  until: new Date(Date.now() + 1000 * 30),
  category: "informal",
  currentDebateStep: "Allgemeine Debatte",
  nextDebateStep: "Debatte zum Resolutionsentwurf RE/GV/23/1",
};

export const documentsTestData: Document[] = [
  {
    documentId: "RES/GV/23/1",
    topic: "Resolution zur Einführung einer neuen Chairsoftware",
    category: "adopted",
    introducedBy: "deu",
    sponsors: ["gbr", "fra", "usa"],
  },
  {
    documentId: "RE/GV/23/2/1",
    category: "draft",
    introducedBy: "jam",
    sponsors: ["gbr", "fra", "usa"],
  },
  {
    documentId: "RE/GV/23/2/2",
    category: "draft",
    introducedBy: "usa",
    sponsors: ["gbr", "deu"],
  },
  {
    documentId: "AP/1",
    category: "paper",
    introducedBy: "gbr",
    shared: true,
    sponsors: ["gbr"],
  },
  {
    documentId: "AP/5",
    shared: false,
    category: "paper",
    introducedBy: "jam",
  },
];

export const apiTestData: NormalApiResponse = {
  committeeName: "Generalversammlung",
  currentTopic: "Rechte von Kindersoldaten",
  myCountry: myCountry,

  speakersList: speakersListTestData,
  commentList: commentListTestData,

  committeeStatus: committeeStatusTestData,

  whiteboardMarkdown:
    "# Hello World!\n\nHier ist ein Markdown- Beispiel.\n\n## Vorsitzende\n* Miriam Güthe\n * Maximilian Ilzhöfer\n * Tade Strehk\n## Gremienberatung\n * Felix Thomsen\n\nUnd hier ein[Link](https://www.google.com).\n\n> **An alle Terrorteilis:** Das Pöbeln nicht vergessen!\n\n# Über diesen Block\n\nHier können die Vorsitzenden aktuelle Informationen anzeigen. Das ganze wird über einen Editor funktionieren, sodass die Vorsitzenden über Markdown ihre Informationen individuell verpacken und anzeigen können. Das bietet größtmögliche Flexibilität und Übersichtlichkeit.",

  documents: documentsTestData,
};

export const motionTestData: Motion[] = [
  {
    motionId: "0",
    introducedBy: "deu",
    personalPointOfMotion: true,
    motionText: "Recht auf Information",
    active: true,
  },
  {
    motionId: "1",
    introducedBy: "deu",
    personalPointOfMotion: false,
    motionText:
      "Vorgezogene Abstimmung über den Resolutionsentwurf als Ganzen",
    active: false,
  },
  {
    motionId: "2",
    introducedBy: "fra",
    personalPointOfMotion: false,
    motionText: "Informelle Sitzung",
    active: false,
  },
  {
    motionId: "3",
    introducedBy: "cpv",
    personalPointOfMotion: false,
    motionText: "Abschluss der Redeliste",
    active: false,
  },
];

export const votingTestData: Voting = {
  votingId: "1",
  title: "Informelle Sitzung von 15 Minuten",
  description:
    "Sollte der Antrag angenommen werden, wird das Gremium in eine informelle Sitzung übergehen, die 15 Minuten dauern wird.",
  introducedBy: "cpv",
  substantiveVote: true,
  votingCountries: [
    "cpv",
    "deu",
    "fra",
    "chn",
    "rus",
    "usa",
    "gbr",
    "jpn",
    "cmr",
    "alb",
    "arm",
    "aut",
    "bhr",
  ],
  majority: "simple",
  votes: [
    // {
    //   country: "cpv",
    //   vote: "yes",
    // },
    {
      country: "deu",
      vote: "no",
    },
    {
      country: "fra",
      vote: "yes",
    },
    {
      country: "chn",
      vote: "no",
    },
    {
      country: "rus",
      vote: "yes",
    },
    {
      country: "usa",
      vote: "yes",
    },
    {
      country: "gbr",
      vote: "yes",
    },
    {
      country: "jpn",
      vote: "yes",
    },
    {
      country: "alb",
      vote: "abstain",
    },
    {
      country: "cmr",
      vote: "yes",
    },
    {
      country: "arm",
      vote: "yes",
    },
  ],
  // outcome: "failed"
};

import {
  CommitteeStatus,
  CountryCode,
  NormalApiResponse,
  SpeakersListData,
  Document,
  Voting,
} from "@/custom_types";

export const myCountry: CountryCode = "cpv";

export const speakersListTestData: SpeakersListData = {
  currentSpeaker: {
    countryCode: "unw",
    timer: {
      start: new Date(),
      durationMilliseconds: 1000 * 60 * 3,
      paused: true,
    },
  },
  list: [
    "gbr",
    "che",
    "yem",
    "fra",
    "jam",
    "cpv",
    "gmb",
    "jor",
    "lao",
    "ltu",
    "fsm",
    "omn",
    "qat",
    "sle",
    "sdn",
    "tls",
    "are",
    "ven",
  ],
  closed: false,
};

export const commentListTestData: SpeakersListData = {
  currentSpeaker: {
    countryCode: "cze",
    timer: {
      start: new Date(),
      durationMilliseconds: 1000 * 20, // 20 test seconds
      paused: false,
    },
  },
  list: ["deu", "jam", "usa", "yem"],
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
    {
      country: "cpv",
      vote: "yes",
    },
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
  outcome: "passed",
};

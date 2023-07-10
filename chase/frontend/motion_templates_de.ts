import { MotionTemplate } from "@/custom_types";

export const motionTemplates: MotionTemplate[] = [
  {
    precedence: 1,
    title: "Mündliche Abstimmung",
    description:
      "Wird dieser Antrag angenommen, dann wird die letzte oder anstehende Abstimmung mündlich durch Aufruf durchgeführt.",
    substantiveVote: false,
    majority: "simple",
    speeches: false,
  },
  {
    precedence: 2,
    title: "Revision einer Entscheidung des Vorsitzes",
    description:
      "Wird dieser Antrag angenommen, dann wird die letzte eigenmächtige Entscheidung des Vorsitzes revidiert.",
    substantiveVote: false,
    majority: "two-thirds",
    speeches: false,
  },
  {
    precedence: 3,
    title: "Informelle Sitzung",
    description:
      "Wird dieser Antrag angenommen, dann wird eine informelle Sitzung über die beantragte Dauer einberufen.",
    substantiveVote: false,
    majority: "two-thirds",
    speeches: false,
  },
  {
    precedence: 4,
    title: "Aufnahme eines neuen Tagesordnungspunktes",
    description:
      "Wird dieser Antrag angenommen, dann wird der beantragte Tagesordnungspunkt in die Tagesordnung aufgenommen. Der neue Tagesordnungspunkt wird unmittelbar behandelt.",
    substantiveVote: false,
    majority: "simple",
    speeches: true,
  },
  {
    precedence: 5,
    title: "Zurückschicken eines Resolutionsentwurfes",
    description:
      "Wird dieser Antrag angenommen, dann wird der beantragte Resolutionsentwurf an das vorlegende Gremium zurückgeschickt.",
    substantiveVote: false,
    majority: "simple",
    speeches: true,
  },
  {
    precedence: 6,
    title: "Vertagung eines Tagesordnungspunktes",
    description:
      "Wird dieser Antrag angenommen, dann wird der beantragte Tagesordnungspunkt vertagt. Anschließend wir der nächste Tagesordnungspunkt behandelt.",
    substantiveVote: false,
    majority: "two-thirds",
    speeches: true,
  },
  {
    precedence: 7,
    title: "Rückkehr zur allgemeinen Debatte",
    description:
      "Wird dieser Antrag angenommen, dann kehr das Gremium zur allgemeinen Debatte zurück. Alle Resolutionsentwürfe und Änderungsanträge verfallen.",
    substantiveVote: false,
    majority: "two-thirds",
    speeches: true,
  },
  {
    precedence: 7,
    title: "Ende der aktuellen Debatte",
    description:
      "Wird dieser Antrag angenommen, so wird die aktuelle Debatte beendet. Es verfallen alle noch offenen Redebeiträge. Das Gremium fährt fort mit der nächsten Debatte.",
    substantiveVote: false,
    majority: "two-thirds",
    speeches: true,
  },
  {
    precedence: 8,
    title: "Vorgezogene Abstimmung über den Resolutionsentwurf als Ganzes",
    description:
      "Wird dieser Antrag angenommen, so wird über den Resolutionsentwurf als Ganzes abgestimmt. In dieser Abstimmung geht es nicht um die Abstimmung über den Resolutionsentwurf selber, sondern nur um die Frage, ob überhaupt über den Resolutionsentwurf abgestimmt werden soll. Wenn die anschließenede Abstimmung über den Resolutionsentwurf als ganzes nicht erfolgreich ist, wird der nächste Resolutionsentwurf zum aktuellen Tagesordnungspunkt behandelt.",
    substantiveVote: false,
    majority: "two-thirds",
    speeches: true,
  },
  {
    precedence: 9,
    title: "Abschluss oder Wiedereröffnung der Redeliste",
    description:
      "Wird dieser Antrag angenommen, so wird die beantragte Redeliste geschlossen oder wiedereröffnet.",
    substantiveVote: false,
    majority: "simple",
    speeches: false,
  },
  {
    precedence: 10,
    title: "Änderung der Redezeit",
    description:
      "Wird dieser Antrag angenommen, so wird die Redezeit für die entsprechende Redeliste auf die beantragte Zeit geändert.",
    substantiveVote: false,
    majority: "simple",
    speeches: false,
  },
  {
    precedence: 11,
    title: "Anhörung einer Gastrede",
    description:
      "Wird dieser Antrag angenommen, so wird der Wunsch des Gremiums, eine Gastrede zu einem bestimmten Thema anzuhören, an das Sekretariat weitergeleitet.",
    substantiveVote: false,
    majority: "simple",
    speeches: true,
  },
];

// import { faker } from "@faker-js/faker";
import { $Enums, PrismaClient } from "../generated/client";
const prisma = new PrismaClient();

try {
  /*
   * --------------------
   *   MUN-SH 2024 Data
   * --------------------
   */
  const conference = await prisma.conference.upsert({
    where: {
      name: "MUN-SH 2024",
    },
    update: {},
    create: {
      name: "MUN-SH 2024",
      start: new Date("2024-03-07"),
      end: new Date("2024-03-11"),
    },
  });
  console.info("\n----------------\n");
  console.info(`Created a MUN-SH 2024 Conference with the ID ${conference.id}`);

  // Committees

  const committees = {} as {
    GV: Awaited<ReturnType<typeof prisma.committee.create>> | undefined;
    HA1: Awaited<ReturnType<typeof prisma.committee.create>> | undefined;
    WiSo: Awaited<ReturnType<typeof prisma.committee.create>> | undefined;
    SR: Awaited<ReturnType<typeof prisma.committee.create>> | undefined;
    MRR: Awaited<ReturnType<typeof prisma.committee.create>> | undefined;
    WHO: Awaited<ReturnType<typeof prisma.committee.create>> | undefined;
    IAEO: Awaited<ReturnType<typeof prisma.committee.create>> | undefined;
  };

  committees.GV = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "GV",
      name: "Generalversammlung",
      category: "COMMITTEE",
    },
  });

  committees.HA1 = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "HA1",
      name: "Hauptausschuss 1",
      category: "COMMITTEE",
      parentId: committees.GV?.id,
    },
  });

  committees.WiSo = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "WiSo",
      name: "Wirtschaft- und Sozialrat",
      category: "COMMITTEE",
    },
  });

  committees.SR = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "SR",
      name: "Sicherheitsrat",
      category: "COMMITTEE",
    },
  });

  committees.MRR = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "MRR",
      name: "Menschenrechtsrat",
      category: "COMMITTEE",
    },
  });

  committees.WHO = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "WHO",
      name: "Weltgesundheitsversammlung",
      category: "COMMITTEE",
    },
  });

  committees.IAEO = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "IAEO",
      name: "Generalkonferenz der Internationalen Atomenergieorganisation",
      category: "COMMITTEE",
    },
  });

  console.info("\nCreated Committees:");
  console.info(
    `  - Created ${committees.GV.abbreviation} with ID ${committees.GV.id}`,
  );
  console.info(
    `  - Created ${committees.HA1.abbreviation} with ID ${committees.HA1.id}`,
  );
  console.info(
    `  - Created ${committees.WiSo.abbreviation} with ID ${committees.WiSo.id}`,
  );
  console.info(
    `  - Created ${committees.SR.abbreviation} with ID ${committees.SR.id}`,
  );
  console.info(
    `  - Created ${committees.MRR.abbreviation} with ID ${committees.MRR.id}`,
  );
  console.info(
    `  - Created ${committees.WHO.abbreviation} with ID ${committees.WHO.id}`,
  );
  console.info(
    `  - Created ${committees.IAEO.abbreviation} with ID ${committees.IAEO.id}`,
  );

  // Team seeding

  await prisma.conferenceMember.create({
    data: {
      conferenceId: conference.id,
      role: "ADMIN",
    },
  });

  for (let i = 0; i < 21; i++) {
    await prisma.conferenceMember.create({
      data: {
        conferenceId: conference.id,
        role: "CHAIR",
      },
    });
  }

  for (let i = 0; i < 7; i++) {
    await prisma.conferenceMember.create({
      data: {
        conferenceId: conference.id,
        role: "COMMITTEE_ADVISOR",
      },
    });
  }

  console.info("\nCreated Team Pool");

  // Committee seeding

  const agendaItems = [
    "Nachhaltige wirtschaftliche Entwicklung in den am wenigsten entwickelten Ländern",
    "Umgang mit klimatischen Kipppunkten",
    "Globales Erinnern an Kolonialismus",

    "Situation in der Ukraine",
    "Bekämpfung illegaler Waffenlieferungen an nichtstaatliche Akteure",
    "Planetare Verteidigung",

    "Förderung von Kreislaufwirtschaft",
    "Umgang mit klimawandelbedingter Migration",
    "Rolle von künstlicher Intelligenz für die nachhaltige Entwicklung",

    "Aktuelles",
    "Situation in Haiti",
    "Bedeutung natürlicher Ressourcen für bewaffnete Konflikte",

    "Verantwortung von Unternehmen für Menschenrechte entlang globaler Lieferketten",
    "Umsetzung des Rechts auf eine saubere Umwelt",
    "Menschenrechtslage in der Demokratischen Republik Kongo",

    "Verbesserung der psychischen Gesundheitsversorgung",
    "Bekämpfung der Folgeerkranungen von Fehl- und Mangelernährung",
    "Sicherung des Zugangs zu Verhütungsmitteln",

    "Sicherheit kerntechnischer Anlagen in Konfliktgebieten",
    "Auswirkungen von Uranabbau, -nutzung und -lagerung auf indigene Bevölkerungen",
    "Rolle der Kernenergie für die Umsetzung von SDG 7",
  ];

  let i = 0;
  for (const committee of Object.values(committees)) {
    if (committee) {
      for (let j = 0; j < 3; j++) {
        const agendaItem = await prisma.agendaItem.create({
          data: {
            committeeId: committee.id,
            title: agendaItems[i] || "Dummy Agenda Item",
          },
        });
        await prisma.speakersList.createMany({
          data: [
            {
              type: "SPEAKERS_LIST",
              agendaItemId: agendaItem.id,
              speakingTime: 180,
              timeLeft: 180,
            },
            {
              type: "COMMENT_LIST",
              agendaItemId: agendaItem.id,
              speakingTime: 30,
              timeLeft: 30,
            },
          ],
        });
        i++;
      }
    }
  }

  console.info("\nCreated Agenda Items");

  // Delegations
  console.info("\nCreated Delegations:");

  const delegations: () => string[] = () => {
    const selectedCountries: string[] = [];
    while (selectedCountries.length < 20) {
      for (const countryRaw of allCountries) {
        if (
          ["deu", "usa", "fra", "gbr", "rus", "chn"].includes(
            countryRaw.alpha3Code,
          ) ||
          Math.random() > 0.97
        ) {
          if (
            !selectedCountries.includes(countryRaw.alpha3Code) &&
            countryRaw.variant !== $Enums.NationVariant.SPECIAL_PERSON &&
            countryRaw.variant !== $Enums.NationVariant.NON_STATE_ACTOR
          ) {
            selectedCountries.push(countryRaw.alpha3Code);
          }
        }
      }
    }
    selectedCountries.sort();
    return selectedCountries;
  };

  for (const alpha3Code of delegations()) {
    const delegation = await prisma.delegation.create({
      data: {
        conference: { connect: { id: conference.id } },
        nation: { connect: { alpha3Code } },
      },
    });
    console.info(
      `  - Created Delegation for ${alpha3Code} with ID ${delegation.id}`,
    );

    await prisma.committeeMember.create({
      data: {
        committeeId: committees.GV?.id,
        delegationId: delegation.id,
      },
    });

    if (Math.random() > 0.5) {
      await prisma.committeeMember.create({
        data: {
          committeeId: committees.HA1?.id,
          delegationId: delegation.id,
        },
      });
    }

    if (Math.random() > 0.7) {
      await prisma.committeeMember.create({
        data: {
          committeeId: committees.SR?.id,
          delegationId: delegation.id,
        },
      });
    }
  }

  // Non-State Actors
  console.info("\nCreated Non-State Actor CommitteeMemberships:");

  const nonStateActors = await prisma.nation.findMany({
    where: {
      variant: $Enums.NationVariant.NON_STATE_ACTOR,
    },
  });

  for (const nonStateActor of nonStateActors) {
    const delegation = await prisma.delegation.create({
      data: {
        conference: { connect: { id: conference.id } },
        nation: { connect: { alpha3Code: nonStateActor.alpha3Code } },
      },
    });

    for (const committee of Object.values(committees)) {
      if (committee) {
        await prisma.committeeMember.create({
          data: {
            committeeId: committee.id,
            delegationId: delegation.id,
          },
        });
        console.info(
          `  - Created CommitteeMembership for ${nonStateActor.alpha3Code} in ${committee.abbreviation}`,
        );
      }
    }
  }

  // Special Persons
  console.info("\nCreated Special Persons CommitteeMemberships:");

  const specialPersons = await prisma.nation.findMany({
    where: {
      variant: $Enums.NationVariant.SPECIAL_PERSON,
    },
  });

  for (const specialPerson of specialPersons) {
    const delegation = await prisma.delegation.create({
      data: {
        conference: { connect: { id: conference.id } },
        nation: { connect: { alpha3Code: specialPerson.alpha3Code } },
      },
    });

    for (const committee of Object.values(committees)) {
      if (committee) {
        await prisma.committeeMember.create({
          data: {
            committeeId: committee.id,
            delegationId: delegation.id,
          },
        });
        console.info(
          `  - Created CommitteeMembership for ${specialPerson.alpha3Code} in ${committee.abbreviation}`,
        );
      }
    }
  }

  /*
   * ---------------
   *   SimSim Data
   * ---------------
   */

  const simSimConference = await prisma.conference.upsert({
    where: {
      name: "SimSim",
    },
    update: {},
    create: {
      name: "SimSim",
    },
  });

  const simSimCommittees = {} as {
    SimSim1: Awaited<ReturnType<typeof prisma.committee.create>> | undefined;
    SimSim2: Awaited<ReturnType<typeof prisma.committee.create>> | undefined;
  };

  simSimCommittees.SimSim1 = await prisma.committee.create({
    data: {
      conferenceId: simSimConference.id,
      abbreviation: "S1",
      name: "SimSim 1",
      category: "COMMITTEE",
    },
  });

  simSimCommittees.SimSim2 = await prisma.committee.create({
    data: {
      conferenceId: simSimConference.id,
      abbreviation: "S2",
      name: "SimSim 2",
      category: "COMMITTEE",
    },
  });

  await prisma.conferenceMember.create({
    data: {
      conferenceId: simSimConference.id,
      role: "ADMIN",
    },
  });

  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}

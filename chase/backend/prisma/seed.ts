import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const conference = await prisma.conference.upsert({
    where: {
      name: "Dummy Conference",
    },
    update: {},
    create: {
      name: "Dummy Conference",
    },
  });

  // Committees

  const committees: {
    GV: Awaited<ReturnType<typeof prisma.committee.create>> | null;
    HA1: Awaited<ReturnType<typeof prisma.committee.create>> | null;
    SR: Awaited<ReturnType<typeof prisma.committee.create>> | null;
  } = {
    GV: null,
    HA1: null,
    SR: null,
  };

  committees.GV = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "GV",
      name: "Generalversammlung",
      category: "COMMITTEE",
      isSubcommittee: false,
    },
  });

  committees.HA1 = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "HA1",
      name: "Hauptausschuss 1",
      category: "COMMITTEE",
      isSubcommittee: true,
      parentId: committees.GV?.id,
    },
  });

  committees.SR = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "SR",
      name: "Sicherheitsrat",
      category: "COMMITTEE",
      isSubcommittee: false,
    },
  });

  // Team seeding

  type Role =
    | "ADMIN"
    | "CHAIR"
    | "COMMITTEE_ADVISOR"
    | "PARTICIPANT_CARE"
    | "TEAM";

  const roles: Role[] = [
    "ADMIN",
    "CHAIR",
    "CHAIR",
    "CHAIR",
    "CHAIR",
    "CHAIR",
    "CHAIR",
    "CHAIR",
    "CHAIR",
    "CHAIR",
    "COMMITTEE_ADVISOR",
    "COMMITTEE_ADVISOR",
    "COMMITTEE_ADVISOR",
    "PARTICIPANT_CARE",
    "TEAM",
  ];

  for (const element of roles) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({
      firstName: firstName,
      lastName: lastName,
      provider: "dmun.test",
    });

    await prisma.team.create({
      data: {
        conferenceId: conference.id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: element,
      },
    });
  }

  const agendaItems = [
    "Nachhaltige wirtschaftliche Entwicklung in den am wenigsten entwickelten Ländern",
    "Umgang mit klimatischen Kipppunkten",
    "Globales Erinnern an Kolonialismus",

    "Situation in der Ukraine",
    "Bekämpfung illegaler Waffenlieferungen an nichtstaatliche Akteure",
    "Planetare Verteidigung",

    "Aktuelles",
    "Situation in Haiti",
    "Bedeutung natürlicher Ressourcen für bewaffnete Konflikte",
  ];

  let i = 0;
  for (const committee of Object.values(committees)) {
    if (committee) {
      for (let j = 0; j < 3; j++) {
        await prisma.agendaItem.create({
          data: {
            committeeId: committee.id,
            title: agendaItems[i] || "Dummy Agenda Item",
          },
        });
        i++;
      }
    }
  }
  console.info(conference);

  const delegations = [
    "AFG",
    "ALB",
    "DZA",
    "AND",
    "AGO",
    "ATG",
    "ARG",
    "ARM",
    "AUS",
    "AUT",
    "AZE",
    "BHS",
    "BHR",
    "BGD",
    "BRB",
    "BLR",
    "BEL",
    "BLZ",
    "BEN",
    "BTN",
  ];

  for (const delegation of delegations) {
    await prisma.delegation.create({
      data: {
        conferenceId: conference.id,
        alpha3Code: delegation,
      },
    });
  }

  // Assign Chairs and Advisords to Committees

  const chairsToAssign = await prisma.team.findMany({
    where: {
      conferenceId: conference.id,
      role: "CHAIR",
    },
  });

  const advisorsToAssign = await prisma.team.findMany({
    where: {
      conferenceId: conference.id,
      role: "COMMITTEE_ADVISOR",
    },
  });

  let chairCounter = 0;
  let advisorCounter = 0;
  for (const committee of Object.values(committees)) {
    if (committee) {
      for (let i = 0; i < 3; i++) {
        await prisma.team.update({
          where: {
            id: chairsToAssign[chairCounter]?.id,
          },
          data: {
            chair_committeeId: committee.id,
          },
        });
        chairCounter++;
      }
      await prisma.team.update({
        where: {
          id: advisorsToAssign[advisorCounter]?.id,
        },
        data: {
          advisor_committeeId: committee.id,
        },
      });
      advisorCounter++;
    }
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

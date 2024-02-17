// import { faker } from "@faker-js/faker";
import { PrismaClient } from "./generated/client";
const prisma = new PrismaClient();

const allCountries = [
  { alpha3Code: "afg" },
  { alpha3Code: "alb" },
  { alpha3Code: "dza" },
  { alpha3Code: "and" },
  { alpha3Code: "ago" },
  { alpha3Code: "atg" },
  { alpha3Code: "arg" },
  { alpha3Code: "arm" },
  { alpha3Code: "aus" },
  { alpha3Code: "aut" },
  { alpha3Code: "aze" },
  { alpha3Code: "bhs" },
  { alpha3Code: "bhr" },
  { alpha3Code: "bgd" },
  { alpha3Code: "brb" },
  { alpha3Code: "blr" },
  { alpha3Code: "bel" },
  { alpha3Code: "blz" },
  { alpha3Code: "ben" },
  { alpha3Code: "btn" },
  { alpha3Code: "bol" },
  { alpha3Code: "bih" },
  { alpha3Code: "bwa" },
  { alpha3Code: "bra" },
  { alpha3Code: "brn" },
  { alpha3Code: "bgr" },
  { alpha3Code: "bfa" },
  { alpha3Code: "bdi" },
  { alpha3Code: "khm" },
  { alpha3Code: "cmr" },
  { alpha3Code: "can" },
  { alpha3Code: "cpv" },
  { alpha3Code: "caf" },
  { alpha3Code: "tcd" },
  { alpha3Code: "chl" },
  { alpha3Code: "chn" },
  { alpha3Code: "col" },
  { alpha3Code: "com" },
  { alpha3Code: "cog" },
  { alpha3Code: "cod" },
  { alpha3Code: "cri" },
  { alpha3Code: "civ" },
  { alpha3Code: "hrv" },
  { alpha3Code: "cub" },
  { alpha3Code: "cyp" },
  { alpha3Code: "cze" },
  { alpha3Code: "dnk" },
  { alpha3Code: "dji" },
  { alpha3Code: "dma" },
  { alpha3Code: "dom" },
  { alpha3Code: "ecu" },
  { alpha3Code: "egy" },
  { alpha3Code: "slv" },
  { alpha3Code: "gnq" },
  { alpha3Code: "eri" },
  { alpha3Code: "est" },
  { alpha3Code: "eth" },
  { alpha3Code: "fji" },
  { alpha3Code: "fin" },
  { alpha3Code: "fra" },
  { alpha3Code: "gab" },
  { alpha3Code: "gmb" },
  { alpha3Code: "geo" },
  { alpha3Code: "deu" },
  { alpha3Code: "gha" },
  { alpha3Code: "grc" },
  { alpha3Code: "grd" },
  { alpha3Code: "gtm" },
  { alpha3Code: "gin" },
  { alpha3Code: "gnb" },
  { alpha3Code: "guy" },
  { alpha3Code: "hti" },
  { alpha3Code: "hnd" },
  { alpha3Code: "hun" },
  { alpha3Code: "isl" },
  { alpha3Code: "ind" },
  { alpha3Code: "idn" },
  { alpha3Code: "irn" },
  { alpha3Code: "irq" },
  { alpha3Code: "irl" },
  { alpha3Code: "isr" },
  { alpha3Code: "ita" },
  { alpha3Code: "jam" },
  { alpha3Code: "jpn" },
  { alpha3Code: "jor" },
  { alpha3Code: "kaz" },
  { alpha3Code: "ken" },
  { alpha3Code: "kir" },
  { alpha3Code: "prk" },
  { alpha3Code: "kor" },
  { alpha3Code: "kwt" },
  { alpha3Code: "kgz" },
  { alpha3Code: "lao" },
  { alpha3Code: "lva" },
  { alpha3Code: "lbn" },
  { alpha3Code: "lso" },
  { alpha3Code: "lbr" },
  { alpha3Code: "lby" },
  { alpha3Code: "lie" },
  { alpha3Code: "ltu" },
  { alpha3Code: "lux" },
  { alpha3Code: "mkd" },
  { alpha3Code: "mdg" },
  { alpha3Code: "mwi" },
  { alpha3Code: "mys" },
  { alpha3Code: "mdv" },
  { alpha3Code: "mli" },
  { alpha3Code: "mlt" },
  { alpha3Code: "mhl" },
  { alpha3Code: "mrt" },
  { alpha3Code: "mus" },
  { alpha3Code: "mex" },
  { alpha3Code: "fsm" },
  { alpha3Code: "mar" },
  { alpha3Code: "mda" },
  { alpha3Code: "mco" },
  { alpha3Code: "mng" },
  { alpha3Code: "mne" },
  { alpha3Code: "moz" },
  { alpha3Code: "mmr" },
  { alpha3Code: "nam" },
  { alpha3Code: "nru" },
  { alpha3Code: "npl" },
  { alpha3Code: "nld" },
  { alpha3Code: "nzl" },
  { alpha3Code: "nic" },
  { alpha3Code: "ner" },
  { alpha3Code: "nga" },
  { alpha3Code: "nor" },
  { alpha3Code: "omn" },
  { alpha3Code: "pak" },
  { alpha3Code: "plw" },
  { alpha3Code: "pan" },
  { alpha3Code: "png" },
  { alpha3Code: "pry" },
  { alpha3Code: "per" },
  { alpha3Code: "phl" },
  { alpha3Code: "pol" },
  { alpha3Code: "prt" },
  { alpha3Code: "qat" },
  { alpha3Code: "rou" },
  { alpha3Code: "rus" },
  { alpha3Code: "rwa" },
  { alpha3Code: "kna" },
  { alpha3Code: "lca" },
  { alpha3Code: "vct" },
  { alpha3Code: "wsm" },
  { alpha3Code: "smr" },
  { alpha3Code: "stp" },
  { alpha3Code: "sau" },
  { alpha3Code: "sen" },
  { alpha3Code: "srb" },
  { alpha3Code: "syc" },
  { alpha3Code: "sle" },
  { alpha3Code: "sgp" },
  { alpha3Code: "svk" },
  { alpha3Code: "svn" },
  { alpha3Code: "slb" },
  { alpha3Code: "som" },
  { alpha3Code: "zaf" },
  { alpha3Code: "ssd" },
  { alpha3Code: "esp" },
  { alpha3Code: "lka" },
  { alpha3Code: "sdn" },
  { alpha3Code: "sur" },
  { alpha3Code: "swz" },
  { alpha3Code: "swe" },
  { alpha3Code: "che" },
  { alpha3Code: "syr" },
  { alpha3Code: "tjk" },
  { alpha3Code: "tza" },
  { alpha3Code: "tha" },
  { alpha3Code: "tls" },
  { alpha3Code: "tgo" },
  { alpha3Code: "ton" },
  { alpha3Code: "tto" },
  { alpha3Code: "tun" },
  { alpha3Code: "tur" },
  { alpha3Code: "tkm" },
  { alpha3Code: "tuv" },
  { alpha3Code: "uga" },
  { alpha3Code: "ukr" },
  { alpha3Code: "are" },
  { alpha3Code: "gbr" },
  { alpha3Code: "usa" },
  { alpha3Code: "ury" },
  { alpha3Code: "uzb" },
  { alpha3Code: "vut" },
  { alpha3Code: "ven" },
  { alpha3Code: "vnm" },
  { alpha3Code: "yem" },
  { alpha3Code: "zmb" },
  { alpha3Code: "zwe" },
];

const specialPersonData: string[] = ["unm", "unw", "gsm", "gsw", "uno"];

try {
  /*
   * -------------
   *   Base Data
   * -------------
   */

  const countries = await prisma.nation.createMany({
    data: allCountries,
  });
  console.info(`Created ${countries.count} countries as base country data`);

  const specialPersons = await prisma.specialPerson.createMany({
    data: specialPersonData.map((code) => ({ code })),
  });

  console.info(
    `Created ${specialPersons.count} special persons as base special person data`,
  );

  /*
   * -------------
   *   Test Data
   * -------------
   * (only for development)
   *
   */

  const conference = await prisma.conference.upsert({
    where: {
      name: "Dummy Conference",
    },
    update: {},
    create: {
      name: "Dummy Conference",
    },
  });
  console.info("\n----------------\n");
  console.info(`Created a Dummy Conference with the ID ${conference.id}`);

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

  committees.SR = await prisma.committee.create({
    data: {
      conferenceId: conference.id,
      abbreviation: "SR",
      name: "Sicherheitsrat",
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
    `  - Created ${committees.SR.abbreviation} with ID ${committees.SR.id}`,
  );

  // Team seeding

  await prisma.conferenceMember.create({
    data: {
      conferenceId: conference.id,
      role: "ADMIN",
    },
  });

  for (let i = 0; i < 9; i++) {
    await prisma.conferenceMember.create({
      data: {
        conferenceId: conference.id,
        role: "CHAIR",
      },
    });
  }

  for (let i = 0; i < 3; i++) {
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

    "Aktuelles",
    "Situation in Haiti",
    "Bedeutung natürlicher Ressourcen für bewaffnete Konflikte",
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
            },
            {
              type: "COMMENT_LIST",
              agendaItemId: agendaItem.id,
              speakingTime: 30,
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
          ["deu", "usa", "fra"].includes(countryRaw.alpha3Code) ||
          Math.random() > 0.97
        ) {
          selectedCountries.push(countryRaw.alpha3Code);
        }
      }
    }
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

  await prisma.$disconnect();
} catch (e) {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
}

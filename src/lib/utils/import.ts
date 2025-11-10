import { z } from "zod/v4";

export const importDataSchema = z.object({
  $schema: z.string().optional(),
  id: z.string(),
  title: z.string(),
  committees: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      abbreviation: z.string(),
    }),
  ),
  representations: z.array(
    z
      .object({
        id: z.string(),
        representationType: z.enum(["DELEGATION", "NSA", "UN"]),
        alpha3Code: z.string().optional(),
        alpha2Code: z.string().optional(),
        name: z.string().optional(),
        faIcon: z.string().optional(),
        regionalGroup: z
          .enum([
            "AFRICA",
            "ASIA_PACIFIC",
            "EASTERN_EUROPE",
            "LATIN_AMERICA_CARIBBEAN",
            "WESTERN_EUROPE_OTHERS",
          ])
          .optional(),
      })
      .refine(
        (data) =>
          (data.representationType === "DELEGATION" &&
            data.alpha3Code &&
            data.alpha2Code) ||
          (data.representationType === "NSA" && data.name && data.faIcon) ||
          data.representationType === "UN",
      ),
  ),
  conferenceMembers: z.array(
    z.object({
      id: z.string(),
      representationId: z.string(),
    }),
  ),
  committeeMembers: z.array(
    z.object({
      id: z.string(),
      representationId: z.string(),
      committeeId: z.string(),
    }),
  ),
  conferenceUsers: z.array(
    z.object({
      id: z.string(),
      conferenceUserType: z.enum([
        "ADMIN",
        "DELEGATE",
        "NON_STATE_ACTOR",
        "SPECTATOR",
        "TEAM",
      ]),
      userEmail: z.string(),
      //TODO enforce that one has to be set?
      conferenceMemberId: z.string().optional(),
      committeeMemberId: z.string().optional(),
    }),
  ),
  agendaItems: z.array(
    z.object({
      id: z.string().optional(),
      committeeId: z.string(),
      title: z.string(),
    }),
  ),
});

// export interface ImportData {
// 	id: string;
// 	title: string;
// 	committees: Committee[];
// 	representations: Representation[];
// 	conferenceMembers: ConferenceMember[];
// 	committeeMembers: CommitteeMember[];
// 	conferenceUsers: ConferenceUser[];
// 	agendaItems: AgendaItem[];
// }

// export interface Committee {
// 	id: string;
// 	name: string;
// 	abbreviation: string;
// }

// export interface Representation {
// 	id: string;
// 	representationType: string;
// 	alpha3Code?: string;
// 	alpha2Code?: string;
// 	name?: string;
// 	faIcon?: string;
// }

// export interface ConferenceMember {
// 	id: string;
// 	representationId: string;
// }

// export interface CommitteeMember {
// 	id: string;
// 	representationId: string;
// 	committeeId?: string;
// }

// export interface ConferenceUser {
// 	id: string;
// 	conferenceUserType: string;
// 	userEmail: string;
// }

// export interface AgendaItem {
// 	id: string;
// 	committeeId: string;
// 	title: string;
// }

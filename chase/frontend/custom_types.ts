export type Alpha3Code =
  | "afg"
  | "alb"
  | "dza"
  | "and"
  | "ago"
  | "atg"
  | "arg"
  | "arm"
  | "aus"
  | "aut"
  | "aze"
  | "bhs"
  | "bhr"
  | "bgd"
  | "brb"
  | "blr"
  | "bel"
  | "blz"
  | "ben"
  | "btn"
  | "bol"
  | "bih"
  | "bwa"
  | "bra"
  | "brn"
  | "bgr"
  | "bfa"
  | "bdi"
  | "khm"
  | "cmr"
  | "can"
  | "cpv"
  | "caf"
  | "tcd"
  | "chl"
  | "chn"
  | "col"
  | "com"
  | "cog"
  | "cod"
  | "cri"
  | "civ"
  | "hrv"
  | "cub"
  | "cyp"
  | "cze"
  | "dnk"
  | "dji"
  | "dma"
  | "dom"
  | "ecu"
  | "egy"
  | "slv"
  | "gnq"
  | "eri"
  | "est"
  | "eth"
  | "fji"
  | "fin"
  | "fra"
  | "gab"
  | "gmb"
  | "geo"
  | "deu"
  | "gha"
  | "grc"
  | "grd"
  | "gtm"
  | "gin"
  | "gnb"
  | "guy"
  | "hti"
  | "hnd"
  | "hun"
  | "isl"
  | "ind"
  | "idn"
  | "irn"
  | "irq"
  | "irl"
  | "isr"
  | "ita"
  | "jam"
  | "jpn"
  | "jor"
  | "kaz"
  | "ken"
  | "kir"
  | "prk"
  | "kor"
  | "kwt"
  | "kgz"
  | "lao"
  | "lva"
  | "lbn"
  | "lso"
  | "lbr"
  | "lby"
  | "lie"
  | "ltu"
  | "lux"
  | "mkd"
  | "mdg"
  | "mwi"
  | "mys"
  | "mdv"
  | "mli"
  | "mlt"
  | "mhl"
  | "mrt"
  | "mus"
  | "mex"
  | "fsm"
  | "mar"
  | "mda"
  | "mco"
  | "mng"
  | "mne"
  | "moz"
  | "mmr"
  | "nam"
  | "nru"
  | "npl"
  | "nld"
  | "nzl"
  | "nic"
  | "ner"
  | "nga"
  | "nor"
  | "omn"
  | "pak"
  | "plw"
  | "pan"
  | "png"
  | "pry"
  | "per"
  | "phl"
  | "pol"
  | "prt"
  | "qat"
  | "rou"
  | "rus"
  | "rwa"
  | "kna"
  | "lca"
  | "vct"
  | "wsm"
  | "smr"
  | "stp"
  | "sau"
  | "sen"
  | "srb"
  | "syc"
  | "sle"
  | "sgp"
  | "svk"
  | "svn"
  | "slb"
  | "som"
  | "zaf"
  | "ssd"
  | "esp"
  | "lka"
  | "sdn"
  | "sur"
  | "swz"
  | "swe"
  | "che"
  | "syr"
  | "tjk"
  | "tza"
  | "tha"
  | "tls"
  | "tgo"
  | "ton"
  | "tto"
  | "tun"
  | "tur"
  | "tkm"
  | "tuv"
  | "uga"
  | "ukr"
  | "are"
  | "gbr"
  | "usa"
  | "ury"
  | "uzb"
  | "vut"
  | "ven"
  | "vnm"
  | "yem"
  | "zmb"
  | "zwe";

export type UNCodes = "unm" | "unw" | "gsm" | "gsw" | "uno"; // UN-Flag Specials for General Secretary and Guest Speakers (male and female)

export type NASCodes = `nsa_${string}`; // Non-State Actor Prefix and ID

export type OtherCodes = "xxx"; // Code for not found

export type CountryCode = Alpha3Code | UNCodes | NASCodes | OtherCodes;

export interface Speaker {
  entryId: string;
  countryCode: CountryCode;
  customName?: string;
}

export interface CurrentSpeaker {
  entryId: string;
  countryCode: CountryCode;
  customName?: string;
  timer: {
    start: Date;
    durationMilliseconds: number;
    paused: boolean;
  };
}

export interface SpeakersListData {
  listOfAllCountries: CountryCode[];
  currentSpeaker: CurrentSpeaker;
  list: Speaker[];
  closed: boolean;
}

export interface CommitteeStatus {
  status: string;
  until: Date | null;
  category: "formal" | "informal" | "pause" | "suspension";
  currentDebateStep: string;
  nextDebateStep?: string;
}

export interface Document {
  documentId: string;
  topic?: string;
  category: "paper" | "draft" | "adopted";
  shared?: boolean;
  introducedBy: CountryCode;
  sponsors?: string[];
}

export interface Motion {
  motionId: string;
  motionText: string;
  introducedBy: CountryCode;
  status: "open" | "in-voting" | "passed" | "failed";
  voting?: Voting;
}

export type VotingMajority =
  | "simple"
  | "two-thirds"
  | "three-quarters"
  | "consensus"
  | "security-council";

export interface VotingResult {
  country: CountryCode;
  vote: "yes" | "no" | "abstain" | "absent";
}

export interface Voting {
  motionId: string;
  title: string;
  description?: string;
  introducedBy?: CountryCode;
  substantiveVote: boolean;
  votingCountries: CountryCode[];
  majority: VotingMajority;
  votes: VotingResult[];
  outcome?: "passed" | "failed";
}

export interface NormalApiResponse {
  committeeName: string;
  currentTopic: string;
  myCountry: CountryCode;
  speakersList: SpeakersListData;
  commentList: SpeakersListData;
  committeeStatus: CommitteeStatus;
  whiteboardMarkdown: string;
  documents: Document[];
}

import { nationNameAlpha3CodeMapping } from "./nation_name_alpha3code_mappings";
import { mundiParticipants } from "./mundiParticipants";
import chaseExport from "../datasets/chase_conference_export.json";
import chaseNations from "../datasets/chase_nations_export.json";

const combinedNations = chaseNations
	.map((chaseNation) => ({
		...chaseNation,
		name_ger: nationNameAlpha3CodeMapping.find(
			(mapping) => mapping.alpha3code === chaseNation.alpha3Code,
		)?.name_ger,
	}))
	.filter((c) => c.name_ger !== undefined);


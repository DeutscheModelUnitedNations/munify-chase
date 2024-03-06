import { parse } from "papaparse";
import nationMappingFile from "../datasets/nationsToAlpha3Code.csv";

interface Nation {
	name_ger: string;
	alpha3code: string;
}

function parseNationData(data: string[]): Nation {
	return {
		name_ger: data[0],
		alpha3code: data[1].toLowerCase(),
	};
}

export const nationNameAlpha3CodeMapping = (
	parse(await Bun.file(nationMappingFile).text()).data as string[][]
)
	.slice(1) // ignore the headline
	.map((n) => parseNationData(n));


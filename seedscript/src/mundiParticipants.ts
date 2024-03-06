import { parse } from "papaparse";
import mundiParticipantsFile from "../datasets/mundi_participants_export.csv"

interface MundiParticipant {
	name: string;
	delegation: number;
	nation: string;
	/**
	 * E.g. "Delegierte*r"
	 */
	participationType: string;
	committee: string;
	firstName: string;
	lastName: string;
	email1: string;
	email2: string;
	phoneNumber: number;
	mobilePhoneNumber: number;
	address1: string;
	address2: string;
	zipCode: string;
	city: string;
	country: string;
	age: number;
	gender: string;
	title: string;
}

function parsemundiParticipantData(data: string[]): MundiParticipant {
	return {
		name: data[0],
		delegation: parseInt(data[1]),
		nation: data[2],
		participationType: data[3],
		committee: data[4],
		firstName: data[5],
		lastName: data[6],
		email1: data[7],
		email2: data[8],
		phoneNumber: parseInt(data[9]),
		mobilePhoneNumber: parseInt(data[10]),
		address1: data[11],
		address2: data[12],
		zipCode: data[13],
		city: data[14],
		country: data[15],
		age: parseInt(data[16]),
		gender: data[17],
		title: data[18],
	};
}

export const mundiParticipants = (
	parse(await Bun.file(mundiParticipantsFile).text()).data as string[][]
)
	.slice(1) // ignore the headline
	.map((p) => parsemundiParticipantData(p));

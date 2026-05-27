type RepresentationType = 'NSA' | 'DELEGATION' | 'UN';

type Representation = {
	id: string;
	createdAt?: Date;
	updatedAt?: Date;
	type: RepresentationType;
	faIcon?: string | null;
	name?: string | null;
	conferenceId?: string;
	alpha2Code?: string | null;
	alpha3Code?: string | null;
	regionalGroup?: string | null;
};

type Member = {
	id: string;
	[key: string]: unknown;
};

type DefaultRepresentation = Pick<Representation, 'id' | 'createdAt' | 'updatedAt' | 'type'>;
type NSARepresentation = Pick<Representation, 'faIcon' | 'name' | 'conferenceId'> & {
	type: 'NSA';
} & DefaultRepresentation;
type DelegationRepresentation = Pick<Representation, 'faIcon' | 'name' | 'conferenceId'> & {
	type: 'DELEGATION';
} & DefaultRepresentation;
type UNRepresentation = Pick<
	Representation,
	'alpha2Code' | 'alpha3Code' | 'regionalGroup' | 'name'
> & {
	type: 'UN';
} & DefaultRepresentation;

export function isNSAMember<
	T extends Partial<Member> & { representation: Partial<Representation> }
>(input: T): input is T & { representation: NSARepresentation } {
	return input.representation.type === 'NSA';
}

export function isDelegationMember<
	T extends Partial<Member> & { representation: Partial<Representation> }
>(input: T): input is T & { representation: DelegationRepresentation } {
	return input.representation.type === 'DELEGATION';
}

export function isUNMember<T extends Partial<Member> & { representation: Partial<Representation> }>(
	input: T
): input is T & { representation: UNRepresentation } {
	return input.representation.type === 'UN';
}

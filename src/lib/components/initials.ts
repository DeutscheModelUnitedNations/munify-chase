const firstLetter = (value: string | null | undefined) => value?.trim()[0]?.toUpperCase() ?? '';

/** Up to two letters for an avatar: given and family name, else the name, else the email, else `?` */
export function userInitials({
	givenName,
	familyName,
	name,
	email
}: {
	givenName?: string | null;
	familyName?: string | null;
	name?: string | null;
	email?: string | null;
}): string {
	return (
		`${firstLetter(givenName)}${firstLetter(familyName)}` ||
		firstLetter(name) ||
		firstLetter(email) ||
		'?'
	);
}

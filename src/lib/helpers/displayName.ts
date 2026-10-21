type NamedUser = {
	givenName?: string | null;
	familyName?: string | null;
	preferredUsername?: string | null;
	email?: string | null;
};

/** The name shown for a user in navbars: full name, else username, else email */
export function displayNameOf(user: NamedUser | null | undefined): string {
	const fullName = [user?.givenName, user?.familyName].filter(Boolean).join(' ').trim();
	return fullName || user?.preferredUsername || user?.email || '';
}

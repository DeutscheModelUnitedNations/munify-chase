import { configPrivate } from '$config/private';

export function isWhitelistedEmail(email: string) {
	const whitelistEmails = configPrivate.ADMIN_EMAIL_WHITELIST.split(',');
	const whitelistDomains = configPrivate.ADMIN_DOMAIN_WHITELIST.split(',');
	const domain = email.split('@')[1];

	return whitelistEmails.includes(email) || whitelistDomains.includes(domain);
}

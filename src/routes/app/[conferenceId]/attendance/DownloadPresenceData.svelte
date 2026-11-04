<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import toast from 'svelte-french-toast';
	import { withBackendMessage } from '#lib/utils/toast';

	interface Props {
		conferenceTitle?: string;
		conferenceId?: string;
	}

	let { conferenceTitle, conferenceId }: Props = $props();

	let isDownloading = $state(false);

	// The format MUNify Delegator imports (team/import there), described by the schema it serves.
	// Raw presence records only: the delegator decides who attended, so the rules can change
	// without a new export.
	const DELEGATOR_PRESENCE_SCHEMA_URL = 'https://delegator.munify.cloud/schemata/presence';

	async function download() {
		if (!conferenceId) {
			console.warn('Cannot export presence data without conferenceId');
			return;
		}

		isDownloading = true;
		try {
			const conferenceUsers = await client.query.conferenceUsers({
				__args: { where: { conference: { id: { eq: conferenceId } } } },
				id: true,
				userEmail: true,
				conferenceUserType: true,
				committeeMember: {
					id: true,
					committeeId: true,
					representation: {
						id: true,
						alpha2Code: true,
						alpha3Code: true,
						faIcon: true,
						type: true,
						name: true
					}
				},
				conferenceMember: {
					id: true,
					representation: {
						id: true,
						alpha2Code: true,
						alpha3Code: true,
						faIcon: true,
						type: true,
						name: true
					}
				},
				presenceEvents: {
					id: true,
					committeeId: true,
					present: true,
					type: true,
					timestamp: true
				}
			});

			type ConferenceUser = (typeof conferenceUsers)[number];
			type Participant = {
				email: string;
				kind: 'DELEGATE' | 'NSA';
				committeeId: string | null;
				representation: NonNullable<ConferenceUser['committeeMember']>['representation'] | null;
				events: ConferenceUser['presenceEvents'];
			};

			const participants = conferenceUsers.flatMap((u): Participant[] => {
				if (u.conferenceUserType === 'DELEGATE') {
					return [
						{
							email: u.userEmail,
							kind: 'DELEGATE' as const,
							committeeId: u.committeeMember?.committeeId ?? null,
							representation: u.committeeMember?.representation ?? null,
							events: u.presenceEvents
						}
					];
				}
				if (u.conferenceUserType === 'NON_STATE_ACTOR') {
					return [
						{
							email: u.userEmail,
							kind: 'NSA' as const,
							committeeId: null,
							representation: u.conferenceMember?.representation ?? null,
							events: u.presenceEvents
						}
					];
				}
				return [];
			});

			const payload = {
				$schema: DELEGATOR_PRESENCE_SCHEMA_URL,
				exportedAt: new Date().toISOString(),
				conferenceId,
				participants
			};

			const blob = new Blob([JSON.stringify(payload, null, 2)], {
				type: 'application/json'
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${conferenceTitle || 'conference'}-presence-export.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error('Failed to export presence data', err);
			toast.error(withBackendMessage(m.saveError(), err));
		} finally {
			isDownloading = false;
		}
	}
</script>

<button
	class="btn btn-sm btn-ghost gap-2"
	onclick={download}
	disabled={isDownloading || !conferenceId}
	aria-label={m.exportAttendanceData()}
>
	{#if isDownloading}
		<span class="loading loading-spinner loading-xs"></span>
	{:else}
		<i class="fa-duotone fa-download"></i>
	{/if}
	<span class="hidden sm:inline">{m.exportAttendanceData()}</span>
</button>

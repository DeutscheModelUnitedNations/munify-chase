<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import Modal from '$lib/components/Modal.svelte';
	import { promiseToastStrings } from '$lib/utils/toast';
	import toast from 'svelte-french-toast';

	interface Props {
		open: boolean;
		conferenceId: string;
		// When set, edit-mode; when null, insert-mode.
		event: {
			id: string;
			type: 'CHECK_IN' | 'CHECK_OUT';
			committeeId: string;
			conferenceUserId: string;
			timestamp: string | Date;
			note?: string | null;
		} | null;
		onClose: () => void;
	}

	let { open = $bindable(), conferenceId, event, onClose }: Props = $props();

	const conference = await client.liveQuery.conference({
		__args: { id: conferenceId },
		committees: { id: true, name: true, abbreviation: true }
	});

	const nsaUsers = await client.liveQuery.conferenceUsers({
		__args: {
			where: {
				conference: { id: conferenceId },
				conferenceUserType: 'NON_STATE_ACTOR'
			}
		},
		id: true,
		userEmail: true,
		conferenceMember: { representation: { name: true } }
	});

	let conferenceUserId = $state('');
	let committeeId = $state('');
	let type = $state<'CHECK_IN' | 'CHECK_OUT'>('CHECK_IN');
	let timestampLocal = $state(''); // value for <input type="datetime-local">
	let note = $state('');

	function toLocalInput(d: Date) {
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
	}

	$effect(() => {
		if (!open) return;
		if (event) {
			conferenceUserId = event.conferenceUserId;
			committeeId = event.committeeId;
			type = event.type;
			const d = event.timestamp instanceof Date ? event.timestamp : new Date(event.timestamp);
			timestampLocal = toLocalInput(d);
			note = event.note ?? '';
		} else {
			conferenceUserId = '';
			committeeId = '';
			type = 'CHECK_IN';
			timestampLocal = toLocalInput(new Date());
			note = '';
		}
	});

	async function save() {
		if (!conferenceUserId || !committeeId || !timestampLocal) return;
		const timestamp = new Date(timestampLocal);

		if (event) {
			await toast.promise(
				client.mutate.updateNsaPresenceEvent({
					__args: {
						id: event.id,
						timestamp,
						type,
						committeeId,
						note: note || null
					},
					id: true
				}),
				promiseToastStrings(m.nsaAttendance(), 'update')
			);
		} else {
			await toast.promise(
				client.mutate.insertNsaPresenceEvent({
					__args: {
						conferenceUserId,
						committeeId,
						type,
						timestamp,
						note: note || null
					},
					id: true
				}),
				promiseToastStrings(m.nsaAttendance(), 'create')
			);
		}
		onClose();
	}

	async function deleteEvent() {
		if (!event) return;
		if (!confirm(m.confirmDeletePresenceEvent())) return;
		await toast.promise(
			client.mutate.deleteNsaPresenceEvent({ __args: { id: event.id }, id: true }),
			promiseToastStrings(m.nsaAttendance(), 'delete')
		);
		onClose();
	}
</script>

<Modal bind:open>
	<div class="flex flex-col gap-4">
		<header>
			<h2 class="text-2xl font-bold">
				{event ? m.editPresenceEvent() : m.insertPresenceEvent()}
			</h2>
		</header>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">{m.nsaPerson()}</legend>
			<select class="select w-full" bind:value={conferenceUserId} disabled={!!event}>
				<option value="" disabled>{m.selectNsaPerson()}</option>
				{#each nsaUsers ?? [] as u (u.id)}
					<option value={u.id}>
						{u.conferenceMember?.representation?.name ?? u.userEmail} — {u.userEmail}
					</option>
				{/each}
			</select>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">{m.committee()}</legend>
			<select class="select w-full" bind:value={committeeId}>
				<option value="" disabled>{m.selectCommittee()}</option>
				{#each conference?.committees ?? [] as c (c.id)}
					<option value={c.id}>{c.name} ({c.abbreviation})</option>
				{/each}
			</select>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">{m.eventType()}</legend>
			<select class="select w-full" bind:value={type}>
				<option value="CHECK_IN">{m.checkIn()}</option>
				<option value="CHECK_OUT">{m.checkOut()}</option>
			</select>
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">{m.timestamp()}</legend>
			<input type="datetime-local" class="input w-full" bind:value={timestampLocal} />
		</fieldset>

		<fieldset class="fieldset">
			<legend class="fieldset-legend">{m.note()}</legend>
			<input class="input w-full" bind:value={note} />
		</fieldset>

		<div class="flex justify-end gap-2 pt-2">
			{#if event}
				<button class="btn btn-error mr-auto" onclick={deleteEvent}>
					<i class="fas fa-trash mr-1"></i>{m.deleteEntry()}
				</button>
			{/if}
			<button class="btn btn-ghost" onclick={onClose}>{m.abort()}</button>
			<button class="btn btn-primary" onclick={save}>{m.save()}</button>
		</div>
	</div>
</Modal>

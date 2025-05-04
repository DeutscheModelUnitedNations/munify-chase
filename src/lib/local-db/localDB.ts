import Dexie, { type EntityTable } from 'dexie';

interface PresentationShowWhiteboard {
	conferenceId: string;
	enabled: boolean;
}

const localDB = new Dexie('local-db') as Dexie & {
	presentationRoleCall: EntityTable<PresentationShowWhiteboard, 'conferenceId'>;
};

localDB.version(1).stores({
	presentation: '++conferenceId, enabled'
});

export type { PresentationShowWhiteboard };
export { localDB };

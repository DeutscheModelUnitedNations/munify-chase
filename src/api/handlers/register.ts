import './agendaItem';
import './committee';
import './committeeMember';
import './conference';
import './conferenceMember';
import './conferenceUser';
import './representation';
import './speakerOnList';
import './speakersList';
import './time';
import './user';
import './import';
import './presenceEvent';
import './nsaCard';
import './rollCallSession';
import './votingSession';
import './resolutionPaper';
import './paperEditor';
import './paperSponsor';
import './paperShareCode';
import './paperContentSnapshot';
import './resolutionComment';
import './amendment';
import './amendmentSponsor';
import './amendmentReviewItem';
import './operativeClauseVote';
import './requestType';
import './request';
import './ai';
import './statistics';
import './missionControlPulse';
import './instanceLink';
import { building, dev } from '$app/env';
import { buildSchema, clientCreator } from '#api/rumble';
import { writeSchemaFile } from '#api/services/schemaFile';

if (dev || building) {
	await clientCreator({
		outputPath: 'src/lib/api/rumbleClient',
		apiUrl: '/api/graphql',
		useExternalUrqlClient: '../client',
		removeExisting: false,
		autoIncludeIdField: false
	});
	// The linked DELEGATOR generates its client of this API from it (`bun run link:client` there).
	await writeSchemaFile({ schema: buildSchema(), path: 'schema.graphql' });
}

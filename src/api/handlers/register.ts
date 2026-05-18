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
import './presenceChangedTimestamp';
import './nsaPresenceEvent';
import './resolutionPaper';
import './paperSponsor';
import './paperShareCode';
import './displayToken';
import './paperEditor';
import './paperContentSnapshot';
import './resolutionComment';
import './amendment';
import './amendmentSponsor';
import './operativeClauseVote';
import './resolutionVoteResult';

import { building, dev } from '$app/environment';
import { clientCreator } from '$api/rumble';

if (dev || building) {
	await clientCreator({
		outputPath: 'src/lib/api/rumbleClient',
		apiUrl: '/api/graphql',
		useExternalUrqlClient: '../client',
		removeExisting: false,
		autoIncludeIdField: true
	});
}

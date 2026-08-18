import './agendaItem';
import './committee';
import './committeeMember';
import './conference';
import './conferenceMember';
import './conferenceUser';
import './displayDevice';
import './representation';
import './speakerOnList';
import './speakersList';
import './time';
import './user';
import './import';
import './presenceEvent';
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
import './ai';
import './statistics';
import { building, dev } from '$app/environment';
import { clientCreator } from '$api/rumble';

if (dev || building) {
	await clientCreator({
		outputPath: 'src/lib/api/rumbleClient',
		apiUrl: '/api/graphql',
		useExternalUrqlClient: '../client',
		removeExisting: false,
		autoIncludeIdField: false
	});
}

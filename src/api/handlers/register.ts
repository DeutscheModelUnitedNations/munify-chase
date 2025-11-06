import { dev } from '$app/environment';
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
import { clientCreator } from '$api/rumble';

if (dev) {
	clientCreator({
		outputPath: 'src/lib/rumbleClient',
		apiUrl: '/api/graphql'
	});
}

// This file is auto-generated. Do not edit manually.
// @generated
/* eslint-disable */
// biome-ignore-all lint: This file is auto-generated
// biome-ignore-all assist: This file is auto-generated
// biome-ignore-all syntax: This file is auto-generated
import { Client, fetchExchange } from '@urql/core';
import { cacheExchange } from '@urql/exchange-graphcache';
import { nativeDateExchange } from '@m1212e/rumble/client';
import { schema } from './schema';
import { makeLiveQuery, makeMutation, makeSubscription, makeQuery } from '@m1212e/rumble/client';

export type Address = {
	countryCode: String | null;
	locality: String | null;
	postalCode: String | null;
	region: String | null;
	streetAddress: String | null;
};

export type String = string;

export type AddressInput = {
	countryCode: String;
	locality?: String | null | undefined;
	postalCode?: String | null | undefined;
	region?: String | null | undefined;
	streetAddress: String;
};

export type AdministrativestatusEnum = 'DONE' | 'PENDING' | 'PROBLEM';

export type AgeIssue = 'shouldBeSupervisor' | 'shouldNotBeSupervisor' | 'tooOld' | 'tooYoung';

export type AgeNotice = {
	age: Int;
	issue: AgeIssue;
	participantMaxAge: Int | null;
	participantMinAge: Int | null;
	supervisorMinAge: Int | null;
};

export type Int = number;

export type AgeRole = 'participant' | 'supervisor';

export type AgendaItemPaperGroup = {
	agendaItem: () => Committeeagendaitem;
	papers: () => Paper[];
};

export type ApplicationBlocker = {
	ageIssue: AgeIssue | null;
	invalidFields: ProfileField[];
	user: () => User | null;
	userId: ID;
};

export type ID = string;

export type AssignmentSplitPartInput = {
	memberIds?: ID[] | undefined;
};

export type AssignmentexperienceeffectEnum = 'SEATING_ONLY' | 'WISHES_AND_SEATING';

export type AssignmentmarkeffectEnum = 'SEATING_ONLY' | 'WISHES_AND_SEATING';

export type Assignmentreview = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	delegation: (p?: {
		orderBy?: DelegationOrderInputArgument | null | undefined;
		where?: DelegationWhereInputArgument | null | undefined;
	}) => Delegation | null;
	delegationId: ID | null;
	disqualified: Boolean;
	evaluation: Float | null;
	flagged: Boolean;
	id: ID;
	note: String | null;
	prioritizedRole: (p?: {
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole | null;
	prioritizedRoleId: ID | null;
	required: Boolean;
	search_distance: Float | null;
	singleParticipant: (p?: {
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant | null;
	singleParticipantId: ID | null;
	updatedAt: DateTime;
};

export type Boolean = boolean;

export type Float = number;

export type AssignmentreviewOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	delegationId?: SortingParameter | null | undefined;
	disqualified?: SortingParameter | null | undefined;
	evaluation?: SortingParameter | null | undefined;
	flagged?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	note?: SortingParameter | null | undefined;
	prioritizedRoleId?: SortingParameter | null | undefined;
	required?: SortingParameter | null | undefined;
	singleParticipantId?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type AssignmentreviewWhereInputArgument = {
	AND?: AssignmentreviewWhereInputArgument[] | undefined;
	NOT?: AssignmentreviewWhereInputArgument | null | undefined;
	OR?: AssignmentreviewWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	delegation?: DelegationWhereInputArgument | null | undefined;
	delegationId?: IDWhereInputArgument | null | undefined;
	disqualified?: BooleanWhereInputArgument | null | undefined;
	evaluation?: FloatWhereInputArgument | null | undefined;
	flagged?: BooleanWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	note?: StringWhereInputArgument | null | undefined;
	prioritizedRole?: ConferenceroleWhereInputArgument | null | undefined;
	prioritizedRoleId?: IDWhereInputArgument | null | undefined;
	required?: BooleanWhereInputArgument | null | undefined;
	singleParticipant?: SingleparticipantWhereInputArgument | null | undefined;
	singleParticipantId?: IDWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Assignmentsinglerole = {
	createdAt: DateTime;
	id: ID;
	role: (p?: {
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole | null;
	roleId: ID | null;
	search_distance: Float | null;
	singleParticipant: (p?: {
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant;
	singleParticipantId: ID;
	updatedAt: DateTime;
};

export type AssignmentsingleroleOrderInputArgument = {
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	roleId?: SortingParameter | null | undefined;
	singleParticipantId?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type AssignmentsingleroleWhereInputArgument = {
	AND?: AssignmentsingleroleWhereInputArgument[] | undefined;
	NOT?: AssignmentsingleroleWhereInputArgument | null | undefined;
	OR?: AssignmentsingleroleWhereInputArgument[] | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	role?: ConferenceroleWhereInputArgument | null | undefined;
	roleId?: IDWhereInputArgument | null | undefined;
	singleParticipant?: SingleparticipantWhereInputArgument | null | undefined;
	singleParticipantId?: IDWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Assignmentunit = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	id: ID;
	members: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AssignmentunitmemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AssignmentunitmemberWhereInputArgument | null | undefined;
	}) => Assignmentunitmember[];
	role: (p?: {
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole | null;
	roleId: ID | null;
	search_distance: Float | null;
	sourceDelegation: (p?: {
		orderBy?: DelegationOrderInputArgument | null | undefined;
		where?: DelegationWhereInputArgument | null | undefined;
	}) => Delegation | null;
	sourceDelegationId: ID | null;
	sourceSingleParticipant: (p?: {
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant | null;
	sourceSingleParticipantId: ID | null;
	updatedAt: DateTime;
};

export type AssignmentunitOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	roleId?: SortingParameter | null | undefined;
	sourceDelegationId?: SortingParameter | null | undefined;
	sourceSingleParticipantId?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type AssignmentunitWhereInputArgument = {
	AND?: AssignmentunitWhereInputArgument[] | undefined;
	NOT?: AssignmentunitWhereInputArgument | null | undefined;
	OR?: AssignmentunitWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	members?: AssignmentunitmemberWhereInputArgument | null | undefined;
	role?: ConferenceroleWhereInputArgument | null | undefined;
	roleId?: IDWhereInputArgument | null | undefined;
	sourceDelegation?: DelegationWhereInputArgument | null | undefined;
	sourceDelegationId?: IDWhereInputArgument | null | undefined;
	sourceSingleParticipant?: SingleparticipantWhereInputArgument | null | undefined;
	sourceSingleParticipantId?: IDWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Assignmentunitmember = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	createdAt: DateTime;
	delegationMember: (p?: {
		orderBy?: DelegationmemberOrderInputArgument | null | undefined;
		where?: DelegationmemberWhereInputArgument | null | undefined;
	}) => Delegationmember;
	delegationMemberId: ID;
	id: ID;
	search_distance: Float | null;
	unit: (p?: {
		orderBy?: AssignmentunitOrderInputArgument | null | undefined;
		where?: AssignmentunitWhereInputArgument | null | undefined;
	}) => Assignmentunit;
	unitId: ID;
	updatedAt: DateTime;
};

export type AssignmentunitmemberOrderInputArgument = {
	createdAt?: SortingParameter | null | undefined;
	delegationMemberId?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	unitId?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type AssignmentunitmemberWhereInputArgument = {
	AND?: AssignmentunitmemberWhereInputArgument[] | undefined;
	NOT?: AssignmentunitmemberWhereInputArgument | null | undefined;
	OR?: AssignmentunitmemberWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	delegationMember?: DelegationmemberWhereInputArgument | null | undefined;
	delegationMemberId?: IDWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	unit?: AssignmentunitWhereInputArgument | null | undefined;
	unitId?: IDWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Assignmentweights = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	experienceEffect: AssignmentexperienceeffectEnum;
	experienceModifier: Float;
	id: ID;
	markBonus: Float;
	markEffect: AssignmentmarkeffectEnum;
	nullRating: Float;
	ratingFactor: Float;
	search_distance: Float | null;
	updatedAt: DateTime;
};

export type AssignmentweightsOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	experienceEffect?: SortingParameter | null | undefined;
	experienceModifier?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	markBonus?: SortingParameter | null | undefined;
	markEffect?: SortingParameter | null | undefined;
	nullRating?: SortingParameter | null | undefined;
	ratingFactor?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type AssignmentweightsWhereInputArgument = {
	AND?: AssignmentweightsWhereInputArgument[] | undefined;
	NOT?: AssignmentweightsWhereInputArgument | null | undefined;
	OR?: AssignmentweightsWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	experienceEffect?: AssignmentexperienceeffectEnum | null | undefined;
	experienceModifier?: FloatWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	markBonus?: FloatWhereInputArgument | null | undefined;
	markEffect?: AssignmentmarkeffectEnum | null | undefined;
	nullRating?: FloatWhereInputArgument | null | undefined;
	ratingFactor?: FloatWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Attendanceentry = {
	checkPassed: Boolean | null;
	conferenceParticipant: (p?: {
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant;
	conferenceParticipantId: ID;
	createdAt: DateTime;
	id: ID;
	recordedBy: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	recordedById: ID;
	search_distance: Float | null;
	session: (p?: {
		orderBy?: AttendancesessionOrderInputArgument | null | undefined;
		where?: AttendancesessionWhereInputArgument | null | undefined;
	}) => Attendancesession;
	sessionId: ID;
	timestamp: DateTime;
	updatedAt: DateTime;
};

export type AttendanceentryOrderInputArgument = {
	checkPassed?: SortingParameter | null | undefined;
	conferenceParticipantId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	recordedById?: SortingParameter | null | undefined;
	sessionId?: SortingParameter | null | undefined;
	timestamp?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type AttendanceentryWhereInputArgument = {
	AND?: AttendanceentryWhereInputArgument[] | undefined;
	NOT?: AttendanceentryWhereInputArgument | null | undefined;
	OR?: AttendanceentryWhereInputArgument[] | undefined;
	checkPassed?: BooleanWhereInputArgument | null | undefined;
	conferenceParticipant?: ConferenceparticipantWhereInputArgument | null | undefined;
	conferenceParticipantId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	recordedBy?: UserWhereInputArgument | null | undefined;
	recordedById?: IDWhereInputArgument | null | undefined;
	session?: AttendancesessionWhereInputArgument | null | undefined;
	sessionId?: IDWhereInputArgument | null | undefined;
	timestamp?: DateTimeWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Attendancesession = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	createdBy: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	createdById: ID;
	endedAt: DateTime | null;
	entries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AttendanceentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AttendanceentryWhereInputArgument | null | undefined;
	}) => Attendanceentry[];
	entryCount: Int;
	id: ID;
	mode: AttendancesessionmodeEnum;
	occasion: String;
	search_distance: Float | null;
	showOnCertificate: Boolean;
	startedAt: DateTime;
	surveyOptions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyoptionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyoptionWhereInputArgument | null | undefined;
	}) => Surveyoption[];
	updatedAt: DateTime;
};

export type AttendancesessionOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	createdById?: SortingParameter | null | undefined;
	endedAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	mode?: SortingParameter | null | undefined;
	occasion?: SortingParameter | null | undefined;
	showOnCertificate?: SortingParameter | null | undefined;
	startedAt?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type AttendancesessionWhereInputArgument = {
	AND?: AttendancesessionWhereInputArgument[] | undefined;
	NOT?: AttendancesessionWhereInputArgument | null | undefined;
	OR?: AttendancesessionWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	createdBy?: UserWhereInputArgument | null | undefined;
	createdById?: IDWhereInputArgument | null | undefined;
	endedAt?: DateTimeWhereInputArgument | null | undefined;
	entries?: AttendanceentryWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	mode?: AttendancesessionmodeEnum | null | undefined;
	occasion?: StringWhereInputArgument | null | undefined;
	showOnCertificate?: BooleanWhereInputArgument | null | undefined;
	startedAt?: DateTimeWhereInputArgument | null | undefined;
	surveyOptions?: SurveyoptionWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type AttendancesessionmodeEnum = 'CHECK' | 'RECORD';

export type BigInt = unknown;

export type BigIntWhereInputArgument = {
	AND?: BigIntWhereInputArgument[] | undefined;
	NOT?: BigIntWhereInputArgument | null | undefined;
	OR?: BigIntWhereInputArgument[] | undefined;
	eq?: BigInt | null | undefined;
	gt?: BigInt | null | undefined;
	gte?: BigInt | null | undefined;
	in?: BigInt[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	lt?: BigInt | null | undefined;
	lte?: BigInt | null | undefined;
	ne?: BigInt | null | undefined;
	notIn?: BigInt[] | undefined;
};

export type BooleanWhereInputArgument = {
	AND?: BooleanWhereInputArgument[] | undefined;
	NOT?: BooleanWhereInputArgument | null | undefined;
	OR?: BooleanWhereInputArgument[] | undefined;
	arrayContained?: Boolean[] | undefined;
	arrayContains?: Boolean[] | undefined;
	arrayOverlaps?: Boolean[] | undefined;
	eq?: Boolean | null | undefined;
	in?: Boolean[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	ne?: Boolean | null | undefined;
	notIn?: Boolean[] | undefined;
};

export type Bytes = unknown;

export type Calendarday = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	date: Date;
	entries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendarentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendarentryWhereInputArgument | null | undefined;
	}) => Calendarentry[];
	id: ID;
	name: String;
	search_distance: Float | null;
	tracks: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendartrackOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendartrackWhereInputArgument | null | undefined;
	}) => Calendartrack[];
	updatedAt: DateTime;
};

export type CalendardayOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	date?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	name?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type CalendardayWhereInputArgument = {
	AND?: CalendardayWhereInputArgument[] | undefined;
	NOT?: CalendardayWhereInputArgument | null | undefined;
	OR?: CalendardayWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	date?: DateWhereInputArgument | null | undefined;
	entries?: CalendarentryWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	name?: StringWhereInputArgument | null | undefined;
	tracks?: CalendartrackWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Calendarentry = {
	calendarDay: (p?: {
		orderBy?: CalendardayOrderInputArgument | null | undefined;
		where?: CalendardayWhereInputArgument | null | undefined;
	}) => Calendarday;
	calendarDayId: ID;
	color: CalendarentrycolorEnum;
	createdAt: DateTime;
	description: String | null;
	endTime: DateTime;
	icon: String | null;
	id: ID;
	name: String;
	place: (p?: {
		orderBy?: PlaceOrderInputArgument | null | undefined;
		where?: PlaceWhereInputArgument | null | undefined;
	}) => Place | null;
	placeId: ID | null;
	room: String | null;
	search_distance: Float | null;
	startTime: DateTime;
	surveyOptions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyoptionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyoptionWhereInputArgument | null | undefined;
	}) => Surveyoption[];
	tracks: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendartrackOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendartrackWhereInputArgument | null | undefined;
	}) => Calendartrack[];
	updatedAt: DateTime;
};

export type CalendarentryOrderInputArgument = {
	calendarDayId?: SortingParameter | null | undefined;
	color?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	description?: SortingParameter | null | undefined;
	endTime?: SortingParameter | null | undefined;
	icon?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	name?: SortingParameter | null | undefined;
	placeId?: SortingParameter | null | undefined;
	room?: SortingParameter | null | undefined;
	startTime?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type CalendarentryWhereInputArgument = {
	AND?: CalendarentryWhereInputArgument[] | undefined;
	NOT?: CalendarentryWhereInputArgument | null | undefined;
	OR?: CalendarentryWhereInputArgument[] | undefined;
	calendarDay?: CalendardayWhereInputArgument | null | undefined;
	calendarDayId?: IDWhereInputArgument | null | undefined;
	color?: CalendarentrycolorEnum | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	description?: StringWhereInputArgument | null | undefined;
	endTime?: DateTimeWhereInputArgument | null | undefined;
	icon?: StringWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	name?: StringWhereInputArgument | null | undefined;
	place?: PlaceWhereInputArgument | null | undefined;
	placeId?: IDWhereInputArgument | null | undefined;
	room?: StringWhereInputArgument | null | undefined;
	startTime?: DateTimeWhereInputArgument | null | undefined;
	surveyOptions?: SurveyoptionWhereInputArgument | null | undefined;
	tracks?: CalendartrackWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type CalendarentrycolorEnum =
	'BREAK' | 'CEREMONY' | 'HIGHLIGHT' | 'INFO' | 'LOGISTICS' | 'SESSION' | 'SOCIAL' | 'WORKSHOP';

export type Calendartrack = {
	calendarDays: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendardayOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendardayWhereInputArgument | null | undefined;
	}) => Calendarday[];
	committees: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CommitteeOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CommitteeWhereInputArgument | null | undefined;
	}) => Committee[];
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	conferenceRoles: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole[];
	createdAt: DateTime;
	description: String | null;
	entries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendarentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendarentryWhereInputArgument | null | undefined;
	}) => Calendarentry[];
	id: ID;
	name: String;
	search_distance: Float | null;
	sortOrder: Int;
	updatedAt: DateTime;
};

export type CalendartrackOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	description?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	name?: SortingParameter | null | undefined;
	sortOrder?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type CalendartrackWhereInputArgument = {
	AND?: CalendartrackWhereInputArgument[] | undefined;
	NOT?: CalendartrackWhereInputArgument | null | undefined;
	OR?: CalendartrackWhereInputArgument[] | undefined;
	calendarDays?: CalendardayWhereInputArgument | null | undefined;
	committees?: CommitteeWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	conferenceRoles?: ConferenceroleWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	description?: StringWhereInputArgument | null | undefined;
	entries?: CalendarentryWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	name?: StringWhereInputArgument | null | undefined;
	sortOrder?: IntWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Certificate = {
	code: String | null;
	fullName: String | null;
	sessions: String[];
};

export type ChasePresence = {
	conferenceId: ID;
	exportedAt: String;
	participants: () => ChasePresenceParticipant[];
};

export type ChasePresenceEvent = {
	committeeId: ID;
	id: ID;
	present: Boolean;
	timestamp: String;
	type: String;
};

export type ChasePresenceParticipant = {
	committeeId: ID | null;
	email: String;
	events: () => ChasePresenceEvent[];
	kind: String;
	representation: () => ChasePresenceRepresentation | null;
};

export type ChasePresenceRepresentation = {
	alpha2Code: String | null;
	alpha3Code: String | null;
	icon: String | null;
	id: ID;
	name: String | null;
	type: String;
};

export type CollectiveGroup = {
	key: String;
	members: () => CollectiveGroupMember[];
	school: () => CollectiveGroupSchool;
	singleParticipantIds: ID[];
	size: Int;
	supervisorId: ID;
};

export type CollectiveGroupMember = {
	delegationId: ID;
	delegationMemberId: ID;
};

export type CollectiveGroupSchool = {
	id: ID;
	isForeignSchool: Boolean;
	name: String;
};

export type Committee = {
	abbreviation: String;
	agendaItems: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CommitteeagendaitemOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CommitteeagendaitemWhereInputArgument | null | undefined;
	}) => Committeeagendaitem[];
	calendarTracks: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendartrackOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendartrackWhereInputArgument | null | undefined;
	}) => Calendartrack[];
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	delegationMembers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationmemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationmemberWhereInputArgument | null | undefined;
	}) => Delegationmember[];
	id: ID;
	name: String;
	numOfSeatsPerDelegation: Int;
	regionalBaseline: RegionalbaselineEnum;
	regionalBaselineTargets: Int[];
	resolutionHeadline: String | null;
	resolutions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ResolutionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ResolutionWhereInputArgument | null | undefined;
	}) => Resolution[];
	roles: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole[];
	search_distance: Float | null;
	updatedAt: DateTime;
};

export type CommitteeAssignmentInput = {
	committeeId?: ID | null | undefined;
	delegationMemberId: ID;
};

export type CommitteeOrderInputArgument = {
	abbreviation?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	name?: SortingParameter | null | undefined;
	numOfSeatsPerDelegation?: SortingParameter | null | undefined;
	regionalBaseline?: SortingParameter | null | undefined;
	regionalBaselineTargets?: SortingParameter | null | undefined;
	resolutionHeadline?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type CommitteePaperGroup = {
	agendaItems: () => AgendaItemPaperGroup[];
	committee: () => Committee;
};

export type CommitteeWhereInputArgument = {
	AND?: CommitteeWhereInputArgument[] | undefined;
	NOT?: CommitteeWhereInputArgument | null | undefined;
	OR?: CommitteeWhereInputArgument[] | undefined;
	abbreviation?: StringWhereInputArgument | null | undefined;
	agendaItems?: CommitteeagendaitemWhereInputArgument | null | undefined;
	calendarTracks?: CalendartrackWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	delegationMembers?: DelegationmemberWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	name?: StringWhereInputArgument | null | undefined;
	numOfSeatsPerDelegation?: IntWhereInputArgument | null | undefined;
	regionalBaseline?: RegionalbaselineEnum | null | undefined;
	regionalBaselineTargets?: IntArrayWhereInputArgument | null | undefined;
	resolutionHeadline?: StringWhereInputArgument | null | undefined;
	resolutions?: ResolutionWhereInputArgument | null | undefined;
	roles?: ConferenceroleWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Committeeagendaitem = {
	committee: (p?: {
		orderBy?: CommitteeOrderInputArgument | null | undefined;
		where?: CommitteeWhereInputArgument | null | undefined;
	}) => Committee;
	committeeId: ID;
	createdAt: DateTime;
	id: ID;
	papers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaperOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaperWhereInputArgument | null | undefined;
	}) => Paper[];
	reviewHelpStatus: ReviewhelpstatusEnum;
	search_distance: Float | null;
	teaserText: String | null;
	title: String;
	updatedAt: DateTime;
};

export type CommitteeagendaitemOrderInputArgument = {
	committeeId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	reviewHelpStatus?: SortingParameter | null | undefined;
	teaserText?: SortingParameter | null | undefined;
	title?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type CommitteeagendaitemWhereInputArgument = {
	AND?: CommitteeagendaitemWhereInputArgument[] | undefined;
	NOT?: CommitteeagendaitemWhereInputArgument | null | undefined;
	OR?: CommitteeagendaitemWhereInputArgument[] | undefined;
	committee?: CommitteeWhereInputArgument | null | undefined;
	committeeId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	papers?: PaperWhereInputArgument | null | undefined;
	reviewHelpStatus?: ReviewhelpstatusEnum | null | undefined;
	teaserText?: StringWhereInputArgument | null | undefined;
	title?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Conference = {
	WaitingListEntry: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: WaitinglistentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: WaitinglistentryWhereInputArgument | null | undefined;
	}) => Waitinglistentry[];
	applicationDeadline: DateTime;
	assignmentReleased: Boolean;
	assignmentReleasedAt: DateTime | null;
	bankAccountHolder: String | null;
	bankName: String | null;
	bic: String | null;
	calendarDays: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendardayOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendardayWhereInputArgument | null | undefined;
	}) => Calendarday[];
	calendarTracks: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendartrackOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendartrackWhereInputArgument | null | undefined;
	}) => Calendartrack[];
	certificateFile: (p?: {
		orderBy?: StoredfileOrderInputArgument | null | undefined;
		where?: StoredfileWhereInputArgument | null | undefined;
	}) => Storedfile | null;
	certificateFileId: ID | null;
	committees: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CommitteeOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CommitteeWhereInputArgument | null | undefined;
	}) => Committee[];
	conferenceParticipants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant[];
	conferenceSupervisors: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferencesupervisorOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferencesupervisorWhereInputArgument | null | undefined;
	}) => Conferencesupervisor[];
	contractFile: (p?: {
		orderBy?: StoredfileOrderInputArgument | null | undefined;
		where?: StoredfileWhereInputArgument | null | undefined;
	}) => Storedfile | null;
	contractFileId: ID | null;
	createdAt: DateTime;
	currency: String | null;
	delegationMembers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationmemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationmemberWhereInputArgument | null | undefined;
	}) => Delegationmember[];
	delegations: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationWhereInputArgument | null | undefined;
	}) => Delegation[];
	documentLayouts: JSON | null;
	emailsPerSecond: Int | null;
	emblemFile: (p?: {
		orderBy?: StoredfileOrderInputArgument | null | undefined;
		where?: StoredfileWhereInputArgument | null | undefined;
	}) => Storedfile | null;
	emblemFileId: ID | null;
	endConference: DateTime;
	feeAmount: Float | null;
	guardianConsentFile: (p?: {
		orderBy?: StoredfileOrderInputArgument | null | undefined;
		where?: StoredfileWhereInputArgument | null | undefined;
	}) => Storedfile | null;
	guardianConsentFileId: ID | null;
	iban: String | null;
	id: ID;
	imageFile: (p?: {
		orderBy?: StoredfileOrderInputArgument | null | undefined;
		where?: StoredfileWhereInputArgument | null | undefined;
	}) => Storedfile | null;
	imageFileId: ID | null;
	info: String | null;
	isOpenPaperSubmission: Boolean;
	language: String | null;
	linkToPaperInbox: String | null;
	linkToPreparationGuide: String | null;
	linkToServicesPage: String | null;
	linkToTeamWiki: String | null;
	location: String | null;
	logoFile: (p?: {
		orderBy?: StoredfileOrderInputArgument | null | undefined;
		where?: StoredfileWhereInputArgument | null | undefined;
	}) => Storedfile | null;
	logoFileId: ID | null;
	longTitle: String | null;
	maxCollectiveGroupSize: Int | null;
	maxGuaranteedSeatsPerForeignSchool: Int | null;
	mcpEnabled: Boolean;
	mediaConsentFile: (p?: {
		orderBy?: StoredfileOrderInputArgument | null | undefined;
		where?: StoredfileWhereInputArgument | null | undefined;
	}) => Storedfile | null;
	mediaConsentFileId: ID | null;
	nametagBinCount: Int;
	nextDocumentNumber: Int;
	papers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaperOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaperWhereInputArgument | null | undefined;
	}) => Paper[];
	participantMaxAge: Int | null;
	participantMinAge: Int | null;
	paymentTransactions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaymenttransactionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaymenttransactionWhereInputArgument | null | undefined;
	}) => Paymenttransaction[];
	places: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PlaceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PlaceWhereInputArgument | null | undefined;
	}) => Place[];
	postalApartment: String | null;
	postalCity: String | null;
	postalCountry: String | null;
	postalName: String | null;
	postalStreet: String | null;
	postalZip: String | null;
	registrationDeadlineGracePeriodMinutes: Int;
	resolutions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ResolutionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ResolutionWhereInputArgument | null | undefined;
	}) => Resolution[];
	roles: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole[];
	schools: () => ConferenceSchools[];
	search_distance: Float | null;
	showCalendar: Boolean;
	showInfoExpanded: Boolean;
	singleParticipants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant[];
	startConference: DateTime;
	state: ConferencestateEnum;
	supervisorMinAge: Int | null;
	surveyQuestions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyquestionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyquestionWhereInputArgument | null | undefined;
	}) => Surveyquestion[];
	teamMemberInvitations: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TeammemberinvitationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TeammemberinvitationWhereInputArgument | null | undefined;
	}) => Teammemberinvitation[];
	teamMembers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TeammemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TeammemberWhereInputArgument | null | undefined;
	}) => Teammember[];
	termsAndConditionsFile: (p?: {
		orderBy?: StoredfileOrderInputArgument | null | undefined;
		where?: StoredfileWhereInputArgument | null | undefined;
	}) => Storedfile | null;
	termsAndConditionsFileId: ID | null;
	timezone: String;
	title: String;
	totalParticipants: Int;
	totalSeats: Int;
	unlockPayments: Boolean;
	unlockPostals: Boolean;
	updatedAt: DateTime;
	waitingListLength: Int;
	website: String | null;
};

export type ConferenceOrderInputArgument = {
	applicationDeadline?: SortingParameter | null | undefined;
	assignmentReleased?: SortingParameter | null | undefined;
	assignmentReleasedAt?: SortingParameter | null | undefined;
	bankAccountHolder?: SortingParameter | null | undefined;
	bankName?: SortingParameter | null | undefined;
	bic?: SortingParameter | null | undefined;
	certificateFileId?: SortingParameter | null | undefined;
	contractFileId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	currency?: SortingParameter | null | undefined;
	documentLayouts?: SortingParameter | null | undefined;
	emailsPerSecond?: SortingParameter | null | undefined;
	emblemFileId?: SortingParameter | null | undefined;
	endConference?: SortingParameter | null | undefined;
	feeAmount?: SortingParameter | null | undefined;
	guardianConsentFileId?: SortingParameter | null | undefined;
	iban?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	imageFileId?: SortingParameter | null | undefined;
	info?: SortingParameter | null | undefined;
	isOpenPaperSubmission?: SortingParameter | null | undefined;
	language?: SortingParameter | null | undefined;
	linkToPaperInbox?: SortingParameter | null | undefined;
	linkToPreparationGuide?: SortingParameter | null | undefined;
	linkToServicesPage?: SortingParameter | null | undefined;
	linkToTeamWiki?: SortingParameter | null | undefined;
	location?: SortingParameter | null | undefined;
	logoFileId?: SortingParameter | null | undefined;
	longTitle?: SortingParameter | null | undefined;
	maxCollectiveGroupSize?: SortingParameter | null | undefined;
	maxGuaranteedSeatsPerForeignSchool?: SortingParameter | null | undefined;
	mcpEnabled?: SortingParameter | null | undefined;
	mediaConsentFileId?: SortingParameter | null | undefined;
	nametagBinCount?: SortingParameter | null | undefined;
	participantMaxAge?: SortingParameter | null | undefined;
	participantMinAge?: SortingParameter | null | undefined;
	postalApartment?: SortingParameter | null | undefined;
	postalCity?: SortingParameter | null | undefined;
	postalCountry?: SortingParameter | null | undefined;
	postalName?: SortingParameter | null | undefined;
	postalStreet?: SortingParameter | null | undefined;
	postalZip?: SortingParameter | null | undefined;
	registrationDeadlineGracePeriodMinutes?: SortingParameter | null | undefined;
	showCalendar?: SortingParameter | null | undefined;
	showInfoExpanded?: SortingParameter | null | undefined;
	startConference?: SortingParameter | null | undefined;
	state?: SortingParameter | null | undefined;
	supervisorMinAge?: SortingParameter | null | undefined;
	termsAndConditionsFileId?: SortingParameter | null | undefined;
	timezone?: SortingParameter | null | undefined;
	title?: SortingParameter | null | undefined;
	unlockPayments?: SortingParameter | null | undefined;
	unlockPostals?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	website?: SortingParameter | null | undefined;
};

export type ConferenceSchools = {
	delegationCount: Int;
	delegationMembers: Int;
	school: String;
	schoolId: ID;
	singleParticipants: Int;
	sumParticipants: Int;
};

export type ConferenceWhereInputArgument = {
	AND?: ConferenceWhereInputArgument[] | undefined;
	NOT?: ConferenceWhereInputArgument | null | undefined;
	OR?: ConferenceWhereInputArgument[] | undefined;
	WaitingListEntry?: WaitinglistentryWhereInputArgument | null | undefined;
	applicationDeadline?: DateTimeWhereInputArgument | null | undefined;
	assignmentReleased?: BooleanWhereInputArgument | null | undefined;
	assignmentReleasedAt?: DateTimeWhereInputArgument | null | undefined;
	bankAccountHolder?: StringWhereInputArgument | null | undefined;
	bankName?: StringWhereInputArgument | null | undefined;
	bic?: StringWhereInputArgument | null | undefined;
	calendarDays?: CalendardayWhereInputArgument | null | undefined;
	calendarTracks?: CalendartrackWhereInputArgument | null | undefined;
	certificateFile?: StoredfileWhereInputArgument | null | undefined;
	certificateFileId?: IDWhereInputArgument | null | undefined;
	committees?: CommitteeWhereInputArgument | null | undefined;
	conferenceParticipants?: ConferenceparticipantWhereInputArgument | null | undefined;
	conferenceSupervisors?: ConferencesupervisorWhereInputArgument | null | undefined;
	contractFile?: StoredfileWhereInputArgument | null | undefined;
	contractFileId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	currency?: StringWhereInputArgument | null | undefined;
	delegationMembers?: DelegationmemberWhereInputArgument | null | undefined;
	delegations?: DelegationWhereInputArgument | null | undefined;
	documentLayouts?: JSONWhereInputArgument | null | undefined;
	emailsPerSecond?: IntWhereInputArgument | null | undefined;
	emblemFile?: StoredfileWhereInputArgument | null | undefined;
	emblemFileId?: IDWhereInputArgument | null | undefined;
	endConference?: DateTimeWhereInputArgument | null | undefined;
	feeAmount?: FloatWhereInputArgument | null | undefined;
	guardianConsentFile?: StoredfileWhereInputArgument | null | undefined;
	guardianConsentFileId?: IDWhereInputArgument | null | undefined;
	iban?: StringWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	imageFile?: StoredfileWhereInputArgument | null | undefined;
	imageFileId?: IDWhereInputArgument | null | undefined;
	info?: StringWhereInputArgument | null | undefined;
	isOpenPaperSubmission?: BooleanWhereInputArgument | null | undefined;
	language?: StringWhereInputArgument | null | undefined;
	linkToPaperInbox?: StringWhereInputArgument | null | undefined;
	linkToPreparationGuide?: StringWhereInputArgument | null | undefined;
	linkToServicesPage?: StringWhereInputArgument | null | undefined;
	linkToTeamWiki?: StringWhereInputArgument | null | undefined;
	location?: StringWhereInputArgument | null | undefined;
	logoFile?: StoredfileWhereInputArgument | null | undefined;
	logoFileId?: IDWhereInputArgument | null | undefined;
	longTitle?: StringWhereInputArgument | null | undefined;
	maxCollectiveGroupSize?: IntWhereInputArgument | null | undefined;
	maxGuaranteedSeatsPerForeignSchool?: IntWhereInputArgument | null | undefined;
	mcpEnabled?: BooleanWhereInputArgument | null | undefined;
	mediaConsentFile?: StoredfileWhereInputArgument | null | undefined;
	mediaConsentFileId?: IDWhereInputArgument | null | undefined;
	nametagBinCount?: IntWhereInputArgument | null | undefined;
	papers?: PaperWhereInputArgument | null | undefined;
	participantMaxAge?: IntWhereInputArgument | null | undefined;
	participantMinAge?: IntWhereInputArgument | null | undefined;
	paymentTransactions?: PaymenttransactionWhereInputArgument | null | undefined;
	places?: PlaceWhereInputArgument | null | undefined;
	postalApartment?: StringWhereInputArgument | null | undefined;
	postalCity?: StringWhereInputArgument | null | undefined;
	postalCountry?: StringWhereInputArgument | null | undefined;
	postalName?: StringWhereInputArgument | null | undefined;
	postalStreet?: StringWhereInputArgument | null | undefined;
	postalZip?: StringWhereInputArgument | null | undefined;
	registrationDeadlineGracePeriodMinutes?: IntWhereInputArgument | null | undefined;
	resolutions?: ResolutionWhereInputArgument | null | undefined;
	roles?: ConferenceroleWhereInputArgument | null | undefined;
	showCalendar?: BooleanWhereInputArgument | null | undefined;
	showInfoExpanded?: BooleanWhereInputArgument | null | undefined;
	singleParticipants?: SingleparticipantWhereInputArgument | null | undefined;
	startConference?: DateTimeWhereInputArgument | null | undefined;
	state?: ConferencestateEnum | null | undefined;
	supervisorMinAge?: IntWhereInputArgument | null | undefined;
	surveyQuestions?: SurveyquestionWhereInputArgument | null | undefined;
	teamMemberInvitations?: TeammemberinvitationWhereInputArgument | null | undefined;
	teamMembers?: TeammemberWhereInputArgument | null | undefined;
	termsAndConditionsFile?: StoredfileWhereInputArgument | null | undefined;
	termsAndConditionsFileId?: IDWhereInputArgument | null | undefined;
	timezone?: StringWhereInputArgument | null | undefined;
	title?: StringWhereInputArgument | null | undefined;
	unlockPayments?: BooleanWhereInputArgument | null | undefined;
	unlockPostals?: BooleanWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	website?: StringWhereInputArgument | null | undefined;
};

export type Conferenceemailfooter = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	id: ID;
	locale: String;
	search_distance: Float | null;
	text: String;
	updatedAt: DateTime;
};

export type ConferenceemailfooterOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	locale?: SortingParameter | null | undefined;
	text?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type ConferenceemailfooterWhereInputArgument = {
	AND?: ConferenceemailfooterWhereInputArgument[] | undefined;
	NOT?: ConferenceemailfooterWhereInputArgument | null | undefined;
	OR?: ConferenceemailfooterWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	locale?: StringWhereInputArgument | null | undefined;
	text?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Conferenceemailsetting = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	enabled: Boolean;
	id: ID;
	kind: EmailkindEnum;
	search_distance: Float | null;
	updatedAt: DateTime;
};

export type ConferenceemailsettingOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	enabled?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	kind?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type ConferenceemailsettingWhereInputArgument = {
	AND?: ConferenceemailsettingWhereInputArgument[] | undefined;
	NOT?: ConferenceemailsettingWhereInputArgument | null | undefined;
	OR?: ConferenceemailsettingWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	enabled?: BooleanWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	kind?: EmailkindEnum | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Conferenceemailtext = {
	body: String | null;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	heading: String | null;
	id: ID;
	kind: EmailkindEnum;
	locale: String;
	search_distance: Float | null;
	subject: String | null;
	updatedAt: DateTime;
};

export type ConferenceemailtextOrderInputArgument = {
	body?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	heading?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	kind?: SortingParameter | null | undefined;
	locale?: SortingParameter | null | undefined;
	subject?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type ConferenceemailtextWhereInputArgument = {
	AND?: ConferenceemailtextWhereInputArgument[] | undefined;
	NOT?: ConferenceemailtextWhereInputArgument | null | undefined;
	OR?: ConferenceemailtextWhereInputArgument[] | undefined;
	body?: StringWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	heading?: StringWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	kind?: EmailkindEnum | null | undefined;
	locale?: StringWhereInputArgument | null | undefined;
	subject?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Conferenceparticipant = {
	accessCardId: ID | null;
	assignedDocumentNumber: Int | null;
	attendanceEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AttendanceentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AttendanceentryWhereInputArgument | null | undefined;
	}) => Attendanceentry[];
	checkIssues: ScanIssue[];
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	conferenceSupervisor: (p?: {
		orderBy?: ConferencesupervisorOrderInputArgument | null | undefined;
		where?: ConferencesupervisorWhereInputArgument | null | undefined;
	}) => Conferencesupervisor | null;
	createdAt: DateTime;
	delegationMember: (p?: {
		orderBy?: DelegationmemberOrderInputArgument | null | undefined;
		where?: DelegationmemberWhereInputArgument | null | undefined;
	}) => Delegationmember | null;
	didAttend: Boolean;
	guardianConsent: AdministrativestatusEnum;
	id: ID;
	mediaConsent: AdministrativestatusEnum;
	mediaConsentStatus: MediaconsentstatusEnum;
	nsaCardNumber: Int;
	ofAgeAtConference: Boolean;
	paymentStatus: AdministrativestatusEnum;
	school: (p?: {
		orderBy?: SchoolOrderInputArgument | null | undefined;
		where?: SchoolWhereInputArgument | null | undefined;
	}) => School | null;
	schoolId: ID | null;
	search_distance: Float | null;
	singleParticipant: (p?: {
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant | null;
	supervisors: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferencesupervisorOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferencesupervisorWhereInputArgument | null | undefined;
	}) => Conferencesupervisor[];
	termsAndConditions: AdministrativestatusEnum;
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	userId: ID;
};

export type ConferenceparticipantOrderInputArgument = {
	accessCardId?: SortingParameter | null | undefined;
	assignedDocumentNumber?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	didAttend?: SortingParameter | null | undefined;
	guardianConsent?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	mediaConsent?: SortingParameter | null | undefined;
	mediaConsentStatus?: SortingParameter | null | undefined;
	nsaCardNumber?: SortingParameter | null | undefined;
	paymentStatus?: SortingParameter | null | undefined;
	schoolId?: SortingParameter | null | undefined;
	termsAndConditions?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	userId?: SortingParameter | null | undefined;
};

export type ConferenceparticipantWhereInputArgument = {
	AND?: ConferenceparticipantWhereInputArgument[] | undefined;
	NOT?: ConferenceparticipantWhereInputArgument | null | undefined;
	OR?: ConferenceparticipantWhereInputArgument[] | undefined;
	accessCardId?: IDWhereInputArgument | null | undefined;
	assignedDocumentNumber?: IntWhereInputArgument | null | undefined;
	attendanceEntries?: AttendanceentryWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	conferenceSupervisor?: ConferencesupervisorWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	delegationMember?: DelegationmemberWhereInputArgument | null | undefined;
	didAttend?: BooleanWhereInputArgument | null | undefined;
	guardianConsent?: AdministrativestatusEnum | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	mediaConsent?: AdministrativestatusEnum | null | undefined;
	mediaConsentStatus?: MediaconsentstatusEnum | null | undefined;
	nsaCardNumber?: IntWhereInputArgument | null | undefined;
	paymentStatus?: AdministrativestatusEnum | null | undefined;
	school?: SchoolWhereInputArgument | null | undefined;
	schoolId?: IDWhereInputArgument | null | undefined;
	singleParticipant?: SingleparticipantWhereInputArgument | null | undefined;
	supervisors?: ConferencesupervisorWhereInputArgument | null | undefined;
	termsAndConditions?: AdministrativestatusEnum | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
	userId?: IDWhereInputArgument | null | undefined;
};

export type Conferencerole = {
	abbreviation: String | null;
	appliedSingleParticipants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant[];
	assignedDelegations: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationWhereInputArgument | null | undefined;
	}) => Delegation[];
	assignedSingleParticipants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant[];
	calendarTracks: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendartrackOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendartrackWhereInputArgument | null | undefined;
	}) => Calendartrack[];
	committees: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CommitteeOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CommitteeWhereInputArgument | null | undefined;
	}) => Committee[];
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	description: String | null;
	icon: String | null;
	id: ID;
	kind: ConferencerolekindEnum;
	name: String | null;
	nation: (p?: {
		orderBy?: NationOrderInputArgument | null | undefined;
		where?: NationWhereInputArgument | null | undefined;
	}) => Nation | null;
	nationAlpha3Code: String | null;
	roleApplications: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: RoleapplicationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: RoleapplicationWhereInputArgument | null | undefined;
	}) => Roleapplication[];
	search_distance: Float | null;
	seatAmount: Int | null;
	updatedAt: DateTime;
};

export type ConferenceroleOrderInputArgument = {
	abbreviation?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	description?: SortingParameter | null | undefined;
	icon?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	kind?: SortingParameter | null | undefined;
	name?: SortingParameter | null | undefined;
	nationAlpha3Code?: SortingParameter | null | undefined;
	seatAmount?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type ConferenceroleWhereInputArgument = {
	AND?: ConferenceroleWhereInputArgument[] | undefined;
	NOT?: ConferenceroleWhereInputArgument | null | undefined;
	OR?: ConferenceroleWhereInputArgument[] | undefined;
	abbreviation?: StringWhereInputArgument | null | undefined;
	appliedSingleParticipants?: SingleparticipantWhereInputArgument | null | undefined;
	assignedDelegations?: DelegationWhereInputArgument | null | undefined;
	assignedSingleParticipants?: SingleparticipantWhereInputArgument | null | undefined;
	calendarTracks?: CalendartrackWhereInputArgument | null | undefined;
	committees?: CommitteeWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	description?: StringWhereInputArgument | null | undefined;
	icon?: StringWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	kind?: ConferencerolekindEnum | null | undefined;
	name?: StringWhereInputArgument | null | undefined;
	nation?: NationWhereInputArgument | null | undefined;
	nationAlpha3Code?: StringWhereInputArgument | null | undefined;
	roleApplications?: RoleapplicationWhereInputArgument | null | undefined;
	seatAmount?: IntWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type ConferencerolekindEnum = 'CUSTOM' | 'NATION' | 'NON_STATE_ACTOR';

export type ConferencestateEnum =
	'ACTIVE' | 'PARTICIPANT_REGISTRATION' | 'POST' | 'PRE' | 'PREPARATION';

export type Conferencesupervisor = {
	applicationBlockers: () => ApplicationBlocker[];
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceParticipantId: ID;
	connectionCode: String;
	createdAt: DateTime;
	id: ID;
	participant: (p?: {
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant;
	plansOwnAttendenceAtConference: Boolean;
	school: (p?: {
		orderBy?: SchoolOrderInputArgument | null | undefined;
		where?: SchoolWhereInputArgument | null | undefined;
	}) => School | null;
	search_distance: Float | null;
	supervised: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant[];
	supervisedDelegationMembers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationmemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationmemberWhereInputArgument | null | undefined;
	}) => Delegationmember[];
	supervisedSingleParticipants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant[];
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
};

export type ConferencesupervisorOrderInputArgument = {
	conferenceParticipantId?: SortingParameter | null | undefined;
	connectionCode?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	plansOwnAttendenceAtConference?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type ConferencesupervisorWhereInputArgument = {
	AND?: ConferencesupervisorWhereInputArgument[] | undefined;
	NOT?: ConferencesupervisorWhereInputArgument | null | undefined;
	OR?: ConferencesupervisorWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceParticipantId?: IDWhereInputArgument | null | undefined;
	connectionCode?: StringWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	participant?: ConferenceparticipantWhereInputArgument | null | undefined;
	plansOwnAttendenceAtConference?: BooleanWhereInputArgument | null | undefined;
	school?: SchoolWhereInputArgument | null | undefined;
	supervised?: ConferenceparticipantWhereInputArgument | null | undefined;
	supervisedDelegationMembers?: DelegationmemberWhereInputArgument | null | undefined;
	supervisedSingleParticipants?: SingleparticipantWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
};

export type CreateInvitationInput = {
	email: String;
	role: TeamroleEnum;
};

export type CreateInvitationsResult = {
	created: () => CreatedInvitation[];
	errors: () => InvitationError[];
};

export type CreatePaperReviewResult = {
	pieceUnlocked: Boolean;
	reviewId: String;
	unlockedPieceData: () => UnlockedPieceData | null;
};

export type CreatedInvitation = {
	addedDirectly: Boolean;
	email: String;
	expiresAt: DateTime;
	id: ID;
	role: TeamroleEnum;
	token: String | null;
};

export type DataTableGroup = {
	count: Int;
	value: String | null;
};

export type DataTablePage = {
	hasMore: Boolean;
	ids: ID[];
	total: Int;
	values: JSON[];
};

export type DateTime = Date;

export type DateTimeWhereInputArgument = {
	AND?: DateTimeWhereInputArgument[] | undefined;
	NOT?: DateTimeWhereInputArgument | null | undefined;
	OR?: DateTimeWhereInputArgument[] | undefined;
	arrayContained?: DateTime[] | undefined;
	arrayContains?: DateTime[] | undefined;
	arrayOverlaps?: DateTime[] | undefined;
	eq?: DateTime | null | undefined;
	gt?: DateTime | null | undefined;
	gte?: DateTime | null | undefined;
	in?: DateTime[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	lt?: DateTime | null | undefined;
	lte?: DateTime | null | undefined;
	ne?: DateTime | null | undefined;
	notIn?: DateTime[] | undefined;
};

export type DateWhereInputArgument = {
	AND?: DateWhereInputArgument[] | undefined;
	NOT?: DateWhereInputArgument | null | undefined;
	OR?: DateWhereInputArgument[] | undefined;
	arrayContained?: Date[] | undefined;
	arrayContains?: Date[] | undefined;
	arrayOverlaps?: Date[] | undefined;
	eq?: Date | null | undefined;
	gt?: Date | null | undefined;
	gte?: Date | null | undefined;
	ilike?: String | null | undefined;
	in?: Date[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	like?: String | null | undefined;
	lt?: Date | null | undefined;
	lte?: Date | null | undefined;
	ne?: Date | null | undefined;
	notIlike?: String | null | undefined;
	notIn?: Date[] | undefined;
	notLike?: String | null | undefined;
};

export type Delegation = {
	applicationBlockers: () => ApplicationBlocker[];
	applied: Boolean;
	appliedForRoles: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: RoleapplicationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: RoleapplicationWhereInputArgument | null | undefined;
	}) => Roleapplication[];
	assignedRole: (p?: {
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole | null;
	assignedRoleId: ID | null;
	assignmentReview: (p?: {
		orderBy?: AssignmentreviewOrderInputArgument | null | undefined;
		where?: AssignmentreviewWhereInputArgument | null | undefined;
	}) => Assignmentreview | null;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	entryCode: String;
	experience: String | null;
	id: ID;
	memberCount: Int;
	members: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationmemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationmemberWhereInputArgument | null | undefined;
	}) => Delegationmember[];
	motivation: String | null;
	papers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaperOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaperWhereInputArgument | null | undefined;
	}) => Paper[];
	search_distance: Float | null;
	updatedAt: DateTime;
};

export type DelegationOrderInputArgument = {
	applied?: SortingParameter | null | undefined;
	assignedRoleId?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	entryCode?: SortingParameter | null | undefined;
	experience?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	memberCount?: SortingParameter | null | undefined;
	motivation?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type DelegationPreview = {
	applied: Boolean;
	conferenceId: String;
	conferenceTitle: String;
	entryCode: String;
	headDelegateFullName: String;
	headDelegateSchoolId: String | null;
	headDelegateSchoolName: String | null;
	id: String;
	memberCount: Int;
	schools: String[];
};

export type DelegationWhereInputArgument = {
	AND?: DelegationWhereInputArgument[] | undefined;
	NOT?: DelegationWhereInputArgument | null | undefined;
	OR?: DelegationWhereInputArgument[] | undefined;
	applied?: BooleanWhereInputArgument | null | undefined;
	appliedForRoles?: RoleapplicationWhereInputArgument | null | undefined;
	assignedRole?: ConferenceroleWhereInputArgument | null | undefined;
	assignedRoleId?: IDWhereInputArgument | null | undefined;
	assignmentReview?: AssignmentreviewWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	entryCode?: StringWhereInputArgument | null | undefined;
	experience?: StringWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	memberCount?: IntWhereInputArgument | null | undefined;
	members?: DelegationmemberWhereInputArgument | null | undefined;
	motivation?: StringWhereInputArgument | null | undefined;
	papers?: PaperWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Delegationmember = {
	assignedCommittee: (p?: {
		orderBy?: CommitteeOrderInputArgument | null | undefined;
		where?: CommitteeWhereInputArgument | null | undefined;
	}) => Committee | null;
	assignedCommitteeId: ID | null;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceParticipantId: ID;
	createdAt: DateTime;
	delegation: (p?: {
		orderBy?: DelegationOrderInputArgument | null | undefined;
		where?: DelegationWhereInputArgument | null | undefined;
	}) => Delegation;
	delegationId: ID;
	id: ID;
	isHeadDelegate: Boolean;
	participant: (p?: {
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant;
	school: (p?: {
		orderBy?: SchoolOrderInputArgument | null | undefined;
		where?: SchoolWhereInputArgument | null | undefined;
	}) => School | null;
	search_distance: Float | null;
	supervisors: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferencesupervisorOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferencesupervisorWhereInputArgument | null | undefined;
	}) => Conferencesupervisor[];
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
};

export type DelegationmemberOrderInputArgument = {
	assignedCommitteeId?: SortingParameter | null | undefined;
	conferenceParticipantId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	delegationId?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	isHeadDelegate?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type DelegationmemberWhereInputArgument = {
	AND?: DelegationmemberWhereInputArgument[] | undefined;
	NOT?: DelegationmemberWhereInputArgument | null | undefined;
	OR?: DelegationmemberWhereInputArgument[] | undefined;
	assignedCommittee?: CommitteeWhereInputArgument | null | undefined;
	assignedCommitteeId?: IDWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceParticipantId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	delegation?: DelegationWhereInputArgument | null | undefined;
	delegationId?: IDWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	isHeadDelegate?: BooleanWhereInputArgument | null | undefined;
	participant?: ConferenceparticipantWhereInputArgument | null | undefined;
	school?: SchoolWhereInputArgument | null | undefined;
	supervisors?: ConferencesupervisorWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
};

export type EmailAddress = string;

export type EmailKindStats = {
	failed: Int;
	kind: EmailkindEnum;
	sent: Int;
	skipped: Int;
};

export type EmailPreview = {
	html: String;
	subject: String;
};

export type EmailStatusResult = {
	email: String;
	status: TeamInvitationEmailStatus;
};

export type EmailkindEnum =
	| 'APPLICATION_DEADLINE_REMINDER'
	| 'ASSIGNMENT_ACCEPTED'
	| 'ASSIGNMENT_REJECTED'
	| 'BADGE_FOUND'
	| 'CERTIFICATE_AVAILABLE'
	| 'CHASE_INTRO_REMINDER'
	| 'OPEN_ISSUES_REMINDER'
	| 'PAPERWORK_PROBLEM'
	| 'PAPER_REVIEWED'
	| 'PAYMENT_RECEIVED'
	| 'PAYMENT_UNLOCKED'
	| 'PHONE_READY_REMINDER'
	| 'POSTAL_RECEIVED'
	| 'POSTAL_UNLOCKED'
	| 'SUPERVISOR_ASSIGNMENT_SUMMARY'
	| 'SUPERVISOR_STUDENT_LINKED'
	| 'SURVEY_REMINDER'
	| 'TEAM_INVITATION'
	| 'TEAM_WELCOME'
	| 'WAITING_LIST_SEATED';

export type Emaillog = {
	attempts: Int;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	email: String | null;
	error: String | null;
	id: ID;
	kind: EmailkindEnum;
	search_distance: Float | null;
	sentAt: DateTime | null;
	sentBy: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User | null;
	sentById: ID | null;
	status: EmailstatusEnum;
	subjectKey: String;
	trigger: EmailtriggerEnum;
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User | null;
	userId: ID | null;
};

export type EmaillogOrderInputArgument = {
	attempts?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	email?: SortingParameter | null | undefined;
	error?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	kind?: SortingParameter | null | undefined;
	sentAt?: SortingParameter | null | undefined;
	sentById?: SortingParameter | null | undefined;
	status?: SortingParameter | null | undefined;
	subjectKey?: SortingParameter | null | undefined;
	trigger?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	userId?: SortingParameter | null | undefined;
};

export type EmaillogWhereInputArgument = {
	AND?: EmaillogWhereInputArgument[] | undefined;
	NOT?: EmaillogWhereInputArgument | null | undefined;
	OR?: EmaillogWhereInputArgument[] | undefined;
	attempts?: IntWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	email?: StringWhereInputArgument | null | undefined;
	error?: StringWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	kind?: EmailkindEnum | null | undefined;
	sentAt?: DateTimeWhereInputArgument | null | undefined;
	sentBy?: UserWhereInputArgument | null | undefined;
	sentById?: IDWhereInputArgument | null | undefined;
	status?: EmailstatusEnum | null | undefined;
	subjectKey?: StringWhereInputArgument | null | undefined;
	trigger?: EmailtriggerEnum | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
	userId?: IDWhereInputArgument | null | undefined;
};

export type EmailstatusEnum = 'FAILED' | 'SENDING' | 'SENT' | 'SKIPPED';

export type EmailtriggerEnum = 'AUTOMATIC' | 'MANUAL';

export type FlagCollectionData = {
	flags: () => FlagProgress[];
	stats: () => FlagCollectionStats;
};

export type FlagCollectionStats = {
	completedFlags: Int;
	foundPieces: Int;
	totalFlags: Int;
	totalPieces: Int;
	unlockedPieces: Int;
};

export type FlagPiece = {
	agendaItemId: String | null;
	agendaItemTitle: String | null;
	committeeAbbreviation: String | null;
	id: String;
	state: FlagPieceState;
};

export type FlagPieceState = 'FOUND' | 'LOCKED' | 'UNLOCKED';

export type FlagProgress = {
	abbreviation: String | null;
	alpha2Code: String | null;
	alpha3Code: String | null;
	foundPieces: Int;
	icon: String | null;
	id: String;
	isComplete: Boolean;
	name: String;
	pieces: () => FlagPiece[];
	totalPieces: Int;
	type: FlagType;
	unlockedPieces: Int;
};

export type FlagType = 'NATION' | 'NSA';

export type FlagTypeForUnlock = 'NATION' | 'NSA';

export type FloatWhereInputArgument = {
	AND?: FloatWhereInputArgument[] | undefined;
	NOT?: FloatWhereInputArgument | null | undefined;
	OR?: FloatWhereInputArgument[] | undefined;
	arrayContained?: Float[] | undefined;
	arrayContains?: Float[] | undefined;
	arrayOverlaps?: Float[] | undefined;
	eq?: Float | null | undefined;
	gt?: Float | null | undefined;
	gte?: Float | null | undefined;
	ilike?: String | null | undefined;
	in?: Float[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	like?: String | null | undefined;
	lt?: Float | null | undefined;
	lte?: Float | null | undefined;
	ne?: Float | null | undefined;
	notIlike?: String | null | undefined;
	notIn?: Float[] | undefined;
	notLike?: String | null | undefined;
};

export type FoodpreferenceEnum = 'OMNIVORE' | 'VEGAN' | 'VEGETARIAN';

export type GenderEnum = 'DIVERSE' | 'FEMALE' | 'MALE' | 'NO_STATEMENT';

export type IDWhereInputArgument = {
	AND?: IDWhereInputArgument[] | undefined;
	NOT?: IDWhereInputArgument | null | undefined;
	OR?: IDWhereInputArgument[] | undefined;
	arrayContained?: ID[] | undefined;
	arrayContains?: ID[] | undefined;
	arrayOverlaps?: ID[] | undefined;
	eq?: ID | null | undefined;
	gt?: ID | null | undefined;
	gte?: ID | null | undefined;
	ilike?: String | null | undefined;
	in?: ID[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	like?: String | null | undefined;
	lt?: ID | null | undefined;
	lte?: ID | null | undefined;
	ne?: ID | null | undefined;
	notIlike?: String | null | undefined;
	notIn?: ID[] | undefined;
	notLike?: String | null | undefined;
};

export type ImpersonationStatus = {
	impersonatedUser: () => ImpersonationUser | null;
	isImpersonating: Boolean;
	originalUser: () => ImpersonationUser | null;
};

export type ImpersonationUser = {
	email: String;
	family_name: String | null;
	given_name: String | null;
	preferred_username: String | null;
	sub: String;
};

export type Instancelink = {
	createdAt: DateTime;
	id: ID;
	lastError: String | null;
	lastEventAt: DateTime | null;
	lastReconcileAt: DateTime | null;
	remoteUrl: String;
	search_distance: Float | null;
	updatedAt: DateTime;
};

export type InstancelinkOrderInputArgument = {
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	lastError?: SortingParameter | null | undefined;
	lastEventAt?: SortingParameter | null | undefined;
	lastReconcileAt?: SortingParameter | null | undefined;
	remoteUrl?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type InstancelinkWhereInputArgument = {
	AND?: InstancelinkWhereInputArgument[] | undefined;
	NOT?: InstancelinkWhereInputArgument | null | undefined;
	OR?: InstancelinkWhereInputArgument[] | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	lastError?: StringWhereInputArgument | null | undefined;
	lastEventAt?: DateTimeWhereInputArgument | null | undefined;
	lastReconcileAt?: DateTimeWhereInputArgument | null | undefined;
	remoteUrl?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type IntArrayWhereInputArgument = {
	AND?: IntArrayWhereInputArgument[] | undefined;
	NOT?: IntArrayWhereInputArgument | null | undefined;
	OR?: IntArrayWhereInputArgument[] | undefined;
	arrayContained?: Int[] | undefined;
	arrayContains?: Int[] | undefined;
	arrayOverlaps?: Int[] | undefined;
	eq?: Int[] | undefined;
	in?: Int[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	ne?: Int[] | undefined;
	notIn?: Int[] | undefined;
};

export type IntWhereInputArgument = {
	AND?: IntWhereInputArgument[] | undefined;
	NOT?: IntWhereInputArgument | null | undefined;
	OR?: IntWhereInputArgument[] | undefined;
	arrayContained?: Int[] | undefined;
	arrayContains?: Int[] | undefined;
	arrayOverlaps?: Int[] | undefined;
	eq?: Int | null | undefined;
	gt?: Int | null | undefined;
	gte?: Int | null | undefined;
	ilike?: String | null | undefined;
	in?: Int[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	like?: String | null | undefined;
	lt?: Int | null | undefined;
	lte?: Int | null | undefined;
	ne?: Int | null | undefined;
	notIlike?: String | null | undefined;
	notIn?: Int[] | undefined;
	notLike?: String | null | undefined;
};

export type InvitationError = {
	email: String;
	error: String;
};

export type JSON = any;

export type JSONWhereInputArgument = {
	AND?: JSONWhereInputArgument[] | undefined;
	NOT?: JSONWhereInputArgument | null | undefined;
	OR?: JSONWhereInputArgument[] | undefined;
	arrayContained?: JSON[] | undefined;
	arrayContains?: JSON[] | undefined;
	arrayOverlaps?: JSON[] | undefined;
	eq?: JSON | null | undefined;
	in?: JSON[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	ne?: JSON | null | undefined;
	notIn?: JSON[] | undefined;
};

export type JWK = {
	alg: String | null;
	e: String | null;
	kty: String | null;
	n: String | null;
	use: String | null;
};

export type LayoutDocument = 'certificate' | 'contract' | 'guardianConsent' | 'mediaConsent';

export type Locale = string;

export type Mcpauditentry = {
	arguments: JSON;
	clientId: ID | null;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	durationMs: Int;
	id: ID;
	message: String | null;
	outcome: McpcalloutcomeEnum;
	search_distance: Float | null;
	tool: String;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User | null;
	userId: ID | null;
};

export type McpauditentryOrderInputArgument = {
	arguments?: SortingParameter | null | undefined;
	clientId?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	durationMs?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	message?: SortingParameter | null | undefined;
	outcome?: SortingParameter | null | undefined;
	tool?: SortingParameter | null | undefined;
	userId?: SortingParameter | null | undefined;
};

export type McpauditentryWhereInputArgument = {
	AND?: McpauditentryWhereInputArgument[] | undefined;
	NOT?: McpauditentryWhereInputArgument | null | undefined;
	OR?: McpauditentryWhereInputArgument[] | undefined;
	arguments?: JSONWhereInputArgument | null | undefined;
	clientId?: IDWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	durationMs?: IntWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	message?: StringWhereInputArgument | null | undefined;
	outcome?: McpcalloutcomeEnum | null | undefined;
	tool?: StringWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
	userId?: IDWhereInputArgument | null | undefined;
};

export type McpcalloutcomeEnum = 'ERROR' | 'OK' | 'REFUSED';

export type MediaconsentstatusEnum =
	'ALLOWED_ALL' | 'NOT_ALLOWED' | 'NOT_SET' | 'PARTIALLY_ALLOWED';

export type Mutation = {
	analyzeSchoolSuggestions: (p: { conferenceId: ID }) => Boolean;
	applyAssignment: (p: { conferenceId: ID }) => Boolean;
	assignAssignmentUnit: (p: { roleId?: ID | null | undefined; unitId: ID }) => Boolean;
	assignCommitteesToDelegationMembers: (p: {
		assignments: CommitteeAssignmentInput[];
		conferenceId: ID;
	}) => Delegationmember[];
	assignDelegation: (p: { delegationId: ID; roleId?: ID | null | undefined }) => Boolean;
	assignSingleParticipantRole: (p: {
		roleId?: ID | null | undefined;
		singleParticipantId: ID;
	}) => Boolean;
	autoAssignDelegations: (p: { conferenceId: ID; size: Int }) => Int;
	autoAssignSingleParticipants: (p: { conferenceId: ID }) => Int;
	connectToConferenceSupervisor: (p: {
		conferenceId: ID;
		connectionCode: String;
		userId?: ID | null | undefined;
	}) => Conferencesupervisor;
	convertSingleParticipant: (p: { singleParticipantId: ID }) => Boolean;
	copyTableView: (p: {
		conferenceId: ID;
		global?: Boolean | null | undefined;
		id: ID;
		isDefault?: Boolean | null | undefined;
		name: String;
		shared: Boolean;
	}) => Tableview;
	createAgendaItem: (p: {
		committeeId: ID;
		teaserText?: String | null | undefined;
		title: String;
	}) => Committeeagendaitem;
	createAppliedDelegationMember: (p: {
		assignedCommitteeId?: ID | null | undefined;
		assignedRoleId: ID;
		conferenceId: ID;
		userId: ID;
	}) => Delegationmember;
	createAppliedSingleParticipant: (p: {
		conferenceId: ID;
		roleId: ID;
		userId: ID;
	}) => Singleparticipant;
	createAttendanceEntry: (p: { conferenceId: ID; sessionId: ID; userId: ID }) => Attendanceentry;
	createCalendarDay: (p: { conferenceId: ID; date: Date; name: String }) => Calendarday;
	createCalendarEntry: (p: {
		calendarDayId: ID;
		calendarTrackIds: ID[];
		color?: CalendarentrycolorEnum | null | undefined;
		description?: String | null | undefined;
		endTime: DateTime;
		icon?: String | null | undefined;
		name: String;
		placeId?: ID | null | undefined;
		room?: String | null | undefined;
		startTime: DateTime;
		surveyOptionIds?: ID[] | null | undefined;
	}) => Calendarentry;
	createCalendarTrack: (p: {
		calendarDayIds?: ID[] | null | undefined;
		committeeIds?: ID[] | null | undefined;
		conferenceId: ID;
		conferenceRoleIds?: ID[] | null | undefined;
		description?: String | null | undefined;
		name: String;
		sortOrder: Int;
	}) => Calendartrack;
	createCommittee: (p: {
		abbreviation: String;
		conferenceId: ID;
		name: String;
		numOfSeatsPerDelegation: Int;
	}) => Committee;
	createConferenceSupervisor: (p: {
		conferenceId: ID;
		plansOwnAttendenceAtConference?: Boolean | null | undefined;
		schoolId?: ID | null | undefined;
		schoolName?: String | null | undefined;
		userId?: ID | null | undefined;
	}) => Conferencesupervisor;
	createCustomRole: (p: {
		conferenceId: ID;
		description?: String | null | undefined;
		icon?: String | null | undefined;
		name: String;
		seatAmount: Int;
	}) => Conferencerole;
	createDelegation: (p: {
		conferenceId: ID;
		experience?: String | null | undefined;
		motivation?: String | null | undefined;
		schoolId?: ID | null | undefined;
		schoolName?: String | null | undefined;
	}) => Delegation;
	createDelegationMember: (p: {
		conferenceId: ID;
		entryCode: String;
		schoolId?: ID | null | undefined;
		schoolName?: String | null | undefined;
	}) => Delegationmember;
	createNonStateActor: (p: {
		abbreviation: String;
		conferenceId: ID;
		description: String;
		icon?: String | null | undefined;
		name: String;
		seatAmount: Int;
	}) => Conferencerole;
	createPaper: (p: {
		agendaItemId?: ID | null | undefined;
		content: JSON;
		delegationId: ID;
		status: PaperstatusEnum;
		type: PapertypeEnum;
	}) => Paper;
	createPaperReview: (p: {
		comments: JSON;
		newStatus: PaperstatusEnum;
		paperId: ID;
	}) => CreatePaperReviewResult;
	createPaymentTransaction: (p: {
		conferenceId: ID;
		paymentFor: ID[];
		userId: ID;
	}) => Paymenttransaction;
	createPlace: (p: {
		address?: String | null | undefined;
		conferenceId: ID;
		directions?: String | null | undefined;
		info?: String | null | undefined;
		latitude?: Float | null | undefined;
		longitude?: Float | null | undefined;
		name: String;
		sitePlanFileId?: ID | null | undefined;
		websiteUrl?: String | null | undefined;
	}) => Place;
	createResolution: (p: {
		committeeId?: ID | null | undefined;
		conferenceId: ID;
		fileId: ID;
		title?: String | null | undefined;
	}) => Resolution;
	createReviewerSnippet: (p: { content: JSON; name: String }) => Reviewersnippet;
	createRoleApplication: (p: { delegationId: ID; roleId: ID }) => Roleapplication;
	createSingleParticipant: (p: {
		conferenceId: ID;
		experience?: String | null | undefined;
		motivation?: String | null | undefined;
		roleId: ID;
		schoolId?: ID | null | undefined;
		schoolName?: String | null | undefined;
	}) => Singleparticipant;
	createSurveyOption: (p: {
		description: String;
		questionId: ID;
		title: String;
		upperLimit: Int;
	}) => Surveyoption;
	createSurveyQuestion: (p: {
		conferenceId: ID;
		deadline: DateTime;
		description: String;
		draft?: Boolean | null | undefined;
		hidden?: Boolean | null | undefined;
		showSelectionOnDashboard?: Boolean | null | undefined;
		title: String;
	}) => Surveyquestion;
	createTableView: (p: {
		conferenceId: ID;
		global?: Boolean | null | undefined;
		isDefault?: Boolean | null | undefined;
		name: String;
		shared: Boolean;
		state: JSON;
		tableKey: String;
	}) => Tableview;
	createTeamMemberInvitations: (p: {
		conferenceId: ID;
		invitations: CreateInvitationInput[];
	}) => CreateInvitationsResult;
	createWaitingListEntry: (p: {
		conferenceId: ID;
		experience: String;
		motivation: String;
		requests?: String | null | undefined;
		schoolId?: ID | null | undefined;
		schoolName?: String | null | undefined;
	}) => Waitinglistentry;
	decidePossibleDuplicate: (p: {
		id: ID;
		status: PossibleduplicatestatusEnum;
	}) => Possibleduplicate;
	deleteAgendaItem: (p: { id: ID }) => Boolean;
	deleteAttendanceEntry: (p: { id: ID }) => Boolean;
	deleteCalendarDay: (p: { id: ID }) => Boolean;
	deleteCalendarEntry: (p: { id: ID }) => Boolean;
	deleteCalendarTrack: (p: { id: ID }) => Boolean;
	deleteCommittee: (p: { id: ID }) => Boolean;
	deleteCustomRole: (p: { id: ID }) => Boolean;
	deleteDelegation: (p: { id: ID }) => Boolean;
	deleteDelegationMember: (p: { id: ID }) => Boolean;
	deleteNonStateActor: (p: { id: ID }) => Boolean;
	deletePaper: (p: { id: ID }) => Boolean;
	deletePlace: (p: { id: ID }) => Boolean;
	deleteResolution: (p: { id: ID }) => Boolean;
	deleteReviewerSnippet: (p: { id: ID }) => Boolean;
	deleteRoleApplication: (p: { id: ID }) => Boolean;
	deleteSchool: (p: { id: ID }) => Boolean;
	deleteSingleParticipant: (p: { id: ID }) => Boolean;
	deleteSurveyAnswer: (p: { questionId: ID; userId?: ID | null | undefined }) => Boolean;
	deleteSurveyOption: (p: { id: ID }) => Boolean;
	deleteSurveyQuestion: (p: { id: ID }) => Boolean;
	deleteTableView: (p: { id: ID }) => Boolean;
	deleteTeamMember: (p: { id: ID }) => Boolean;
	deleteWaitingListEntry: (p: { id: ID }) => Boolean;
	discardAssignmentDraft: (p: { conferenceId: ID }) => Boolean;
	disconnectFromConferenceSupervisor: (p: { supervisorId: ID; userId: ID }) => Boolean;
	dismissSchoolSuggestion: (p: { id: ID }) => Boolean;
	distributeUnansweredSurvey: (p: { questionId: ID }) => Int;
	endAttendanceSession: (p: { id: ID }) => Boolean;
	issueDocumentCode: (p: { conferenceId: ID; userId: ID }) => SignedCode;
	issueNametagCode: (p: { conferenceId: ID }) => SignedCode;
	issueNsaCards: (p: {
		conferenceId: ID;
		conferenceParticipantIds?: ID[] | null | undefined;
	}) => NsaCard[];
	mergeSchools: (p: { name?: String | null | undefined; sourceIds: ID[]; targetId: ID }) => School;
	notifyBadgeFound: (p: { id: ID }) => SendPersonEmailResult;
	recordSearch: (p: {
		conferenceId: ID;
		label: String;
		originId: String;
		resultId: String;
	}) => Boolean;
	regenerateTeamMemberInvitation: (p: {
		invitationId: ID;
		sendEmail?: Boolean | null | undefined;
	}) => RegeneratedInvitation;
	renameAttendanceSession: (p: { id: ID; occasion: String }) => Boolean;
	reopenAttendanceSession: (p: { id: ID }) => Boolean;
	reprintNsaCard: (p: { conferenceParticipantId: ID }) => NsaCard;
	requestFileUpload: (p: {
		conferenceId: ID;
		field: String;
		fileName: String;
		kind: String;
		mimeType: String;
		size: Int;
	}) => Storedfile;
	requestLinkSync: Boolean;
	requestRemoteLinkSync: Boolean;
	resetAssignmentSize: (p: { conferenceId: ID; seats: Int }) => Boolean;
	revertSingleParticipantConversion: (p: { singleParticipantId: ID }) => Boolean;
	revokeTeamMemberInvitation: (p: { invitationId: ID }) => Boolean;
	rotateSupervisorConnectionCode: (p: { id: ID }) => Conferencesupervisor;
	scanPossibleDuplicates: (p: { conferenceId: ID }) => Int;
	seedNewConference: (p: { data: JSON }) => Conference;
	sendOpenEmails: (p: { conferenceId: ID; kinds: EmailkindEnum[] }) => Int;
	sendPersonEmail: (p: {
		conferenceId: ID;
		kind: EmailkindEnum;
		subjectKey: String;
		userId: ID;
	}) => SendPersonEmailResult;
	setAgendaItemReviewHelpStatus: (p: {
		agendaItemId: ID;
		status: ReviewhelpstatusEnum;
	}) => Committeeagendaitem;
	setAssignmentReleased: (p: { conferenceId: ID; released: Boolean }) => Boolean;
	setAttendanceSessionOnCertificate: (p: { id: ID; show: Boolean }) => Boolean;
	setCalendarTrackOnDay: (p: { calendarDayId: ID; id: ID; runs: Boolean }) => Boolean;
	setCommitteeNationSeat: (p: {
		committeeId: ID;
		enabled: Boolean;
		nationAlpha3Code: String;
	}) => Committee;
	setCommitteeRegionalBaseline: (p: {
		baseline: RegionalbaselineEnum;
		committeeId: ID;
		targets?: Int[] | null | undefined;
	}) => Committee;
	setConferenceEmailEnabled: (p: {
		conferenceId: ID;
		enabled: Boolean;
		kind: EmailkindEnum;
		notifyExisting?: Boolean | null | undefined;
	}) => Boolean;
	setConferenceEmailFooter: (p: { conferenceId: ID; locale: String; text: String }) => Boolean;
	setConferenceEmailsPerSecond: (p: {
		conferenceId: ID;
		emailsPerSecond?: Int | null | undefined;
	}) => Boolean;
	setConferenceMcpEnabled: (p: { conferenceId: ID; enabled: Boolean }) => Boolean;
	setDocumentLayout: (p: {
		conferenceId: ID;
		document: LayoutDocument;
		layout?: JSON | null | undefined;
	}) => Conference;
	setMyTableViewDefault: (p: {
		conferenceId: ID;
		tableKey: String;
		viewId?: ID | null | undefined;
	}) => Boolean;
	setParticipantSchool: (p: {
		conferenceId: ID;
		id?: ID | null | undefined;
		schoolId?: ID | null | undefined;
		schoolName?: String | null | undefined;
	}) => Conferenceparticipant;
	setTableViewDefault: (p: { id: ID; isDefault: Boolean }) => Tableview;
	skipOpenEmails: (p: { conferenceId: ID; kinds: EmailkindEnum[] }) => Int;
	splitDelegation: (p: { delegationId: ID; parts: AssignmentSplitPartInput[] }) => Boolean;
	startAttendanceSession: (p: {
		conferenceId: ID;
		id: ID;
		mode: AttendancesessionmodeEnum;
		occasion: String;
		surveyOptionIds?: ID[] | null | undefined;
	}) => Attendancesession;
	startImpersonation: (p: { targetUserId: ID }) => Boolean;
	stopImpersonation: Boolean;
	swapRoleApplicationRanks: (p: {
		firstRoleApplicationId: ID;
		secondRoleApplicationId: ID;
	}) => Roleapplication[];
	switchDelegationMemberSeats: (p: {
		conferenceId: ID;
		headDelegateMemberIds?: ID[] | null | undefined;
		memberId: ID;
		otherMemberId?: ID | null | undefined;
		targetCommitteeId?: ID | null | undefined;
		targetRoleId?: ID | null | undefined;
	}) => Delegationmember[];
	undoDelegationSplit: (p: { delegationId: ID }) => Boolean;
	unregisterParticipant: (p: { conferenceId: ID; userId: ID }) => User;
	updateAgendaItem: (p: {
		id: ID;
		teaserText?: String | null | undefined;
		title?: String | null | undefined;
	}) => Committeeagendaitem;
	updateAllConferenceParticipants: (p: {
		conferenceId: ID;
		didAttend?: Boolean | null | undefined;
	}) => UpdateAllConferenceParticipantsResponse;
	updateCalendarDay: (p: {
		date?: Date | null | undefined;
		id: ID;
		name?: String | null | undefined;
	}) => Calendarday;
	updateCalendarEntry: (p: {
		calendarDayId?: ID | null | undefined;
		calendarTrackIds?: ID[] | null | undefined;
		color?: CalendarentrycolorEnum | null | undefined;
		description?: String | null | undefined;
		endTime?: DateTime | null | undefined;
		icon?: String | null | undefined;
		id: ID;
		name?: String | null | undefined;
		placeId?: ID | null | undefined;
		room?: String | null | undefined;
		startTime?: DateTime | null | undefined;
		surveyOptionIds?: ID[] | null | undefined;
	}) => Calendarentry;
	updateCalendarTrack: (p: {
		committeeIds?: ID[] | null | undefined;
		conferenceRoleIds?: ID[] | null | undefined;
		description?: String | null | undefined;
		id: ID;
		name?: String | null | undefined;
		sortOrder?: Int | null | undefined;
	}) => Calendartrack;
	updateCommittee: (p: {
		abbreviation?: String | null | undefined;
		id: ID;
		name?: String | null | undefined;
		numOfSeatsPerDelegation?: Int | null | undefined;
		resolutionHeadline?: String | null | undefined;
	}) => Committee;
	updateConference: (p: {
		applicationDeadline?: DateTime | null | undefined;
		bankAccountHolder?: String | null | undefined;
		bankName?: String | null | undefined;
		bic?: String | null | undefined;
		certificateFileId?: ID | null | undefined;
		contractFileId?: ID | null | undefined;
		currency?: String | null | undefined;
		emblemFileId?: ID | null | undefined;
		endConference?: DateTime | null | undefined;
		feeAmount?: Float | null | undefined;
		guardianConsentFileId?: ID | null | undefined;
		iban?: String | null | undefined;
		id: ID;
		imageFileId?: ID | null | undefined;
		info?: String | null | undefined;
		isOpenPaperSubmission?: Boolean | null | undefined;
		language?: String | null | undefined;
		linkToPaperInbox?: String | null | undefined;
		linkToPreparationGuide?: String | null | undefined;
		linkToServicesPage?: String | null | undefined;
		linkToTeamWiki?: String | null | undefined;
		location?: String | null | undefined;
		logoFileId?: ID | null | undefined;
		longTitle?: String | null | undefined;
		maxCollectiveGroupSize?: Int | null | undefined;
		maxGuaranteedSeatsPerForeignSchool?: Int | null | undefined;
		mediaConsentFileId?: ID | null | undefined;
		nametagBinCount?: Int | null | undefined;
		participantMaxAge?: Int | null | undefined;
		participantMinAge?: Int | null | undefined;
		postalApartment?: String | null | undefined;
		postalCity?: String | null | undefined;
		postalCountry?: String | null | undefined;
		postalName?: String | null | undefined;
		postalStreet?: String | null | undefined;
		postalZip?: String | null | undefined;
		registrationDeadlineGracePeriodMinutes?: Int | null | undefined;
		showCalendar?: Boolean | null | undefined;
		showInfoExpanded?: Boolean | null | undefined;
		startConference?: DateTime | null | undefined;
		state?: ConferencestateEnum | null | undefined;
		supervisorMinAge?: Int | null | undefined;
		termsAndConditionsFileId?: ID | null | undefined;
		timezone?: String | null | undefined;
		title?: String | null | undefined;
		unlockPayments?: Boolean | null | undefined;
		unlockPostals?: Boolean | null | undefined;
		website?: String | null | undefined;
	}) => Conference;
	updateConferenceSupervisor: (p: {
		id: ID;
		plansOwnAttendenceAtConference: Boolean;
	}) => Conferencesupervisor;
	updateCustomRole: (p: {
		description?: String | null | undefined;
		icon?: String | null | undefined;
		id: ID;
		name?: String | null | undefined;
		seatAmount?: Int | null | undefined;
	}) => Conferencerole;
	updateDelegation: (p: {
		applied?: Boolean | null | undefined;
		experience?: String | null | undefined;
		id: ID;
		motivation?: String | null | undefined;
		newHeadDelegateUserId?: ID | null | undefined;
		resetEntryCode?: Boolean | null | undefined;
	}) => Delegation;
	updateDelegationMemberCommittee: (p: { assignedCommitteeId: ID; id: ID }) => Delegationmember;
	updateNonStateActor: (p: {
		abbreviation?: String | null | undefined;
		description?: String | null | undefined;
		icon?: String | null | undefined;
		id: ID;
		name?: String | null | undefined;
		seatAmount?: Int | null | undefined;
	}) => Conferencerole;
	updatePaper: (p: {
		content: JSON;
		paperId: ID;
		status?: PaperstatusEnum | null | undefined;
	}) => Paper;
	updatePaymentTransaction: (p: {
		assignedStatus: AdministrativestatusEnum;
		id: ID;
		recievedAt?: DateTime | null | undefined;
	}) => Paymenttransaction;
	updatePlace: (p: {
		address?: String | null | undefined;
		directions?: String | null | undefined;
		id: ID;
		info?: String | null | undefined;
		latitude?: Float | null | undefined;
		longitude?: Float | null | undefined;
		name?: String | null | undefined;
		sitePlanFileId?: ID | null | undefined;
		websiteUrl?: String | null | undefined;
	}) => Place;
	updateResolution: (p: {
		committeeId?: ID | null | undefined;
		id: ID;
		title?: String | null | undefined;
	}) => Resolution;
	updateReviewerSnippet: (p: {
		content?: JSON | null | undefined;
		id: ID;
		name?: String | null | undefined;
	}) => Reviewersnippet;
	updateSchool: (p: {
		apartment?: String | null | undefined;
		city?: String | null | undefined;
		contactEmail?: EmailAddress | null | undefined;
		contactName?: PersonName | null | undefined;
		contactPhone?: PhoneNumber | null | undefined;
		country?: String | null | undefined;
		id: ID;
		isForeignSchool?: Boolean | null | undefined;
		name?: String | null | undefined;
		notes?: String | null | undefined;
		region?: String | null | undefined;
		street?: String | null | undefined;
		website?: String | null | undefined;
		zip?: String | null | undefined;
	}) => School;
	updateSingleParticipant: (p: {
		applied?: Boolean | null | undefined;
		applyForRolesIdList?: ID[] | null | undefined;
		experience?: String | null | undefined;
		id: ID;
		motivation?: String | null | undefined;
		unApplyForRolesIdList?: ID[] | null | undefined;
	}) => Singleparticipant;
	updateSurveyOption: (p: {
		description?: String | null | undefined;
		id: ID;
		title?: String | null | undefined;
		upperLimit?: Int | null | undefined;
	}) => Surveyoption;
	updateSurveyQuestion: (p: {
		deadline?: DateTime | null | undefined;
		description?: String | null | undefined;
		draft?: Boolean | null | undefined;
		hidden?: Boolean | null | undefined;
		id: ID;
		showSelectionOnDashboard?: Boolean | null | undefined;
		title?: String | null | undefined;
	}) => Surveyquestion;
	updateTableView: (p: {
		id: ID;
		name?: String | null | undefined;
		state?: JSON | null | undefined;
	}) => Tableview;
	updateTeamMemberRole: (p: { id: ID; role: TeamroleEnum }) => Teammember;
	updateUser: (p: {
		address?: AddressInput | null | undefined;
		apartment?: String | null | undefined;
		birthday?: Date | null | undefined;
		emergencyContacts?: String | null | undefined;
		familyName?: PersonName | null | undefined;
		foodPreference?: FoodpreferenceEnum | null | undefined;
		gender?: GenderEnum | null | undefined;
		givenName?: PersonName | null | undefined;
		id: ID;
		phone?: PhoneNumber | null | undefined;
		pronouns?: String | null | undefined;
		wantsJoinTeamInformation?: Boolean | null | undefined;
		wantsToReceiveGeneralInformation?: Boolean | null | undefined;
	}) => User;
	updateUsersGlobalNotes: (p: { globalNotes: String; id: ID }) => User;
	updateUsersIdentityInfo: (p: {
		birthday?: Date | null | undefined;
		familyName?: PersonName | null | undefined;
		givenName?: PersonName | null | undefined;
		id: ID;
	}) => User;
	updateUsersNewsletterPreferences: (p: {
		email: EmailAddress;
		wantsJoinTeamInformation?: Boolean | null | undefined;
		wantsToReceiveGeneralInformation?: Boolean | null | undefined;
	}) => Boolean;
	updateWaitingListEntry: (p: {
		experience?: String | null | undefined;
		hidden?: Boolean | null | undefined;
		id: ID;
		motivation?: String | null | undefined;
		requests?: String | null | undefined;
		schoolId?: ID | null | undefined;
		schoolName?: String | null | undefined;
	}) => Waitinglistentry;
	upsertAssignmentReview: (p?: {
		delegationId?: ID | null | undefined;
		disqualified?: Boolean | null | undefined;
		evaluation?: Float | null | undefined;
		flagged?: Boolean | null | undefined;
		note?: String | null | undefined;
		prioritizedRoleId?: ID | null | undefined;
		required?: Boolean | null | undefined;
		singleParticipantId?: ID | null | undefined;
	}) => Assignmentreview;
	upsertAssignmentWeights: (p: {
		conferenceId: ID;
		experienceEffect?: AssignmentexperienceeffectEnum | null | undefined;
		experienceModifier?: Float | null | undefined;
		markBonus?: Float | null | undefined;
		markEffect?: AssignmentmarkeffectEnum | null | undefined;
		nullRating?: Float | null | undefined;
		ratingFactor?: Float | null | undefined;
	}) => Assignmentweights;
	upsertConferenceEmailText: (p: {
		body?: String | null | undefined;
		conferenceId: ID;
		heading?: String | null | undefined;
		kind: EmailkindEnum;
		locale: String;
		subject?: String | null | undefined;
	}) => Boolean;
	upsertConferenceParticipant: (p: {
		accessCardId?: String | null | undefined;
		assignNextDocumentNumber?: Boolean | null | undefined;
		assignedDocumentNumber?: Int | null | undefined;
		conferenceId: ID;
		didAttend?: Boolean | null | undefined;
		guardianConsent?: AdministrativestatusEnum | null | undefined;
		id?: ID | null | undefined;
		mediaConsent?: AdministrativestatusEnum | null | undefined;
		mediaConsentStatus?: MediaconsentstatusEnum | null | undefined;
		paymentStatus?: AdministrativestatusEnum | null | undefined;
		termsAndConditions?: AdministrativestatusEnum | null | undefined;
		userEmail?: EmailAddress | null | undefined;
		userId?: ID | null | undefined;
	}) => Conferenceparticipant;
	upsertSurveyAnswer: (p: { optionId: ID; userId?: ID | null | undefined }) => Surveyanswer;
};

export type MyReviewStats = {
	firstReviews: Int;
	followUpReviews: Int;
	totalReviews: Int;
};

export type NametagBin = {
	fromLetter: String | null;
	index: Int;
	letters: String[];
	nationParticipants: Int;
	otherParticipants: Int;
	participants: Int;
	toLetter: String | null;
};

export type NametagBinGroup = {
	icon: String | null;
	nationAlpha2Code: String | null;
	nationAlpha3Code: String | null;
	participants: Int;
	roleName: String | null;
	sortName: String;
};

export type Nation = {
	alpha2Code: String;
	alpha3Code: String;
	conferenceRoles: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole[];
	createdAt: DateTime;
	search_distance: Float | null;
	updatedAt: DateTime;
};

export type NationOrderInputArgument = {
	alpha2Code?: SortingParameter | null | undefined;
	alpha3Code?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type NationWhereInputArgument = {
	AND?: NationWhereInputArgument[] | undefined;
	NOT?: NationWhereInputArgument | null | undefined;
	OR?: NationWhereInputArgument[] | undefined;
	alpha2Code?: StringWhereInputArgument | null | undefined;
	alpha3Code?: StringWhereInputArgument | null | undefined;
	conferenceRoles?: ConferenceroleWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type NsaCard = {
	cardNumber: Int;
	code: String;
	conferenceParticipantId: ID;
	familyName: String;
	givenName: String;
	nsaIcon: String | null;
	nsaName: String | null;
};

export type OIDCRolesEnum = 'admin' | 'chase' | 'member' | 'service_user';

export type OfflineUser = {
	email: String;
	family_name: String | null;
	given_name: String | null;
	hasPassword: Boolean | null;
	locale: String | null;
	mfaVerificationFactors: String[];
	phone: String | null;
	preferred_username: String | null;
	socialIdentities: String[];
	ssoIdentities: () => OfflineUserSsoIdentity[];
	sub: String;
};

export type OfflineUserRefresh = {
	user: () => OfflineUser | null;
};

export type OfflineUserSsoIdentity = {
	identityId: String;
	issuer: String;
};

export type OpenEmailCount = {
	kind: EmailkindEnum;
	open: Int;
};

export type OwnNametagTable = {
	fromLetter: String | null;
	index: Int;
	others: Boolean;
	toLetter: String | null;
};

export type Paper = {
	agendaItem: (p?: {
		orderBy?: CommitteeagendaitemOrderInputArgument | null | undefined;
		where?: CommitteeagendaitemWhereInputArgument | null | undefined;
	}) => Committeeagendaitem | null;
	agendaItemId: ID | null;
	author: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	authorParticipant: (p?: {
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant;
	authorParticipantId: ID;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	createdAt: DateTime;
	delegation: (p?: {
		orderBy?: DelegationOrderInputArgument | null | undefined;
		where?: DelegationWhereInputArgument | null | undefined;
	}) => Delegation;
	delegationId: ID;
	firstSubmittedAt: DateTime | null;
	id: ID;
	search_distance: Float | null;
	status: PaperstatusEnum;
	type: PapertypeEnum;
	updatedAt: DateTime;
	versions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaperversionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaperversionWhereInputArgument | null | undefined;
	}) => Paperversion[];
};

export type PaperOrderInputArgument = {
	agendaItemId?: SortingParameter | null | undefined;
	authorParticipantId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	delegationId?: SortingParameter | null | undefined;
	firstSubmittedAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	status?: SortingParameter | null | undefined;
	type?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type PaperWhereInputArgument = {
	AND?: PaperWhereInputArgument[] | undefined;
	NOT?: PaperWhereInputArgument | null | undefined;
	OR?: PaperWhereInputArgument[] | undefined;
	agendaItem?: CommitteeagendaitemWhereInputArgument | null | undefined;
	agendaItemId?: IDWhereInputArgument | null | undefined;
	author?: UserWhereInputArgument | null | undefined;
	authorParticipant?: ConferenceparticipantWhereInputArgument | null | undefined;
	authorParticipantId?: IDWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	delegation?: DelegationWhereInputArgument | null | undefined;
	delegationId?: IDWhereInputArgument | null | undefined;
	firstSubmittedAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	status?: PaperstatusEnum | null | undefined;
	type?: PapertypeEnum | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	versions?: PaperversionWhereInputArgument | null | undefined;
};

export type Paperreview = {
	comments: JSON;
	createdAt: DateTime;
	id: ID;
	paperVersion: (p?: {
		orderBy?: PaperversionOrderInputArgument | null | undefined;
		where?: PaperversionWhereInputArgument | null | undefined;
	}) => Paperversion;
	paperVersionId: ID;
	reviewer: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	reviewerId: ID;
	search_distance: Float | null;
	statusAfter: PaperstatusEnum | null;
	statusBefore: PaperstatusEnum | null;
};

export type PaperreviewOrderInputArgument = {
	comments?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	paperVersionId?: SortingParameter | null | undefined;
	reviewerId?: SortingParameter | null | undefined;
	statusAfter?: SortingParameter | null | undefined;
	statusBefore?: SortingParameter | null | undefined;
};

export type PaperreviewWhereInputArgument = {
	AND?: PaperreviewWhereInputArgument[] | undefined;
	NOT?: PaperreviewWhereInputArgument | null | undefined;
	OR?: PaperreviewWhereInputArgument[] | undefined;
	comments?: JSONWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	paperVersion?: PaperversionWhereInputArgument | null | undefined;
	paperVersionId?: IDWhereInputArgument | null | undefined;
	reviewer?: UserWhereInputArgument | null | undefined;
	reviewerId?: IDWhereInputArgument | null | undefined;
	statusAfter?: PaperstatusEnum | null | undefined;
	statusBefore?: PaperstatusEnum | null | undefined;
};

export type PaperstatusEnum = 'ACCEPTED' | 'CHANGES_REQUESTED' | 'DRAFT' | 'REVISED' | 'SUBMITTED';

export type PapertypeEnum = 'INTRODUCTION_PAPER' | 'POSITION_PAPER' | 'WORKING_PAPER';

export type Paperversion = {
	content: JSON;
	contentHash: String;
	createdAt: DateTime;
	id: ID;
	paper: (p?: {
		orderBy?: PaperOrderInputArgument | null | undefined;
		where?: PaperWhereInputArgument | null | undefined;
	}) => Paper;
	paperId: ID;
	reviews: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaperreviewOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaperreviewWhereInputArgument | null | undefined;
	}) => Paperreview[];
	search_distance: Float | null;
	status: PaperstatusEnum;
	version: Int;
};

export type PaperversionOrderInputArgument = {
	content?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	paperId?: SortingParameter | null | undefined;
	status?: SortingParameter | null | undefined;
	version?: SortingParameter | null | undefined;
};

export type PaperversionWhereInputArgument = {
	AND?: PaperversionWhereInputArgument[] | undefined;
	NOT?: PaperversionWhereInputArgument | null | undefined;
	OR?: PaperversionWhereInputArgument[] | undefined;
	content?: JSONWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	paper?: PaperWhereInputArgument | null | undefined;
	paperId?: IDWhereInputArgument | null | undefined;
	reviews?: PaperreviewWhereInputArgument | null | undefined;
	status?: PaperstatusEnum | null | undefined;
	version?: IntWhereInputArgument | null | undefined;
};

export type Paymenttransaction = {
	amount: Float;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	createdAt: DateTime;
	id: ID;
	payer: (p?: {
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant;
	payerParticipantId: ID;
	paymentFor: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: UserreferenceinpaymenttransactionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: UserreferenceinpaymenttransactionWhereInputArgument | null | undefined;
	}) => Userreferenceinpaymenttransaction[];
	recievedAt: DateTime | null;
	search_distance: Float | null;
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
};

export type PaymenttransactionOrderInputArgument = {
	amount?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	payerParticipantId?: SortingParameter | null | undefined;
	recievedAt?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type PaymenttransactionWhereInputArgument = {
	AND?: PaymenttransactionWhereInputArgument[] | undefined;
	NOT?: PaymenttransactionWhereInputArgument | null | undefined;
	OR?: PaymenttransactionWhereInputArgument[] | undefined;
	amount?: FloatWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	payer?: ConferenceparticipantWhereInputArgument | null | undefined;
	payerParticipantId?: IDWhereInputArgument | null | undefined;
	paymentFor?: UserreferenceinpaymenttransactionWhereInputArgument | null | undefined;
	recievedAt?: DateTimeWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
};

export type PersonEmail = {
	automatic: Boolean;
	detail: String | null;
	kind: EmailkindEnum;
	lastAt: Date | null;
	lastStatus: EmailstatusEnum | null;
	subjectKey: String;
};

export type PersonName = string;

export type PhoneNumber = string;

export type Place = {
	address: String | null;
	calendarEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendarentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendarentryWhereInputArgument | null | undefined;
	}) => Calendarentry[];
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	directions: String | null;
	id: ID;
	info: String | null;
	latitude: Float | null;
	longitude: Float | null;
	name: String;
	search_distance: Float | null;
	sitePlanFile: (p?: {
		orderBy?: StoredfileOrderInputArgument | null | undefined;
		where?: StoredfileWhereInputArgument | null | undefined;
	}) => Storedfile | null;
	sitePlanFileId: ID | null;
	updatedAt: DateTime;
	websiteUrl: String | null;
};

export type PlaceOrderInputArgument = {
	address?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	directions?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	info?: SortingParameter | null | undefined;
	latitude?: SortingParameter | null | undefined;
	longitude?: SortingParameter | null | undefined;
	name?: SortingParameter | null | undefined;
	sitePlanFileId?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	websiteUrl?: SortingParameter | null | undefined;
};

export type PlaceWhereInputArgument = {
	AND?: PlaceWhereInputArgument[] | undefined;
	NOT?: PlaceWhereInputArgument | null | undefined;
	OR?: PlaceWhereInputArgument[] | undefined;
	address?: StringWhereInputArgument | null | undefined;
	calendarEntries?: CalendarentryWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	directions?: StringWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	info?: StringWhereInputArgument | null | undefined;
	latitude?: FloatWhereInputArgument | null | undefined;
	longitude?: FloatWhereInputArgument | null | undefined;
	name?: StringWhereInputArgument | null | undefined;
	sitePlanFile?: StoredfileWhereInputArgument | null | undefined;
	sitePlanFileId?: IDWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	websiteUrl?: StringWhereInputArgument | null | undefined;
};

export type PlausibilityResult = {
	dataMissing: () => User[];
	shouldBeSupervisor: () => User[];
	shouldNotBeSupervisor: () => User[];
	tooOldUsers: () => User[];
	tooYoungUsers: () => User[];
};

export type PossibleDuplicateAttendance = {
	conferenceId: ID;
	role: String;
	startConference: DateTime;
	title: String;
};

export type Possibleduplicate = {
	candidate: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	candidateAttendances: () => PossibleDuplicateAttendance[];
	candidateId: ID;
	createdAt: DateTime;
	decidedAt: DateTime | null;
	decidedBy: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User | null;
	decidedById: ID | null;
	id: ID;
	inferred: Boolean;
	reasons: String[];
	score: Float;
	search_distance: Float | null;
	status: PossibleduplicatestatusEnum;
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	userAttendances: () => PossibleDuplicateAttendance[];
	userId: ID;
};

export type PossibleduplicateOrderInputArgument = {
	candidateId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	decidedAt?: SortingParameter | null | undefined;
	decidedById?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	inferred?: SortingParameter | null | undefined;
	reasons?: SortingParameter | null | undefined;
	score?: SortingParameter | null | undefined;
	status?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	userId?: SortingParameter | null | undefined;
};

export type PossibleduplicateWhereInputArgument = {
	AND?: PossibleduplicateWhereInputArgument[] | undefined;
	NOT?: PossibleduplicateWhereInputArgument | null | undefined;
	OR?: PossibleduplicateWhereInputArgument[] | undefined;
	candidate?: UserWhereInputArgument | null | undefined;
	candidateId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	decidedAt?: DateTimeWhereInputArgument | null | undefined;
	decidedBy?: UserWhereInputArgument | null | undefined;
	decidedById?: IDWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	inferred?: BooleanWhereInputArgument | null | undefined;
	reasons?: StringArrayWhereInputArgument | null | undefined;
	score?: FloatWhereInputArgument | null | undefined;
	status?: PossibleduplicatestatusEnum | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
	userId?: IDWhereInputArgument | null | undefined;
};

export type PossibleduplicatestatusEnum = 'CONFIRMED' | 'DISMISSED' | 'OPEN';

export type PreviewConferenceSupervisor = {
	different_school: Boolean;
	family_name: String | null;
	given_name: String | null;
	school_city: String | null;
	school_name: String | null;
};

export type ProfileField =
	| 'apartment'
	| 'birthday'
	| 'city'
	| 'country'
	| 'emergencyContacts'
	| 'family_name'
	| 'foodPreference'
	| 'gender'
	| 'given_name'
	| 'phone'
	| 'pronouns'
	| 'region'
	| 'street'
	| 'wantsJoinTeamInformation'
	| 'wantsToReceiveGeneralInformation'
	| 'zip';

export type Query = {
	assignmentReview: (p: { id: ID }) => Assignmentreview;
	assignmentReviews: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AssignmentreviewOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AssignmentreviewWhereInputArgument | null | undefined;
	}) => Assignmentreview[];
	assignmentReviewsCount: (p?: {
		where?: AssignmentreviewWhereInputArgument | null | undefined;
	}) => Int;
	assignmentSingleRole: (p: { id: ID }) => Assignmentsinglerole;
	assignmentSingleRoles: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AssignmentsingleroleOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AssignmentsingleroleWhereInputArgument | null | undefined;
	}) => Assignmentsinglerole[];
	assignmentUnit: (p: { id: ID }) => Assignmentunit;
	assignmentUnits: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AssignmentunitOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AssignmentunitWhereInputArgument | null | undefined;
	}) => Assignmentunit[];
	assignmentWeight: (p: { id: ID }) => Assignmentweights;
	assignmentWeights: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AssignmentweightsOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AssignmentweightsWhereInputArgument | null | undefined;
	}) => Assignmentweights[];
	attendanceEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AttendanceentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AttendanceentryWhereInputArgument | null | undefined;
	}) => Attendanceentry[];
	attendanceEntry: (p: { id: ID }) => Attendanceentry;
	attendanceSession: (p: { id: ID }) => Attendancesession;
	attendanceSessions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AttendancesessionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AttendancesessionWhereInputArgument | null | undefined;
	}) => Attendancesession[];
	calendarDay: (p: { id: ID }) => Calendarday;
	calendarDays: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendardayOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendardayWhereInputArgument | null | undefined;
	}) => Calendarday[];
	calendarEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendarentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendarentryWhereInputArgument | null | undefined;
	}) => Calendarentry[];
	calendarEntry: (p: { id: ID }) => Calendarentry;
	calendarTrack: (p: { id: ID }) => Calendartrack;
	calendarTracks: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendartrackOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendartrackWhereInputArgument | null | undefined;
	}) => Calendartrack[];
	canImpersonateUser: (p: { targetUserId: ID }) => Boolean;
	chasePresence: (p: { conferenceId: ID }) => ChasePresence | null;
	checkTeamInvitationEmails: (p: { conferenceId: ID; emails: String[] }) => EmailStatusResult[];
	collectiveGroups: (p: { conferenceId: ID }) => CollectiveGroup[];
	committee: (p: { id: ID }) => Committee;
	committeeAgendaItem: (p: { id: ID }) => Committeeagendaitem;
	committeeAgendaItems: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CommitteeagendaitemOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CommitteeagendaitemWhereInputArgument | null | undefined;
	}) => Committeeagendaitem[];
	committees: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CommitteeOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CommitteeWhereInputArgument | null | undefined;
	}) => Committee[];
	conference: (p: { id: ID }) => Conference;
	conferenceEmailFooter: (p: { id: ID }) => Conferenceemailfooter;
	conferenceEmailFooters: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceemailfooterOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceemailfooterWhereInputArgument | null | undefined;
	}) => Conferenceemailfooter[];
	conferenceEmailSetting: (p: { id: ID }) => Conferenceemailsetting;
	conferenceEmailSettings: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceemailsettingOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceemailsettingWhereInputArgument | null | undefined;
	}) => Conferenceemailsetting[];
	conferenceEmailText: (p: { id: ID }) => Conferenceemailtext;
	conferenceEmailTexts: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceemailtextOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceemailtextWhereInputArgument | null | undefined;
	}) => Conferenceemailtext[];
	conferenceParticipant: (p: { id: ID }) => Conferenceparticipant;
	conferenceParticipants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant[];
	conferencePlausibility: (p: { conferenceId: ID }) => PlausibilityResult;
	conferenceRole: (p: { id: ID }) => Conferencerole;
	conferenceRoles: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole[];
	conferenceSupervisor: (p: { id: ID }) => Conferencesupervisor;
	conferenceSupervisors: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferencesupervisorOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferencesupervisorWhereInputArgument | null | undefined;
	}) => Conferencesupervisor[];
	conferences: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference[];
	dataTableGroups: (p: {
		conferenceId: ID;
		query: JSON;
		revision?: String | null | undefined;
		search?: String | null | undefined;
		table: String;
	}) => DataTableGroup[];
	dataTablePage: (p: {
		conferenceId: ID;
		limit: Int;
		offset: Int;
		query: JSON;
		revision?: String | null | undefined;
		search?: String | null | undefined;
		table: String;
	}) => DataTablePage;
	delegation: (p: { id: ID }) => Delegation;
	delegationMember: (p: { id: ID }) => Delegationmember;
	delegationMembers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationmemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationmemberWhereInputArgument | null | undefined;
	}) => Delegationmember[];
	delegations: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationWhereInputArgument | null | undefined;
	}) => Delegation[];
	delegationsCount: (p?: { where?: DelegationWhereInputArgument | null | undefined }) => Int;
	emailLog: (p: { id: ID }) => Emaillog;
	emailLogs: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: EmaillogOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: EmaillogWhereInputArgument | null | undefined;
	}) => Emaillog[];
	emailPreview: (p: {
		body?: String | null | undefined;
		conferenceId: ID;
		draft?: Boolean | null | undefined;
		footer?: String | null | undefined;
		heading?: String | null | undefined;
		kind: EmailkindEnum;
		locale?: String | null | undefined;
		subject?: String | null | undefined;
	}) => EmailPreview;
	emailStats: (p: { conferenceId: ID; revision?: Int | null | undefined }) => EmailKindStats[];
	findIntroductionPapers: (p: { conferenceId: ID }) => Paper[];
	findNextPaperToReview: (p: { agendaItemId: ID }) => Paper;
	findPapersGroupedByCommittee: (p: { conferenceId: ID }) => CommitteePaperGroup[];
	findSupervisedPapers: (p: { conferenceId: ID }) => Paper[];
	flagCollection: (p: { conferenceId: ID }) => FlagCollectionData;
	getAllConferenceNations: (p: { conferenceId: ID }) => Nation[];
	getCertificate: (p: { conferenceId: ID; userId: ID }) => Certificate;
	getCertificateJWTPublicKeyObject: () => JWK;
	getConferenceStatistics: (p: {
		conferenceId: ID;
		filter?: StatsFilter | null | undefined;
	}) => StatisticsResult;
	impersonationStatus: () => ImpersonationStatus;
	instanceLink: (p: { id: ID }) => Instancelink;
	instanceLinks: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: InstancelinkOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: InstancelinkWhereInputArgument | null | undefined;
	}) => Instancelink[];
	logoutUrl: String;
	mcpAuditEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: McpauditentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: McpauditentryWhereInputArgument | null | undefined;
	}) => Mcpauditentry[];
	mcpAuditEntry: (p: { id: ID }) => Mcpauditentry;
	mcpServerUrl: String | null;
	myAgeNotice: (p: { conferenceId: ID; role: AgeRole }) => AgeNotice | null;
	myOIDCRoles: OIDCRolesEnum[];
	myReviewStats: (p: { conferenceId: ID }) => MyReviewStats | null;
	myReviewerSnippets: () => Reviewersnippet[];
	mySupervisorSignupBlockers: (p: { conferenceId: ID }) => ApplicationBlocker[];
	nametagBinGroups: (p: { binCount: Int; conferenceId: ID; index: Int }) => NametagBinGroup[];
	nametagBins: (p: { binCount?: Int | null | undefined; conferenceId: ID }) => NametagBin[];
	nation: (p: { id: ID }) => Nation;
	nations: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: NationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: NationWhereInputArgument | null | undefined;
	}) => Nation[];
	offlineUserRefresh: () => OfflineUserRefresh;
	openEmailCounts: (p: {
		conferenceId: ID;
		kinds?: EmailkindEnum[] | null | undefined;
		revision?: String | null | undefined;
	}) => OpenEmailCount[];
	ownNametagTable: (p: { conferenceId: ID }) => OwnNametagTable | null;
	paper: (p: { id: ID }) => Paper;
	papers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaperOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaperWhereInputArgument | null | undefined;
	}) => Paper[];
	papersCount: (p?: { where?: PaperWhereInputArgument | null | undefined }) => Int;
	paymentTransaction: (p: { id: ID }) => Paymenttransaction;
	paymentTransactions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaymenttransactionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaymenttransactionWhereInputArgument | null | undefined;
	}) => Paymenttransaction[];
	personEmails: (p: {
		conferenceId: ID;
		revision?: String | null | undefined;
		userId: ID;
	}) => PersonEmail[];
	place: (p: { id: ID }) => Place;
	places: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PlaceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PlaceWhereInputArgument | null | undefined;
	}) => Place[];
	possibleDuplicate: (p: { id: ID }) => Possibleduplicate;
	possibleDuplicates: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PossibleduplicateOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PossibleduplicateWhereInputArgument | null | undefined;
	}) => Possibleduplicate[];
	previewConferenceSupervisor: (p: {
		conferenceId: ID;
		connectionCode: String;
	}) => PreviewConferenceSupervisor;
	previewDelegation: (p: { conferenceId: ID; entryCode: String }) => DelegationPreview;
	resolution: (p: { id: ID }) => Resolution;
	resolutions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ResolutionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ResolutionWhereInputArgument | null | undefined;
	}) => Resolution[];
	reviewerLeaderboard: (p: { conferenceId: ID }) => ReviewerStat[];
	reviewerSnippet: (p: { id: ID }) => Reviewersnippet;
	reviewerSnippets: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ReviewersnippetOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ReviewersnippetWhereInputArgument | null | undefined;
	}) => Reviewersnippet[];
	roleApplication: (p: { id: ID }) => Roleapplication;
	roleApplications: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: RoleapplicationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: RoleapplicationWhereInputArgument | null | undefined;
	}) => Roleapplication[];
	scanLookup: (p: {
		asScan?: Boolean | null | undefined;
		code: String;
		conferenceId: ID;
		sessionId?: ID | null | undefined;
	}) => ScanLookupResult;
	school: (p: { id: ID }) => School;
	schoolMetrics: (p: { schoolId: ID }) => SchoolConferenceMetrics[];
	schoolSuggestion: (p: { id: ID }) => Schoolsuggestion;
	schoolSuggestions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SchoolsuggestionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SchoolsuggestionWhereInputArgument | null | undefined;
	}) => Schoolsuggestion[];
	schools: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SchoolOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SchoolWhereInputArgument | null | undefined;
	}) => School[];
	searchHistories: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SearchhistoryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SearchhistoryWhereInputArgument | null | undefined;
	}) => Searchhistory[];
	searchHistory: (p: { id: ID }) => Searchhistory;
	searchSchools: (p: { limit?: Int | null | undefined; search: String }) => School[];
	seatPlanningAssignments: (p: { conferenceId: ID }) => SeatPlanningAssignments;
	sightingDeck: (p: {
		conferenceId: ID;
		currentId?: ID | null | undefined;
		index?: Int | null | undefined;
		schoolId?: ID | null | undefined;
		size?: Int | null | undefined;
		status?: String | null | undefined;
		withoutSchool?: Boolean | null | undefined;
	}) => SightingDeck;
	sightingEntries: (p: {
		conferenceId: ID;
		ids: ID[];
		schoolId?: ID | null | undefined;
		status?: String | null | undefined;
		withoutSchool?: Boolean | null | undefined;
	}) => SightingDeckEntry[];
	sightingNameMatches: (p: { conferenceId: ID; search: String }) => SightingNameMatch[];
	sightingSchools: (p: {
		conferenceId: ID;
		limit?: Int | null | undefined;
		search?: String | null | undefined;
	}) => SightingSchool[];
	signedCodeKeys: () => SignedCodeKey[];
	singleParticipant: (p: { id: ID }) => Singleparticipant;
	singleParticipants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant[];
	supervisorSignupOpen: (p: { conferenceId: ID }) => Boolean;
	surveyAnswer: (p: { id: ID }) => Surveyanswer;
	surveyAnswers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyanswerOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyanswerWhereInputArgument | null | undefined;
	}) => Surveyanswer[];
	surveyOption: (p: { id: ID }) => Surveyoption;
	surveyOptions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyoptionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyoptionWhereInputArgument | null | undefined;
	}) => Surveyoption[];
	surveyQuestion: (p: { id: ID }) => Surveyquestion;
	surveyQuestions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyquestionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyquestionWhereInputArgument | null | undefined;
	}) => Surveyquestion[];
	tableView: (p: { id: ID }) => Tableview;
	tableViewDefault: (p: { id: ID }) => Tableviewdefault;
	tableViewDefaults: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TableviewdefaultOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TableviewdefaultWhereInputArgument | null | undefined;
	}) => Tableviewdefault[];
	tableViews: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TableviewOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TableviewWhereInputArgument | null | undefined;
	}) => Tableview[];
	teamMember: (p: { id: ID }) => Teammember;
	teamMemberInvitation: (p: { id: ID }) => Teammemberinvitation;
	teamMemberInvitations: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TeammemberinvitationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TeammemberinvitationWhereInputArgument | null | undefined;
	}) => Teammemberinvitation[];
	teamMembers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TeammemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TeammemberWhereInputArgument | null | undefined;
	}) => Teammember[];
	teamMembersCount: (p?: { where?: TeammemberWhereInputArgument | null | undefined }) => Int;
	user: (p: { id: ID }) => User;
	users: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: UserOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User[];
	waitingListEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: WaitinglistentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: WaitinglistentryWhereInputArgument | null | undefined;
	}) => Waitinglistentry[];
	waitingListEntriesCount: (p?: {
		where?: WaitinglistentryWhereInputArgument | null | undefined;
	}) => Int;
	waitingListEntry: (p: { id: ID }) => Waitinglistentry;
};

export type RegeneratedInvitation = {
	expiresAt: DateTime;
	token: String;
};

export type RegionalbaselineEnum =
	'ECOSOC' | 'HUMAN_RIGHTS_COUNCIL' | 'MANUAL' | 'SECURITY_COUNCIL' | 'UN_MEMBERS';

export type Resolution = {
	chasePaperId: ID | null;
	chaseSnapshotId: ID | null;
	committee: (p?: {
		orderBy?: CommitteeOrderInputArgument | null | undefined;
		where?: CommitteeWhereInputArgument | null | undefined;
	}) => Committee | null;
	committeeId: ID | null;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	file: (p?: {
		orderBy?: StoredfileOrderInputArgument | null | undefined;
		where?: StoredfileWhereInputArgument | null | undefined;
	}) => Storedfile;
	fileId: ID;
	id: ID;
	search_distance: Float | null;
	title: String;
	updatedAt: DateTime;
};

export type ResolutionOrderInputArgument = {
	chasePaperId?: SortingParameter | null | undefined;
	chaseSnapshotId?: SortingParameter | null | undefined;
	committeeId?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	fileId?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	title?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type ResolutionWhereInputArgument = {
	AND?: ResolutionWhereInputArgument[] | undefined;
	NOT?: ResolutionWhereInputArgument | null | undefined;
	OR?: ResolutionWhereInputArgument[] | undefined;
	chasePaperId?: IDWhereInputArgument | null | undefined;
	chaseSnapshotId?: IDWhereInputArgument | null | undefined;
	committee?: CommitteeWhereInputArgument | null | undefined;
	committeeId?: IDWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	file?: StoredfileWhereInputArgument | null | undefined;
	fileId?: IDWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	title?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type ReviewerStat = {
	anonymizedName: String;
	firstReviews: Int;
	isCurrentUser: Boolean;
	totalReviews: Int;
};

export type Reviewersnippet = {
	content: JSON;
	createdAt: DateTime;
	id: ID;
	name: String;
	search_distance: Float | null;
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	userId: ID;
};

export type ReviewersnippetOrderInputArgument = {
	content?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	name?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	userId?: SortingParameter | null | undefined;
};

export type ReviewersnippetWhereInputArgument = {
	AND?: ReviewersnippetWhereInputArgument[] | undefined;
	NOT?: ReviewersnippetWhereInputArgument | null | undefined;
	OR?: ReviewersnippetWhereInputArgument[] | undefined;
	content?: JSONWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	name?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
	userId?: IDWhereInputArgument | null | undefined;
};

export type ReviewhelpstatusEnum = 'HELP_NEEDED' | 'NO_HELP_WANTED' | 'UNSPECIFIED';

export type Roleapplication = {
	createdAt: DateTime;
	delegation: (p?: {
		orderBy?: DelegationOrderInputArgument | null | undefined;
		where?: DelegationWhereInputArgument | null | undefined;
	}) => Delegation;
	delegationId: ID;
	id: ID;
	rank: Int;
	role: (p?: {
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole;
	roleId: ID;
	search_distance: Float | null;
	updatedAt: DateTime;
};

export type RoleapplicationOrderInputArgument = {
	createdAt?: SortingParameter | null | undefined;
	delegationId?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	rank?: SortingParameter | null | undefined;
	roleId?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type RoleapplicationWhereInputArgument = {
	AND?: RoleapplicationWhereInputArgument[] | undefined;
	NOT?: RoleapplicationWhereInputArgument | null | undefined;
	OR?: RoleapplicationWhereInputArgument[] | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	delegation?: DelegationWhereInputArgument | null | undefined;
	delegationId?: IDWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	rank?: IntWhereInputArgument | null | undefined;
	role?: ConferenceroleWhereInputArgument | null | undefined;
	roleId?: IDWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type ScanIssue =
	| 'alreadyScanned'
	| 'guardianConsentOpen'
	| 'notInConference'
	| 'paymentOpen'
	| 'surveyOptionMissing'
	| 'teamMember'
	| 'termsOpen';

export type ScanLookupResult = {
	birthday: String | null;
	checkPassed: Boolean;
	committeeAbbreviation: String | null;
	didAttend: Boolean;
	familyName: String | null;
	found: Boolean;
	givenName: String | null;
	guardianConsent: AdministrativestatusEnum;
	inConference: Boolean;
	isHeadDelegate: Boolean;
	isSupervisor: Boolean;
	isTeamMember: Boolean;
	isWaitingList: Boolean;
	issues: ScanIssue[];
	mayRecordAnyway: Boolean;
	missingSurveyOptions: String[];
	nationAlpha2Code: String | null;
	nationAlpha3Code: String | null;
	nonStateActorIcon: String | null;
	nonStateActorName: String | null;
	paymentStatus: AdministrativestatusEnum;
	singleRoleName: String | null;
	termsAndConditions: AdministrativestatusEnum;
	userId: String | null;
};

export type School = {
	apartment: String | null;
	city: String | null;
	contactEmail: String | null;
	contactName: String | null;
	contactPhone: String | null;
	country: String | null;
	createdAt: DateTime;
	id: ID;
	isForeignSchool: Boolean;
	name: String;
	notes: String | null;
	participants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant[];
	region: String | null;
	search_distance: Float | null;
	street: String | null;
	updatedAt: DateTime;
	waitingListEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: WaitinglistentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: WaitinglistentryWhereInputArgument | null | undefined;
	}) => Waitinglistentry[];
	website: String | null;
	zip: String | null;
};

export type SchoolConferenceMetrics = {
	applied: Int;
	attended: Int;
	conferenceId: ID;
	conferenceTitle: String;
	delegations: Int;
	fromWaitingList: Int;
	participants: Int;
	seated: Int;
	startConference: DateTime;
	supervisors: Int;
	waitingList: Int;
};

export type SchoolOrderInputArgument = {
	apartment?: SortingParameter | null | undefined;
	city?: SortingParameter | null | undefined;
	contactEmail?: SortingParameter | null | undefined;
	contactName?: SortingParameter | null | undefined;
	contactPhone?: SortingParameter | null | undefined;
	country?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	isForeignSchool?: SortingParameter | null | undefined;
	name?: SortingParameter | null | undefined;
	notes?: SortingParameter | null | undefined;
	region?: SortingParameter | null | undefined;
	street?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	website?: SortingParameter | null | undefined;
	zip?: SortingParameter | null | undefined;
};

export type SchoolWhereInputArgument = {
	AND?: SchoolWhereInputArgument[] | undefined;
	NOT?: SchoolWhereInputArgument | null | undefined;
	OR?: SchoolWhereInputArgument[] | undefined;
	apartment?: StringWhereInputArgument | null | undefined;
	city?: StringWhereInputArgument | null | undefined;
	contactEmail?: StringWhereInputArgument | null | undefined;
	contactName?: StringWhereInputArgument | null | undefined;
	contactPhone?: StringWhereInputArgument | null | undefined;
	country?: StringWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	isForeignSchool?: BooleanWhereInputArgument | null | undefined;
	name?: StringWhereInputArgument | null | undefined;
	notes?: StringWhereInputArgument | null | undefined;
	participants?: ConferenceparticipantWhereInputArgument | null | undefined;
	region?: StringWhereInputArgument | null | undefined;
	street?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	waitingListEntries?: WaitinglistentryWhereInputArgument | null | undefined;
	website?: StringWhereInputArgument | null | undefined;
	zip?: StringWhereInputArgument | null | undefined;
};

export type Schoolsuggestion = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	dismissed: Boolean;
	id: ID;
	key: String;
	search_distance: Float | null;
	similarity: Float;
	updatedAt: DateTime;
	variants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SchoolsuggestionvariantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SchoolsuggestionvariantWhereInputArgument | null | undefined;
	}) => Schoolsuggestionvariant[];
};

export type SchoolsuggestionOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	dismissed?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	key?: SortingParameter | null | undefined;
	similarity?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type SchoolsuggestionWhereInputArgument = {
	AND?: SchoolsuggestionWhereInputArgument[] | undefined;
	NOT?: SchoolsuggestionWhereInputArgument | null | undefined;
	OR?: SchoolsuggestionWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	dismissed?: BooleanWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	key?: StringWhereInputArgument | null | undefined;
	similarity?: FloatWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	variants?: SchoolsuggestionvariantWhereInputArgument | null | undefined;
};

export type Schoolsuggestionvariant = {
	createdAt: DateTime;
	id: ID;
	school: (p?: {
		orderBy?: SchoolOrderInputArgument | null | undefined;
		where?: SchoolWhereInputArgument | null | undefined;
	}) => School;
	schoolId: ID;
	search_distance: Float | null;
	suggestion: (p?: {
		orderBy?: SchoolsuggestionOrderInputArgument | null | undefined;
		where?: SchoolsuggestionWhereInputArgument | null | undefined;
	}) => Schoolsuggestion;
	suggestionId: ID;
	sumParticipants: Int;
	updatedAt: DateTime;
};

export type SchoolsuggestionvariantOrderInputArgument = {
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	schoolId?: SortingParameter | null | undefined;
	suggestionId?: SortingParameter | null | undefined;
	sumParticipants?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type SchoolsuggestionvariantWhereInputArgument = {
	AND?: SchoolsuggestionvariantWhereInputArgument[] | undefined;
	NOT?: SchoolsuggestionvariantWhereInputArgument | null | undefined;
	OR?: SchoolsuggestionvariantWhereInputArgument[] | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	school?: SchoolWhereInputArgument | null | undefined;
	schoolId?: IDWhereInputArgument | null | undefined;
	suggestion?: SchoolsuggestionWhereInputArgument | null | undefined;
	suggestionId?: IDWhereInputArgument | null | undefined;
	sumParticipants?: IntWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Searchhistory = {
	conferenceId: ID;
	createdAt: DateTime;
	id: ID;
	label: String;
	originId: ID;
	resultId: ID;
	search_distance: Float | null;
	updatedAt: DateTime;
	userId: ID;
};

export type SearchhistoryOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	label?: SortingParameter | null | undefined;
	originId?: SortingParameter | null | undefined;
	resultId?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	userId?: SortingParameter | null | undefined;
};

export type SearchhistoryWhereInputArgument = {
	AND?: SearchhistoryWhereInputArgument[] | undefined;
	NOT?: SearchhistoryWhereInputArgument | null | undefined;
	OR?: SearchhistoryWhereInputArgument[] | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	label?: StringWhereInputArgument | null | undefined;
	originId?: IDWhereInputArgument | null | undefined;
	resultId?: IDWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	userId?: IDWhereInputArgument | null | undefined;
};

export type SeatPlanningAssignedRole = {
	memberCount: Int;
	nationAlpha3Code: String | null;
	roleId: ID;
};

export type SeatPlanningAssignments = {
	committeeSeats: () => SeatPlanningCommitteeSeat[];
	roles: () => SeatPlanningAssignedRole[];
};

export type SeatPlanningCommitteeSeat = {
	committeeId: ID;
	memberNames: String[];
	nationAlpha3Code: String;
};

export type SendPersonEmailResult = {
	error: String | null;
	sent: Boolean;
};

export type SightingDeck = {
	counts: () => SightingDeckCounts;
	current: () => SightingDeckEntry | null;
	entries: () => SightingDeckEntry[];
	index: Int;
	overallRated: Int;
	overallTotal: Int;
	start: Int;
	total: Int;
	unreviewedPastWindow: () => SightingDeckEntry | null;
};

export type SightingDeckCounts = {
	disqualified: Int;
	flagged: Int;
	rated: Int;
	unrated: Int;
};

export type SightingDeckEntry = {
	id: ID;
	kind: String;
	required: Boolean;
	school: String | null;
	size: Int;
	status: String;
};

export type SightingNameMatch = {
	id: ID;
};

export type SightingSchool = {
	applications: Int;
	city: String | null;
	people: Int;
	school: String;
	schoolId: ID | null;
};

export type SignedCode = {
	code: String;
};

export type SignedCodeKey = {
	kid: Int;
	publicKey: String;
};

export type Singleparticipant = {
	applicationBlockers: () => ApplicationBlocker[];
	applied: Boolean;
	appliedForRoles: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole[];
	assignedRole: (p?: {
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole | null;
	assignedRoleId: ID | null;
	assignmentReview: (p?: {
		orderBy?: AssignmentreviewOrderInputArgument | null | undefined;
		where?: AssignmentreviewWhereInputArgument | null | undefined;
	}) => Assignmentreview | null;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceParticipantId: ID;
	createdAt: DateTime;
	experience: String | null;
	id: ID;
	motivation: String | null;
	participant: (p?: {
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant;
	school: (p?: {
		orderBy?: SchoolOrderInputArgument | null | undefined;
		where?: SchoolWhereInputArgument | null | undefined;
	}) => School | null;
	search_distance: Float | null;
	supervisors: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferencesupervisorOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferencesupervisorWhereInputArgument | null | undefined;
	}) => Conferencesupervisor[];
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
};

export type SingleparticipantOrderInputArgument = {
	applied?: SortingParameter | null | undefined;
	assignedRoleId?: SortingParameter | null | undefined;
	conferenceParticipantId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	experience?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	motivation?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type SingleparticipantWhereInputArgument = {
	AND?: SingleparticipantWhereInputArgument[] | undefined;
	NOT?: SingleparticipantWhereInputArgument | null | undefined;
	OR?: SingleparticipantWhereInputArgument[] | undefined;
	applied?: BooleanWhereInputArgument | null | undefined;
	appliedForRoles?: ConferenceroleWhereInputArgument | null | undefined;
	assignedRole?: ConferenceroleWhereInputArgument | null | undefined;
	assignedRoleId?: IDWhereInputArgument | null | undefined;
	assignmentReview?: AssignmentreviewWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceParticipantId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	experience?: StringWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	motivation?: StringWhereInputArgument | null | undefined;
	participant?: ConferenceparticipantWhereInputArgument | null | undefined;
	school?: SchoolWhereInputArgument | null | undefined;
	supervisors?: ConferencesupervisorWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
};

export type SortingParameter = 'asc' | 'desc';

export type StatisticsResult = {
	addresses: () => StatisticsResultAddresses[];
	age: () => StatisticsResultAge;
	committeeFillRates: () => StatisticsResultCommitteeFillRate[];
	countdowns: () => StatisticsResultCountdowns;
	diet: () => StatisticsResultRegisteredParticipantDiet;
	gender: () => StatisticsResultRegisteredParticipantGender;
	nationalityDistribution: () => StatisticsResultNationality[];
	paperStats: () => StatisticsResultPaperStats;
	postalPaymentProgress: () => StatisticsResultPostalPaymentProgress;
	refreshedAt: DateTime | null;
	registered: () => StatisticsResultRegistered;
	registrationTimeline: () => StatisticsResultRegistrationTimeline[];
	roleBased: () => StatisticsResultRoleBased;
	schoolStats: () => StatisticsResultSchool[];
	supervisorStats: () => StatisticsResultSupervisorStats;
	waitingList: () => StatisticsResultWaitingList;
};

export type StatisticsResultAddresses = {
	count: Int;
	country: String | null;
	lat: Float | null;
	lng: Float | null;
	zipPrefix: String | null;
};

export type StatisticsResultAge = {
	byCategory: () => StatisticsResultAgeCategoryStats[];
	byCommittee: () => StatisticsResultAgeCommitteeStats[];
	distribution: () => StatisticsResultAgeDistributionEntry[];
	overall: () => StatisticsResultAgeOverall;
};

export type StatisticsResultAgeCategoryBreakdown = {
	categoryId: String;
	count: Int;
};

export type StatisticsResultAgeCategoryStats = {
	average: Float | null;
	categoryId: String;
	categoryName: String;
	categoryType: StatisticsResultAgeCategoryType;
	count: Int;
};

export type StatisticsResultAgeCategoryType = 'delegationMember' | 'singleParticipant';

export type StatisticsResultAgeCommitteeStats = {
	abbreviation: String;
	average: Float | null;
	committeeId: String;
	committeeName: String;
	count: Int;
};

export type StatisticsResultAgeDistributionEntry = {
	age: Int;
	byCategory: () => StatisticsResultAgeCategoryBreakdown[];
	count: Int;
};

export type StatisticsResultAgeOverall = {
	average: Float | null;
	missingBirthdays: Int;
	total: Int;
};

export type StatisticsResultCommitteeFillRate = {
	abbreviation: String;
	assignedSeats: Int;
	committeeId: ID;
	fillPercentage: Int;
	name: String;
	totalSeats: Int;
};

export type StatisticsResultCountdowns = {
	daysUntilConference: Int;
	daysUntilEndRegistration: Int;
};

export type StatisticsResultNationality = {
	count: Int;
	country: String;
};

export type StatisticsResultPaperStats = {
	byCommittee: () => StatisticsResultPapersByCommittee[];
	byStatus: () => StatisticsResultPapersByStatus;
	byType: () => StatisticsResultPapersByType;
	total: Int;
	withReviews: Int;
	withoutReviews: Int;
};

export type StatisticsResultPapersByCommittee = {
	abbreviation: String;
	committeeId: String;
	count: Int;
	name: String;
};

export type StatisticsResultPapersByStatus = {
	accepted: Int;
	changesRequested: Int;
	draft: Int;
	submitted: Int;
};

export type StatisticsResultPapersByType = {
	introductionPaper: Int;
	positionPaper: Int;
	workingPaper: Int;
};

export type StatisticsResultPostalPaymentProgress = {
	bothComplete: Int;
	maxParticipants: Int;
	neitherComplete: Int;
	paymentDone: Int;
	paymentOnlyComplete: Int;
	paymentPending: Int;
	paymentPercentage: Int;
	paymentProblem: Int;
	postalDone: Int;
	postalOnlyComplete: Int;
	postalPending: Int;
	postalPercentage: Int;
	postalProblem: Int;
};

export type StatisticsResultRegistered = {
	applied: Int;
	delegationMembers: () => StatisticsResultRegisteredDelegationMembers;
	delegations: () => StatisticsResultRegisteredDelegations;
	notApplied: Int;
	singleParticipants: () => StatisticsResultRegisteredSingleParticipants;
	supervisors: Int;
	total: Int;
};

export type StatisticsResultRegisteredDelegationMembers = {
	applied: Int;
	notApplied: Int;
	total: Int;
};

export type StatisticsResultRegisteredDelegations = {
	applied: Int;
	notApplied: Int;
	total: Int;
};

export type StatisticsResultRegisteredParticipantDiet = {
	delegationMembers: () => StatisticsResultRegisteredParticipantDietVariations;
	singleParticipants: () => StatisticsResultRegisteredParticipantDietVariations;
	supervisors: () => StatisticsResultRegisteredParticipantDietVariations;
	teamMembers: () => StatisticsResultRegisteredParticipantDietVariations;
};

export type StatisticsResultRegisteredParticipantDietVariations = {
	omnivore: Int;
	vegan: Int;
	vegetarian: Int;
};

export type StatisticsResultRegisteredParticipantGender = {
	delegationMembers: () => StatisticsResultRegisteredParticipantGenderVariations;
	singleParticipants: () => StatisticsResultRegisteredParticipantGenderVariations;
	supervisors: () => StatisticsResultRegisteredParticipantGenderVariations;
	teamMembers: () => StatisticsResultRegisteredParticipantGenderVariations;
};

export type StatisticsResultRegisteredParticipantGenderVariations = {
	diverse: Int;
	female: Int;
	male: Int;
	noStatement: Int;
};

export type StatisticsResultRegisteredSingleParticipants = {
	applied: Int;
	byRole: () => StatisticsResultRegisteredSingleParticipantsByRole[];
	notApplied: Int;
	total: Int;
};

export type StatisticsResultRegisteredSingleParticipantsByRole = {
	applied: Int;
	icon: String | null;
	notApplied: Int;
	role: String;
	total: Int;
};

export type StatisticsResultRegistrationTimeline = {
	cumulativeDelegationMembers: Int;
	cumulativeDelegations: Int;
	cumulativeSingleParticipants: Int;
	cumulativeSupervisors: Int;
	date: String;
};

export type StatisticsResultRoleBased = {
	delegationMembersWithCommittee: Int;
	delegationMembersWithRole: Int;
	delegationMembersWithoutCommittee: Int;
	delegationMembersWithoutRole: Int;
	delegationsWithAssignment: Int;
	delegationsWithoutAssignment: Int;
	singleParticipantsWithRole: Int;
	singleParticipantsWithoutRole: Int;
};

export type StatisticsResultSchool = {
	people: Int;
	school: String;
};

export type StatisticsResultSupervisorStats = {
	accepted: Int;
	acceptedAndNotPresent: Int;
	acceptedAndPresent: Int;
	doesNotPlanAttendance: Int;
	plansAttendance: Int;
	rejected: Int;
	rejectedAndNotPresent: Int;
	rejectedAndPresent: Int;
	total: Int;
};

export type StatisticsResultWaitingList = {
	assigned: Int;
	hidden: Int;
	total: Int;
	unassigned: Int;
	visible: Int;
};

export type StatsFilter =
	'ALL' | 'APPLIED' | 'APPLIED_WITHOUT_ROLE' | 'APPLIED_WITH_ROLE' | 'NOT_APPLIED';

export type Storedfile = {
	certificateOf: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference[];
	contractOf: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference[];
	createdAt: DateTime;
	emblemOf: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference[];
	fileName: String | null;
	guardianConsentOf: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference[];
	id: ID;
	imageOf: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference[];
	key: String;
	logoOf: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference[];
	mediaConsentOf: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference[];
	mimeType: String;
	purpose: String;
	resolutionOf: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ResolutionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ResolutionWhereInputArgument | null | undefined;
	}) => Resolution[];
	search_distance: Float | null;
	sitePlanOf: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PlaceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PlaceWhereInputArgument | null | undefined;
	}) => Place[];
	size: Int;
	termsAndConditionsOf: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference[];
	updatedAt: DateTime;
	uploadUrl: String | null;
	uploadedById: ID | null;
	url: String;
};

export type StoredfileOrderInputArgument = {
	createdAt?: SortingParameter | null | undefined;
	fileName?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	key?: SortingParameter | null | undefined;
	mimeType?: SortingParameter | null | undefined;
	purpose?: SortingParameter | null | undefined;
	size?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	uploadedById?: SortingParameter | null | undefined;
};

export type StoredfileWhereInputArgument = {
	AND?: StoredfileWhereInputArgument[] | undefined;
	NOT?: StoredfileWhereInputArgument | null | undefined;
	OR?: StoredfileWhereInputArgument[] | undefined;
	certificateOf?: ConferenceWhereInputArgument | null | undefined;
	contractOf?: ConferenceWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	emblemOf?: ConferenceWhereInputArgument | null | undefined;
	fileName?: StringWhereInputArgument | null | undefined;
	guardianConsentOf?: ConferenceWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	imageOf?: ConferenceWhereInputArgument | null | undefined;
	key?: StringWhereInputArgument | null | undefined;
	logoOf?: ConferenceWhereInputArgument | null | undefined;
	mediaConsentOf?: ConferenceWhereInputArgument | null | undefined;
	mimeType?: StringWhereInputArgument | null | undefined;
	purpose?: StringWhereInputArgument | null | undefined;
	resolutionOf?: ResolutionWhereInputArgument | null | undefined;
	sitePlanOf?: PlaceWhereInputArgument | null | undefined;
	size?: IntWhereInputArgument | null | undefined;
	termsAndConditionsOf?: ConferenceWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	uploadedById?: IDWhereInputArgument | null | undefined;
};

export type StringArrayWhereInputArgument = {
	AND?: StringArrayWhereInputArgument[] | undefined;
	NOT?: StringArrayWhereInputArgument | null | undefined;
	OR?: StringArrayWhereInputArgument[] | undefined;
	arrayContained?: String[] | undefined;
	arrayContains?: String[] | undefined;
	arrayOverlaps?: String[] | undefined;
	eq?: String[] | undefined;
	in?: String[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	ne?: String[] | undefined;
	notIn?: String[] | undefined;
};

export type StringWhereInputArgument = {
	AND?: StringWhereInputArgument[] | undefined;
	NOT?: StringWhereInputArgument | null | undefined;
	OR?: StringWhereInputArgument[] | undefined;
	arrayContained?: String[] | undefined;
	arrayContains?: String[] | undefined;
	arrayOverlaps?: String[] | undefined;
	eq?: String | null | undefined;
	gt?: String | null | undefined;
	gte?: String | null | undefined;
	ilike?: String | null | undefined;
	in?: String[] | undefined;
	isNotNull?: Boolean | null | undefined;
	isNull?: Boolean | null | undefined;
	like?: String | null | undefined;
	lt?: String | null | undefined;
	lte?: String | null | undefined;
	ne?: String | null | undefined;
	notIlike?: String | null | undefined;
	notIn?: String[] | undefined;
	notLike?: String | null | undefined;
};

export type Subscription = {
	assignmentReview: (p: { id: ID }) => Assignmentreview;
	assignmentReviews: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AssignmentreviewOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AssignmentreviewWhereInputArgument | null | undefined;
	}) => Assignmentreview[];
	assignmentReviewsCount: (p?: {
		where?: AssignmentreviewWhereInputArgument | null | undefined;
	}) => Int;
	assignmentSingleRole: (p: { id: ID }) => Assignmentsinglerole;
	assignmentSingleRoles: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AssignmentsingleroleOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AssignmentsingleroleWhereInputArgument | null | undefined;
	}) => Assignmentsinglerole[];
	assignmentUnit: (p: { id: ID }) => Assignmentunit;
	assignmentUnits: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AssignmentunitOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AssignmentunitWhereInputArgument | null | undefined;
	}) => Assignmentunit[];
	assignmentWeight: (p: { id: ID }) => Assignmentweights;
	assignmentWeights: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AssignmentweightsOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AssignmentweightsWhereInputArgument | null | undefined;
	}) => Assignmentweights[];
	attendanceEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AttendanceentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AttendanceentryWhereInputArgument | null | undefined;
	}) => Attendanceentry[];
	attendanceEntry: (p: { id: ID }) => Attendanceentry;
	attendanceSession: (p: { id: ID }) => Attendancesession;
	attendanceSessions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AttendancesessionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AttendancesessionWhereInputArgument | null | undefined;
	}) => Attendancesession[];
	calendarDay: (p: { id: ID }) => Calendarday;
	calendarDays: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendardayOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendardayWhereInputArgument | null | undefined;
	}) => Calendarday[];
	calendarEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendarentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendarentryWhereInputArgument | null | undefined;
	}) => Calendarentry[];
	calendarEntry: (p: { id: ID }) => Calendarentry;
	calendarTrack: (p: { id: ID }) => Calendartrack;
	calendarTracks: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendartrackOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendartrackWhereInputArgument | null | undefined;
	}) => Calendartrack[];
	committee: (p: { id: ID }) => Committee;
	committeeAgendaItem: (p: { id: ID }) => Committeeagendaitem;
	committeeAgendaItems: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CommitteeagendaitemOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CommitteeagendaitemWhereInputArgument | null | undefined;
	}) => Committeeagendaitem[];
	committees: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CommitteeOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CommitteeWhereInputArgument | null | undefined;
	}) => Committee[];
	conference: (p: { id: ID }) => Conference;
	conferenceEmailFooter: (p: { id: ID }) => Conferenceemailfooter;
	conferenceEmailFooters: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceemailfooterOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceemailfooterWhereInputArgument | null | undefined;
	}) => Conferenceemailfooter[];
	conferenceEmailSetting: (p: { id: ID }) => Conferenceemailsetting;
	conferenceEmailSettings: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceemailsettingOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceemailsettingWhereInputArgument | null | undefined;
	}) => Conferenceemailsetting[];
	conferenceEmailText: (p: { id: ID }) => Conferenceemailtext;
	conferenceEmailTexts: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceemailtextOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceemailtextWhereInputArgument | null | undefined;
	}) => Conferenceemailtext[];
	conferenceParticipant: (p: { id: ID }) => Conferenceparticipant;
	conferenceParticipants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant[];
	conferenceRole: (p: { id: ID }) => Conferencerole;
	conferenceRoles: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceroleOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceroleWhereInputArgument | null | undefined;
	}) => Conferencerole[];
	conferenceSupervisor: (p: { id: ID }) => Conferencesupervisor;
	conferenceSupervisors: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferencesupervisorOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferencesupervisorWhereInputArgument | null | undefined;
	}) => Conferencesupervisor[];
	conferences: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference[];
	delegation: (p: { id: ID }) => Delegation;
	delegationMember: (p: { id: ID }) => Delegationmember;
	delegationMembers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationmemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationmemberWhereInputArgument | null | undefined;
	}) => Delegationmember[];
	delegations: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationWhereInputArgument | null | undefined;
	}) => Delegation[];
	delegationsCount: (p?: { where?: DelegationWhereInputArgument | null | undefined }) => Int;
	emailLog: (p: { id: ID }) => Emaillog;
	emailLogs: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: EmaillogOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: EmaillogWhereInputArgument | null | undefined;
	}) => Emaillog[];
	instanceLink: (p: { id: ID }) => Instancelink;
	instanceLinks: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: InstancelinkOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: InstancelinkWhereInputArgument | null | undefined;
	}) => Instancelink[];
	mcpAuditEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: McpauditentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: McpauditentryWhereInputArgument | null | undefined;
	}) => Mcpauditentry[];
	mcpAuditEntry: (p: { id: ID }) => Mcpauditentry;
	nation: (p: { id: ID }) => Nation;
	nations: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: NationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: NationWhereInputArgument | null | undefined;
	}) => Nation[];
	paper: (p: { id: ID }) => Paper;
	papers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaperOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaperWhereInputArgument | null | undefined;
	}) => Paper[];
	papersCount: (p?: { where?: PaperWhereInputArgument | null | undefined }) => Int;
	paymentTransaction: (p: { id: ID }) => Paymenttransaction;
	paymentTransactions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaymenttransactionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaymenttransactionWhereInputArgument | null | undefined;
	}) => Paymenttransaction[];
	place: (p: { id: ID }) => Place;
	places: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PlaceOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PlaceWhereInputArgument | null | undefined;
	}) => Place[];
	possibleDuplicate: (p: { id: ID }) => Possibleduplicate;
	possibleDuplicates: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PossibleduplicateOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PossibleduplicateWhereInputArgument | null | undefined;
	}) => Possibleduplicate[];
	resolution: (p: { id: ID }) => Resolution;
	resolutions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ResolutionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ResolutionWhereInputArgument | null | undefined;
	}) => Resolution[];
	reviewerSnippet: (p: { id: ID }) => Reviewersnippet;
	reviewerSnippets: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ReviewersnippetOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ReviewersnippetWhereInputArgument | null | undefined;
	}) => Reviewersnippet[];
	roleApplication: (p: { id: ID }) => Roleapplication;
	roleApplications: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: RoleapplicationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: RoleapplicationWhereInputArgument | null | undefined;
	}) => Roleapplication[];
	school: (p: { id: ID }) => School;
	schoolSuggestion: (p: { id: ID }) => Schoolsuggestion;
	schoolSuggestions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SchoolsuggestionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SchoolsuggestionWhereInputArgument | null | undefined;
	}) => Schoolsuggestion[];
	schools: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SchoolOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SchoolWhereInputArgument | null | undefined;
	}) => School[];
	searchHistories: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SearchhistoryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SearchhistoryWhereInputArgument | null | undefined;
	}) => Searchhistory[];
	searchHistory: (p: { id: ID }) => Searchhistory;
	singleParticipant: (p: { id: ID }) => Singleparticipant;
	singleParticipants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant[];
	surveyAnswer: (p: { id: ID }) => Surveyanswer;
	surveyAnswers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyanswerOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyanswerWhereInputArgument | null | undefined;
	}) => Surveyanswer[];
	surveyOption: (p: { id: ID }) => Surveyoption;
	surveyOptions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyoptionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyoptionWhereInputArgument | null | undefined;
	}) => Surveyoption[];
	surveyQuestion: (p: { id: ID }) => Surveyquestion;
	surveyQuestions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyquestionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyquestionWhereInputArgument | null | undefined;
	}) => Surveyquestion[];
	tableView: (p: { id: ID }) => Tableview;
	tableViewDefault: (p: { id: ID }) => Tableviewdefault;
	tableViewDefaults: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TableviewdefaultOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TableviewdefaultWhereInputArgument | null | undefined;
	}) => Tableviewdefault[];
	tableViews: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TableviewOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TableviewWhereInputArgument | null | undefined;
	}) => Tableview[];
	teamMember: (p: { id: ID }) => Teammember;
	teamMemberInvitation: (p: { id: ID }) => Teammemberinvitation;
	teamMemberInvitations: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TeammemberinvitationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TeammemberinvitationWhereInputArgument | null | undefined;
	}) => Teammemberinvitation[];
	teamMembers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TeammemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TeammemberWhereInputArgument | null | undefined;
	}) => Teammember[];
	teamMembersCount: (p?: { where?: TeammemberWhereInputArgument | null | undefined }) => Int;
	user: (p: { id: ID }) => User;
	users: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: UserOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User[];
	waitingListEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: WaitinglistentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: WaitinglistentryWhereInputArgument | null | undefined;
	}) => Waitinglistentry[];
	waitingListEntriesCount: (p?: {
		where?: WaitinglistentryWhereInputArgument | null | undefined;
	}) => Int;
	waitingListEntry: (p: { id: ID }) => Waitinglistentry;
};

export type Surveyanswer = {
	conferenceParticipantId: ID;
	createdAt: DateTime;
	id: ID;
	option: (p?: {
		orderBy?: SurveyoptionOrderInputArgument | null | undefined;
		where?: SurveyoptionWhereInputArgument | null | undefined;
	}) => Surveyoption;
	optionId: ID;
	participant: (p?: {
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant;
	question: (p?: {
		orderBy?: SurveyquestionOrderInputArgument | null | undefined;
		where?: SurveyquestionWhereInputArgument | null | undefined;
	}) => Surveyquestion;
	questionId: ID;
	search_distance: Float | null;
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
};

export type SurveyanswerOrderInputArgument = {
	conferenceParticipantId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	optionId?: SortingParameter | null | undefined;
	questionId?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type SurveyanswerWhereInputArgument = {
	AND?: SurveyanswerWhereInputArgument[] | undefined;
	NOT?: SurveyanswerWhereInputArgument | null | undefined;
	OR?: SurveyanswerWhereInputArgument[] | undefined;
	conferenceParticipantId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	option?: SurveyoptionWhereInputArgument | null | undefined;
	optionId?: IDWhereInputArgument | null | undefined;
	participant?: ConferenceparticipantWhereInputArgument | null | undefined;
	question?: SurveyquestionWhereInputArgument | null | undefined;
	questionId?: IDWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
};

export type Surveyoption = {
	attendanceSessions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AttendancesessionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AttendancesessionWhereInputArgument | null | undefined;
	}) => Attendancesession[];
	calendarEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: CalendarentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: CalendarentryWhereInputArgument | null | undefined;
	}) => Calendarentry[];
	countSurveyAnswers: Int;
	createdAt: DateTime;
	description: String;
	id: ID;
	question: (p?: {
		orderBy?: SurveyquestionOrderInputArgument | null | undefined;
		where?: SurveyquestionWhereInputArgument | null | undefined;
	}) => Surveyquestion;
	questionId: ID;
	search_distance: Float | null;
	surveyAnswers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyanswerOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyanswerWhereInputArgument | null | undefined;
	}) => Surveyanswer[];
	title: String;
	updatedAt: DateTime;
	upperLimit: Int;
};

export type SurveyoptionOrderInputArgument = {
	createdAt?: SortingParameter | null | undefined;
	description?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	questionId?: SortingParameter | null | undefined;
	title?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	upperLimit?: SortingParameter | null | undefined;
};

export type SurveyoptionWhereInputArgument = {
	AND?: SurveyoptionWhereInputArgument[] | undefined;
	NOT?: SurveyoptionWhereInputArgument | null | undefined;
	OR?: SurveyoptionWhereInputArgument[] | undefined;
	attendanceSessions?: AttendancesessionWhereInputArgument | null | undefined;
	calendarEntries?: CalendarentryWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	description?: StringWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	question?: SurveyquestionWhereInputArgument | null | undefined;
	questionId?: IDWhereInputArgument | null | undefined;
	surveyAnswers?: SurveyanswerWhereInputArgument | null | undefined;
	title?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	upperLimit?: IntWhereInputArgument | null | undefined;
};

export type Surveyquestion = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	deadline: DateTime;
	description: String;
	draft: Boolean;
	hidden: Boolean;
	id: ID;
	options: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyoptionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyoptionWhereInputArgument | null | undefined;
	}) => Surveyoption[];
	search_distance: Float | null;
	showSelectionOnDashboard: Boolean;
	surveyAnswers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyanswerOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyanswerWhereInputArgument | null | undefined;
	}) => Surveyanswer[];
	title: String;
	updatedAt: DateTime;
};

export type SurveyquestionOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	deadline?: SortingParameter | null | undefined;
	description?: SortingParameter | null | undefined;
	draft?: SortingParameter | null | undefined;
	hidden?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	showSelectionOnDashboard?: SortingParameter | null | undefined;
	title?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type SurveyquestionWhereInputArgument = {
	AND?: SurveyquestionWhereInputArgument[] | undefined;
	NOT?: SurveyquestionWhereInputArgument | null | undefined;
	OR?: SurveyquestionWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	deadline?: DateTimeWhereInputArgument | null | undefined;
	description?: StringWhereInputArgument | null | undefined;
	draft?: BooleanWhereInputArgument | null | undefined;
	hidden?: BooleanWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	options?: SurveyoptionWhereInputArgument | null | undefined;
	showSelectionOnDashboard?: BooleanWhereInputArgument | null | undefined;
	surveyAnswers?: SurveyanswerWhereInputArgument | null | undefined;
	title?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Tableview = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference | null;
	conferenceId: ID | null;
	createdAt: DateTime;
	createdById: ID | null;
	id: ID;
	isDefault: Boolean;
	name: String;
	owner: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User | null;
	ownerUserId: ID | null;
	search_distance: Float | null;
	shared: Boolean;
	state: JSON;
	tableKey: String;
	updatedAt: DateTime;
};

export type TableviewOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	createdById?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	isDefault?: SortingParameter | null | undefined;
	name?: SortingParameter | null | undefined;
	ownerUserId?: SortingParameter | null | undefined;
	shared?: SortingParameter | null | undefined;
	state?: SortingParameter | null | undefined;
	tableKey?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type TableviewWhereInputArgument = {
	AND?: TableviewWhereInputArgument[] | undefined;
	NOT?: TableviewWhereInputArgument | null | undefined;
	OR?: TableviewWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	createdById?: IDWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	isDefault?: BooleanWhereInputArgument | null | undefined;
	name?: StringWhereInputArgument | null | undefined;
	owner?: UserWhereInputArgument | null | undefined;
	ownerUserId?: IDWhereInputArgument | null | undefined;
	shared?: BooleanWhereInputArgument | null | undefined;
	state?: JSONWhereInputArgument | null | undefined;
	tableKey?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type Tableviewdefault = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	id: ID;
	search_distance: Float | null;
	tableKey: String;
	updatedAt: DateTime;
	userId: ID;
	view: (p?: {
		orderBy?: TableviewOrderInputArgument | null | undefined;
		where?: TableviewWhereInputArgument | null | undefined;
	}) => Tableview;
	viewId: ID;
};

export type TableviewdefaultOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	tableKey?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	userId?: SortingParameter | null | undefined;
	viewId?: SortingParameter | null | undefined;
};

export type TableviewdefaultWhereInputArgument = {
	AND?: TableviewdefaultWhereInputArgument[] | undefined;
	NOT?: TableviewdefaultWhereInputArgument | null | undefined;
	OR?: TableviewdefaultWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	tableKey?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	userId?: IDWhereInputArgument | null | undefined;
	view?: TableviewWhereInputArgument | null | undefined;
	viewId?: IDWhereInputArgument | null | undefined;
};

export type TeamInvitationEmailStatus =
	'ALREADY_MEMBER' | 'EXISTS' | 'NEW_USER' | 'PENDING_INVITATION';

export type Teammember = {
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	id: ID;
	role: TeamroleEnum;
	search_distance: Float | null;
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	userId: ID;
};

export type TeammemberOrderInputArgument = {
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	role?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	userId?: SortingParameter | null | undefined;
};

export type TeammemberWhereInputArgument = {
	AND?: TeammemberWhereInputArgument[] | undefined;
	NOT?: TeammemberWhereInputArgument | null | undefined;
	OR?: TeammemberWhereInputArgument[] | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	role?: TeamroleEnum | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
	userId?: IDWhereInputArgument | null | undefined;
};

export type Teammemberinvitation = {
	acceptedBy: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User | null;
	acceptedById: ID | null;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	email: String;
	expiresAt: DateTime;
	id: ID;
	invitedBy: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	invitedById: ID;
	revokedAt: DateTime | null;
	role: TeamroleEnum;
	search_distance: Float | null;
	token: String;
	updatedAt: DateTime;
	usedAt: DateTime | null;
	userExists: Boolean;
};

export type TeammemberinvitationOrderInputArgument = {
	acceptedById?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	email?: SortingParameter | null | undefined;
	expiresAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	invitedById?: SortingParameter | null | undefined;
	revokedAt?: SortingParameter | null | undefined;
	role?: SortingParameter | null | undefined;
	token?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	usedAt?: SortingParameter | null | undefined;
};

export type TeammemberinvitationWhereInputArgument = {
	AND?: TeammemberinvitationWhereInputArgument[] | undefined;
	NOT?: TeammemberinvitationWhereInputArgument | null | undefined;
	OR?: TeammemberinvitationWhereInputArgument[] | undefined;
	acceptedBy?: UserWhereInputArgument | null | undefined;
	acceptedById?: IDWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	email?: StringWhereInputArgument | null | undefined;
	expiresAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	invitedBy?: UserWhereInputArgument | null | undefined;
	invitedById?: IDWhereInputArgument | null | undefined;
	revokedAt?: DateTimeWhereInputArgument | null | undefined;
	role?: TeamroleEnum | null | undefined;
	token?: StringWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	usedAt?: DateTimeWhereInputArgument | null | undefined;
};

export type TeamroleEnum =
	| 'CONTENT_LEAD'
	| 'MEMBER'
	| 'PARTICIPANT_CARE'
	| 'PROJECT_MANAGEMENT'
	| 'REVIEWER'
	| 'TEAM_COORDINATOR';

export type UnlockedPieceData = {
	flagAlpha2Code: String | null;
	flagAlpha3Code: String | null;
	flagId: String;
	flagName: String;
	flagType: FlagTypeForUnlock;
	foundCount: Int;
	icon: String | null;
	isComplete: Boolean;
	pieceName: String;
	totalCount: Int;
};

export type UpdateAllConferenceParticipantsResponse = {
	changed: Int;
};

export type User = {
	apartment: String | null;
	birthday: Date | null;
	city: String | null;
	conferenceParticipants: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant[];
	conferenceParticipationsCount: Int | null;
	conferenceSupervisor: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ConferencesupervisorOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ConferencesupervisorWhereInputArgument | null | undefined;
	}) => Conferencesupervisor[];
	country: String | null;
	createdAt: DateTime;
	delegationMemberships: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: DelegationmemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: DelegationmemberWhereInputArgument | null | undefined;
	}) => Delegationmember[];
	duplicateDecisions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PossibleduplicateOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PossibleduplicateWhereInputArgument | null | undefined;
	}) => Possibleduplicate[];
	duplicatesAsCandidate: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PossibleduplicateOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PossibleduplicateWhereInputArgument | null | undefined;
	}) => Possibleduplicate[];
	duplicatesAsUser: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PossibleduplicateOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PossibleduplicateWhereInputArgument | null | undefined;
	}) => Possibleduplicate[];
	email: String;
	emergencyContacts: String | null;
	familyName: String;
	foodPreference: FoodpreferenceEnum | null;
	gender: GenderEnum | null;
	givenName: String;
	globalNotes: String | null;
	id: ID;
	invitationsAccepted: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TeammemberinvitationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TeammemberinvitationWhereInputArgument | null | undefined;
	}) => Teammemberinvitation[];
	invitationsSent: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TeammemberinvitationOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TeammemberinvitationWhereInputArgument | null | undefined;
	}) => Teammemberinvitation[];
	locale: String;
	ownPaymentTransactions: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaymenttransactionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaymenttransactionWhereInputArgument | null | undefined;
	}) => Paymenttransaction[];
	paperReviews: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaperreviewOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaperreviewWhereInputArgument | null | undefined;
	}) => Paperreview[];
	papers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: PaperOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: PaperWhereInputArgument | null | undefined;
	}) => Paper[];
	paymentTransactionsReferences: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: UserreferenceinpaymenttransactionOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: UserreferenceinpaymenttransactionWhereInputArgument | null | undefined;
	}) => Userreferenceinpaymenttransaction[];
	phone: String | null;
	preferredUsername: String;
	pronouns: String | null;
	recordedAttendanceEntries: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: AttendanceentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: AttendanceentryWhereInputArgument | null | undefined;
	}) => Attendanceentry[];
	region: String | null;
	reviewerSnippets: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: ReviewersnippetOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: ReviewersnippetWhereInputArgument | null | undefined;
	}) => Reviewersnippet[];
	search_distance: Float | null;
	singleParticipant: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SingleparticipantOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SingleparticipantWhereInputArgument | null | undefined;
	}) => Singleparticipant[];
	street: String | null;
	surveyAnswers: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: SurveyanswerOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: SurveyanswerWhereInputArgument | null | undefined;
	}) => Surveyanswer[];
	teamMember: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: TeammemberOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: TeammemberWhereInputArgument | null | undefined;
	}) => Teammember[];
	updatedAt: DateTime;
	waitingListEntry: (p?: {
		limit?: Int | null | undefined;
		offset?: Int | null | undefined;
		orderBy?: WaitinglistentryOrderInputArgument | null | undefined;
		search?: String | null | undefined;
		where?: WaitinglistentryWhereInputArgument | null | undefined;
	}) => Waitinglistentry[];
	wantsJoinTeamInformation: Boolean;
	wantsToReceiveGeneralInformation: Boolean;
	zip: String | null;
};

export type UserOrderInputArgument = {
	apartment?: SortingParameter | null | undefined;
	birthday?: SortingParameter | null | undefined;
	city?: SortingParameter | null | undefined;
	country?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	email?: SortingParameter | null | undefined;
	emergencyContacts?: SortingParameter | null | undefined;
	familyName?: SortingParameter | null | undefined;
	foodPreference?: SortingParameter | null | undefined;
	gender?: SortingParameter | null | undefined;
	givenName?: SortingParameter | null | undefined;
	globalNotes?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	locale?: SortingParameter | null | undefined;
	phone?: SortingParameter | null | undefined;
	preferredUsername?: SortingParameter | null | undefined;
	pronouns?: SortingParameter | null | undefined;
	region?: SortingParameter | null | undefined;
	street?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	wantsJoinTeamInformation?: SortingParameter | null | undefined;
	wantsToReceiveGeneralInformation?: SortingParameter | null | undefined;
	zip?: SortingParameter | null | undefined;
};

export type UserWhereInputArgument = {
	AND?: UserWhereInputArgument[] | undefined;
	NOT?: UserWhereInputArgument | null | undefined;
	OR?: UserWhereInputArgument[] | undefined;
	apartment?: StringWhereInputArgument | null | undefined;
	birthday?: DateWhereInputArgument | null | undefined;
	city?: StringWhereInputArgument | null | undefined;
	conferenceParticipants?: ConferenceparticipantWhereInputArgument | null | undefined;
	conferenceSupervisor?: ConferencesupervisorWhereInputArgument | null | undefined;
	country?: StringWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	delegationMemberships?: DelegationmemberWhereInputArgument | null | undefined;
	duplicateDecisions?: PossibleduplicateWhereInputArgument | null | undefined;
	duplicatesAsCandidate?: PossibleduplicateWhereInputArgument | null | undefined;
	duplicatesAsUser?: PossibleduplicateWhereInputArgument | null | undefined;
	email?: StringWhereInputArgument | null | undefined;
	emergencyContacts?: StringWhereInputArgument | null | undefined;
	familyName?: StringWhereInputArgument | null | undefined;
	foodPreference?: FoodpreferenceEnum | null | undefined;
	gender?: GenderEnum | null | undefined;
	givenName?: StringWhereInputArgument | null | undefined;
	globalNotes?: StringWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	invitationsAccepted?: TeammemberinvitationWhereInputArgument | null | undefined;
	invitationsSent?: TeammemberinvitationWhereInputArgument | null | undefined;
	locale?: StringWhereInputArgument | null | undefined;
	ownPaymentTransactions?: PaymenttransactionWhereInputArgument | null | undefined;
	paperReviews?: PaperreviewWhereInputArgument | null | undefined;
	papers?: PaperWhereInputArgument | null | undefined;
	paymentTransactionsReferences?:
		UserreferenceinpaymenttransactionWhereInputArgument | null | undefined;
	phone?: StringWhereInputArgument | null | undefined;
	preferredUsername?: StringWhereInputArgument | null | undefined;
	pronouns?: StringWhereInputArgument | null | undefined;
	recordedAttendanceEntries?: AttendanceentryWhereInputArgument | null | undefined;
	region?: StringWhereInputArgument | null | undefined;
	reviewerSnippets?: ReviewersnippetWhereInputArgument | null | undefined;
	singleParticipant?: SingleparticipantWhereInputArgument | null | undefined;
	street?: StringWhereInputArgument | null | undefined;
	surveyAnswers?: SurveyanswerWhereInputArgument | null | undefined;
	teamMember?: TeammemberWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	waitingListEntry?: WaitinglistentryWhereInputArgument | null | undefined;
	wantsJoinTeamInformation?: BooleanWhereInputArgument | null | undefined;
	wantsToReceiveGeneralInformation?: BooleanWhereInputArgument | null | undefined;
	zip?: StringWhereInputArgument | null | undefined;
};

export type Userreferenceinpaymenttransaction = {
	conferenceParticipantId: ID;
	createdAt: DateTime;
	id: ID;
	participant: (p?: {
		orderBy?: ConferenceparticipantOrderInputArgument | null | undefined;
		where?: ConferenceparticipantWhereInputArgument | null | undefined;
	}) => Conferenceparticipant;
	paymentTransaction: (p?: {
		orderBy?: PaymenttransactionOrderInputArgument | null | undefined;
		where?: PaymenttransactionWhereInputArgument | null | undefined;
	}) => Paymenttransaction;
	paymentTransactionId: ID;
	search_distance: Float | null;
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
};

export type UserreferenceinpaymenttransactionOrderInputArgument = {
	conferenceParticipantId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	paymentTransactionId?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
};

export type UserreferenceinpaymenttransactionWhereInputArgument = {
	AND?: UserreferenceinpaymenttransactionWhereInputArgument[] | undefined;
	NOT?: UserreferenceinpaymenttransactionWhereInputArgument | null | undefined;
	OR?: UserreferenceinpaymenttransactionWhereInputArgument[] | undefined;
	conferenceParticipantId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	participant?: ConferenceparticipantWhereInputArgument | null | undefined;
	paymentTransaction?: PaymenttransactionWhereInputArgument | null | undefined;
	paymentTransactionId?: IDWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
};

export type Waitinglistentry = {
	assignedAt: DateTime | null;
	conference: (p?: {
		orderBy?: ConferenceOrderInputArgument | null | undefined;
		where?: ConferenceWhereInputArgument | null | undefined;
	}) => Conference;
	conferenceId: ID;
	createdAt: DateTime;
	experience: String;
	hidden: Boolean;
	id: ID;
	motivation: String;
	requests: String | null;
	school: (p?: {
		orderBy?: SchoolOrderInputArgument | null | undefined;
		where?: SchoolWhereInputArgument | null | undefined;
	}) => School | null;
	schoolId: ID | null;
	search_distance: Float | null;
	updatedAt: DateTime;
	user: (p?: {
		orderBy?: UserOrderInputArgument | null | undefined;
		where?: UserWhereInputArgument | null | undefined;
	}) => User;
	userId: ID;
};

export type WaitinglistentryOrderInputArgument = {
	assignedAt?: SortingParameter | null | undefined;
	conferenceId?: SortingParameter | null | undefined;
	createdAt?: SortingParameter | null | undefined;
	experience?: SortingParameter | null | undefined;
	hidden?: SortingParameter | null | undefined;
	id?: SortingParameter | null | undefined;
	motivation?: SortingParameter | null | undefined;
	requests?: SortingParameter | null | undefined;
	schoolId?: SortingParameter | null | undefined;
	updatedAt?: SortingParameter | null | undefined;
	userId?: SortingParameter | null | undefined;
};

export type WaitinglistentryWhereInputArgument = {
	AND?: WaitinglistentryWhereInputArgument[] | undefined;
	NOT?: WaitinglistentryWhereInputArgument | null | undefined;
	OR?: WaitinglistentryWhereInputArgument[] | undefined;
	assignedAt?: DateTimeWhereInputArgument | null | undefined;
	conference?: ConferenceWhereInputArgument | null | undefined;
	conferenceId?: IDWhereInputArgument | null | undefined;
	createdAt?: DateTimeWhereInputArgument | null | undefined;
	experience?: StringWhereInputArgument | null | undefined;
	hidden?: BooleanWhereInputArgument | null | undefined;
	id?: IDWhereInputArgument | null | undefined;
	motivation?: StringWhereInputArgument | null | undefined;
	requests?: StringWhereInputArgument | null | undefined;
	school?: SchoolWhereInputArgument | null | undefined;
	schoolId?: IDWhereInputArgument | null | undefined;
	updatedAt?: DateTimeWhereInputArgument | null | undefined;
	user?: UserWhereInputArgument | null | undefined;
	userId?: IDWhereInputArgument | null | undefined;
};

export const defaultOptions: ConstructorParameters<Client>[0] = {
	url: 'http://delegator.invalid/api/graphql',
	fetchSubscriptions: true,
	exchanges: [cacheExchange({ schema }), nativeDateExchange, fetchExchange],
	fetchOptions: {
		credentials: 'include'
	},
	requestPolicy: 'cache-and-network'
};

const urqlClient = new Client(defaultOptions);

export const client = {
	/**
	 * A query and subscription combination. First queries and if exists, also subscribes to a subscription of the same name.
	 * Combines the results of both, so the result is first the query result and then live updates from the subscription.
	 * Assumes that the query and subscription return the same fields as per default when using the rumble query helpers.
	 * If no subscription with the same name exists, this will just be a query.
	 *
	 * Internally, this does some magic to make the data reactive with Svelte's reactivity system. But it can be used with other frameworks as well.
	 */
	liveQuery: makeLiveQuery<Query, false, 'id'>({
		urqlClient,
		availableSubscriptions: new Set([
			'assignmentReview',
			'assignmentReviews',
			'assignmentReviewsCount',
			'assignmentSingleRole',
			'assignmentSingleRoles',
			'assignmentUnit',
			'assignmentUnits',
			'assignmentWeight',
			'assignmentWeights',
			'attendanceEntries',
			'attendanceEntry',
			'attendanceSession',
			'attendanceSessions',
			'calendarDay',
			'calendarDays',
			'calendarEntries',
			'calendarEntry',
			'calendarTrack',
			'calendarTracks',
			'committee',
			'committeeAgendaItem',
			'committeeAgendaItems',
			'committees',
			'conference',
			'conferenceEmailFooter',
			'conferenceEmailFooters',
			'conferenceEmailSetting',
			'conferenceEmailSettings',
			'conferenceEmailText',
			'conferenceEmailTexts',
			'conferenceParticipant',
			'conferenceParticipants',
			'conferenceRole',
			'conferenceRoles',
			'conferenceSupervisor',
			'conferenceSupervisors',
			'conferences',
			'delegation',
			'delegationMember',
			'delegationMembers',
			'delegations',
			'delegationsCount',
			'emailLog',
			'emailLogs',
			'instanceLink',
			'instanceLinks',
			'mcpAuditEntries',
			'mcpAuditEntry',
			'nation',
			'nations',
			'paper',
			'papers',
			'papersCount',
			'paymentTransaction',
			'paymentTransactions',
			'place',
			'places',
			'possibleDuplicate',
			'possibleDuplicates',
			'resolution',
			'resolutions',
			'reviewerSnippet',
			'reviewerSnippets',
			'roleApplication',
			'roleApplications',
			'school',
			'schoolSuggestion',
			'schoolSuggestions',
			'schools',
			'searchHistories',
			'searchHistory',
			'singleParticipant',
			'singleParticipants',
			'surveyAnswer',
			'surveyAnswers',
			'surveyOption',
			'surveyOptions',
			'surveyQuestion',
			'surveyQuestions',
			'tableView',
			'tableViewDefault',
			'tableViewDefaults',
			'tableViews',
			'teamMember',
			'teamMemberInvitation',
			'teamMemberInvitations',
			'teamMembers',
			'teamMembersCount',
			'user',
			'users',
			'waitingListEntries',
			'waitingListEntriesCount',
			'waitingListEntry'
		]),
		schema,
		autoIncludeIdField: 'id'
	}),
	/**
	 * A mutation that can be used to e.g. create, update or delete data.
	 */
	mutate: makeMutation<Mutation, 'id'>({
		urqlClient,
		schema,
		autoIncludeIdField: 'id'
	}),
	/**
	 * A continuous stream of results that updates when the server sends new data.
	 */
	subscribe: makeSubscription<Subscription, 'id'>({
		urqlClient,
		schema,
		autoIncludeIdField: 'id'
	}),
	/**
	 * A one-time fetch of data.
	 */
	query: makeQuery<Query, false, 'id'>({
		urqlClient,
		schema,
		autoIncludeIdField: 'id'
	})
};

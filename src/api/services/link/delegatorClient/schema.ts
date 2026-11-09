// This file is auto-generated. Do not edit manually.
// @generated
/* eslint-disable */
// biome-ignore-all lint: This file is auto-generated
// biome-ignore-all assist: This file is auto-generated
// biome-ignore-all syntax: This file is auto-generated
import type { IntrospectionQuery } from 'graphql';
export const schema = {
	__schema: {
		queryType: { name: 'Query', kind: 'OBJECT', __proto__: null },
		mutationType: { name: 'Mutation', kind: 'OBJECT', __proto__: null },
		subscriptionType: { name: 'Subscription', kind: 'OBJECT', __proto__: null },
		types: [
			{
				kind: 'OBJECT',
				name: 'Address',
				fields: [
					{
						name: 'countryCode',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'locality',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'postalCode',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'region',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'streetAddress',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{ kind: 'SCALAR', name: 'String' },
			{
				kind: 'INPUT_OBJECT',
				name: 'AddressInput',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'countryCode',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'locality',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'postalCode',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'region',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'streetAddress',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'AdministrativestatusEnum',
				enumValues: [{ name: 'DONE' }, { name: 'PENDING' }, { name: 'PROBLEM' }]
			},
			{
				kind: 'ENUM',
				name: 'AgeIssue',
				enumValues: [
					{ name: 'shouldBeSupervisor' },
					{ name: 'shouldNotBeSupervisor' },
					{ name: 'tooOld' },
					{ name: 'tooYoung' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'AgeNotice',
				fields: [
					{
						name: 'age',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'issue',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'AgeIssue', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'participantMaxAge',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'participantMinAge',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'supervisorMinAge',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{ kind: 'SCALAR', name: 'Int' },
			{
				kind: 'ENUM',
				name: 'AgeRole',
				enumValues: [{ name: 'participant' }, { name: 'supervisor' }]
			},
			{
				kind: 'OBJECT',
				name: 'AgendaItemPaperGroup',
				fields: [
					{
						name: 'agendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committeeagendaitem', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'papers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentSplitPartInput',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'memberIds',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						},
						defaultValue: void 0
					}
				]
			},
			{ kind: 'SCALAR', name: 'ID' },
			{
				kind: 'ENUM',
				name: 'AssignmentexperienceeffectEnum',
				enumValues: [{ name: 'SEATING_ONLY' }, { name: 'WISHES_AND_SEATING' }]
			},
			{
				kind: 'ENUM',
				name: 'AssignmentmarkeffectEnum',
				enumValues: [{ name: 'SEATING_ONLY' }, { name: 'WISHES_AND_SEATING' }]
			},
			{
				kind: 'OBJECT',
				name: 'Assignmentreview',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegation',
						type: { kind: 'OBJECT', name: 'Delegation', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegationId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'disqualified',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'evaluation',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'flagged',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'note',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'prioritizedRole',
						type: { kind: 'OBJECT', name: 'Conferencerole', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'prioritizedRoleId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'required',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'singleParticipant',
						type: { kind: 'OBJECT', name: 'Singleparticipant', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'singleParticipantId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{ kind: 'SCALAR', name: 'Boolean' },
			{ kind: 'SCALAR', name: 'Float' },
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentreviewOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'delegationId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'disqualified',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'evaluation',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'flagged',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'note',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'prioritizedRoleId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'required',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'singleParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentreviewWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AssignmentreviewWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AssignmentreviewWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AssignmentreviewWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegationId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'disqualified',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'evaluation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'flagged',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'note',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'prioritizedRole',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'prioritizedRoleId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'required',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'singleParticipant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SingleparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'singleParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Assignmentsinglerole',
				fields: [
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'role',
						type: { kind: 'OBJECT', name: 'Conferencerole', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'roleId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'singleParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Singleparticipant', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'singleParticipantId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentsingleroleOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'roleId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'singleParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentsingleroleWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AssignmentsingleroleWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AssignmentsingleroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AssignmentsingleroleWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'role',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'roleId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'singleParticipant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SingleparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'singleParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Assignmentunit',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'members',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Assignmentunitmember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentunitmemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentunitmemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'role',
						type: { kind: 'OBJECT', name: 'Conferencerole', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'roleId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sourceDelegation',
						type: { kind: 'OBJECT', name: 'Delegation', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'sourceDelegationId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sourceSingleParticipant',
						type: { kind: 'OBJECT', name: 'Singleparticipant', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'sourceSingleParticipantId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentunitOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'roleId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sourceDelegationId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sourceSingleParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentunitWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AssignmentunitWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AssignmentunitWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AssignmentunitWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'members',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AssignmentunitmemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'role',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'roleId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sourceDelegation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sourceDelegationId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sourceSingleParticipant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SingleparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sourceSingleParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Assignmentunitmember',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationMember',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegationmember', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegationMemberId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'unit',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Assignmentunit', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentunitOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentunitWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'unitId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentunitmemberOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'delegationMemberId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'unitId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentunitmemberWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AssignmentunitmemberWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AssignmentunitmemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AssignmentunitmemberWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegationMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationmemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegationMemberId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'unit',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AssignmentunitWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'unitId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Assignmentweights',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'experienceEffect',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'AssignmentexperienceeffectEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'experienceModifier',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'markBonus',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'markEffect',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'AssignmentmarkeffectEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'nullRating',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'ratingFactor',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentweightsOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'experienceEffect',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'experienceModifier',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'markBonus',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'markEffect',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'nullRating',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ratingFactor',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AssignmentweightsWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AssignmentweightsWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AssignmentweightsWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AssignmentweightsWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'experienceEffect',
						type: {
							kind: 'ENUM',
							name: 'AssignmentexperienceeffectEnum',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'experienceModifier',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'markBonus',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'markEffect',
						type: { kind: 'ENUM', name: 'AssignmentmarkeffectEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'nullRating',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'ratingFactor',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Attendanceentry',
				fields: [
					{
						name: 'checkPassed',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conferenceParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'recordedBy',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'recordedById',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'session',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Attendancesession', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendancesessionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendancesessionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'sessionId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'timestamp',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AttendanceentryOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'checkPassed',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'recordedById',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sessionId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'timestamp',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AttendanceentryWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AttendanceentryWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AttendanceentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AttendanceentryWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'checkPassed',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'recordedBy',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'recordedById',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'session',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AttendancesessionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sessionId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'timestamp',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Attendancesession',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdBy',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'createdById',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'endedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'entries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Attendanceentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendanceentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendanceentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'entryCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'mode',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'AttendancesessionmodeEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'occasion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'showOnCertificate',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'startedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'surveyOptions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyoption', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AttendancesessionOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdById',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'endedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'mode',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'occasion',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'showOnCertificate',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'startedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AttendancesessionWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AttendancesessionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AttendancesessionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'AttendancesessionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdBy',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdById',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'endedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'entries',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AttendanceentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'mode',
						type: {
							kind: 'ENUM',
							name: 'AttendancesessionmodeEnum',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'occasion',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'showOnCertificate',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'startedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'surveyOptions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyoptionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'AttendancesessionmodeEnum',
				enumValues: [{ name: 'CHECK' }, { name: 'RECORD' }]
			},
			{ kind: 'SCALAR', name: 'BigInt' },
			{
				kind: 'INPUT_OBJECT',
				name: 'BigIntWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'BigIntWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BigIntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'BigIntWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: { kind: 'SCALAR', name: 'BigInt', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gt',
						type: { kind: 'SCALAR', name: 'BigInt', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gte',
						type: { kind: 'SCALAR', name: 'BigInt', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'BigInt', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lt',
						type: { kind: 'SCALAR', name: 'BigInt', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lte',
						type: { kind: 'SCALAR', name: 'BigInt', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: { kind: 'SCALAR', name: 'BigInt', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'BigInt', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'BooleanWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'BooleanWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'BooleanWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContained',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContains',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayOverlaps',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					}
				]
			},
			{ kind: 'SCALAR', name: 'Bytes' },
			{
				kind: 'OBJECT',
				name: 'Calendarday',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'date',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Date', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'entries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendarentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'tracks',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CalendardayOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'date',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CalendardayWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'CalendardayWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendardayWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'CalendardayWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'date',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'entries',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendarentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'tracks',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendartrackWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Calendarentry',
				fields: [
					{
						name: 'calendarDay',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendarday', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendardayOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendardayWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarDayId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'color',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'CalendarentrycolorEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'description',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'endTime',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'fontAwesomeIcon',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'place',
						type: { kind: 'OBJECT', name: 'Place', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PlaceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PlaceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'placeId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'room',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'startTime',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'surveyOptions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyoption', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'tracks',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CalendarentryOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'calendarDayId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'color',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'description',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'endTime',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'fontAwesomeIcon',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'placeId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'room',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'startTime',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CalendarentryWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'CalendarentryWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendarentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'CalendarentryWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'calendarDay',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendardayWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'calendarDayId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'color',
						type: { kind: 'ENUM', name: 'CalendarentrycolorEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'description',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'endTime',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'fontAwesomeIcon',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'place',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PlaceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'placeId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'room',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'startTime',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'surveyOptions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyoptionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'tracks',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendartrackWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'CalendarentrycolorEnum',
				enumValues: [
					{ name: 'BREAK' },
					{ name: 'CEREMONY' },
					{ name: 'HIGHLIGHT' },
					{ name: 'INFO' },
					{ name: 'LOGISTICS' },
					{ name: 'SESSION' },
					{ name: 'SOCIAL' },
					{ name: 'WORKSHOP' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Calendartrack',
				fields: [
					{
						name: 'calendarDays',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendarday', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendardayOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendardayWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committees',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conferenceRoles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'description',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'entries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendarentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sortOrder',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CalendartrackOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'description',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sortOrder',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CalendartrackWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'CalendartrackWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendartrackWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'CalendartrackWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'calendarDays',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendardayWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committees',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceRoles',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'description',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'entries',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendarentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sortOrder',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Certificate',
				fields: [
					{
						name: 'code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'fullName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sessions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'ENUM',
				name: 'ChaseaccessEnum',
				enumValues: [{ name: 'NONE' }, { name: 'SPECTATOR' }, { name: 'TEAM' }]
			},
			{
				kind: 'OBJECT',
				name: 'Chasepresence',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'data',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'fetchedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ChasepresenceOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'data',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'fetchedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ChasepresenceWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ChasepresenceWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ChasepresenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ChasepresenceWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'data',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'JSONWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'fetchedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'CollectiveGroup',
				fields: [
					{
						name: 'key',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'members',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'CollectiveGroupMember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'school',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'CollectiveGroupSchool',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'singleParticipantIds',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'size',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'supervisorId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'CollectiveGroupMember',
				fields: [
					{
						name: 'delegationId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationMemberId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'CollectiveGroupSchool',
				fields: [
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isForeignSchool',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'Committee',
				fields: [
					{
						name: 'abbreviation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'agendaItems',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Committeeagendaitem',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeagendaitemOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeagendaitemWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarTracks',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Delegationmember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'numOfSeatsPerDelegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'regionalBaseline',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'RegionalbaselineEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'regionalBaselineTargets',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'resolutionHeadline',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'resolutions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Resolution', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'roles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CommitteeAssignmentInput',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'delegationMemberId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CommitteeOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'abbreviation',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'numOfSeatsPerDelegation',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'regionalBaseline',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'regionalBaselineTargets',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'resolutionHeadline',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'CommitteePaperGroup',
				fields: [
					{
						name: 'agendaItems',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'AgendaItemPaperGroup',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'committee',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CommitteeWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'CommitteeWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'CommitteeWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'abbreviation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'agendaItems',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeagendaitemWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'calendarTracks',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendartrackWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegationMembers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationmemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'numOfSeatsPerDelegation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'regionalBaseline',
						type: { kind: 'ENUM', name: 'RegionalbaselineEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'regionalBaselineTargets',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntArrayWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'resolutionHeadline',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'resolutions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'roles',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Committeeagendaitem',
				fields: [
					{
						name: 'committee',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committeeId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'papers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'reviewHelpStatus',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ReviewhelpstatusEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'teaserText',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'title',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CommitteeagendaitemOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'reviewHelpStatus',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'teaserText',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'title',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CommitteeagendaitemWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'CommitteeagendaitemWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeagendaitemWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'CommitteeagendaitemWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'committee',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'papers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'reviewHelpStatus',
						type: { kind: 'ENUM', name: 'ReviewhelpstatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'teaserText',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'title',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Conference',
				fields: [
					{
						name: 'WaitingListEntry',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Waitinglistentry',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'applicationDeadline',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'assignmentReleased',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'assignmentReleasedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'bankAccountHolder',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'bankName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'bic',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'calendarDays',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendarday', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendardayOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendardayWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarTracks',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'certificateFile',
						type: { kind: 'OBJECT', name: 'Storedfile', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'certificateFileId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'committees',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceSupervisors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferencesupervisor',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'contractFile',
						type: { kind: 'OBJECT', name: 'Storedfile', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'contractFileId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'currency',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'delegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Delegationmember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'documentLayouts',
						type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'emailsPerSecond',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'emblemFile',
						type: { kind: 'OBJECT', name: 'Storedfile', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'emblemFileId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'endConference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'feeAmount',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'guardianConsentFile',
						type: { kind: 'OBJECT', name: 'Storedfile', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'guardianConsentFileId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'iban',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'imageFile',
						type: { kind: 'OBJECT', name: 'Storedfile', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'imageFileId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'info',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'isOpenPaperSubmission',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'language',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'linkToPaperInbox',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'linkToPreparationGuide',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'linkToServicesPage',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'linkToTeamWiki',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'location',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'logoFile',
						type: { kind: 'OBJECT', name: 'Storedfile', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'logoFileId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'longTitle',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'maxCollectiveGroupSize',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'maxGuaranteedSeatsPerForeignSchool',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'mcpEnabled',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'mediaConsentFile',
						type: { kind: 'OBJECT', name: 'Storedfile', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'mediaConsentFileId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'nametagBinCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'nextDocumentNumber',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'papers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'participantMaxAge',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'participantMinAge',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'paymentTransactions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Paymenttransaction',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaymenttransactionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaymenttransactionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'places',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Place', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PlaceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PlaceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'postalApartment',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'postalCity',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'postalCountry',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'postalName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'postalStreet',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'postalZip',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'registrationDeadlineGracePeriodMinutes',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'resolutions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Resolution', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'roles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'schools',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'ConferenceSchools',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'showCalendar',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'showInfoExpanded',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'singleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Singleparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'startConference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'state',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ConferencestateEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'supervisorMinAge',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'surveyQuestions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyquestion', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyquestionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyquestionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'teamMemberInvitations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Teammemberinvitation',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberinvitationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberinvitationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'teamMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Teammember', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'termsAndConditionsFile',
						type: { kind: 'OBJECT', name: 'Storedfile', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'termsAndConditionsFileId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'timezone',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'title',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'totalParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'totalSeats',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'unlockPayments',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'unlockPostals',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'waitingListLength',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'website',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'applicationDeadline',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'assignmentReleased',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'assignmentReleasedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'bankAccountHolder',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'bankName',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'bic',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'certificateFileId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'contractFileId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'currency',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'documentLayouts',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'emailsPerSecond',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'emblemFileId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'endConference',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'feeAmount',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'guardianConsentFileId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'iban',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'imageFileId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'info',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isOpenPaperSubmission',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'language',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'linkToPaperInbox',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'linkToPreparationGuide',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'linkToServicesPage',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'linkToTeamWiki',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'location',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'logoFileId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'longTitle',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'maxCollectiveGroupSize',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'maxGuaranteedSeatsPerForeignSchool',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'mcpEnabled',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'mediaConsentFileId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'nametagBinCount',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'participantMaxAge',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'participantMinAge',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'postalApartment',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'postalCity',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'postalCountry',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'postalName',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'postalStreet',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'postalZip',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'registrationDeadlineGracePeriodMinutes',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'showCalendar',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'showInfoExpanded',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'startConference',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'state',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'supervisorMinAge',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'termsAndConditionsFileId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'timezone',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'title',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'unlockPayments',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'unlockPostals',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'website',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'ConferenceSchools',
				fields: [
					{
						name: 'delegationCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'school',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'schoolId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'singleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'sumParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'WaitingListEntry',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'WaitinglistentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'applicationDeadline',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignmentReleased',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignmentReleasedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'bankAccountHolder',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'bankName',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'bic',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'calendarDays',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendardayWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'calendarTracks',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendartrackWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'certificateFile',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'certificateFileId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committees',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipants',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceSupervisors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencesupervisorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'contractFile',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'contractFileId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'currency',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegationMembers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationmemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegations',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'documentLayouts',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'JSONWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'emailsPerSecond',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'emblemFile',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'emblemFileId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'endConference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'feeAmount',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'guardianConsentFile',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'guardianConsentFileId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'iban',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'imageFile',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'imageFileId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'info',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'isOpenPaperSubmission',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'language',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'linkToPaperInbox',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'linkToPreparationGuide',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'linkToServicesPage',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'linkToTeamWiki',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'location',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'logoFile',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'logoFileId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'longTitle',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'maxCollectiveGroupSize',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'maxGuaranteedSeatsPerForeignSchool',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'mcpEnabled',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'mediaConsentFile',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'mediaConsentFileId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'nametagBinCount',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'papers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'participantMaxAge',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'participantMinAge',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paymentTransactions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaymenttransactionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'places',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PlaceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'postalApartment',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'postalCity',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'postalCountry',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'postalName',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'postalStreet',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'postalZip',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'registrationDeadlineGracePeriodMinutes',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'resolutions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'roles',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'showCalendar',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'showInfoExpanded',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'singleParticipants',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SingleparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'startConference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'state',
						type: { kind: 'ENUM', name: 'ConferencestateEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'supervisorMinAge',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'surveyQuestions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyquestionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'teamMemberInvitations',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'TeammemberinvitationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'teamMembers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'TeammemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'termsAndConditionsFile',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'termsAndConditionsFileId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'timezone',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'title',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'unlockPayments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'unlockPostals',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'website',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Conferenceemailfooter',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'locale',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'text',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceemailfooterOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'locale',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'text',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceemailfooterWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceemailfooterWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceemailfooterWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceemailfooterWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'locale',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'text',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Conferenceemailsetting',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'enabled',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'kind',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceemailsettingOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'enabled',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'kind',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceemailsettingWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceemailsettingWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceemailsettingWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceemailsettingWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'enabled',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'kind',
						type: { kind: 'ENUM', name: 'EmailkindEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Conferenceemailtext',
				fields: [
					{
						name: 'body',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'heading',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'kind',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'locale',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'subject',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceemailtextOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'body',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'heading',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'kind',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'locale',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'subject',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceemailtextWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceemailtextWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceemailtextWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceemailtextWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'body',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'heading',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'kind',
						type: { kind: 'ENUM', name: 'EmailkindEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'locale',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'subject',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Conferenceparticipant',
				fields: [
					{
						name: 'accessCardId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'assignedDocumentNumber',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'attendanceEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Attendanceentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendanceentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendanceentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'checkIssues',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'ScanIssue', kind: 'ENUM', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conferenceSupervisor',
						type: { kind: 'OBJECT', name: 'Conferencesupervisor', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationMember',
						type: { kind: 'OBJECT', name: 'Delegationmember', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'didAttend',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'guardianConsent',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'AdministrativestatusEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'mediaConsent',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'AdministrativestatusEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'mediaConsentStatus',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'MediaconsentstatusEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'nsaCardNumber',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'ofAgeAtConference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paymentStatus',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'AdministrativestatusEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'school',
						type: { kind: 'OBJECT', name: 'School', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'schoolId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'singleParticipant',
						type: { kind: 'OBJECT', name: 'Singleparticipant', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'supervisors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferencesupervisor',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'termsAndConditions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'AdministrativestatusEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'userId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceparticipantOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'accessCardId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'assignedDocumentNumber',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'didAttend',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'guardianConsent',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'mediaConsent',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'mediaConsentStatus',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'nsaCardNumber',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paymentStatus',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'schoolId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'termsAndConditions',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceparticipantWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceparticipantWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceparticipantWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'accessCardId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignedDocumentNumber',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'attendanceEntries',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AttendanceentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceSupervisor',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencesupervisorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegationMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationmemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'didAttend',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'guardianConsent',
						type: { kind: 'ENUM', name: 'AdministrativestatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'mediaConsent',
						type: { kind: 'ENUM', name: 'AdministrativestatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'mediaConsentStatus',
						type: { kind: 'ENUM', name: 'MediaconsentstatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'nsaCardNumber',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paymentStatus',
						type: { kind: 'ENUM', name: 'AdministrativestatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'school',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'schoolId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'singleParticipant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SingleparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'supervisors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencesupervisorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'termsAndConditions',
						type: { kind: 'ENUM', name: 'AdministrativestatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Conferencerole',
				fields: [
					{
						name: 'abbreviation',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'appliedSingleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Singleparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignedDelegations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignedSingleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Singleparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarTracks',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'chaseAccess',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ChaseaccessEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'committees',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'description',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'fontAwesomeIcon',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'kind',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'ConferencerolekindEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'name',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'nation',
						type: { kind: 'OBJECT', name: 'Nation', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'NationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'NationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'nationAlpha3Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'roleApplications',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Roleapplication', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RoleapplicationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RoleapplicationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'seatAmount',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceroleOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'abbreviation',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'chaseAccess',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'description',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'fontAwesomeIcon',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'kind',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'nationAlpha3Code',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'seatAmount',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceroleWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceroleWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferenceroleWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'abbreviation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'appliedSingleParticipants',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SingleparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignedDelegations',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignedSingleParticipants',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SingleparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'calendarTracks',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendartrackWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'chaseAccess',
						type: { kind: 'ENUM', name: 'ChaseaccessEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'committees',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'description',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'fontAwesomeIcon',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'kind',
						type: { kind: 'ENUM', name: 'ConferencerolekindEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'name',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'nation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'NationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'nationAlpha3Code',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'roleApplications',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'RoleapplicationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'seatAmount',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'ConferencerolekindEnum',
				enumValues: [{ name: 'CUSTOM' }, { name: 'NATION' }, { name: 'NON_STATE_ACTOR' }]
			},
			{
				kind: 'ENUM',
				name: 'ConferencestateEnum',
				enumValues: [
					{ name: 'ACTIVE' },
					{ name: 'PARTICIPANT_REGISTRATION' },
					{ name: 'POST' },
					{ name: 'PRE' },
					{ name: 'PREPARATION' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Conferencesupervisor',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'connectionCode',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'participant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'plansOwnAttendenceAtConference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'school',
						type: { kind: 'OBJECT', name: 'School', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'supervised',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'supervisedDelegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Delegationmember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'supervisedSingleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Singleparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferencesupervisorOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'connectionCode',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'plansOwnAttendenceAtConference',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferencesupervisorWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferencesupervisorWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencesupervisorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ConferencesupervisorWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'connectionCode',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'participant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'plansOwnAttendenceAtConference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'school',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'supervised',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'supervisedDelegationMembers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationmemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'supervisedSingleParticipants',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SingleparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CreateInvitationInput',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'email',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'role',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'TeamroleEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'CreateInvitationsResult',
				fields: [
					{
						name: 'created',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'CreatedInvitation',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'errors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'InvitationError', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'CreatePaperReviewResult',
				fields: [
					{
						name: 'pieceUnlocked',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'reviewId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'unlockedPieceData',
						type: { kind: 'OBJECT', name: 'UnlockedPieceData', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'CreatedInvitation',
				fields: [
					{
						name: 'addedDirectly',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'email',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'expiresAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'role',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'TeamroleEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'token',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'DataTableGroup',
				fields: [
					{
						name: 'count',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'value',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'DataTablePage',
				fields: [
					{
						name: 'hasMore',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'ids',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'values',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{ kind: 'SCALAR', name: 'Date' },
			{ kind: 'SCALAR', name: 'DateTime' },
			{
				kind: 'INPUT_OBJECT',
				name: 'DateTimeWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'DateTimeWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'DateTimeWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContained',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContains',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayOverlaps',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gte',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lte',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'DateWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'DateWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'DateWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContained',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Date', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContains',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Date', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayOverlaps',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Date', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gt',
						type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gte',
						type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ilike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Date', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'like',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lt',
						type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lte',
						type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIlike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Date', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'notLike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Delegation',
				fields: [
					{
						name: 'applied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'appliedForRoles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Roleapplication', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RoleapplicationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RoleapplicationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignedRole',
						type: { kind: 'OBJECT', name: 'Conferencerole', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignedRoleId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'assignmentReview',
						type: { kind: 'OBJECT', name: 'Assignmentreview', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentreviewOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentreviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'entryCode',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'experience',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'memberCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'members',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Delegationmember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'motivation',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'papers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'DelegationOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'applied',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'assignedRoleId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'entryCode',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'experience',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'memberCount',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'motivation',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'DelegationPreview',
				fields: [
					{
						name: 'applied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conferenceTitle',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'entryCode',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'headDelegateFullName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'headDelegateSchoolId',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'headDelegateSchoolName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'memberCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'schools',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'DelegationWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'DelegationWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'DelegationWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'applied',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'appliedForRoles',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'RoleapplicationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignedRole',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignedRoleId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignmentReview',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AssignmentreviewWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'entryCode',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'experience',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'memberCount',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'members',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationmemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'motivation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'papers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Delegationmember',
				fields: [
					{
						name: 'assignedCommittee',
						type: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignedCommitteeId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegationId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isHeadDelegate',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'participant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'school',
						type: { kind: 'OBJECT', name: 'School', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'supervisors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferencesupervisor',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'DelegationmemberOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'assignedCommitteeId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'delegationId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isHeadDelegate',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'DelegationmemberWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'DelegationmemberWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationmemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'DelegationmemberWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'assignedCommittee',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignedCommitteeId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegationId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'isHeadDelegate',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'participant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'school',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'supervisors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencesupervisorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{ kind: 'SCALAR', name: 'EmailAddress' },
			{
				kind: 'OBJECT',
				name: 'EmailKindStats',
				fields: [
					{
						name: 'failed',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'kind',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'sent',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'skipped',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'EmailPreview',
				fields: [
					{
						name: 'html',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'subject',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'EmailStatusResult',
				fields: [
					{
						name: 'email',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'status',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'TeamInvitationEmailStatus',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'ENUM',
				name: 'EmailkindEnum',
				enumValues: [
					{ name: 'APPLICATION_DEADLINE_REMINDER' },
					{ name: 'ASSIGNMENT_ACCEPTED' },
					{ name: 'ASSIGNMENT_REJECTED' },
					{ name: 'BADGE_FOUND' },
					{ name: 'CERTIFICATE_AVAILABLE' },
					{ name: 'CHASE_INTRO_REMINDER' },
					{ name: 'OPEN_ISSUES_REMINDER' },
					{ name: 'PAPERWORK_PROBLEM' },
					{ name: 'PAPER_REVIEWED' },
					{ name: 'PAYMENT_RECEIVED' },
					{ name: 'PAYMENT_UNLOCKED' },
					{ name: 'PHONE_READY_REMINDER' },
					{ name: 'POSTAL_RECEIVED' },
					{ name: 'POSTAL_UNLOCKED' },
					{ name: 'SUPERVISOR_ASSIGNMENT_SUMMARY' },
					{ name: 'SUPERVISOR_STUDENT_LINKED' },
					{ name: 'SURVEY_REMINDER' },
					{ name: 'TEAM_INVITATION' },
					{ name: 'TEAM_WELCOME' },
					{ name: 'WAITING_LIST_SEATED' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Emaillog',
				fields: [
					{
						name: 'attempts',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'email',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'error',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'kind',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sentAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sentBy',
						type: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'sentById',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'status',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'EmailstatusEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'subjectKey',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'trigger',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'EmailtriggerEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'userId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'EmaillogOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'attempts',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'email',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'error',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'kind',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sentAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sentById',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'subjectKey',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'trigger',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'EmaillogWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'EmaillogWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'EmaillogWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'EmaillogWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'attempts',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'email',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'error',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'kind',
						type: { kind: 'ENUM', name: 'EmailkindEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sentAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sentBy',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sentById',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'EmailstatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'subjectKey',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'trigger',
						type: { kind: 'ENUM', name: 'EmailtriggerEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'EmailstatusEnum',
				enumValues: [{ name: 'FAILED' }, { name: 'SENDING' }, { name: 'SENT' }, { name: 'SKIPPED' }]
			},
			{
				kind: 'ENUM',
				name: 'EmailtriggerEnum',
				enumValues: [{ name: 'AUTOMATIC' }, { name: 'MANUAL' }]
			},
			{
				kind: 'OBJECT',
				name: 'FlagCollectionData',
				fields: [
					{
						name: 'flags',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'FlagProgress', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'stats',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'FlagCollectionStats', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'FlagCollectionStats',
				fields: [
					{
						name: 'completedFlags',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'foundPieces',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'totalFlags',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'totalPieces',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'unlockedPieces',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'FlagPiece',
				fields: [
					{
						name: 'agendaItemId',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'agendaItemTitle',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'committeeAbbreviation',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'state',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'FlagPieceState', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'ENUM',
				name: 'FlagPieceState',
				enumValues: [{ name: 'FOUND' }, { name: 'LOCKED' }, { name: 'UNLOCKED' }]
			},
			{
				kind: 'OBJECT',
				name: 'FlagProgress',
				fields: [
					{
						name: 'abbreviation',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'alpha2Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'alpha3Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'fontAwesomeIcon',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'foundPieces',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isComplete',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'pieces',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'FlagPiece', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'totalPieces',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'type',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'FlagType', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'unlockedPieces',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{ kind: 'ENUM', name: 'FlagType', enumValues: [{ name: 'NATION' }, { name: 'NSA' }] },
			{
				kind: 'ENUM',
				name: 'FlagTypeForUnlock',
				enumValues: [{ name: 'NATION' }, { name: 'NSA' }]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'FloatWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'FloatWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'FloatWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContained',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContains',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayOverlaps',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gt',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gte',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ilike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'like',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lt',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lte',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIlike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'notLike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'FoodpreferenceEnum',
				enumValues: [{ name: 'OMNIVORE' }, { name: 'VEGAN' }, { name: 'VEGETARIAN' }]
			},
			{
				kind: 'ENUM',
				name: 'GenderEnum',
				enumValues: [
					{ name: 'DIVERSE' },
					{ name: 'FEMALE' },
					{ name: 'MALE' },
					{ name: 'NO_STATEMENT' }
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'IDWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'IDWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'IDWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContained',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContains',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayOverlaps',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gt',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gte',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ilike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'like',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lt',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lte',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIlike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'notLike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'ImpersonationStatus',
				fields: [
					{
						name: 'impersonatedUser',
						type: { kind: 'OBJECT', name: 'ImpersonationUser', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'isImpersonating',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'originalUser',
						type: { kind: 'OBJECT', name: 'ImpersonationUser', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'ImpersonationUser',
				fields: [
					{
						name: 'email',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'family_name',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'given_name',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'preferred_username',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sub',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'Instancelink',
				fields: [
					{
						name: 'confirmationCode',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'inboundTokenHash',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'lastError',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'lastEventAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'lastReconcileAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'linkedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'outboundToken',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'remoteUrl',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'status',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'InstancelinkstatusEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'InstancelinkOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'confirmationCode',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'inboundTokenHash',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lastError',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lastEventAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lastReconcileAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'linkedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'outboundToken',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'remoteUrl',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'InstancelinkWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'InstancelinkWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'InstancelinkWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'InstancelinkWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'confirmationCode',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'inboundTokenHash',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'lastError',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'lastEventAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'lastReconcileAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'linkedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'outboundToken',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'remoteUrl',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'InstancelinkstatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'InstancelinkstatusEnum',
				enumValues: [{ name: 'ACTIVE' }, { name: 'FROZEN' }, { name: 'PENDING' }]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'IntArrayWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'IntArrayWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntArrayWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'IntArrayWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContained',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContains',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayOverlaps',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							}
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'IntWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'IntWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'IntWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContained',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContains',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayOverlaps',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gt',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gte',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ilike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'like',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lt',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lte',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIlike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'notLike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'InvitationError',
				fields: [
					{
						name: 'email',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'error',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{ kind: 'SCALAR', name: 'JSON' },
			{
				kind: 'INPUT_OBJECT',
				name: 'JSONWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'JSONWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'JSONWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'JSONWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContained',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContains',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayOverlaps',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'JWK',
				fields: [
					{
						name: 'alg',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'e',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'kty',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'n',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'use',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'ENUM',
				name: 'LayoutDocument',
				enumValues: [
					{ name: 'certificate' },
					{ name: 'contract' },
					{ name: 'guardianConsent' },
					{ name: 'mediaConsent' }
				]
			},
			{ kind: 'SCALAR', name: 'Locale' },
			{
				kind: 'OBJECT',
				name: 'Mcpauditentry',
				fields: [
					{
						name: 'arguments',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'clientId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'durationMs',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'message',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'outcome',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'McpcalloutcomeEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'tool',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'userId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'McpauditentryOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'arguments',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'clientId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'durationMs',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'message',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'outcome',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'tool',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'McpauditentryWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'McpauditentryWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'McpauditentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'McpauditentryWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arguments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'JSONWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'clientId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'durationMs',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'message',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'outcome',
						type: { kind: 'ENUM', name: 'McpcalloutcomeEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'tool',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'McpcalloutcomeEnum',
				enumValues: [{ name: 'ERROR' }, { name: 'OK' }, { name: 'REFUSED' }]
			},
			{
				kind: 'ENUM',
				name: 'MediaconsentstatusEnum',
				enumValues: [
					{ name: 'ALLOWED_ALL' },
					{ name: 'NOT_ALLOWED' },
					{ name: 'NOT_SET' },
					{ name: 'PARTIALLY_ALLOWED' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Mutation',
				fields: [
					{
						name: 'analyzeSchoolSuggestions',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'applyAssignment',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignAssignmentUnit',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'roleId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'unitId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignCommitteesToDelegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Delegationmember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'assignments',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: {
												name: 'CommitteeAssignmentInput',
												kind: 'INPUT_OBJECT',
												ofType: null,
												__proto__: null
											}
										}
									}
								}
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignDelegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'delegationId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'roleId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'assignSingleParticipantRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'roleId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'singleParticipantId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'autoAssignDelegations',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'size',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'autoAssignSingleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'confirmChaseLink',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'confirmationCode',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'token',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'connectToConferenceSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferencesupervisor',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'connectionCode',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'convertSingleParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'singleParticipantId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'copyTableView',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Tableview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'global',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'isDefault',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'shared',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createAgendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committeeagendaitem', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'teaserText',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'title',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createAppliedDelegationMember',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegationmember', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'assignedCommitteeId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'assignedRoleId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createAppliedSingleParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Singleparticipant', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'roleId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createAttendanceEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Attendanceentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'sessionId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createCalendarDay',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendarday', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'date',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Date', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createCalendarEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendarentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'calendarDayId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'calendarTrackIds',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
										}
									}
								}
							},
							{
								name: 'color',
								type: {
									kind: 'ENUM',
									name: 'CalendarentrycolorEnum',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'description',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'endTime',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'fontAwesomeIcon',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'placeId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'room',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'startTime',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'surveyOptionIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							}
						]
					},
					{
						name: 'createCalendarTrack',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'calendarDayIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							},
							{
								name: 'committeeIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'conferenceRoleIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							},
							{
								name: 'description',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'sortOrder',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'abbreviation',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'numOfSeatsPerDelegation',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createConferenceSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferencesupervisor',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'plansOwnAttendenceAtConference',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'schoolId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'schoolName',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'userId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'createCustomRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'description',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'fontAwesomeIcon',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'seatAmount',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createDelegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'experience',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'motivation',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'schoolId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'schoolName',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'createDelegationMember',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegationmember', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'entryCode',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'schoolId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'schoolName',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'createNonStateActor',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'abbreviation',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'description',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'fontAwesomeIcon',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'seatAmount',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createPaper',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'agendaItemId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'content',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'delegationId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'status',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'PaperstatusEnum', kind: 'ENUM', ofType: null, __proto__: null }
								}
							},
							{
								name: 'type',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'PapertypeEnum', kind: 'ENUM', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createPaperReview',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'CreatePaperReviewResult',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'comments',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'newStatus',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'PaperstatusEnum', kind: 'ENUM', ofType: null, __proto__: null }
								}
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createPaymentTransaction',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paymenttransaction', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'paymentFor',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
										}
									}
								}
							},
							{
								name: 'userId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createPlace',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Place', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'address',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'directions',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'info',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'latitude',
								type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
							},
							{
								name: 'longitude',
								type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'sitePlanFileId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'websiteUrl',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'createResolution',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Resolution', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'fileId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'title',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'createReviewerSnippet',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Reviewersnippet', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'content',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createRoleApplication',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Roleapplication', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'delegationId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'roleId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createSingleParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Singleparticipant', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'experience',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'motivation',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'roleId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'schoolId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'schoolName',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'createSurveyOption',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyoption', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'description',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'questionId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'title',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'upperLimit',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createSurveyQuestion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyquestion', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'deadline',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'description',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'draft',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'hidden',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'showSelectionOnDashboard',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'title',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createTableView',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Tableview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'global',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'isDefault',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'shared',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'state',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'tableKey',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createTeamMemberInvitations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'CreateInvitationsResult',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'invitations',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: {
												name: 'CreateInvitationInput',
												kind: 'INPUT_OBJECT',
												ofType: null,
												__proto__: null
											}
										}
									}
								}
							}
						]
					},
					{
						name: 'createWaitingListEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Waitinglistentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'experience',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'motivation',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'requests',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'schoolId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'schoolName',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'decidePossibleDuplicate',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Possibleduplicate', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'status',
								type: {
									kind: 'NON_NULL',
									ofType: {
										name: 'PossibleduplicatestatusEnum',
										kind: 'ENUM',
										ofType: null,
										__proto__: null
									}
								}
							}
						]
					},
					{
						name: 'deleteAgendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteAttendanceEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteCalendarDay',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteCalendarEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteCalendarTrack',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteCustomRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteDelegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteDelegationMember',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteNonStateActor',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deletePaper',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deletePlace',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteResolution',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteReviewerSnippet',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteRoleApplication',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteSchool',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteSingleParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteSurveyAnswer',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'questionId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'deleteSurveyOption',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteSurveyQuestion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteTableView',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteTeamMember',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteWaitingListEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'discardAssignmentDraft',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'disconnectFromConferenceSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'supervisorId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'dismissSchoolSuggestion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'distributeUnansweredSurvey',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'questionId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'endAttendanceSession',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'issueDocumentCode',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'SignedCode', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'issueNametagCode',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'SignedCode', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'issueNsaCards',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'NsaCard', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'conferenceParticipantIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							}
						]
					},
					{
						name: 'mergeSchools',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'School', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'sourceIds',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
										}
									}
								}
							},
							{
								name: 'targetId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'notifyBadgeFound',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'SendPersonEmailResult',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'recordSearch',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'label',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'originId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'resultId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'regenerateTeamMemberInvitation',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'RegeneratedInvitation',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'invitationId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'sendEmail',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'renameAttendanceSession',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'occasion',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'reopenAttendanceSession',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'reprintNsaCard',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'NsaCard', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceParticipantId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'requestChaseLink',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'chaseUrl',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'requestFileUpload',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Storedfile', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'field',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'fileName',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'kind',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'mimeType',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'size',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'resetAssignmentSize',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'seats',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'revertSingleParticipantConversion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'singleParticipantId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'revokeTeamMemberInvitation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'invitationId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'rotateSupervisorConnectionCode',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferencesupervisor',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'scanPossibleDuplicates',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'seedNewConference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'data',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'sendOpenEmails',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'kinds',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
										}
									}
								}
							}
						]
					},
					{
						name: 'sendPersonEmail',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'SendPersonEmailResult',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'kind',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
								}
							},
							{
								name: 'subjectKey',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'setAgendaItemReviewHelpStatus',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committeeagendaitem', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'agendaItemId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'status',
								type: {
									kind: 'NON_NULL',
									ofType: {
										name: 'ReviewhelpstatusEnum',
										kind: 'ENUM',
										ofType: null,
										__proto__: null
									}
								}
							}
						]
					},
					{
						name: 'setAssignmentReleased',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'released',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'setAttendanceSessionOnCertificate',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'show',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'setCalendarTrackOnDay',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'calendarDayId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'runs',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'setCommitteeNationSeat',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'enabled',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'nationAlpha3Code',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'setCommitteeRegionalBaseline',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'baseline',
								type: {
									kind: 'NON_NULL',
									ofType: {
										name: 'RegionalbaselineEnum',
										kind: 'ENUM',
										ofType: null,
										__proto__: null
									}
								}
							},
							{
								name: 'committeeId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'targets',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							}
						]
					},
					{
						name: 'setConferenceEmailEnabled',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'enabled',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'kind',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
								}
							},
							{
								name: 'notifyExisting',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'setConferenceEmailFooter',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'locale',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'text',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'setConferenceEmailsPerSecond',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'emailsPerSecond',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'setConferenceMcpEnabled',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'enabled',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'setDocumentLayout',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'document',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'LayoutDocument', kind: 'ENUM', ofType: null, __proto__: null }
								}
							},
							{
								name: 'layout',
								type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'setMyTableViewDefault',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'tableKey',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'viewId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'setParticipantSchool',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{ name: 'id', type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null } },
							{
								name: 'schoolId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'schoolName',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'setTableViewDefault',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Tableview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'isDefault',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'skipOpenEmails',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'kinds',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
										}
									}
								}
							}
						]
					},
					{
						name: 'splitDelegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'delegationId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'parts',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: {
												name: 'AssignmentSplitPartInput',
												kind: 'INPUT_OBJECT',
												ofType: null,
												__proto__: null
											}
										}
									}
								}
							}
						]
					},
					{
						name: 'startAttendanceSession',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Attendancesession', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'mode',
								type: {
									kind: 'NON_NULL',
									ofType: {
										name: 'AttendancesessionmodeEnum',
										kind: 'ENUM',
										ofType: null,
										__proto__: null
									}
								}
							},
							{
								name: 'occasion',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'surveyOptionIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							}
						]
					},
					{
						name: 'startImpersonation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'targetUserId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'stopImpersonation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'swapRoleApplicationRanks',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Roleapplication', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'firstRoleApplicationId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'secondRoleApplicationId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'switchDelegationMemberSeats',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Delegationmember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'headDelegateMemberIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							},
							{
								name: 'memberId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'otherMemberId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'targetCommitteeId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'targetRoleId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'undoDelegationSplit',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'delegationId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'unlinkChase',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'unregisterParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'updateAgendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committeeagendaitem', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'teaserText',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'title',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateAllConferenceParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'UpdateAllConferenceParticipantsResponse',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'didAttend',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateCalendarDay',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendarday', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'date',
								type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateCalendarEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendarentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'calendarDayId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'calendarTrackIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							},
							{
								name: 'color',
								type: {
									kind: 'ENUM',
									name: 'CalendarentrycolorEnum',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'description',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'endTime',
								type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
							},
							{
								name: 'fontAwesomeIcon',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'placeId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'room',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'startTime',
								type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
							},
							{
								name: 'surveyOptionIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							}
						]
					},
					{
						name: 'updateCalendarTrack',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							},
							{
								name: 'conferenceRoleIds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							},
							{
								name: 'description',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'sortOrder',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'abbreviation',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'numOfSeatsPerDelegation',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'resolutionHeadline',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateConference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'applicationDeadline',
								type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
							},
							{
								name: 'bankAccountHolder',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'bankName',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'bic',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'certificateFileId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'contractFileId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'currency',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'emblemFileId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'endConference',
								type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
							},
							{
								name: 'feeAmount',
								type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
							},
							{
								name: 'guardianConsentFileId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'iban',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'imageFileId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'info',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'isOpenPaperSubmission',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'language',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'linkToPaperInbox',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'linkToPreparationGuide',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'linkToServicesPage',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'linkToTeamWiki',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'location',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'logoFileId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'longTitle',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'maxCollectiveGroupSize',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'maxGuaranteedSeatsPerForeignSchool',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'mediaConsentFileId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'nametagBinCount',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'participantMaxAge',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'participantMinAge',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'postalApartment',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'postalCity',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'postalCountry',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'postalName',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'postalStreet',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'postalZip',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'registrationDeadlineGracePeriodMinutes',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'showCalendar',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'showInfoExpanded',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'startConference',
								type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
							},
							{
								name: 'state',
								type: { kind: 'ENUM', name: 'ConferencestateEnum', ofType: null, __proto__: null }
							},
							{
								name: 'supervisorMinAge',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'termsAndConditionsFileId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'timezone',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'title',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'unlockPayments',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'unlockPostals',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'website',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateConferenceSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferencesupervisor',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'plansOwnAttendenceAtConference',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'updateCustomRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'chaseAccess',
								type: { kind: 'ENUM', name: 'ChaseaccessEnum', ofType: null, __proto__: null }
							},
							{
								name: 'description',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'fontAwesomeIcon',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'seatAmount',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateDelegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'applied',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'experience',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'motivation',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'newHeadDelegateUserId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'resetEntryCode',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateDelegationMemberCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegationmember', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'assignedCommitteeId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'updateNonStateActor',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'abbreviation',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'description',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'fontAwesomeIcon',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'seatAmount',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updatePaper',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'content',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'status',
								type: { kind: 'ENUM', name: 'PaperstatusEnum', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updatePaymentTransaction',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paymenttransaction', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'assignedStatus',
								type: {
									kind: 'NON_NULL',
									ofType: {
										name: 'AdministrativestatusEnum',
										kind: 'ENUM',
										ofType: null,
										__proto__: null
									}
								}
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'recievedAt',
								type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updatePlace',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Place', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'address',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'directions',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'info',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'latitude',
								type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
							},
							{
								name: 'longitude',
								type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'sitePlanFileId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'websiteUrl',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateResolution',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Resolution', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'title',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateReviewerSnippet',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Reviewersnippet', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'content',
								type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateSchool',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'School', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'apartment',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'city',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'contactEmail',
								type: { kind: 'SCALAR', name: 'EmailAddress', ofType: null, __proto__: null }
							},
							{
								name: 'contactName',
								type: { kind: 'SCALAR', name: 'PersonName', ofType: null, __proto__: null }
							},
							{
								name: 'contactPhone',
								type: { kind: 'SCALAR', name: 'PhoneNumber', ofType: null, __proto__: null }
							},
							{
								name: 'country',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'isForeignSchool',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'notes',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'region',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'street',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'website',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'zip',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateSingleParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Singleparticipant', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'applied',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'applyForRolesIdList',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							},
							{
								name: 'experience',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'motivation',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'unApplyForRolesIdList',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							}
						]
					},
					{
						name: 'updateSurveyOption',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyoption', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'description',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'title',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'upperLimit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateSurveyQuestion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyquestion', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'deadline',
								type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
							},
							{
								name: 'description',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'draft',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'hidden',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'showSelectionOnDashboard',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'title',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateTableView',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Tableview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'state',
								type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateTeamMemberRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Teammember', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'role',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'TeamroleEnum', kind: 'ENUM', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'updateUser',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'address',
								type: { kind: 'INPUT_OBJECT', name: 'AddressInput', ofType: null, __proto__: null }
							},
							{
								name: 'apartment',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'birthday',
								type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null }
							},
							{
								name: 'emergencyContacts',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'familyName',
								type: { kind: 'SCALAR', name: 'PersonName', ofType: null, __proto__: null }
							},
							{
								name: 'foodPreference',
								type: { kind: 'ENUM', name: 'FoodpreferenceEnum', ofType: null, __proto__: null }
							},
							{
								name: 'gender',
								type: { kind: 'ENUM', name: 'GenderEnum', ofType: null, __proto__: null }
							},
							{
								name: 'givenName',
								type: { kind: 'SCALAR', name: 'PersonName', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'phone',
								type: { kind: 'SCALAR', name: 'PhoneNumber', ofType: null, __proto__: null }
							},
							{
								name: 'pronouns',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'wantsJoinTeamInformation',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'wantsToReceiveGeneralInformation',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateUsersGlobalNotes',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'globalNotes',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'updateUsersIdentityInfo',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'birthday',
								type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null }
							},
							{
								name: 'familyName',
								type: { kind: 'SCALAR', name: 'PersonName', ofType: null, __proto__: null }
							},
							{
								name: 'givenName',
								type: { kind: 'SCALAR', name: 'PersonName', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'updateUsersNewsletterPreferences',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'email',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'EmailAddress', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'wantsJoinTeamInformation',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'wantsToReceiveGeneralInformation',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateWaitingListEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Waitinglistentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'experience',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'hidden',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'motivation',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'requests',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'schoolId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'schoolName',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'upsertAssignmentReview',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Assignmentreview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'delegationId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'disqualified',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'evaluation',
								type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
							},
							{
								name: 'flagged',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'note',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'prioritizedRoleId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'required',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'singleParticipantId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'upsertAssignmentWeights',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Assignmentweights', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'experienceEffect',
								type: {
									kind: 'ENUM',
									name: 'AssignmentexperienceeffectEnum',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'experienceModifier',
								type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
							},
							{
								name: 'markBonus',
								type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
							},
							{
								name: 'markEffect',
								type: {
									kind: 'ENUM',
									name: 'AssignmentmarkeffectEnum',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'nullRating',
								type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
							},
							{
								name: 'ratingFactor',
								type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'upsertConferenceEmailText',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'body',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'heading',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'kind',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
								}
							},
							{
								name: 'locale',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'subject',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'upsertConferenceParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'accessCardId',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'assignNextDocumentNumber',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'assignedDocumentNumber',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'didAttend',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'guardianConsent',
								type: {
									kind: 'ENUM',
									name: 'AdministrativestatusEnum',
									ofType: null,
									__proto__: null
								}
							},
							{ name: 'id', type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null } },
							{
								name: 'mediaConsent',
								type: {
									kind: 'ENUM',
									name: 'AdministrativestatusEnum',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'mediaConsentStatus',
								type: {
									kind: 'ENUM',
									name: 'MediaconsentstatusEnum',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'paymentStatus',
								type: {
									kind: 'ENUM',
									name: 'AdministrativestatusEnum',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'termsAndConditions',
								type: {
									kind: 'ENUM',
									name: 'AdministrativestatusEnum',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'userEmail',
								type: { kind: 'SCALAR', name: 'EmailAddress', ofType: null, __proto__: null }
							},
							{
								name: 'userId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'upsertSurveyAnswer',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyanswer', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'optionId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'MyReviewStats',
				fields: [
					{
						name: 'firstReviews',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'followUpReviews',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'totalReviews',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'NametagBin',
				fields: [
					{
						name: 'fromLetter',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'index',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'letters',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'nationParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'otherParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'participants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'toLetter',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'NametagBinGroup',
				fields: [
					{
						name: 'fontAwesomeIcon',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'nationAlpha2Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'nationAlpha3Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'participants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'roleName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sortName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'Nation',
				fields: [
					{
						name: 'alpha2Code',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'alpha3Code',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conferenceRoles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'NationOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'alpha2Code',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'alpha3Code',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'NationWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'NationWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'NationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'NationWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'alpha2Code',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'alpha3Code',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceRoles',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'NsaCard',
				fields: [
					{
						name: 'cardNumber',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'code',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'familyName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'givenName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'nsaIcon',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'nsaName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'ENUM',
				name: 'OIDCRolesEnum',
				enumValues: [{ name: 'admin' }, { name: 'member' }, { name: 'service_user' }]
			},
			{
				kind: 'OBJECT',
				name: 'OfflineUser',
				fields: [
					{
						name: 'email',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'family_name',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'given_name',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'hasPassword',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'locale',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'mfaVerificationFactors',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						args: []
					},
					{
						name: 'phone',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'preferred_username',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'socialIdentities',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						args: []
					},
					{
						name: 'ssoIdentities',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'OfflineUserSsoIdentity',
									kind: 'OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						args: []
					},
					{
						name: 'sub',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'OfflineUserRefresh',
				fields: [
					{
						name: 'user',
						type: { kind: 'OBJECT', name: 'OfflineUser', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'OfflineUserSsoIdentity',
				fields: [
					{
						name: 'identityId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'issuer',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'OpenEmailCount',
				fields: [
					{
						name: 'kind',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'open',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'OwnNametagTable',
				fields: [
					{
						name: 'fromLetter',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'index',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'others',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'toLetter',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'Paper',
				fields: [
					{
						name: 'agendaItem',
						type: { kind: 'OBJECT', name: 'Committeeagendaitem', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeagendaitemOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeagendaitemWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'agendaItemId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'author',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'authorParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'authorParticipantId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegationId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'firstSubmittedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'status',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'PaperstatusEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'type',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'PapertypeEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'versions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paperversion', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperversionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperversionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PaperOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'agendaItemId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'authorParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'delegationId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'firstSubmittedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'type',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PaperWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PaperWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PaperWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'agendaItem',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeagendaitemWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'agendaItemId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'author',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'authorParticipant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'authorParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegationId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'firstSubmittedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'PaperstatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'type',
						type: { kind: 'ENUM', name: 'PapertypeEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'versions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperversionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Paperreview',
				fields: [
					{
						name: 'comments',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paperVersion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paperversion', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperversionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperversionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperVersionId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'reviewer',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'reviewerId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'statusAfter',
						type: { kind: 'ENUM', name: 'PaperstatusEnum', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'statusBefore',
						type: { kind: 'ENUM', name: 'PaperstatusEnum', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PaperreviewOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'comments',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paperVersionId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'reviewerId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'statusAfter',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'statusBefore',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PaperreviewWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PaperreviewWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperreviewWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PaperreviewWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'comments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'JSONWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperVersion',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperversionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperVersionId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'reviewer',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'reviewerId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'statusAfter',
						type: { kind: 'ENUM', name: 'PaperstatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'statusBefore',
						type: { kind: 'ENUM', name: 'PaperstatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'PaperstatusEnum',
				enumValues: [
					{ name: 'ACCEPTED' },
					{ name: 'CHANGES_REQUESTED' },
					{ name: 'DRAFT' },
					{ name: 'REVISED' },
					{ name: 'SUBMITTED' }
				]
			},
			{
				kind: 'ENUM',
				name: 'PapertypeEnum',
				enumValues: [
					{ name: 'INTRODUCTION_PAPER' },
					{ name: 'POSITION_PAPER' },
					{ name: 'WORKING_PAPER' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Paperversion',
				fields: [
					{
						name: 'content',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'contentHash',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'reviews',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paperreview', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperreviewOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperreviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'status',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'PaperstatusEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'version',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PaperversionOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'content',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'version',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PaperversionWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PaperversionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperversionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PaperversionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'content',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'JSONWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'reviews',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperreviewWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'PaperstatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'version',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Paymenttransaction',
				fields: [
					{
						name: 'amount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'payer',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'payerParticipantId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paymentFor',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Userreferenceinpaymenttransaction',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserreferenceinpaymenttransactionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserreferenceinpaymenttransactionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'recievedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PaymenttransactionOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'amount',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'payerParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'recievedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PaymenttransactionWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PaymenttransactionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaymenttransactionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PaymenttransactionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'amount',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'payer',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'payerParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paymentFor',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserreferenceinpaymenttransactionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'recievedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'PersonEmail',
				fields: [
					{
						name: 'automatic',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'detail',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'kind',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'lastAt',
						type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'lastStatus',
						type: { kind: 'ENUM', name: 'EmailstatusEnum', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'subjectKey',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{ kind: 'SCALAR', name: 'PersonName' },
			{ kind: 'SCALAR', name: 'PhoneNumber' },
			{
				kind: 'OBJECT',
				name: 'Place',
				fields: [
					{
						name: 'address',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'calendarEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendarentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'directions',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'info',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'latitude',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'longitude',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sitePlanFile',
						type: { kind: 'OBJECT', name: 'Storedfile', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'sitePlanFileId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'websiteUrl',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PlaceOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'address',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'directions',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'info',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'latitude',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'longitude',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sitePlanFileId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'websiteUrl',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PlaceWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PlaceWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PlaceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PlaceWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'address',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'calendarEntries',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendarentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'directions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'info',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'latitude',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'longitude',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sitePlanFile',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sitePlanFileId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'websiteUrl',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'PlausibilityResult',
				fields: [
					{
						name: 'dataMissing',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'shouldBeSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'shouldNotBeSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'tooOldUsers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'tooYoungUsers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'PossibleDuplicateAttendance',
				fields: [
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'role',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'startConference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'title',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'Possibleduplicate',
				fields: [
					{
						name: 'candidate',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'candidateAttendances',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'PossibleDuplicateAttendance',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'candidateId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'decidedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'decidedBy',
						type: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'decidedById',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'inferred',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'reasons',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'score',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'status',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'PossibleduplicatestatusEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'userAttendances',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'PossibleDuplicateAttendance',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'userId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PossibleduplicateOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'candidateId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'decidedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'decidedById',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'inferred',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'reasons',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'score',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PossibleduplicateWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PossibleduplicateWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PossibleduplicateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'PossibleduplicateWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'candidate',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'candidateId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'decidedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'decidedBy',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'decidedById',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'inferred',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'reasons',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringArrayWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'score',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'status',
						type: {
							kind: 'ENUM',
							name: 'PossibleduplicatestatusEnum',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'PossibleduplicatestatusEnum',
				enumValues: [{ name: 'CONFIRMED' }, { name: 'DISMISSED' }, { name: 'OPEN' }]
			},
			{
				kind: 'OBJECT',
				name: 'PreviewConferenceSupervisor',
				fields: [
					{
						name: 'different_school',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'family_name',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'given_name',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'school_city',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'school_name',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'Query',
				fields: [
					{
						name: 'assignmentReview',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Assignmentreview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignmentReviews',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Assignmentreview',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentreviewOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentreviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignmentReviewsCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentreviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignmentSingleRole',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Assignmentsinglerole',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignmentSingleRoles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Assignmentsinglerole',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentsingleroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentsingleroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignmentUnit',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Assignmentunit', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignmentUnits',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Assignmentunit', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentunitOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentunitWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignmentWeight',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Assignmentweights', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignmentWeights',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Assignmentweights',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentweightsOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentweightsWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'attendanceEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Attendanceentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendanceentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendanceentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'attendanceEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Attendanceentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'attendanceSession',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Attendancesession', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'attendanceSessions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Attendancesession',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendancesessionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendancesessionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarDay',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendarday', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'calendarDays',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendarday', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendardayOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendardayWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendarentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendarentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'calendarTrack',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'calendarTracks',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'canImpersonateUser',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'targetUserId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'chasePresence',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Chasepresence', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'chasePresences',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Chasepresence', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ChasepresenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ChasepresenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'checkTeamInvitationEmails',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'EmailStatusResult',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'emails',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
										}
									}
								}
							}
						]
					},
					{
						name: 'collectiveGroups',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'CollectiveGroup', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'committee',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'committeeAgendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committeeagendaitem', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'committeeAgendaItems',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Committeeagendaitem',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeagendaitemOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeagendaitemWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committees',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceEmailFooter',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceemailfooter',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceEmailFooters',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceemailfooter',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailfooterOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailfooterWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceEmailSetting',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceemailsetting',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceEmailSettings',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceemailsetting',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailsettingOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailsettingWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceEmailText',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conferenceemailtext', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceEmailTexts',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceemailtext',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailtextOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailtextWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferencePlausibility',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'PlausibilityResult', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceRoles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferencesupervisor',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceSupervisors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferencesupervisor',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferences',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'dataTableGroups',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'DataTableGroup', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'query',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'revision',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'table',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'dataTablePage',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DataTablePage', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'limit',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'offset',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'query',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'revision',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'table',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'delegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'delegationMember',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegationmember', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'delegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Delegationmember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegationsCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'emailLog',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Emaillog', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'emailLogs',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Emaillog', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'EmaillogOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'EmaillogWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'emailPreview',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'EmailPreview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'body',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'draft',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'footer',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'heading',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'kind',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
								}
							},
							{
								name: 'locale',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'subject',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'emailStats',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'EmailKindStats', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'revision',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'findIntroductionPapers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'findNextPaperToReview',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'agendaItemId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'findPapersGroupedByCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'CommitteePaperGroup',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'findSupervisedPapers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'flagCollection',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'FlagCollectionData', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'getAllConferenceNations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Nation', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'getCertificate',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Certificate', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'userId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'getCertificateJWTPublicKeyObject',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'JWK', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'getConferenceStatistics',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'StatisticsResult', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'filter',
								type: { kind: 'ENUM', name: 'StatsFilter', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'impersonationStatus',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ImpersonationStatus', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'instanceLink',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Instancelink', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'instanceLinks',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Instancelink', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'InstancelinkOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'InstancelinkWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'logoutUrl',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'mcpAuditEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Mcpauditentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'McpauditentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'McpauditentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'mcpAuditEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Mcpauditentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'mcpServerUrl',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'myAgeNotice',
						type: { kind: 'OBJECT', name: 'AgeNotice', ofType: null, __proto__: null },
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'role',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'AgeRole', kind: 'ENUM', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'myOIDCRoles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'OIDCRolesEnum', kind: 'ENUM', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'myReviewStats',
						type: { kind: 'OBJECT', name: 'MyReviewStats', ofType: null, __proto__: null },
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'myReviewerSnippets',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Reviewersnippet', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'nametagBinGroups',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'NametagBinGroup', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'binCount',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'index',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'nametagBins',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'NametagBin', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'binCount',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'nation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Nation', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'nations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Nation', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'NationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'NationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'offlineUserRefresh',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'OfflineUserRefresh', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'openEmailCounts',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'OpenEmailCount', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'kinds',
								type: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'EmailkindEnum', kind: 'ENUM', ofType: null, __proto__: null }
									}
								}
							},
							{
								name: 'revision',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'ownNametagTable',
						type: { kind: 'OBJECT', name: 'OwnNametagTable', ofType: null, __proto__: null },
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'papers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'papersCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paymentTransaction',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paymenttransaction', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paymentTransactions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Paymenttransaction',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaymenttransactionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaymenttransactionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'personEmails',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'PersonEmail', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'revision',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'userId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'place',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Place', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'places',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Place', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PlaceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PlaceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'possibleDuplicate',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Possibleduplicate', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'possibleDuplicates',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Possibleduplicate',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PossibleduplicateOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PossibleduplicateWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'previewConferenceSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'PreviewConferenceSupervisor',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'connectionCode',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'previewDelegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DelegationPreview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'entryCode',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'resolution',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Resolution', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'resolutions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Resolution', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'reviewerLeaderboard',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'ReviewerStat', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'reviewerSnippet',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Reviewersnippet', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'reviewerSnippets',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Reviewersnippet', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ReviewersnippetOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ReviewersnippetWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'roleApplication',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Roleapplication', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'roleApplications',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Roleapplication', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RoleapplicationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RoleapplicationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'scanLookup',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ScanLookupResult', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'asScan',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'code',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'sessionId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'school',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'School', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'schoolMetrics',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'SchoolConferenceMetrics',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'schoolId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'schoolSuggestion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Schoolsuggestion', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'schoolSuggestions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Schoolsuggestion',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolsuggestionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolsuggestionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'schools',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'School', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'searchHistories',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Searchhistory', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SearchhistoryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SearchhistoryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'searchHistory',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Searchhistory', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'searchSchools',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'School', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'search',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'seatPlanningAssignments',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'SeatPlanningAssignments',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'sightingDeck',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'SightingDeck', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'currentId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'index',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'schoolId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'size',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'status',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'withoutSchool',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'sightingEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'SightingDeckEntry',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'ids',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
										}
									}
								}
							},
							{
								name: 'schoolId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'status',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'withoutSchool',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'sightingNameMatches',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'SightingNameMatch',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'search',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'sightingSchools',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'SightingSchool', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							},
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'signedCodeKeys',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'SignedCodeKey', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'singleParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Singleparticipant', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'singleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Singleparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'supervisorSignupOpen',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'surveyAnswer',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyanswer', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'surveyAnswers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyanswer', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyanswerOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyanswerWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'surveyOption',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyoption', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'surveyOptions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyoption', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'surveyQuestion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyquestion', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'surveyQuestions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyquestion', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyquestionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyquestionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'tableView',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Tableview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'tableViewDefault',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Tableviewdefault', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'tableViewDefaults',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Tableviewdefault',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TableviewdefaultOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TableviewdefaultWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'tableViews',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Tableview', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TableviewOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TableviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'teamMember',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Teammember', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'teamMemberInvitation',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Teammemberinvitation',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'teamMemberInvitations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Teammemberinvitation',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberinvitationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberinvitationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'teamMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Teammember', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'teamMembersCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'users',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'waitingListEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Waitinglistentry',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'waitingListEntriesCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'waitingListEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Waitinglistentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'RegeneratedInvitation',
				fields: [
					{
						name: 'expiresAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'token',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'ENUM',
				name: 'RegionalbaselineEnum',
				enumValues: [
					{ name: 'ECOSOC' },
					{ name: 'HUMAN_RIGHTS_COUNCIL' },
					{ name: 'MANUAL' },
					{ name: 'SECURITY_COUNCIL' },
					{ name: 'UN_MEMBERS' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Resolution',
				fields: [
					{
						name: 'chasePaperId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'chaseSnapshotId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'committee',
						type: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committeeId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'file',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Storedfile', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'StoredfileWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'fileId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'title',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ResolutionOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'chasePaperId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'chaseSnapshotId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'committeeId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'fileId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'title',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ResolutionWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ResolutionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ResolutionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'chasePaperId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'chaseSnapshotId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committee',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'file',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'fileId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'title',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'ReviewerStat',
				fields: [
					{
						name: 'anonymizedName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'firstReviews',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isCurrentUser',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'totalReviews',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'Reviewersnippet',
				fields: [
					{
						name: 'content',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'userId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ReviewersnippetOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'content',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ReviewersnippetWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ReviewersnippetWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ReviewersnippetWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'ReviewersnippetWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'content',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'JSONWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'ReviewhelpstatusEnum',
				enumValues: [{ name: 'HELP_NEEDED' }, { name: 'NO_HELP_WANTED' }, { name: 'UNSPECIFIED' }]
			},
			{
				kind: 'OBJECT',
				name: 'Roleapplication',
				fields: [
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegationId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'rank',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'role',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'roleId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'RoleapplicationOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'delegationId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'rank',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'roleId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'RoleapplicationWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'RoleapplicationWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'RoleapplicationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'RoleapplicationWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegationId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'rank',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'role',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'roleId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'ScanIssue',
				enumValues: [
					{ name: 'alreadyScanned' },
					{ name: 'guardianConsentOpen' },
					{ name: 'notInConference' },
					{ name: 'paymentOpen' },
					{ name: 'surveyOptionMissing' },
					{ name: 'teamMember' },
					{ name: 'termsOpen' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'ScanLookupResult',
				fields: [
					{
						name: 'birthday',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'checkPassed',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'committeeAbbreviation',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'didAttend',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'familyName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'found',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'givenName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'guardianConsent',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'AdministrativestatusEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'inConference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isHeadDelegate',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isTeamMember',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isWaitingList',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'issues',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'ScanIssue', kind: 'ENUM', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'mayRecordAnyway',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'missingSurveyOptions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'nationAlpha2Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'nationAlpha3Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'nonStateActorIcon',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'nonStateActorName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'paymentStatus',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'AdministrativestatusEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'singleRoleName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'termsAndConditions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'AdministrativestatusEnum',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'userId',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'School',
				fields: [
					{
						name: 'apartment',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'city',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'contactEmail',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'contactName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'contactPhone',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'country',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isForeignSchool',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'notes',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'participants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'region',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'street',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'waitingListEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Waitinglistentry',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'website',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'zip',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SchoolConferenceMetrics',
				fields: [
					{
						name: 'applied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'attended',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conferenceTitle',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegations',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'fromWaitingList',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'participants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'seated',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'startConference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'supervisors',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'waitingList',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SchoolOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'apartment',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'city',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'contactEmail',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'contactName',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'contactPhone',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'country',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isForeignSchool',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notes',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'region',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'street',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'website',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'zip',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SchoolWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SchoolWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SchoolWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'apartment',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'city',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'contactEmail',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'contactName',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'contactPhone',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'country',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'isForeignSchool',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'notes',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'participants',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'region',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'street',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'waitingListEntries',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'WaitinglistentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'website',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'zip',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Schoolsuggestion',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'dismissed',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'key',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'similarity',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Float', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'variants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Schoolsuggestionvariant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolsuggestionvariantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolsuggestionvariantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SchoolsuggestionOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'dismissed',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'key',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'similarity',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SchoolsuggestionWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SchoolsuggestionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolsuggestionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SchoolsuggestionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'dismissed',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'key',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'similarity',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'FloatWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'variants',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolsuggestionvariantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Schoolsuggestionvariant',
				fields: [
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'school',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'School', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'schoolId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'suggestion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Schoolsuggestion', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolsuggestionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolsuggestionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'suggestionId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'sumParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SchoolsuggestionvariantOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'schoolId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'suggestionId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sumParticipants',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SchoolsuggestionvariantWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SchoolsuggestionvariantWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolsuggestionvariantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SchoolsuggestionvariantWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'school',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'schoolId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'suggestion',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolsuggestionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'suggestionId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sumParticipants',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Searchhistory',
				fields: [
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'label',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'originId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'resultId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'userId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SearchhistoryOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'label',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'originId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'resultId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SearchhistoryWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SearchhistoryWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SearchhistoryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SearchhistoryWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'label',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'originId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'resultId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'SeatPlanningAssignedRole',
				fields: [
					{
						name: 'memberCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'nationAlpha3Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'roleId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SeatPlanningAssignments',
				fields: [
					{
						name: 'committeeSeats',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'SeatPlanningCommitteeSeat',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'roles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'SeatPlanningAssignedRole',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SeatPlanningCommitteeSeat',
				fields: [
					{
						name: 'committeeId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'memberNames',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						},
						args: []
					},
					{
						name: 'nationAlpha3Code',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SendPersonEmailResult',
				fields: [
					{
						name: 'error',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sent',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SightingDeck',
				fields: [
					{
						name: 'counts',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'SightingDeckCounts', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'current',
						type: { kind: 'OBJECT', name: 'SightingDeckEntry', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'entries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'SightingDeckEntry',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'index',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'overallRated',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'overallTotal',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'start',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'unreviewedPastWindow',
						type: { kind: 'OBJECT', name: 'SightingDeckEntry', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SightingDeckCounts',
				fields: [
					{
						name: 'disqualified',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'flagged',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'rated',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'unrated',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SightingDeckEntry',
				fields: [
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'kind',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'required',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'school',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'size',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'status',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SightingNameMatch',
				fields: [
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SightingSchool',
				fields: [
					{
						name: 'applications',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'city',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'people',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'school',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'schoolId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SignedCode',
				fields: [
					{
						name: 'code',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'SignedCodeKey',
				fields: [
					{
						name: 'kid',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'publicKey',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'Singleparticipant',
				fields: [
					{
						name: 'applied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'appliedForRoles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignedRole',
						type: { kind: 'OBJECT', name: 'Conferencerole', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignedRoleId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'assignmentReview',
						type: { kind: 'OBJECT', name: 'Assignmentreview', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentreviewOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentreviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'experience',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'motivation',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'participant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'school',
						type: { kind: 'OBJECT', name: 'School', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'supervisors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferencesupervisor',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SingleparticipantOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'applied',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'assignedRoleId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'experience',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'motivation',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SingleparticipantWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SingleparticipantWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SingleparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SingleparticipantWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'applied',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'appliedForRoles',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignedRole',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceroleWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignedRoleId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'assignmentReview',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AssignmentreviewWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'experience',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'motivation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'participant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'school',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'supervisors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencesupervisorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{ kind: 'ENUM', name: 'SortingParameter', enumValues: [{ name: 'asc' }, { name: 'desc' }] },
			{
				kind: 'OBJECT',
				name: 'StatisticsResult',
				fields: [
					{
						name: 'addresses',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultAddresses',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'age',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'StatisticsResultAge', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'committeeFillRates',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultCommitteeFillRate',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'countdowns',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultCountdowns',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'diet',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredParticipantDiet',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'gender',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredParticipantGender',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'nationalityDistribution',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultNationality',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'paperStats',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultPaperStats',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'postalPaymentProgress',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultPostalPaymentProgress',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'refreshedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'registered',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegistered',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'registrationTimeline',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultRegistrationTimeline',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'roleBased',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRoleBased',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'schoolStats',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultSchool',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'supervisorStats',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultSupervisorStats',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'waitingList',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultWaitingList',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultAddresses',
				fields: [
					{
						name: 'count',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'country',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'lat',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'lng',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'zipPrefix',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultAge',
				fields: [
					{
						name: 'byCategory',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultAgeCategoryStats',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'byCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultAgeCommitteeStats',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'distribution',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultAgeDistributionEntry',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'overall',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultAgeOverall',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultAgeCategoryBreakdown',
				fields: [
					{
						name: 'categoryId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'count',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultAgeCategoryStats',
				fields: [
					{
						name: 'average',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'categoryId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'categoryName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'categoryType',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultAgeCategoryType',
								kind: 'ENUM',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'count',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'ENUM',
				name: 'StatisticsResultAgeCategoryType',
				enumValues: [{ name: 'delegationMember' }, { name: 'singleParticipant' }]
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultAgeCommitteeStats',
				fields: [
					{
						name: 'abbreviation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'average',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'committeeId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'committeeName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'count',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultAgeDistributionEntry',
				fields: [
					{
						name: 'age',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'byCategory',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultAgeCategoryBreakdown',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'count',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultAgeOverall',
				fields: [
					{
						name: 'average',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'missingBirthdays',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultCommitteeFillRate',
				fields: [
					{
						name: 'abbreviation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'assignedSeats',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'committeeId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'fillPercentage',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'totalSeats',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultCountdowns',
				fields: [
					{
						name: 'daysUntilConference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'daysUntilEndRegistration',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultNationality',
				fields: [
					{
						name: 'count',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'country',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultPaperStats',
				fields: [
					{
						name: 'byCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultPapersByCommittee',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'byStatus',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultPapersByStatus',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'byType',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultPapersByType',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'withReviews',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'withoutReviews',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultPapersByCommittee',
				fields: [
					{
						name: 'abbreviation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'committeeId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'count',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultPapersByStatus',
				fields: [
					{
						name: 'accepted',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'changesRequested',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'draft',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'submitted',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultPapersByType',
				fields: [
					{
						name: 'introductionPaper',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'positionPaper',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'workingPaper',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultPostalPaymentProgress',
				fields: [
					{
						name: 'bothComplete',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'maxParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'neitherComplete',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paymentDone',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paymentOnlyComplete',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paymentPending',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paymentPercentage',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paymentProblem',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'postalDone',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'postalOnlyComplete',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'postalPending',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'postalPercentage',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'postalProblem',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRegistered',
				fields: [
					{
						name: 'applied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredDelegationMembers',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'delegations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredDelegations',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'notApplied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'singleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredSingleParticipants',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'supervisors',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRegisteredDelegationMembers',
				fields: [
					{
						name: 'applied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'notApplied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRegisteredDelegations',
				fields: [
					{
						name: 'applied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'notApplied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRegisteredParticipantDiet',
				fields: [
					{
						name: 'delegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredParticipantDietVariations',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'singleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredParticipantDietVariations',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'supervisors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredParticipantDietVariations',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'teamMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredParticipantDietVariations',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRegisteredParticipantDietVariations',
				fields: [
					{
						name: 'omnivore',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'vegan',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'vegetarian',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRegisteredParticipantGender',
				fields: [
					{
						name: 'delegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredParticipantGenderVariations',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'singleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredParticipantGenderVariations',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'supervisors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredParticipantGenderVariations',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'teamMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'StatisticsResultRegisteredParticipantGenderVariations',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRegisteredParticipantGenderVariations',
				fields: [
					{
						name: 'diverse',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'female',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'male',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'noStatement',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRegisteredSingleParticipants',
				fields: [
					{
						name: 'applied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'byRole',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'StatisticsResultRegisteredSingleParticipantsByRole',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: []
					},
					{
						name: 'notApplied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRegisteredSingleParticipantsByRole',
				fields: [
					{
						name: 'applied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'fontAwesomeIcon',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'notApplied',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'role',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRegistrationTimeline',
				fields: [
					{
						name: 'cumulativeDelegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'cumulativeDelegations',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'cumulativeSingleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'cumulativeSupervisors',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'date',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultRoleBased',
				fields: [
					{
						name: 'delegationMembersWithCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationMembersWithRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationMembersWithoutCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationMembersWithoutRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationsWithAssignment',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationsWithoutAssignment',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'singleParticipantsWithRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'singleParticipantsWithoutRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultSchool',
				fields: [
					{
						name: 'people',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'school',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultSupervisorStats',
				fields: [
					{
						name: 'accepted',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'acceptedAndNotPresent',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'acceptedAndPresent',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'doesNotPlanAttendance',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'plansAttendance',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'rejected',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'rejectedAndNotPresent',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'rejectedAndPresent',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'StatisticsResultWaitingList',
				fields: [
					{
						name: 'assigned',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'hidden',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'total',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'unassigned',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'visible',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'ENUM',
				name: 'StatsFilter',
				enumValues: [
					{ name: 'ALL' },
					{ name: 'APPLIED' },
					{ name: 'APPLIED_WITHOUT_ROLE' },
					{ name: 'APPLIED_WITH_ROLE' },
					{ name: 'NOT_APPLIED' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Storedfile',
				fields: [
					{
						name: 'certificateOf',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'contractOf',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'emblemOf',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'fileName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'guardianConsentOf',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'imageOf',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'key',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'logoOf',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'mediaConsentOf',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'mimeType',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'purpose',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'resolutionOf',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Resolution', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sitePlanOf',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Place', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PlaceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PlaceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'size',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'termsAndConditionsOf',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'uploadUrl',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'uploadedById',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'url',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'StoredfileOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'fileName',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'key',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'mimeType',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'purpose',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'size',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'uploadedById',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'StoredfileWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'StoredfileWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StoredfileWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'StoredfileWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'certificateOf',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'contractOf',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'emblemOf',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'fileName',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'guardianConsentOf',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'imageOf',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'key',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'logoOf',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'mediaConsentOf',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'mimeType',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'purpose',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'resolutionOf',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sitePlanOf',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PlaceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'size',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'termsAndConditionsOf',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'uploadedById',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'StringArrayWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'StringArrayWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringArrayWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'StringArrayWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContained',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContains',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayOverlaps',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									kind: 'LIST',
									ofType: {
										kind: 'NON_NULL',
										ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
									}
								}
							}
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'StringWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'StringWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'StringWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContained',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayContains',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'arrayOverlaps',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'eq',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gt',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gte',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ilike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'in',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'isNotNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isNull',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'like',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lt',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lte',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ne',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIlike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'notIn',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
							}
						},
						defaultValue: void 0
					},
					{
						name: 'notLike',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Subscription',
				fields: [
					{
						name: 'assignmentReview',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Assignmentreview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignmentReviews',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Assignmentreview',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentreviewOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentreviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignmentReviewsCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentreviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignmentSingleRole',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Assignmentsinglerole',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignmentSingleRoles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Assignmentsinglerole',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentsingleroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentsingleroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignmentUnit',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Assignmentunit', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignmentUnits',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Assignmentunit', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentunitOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentunitWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'assignmentWeight',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Assignmentweights', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'assignmentWeights',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Assignmentweights',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentweightsOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AssignmentweightsWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'attendanceEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Attendanceentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendanceentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendanceentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'attendanceEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Attendanceentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'attendanceSession',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Attendancesession', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'attendanceSessions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Attendancesession',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendancesessionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendancesessionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarDay',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendarday', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'calendarDays',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendarday', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendardayOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendardayWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendarentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendarentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'calendarTrack',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'calendarTracks',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendartrack', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendartrackWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'chasePresence',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Chasepresence', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'chasePresences',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Chasepresence', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ChasepresenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ChasepresenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committee',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'committeeAgendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Committeeagendaitem', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'committeeAgendaItems',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Committeeagendaitem',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeagendaitemOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeagendaitemWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committees',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Committee', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceEmailFooter',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceemailfooter',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceEmailFooters',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceemailfooter',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailfooterOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailfooterWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceEmailSetting',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceemailsetting',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceEmailSettings',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceemailsetting',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailsettingOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailsettingWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceEmailText',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conferenceemailtext', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceEmailTexts',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceemailtext',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailtextOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceemailtextWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceRole',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceRoles',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conferencerole', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceroleWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferencesupervisor',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceSupervisors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferencesupervisor',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferences',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'delegationMember',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Delegationmember', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'delegationMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Delegationmember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Delegation', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'delegationsCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'emailLog',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Emaillog', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'emailLogs',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Emaillog', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'EmaillogOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'EmaillogWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'instanceLink',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Instancelink', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'instanceLinks',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Instancelink', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'InstancelinkOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'InstancelinkWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'mcpAuditEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Mcpauditentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'McpauditentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'McpauditentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'mcpAuditEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Mcpauditentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'nation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Nation', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'nations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Nation', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'NationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'NationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'papers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'papersCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paymentTransaction',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paymenttransaction', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paymentTransactions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Paymenttransaction',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaymenttransactionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaymenttransactionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'place',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Place', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'places',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Place', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PlaceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PlaceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'possibleDuplicate',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Possibleduplicate', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'possibleDuplicates',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Possibleduplicate',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PossibleduplicateOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PossibleduplicateWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'resolution',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Resolution', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'resolutions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Resolution', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'reviewerSnippet',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Reviewersnippet', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'reviewerSnippets',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Reviewersnippet', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ReviewersnippetOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ReviewersnippetWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'roleApplication',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Roleapplication', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'roleApplications',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Roleapplication', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RoleapplicationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RoleapplicationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'school',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'School', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'schoolSuggestion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Schoolsuggestion', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'schoolSuggestions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Schoolsuggestion',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolsuggestionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolsuggestionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'schools',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'School', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'searchHistories',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Searchhistory', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SearchhistoryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SearchhistoryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'searchHistory',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Searchhistory', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'singleParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Singleparticipant', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'singleParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Singleparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'surveyAnswer',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyanswer', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'surveyAnswers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyanswer', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyanswerOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyanswerWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'surveyOption',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyoption', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'surveyOptions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyoption', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'surveyQuestion',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyquestion', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'surveyQuestions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyquestion', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyquestionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyquestionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'tableView',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Tableview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'tableViewDefault',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Tableviewdefault', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'tableViewDefaults',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Tableviewdefault',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TableviewdefaultOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TableviewdefaultWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'tableViews',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Tableview', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TableviewOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TableviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'teamMember',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Teammember', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'teamMemberInvitation',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Teammemberinvitation',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'teamMemberInvitations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Teammemberinvitation',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberinvitationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberinvitationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'teamMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Teammember', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'teamMembersCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'users',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'waitingListEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Waitinglistentry',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'waitingListEntriesCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'waitingListEntry',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Waitinglistentry', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'Surveyanswer',
				fields: [
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'option',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyoption', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'optionId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'participant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'question',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyquestion', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyquestionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyquestionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'questionId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SurveyanswerOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'optionId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'questionId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SurveyanswerWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SurveyanswerWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyanswerWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SurveyanswerWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'option',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyoptionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'optionId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'participant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'question',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyquestionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'questionId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Surveyoption',
				fields: [
					{
						name: 'attendanceSessions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Attendancesession',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendancesessionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendancesessionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'calendarEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Calendarentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CalendarentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'countSurveyAnswers',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'description',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'question',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Surveyquestion', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyquestionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyquestionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'questionId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'surveyAnswers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyanswer', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyanswerOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyanswerWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'title',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'upperLimit',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SurveyoptionOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'description',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'questionId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'title',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'upperLimit',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SurveyoptionWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SurveyoptionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyoptionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SurveyoptionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'attendanceSessions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AttendancesessionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'calendarEntries',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CalendarentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'description',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'question',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyquestionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'questionId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'surveyAnswers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyanswerWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'title',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'upperLimit',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Surveyquestion',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'deadline',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'description',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'draft',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'hidden',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'options',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyoption', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyoptionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'showSelectionOnDashboard',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'surveyAnswers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyanswer', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyanswerOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyanswerWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'title',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SurveyquestionOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'deadline',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'description',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'draft',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'hidden',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'showSelectionOnDashboard',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'title',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SurveyquestionWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SurveyquestionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyquestionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'SurveyquestionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'deadline',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'description',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'draft',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'hidden',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'options',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyoptionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'showSelectionOnDashboard',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'surveyAnswers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyanswerWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'title',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Tableview',
				fields: [
					{
						name: 'conference',
						type: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdById',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isDefault',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'owner',
						type: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'ownerUserId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'shared',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'state',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'JSON', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'tableKey',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'TableviewOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdById',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isDefault',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'ownerUserId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'shared',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'state',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'tableKey',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'TableviewWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'TableviewWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'TableviewWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'TableviewWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdById',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'isDefault',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'owner',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'ownerUserId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'shared',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'state',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'JSONWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'tableKey',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Tableviewdefault',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'tableKey',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'userId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'view',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Tableview', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TableviewOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TableviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'viewId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'TableviewdefaultOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'tableKey',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'viewId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'TableviewdefaultWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'TableviewdefaultWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'TableviewdefaultWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'TableviewdefaultWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'tableKey',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'view',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'TableviewWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'viewId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'TeamInvitationEmailStatus',
				enumValues: [
					{ name: 'ALREADY_MEMBER' },
					{ name: 'EXISTS' },
					{ name: 'NEW_USER' },
					{ name: 'PENDING_INVITATION' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Teammember',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'role',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'TeamroleEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'userId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'TeammemberOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'role',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'TeammemberWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'TeammemberWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'TeammemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'TeammemberWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'role',
						type: { kind: 'ENUM', name: 'TeamroleEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Teammemberinvitation',
				fields: [
					{
						name: 'acceptedBy',
						type: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'acceptedById',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'email',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'expiresAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'invitedBy',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'invitedById',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'revokedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'role',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'TeamroleEnum', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'token',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'usedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'userExists',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'TeammemberinvitationOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'acceptedById',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'email',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'expiresAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'invitedById',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'revokedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'role',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'token',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'usedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'TeammemberinvitationWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'TeammemberinvitationWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'TeammemberinvitationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'TeammemberinvitationWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'acceptedBy',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'acceptedById',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'email',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'expiresAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'invitedBy',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'invitedById',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'revokedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'role',
						type: { kind: 'ENUM', name: 'TeamroleEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'token',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'usedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'TeamroleEnum',
				enumValues: [
					{ name: 'CONTENT_LEAD' },
					{ name: 'MEMBER' },
					{ name: 'PARTICIPANT_CARE' },
					{ name: 'PROJECT_MANAGEMENT' },
					{ name: 'REVIEWER' },
					{ name: 'TEAM_COORDINATOR' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'UnlockedPieceData',
				fields: [
					{
						name: 'flagAlpha2Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'flagAlpha3Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'flagId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'flagName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'flagType',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'FlagTypeForUnlock', kind: 'ENUM', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'fontAwesomeIcon',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'foundCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isComplete',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'pieceName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'totalCount',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'UpdateAllConferenceParticipantsResponse',
				fields: [
					{
						name: 'changed',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Int', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'User',
				fields: [
					{
						name: 'apartment',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'birthday',
						type: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'city',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conferenceParticipants',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferenceparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceParticipationsCount',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conferenceSupervisor',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Conferencesupervisor',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencesupervisorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'country',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'delegationMemberships',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Delegationmember',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'DelegationmemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'duplicateDecisions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Possibleduplicate',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PossibleduplicateOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PossibleduplicateWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'duplicatesAsCandidate',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Possibleduplicate',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PossibleduplicateOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PossibleduplicateWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'duplicatesAsUser',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Possibleduplicate',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PossibleduplicateOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PossibleduplicateWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'email',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'emergencyContacts',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'familyName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'foodPreference',
						type: { kind: 'ENUM', name: 'FoodpreferenceEnum', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'gender',
						type: { kind: 'ENUM', name: 'GenderEnum', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'givenName',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'globalNotes',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'invitationsAccepted',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Teammemberinvitation',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberinvitationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberinvitationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'invitationsSent',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Teammemberinvitation',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberinvitationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberinvitationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'locale',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'ownPaymentTransactions',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Paymenttransaction',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaymenttransactionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaymenttransactionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperReviews',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paperreview', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperreviewOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperreviewWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'papers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Paper', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paymentTransactionsReferences',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Userreferenceinpaymenttransaction',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserreferenceinpaymenttransactionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserreferenceinpaymenttransactionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'phone',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'preferredUsername',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'pronouns',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'recordedAttendanceEntries',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Attendanceentry', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendanceentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AttendanceentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'region',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'reviewerSnippets',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Reviewersnippet', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ReviewersnippetOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ReviewersnippetWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'singleParticipant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Singleparticipant',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SingleparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'street',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'surveyAnswers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Surveyanswer', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyanswerOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SurveyanswerWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'teamMember',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { name: 'Teammember', kind: 'OBJECT', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'TeammemberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'waitingListEntry',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										name: 'Waitinglistentry',
										kind: 'OBJECT',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'limit',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'offset',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'search',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'WaitinglistentryWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'wantsJoinTeamInformation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'wantsToReceiveGeneralInformation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'zip',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'UserOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'apartment',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'birthday',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'city',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'country',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'email',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'emergencyContacts',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'familyName',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'foodPreference',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gender',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'givenName',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'globalNotes',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'locale',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'phone',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'preferredUsername',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'pronouns',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'region',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'street',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'wantsJoinTeamInformation',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'wantsToReceiveGeneralInformation',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'zip',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'UserWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'UserWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'UserWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'apartment',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'birthday',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'city',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipants',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceSupervisor',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencesupervisorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'country',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'delegationMemberships',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DelegationmemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'duplicateDecisions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PossibleduplicateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'duplicatesAsCandidate',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PossibleduplicateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'duplicatesAsUser',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PossibleduplicateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'email',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'emergencyContacts',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'familyName',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'foodPreference',
						type: { kind: 'ENUM', name: 'FoodpreferenceEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'gender',
						type: { kind: 'ENUM', name: 'GenderEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'givenName',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'globalNotes',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'invitationsAccepted',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'TeammemberinvitationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'invitationsSent',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'TeammemberinvitationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'locale',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'ownPaymentTransactions',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaymenttransactionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperReviews',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperreviewWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'papers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paymentTransactionsReferences',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserreferenceinpaymenttransactionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'phone',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'preferredUsername',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'pronouns',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'recordedAttendanceEntries',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AttendanceentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'region',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'reviewerSnippets',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ReviewersnippetWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'singleParticipant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SingleparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'street',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'surveyAnswers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SurveyanswerWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'teamMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'TeammemberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'waitingListEntry',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'WaitinglistentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'wantsJoinTeamInformation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'wantsToReceiveGeneralInformation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'zip',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Userreferenceinpaymenttransaction',
				fields: [
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'participant',
						type: {
							kind: 'NON_NULL',
							ofType: {
								name: 'Conferenceparticipant',
								kind: 'OBJECT',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceparticipantWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paymentTransaction',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Paymenttransaction', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaymenttransactionOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PaymenttransactionWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paymentTransactionId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'UserreferenceinpaymenttransactionOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceParticipantId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paymentTransactionId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'UserreferenceinpaymenttransactionWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'UserreferenceinpaymenttransactionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserreferenceinpaymenttransactionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'UserreferenceinpaymenttransactionWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceParticipantId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'participant',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceparticipantWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paymentTransaction',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PaymenttransactionWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paymentTransactionId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Waitinglistentry',
				fields: [
					{
						name: 'assignedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Conference', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'experience',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'hidden',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'Boolean', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'motivation',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'String', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'requests',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'school',
						type: { kind: 'OBJECT', name: 'School', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SchoolWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'schoolId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'search_distance',
						type: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'DateTime', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'User', kind: 'OBJECT', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'UserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'userId',
						type: {
							kind: 'NON_NULL',
							ofType: { name: 'ID', kind: 'SCALAR', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'WaitinglistentryOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'assignedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'experience',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'hidden',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'motivation',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'requests',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'schoolId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'WaitinglistentryWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'AND',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'WaitinglistentryWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'NOT',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'WaitinglistentryWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'OR',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									name: 'WaitinglistentryWhereInputArgument',
									kind: 'INPUT_OBJECT',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'assignedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'experience',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'hidden',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'BooleanWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'motivation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'requests',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'school',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SchoolWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'schoolId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateTimeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'userId',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IDWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			}
		],
		directives: []
	}
} as IntrospectionQuery;

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
				name: 'Agendaitem',
				fields: [
					{
						name: 'committee',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null }
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isActive',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'resolutionPapers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
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
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'speakersList',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Speakerslist', ofType: null, __proto__: null }
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
									name: 'SpeakerslistOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SpeakerslistWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AgendaitemOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committee',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
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
						name: 'resolutionPapers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'speakersList',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SpeakerslistOrderInputArgument',
							ofType: null,
							__proto__: null
						},
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
				name: 'AgendaitemWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
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
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'resolutionPapers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'speakersList',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SpeakerslistWhereInputArgument',
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
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Amendment',
				fields: [
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'documentNumber',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'newContent',
						type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'proposer',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'proposerCommitteeMemberId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'sequenceNumber',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'sponsors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Amendmentsponsor',
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
									name: 'AmendmentsponsorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentsponsorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'status',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'ENUM', name: 'AmendmentstatusEnum', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'targetClauseId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'targetOperativeIndex',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'targetPosition',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'type',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'ENUM', name: 'AmendmenttypeEnum', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AmendmentOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'documentNumber',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'newContent',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'proposer',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'proposerCommitteeMemberId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sequenceNumber',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sponsors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentsponsorOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'targetClauseId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'targetOperativeIndex',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'targetPosition',
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
				name: 'AmendmentWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'documentNumber',
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
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'newContent',
						type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'proposer',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'proposerCommitteeMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'sequenceNumber',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sponsors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentsponsorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'AmendmentstatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'targetClauseId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'targetOperativeIndex',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'targetPosition',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'type',
						type: { kind: 'ENUM', name: 'AmendmenttypeEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Amendmentsponsor',
				fields: [
					{
						name: 'amendment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'amendmentId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'committeeMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committeeMemberId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AmendmentsponsorOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'amendment',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'amendmentId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'committeeMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMemberId',
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
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'AmendmentsponsorWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'amendment',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'amendmentId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'committeeMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'AmendmentstatusEnum',
				enumValues: [
					{ name: 'ACCEPTED' },
					{ name: 'CONSENSUS_ADOPTED' },
					{ name: 'PENDING' },
					{ name: 'REJECTED' },
					{ name: 'SUBMITTED' },
					{ name: 'WITHDRAWN' }
				]
			},
			{
				kind: 'ENUM',
				name: 'AmendmenttypeEnum',
				enumValues: [
					{ name: 'ADD' },
					{ name: 'ALTER_POSITION' },
					{ name: 'ALTER_TEXT' },
					{ name: 'DELETE' }
				]
			},
			{ kind: 'SCALAR', name: 'Boolean' },
			{
				kind: 'ENUM',
				name: 'CommentvisibilityEnum',
				enumValues: [{ name: 'PUBLIC' }, { name: 'TEAM_ONLY' }]
			},
			{
				kind: 'OBJECT',
				name: 'Committee',
				fields: [
					{
						name: 'abbreviation',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'activeAgendaItem',
						type: { kind: 'OBJECT', name: 'Agendaitem', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AgendaitemOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AgendaitemWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'activeAgendaItemId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'activeAmendment',
						type: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'activeAmendmentId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'activeDraftResolution',
						type: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'activeDraftResolutionId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
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
									ofType: { kind: 'OBJECT', name: 'Agendaitem', ofType: null, __proto__: null }
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
									name: 'AgendaitemOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AgendaitemWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'allowDelegationsToAddThemselvesToSpeakersList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'amendmentSponsoringOpen',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'amendmentSubmissionOpen',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null }
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'currentOperativeClauseId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'currentOperativeIndex',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'customPaperSupportThreshold',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'customSimpleMajority',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'customTwoThirdsMajority',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'lastResolutionAdoptionDate',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'maxDraftResolutions',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
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
									ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
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
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paperSupportThreshold',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'resolutionHeadline',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'resolutionPapers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
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
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'showWhiteboard',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'simpleMajority',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'stateOfDebate',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'status',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'ENUM', name: 'CommitteestatusEnum', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'statusHeadline',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'statusUntil',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'supportReEvaluationOpen',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'totalPresent',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'twoThirdsMajority',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'whiteboardContent',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
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
						name: 'activeAgendaItem',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AgendaitemOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'activeAgendaItemId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'activeAmendment',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'activeAmendmentId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'activeDraftResolution',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'activeDraftResolutionId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'agendaItems',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AgendaitemOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'allowDelegationsToAddThemselvesToSpeakersList',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'amendmentSponsoringOpen',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'amendmentSubmissionOpen',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceOrderInputArgument',
							ofType: null,
							__proto__: null
						},
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
						name: 'currentOperativeClauseId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'currentOperativeIndex',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'customPaperSupportThreshold',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'customSimpleMajority',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'customTwoThirdsMajority',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lastResolutionAdoptionDate',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'maxDraftResolutions',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'members',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'resolutionHeadline',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'resolutionPapers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'showWhiteboard',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'stateOfDebate',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'status',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'statusHeadline',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'statusUntil',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'supportReEvaluationOpen',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'whiteboardContent',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CommitteeWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
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
						name: 'activeAgendaItem',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AgendaitemWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'activeAgendaItemId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'activeAmendment',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'activeAmendmentId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'activeDraftResolution',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'activeDraftResolutionId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'agendaItems',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AgendaitemWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'allowDelegationsToAddThemselvesToSpeakersList',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'amendmentSponsoringOpen',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'amendmentSubmissionOpen',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
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
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'currentOperativeClauseId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'currentOperativeIndex',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'customPaperSupportThreshold',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'customSimpleMajority',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'customTwoThirdsMajority',
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
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'lastResolutionAdoptionDate',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'maxDraftResolutions',
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
							name: 'CommitteememberWhereInputArgument',
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
						name: 'resolutionPapers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'showWhiteboard',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'stateOfDebate',
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
						type: { kind: 'ENUM', name: 'CommitteestatusEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'statusHeadline',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'statusUntil',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'supportReEvaluationOpen',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'whiteboardContent',
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
				name: 'Committeemember',
				fields: [
					{
						name: 'amendmentSponsors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Amendmentsponsor',
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
									name: 'AmendmentsponsorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentsponsorWhereInputArgument',
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
							ofType: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null }
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdPapers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
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
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paperSponsors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papersponsor', ofType: null, __proto__: null }
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
									name: 'PapersponsorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapersponsorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'presenceChangedTimestamps',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Presencechangedtimestamp',
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
									name: 'PresencechangedtimestampOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PresencechangedtimestampWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'present',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'proposedAmendments',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
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
									name: 'AmendmentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'representation',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Representation', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RepresentationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RepresentationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'representationId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'users',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
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
									name: 'ConferenceuserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceuserWhereInputArgument',
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
				name: 'CommitteememberOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'amendmentSponsors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentsponsorOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committee',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
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
						name: 'createdPapers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paperSponsors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapersponsorOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'presenceChangedTimestamps',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PresencechangedtimestampOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'present',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'proposedAmendments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'representation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'RepresentationOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'representationId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'users',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'CommitteememberWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'amendmentSponsors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentsponsorWhereInputArgument',
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
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdPapers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paperSponsors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapersponsorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'presenceChangedTimestamps',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PresencechangedtimestampWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'present',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'proposedAmendments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'representation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'RepresentationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'representationId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'users',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'CommitteestatusEnum',
				enumValues: [
					{ name: 'FORMAL' },
					{ name: 'INFORMAL' },
					{ name: 'MODERATED_INFORMAL' },
					{ name: 'PAUSE' },
					{ name: 'SUSPENSION' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Conference',
				fields: [
					{
						name: 'committees',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null }
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
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'hasModeratedCaucus',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
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
										kind: 'OBJECT',
										name: 'Conferencemember',
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
									name: 'ConferencememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'pressWebsite',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'representations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Representation', ofType: null, __proto__: null }
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
									name: 'RepresentationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RepresentationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'resolutionFeatureEnabled',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'title',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'uniqueConferenceMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Conferencemember',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						args: [
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'users',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
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
									name: 'ConferenceuserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceuserWhereInputArgument',
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
				name: 'ConferenceOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committees',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'hasModeratedCaucus',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'members',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'pressWebsite',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'representations',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'RepresentationOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'resolutionFeatureEnabled',
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
						name: 'users',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
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
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'hasModeratedCaucus',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'members',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'pressWebsite',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'representations',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'RepresentationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'resolutionFeatureEnabled',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
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
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'users',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Conferencemember',
				fields: [
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null }
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'representation',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Representation', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RepresentationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RepresentationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'representationId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'speakerOnList',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Speakeronlist', ofType: null, __proto__: null }
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
									name: 'SpeakeronlistOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SpeakeronlistWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'users',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
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
									name: 'ConferenceuserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceuserWhereInputArgument',
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
				name: 'ConferencememberOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceOrderInputArgument',
							ofType: null,
							__proto__: null
						},
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
						name: 'representation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'RepresentationOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'representationId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'speakerOnList',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SpeakeronlistOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'users',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferencememberWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
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
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'representation',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'RepresentationWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'representationId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'speakerOnList',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SpeakeronlistWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'users',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Conferenceuser',
				fields: [
					{
						name: 'comments',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Resolutioncomment',
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
									name: 'ResolutioncommentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutioncommentWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committeeMember',
						type: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committeeMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conference',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null }
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conferenceMember',
						type: { kind: 'OBJECT', name: 'Conferencemember', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conferenceUserType',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'ENUM',
								name: 'ConferenceusertypeEnum',
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
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paperEditors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papereditor', ofType: null, __proto__: null }
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
									name: 'PapereditorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapereditorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'user',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null }
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
						name: 'userEmail',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceuserOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'comments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutioncommentOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMemberId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceMemberId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceUserType',
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
						name: 'paperEditors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapereditorOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'user',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'UserOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'userEmail',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ConferenceuserWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'comments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutioncommentWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
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
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceUserType',
						type: { kind: 'ENUM', name: 'ConferenceusertypeEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paperEditors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapereditorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
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
						name: 'userEmail',
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
				kind: 'ENUM',
				name: 'ConferenceusertypeEnum',
				enumValues: [
					{ name: 'ADMIN' },
					{ name: 'DELEGATE' },
					{ name: 'NON_STATE_ACTOR' },
					{ name: 'SPECTATOR' },
					{ name: 'TEAM' }
				]
			},
			{ kind: 'SCALAR', name: 'Date' },
			{ kind: 'SCALAR', name: 'DateTime' },
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
									kind: 'INPUT_OBJECT',
									name: 'DateWhereInputArgument',
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
									kind: 'INPUT_OBJECT',
									name: 'DateWhereInputArgument',
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
								ofType: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Date', ofType: null, __proto__: null }
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
			{ kind: 'SCALAR', name: 'Float' },
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
									kind: 'INPUT_OBJECT',
									name: 'FloatWhereInputArgument',
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
									kind: 'INPUT_OBJECT',
									name: 'FloatWhereInputArgument',
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
								ofType: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Float', ofType: null, __proto__: null }
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
			{ kind: 'SCALAR', name: 'ID' },
			{
				kind: 'INPUT_OBJECT',
				name: 'ImportData',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'agendaItems',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'INPUT_OBJECT',
										name: 'ImportDataAgendaItem',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'INPUT_OBJECT',
										name: 'ImportDataCommitteeMember',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'committees',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'INPUT_OBJECT',
										name: 'ImportDataCommittee',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'INPUT_OBJECT',
										name: 'ImportDataConferenceMember',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceUsers',
						type: {
							kind: 'LIST',
							ofType: {
								kind: 'NON_NULL',
								ofType: {
									kind: 'INPUT_OBJECT',
									name: 'ImportDataConferenceUser',
									ofType: null,
									__proto__: null
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'representations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'INPUT_OBJECT',
										name: 'ImportDataRepresentation',
										ofType: null,
										__proto__: null
									}
								}
							}
						},
						defaultValue: void 0
					},
					{
						name: 'title',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ImportDataAgendaItem',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'title',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ImportDataCommittee',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'abbreviation',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'resolutionHeadline',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ImportDataCommitteeMember',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'representationId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ImportDataConferenceMember',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'representationId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ImportDataConferenceUser',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceUserType',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'ENUM',
								name: 'ConferenceusertypeEnum',
								ofType: null,
								__proto__: null
							}
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'userEmail',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ImportDataRepresentation',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'alpha2Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'alpha3Code',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'faIcon',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						defaultValue: void 0
					},
					{
						name: 'name',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'regionalGroup',
						type: { kind: 'ENUM', name: 'RegionalgroupEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'representationType',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'ENUM',
								name: 'RepresentationtypeEnum',
								ofType: null,
								__proto__: null
							}
						},
						defaultValue: void 0
					}
				]
			},
			{ kind: 'SCALAR', name: 'Int' },
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
									kind: 'INPUT_OBJECT',
									name: 'IntWhereInputArgument',
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
									kind: 'INPUT_OBJECT',
									name: 'IntWhereInputArgument',
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
								ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
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
			{ kind: 'SCALAR', name: 'JSON' },
			{
				kind: 'OBJECT',
				name: 'Mutation',
				fields: [
					{
						name: 'acceptAmendment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'amendmentId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'addAmendmentSponsor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendmentsponsor', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'amendmentId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'committeeMemberId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'addSpeakerOnList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakeronlist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeMemberId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'conferenceMemberId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'position',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'speakersListId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'addSponsor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Papersponsor', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeMemberId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'adoptByConsensus',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'amendmentId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'chairCreateAmendment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeMemberId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'newContent',
								type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null }
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'targetClauseId',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'targetOperativeIndex',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'targetPosition',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'type',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'ENUM', name: 'AmendmenttypeEnum', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'chairCreateResolutionPaper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'agendaItemId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'committeeId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'committeeMemberId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'title',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'clearSpeakersList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakerslist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createAgendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Agendaitem', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'title',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createAmendment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'newContent',
								type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null }
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'targetClauseId',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'targetOperativeIndex',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'targetPosition',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'type',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'ENUM', name: 'AmendmenttypeEnum', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createComment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutioncomment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'clauseId',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'content',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
								}
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'parentCommentId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'visibility',
								type: { kind: 'ENUM', name: 'CommentvisibilityEnum', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'createCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'abbreviation',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
								}
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'name',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createCommitteeMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'representationId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createConferenceMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conferencemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'representationId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createConferenceUser',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'conferenceUserType',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'ENUM',
										name: 'ConferenceusertypeEnum',
										ofType: null,
										__proto__: null
									}
								}
							},
							{
								name: 'userEmail',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'createRepresentation',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Representation', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'alpha2Code',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'alpha3Code',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'conferenceId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'faIcon',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'type',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'ENUM',
										name: 'RepresentationtypeEnum',
										ofType: null,
										__proto__: null
									}
								}
							}
						]
					},
					{
						name: 'createResolutionPaper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'agendaItemId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'committeeId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'title',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'createShareCode',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Papersharecode', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'permission',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'ENUM',
										name: 'SharecodepermissionEnum',
										ofType: null,
										__proto__: null
									}
								}
							}
						]
					},
					{
						name: 'deleteClauseVote',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'clauseId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
								}
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteComment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'commentId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteCommitteeMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteConference',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteConferenceMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteConferenceUser',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteRepresentation',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'deleteShareCode',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'shareCodeId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'editAmendment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'amendmentId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'newContent',
								type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null }
							},
							{
								name: 'proposerCommitteeMemberId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'targetClauseId',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'targetOperativeIndex',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'targetPosition',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'importDelegatorConference',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'data',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'INPUT_OBJECT',
										name: 'ImportData',
										ofType: null,
										__proto__: null
									}
								}
							}
						]
					},
					{
						name: 'moveSpeakerToPosition',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakeronlist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'position',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'promoteToDraftResolution',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'recordClauseVote',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Operativeclausevote', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'clauseId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
								}
							},
							{
								name: 'outcome',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'ENUM', name: 'VoteoutcomeEnum', ofType: null, __proto__: null }
								}
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'votesAbstain',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'votesAgainst',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
								}
							},
							{
								name: 'votesFor',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'recordVoteResult',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'outcome',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'ENUM', name: 'VoteoutcomeEnum', ofType: null, __proto__: null }
								}
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'votesAbstain',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'votesAgainst',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
								}
							},
							{
								name: 'votesFor',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'redeemShareCode',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'OBJECT',
								name: 'ShareCodeRedemptionResult',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'code',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'rejectAmendment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'amendmentId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'removeAmendmentSponsor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'amendmentId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'committeeMemberId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'removeEditor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'conferenceUserId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'removeSpeakerOnList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakerslist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'speakerOnListId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'removeSponsor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeMemberId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'revertPaperStatus',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'restoreSnapshot',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'selfAddToSpeakersList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakeronlist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'speakersListId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'selfRemoveFromSpeakersList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakerslist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'speakersListId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'setPresenceForCommitteeMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
								}
							}
						},
						args: [
							{
								name: 'ids',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'LIST',
										ofType: {
											kind: 'NON_NULL',
											ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
										}
									}
								}
							},
							{
								name: 'present',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'softDeletePaper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'startVotingPhase',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'submitPaper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'updateComment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutioncomment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'commentId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'content',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'updateCommittee',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'abbreviation',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'activeAgendaItemId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'activeAmendmentId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'activeDraftResolutionId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'allowDelegationsToAddThemselvesToSpeakersList',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'amendmentSponsoringOpen',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'amendmentSubmissionOpen',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'clearActiveAmendment',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'clearActiveDraftResolution',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'currentOperativeClauseId',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'currentOperativeIndex',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'lastResolutionAdoptionDate',
								type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
							},
							{
								name: 'maxDraftResolutions',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'name',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'showWhiteboard',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'stateOfDebate',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'status',
								type: { kind: 'ENUM', name: 'CommitteestatusEnum', ofType: null, __proto__: null }
							},
							{
								name: 'statusHeadline',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'statusUntil',
								type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
							},
							{
								name: 'supportReEvaluationOpen',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'whiteboardContent',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateConference',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'hasModeratedCaucus',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'pressWebsite',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							},
							{
								name: 'resolutionFeatureEnabled',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'title',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateConferenceUser',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'committeeMemberId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'conferenceMemberId',
								type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
							},
							{
								name: 'conferenceUserType',
								type: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'ENUM',
										name: 'ConferenceusertypeEnum',
										ofType: null,
										__proto__: null
									}
								}
							},
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'updatePaperTitle',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'paperId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'title',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'updateSpeakerOnList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakeronlist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'overwriteName',
								type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'updateSpeakersList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakerslist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							},
							{
								name: 'isClosed',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'speakingTime',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							},
							{
								name: 'startTimestamp',
								type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
							},
							{
								name: 'stopTimer',
								type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
							},
							{
								name: 'timeLeft',
								type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
							}
						]
					},
					{
						name: 'withdrawAmendment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'amendmentId',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'Operativeclausevote',
				fields: [
					{
						name: 'clauseId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'outcome',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'ENUM', name: 'VoteoutcomeEnum', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'votesAbstain',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'votesAgainst',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'votesFor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'OperativeclausevoteOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'clauseId',
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
						name: 'outcome',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'votesAbstain',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'votesAgainst',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'votesFor',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'OperativeclausevoteWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'clauseId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'outcome',
						type: { kind: 'ENUM', name: 'VoteoutcomeEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'votesAbstain',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'votesAgainst',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'votesFor',
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
				name: 'Papercontentsnapshot',
				fields: [
					{
						name: 'content',
						type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'trigger',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PapercontentsnapshotOrderInputArgument',
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
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
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
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PapercontentsnapshotWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'content',
						type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'trigger',
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
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Papereditor',
				fields: [
					{
						name: 'conferenceUser',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceuserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceuserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceUserId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PapereditorOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceUser',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceUserId',
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
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
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
				name: 'PapereditorWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceUser',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceUserId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Papersharecode',
				fields: [
					{
						name: 'code',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'permission',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'ENUM',
								name: 'SharecodepermissionEnum',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PapersharecodeOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'code',
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
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'permission',
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
				name: 'PapersharecodeWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'code',
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
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'permission',
						type: { kind: 'ENUM', name: 'SharecodepermissionEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Papersponsor',
				fields: [
					{
						name: 'committeeMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committeeMemberId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PapersponsorOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMemberId',
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
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
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
				name: 'PapersponsorWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'PaperstatusEnum',
				enumValues: [
					{ name: 'AMENDMENT_PHASE' },
					{ name: 'DRAFT_RESOLUTION' },
					{ name: 'FINAL' },
					{ name: 'SUBMITTED' },
					{ name: 'VOTING_PHASE' },
					{ name: 'WORKING_PAPER' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Presencechangedtimestamp',
				fields: [
					{
						name: 'committeeMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committeeMemberId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'presentSetTo',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'timestamp',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'PresencechangedtimestampOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMemberId',
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
						name: 'presentSetTo',
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
				name: 'PresencechangedtimestampWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'presentSetTo',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'timestamp',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Query',
				fields: [
					{
						name: 'agendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Agendaitem', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'agendaItems',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Agendaitem', ofType: null, __proto__: null }
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
									name: 'AgendaitemOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AgendaitemWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'amendment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'amendmentSponsor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendmentsponsor', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'amendmentSponsors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Amendmentsponsor',
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
									name: 'AmendmentsponsorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentsponsorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'amendments',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
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
									name: 'AmendmentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentWhereInputArgument',
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
							ofType: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'committeeMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'committeeMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
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
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
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
									ofType: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null }
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
							ofType: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conferencemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Conferencemember',
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
									name: 'ConferencememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceUser',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceUsers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
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
									name: 'ConferenceuserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceuserWhereInputArgument',
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
									ofType: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null }
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
						name: 'currentUserClaims',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'UserClaims', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isGlobalAdmin',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'operativeClauseVote',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Operativeclausevote', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'operativeClauseVotes',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Operativeclausevote',
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
									name: 'OperativeclausevoteOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'OperativeclausevoteWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperContentSnapshot',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'OBJECT',
								name: 'Papercontentsnapshot',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paperContentSnapshots',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Papercontentsnapshot',
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
									name: 'PapercontentsnapshotOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapercontentsnapshotWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperEditor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Papereditor', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paperEditors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papereditor', ofType: null, __proto__: null }
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
									name: 'PapereditorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapereditorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperShareCode',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Papersharecode', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paperShareCodes',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papersharecode', ofType: null, __proto__: null }
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
									name: 'PapersharecodeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapersharecodeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperSponsor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Papersponsor', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paperSponsors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papersponsor', ofType: null, __proto__: null }
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
									name: 'PapersponsorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapersponsorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'presenceChangedTimestamp',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'OBJECT',
								name: 'Presencechangedtimestamp',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'presenceChangedTimestamps',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Presencechangedtimestamp',
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
									name: 'PresencechangedtimestampOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PresencechangedtimestampWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'representation',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Representation', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'representations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Representation', ofType: null, __proto__: null }
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
									name: 'RepresentationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RepresentationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'resolutionComment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutioncomment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'resolutionComments',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Resolutioncomment',
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
									name: 'ResolutioncommentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutioncommentWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'resolutionPaper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'resolutionPapers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
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
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'resolutionVoteResult',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'OBJECT',
								name: 'Resolutionvoteresult',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'resolutionVoteResults',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Resolutionvoteresult',
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
									name: 'ResolutionvoteresultOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionvoteresultWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'serverTime',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'speakerOnList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakeronlist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'speakerOnLists',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Speakeronlist', ofType: null, __proto__: null }
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
									name: 'SpeakeronlistOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SpeakeronlistWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'speakersList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakerslist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'speakersLists',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Speakerslist', ofType: null, __proto__: null }
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
									name: 'SpeakerslistOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SpeakerslistWhereInputArgument',
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
							ofType: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
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
									ofType: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null }
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
				kind: 'ENUM',
				name: 'RegionalgroupEnum',
				enumValues: [
					{ name: 'AFRICA' },
					{ name: 'ASIA_PACIFIC' },
					{ name: 'EASTERN_EUROPE' },
					{ name: 'LATIN_AMERICA_CARIBBEAN' },
					{ name: 'WESTERN_EUROPE_OTHERS' }
				]
			},
			{
				kind: 'OBJECT',
				name: 'Representation',
				fields: [
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
						name: 'committeeMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
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
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
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
							ofType: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null }
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'conferenceMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Conferencemember',
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
									name: 'ConferencememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencememberWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'faIcon',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'name',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'regionalGroup',
						type: { kind: 'ENUM', name: 'RegionalgroupEnum', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'type',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'ENUM',
								name: 'RepresentationtypeEnum',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'RepresentationOrderInputArgument',
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
						name: 'committeeMembers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conference',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceMembers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'faIcon',
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
						name: 'regionalGroup',
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
				name: 'RepresentationWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
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
						name: 'committeeMembers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberWhereInputArgument',
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
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceMembers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'faIcon',
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
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
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
						name: 'regionalGroup',
						type: { kind: 'ENUM', name: 'RegionalgroupEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'type',
						type: { kind: 'ENUM', name: 'RepresentationtypeEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'RepresentationtypeEnum',
				enumValues: [{ name: 'DELEGATION' }, { name: 'NSA' }, { name: 'UN' }]
			},
			{
				kind: 'OBJECT',
				name: 'Resolutioncomment',
				fields: [
					{
						name: 'author',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceuserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceuserWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'authorConferenceUserId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'clauseId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'content',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'parentComment',
						type: { kind: 'OBJECT', name: 'Resolutioncomment', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutioncommentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutioncommentWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'parentCommentId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'replies',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Resolutioncomment',
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
									name: 'ResolutioncommentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutioncommentWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'visibility',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'ENUM', name: 'CommentvisibilityEnum', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ResolutioncommentOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'author',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'authorConferenceUserId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'clauseId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
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
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'parentComment',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutioncommentOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'parentCommentId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'replies',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutioncommentOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'visibility',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ResolutioncommentWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'author',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'authorConferenceUserId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'clauseId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'content',
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
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'parentComment',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutioncommentWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'parentCommentId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'replies',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutioncommentWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'visibility',
						type: { kind: 'ENUM', name: 'CommentvisibilityEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Resolutionpaper',
				fields: [
					{
						name: 'agendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Agendaitem', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AgendaitemOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AgendaitemWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'agendaItemId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'amendments',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
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
									name: 'AmendmentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'comments',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Resolutioncomment',
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
									name: 'ResolutioncommentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutioncommentWhereInputArgument',
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
							ofType: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null }
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'content',
						type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'creator',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'creatorCommitteeMemberId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'deletedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'documentNumber',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'editors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papereditor', ofType: null, __proto__: null }
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
									name: 'PapereditorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapereditorWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'operativeClauseVotes',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Operativeclausevote',
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
									name: 'OperativeclausevoteOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'OperativeclausevoteWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'sequenceNumber',
						type: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'shareCodes',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papersharecode', ofType: null, __proto__: null }
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
									name: 'PapersharecodeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapersharecodeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'snapshots',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Papercontentsnapshot',
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
									name: 'PapercontentsnapshotOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapercontentsnapshotWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'sponsors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papersponsor', ofType: null, __proto__: null }
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
									name: 'PapersponsorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapersponsorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'status',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'ENUM', name: 'PaperstatusEnum', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'title',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'voteResult',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'OBJECT',
								name: 'Resolutionvoteresult',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionvoteresultOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionvoteresultWhereInputArgument',
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
				name: 'ResolutionpaperOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'agendaItem',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AgendaitemOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'agendaItemId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'amendments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'comments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutioncommentOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committee',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteeOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
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
						name: 'creator',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'creatorCommitteeMemberId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'deletedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'documentNumber',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'editors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapereditorOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'operativeClauseVotes',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'OperativeclausevoteOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sequenceNumber',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'shareCodes',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapersharecodeOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'snapshots',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapercontentsnapshotOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sponsors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapersponsorOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'status',
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
						name: 'voteResult',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionvoteresultOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ResolutionpaperWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'agendaItem',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AgendaitemWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'agendaItemId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'amendments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AmendmentWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'comments',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutioncommentWhereInputArgument',
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
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'content',
						type: { kind: 'SCALAR', name: 'JSON', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'creator',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'creatorCommitteeMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'deletedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'documentNumber',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'editors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapereditorWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'operativeClauseVotes',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'OperativeclausevoteWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sequenceNumber',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'shareCodes',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapersharecodeWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'snapshots',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapercontentsnapshotWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'sponsors',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'PapersponsorWhereInputArgument',
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
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'voteResult',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionvoteresultWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Resolutionvoteresult',
				fields: [
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'outcome',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'ENUM', name: 'VoteoutcomeEnum', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'paper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'votesAbstain',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'votesAgainst',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'votesFor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ResolutionvoteresultOrderInputArgument',
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
						name: 'outcome',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'votesAbstain',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'votesAgainst',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'votesFor',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'ResolutionvoteresultWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'outcome',
						type: { kind: 'ENUM', name: 'VoteoutcomeEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'paper',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ResolutionpaperWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'paperId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'votesAbstain',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'votesAgainst',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'votesFor',
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
				name: 'ShareCodeRedemptionResult',
				fields: [
					{
						name: 'paperId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'permission',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'ENUM',
				name: 'SharecodepermissionEnum',
				enumValues: [{ name: 'EDIT' }, { name: 'SPONSOR' }]
			},
			{ kind: 'ENUM', name: 'SortingParameter', enumValues: [{ name: 'asc' }, { name: 'desc' }] },
			{
				kind: 'OBJECT',
				name: 'Speakeronlist',
				fields: [
					{
						name: 'committeeMember',
						type: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'committeeMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'conferenceMember',
						type: { kind: 'OBJECT', name: 'Conferencemember', ofType: null, __proto__: null },
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'overwriteName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'position',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'speakersList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakerslist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SpeakerslistOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SpeakerslistWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'speakersListId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SpeakeronlistOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMemberId',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencememberOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceMemberId',
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
						name: 'overwriteName',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'position',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'speakersList',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SpeakerslistOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'speakersListId',
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
				name: 'SpeakeronlistWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'committeeMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'CommitteememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'committeeMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'conferenceMember',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferencememberWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'conferenceMemberId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'overwriteName',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'StringWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'position',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'speakersList',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SpeakerslistWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'speakersListId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'OBJECT',
				name: 'Speakerslist',
				fields: [
					{
						name: 'agendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Agendaitem', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'orderBy',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AgendaitemOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AgendaitemWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'agendaItemId',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'createdAt',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'isClosed',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'speakers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Speakeronlist', ofType: null, __proto__: null }
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
									name: 'SpeakeronlistOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SpeakeronlistWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'speakingTime',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'startTimestamp',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'timeLeft',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'Int', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'type',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'ENUM',
								name: 'SpeakerslistcategoryEnum',
								ofType: null,
								__proto__: null
							}
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'INPUT_OBJECT',
				name: 'SpeakerslistOrderInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'agendaItem',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AgendaitemOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'agendaItemId',
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
						name: 'isClosed',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'speakers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SpeakeronlistOrderInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'speakingTime',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'startTimestamp',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'timeLeft',
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
				name: 'SpeakerslistWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'agendaItem',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'AgendaitemWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'agendaItemId',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'isClosed',
						type: { kind: 'SCALAR', name: 'Boolean', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'speakers',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'SpeakeronlistWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'speakingTime',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'startTimestamp',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'timeLeft',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'IntWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'type',
						type: { kind: 'ENUM', name: 'SpeakerslistcategoryEnum', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'SpeakerslistcategoryEnum',
				enumValues: [{ name: 'COMMENT_LIST' }, { name: 'SPEAKERS_LIST' }]
			},
			{ kind: 'SCALAR', name: 'String' },
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
									kind: 'INPUT_OBJECT',
									name: 'StringWhereInputArgument',
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
									kind: 'INPUT_OBJECT',
									name: 'StringWhereInputArgument',
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
								ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
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
								ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
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
						name: 'agendaItem',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Agendaitem', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'agendaItems',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Agendaitem', ofType: null, __proto__: null }
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
									name: 'AgendaitemOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AgendaitemWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'amendment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'amendmentSponsor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Amendmentsponsor', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'amendmentSponsors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Amendmentsponsor',
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
									name: 'AmendmentsponsorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentsponsorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'amendments',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Amendment', ofType: null, __proto__: null }
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
									name: 'AmendmentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'AmendmentWhereInputArgument',
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
							ofType: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'committeeMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'committeeMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Committeemember', ofType: null, __proto__: null }
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
									name: 'CommitteememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'CommitteememberWhereInputArgument',
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
									ofType: { kind: 'OBJECT', name: 'Committee', ofType: null, __proto__: null }
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
							ofType: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceMember',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conferencemember', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceMembers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Conferencemember',
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
									name: 'ConferencememberOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferencememberWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'conferenceUser',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'conferenceUsers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
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
									name: 'ConferenceuserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceuserWhereInputArgument',
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
									ofType: { kind: 'OBJECT', name: 'Conference', ofType: null, __proto__: null }
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
						name: 'operativeClauseVote',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Operativeclausevote', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'operativeClauseVotes',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Operativeclausevote',
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
									name: 'OperativeclausevoteOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'OperativeclausevoteWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperContentSnapshot',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'OBJECT',
								name: 'Papercontentsnapshot',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paperContentSnapshots',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Papercontentsnapshot',
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
									name: 'PapercontentsnapshotOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapercontentsnapshotWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperEditor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Papereditor', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paperEditors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papereditor', ofType: null, __proto__: null }
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
									name: 'PapereditorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapereditorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperShareCode',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Papersharecode', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paperShareCodes',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papersharecode', ofType: null, __proto__: null }
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
									name: 'PapersharecodeOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapersharecodeWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'paperSponsor',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Papersponsor', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'paperSponsors',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Papersponsor', ofType: null, __proto__: null }
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
									name: 'PapersponsorOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PapersponsorWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'presenceChangedTimestamp',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'OBJECT',
								name: 'Presencechangedtimestamp',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'presenceChangedTimestamps',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Presencechangedtimestamp',
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
									name: 'PresencechangedtimestampOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'PresencechangedtimestampWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'representation',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Representation', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'representations',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Representation', ofType: null, __proto__: null }
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
									name: 'RepresentationOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'RepresentationWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'resolutionComment',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutioncomment', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'resolutionComments',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Resolutioncomment',
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
									name: 'ResolutioncommentOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutioncommentWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'resolutionPaper',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'resolutionPapers',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Resolutionpaper', ofType: null, __proto__: null }
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
									name: 'ResolutionpaperOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionpaperWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'resolutionVoteResult',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'OBJECT',
								name: 'Resolutionvoteresult',
								ofType: null,
								__proto__: null
							}
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'resolutionVoteResults',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: {
										kind: 'OBJECT',
										name: 'Resolutionvoteresult',
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
									name: 'ResolutionvoteresultOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ResolutionvoteresultWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'speakerOnList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakeronlist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'speakerOnLists',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Speakeronlist', ofType: null, __proto__: null }
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
									name: 'SpeakeronlistOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SpeakeronlistWhereInputArgument',
									ofType: null,
									__proto__: null
								}
							}
						]
					},
					{
						name: 'speakersList',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'OBJECT', name: 'Speakerslist', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
								}
							}
						]
					},
					{
						name: 'speakersLists',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Speakerslist', ofType: null, __proto__: null }
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
									name: 'SpeakerslistOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'SpeakerslistWhereInputArgument',
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
							ofType: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null }
						},
						args: [
							{
								name: 'id',
								type: {
									kind: 'NON_NULL',
									ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
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
									ofType: { kind: 'OBJECT', name: 'User', ofType: null, __proto__: null }
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
				kind: 'OBJECT',
				name: 'User',
				fields: [
					{
						name: 'conferenceMemberships',
						type: {
							kind: 'NON_NULL',
							ofType: {
								kind: 'LIST',
								ofType: {
									kind: 'NON_NULL',
									ofType: { kind: 'OBJECT', name: 'Conferenceuser', ofType: null, __proto__: null }
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
									name: 'ConferenceuserOrderInputArgument',
									ofType: null,
									__proto__: null
								}
							},
							{
								name: 'where',
								type: {
									kind: 'INPUT_OBJECT',
									name: 'ConferenceuserWhereInputArgument',
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
							ofType: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'email',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'familyName',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'givenName',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'locale',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'preferredUsername',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'updatedAt',
						type: { kind: 'SCALAR', name: 'DateTime', ofType: null, __proto__: null },
						args: []
					}
				],
				interfaces: []
			},
			{
				kind: 'OBJECT',
				name: 'UserClaims',
				fields: [
					{
						name: 'email',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'familyName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'givenName',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'id',
						type: {
							kind: 'NON_NULL',
							ofType: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null }
						},
						args: []
					},
					{
						name: 'locale',
						type: { kind: 'SCALAR', name: 'String', ofType: null, __proto__: null },
						args: []
					},
					{
						name: 'preferredUsername',
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
						name: 'conferenceMemberships',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserOrderInputArgument',
							ofType: null,
							__proto__: null
						},
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
						name: 'familyName',
						type: { kind: 'ENUM', name: 'SortingParameter', ofType: null, __proto__: null },
						defaultValue: void 0
					},
					{
						name: 'givenName',
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
						name: 'preferredUsername',
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
				name: 'UserWhereInputArgument',
				isOneOf: void 0,
				inputFields: [
					{
						name: 'conferenceMemberships',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'ConferenceuserWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					},
					{
						name: 'createdAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
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
						name: 'id',
						type: { kind: 'SCALAR', name: 'ID', ofType: null, __proto__: null },
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
						name: 'updatedAt',
						type: {
							kind: 'INPUT_OBJECT',
							name: 'DateWhereInputArgument',
							ofType: null,
							__proto__: null
						},
						defaultValue: void 0
					}
				]
			},
			{
				kind: 'ENUM',
				name: 'VoteoutcomeEnum',
				enumValues: [{ name: 'ADOPTED' }, { name: 'REJECTED' }, { name: 'SENT_BACK' }]
			}
		],
		directives: []
	}
} as IntrospectionQuery;

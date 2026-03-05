import type { INodeProperties } from 'n8n-workflow';
import { streamsGetStatusDescription } from './getStatus';

const showOnlyForStreams = {
	resource: ['streams'],
};

export const streamsDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForStreams,
		},
		options: [
			{
				name: 'Get Transcript Status',
				value: 'getStatus',
				action: 'Get transcript status',
				description: 'Retrieve the status of a transcription stream by its ID',
			},
		],
		default: 'getStatus',
	},
	...streamsGetStatusDescription,
];


import type { INodeProperties } from 'n8n-workflow';

const showOnlyForStreamsGetStatus = {
	resource: ['streams'],
	operation: ['getStatus'],
};

export const streamsGetStatusDescription: INodeProperties[] = [
	{
		displayName: 'Stream ID',
		name: 'streamId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForStreamsGetStatus,
		},
		description: 'The ID of the stream whose transcription status you want to retrieve',
	},
];


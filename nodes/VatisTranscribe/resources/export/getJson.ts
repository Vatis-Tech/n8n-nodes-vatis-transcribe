import type { INodeProperties } from 'n8n-workflow';

const showOnlyForExportGetJson = {
	resource: ['export'],
	operation: ['getJson'],
};

export const exportGetJsonDescription: INodeProperties[] = [
	{
		displayName: 'Stream ID',
		name: 'streamId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForExportGetJson,
		},
		description:
			'The ID of the stream whose transcription JSON you want to export. Typically comes from the Create Transcript node.',
	},
];


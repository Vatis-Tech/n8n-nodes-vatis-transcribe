import type { INodeProperties } from 'n8n-workflow';
import { exportGetJsonDescription } from './getJson';

const showOnlyForExport = {
	resource: ['export'],
};

export const exportDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForExport,
		},
		options: [
			{
				name: 'Get Transcript JSON',
				value: 'getJson',
				action: 'Get transcript JSON',
				description: 'Export the full transcription and intelligence JSON for a given stream ID',
			},
		],
		default: 'getJson',
	},
	...exportGetJsonDescription,
];


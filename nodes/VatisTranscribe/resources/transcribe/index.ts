import type { INodeProperties } from 'n8n-workflow';
import { transcribeCreateDescription } from './create';

const showOnlyForTranscribe = {
	resource: ['transcribe'],
};

export const transcribeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForTranscribe,
		},
		options: [
			{
				name: 'Create Transcript',
				value: 'create',
				action: 'Create transcript',
				description: 'Create a new transcript',
			},
		],
		default: 'create',
	},
	...transcribeCreateDescription,
];


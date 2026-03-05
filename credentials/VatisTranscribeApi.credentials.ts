import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class VatisTranscribeApi implements ICredentialType {
	name = 'vatisTranscribeApi';

	displayName = 'Vatis Transcribe API';

	icon = 'file:vatisTranscribe.svg' as const;

	// Link to your community node's README
	documentationUrl = 'https://docs.vatis.tech/get-started/get-api-access';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Basic {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			baseURL: 'https://stream-service.vatis.tech',
			url: '/stream-service/api/v1/streams',
			qs: {
				size: 1,
			},
		},
	};
}

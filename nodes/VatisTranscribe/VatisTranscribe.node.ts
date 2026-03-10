import { NodeConnectionTypes, NodeOperationError, type IDataObject, type IExecuteFunctions, type IHttpRequestOptions, type INodeExecutionData, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { randomUUID } from 'crypto';
import { transcribeDescription } from './resources/transcribe';
import { streamsDescription } from './resources/streams';
import { exportDescription } from './resources/export';

export class VatisTranscribe implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Vatis Transcribe',
		name: 'vatisTranscribe',
		icon: { light: 'file:vatisTranscribe.svg', dark: 'file:vatisTranscribe.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Vatis Transcribe API',
		defaults: {
			name: 'Vatis Transcribe',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'vatisTranscribeApi', required: true }],
		// requestDefaults: {
		// 	baseURL: 'https://docs.vatis.tech',
		// 	headers: {
		// 		Accept: 'application/json',
		// 		'Content-Type': 'application/json',
		// 	},
		// },
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Export',
						value: 'export',
					},
					{
						name: 'Stream',
						value: 'streams',
					},
					{
						name: 'Transcribe',
						value: 'transcribe',
					},
					// {
					// 	name: 'Usage',
					// 	value: 'usage',
					// },
					// {
					// 	name: 'Webhook',
					// 	value: 'webhooks',
					// },
				],
				default: 'transcribe',
			},
			...transcribeDescription,
			...streamsDescription,
			...exportDescription,
		],
	};

	async execute(this: IExecuteFunctions) {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			if (resource === 'transcribe' && operation === 'create') {
				const languages = (this.getNodeParameter('audioLanguageGroup.languages', i, []) as string[]) || [];
				const languageCodes = languages.filter((code) => code !== 'auto');
				const useDedicatedRomanianModel = this.getNodeParameter(
					'audioLanguageGroup.useDedicatedRomanianModel',
					i,
					false,
				) as boolean;
				const diarizationMode = this.getNodeParameter('diarization.diarizationMode', i, 'none') as string;

				const onlyRomanian = Array.isArray(languages) && languages.length === 1 && languages[0] === 'ro';
				const speakersChecked = diarizationMode === 'speakers';

				let streamConfigurationTemplateId: string;

				if (onlyRomanian && useDedicatedRomanianModel) {
					if (speakersChecked) {
						streamConfigurationTemplateId = '678e375095f8f5742e8718f5';
					} else {
						streamConfigurationTemplateId = '678e26e695f8f5742e8718f4';
					}
				} else {
					if (speakersChecked) {
						streamConfigurationTemplateId = '669fee048452492b62cfad39';
					} else {
						streamConfigurationTemplateId = '668115d123bca7e3509723d4';
					}
				}

				const streamId = randomUUID();

				const mediaSource = this.getNodeParameter('mediaSource', i) as string;

				const qs: IDataObject = {
					streamConfigurationTemplateId,
					id: streamId,
					persist: 'true',
				};

				// Voice Activity Detection mapping (skip when dedicated Romanian model is used)
				if (!(onlyRomanian && useDedicatedRomanianModel)) {
					const voiceActivityDetection = (this.getNodeParameter(
						'voiceActivityDetection',
						i,
						{},
					) as IDataObject) || {};

					const vad = voiceActivityDetection.vad as boolean | undefined;
					const noSpeechThreshold = voiceActivityDetection.noSpeechThreshold as number | undefined;

					if (vad !== undefined) {
						qs.vad = vad ? 'true' : 'false';
					}

					if (vad && noSpeechThreshold !== undefined) {
						qs.noSpeechThreshold = noSpeechThreshold;
					}
				}

				// Diarization mapping
				switch (diarizationMode) {
					case 'channel': {
						qs.splitStereo = 'true';
						break;
					}
					case 'speakers': {
						const diarization = (this.getNodeParameter('diarization', i, {}) as IDataObject) || {};
						const diarizationOptions = (diarization.diarizationOptions as IDataObject) || {};

						const speakersNumber = diarizationOptions.speakersNumber as number | undefined;
						const minSpeakersNumber = diarizationOptions.minSpeakersNumber as number | undefined;
						const maxSpeakersNumber = diarizationOptions.maxSpeakersNumber as number | undefined;

						if (speakersNumber && speakersNumber > 0) {
							qs.speakersNumber = speakersNumber;
						}

						if (minSpeakersNumber && minSpeakersNumber > 0) {
							qs.minSpeakersNumber = minSpeakersNumber;
						}

						if (maxSpeakersNumber && maxSpeakersNumber > 0) {
							qs.maxSpeakersNumber = maxSpeakersNumber;
						}
						break;
					}
					case 'none':
					default:
						// No diarization requested; do not set diarization-related query parameters
						break;
				}

				// Audio intelligence mapping
				const audioIntelligence = (this.getNodeParameter('audioIntelligence', i, {}) as IDataObject) || {};

				const sentimentAnalysis = audioIntelligence.sentimentAnalysis as boolean | undefined;
				const summary = audioIntelligence.summary as boolean | undefined;
				const enhancedTranscription = audioIntelligence.enhancedTranscription as boolean | undefined;
				const etModel = audioIntelligence.etModel as string | undefined;
				const etVocabularyRaw = audioIntelligence.etVocabulary as string | undefined;
				const etSystemPrompt = audioIntelligence.etSystemPrompt as string | undefined;

				if (enhancedTranscription !== undefined) {
					qs.enhancedTranscription = enhancedTranscription ? 'true' : 'false';

					if (enhancedTranscription) {
						if (etModel) {
							qs.etModel = etModel;
						}

						if (etVocabularyRaw) {
							const etVocabulary = etVocabularyRaw
								.split(/[\n,]/)
								.map((entry) => entry.trim())
								.filter((entry) => entry.length > 0);

							if (etVocabulary.length > 0) {
								qs.etVocabulary = etVocabulary.join(',');
							}
						}

						if (etSystemPrompt) {
							qs.etSystemPrompt = etSystemPrompt;
						}
					}
				}

				if (sentimentAnalysis !== undefined) {
					qs.sentimentAnalysis = sentimentAnalysis ? 'true' : 'false';
				}

				if (summary !== undefined) {
					qs.summary = summary ? 'true' : 'false';

					if (summary) {
						const summarySettings = (audioIntelligence.summarySettings as IDataObject) || {};
						const summaryTone = summarySettings.summaryTone as string | undefined;
						const summaryLength = summarySettings.summaryLength as string | undefined;
						const summaryStructure = summarySettings.summaryStructure as string | undefined;

						if (summaryTone) {
							qs.summaryTone = summaryTone;
						}
						if (summaryLength) {
							qs.summaryLength = summaryLength;
						}
						if (summaryStructure) {
							qs.summaryStructure = summaryStructure;
						}
					}
				}

				// Custom prompts mapping (ask0, ask0System, ask0Id, ask0Format, etc.)
				const customPrompts = (audioIntelligence.customPrompts as IDataObject) || {};
				const prompts = (customPrompts.prompt as IDataObject[]) || [];

				prompts.forEach((prompt, index) => {
					const promptId = prompt.promptId as string | undefined;
					const query = prompt.query as string | undefined;
					const systemPrompt = prompt.systemPrompt as string | undefined;
					const format = prompt.format as string | undefined;

					if (query) {
						qs[`ask${index}`] = query;
					}
					if (systemPrompt) {
						qs[`ask${index}System`] = systemPrompt;
					}
					if (promptId) {
						qs[`ask${index}Id`] = promptId;
					}
					if (format) {
						qs[`ask${index}Format`] = format;
					}
				});

				// Build query string manually to support repeated `language` parameters
				const baseUrl = 'https://http-gateway.vatis.tech/http-gateway/api/v1/upload';
				const queryParts: string[] = [];

				for (const [key, value] of Object.entries(qs)) {
					if (value === undefined) continue;
					queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
				}

				// Add language parameters: language=en&language=es
				// Skip sending language when using the dedicated Romanian model,
				// as the configuration template already handles it and the gateway
				// forbids a `/language` patch in this case.
				if (languageCodes.length > 0 && !(onlyRomanian && useDedicatedRomanianModel)) {
					for (const code of languageCodes) {
						queryParts.push(`language=${encodeURIComponent(code)}`);
					}
				}

				const url =
					queryParts.length > 0 ? `${baseUrl}?${queryParts.join('&')}` : baseUrl;

				const requestOptions: IHttpRequestOptions = {
					method: 'POST',
					url,
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/octet-stream',
					},
					body: undefined,
					json: true,
				};

				if (mediaSource === 'url') {
					const mediaUrl = this.getNodeParameter('mediaUrl', i) as string;
					requestOptions.body = mediaUrl;
				} else {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const item = items[i];

					if (!item.binary?.[binaryPropertyName]) {
						throw new NodeOperationError(
							this.getNode(),
							`Binary property "${binaryPropertyName}" does not exist on input item`,
							{ itemIndex: i },
						);
					}

					const binaryData = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					requestOptions.body = binaryData;
				}

				let responseData;

				try {
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'vatisTranscribeApi',
						requestOptions,
					);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
				}

				returnData.push({
					json: {
						streamId,
						streamConfigurationTemplateId,
						uploadResponse: responseData,
					},
					pairedItem: {
						item: i,
					},
				});
				continue;
			}

			if (resource === 'streams' && operation === 'getStatus') {
				const streamId = this.getNodeParameter('streamId', i) as string;

				const requestOptions: IHttpRequestOptions = {
					method: 'GET',
					url: `https://stream-service.vatis.tech/stream-service/api/v1/streams/${streamId}`,
					headers: {
						Accept: 'application/json',
					},
					json: true,
				};

				let responseData;

				try {
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'vatisTranscribeApi',
						requestOptions,
					);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
				}

				returnData.push({
					json: responseData as IDataObject,
					pairedItem: {
						item: i,
					},
				});
				continue;
			}

			if (resource === 'export' && operation === 'getJson') {
				const streamId = this.getNodeParameter('streamId', i) as string;

				const requestOptions: IHttpRequestOptions = {
					method: 'GET',
					url: 'https://export-service.vatis.tech/export-service/api/v1/export/JSON',
					qs: {
						streams: streamId,
					},
					headers: {
						Accept: 'application/json',
					},
					json: true,
				};

				let responseData;

				try {
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'vatisTranscribeApi',
						requestOptions,
					);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
				}

				returnData.push({
					json: responseData as IDataObject,
					pairedItem: {
						item: i,
					},
				});
				continue;
			}

			returnData.push(items[i]);
		}

		return this.prepareOutputData(returnData);
	}
}

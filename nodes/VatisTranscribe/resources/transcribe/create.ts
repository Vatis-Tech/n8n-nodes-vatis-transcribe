import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTranscribeCreate = {
	resource: ['transcribe'],
	operation: ['create'],
};

export const transcribeCreateDescription: INodeProperties[] = [
	{
		displayName: 'Media Source',
		name: 'mediaSource',
		type: 'options',
		displayOptions: {
			show: showOnlyForTranscribeCreate,
		},
		options: [
			{
				name: 'Public URL',
				value: 'url',
				description: 'Use a public HTTP or HTTPS media URL (audio or video)',
			},
			{
				name: 'File (Binary)',
				value: 'binary',
				description: 'Use binary data from a previous node (audio or video)',
			},
		],
		default: 'url',
		description:
			'Choose whether to transcribe from a public media URL or from binary file data provided by a previous node',
	},
	{
		displayName: 'Media URL',
		name: 'mediaUrl',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForTranscribeCreate,
				mediaSource: ['url'],
			},
		},
		typeOptions: {
			url: true,
		},
		default: '',
		placeholder: 'https://example.com/audio-or-video-file',
		description: 'Public HTTP or HTTPS URL to the media file (audio or video)',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForTranscribeCreate,
				mediaSource: ['binary'],
			},
		},
		default: 'data',
		description:
			'Name of the binary property that contains the media file (audio or video) from a previous node',
	},
	{
		displayName: 'Audio Language',
		name: 'audioLanguageGroup',
		type: 'collection',
		placeholder: 'Configure audio language',
		displayOptions: {
			show: showOnlyForTranscribeCreate,
		},
		default: {},
		options: [
			{
				displayName: 'Languages',
				name: 'languages',
				type: 'multiOptions',
				default: [],
				description:
					'Languages of the audio to be transcribed into. Leave empty to automatically detect the language.',
				options: [
					{
						name: 'Arabic',
						value: 'ar',
					},
					{
						name: 'Auto Detect',
						value: 'auto',
					},
					{
						name: 'Azerbaijani',
						value: 'az',
					},
					{
						name: 'Bosnian',
						value: 'bs',
					},
					{
						name: 'Bulgarian',
						value: 'bg',
					},
					{
						name: 'Cantonese',
						value: 'yue',
					},
					{
						name: 'Catalan',
						value: 'ca',
					},
					{
						name: 'Chinese',
						value: 'zh',
					},
					{
						name: 'Croatian',
						value: 'hr',
					},
					{
						name: 'Czech',
						value: 'cs',
					},
					{
						name: 'Danish',
						value: 'da',
					},
					{
						name: 'Dutch',
						value: 'nl',
					},
					{
						name: 'English',
						value: 'en',
					},
					{
						name: 'Estonian',
						value: 'et',
					},
					{
						name: 'Finnish',
						value: 'fi',
					},
					{
						name: 'French',
						value: 'fr',
					},
					{
						name: 'Galician',
						value: 'gl',
					},
					{
						name: 'German',
						value: 'de',
					},
					{
						name: 'Greek',
						value: 'el',
					},
					{
						name: 'Hebrew',
						value: 'he',
					},
					{
						name: 'Hindi',
						value: 'hi',
					},
					{
						name: 'Hungarian',
						value: 'hu',
					},
					{
						name: 'Indonesian',
						value: 'id',
					},
					{
						name: 'Italian',
						value: 'it',
					},
					{
						name: 'Japanese',
						value: 'ja',
					},
					{
						name: 'Korean',
						value: 'ko',
					},
					{
						name: 'Latvian',
						value: 'lv',
					},
					{
						name: 'Lithuanian',
						value: 'lt',
					},
					{
						name: 'Macedonian',
						value: 'mk',
					},
					{
						name: 'Malay',
						value: 'ms',
					},
					{
						name: 'Norwegian',
						value: 'no',
					},
					{
						name: 'Polish',
						value: 'pl',
					},
					{
						name: 'Portuguese',
						value: 'pt',
					},
					{
						name: 'Romanian',
						value: 'ro',
					},
					{
						name: 'Russian',
						value: 'ru',
					},
					{
						name: 'Serbian',
						value: 'sr',
					},
					{
						name: 'Slovak',
						value: 'sk',
					},
					{
						name: 'Slovenian',
						value: 'sl',
					},
					{
						name: 'Spanish',
						value: 'es',
					},
					{
						name: 'Swedish',
						value: 'sv',
					},
					{
						name: 'Thai',
						value: 'th',
					},
					{
						name: 'Tristan-Da-Cunha',
						value: 'sh',
					},
					{
						name: 'Turkish',
						value: 'tr',
					},
					{
						name: 'Ukrainian',
						value: 'uk',
					},
					{
						name: 'Urdu',
						value: 'ur',
					},
					{
						name: 'Vietnamese',
						value: 'vi',
					},
				],
			},
			{
				displayName: 'Description',
				name: 'languagesDescription',
				type: 'hidden',
				default: '',
				description:
					'When left empty, the language is automatically detected. When specific languages are selected, transcription will be optimized for those. Auto detect is recommended when you are unsure which language is used.',
			},
			{
				displayName: 'Use Dedicated Romanian Model',
				name: 'useDedicatedRomanianModel',
				type: 'boolean',
				default: false,
				description:
					'Whether to use the dedicated Romanian model. When enabled and the audio language is Romanian, a dedicated Romanian model will be used for transcription. Voice Activity Detection settings are not applicable in this mode.',
			},
		],
	},
	{
		displayName: 'Voice Activity Detection',
		name: 'voiceActivityDetection',
		type: 'collection',
		placeholder: 'Configure voice activity detection',
		displayOptions: {
			show: showOnlyForTranscribeCreate,
		},
		default: {},
		options: [
			{
				displayName: 'Voice Activity Detection',
				name: 'vad',
				type: 'boolean',
				default: true,
				description:
					'Whether to enable Voice Activity Detection. When enabled, the system will automatically detect and process speech, filtering out background noise and improving the clarity and efficiency of audio input.',
			},
			{
				displayName: 'No Speech Threshold',
				name: 'noSpeechThreshold',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					step: 0.05,
				},
				default: 0.5,
				displayOptions: {
					show: {
						vad: [true],
					},
				},
				description:
					'The threshold value to consider a segment as a speech segment. The value ranges from 0 to 1.',
			},
		],
	},
	{
		displayName: 'Diarization',
		name: 'diarization',
		type: 'collection',
		placeholder: 'Configure diarization',
		displayOptions: {
			show: showOnlyForTranscribeCreate,
		},
		default: {},
		options: [
			{
				displayName: 'Mode',
				name: 'diarizationMode',
				type: 'options',
				default: 'none',
				options: [
					{
						name: 'No Diarization',
						value: 'none',
						description: 'Do not perform diarization. The transcript will not be split by speakers or channels.',
					},
					{
						name: 'Speakers',
						value: 'speakers',
						description: 'Perform speaker identifying on the audio and link each segment of transcribed text to the corresponding speaker',
					},
					{
						name: 'Channel',
						value: 'channel',
						description:
							'Choose this option if your uploaded file has stereo audio (two channels) and you want the transcription split by each channel. Note: This option is not available with Speakers Diarization.',
					},
				],
			},
			{
				displayName: 'Diarization Options',
				name: 'diarizationOptions',
				type: 'collection',
				placeholder: 'Configure diarization options',
				displayOptions: {
					show: {
						diarizationMode: ['speakers'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Speakers Number',
						name: 'speakersNumber',
						type: 'number',
						default: 0,
						placeholder: '# of speakers',
						description:
							'The number of speakers to diarize the audio to. When not specified, it is automatically detected.',
					},
					{
						displayName: 'Minimum Speakers Number',
						name: 'minSpeakersNumber',
						type: 'number',
						default: 0,
						placeholder: 'Min. # of speakers',
						description: 'The minimum number of speakers to diarize the audio to',
					},
					{
						displayName: 'Maximum Speakers Number',
						name: 'maxSpeakersNumber',
						type: 'number',
						default: 0,
						placeholder: 'Max. # of speakers',
						description: 'The maximum number of speakers to diarize the audio to',
					},
				],
			},
		],
	},
	{
		displayName: 'Audio Intelligence',
		name: 'audioIntelligence',
		type: 'collection',
		placeholder: 'Configure audio intelligence',
		displayOptions: {
			show: showOnlyForTranscribeCreate,
		},
		default: {},
		options: [
			{
				displayName: 'Custom Prompts',
				name: 'customPrompts',
				type: 'fixedCollection',
				placeholder: 'Add custom prompt',
				description: 'Define up to three custom prompts that will be mapped to the ask0, ask1, … slots of the API',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						displayName: 'Prompt',
						name: 'prompt',
						values: [
							{
								displayName: 'Prompt ID',
								name: 'promptId',
								type: 'string',
								default: '',
								placeholder: 'Custom_prompt_id_1',
								description:
									'Identifier for this prompt. When unspecified, the API will fallback on the index of the slot (e.g. "0", "1").',
							},
							{
								displayName: 'Query',
								name: 'query',
								type: 'string',
								typeOptions: {
									rows: 4,
								},
								default: '',
								description:
									'The specific question or request you want to ask the audio intelligence system. This input defines the focus of the analysis or information extraction from the audio. Example: I need you to analyze a given transcript and determine if it consists of lyrics from a song or regular speech.',
							},
							{
								displayName: 'System Prompt',
								name: 'systemPrompt',
								type: 'string',
								typeOptions: {
									rows: 3,
								},
								default: '',
								description:
									'A predefined instruction or context provided to guide the behavior of the audio intelligence system. Example: You are a helpful assistant that analyzes text transcripts to check if they are lyrics from music or not.',
							},
							{
								displayName: 'Format',
								name: 'format',
								type: 'string',
								typeOptions: {
									rows: 3,
								},
								default: '',
								description:
									'The desired JSON format for the output as a JSON Schema string. Example: {"properties":{"music":{"title":"Music","type":"boolean"}},"required":["music"],"title":"Music","type":"object"}.',
							},
						],
					},
				],
			},
			{
				displayName: 'Enable Enhanced Transcription',
				name: 'enhancedTranscription',
				type: 'boolean',
				default: false,
				description: 'Whether to enable transcription enhancement for improved accuracy',
			},
			{
				displayName: 'Enable Sentiment Analysis',
				name: 'sentimentAnalysis',
				type: 'boolean',
				default: false,
				description:
					'Whether to perform sentiment analysis on the transcript. The sentiment can be "positive", "negative", "neutral", or other emotional tones like "anger", "joy", or "sadness".',
			},
			{
				displayName: 'Enable Summary',
				name: 'summary',
				type: 'boolean',
				default: false,
				description: 'Whether to generate a summary of the transcript',
			},
			{
				displayName: 'Enhanced System Prompt',
				name: 'etSystemPrompt',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				displayOptions: {
					show: {
						enhancedTranscription: [true],
					},
				},
				default: '',
				description:
					'System prompt to guide the transcription enhancement model. This can help the model understand the context or specific requirements for the transcription.',
			},
			{
				displayName: 'Enhanced Transcription Model',
				name: 'etModel',
				type: 'options',
				displayOptions: {
					show: {
						enhancedTranscription: [true],
					},
				},
				options: [
					{
						name: 'Standard',
						value: 'standard',
					},
					{
						name: 'Enhanced',
						value: 'enhanced',
					},
				],
				default: 'standard',
				description: 'Balance the speed-accuracy ratio of the transcription enhancement model',
			},
			{
				displayName: 'Enhanced Vocabulary',
				name: 'etVocabulary',
				type: 'string',
				typeOptions: {
					multipleLine: true,
				},
				displayOptions: {
					show: {
						enhancedTranscription: [true],
					},
				},
				default: '',
				description:
					'List of words to enhance the transcription with, separated by commas or new lines. These can be domain-specific terms that the model should pay special attention to.',
			},
			{
				displayName: 'Summary Settings',
				name: 'summarySettings',
				type: 'collection',
				placeholder: 'Configure summary settings',
				displayOptions: {
					show: {
						summary: [true],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Summary Helper',
						name: 'summaryHelper',
						type: 'hidden',
						default: '',
						description:
							'Tweak the settings for your summary below. Vatis will remember these settings for you the next time you summarise a transcript.',
					},
					{
						displayName: 'Tone of Voice',
						name: 'summaryTone',
						type: 'options',
						default: 'conversational',
						options: [
							{
								name: 'Conversation',
								value: 'conversational',
							},
							{
								name: 'Informative',
								value: 'informative',
							},
						],
					},
					{
						displayName: 'Summary Length',
						name: 'summaryLength',
						type: 'options',
						default: 'brief',
						options: [
							{
								name: 'Brief',
								value: 'brief',
							},
							{
								name: 'Detailed',
								value: 'detailed',
							},
						],
					},
					{
						displayName: 'Summary Format',
						name: 'summaryStructure',
						type: 'options',
						default: 'paragraphs',
						options: [
							{
								name: 'Bullet Points',
								value: 'bullet_points',
							},
							{
								name: 'Paragraphs',
								value: 'paragraphs',
							},
						],
					},
				],
			},
		],
	},
];


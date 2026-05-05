# n8n-nodes-vatis-transcribe

This is an n8n community node package for **[Vatis Transcribe](https://docs.vatis.tech/introduction)**. It lets you send audio or video for transcription, poll processing status, and download structured transcript JSON directly from your n8n workflows.

[Vatis](https://docs.vatis.tech/introduction) provides speech-to-text and related audio intelligence features via HTTP APIs. This node wraps the upload, stream status, and JSON export endpoints so you do not have to build raw HTTP requests yourself.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

[Installation](#installation) · [Operations](#operations) · [Credentials](#credentials) · [Compatibility](#compatibility) · [Usage](#usage) · [Resources](#resources) · [Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

In short: open **Settings → Community nodes**, enter `n8n-nodes-vatis-transcribe`, and install the package (or use the CLI flow described in the docs).

## Operations

The **Vatis Transcribe** node groups actions by **resource** and **operation**:

| Resource | Operation | What it does |
| -------- | --------- | ------------- |
| **Transcribe** | **Create Transcript** | Uploads media (binary field or URL) and starts a transcription stream. Returns identifiers you use in later steps (for example `streamId`). |
| **Stream** | **Get Transcript Status** | Reads the current status and metadata for a stream by `streamId` (poll until processing finishes). |
| **Export** | **Get Transcript JSON** | Downloads the full transcription and intelligence payload as JSON for a completed `streamId`. |

Details such as languages, diarization, and optional intelligence features are configured in the node UI when **Create Transcript** is selected.

## Credentials

Authentication uses the **Vatis Transcribe API** credential type (HTTP **Authorization: Basic** with your API key), matching [Vatis API access](https://docs.vatis.tech/get-started/get-api-access).

1. Sign up or log in at Vatis and obtain an API key from their documentation: [Get API access](https://docs.vatis.tech/get-started/get-api-access).
2. In n8n, create credentials **Vatis Transcribe API** and paste your API key.
3. Use **Test** on the credential if you want to verify connectivity before running workflows.

## Compatibility

This package is built with the official [n8n node tooling](https://www.npmjs.com/package/@n8n/node-cli) (`n8n-node`) and targets current n8n community node conventions. Use a recent n8n release that supports community nodes (see [Community nodes](https://docs.n8n.io/integrations/community-nodes/)).

If you hit a version-specific issue, check your n8n version and the [changelog / releases](https://github.com/Vatis-Tech/n8n-nodes-vatis-transcribe/releases) for this repository.

## Usage

### Example: transcribe a file URL and fetch JSON when ready

1. Add **Vatis Transcribe** → resource **Transcribe** → operation **Create Transcript**. Choose **Media URL**, paste a publicly reachable audio or video URL, and set languages and options as needed. Execute the node and note `streamId` in the output JSON.
2. Add another **Vatis Transcribe** node (or loop): resource **Stream** → **Get Transcript Status**, using the same credential and the `streamId` from step 1. Repeat until the API reports a terminal success state for your workflow (for example with **Wait** between polls).
3. Add **Vatis Transcribe** → resource **Export** → **Get Transcript JSON** with that `streamId` to retrieve the final structured transcript.

You can combine this with n8n’s **IF**, **Wait**, **Merge**, or **Split In Batches** nodes depending on how you want to poll and branch on status.

By the time users install community nodes, they usually know n8n basics; if not, see [Try it out](https://docs.n8n.io/try-it-out/).

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Vatis documentation](https://docs.vatis.tech/introduction)
- [Get API access (API key)](https://docs.vatis.tech/get-started/get-api-access)
- [Submit your node for verification](https://docs.n8n.io/integrations/creating-nodes/deploy/submit-community-nodes/) (n8n)

## Maintainer release flow (n8n verification)

To satisfy n8n verification requirements, publish from GitHub Actions only (not from a local machine).

1. Configure npm Trusted Publisher for this repository and `publish.yml`.
2. Run `npm run release` locally to bump version, create tag (`v*`), and push.
3. The `publish.yml` workflow publishes with `npm publish --provenance --access public`.

## Version history

Published versions and release notes are tracked on [npm](https://www.npmjs.com/package/n8n-nodes-vatis-transcribe) and [GitHub Releases](https://github.com/Vatis-Tech/n8n-nodes-vatis-transcribe/releases).

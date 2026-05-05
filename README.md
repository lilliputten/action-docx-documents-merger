<!--
 @project action-docx-documents-merger
 @since 2026.05.04
 @changed 2026.05.04, 14:54
-->

# Action - DOCX documents merger

[The VLOOKUP trainer applicaiton](https://action-docx-documents-merger.vercel.app/) is implemented via React, Webpack (Vite doesn't support required popyfills), TS, and Tailwind, deployed to Vercel. Developed for Russian company [Action Academy](https://academy.action-mcfr.ru/) (it supports both English and Russian localizations).

Simple docx documents merger.

![Application banner](static/opengraph-image.jpg 'Application banner')

## Build info (auto-generated)

- Project info: v.0.0.1 / 2026.05.05 16:07:32 +0300

## Resources

- Vercel deployed app: https://action-docx-documents-merger.vercel.app/
- Repository: https://github.com/lilliputten/action-docx-documents-merger/

## Workspace

Core resources:

- Client entry point (react app): [src/main.tsx](src/main.tsx).
- Client template: [index.html](index.html).
- Client-side core component: [src/components/PharmaStore/PharmaStoreScreen.tsx](src/components/PharmaStore/PharmaStoreScreen.tsx).

## Installation

Just run `pnpm install --frozen-lockfile` to install all the dependencies.

Set up local [environent variables](#environent-variables) (not required).

## Environent variables

The application environent variables could be provided by the environment (from github actions or vercel environment setup) or be set in the local `.env` file (see a template in [.env.SAMPLE](.env.SAMPLE));

- `VITE_NO_STRICT_MODE`: Disable react strict mode (causes double hooks' invocations).

## Local development

Run local development server via a command:

```bash
pnpm dev
```

-- It will start server app locally, on port 5173.

## Maintenance tools

Run prettier and all the linters:

```bash
pnpm check-all
```

Run tests:

```bash
pnpm test
```

## See also

- [Changelog](CHANGELOG.md)

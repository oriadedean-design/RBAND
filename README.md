<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3f1bf5bd-49ea-4f04-bfb5-97eb89452b76

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Non-destructive Sanity starter import

If you want to preload Sanity with your existing site content (blogs, about info, gallery images) **without overwriting anything already in your dataset**, use:

1. Add env vars:
   - `SANITY_PROJECT_ID` (or `VITE_SANITY_PROJECT_ID`)
   - `SANITY_DATASET` (optional, defaults to `production`)
   - `SANITY_API_TOKEN` (write-enabled token)
2. Run:
   `npm run seed:sanity`

What this does:
- Uses deterministic `legacy-*` IDs and `createIfNotExists`, so existing docs with the same IDs are never overwritten.
- Skips singleton seed docs (`aboutInfo`, `grantInfo`) if those types already have content.
- Adds old image URLs as `legacyImageUrl` so you can manually swap to Sanity-hosted assets later.

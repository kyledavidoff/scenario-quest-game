# Rename to "Scenario Quest" and add a logo

## Goal
Rebrand the micro-app from "Tailwinds" to "Scenario Quest" with a sleek, modern logo and updated favicon.

## Changes

1. **Page metadata**
   - Update `src/routes/index.tsx` head title, description, and OpenGraph tags to use "Scenario Quest".

2. **In-page brand**
   - Update the header in `src/routes/index.tsx`:
     - Replace the "TW" mark with the new logo (or "SQ" initials as a fallback until the logo asset is ready).
     - Replace "TAILWINDS" wordmark with "SCENARIO QUEST".
     - Keep the existing board-game warm styling and typography.

3. **Logo**
   - Generate a cool, sleek, modern logo mark that fits the cream/ink/teal warm board-game aesthetic.
   - Save it under `src/assets/logo.png`.

4. **Favicon**
   - Downscale the logo to a 64x64 square favicon at `public/favicon.png`.
   - Update `src/routes/__root.tsx` to reference `/favicon.png`.
   - Remove the old `public/favicon.ico`.

5. **Verification**
   - Run a preview check to confirm the new title, wordmark, and favicon load correctly.

## GitHub sync note
Auto-upload to GitHub only happens after you connect Lovable's GitHub integration (Plus menu → GitHub → Connect project). Until that's done, changes stay in Lovable. Once connected, every edit pushes automatically.

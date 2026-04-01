# Uzzal Creative World — Tools Section

## Current State
The app is a bookmark manager (UZZAL CREATIVE WORLD) with home view, settings view, floating PDF tool, and floating translator. Navigation uses a bottom nav bar. No image processing tools exist yet.

## Requested Changes (Diff)

### Add
- New `tools` view in the app navigation (alongside home/settings)
- **ToolsPage** component listing 3 image tools as cards
- **BackgroundRemoveTool**: Upload image → canvas flood-fill magic wand to remove background → download as JPG/PNG
- **TextRemoveTool**: Upload image → brush paint tool to paint over text → download as JPG
- **PassportPhotoTool**: Upload image → auto-crop to Bangladesh passport spec (35mm × 45mm, ~413×531px at 300dpi) → arrange 8–12 photos on A4 canvas (3 cols × 4 rows, left-top aligned with 10mm margins) → download as JPG or print PDF
- **Daily Credit System**: localStorage-based, 10 free credits per day, resets at midnight, each tool use costs 1 credit. Show remaining credits on ToolsPage.
- **Community/Support Section**: Simple tab or card section at bottom of ToolsPage with links (GitHub, Telegram, email), FAQ accordion, and a feedback form (just UI, no backend send)
- Bottom nav: add "Tools" button with wrench icon

### Modify
- App.tsx: add `tools` to View type and route it to ToolsPage
- Bottom nav in both home and settings views: add Tools nav button

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/hooks/useCredits.ts` — localStorage daily credit hook (10/day, reset at midnight)
2. Create `src/frontend/src/components/tools/ToolsPage.tsx` — main tools hub with credit display, 3 tool cards, community section
3. Create `src/frontend/src/components/tools/BackgroundRemoveTool.tsx` — canvas flood-fill background removal
4. Create `src/frontend/src/components/tools/TextRemoveTool.tsx` — canvas brush paint-over tool
5. Create `src/frontend/src/components/tools/PassportPhotoTool.tsx` — crop + A4 layout canvas
6. Update `App.tsx` — add tools view, add Tools button to bottom nav in all views

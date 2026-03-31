# UZZAL CREATIVE WORLD

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Full Settings app with sidebar navigation and 7 settings sections
- Appearance: Light/Dark/Auto mode, custom color theme palette, font size & style
- Bookmarks Settings: category sort, import/export, card/list view toggle
- Search Settings: default search engine (Google/Bing/DuckDuckGo), auto-suggest toggle, voice search toggle
- Privacy & Security: VPN enable/disable (UI only), clear browsing data, Do Not Track, password manager/autofill
- Notifications: bookmark update notifications, site notification permissions, app update notifications
- User Profile: profile picture & name, custom background setting, theme & bookmark sort style
- Advanced Settings: developer mode toggle, proxy settings, network performance monitor
- All settings persisted in localStorage

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: minimal Motoko actor (settings storage per user principal)
2. Frontend: two-panel layout — left sidebar with 7 menu items, right scrollable settings panel
3. Each settings section rendered as cards with appropriate controls (toggles, selects, sliders, color pickers)
4. localStorage persistence for all settings state
5. Dark/light mode applied to entire app via CSS variables

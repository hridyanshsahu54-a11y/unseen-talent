# UNSEEN website upgrade — prototype

## Files
- `index.html` — homepage, discover section, profile form
- `style.css` — responsive dark UI
- `script.js` — demo profiles, filters, form validation, browser storage

## Run it in VS Code
1. Make a backup copy of your existing UNSEEN folder.
2. Extract this ZIP.
3. Copy these three files into your existing `UNSEEN` project folder and replace the matching files (keep the backup).
4. Open `index.html` in a browser, or use the VS Code Live Server extension.
5. Try **Build your profile**. A submitted profile should appear in Discover.

## Important limitations
This is a front-end prototype. Submitted profiles are saved in `localStorage` in the current browser only. They do not sync between devices or visitors, and there is no real login, password, server, database, or moderation system. Demo profiles are illustrative examples.
Do not publish sensitive personal information. For a real platform—especially one used by minors—add a secure backend/authentication, database rules, reporting/moderation, and age-appropriate privacy protections before opening it to the public.

## Next production step
Connect a backend such as Supabase or Firebase, implement authenticated user accounts and row-level access rules, and then replace localStorage with server-side profile/idea records. Never put private service-role keys in frontend JavaScript.

# UNSEEN — shared public profiles

## What's changed
- Keeps the existing homepage/design and profile cards.
- Replaces browser-only `localStorage` submissions with a Supabase shared table.
- Keeps search, category filter, stage filter, and demo cards.
- No email/password login is added in this version; the existing form is a public profile submission form.

## Setup
1. Back up your current website folder.
2. Create a Supabase project at https://supabase.com/dashboard.
3. Open SQL Editor, paste all of `supabase-setup.sql`, and run it.
4. In Supabase Project Settings, copy the Project URL and publishable key (older projects may call it the anon key).
5. Edit `supabase-config.js` and replace both placeholders.
6. Keep these files together in your website folder: `index.html`, `style.css`, `script.js`, `supabase-config.js`.
7. Open `index.html` using VS Code Live Server to test. Don't test database submissions by opening it as `file://`.
8. Commit/push all four website files to GitHub. Check that the published branch contains them.
9. Open the GitHub Pages URL in two different browsers/devices. Submit a test profile in one; refresh Discover in the other.

## Important
- The public publishable key is intended for browser use; NEVER use a service_role/secret key in frontend files.
- This setup allows anonymous public submissions, so it is suitable only for a controlled prototype. It can attract spam. Before a public launch, add authentication, rate limiting, reporting/moderation, and abuse protection.
- Profiles are public. Do not collect phone numbers, exact birthday, address, school name, passwords, or other sensitive information. Consider making age group optional and review privacy needs before inviting minors.
- Existing `localStorage` submissions stay in each old browser and are not automatically migrated.
- The demo profiles remain examples and are not real registered users.

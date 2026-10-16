# GrModPro

GrModPro is a lightweight Minecraft Bedrock add-on site hosted on GitHub Pages.

## Current release

**GrModPro Horror 1.0.0** is the first real release. The `.mcaddon` contains a behavior pack and matching resource pack for the hostile `grmodpro:horror` entity.

- Download: `downloads/GRModPro-Horror-1.0.0.mcaddon`
- Target metadata: Minecraft Bedrock 26.52
- Spawn: use the generated spawn egg or `/summon grmodpro:horror` with cheats enabled
- Website: <https://leoissac123-art.github.io/GRModPro/>

## Important compatibility note

The pack metadata targets Bedrock 26.52, but this repository cannot launch Minecraft or import the pack on a real iPhone 13. JSON validity, UUID relationships, pack structure, archive integrity, and the website download path are validated locally. Real-device import and gameplay behavior remain unverified.

Achievements are not promised. Mojang's official guidance says that only Marketplace add-ons qualify for achievements; this direct community download is not a Marketplace add-on.

Survival, Visuals, and Mobs are intentionally marked **Coming Soon** on the website until each has a real tested file.

## Accounts (sign up / log in)

Accounts use Supabase Auth (project `GrModPro`, ref `tgpkgzvgttulqtwnodde`). The public publishable key lives in `assets/auth.js` — it is safe to be public. Never put a `service_role` / secret key in this repo.

Pages: `signup.html`, `login.html`, `forgot.html`, `reset.html`, `account.html`. Favorites are saved on each user's own account profile (`user_metadata.favorites`).

One-time Supabase setup (Dashboard → Authentication → URL Configuration):
- Site URL: `https://leoissac123-art.github.io/GRModPro/`
- Redirect URLs: `https://leoissac123-art.github.io/GRModPro/**`

## Editing pages

All HTML pages are generated from `tools/build_pages.py` (shared header/footer). Edit it and run `python3 tools/build_pages.py`. Add-ons are listed in `assets/catalog.js`.

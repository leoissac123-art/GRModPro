# GRModPro redesign plan

## Direction

Reframe GRModPro as a first-party editorial mod marketplace: premium, dark, cinematic, and curated rather than a utility catalog. The reference provides the visual direction only; all branding, copy, downloads, and project status remain GRModPro-owned.

## Design system

- **Movement:** editorial game-marketplace / dark premium magazine.
- **Principles:** cinematic entry point, strong typographic hierarchy, curated discovery, and honest release status.
- **Color philosophy:** near-black charcoal creates depth; warm cream keeps reading comfortable; amber/gold marks GRModPro’s own signature; muted sage is reserved for safe/live states.
- **Layout:** full-width hero with a split composition, horizontal “universe” rail, then a dense but breathable release grid.
- **Signature elements:** amber GRModPro wordmark, oversized serif display headlines, and thin framed cards with small uppercase category labels.
- **Interaction:** search and filters feel like browsing a collection; every project opens a detail view; only the verified Horror pack has a download CTA.
- **Animation:** restrained hover lift, amber border glow, and short reveal transitions; no distracting loops.
- **Typography:** Georgia/Times-style serif for editorial headlines, system sans for navigation, metadata, and controls.
- **Brand essence:** “A focused home for Minecraft projects that are ready to play.” Personality: cinematic, curious, trustworthy.
- **Brand voice:** direct, atmospheric, and honest. Examples: “Find the next way to play.” and “One verified release. More worlds in the making.”
- **Wordmark:** GR MOD PRO with a compact amber G mark; implemented as a text-safe CSS mark rather than generated lettering.
- **Signature brand color:** warm amber `#e7b565`.

## Implementation

Keep the existing static GitHub Pages architecture. Replace `index.html` with a self-contained responsive page; use the original GRModPro hero artwork at `assets/grmodpro-hero.png`; keep the existing real `downloads/GRModPro-Horror-1.0.0.mcaddon` path; keep the four current catalog records and honest Coming Soon states; preserve search, category filters, clear filters, detail view, installation guidance, and accessibility semantics. No Manus branding, Manus URLs, or copied reference download assets are used.

/* GrModPro catalog — the single list every page reads from.
   To add a new add-on, copy one entry and change the fields. */
window.GMP_CATEGORIES = [
  { id: "Horror", label: "Horror", blurb: "Scary mobs and spooky nights", icon: "moon" },
  { id: "Visuals", label: "Visuals", blurb: "New textures and better looks", icon: "sparkle" },
  { id: "Survival", label: "Survival", blurb: "Tougher, longer worlds", icon: "leaf" },
  { id: "Mobs", label: "Mobs", blurb: "New creatures to meet", icon: "paw" },
  { id: "Performance", label: "Performance", blurb: "Smoother gameplay", icon: "bolt" },
  { id: "Utilities", label: "Utilities", blurb: "Handy tools and tweaks", icon: "wrench" }
];

window.GMP_MODS = [
  {
    id: "horror", title: "GrModPro Horror", category: "Horror", cover: "assets/cover-horror.webp",
    ready: true, badge: "Ready to download", version: "1.0.0", added: "2026-09-20", trending: 1,
    short: "Adds a scary new creature that hunts you at night. Great for brave survival players.",
    description: "A hostile custom creature for a tense survival encounter. The download includes both the behavior pack and the matching resource pack, so you only need one file.",
    fileType: "Full add-on (.mcaddon)",
    download: "downloads/GRModPro-Horror-1.0.0.mcaddon",
    extras: [
      { label: "Behavior pack only", href: "downloads/GRModPro-Horror-Behavior-1.0.0.mcpack" },
      { label: "Resource pack only", href: "downloads/GRModPro-Horror-Resources-1.0.0.mcpack" }
    ],
    works: "Minecraft Bedrock (made for 26.52)",
    steps: [
      "Tap the Download button. On iPhone or iPad, the file may save to the Files app — open Files, go to Downloads, and tap the file.",
      "Choose Minecraft when your device asks which app to open it with. Minecraft will import it for you.",
      "Create a new test world (or a copy of one you like), open Add-Ons, and turn on both GrModPro Horror packs.",
      "Play at night, or with cheats on type `/summon grmodpro:horror` to meet it right away."
    ],
    note: "Not tested on every device yet. If the full file doesn't import, try the two separate packs below it."
  },
  {
    id: "realism-phase2", title: "Realism Phase 2", category: "Visuals", cover: "assets/cover-realism.webp",
    ready: true, experimental: true, badge: "Early version", version: "2.0.2", added: "2026-10-10", trending: 2,
    short: "The newest realistic texture pack, with an important fix for block textures.",
    description: "A separate Phase 2 resource pack with an updated fix for how block textures load. It's still an early version — it is not a true shader and hasn't been tested on a real device yet.",
    fileType: "Resource pack (.mcpack)",
    download: "downloads/GRModPro-Realism-Phase-2-2.0.2.mcpack",
    works: "Minecraft Bedrock · made for iPhone/iPad (not tested yet)",
    steps: [
      "Tap the Download button and open the file with Minecraft.",
      "In a test world, go to Settings → Resource Packs and turn on GRModPro Realism Phase 2.",
      "Back up your world first. This is an early version."
    ],
    note: "Early version: some blocks may still look normal."
  },
  {
    id: "realism", title: "Realism Atmosphere", category: "Visuals", cover: "assets/cover-realism.webp",
    ready: true, experimental: true, badge: "Early version", version: "1.0.0", added: "2026-09-28",
    short: "Realistic textures for many common blocks, plus foggy cave and outdoor moods.",
    description: "An experimental realism resource pack with original textures for many common Overworld, cave, Nether, End, ore, wood, leaf, water, and tool textures, plus Overworld and cave fog presets. It doesn't replace every block, mob, item, or sound, and it is not a true shader.",
    fileType: "Resource pack (.mcpack)",
    download: "downloads/GRModPro-Realism-Atmosphere-1.0.0.mcpack",
    works: "Minecraft Bedrock · made for iPhone/iPad (not tested yet)",
    steps: [
      "Tap the Download button and open the file with Minecraft.",
      "In a test world, go to Settings → Resource Packs and turn on GRModPro Realism Atmosphere.",
      "Want the fog? With cheats on, type `/fog @s push grmodpro:realism_overworld` (or `grmodpro:realism_caves`).",
      "To turn the fog off, type `/fog @s pop`."
    ],
    note: "Early version: the texture set covers many blocks, but not all of them yet."
  },
  {
    id: "classic", title: "Classic Blocks", category: "Visuals", cover: "assets/cover-classic.webp",
    ready: true, experimental: true, badge: "Early version", version: "1.0.0", added: "2026-10-04",
    short: "Bright, colorful pixel textures for a fun, cartoon-style look.",
    description: "A non-realistic resource pack with bright, stylized pixel textures for selected blocks. It's a starter pack — it changes some block textures, not every block, item, or mob.",
    fileType: "Resource pack (.mcpack)",
    download: "downloads/GRModPro-Classic-Blocks-1.0.0.mcpack",
    works: "Minecraft Bedrock · made for iPhone/iPad (not tested yet)",
    steps: [
      "Tap the Download button and open the file with Minecraft.",
      "In a test world, go to Settings → Resource Packs and turn on GRModPro Classic Blocks.",
      "Back up your world first. This pack changes selected blocks only."
    ],
    note: "Early version: changes some blocks, not all."
  },
  { id: "mobs", title: "GrModPro Mobs", category: "Mobs", cover: "assets/cover-soon.webp", ready: false, badge: "Coming soon", trending: 3,
    short: "New creatures are being made for your worlds.", description: "Additional creatures are planned for the catalog. No file is available to download yet." },
  { id: "survival", title: "GrModPro Survival", category: "Survival", cover: "assets/cover-soon.webp", ready: false, badge: "Coming soon",
    short: "A tougher survival experience for longer worlds.", description: "A realistic survival project being shaped for longer worlds and slower discoveries. No file is available to download yet." },
  { id: "visuals", title: "GrModPro Visuals", category: "Visuals", cover: "assets/cover-soon.webp", ready: false, badge: "Coming soon",
    short: "A full visual makeover with a new mood and atmosphere.", description: "A visual refresh for players who want a different mood and atmosphere. No file is available to download yet." },
  { id: "performance", title: "GrModPro Performance", category: "Performance", cover: "assets/cover-soon.webp", ready: false, badge: "Planned",
    short: "Helps Minecraft run smoother on more devices.", description: "A future lightweight project focused on smoother Bedrock sessions and clear compatibility notes. No file is available yet." },
  { id: "utilities", title: "GrModPro Utilities", category: "Utilities", cover: "assets/cover-soon.webp", ready: false, badge: "Planned",
    short: "Small tools that make everyday play easier.", description: "Small tools and quality-of-life ideas being collected for a future utilities shelf. No file is available yet." },
  { id: "dupeguard", title: "Dupe Guard", category: "Utilities", cover: "assets/cover-soon.webp", ready: false, badge: "Not available",
    short: "An idea for stopping item duplication — not released.",
    description: "A reliable anti-duplication add-on has not been published. Bedrock duplication tricks can't all be blocked safely with a normal pack, so this listing won't pretend a working file exists." }
];

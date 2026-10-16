#!/usr/bin/env python3
"""Builds every GrModPro HTML page from one shared layout.
Run from the repo root:  python3 tools/build_pages.py
Edit the page bodies below, then re-run to regenerate the .html files."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://leoissac123-art.github.io/GRModPro/"
VER = "3"

def ic(name):
    paths = {
        "search": '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
        "check": '<path d="M20 6 9 17l-5-5"/>',
        "arrow": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
        "gear": '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/>',
        "menu": '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
        "heart": '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z"/>',
        "user": '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
        "logout": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
        "info": '<circle cx="12" cy="12" r="9"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    }
    return f'<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>'

LOGO = ('<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">'
        '<path d="M16 2 29 9.5v13L16 30 3 22.5v-13Z" fill="currentColor" opacity=".18"/>'
        '<path d="M16 2 29 9.5 16 17 3 9.5Z" fill="currentColor" opacity=".55"/>'
        '<path d="M16 17v13L3 22.5v-13Z" fill="currentColor" opacity=".35"/>'
        '<path d="M16 2 29 9.5v13L16 30 3 22.5v-13Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>')

NAV = [("index.html", "Home"), ("discover.html", "Browse add-ons"), ("categories.html", "Categories"), ("trending.html", "Popular"), ("recent.html", "New")]

def header(active):
    links = "".join(f'<a href="{h}"{" aria-current=\"page\"" if h == active else ""}>{t}</a>' for h, t in NAV)
    return f'''<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="shell nav">
    <a class="brand" href="index.html" aria-label="GrModPro home">{LOGO}<span>Gr<b>Mod</b>Pro</span></a>
    <nav class="nav-links" aria-label="Main">{links}</nav>
    <div class="nav-right">
      <button class="icon-btn" type="button" data-settings aria-label="Display settings" title="Display settings">{ic("gear")}</button>
      <div class="auth-slot" id="auth-slot" aria-live="polite"></div>
      <button class="icon-btn menu-btn" id="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Open menu">{ic("menu")}</button>
    </div>
  </div>
  <div class="shell mobile-nav" id="mobile-nav">
    <nav aria-label="Mobile">{links}</nav>
    <div class="mobile-auth" id="mobile-auth"></div>
  </div>
</header>'''

FOOTER = f'''<footer class="site-footer">
  <div class="shell">
    <div class="footer-grid">
      <a class="brand" href="index.html">{LOGO}<span>Gr<b>Mod</b>Pro</span></a>
      <nav aria-label="Footer">
        <a href="discover.html">Browse add-ons</a><a href="index.html#how">How to install</a>
        <a href="account.html">My account</a><button class="linklike" type="button" data-settings>Display settings</button>
      </nav>
    </div>
    <p class="footer-note">© <span data-year>2026</span> GrModPro. Free community add-ons for Minecraft Bedrock. Not an official Minecraft product and not approved by or associated with Mojang or Microsoft. Always back up your world before installing add-ons.</p>
  </div>
</footer>'''

def page(file, title, desc, page_id, body, active=None, ai=True, private=False, noindex=False):
    full_title = title if "GrModPro" in title else f"{title} · GrModPro"
    html = f'''<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{full_title}</title>
  <meta name="description" content="{desc}">
  <meta name="theme-color" content="#070b14">
  {'<meta name="robots" content="noindex">' if noindex else f'<link rel="canonical" href="{SITE}{"" if file == "index.html" else file}">'}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="GrModPro">
  <meta property="og:title" content="{full_title}">
  <meta property="og:description" content="{desc}">
  <meta property="og:image" content="{SITE}assets/grmodpro-hero-blue.webp">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M16 2 29 9.5v13L16 30 3 22.5v-13Z' fill='%234cb2ff'/%3E%3C/svg%3E">
  <link rel="preconnect" href="https://api.fontshare.com" crossorigin>
  <link href="https://api.fontshare.com/v2/css?f[]=chillax@500,600&f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/styles.css?v={VER}">
  <script src="site-settings.js?v={VER}"></script>
</head>
<body data-page="{page_id}"{' data-private="1"' if private else ''}>
{header(active)}
<main id="main">
{body}
</main>
{FOOTER}
<script src="assets/catalog.js?v={VER}"></script>
<script type="module" src="assets/pages.js?v={VER}"></script>
{'<script src="ai-assistant.js" defer></script>' if ai else ''}
</body>
</html>
'''
    (ROOT / file).write_text(html, encoding="utf-8")

# ---------------- Home ----------------
page("index.html", "GrModPro — Free Minecraft Bedrock add-ons, easy to install",
     "Download free Minecraft Bedrock add-ons and texture packs from GrModPro. Simple steps, honest labels, and a free account to save your favorites.",
     "home", f'''
<section class="hero">
  <img class="hero-art" src="assets/grmodpro-hero-blue.webp" alt="" width="1920" height="1080" fetchpriority="high">
  <div class="shell">
    <div class="hero-copy">
      <span class="kicker">Free for Minecraft Bedrock · phone, tablet &amp; PC</span>
      <h1>Make Minecraft <em>feel new</em> again.</h1>
      <p class="lead">Free add-ons and texture packs you can install in a few taps. Every download is clearly labeled, so you always know what you're getting.</p>
      <form class="hero-search" id="hero-search" role="search">
        <label for="hero-q">{ic("search")}<span class="sr-only">Search add-ons</span>
          <input id="hero-q" type="search" placeholder="Try “horror” or “textures”" autocomplete="off"></label>
        <button class="btn btn-primary" type="submit">Search</button>
      </form>
      <ul class="hero-points">
        <li>{ic("check")}100% free</li><li>{ic("check")}Easy 3-step install</li><li>{ic("check")}Honest “ready” labels</li>
      </ul>
    </div>
  </div>
</section>

<section class="section shell" aria-labelledby="popular-h">
  <div class="section-head">
    <div><h2 id="popular-h">Ready to download</h2><p>Start with one of these. Tap Download, open the file with Minecraft, and you're set.</p></div>
    <a class="link-more" href="discover.html?ready=1">See all downloads {ic("arrow")}</a>
  </div>
  <div class="grid" id="popular"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>
</section>

<section class="section shell" id="how" aria-labelledby="how-h">
  <div class="section-head"><div><h2 id="how-h">How to install, in 3 steps</h2><p>No computer skills needed. It works the same way for every pack on this site.</p></div></div>
  <div class="steps-grid">
    <div class="step"><span class="step-num">1</span><h3>Download</h3><p>Pick an add-on and tap the blue Download button. The file is small and saves to your device.</p></div>
    <div class="step"><span class="step-num">2</span><h3>Open with Minecraft</h3><p>Tap the downloaded file. Your device will ask which app to use — choose Minecraft and it imports by itself.</p></div>
    <div class="step"><span class="step-num">3</span><h3>Turn it on</h3><p>Edit a world (try a copy first), open Add-Ons or Resource Packs, switch the pack on, and play.</p></div>
  </div>
</section>

<section class="section shell" aria-labelledby="cats-h">
  <div class="section-head"><div><h2 id="cats-h">Find what you like</h2><p>Browse by the kind of fun you're looking for.</p></div>
    <a class="link-more" href="categories.html">All categories {ic("arrow")}</a></div>
  <div class="cat-grid" id="cats"></div>
</section>

<section class="section shell" aria-labelledby="soon-h">
  <div class="section-head"><div><h2 id="soon-h">Coming soon</h2><p>Projects we're working on. Save them to your favorites so they're easy to find later.</p></div>
    <a class="link-more" href="discover.html">See everything {ic("arrow")}</a></div>
  <div class="grid" id="soon"></div>
</section>

<section class="section shell" id="account-cta">
  <div class="cta-band">
    <div><h2>Make a free account</h2><p>Save your favorite add-ons and come back to them on any device. It takes less than a minute — just an email and a password.</p></div>
    <div class="actions"><a class="btn btn-primary btn-lg" href="signup.html">Sign up free</a><a class="btn btn-lg" href="login.html">I already have an account</a></div>
  </div>
</section>''', active="index.html")

# ---------------- Browse ----------------
page("discover.html", "Browse add-ons", "Search and filter every GrModPro add-on and texture pack for Minecraft Bedrock.", "discover", f'''
<div class="shell">
  <header class="page-head"><h1>Browse add-ons</h1><p>Search by name, or tap a category. Turn on “Only ready to download” to hide projects that aren't out yet.</p></header>
  <form class="toolbar" id="search-form" role="search">
    <label class="search-box" for="q">{ic("search")}<span class="sr-only">Search</span><input id="q" type="search" placeholder="Search add-ons…" autocomplete="off"></label>
    <label class="toggle"><input type="checkbox" id="ready-only"> Only ready to download</label>
  </form>
  <div class="chips" id="chips" role="group" aria-label="Category" style="margin-bottom:22px"></div>
  <p class="result-line" id="result-line" aria-live="polite"></p>
  <div class="grid" id="results"></div>
  <div class="empty" id="empty" hidden><h3>Nothing matches that yet</h3><p>Try a different word, or clear your search to see everything.</p><button class="btn btn-primary" type="button" id="clear">Show everything</button></div>
</div>''', active="discover.html")

page("categories.html", "Categories", "Browse GrModPro add-ons by category: horror, visuals, survival, mobs, performance and utilities.", "categories", '''
<div class="shell">
  <header class="page-head"><h1>Categories</h1><p>Pick the kind of fun you want. Each category shows what's ready now and what's coming next.</p></header>
  <div class="cat-grid" id="cats" style="padding-bottom:40px"></div>
</div>''', active="categories.html")

page("trending.html", "Popular add-ons", "The most popular GrModPro add-ons right now.", "trending", '''
<div class="shell">
  <header class="page-head"><h1>Popular right now</h1><p>The add-ons players are checking out most on GrModPro.</p></header>
  <div class="grid" id="results" style="padding-bottom:40px"></div>
</div>''', active="trending.html")

page("recent.html", "New add-ons", "The newest add-ons and texture packs added to GrModPro.", "recent", '''
<div class="shell">
  <header class="page-head"><h1>New on GrModPro</h1><p>The latest packs added to the site, newest first.</p></header>
  <div class="grid" id="results" style="padding-bottom:40px"></div>
</div>''', active="recent.html")

page("project.html", "Add-on details", "Details, download and simple install steps for a GrModPro add-on.", "project", '''
<div class="shell">
  <nav class="crumbs" aria-label="Breadcrumb" style="padding-top:28px"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="discover.html">Browse</a><span aria-hidden="true">/</span><span id="crumb-title" aria-current="page">Add-on</span></nav>
  <div id="project"><div class="skeleton" style="min-height:420px"></div></div>
</div>''')

# ---------------- Auth ----------------
def auth_page(file, title, desc, pid, side_title, card):
    page(file, title, desc, pid, f'''
<div class="auth-wrap">
  <aside class="auth-side">
    <img src="assets/cover-classic.webp" alt="" width="1280" height="720">
    <div><h2>{side_title}</h2>
      <ul><li>{ic("check")}Save your favorite add-ons</li><li>{ic("check")}Find them again on any device</li><li>{ic("check")}Free forever — no card needed</li></ul></div>
  </aside>
  <div class="auth-main"><div class="auth-card">{card}</div></div>
</div>''', ai=False, noindex=True)

PW = lambda name, label, ac, hint="": f'''<div class="field"><label for="{name}">{label}</label>
  <div class="pw-wrap"><input class="input" id="{name}" name="{name}" type="password" autocomplete="{ac}" required minlength="8"><button class="pw-toggle" type="button" aria-label="Show password">Show</button></div>
  {f'<span class="hint">{hint}</span>' if hint else ''}</div>'''

auth_page("signup.html", "Sign up", "Create a free GrModPro account.", "signup", "Join GrModPro. It's free.", f'''
<h1>Create your free account</h1><p>Takes less than a minute.</p>
<div id="form-msg" hidden style="margin-top:20px"></div>
<form class="form" id="signup-form" novalidate>
  <div class="field"><label for="name">What should we call you?</label><input class="input" id="name" name="name" autocomplete="nickname" maxlength="40" placeholder="Your name or gamer tag" required></div>
  <div class="field"><label for="email">Email</label><input class="input" id="email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="name@example.com" required></div>
  {PW("password", "Password", "new-password", "At least 8 characters.")}
  <button class="btn btn-primary btn-lg btn-block" type="submit">Create account</button>
  <p class="hint" style="text-align:center;color:var(--faint);font-size:var(--text-xs)">We'll only use your email to log you in and help you reset your password.</p>
</form>
<p class="switch-line" id="switch-line">Already have an account? <a href="login.html">Log in</a></p>''')

auth_page("login.html", "Log in", "Log in to your GrModPro account.", "login", "Welcome back to GrModPro.", f'''
<h1>Log in</h1><p>Good to see you again.</p>
<div id="form-msg" hidden style="margin-top:20px"></div>
<form class="form" id="login-form" novalidate>
  <div class="field"><label for="email">Email</label><input class="input" id="email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="name@example.com" required></div>
  {PW("password", "Password", "current-password")}
  <div class="form-row"><span></span><a href="forgot.html">Forgot your password?</a></div>
  <button class="btn btn-primary btn-lg btn-block" type="submit">Log in</button>
</form>
<p class="switch-line">New here? <a href="signup.html" id="signup-link">Create a free account</a></p>''')

auth_page("forgot.html", "Reset your password", "Reset your GrModPro password.", "forgot", "Happens to everyone.", f'''
<h1>Forgot your password?</h1><p>Enter your email and we'll send you a link to choose a new one.</p>
<div id="form-msg" hidden style="margin-top:20px"></div>
<form class="form" id="forgot-form" novalidate>
  <div class="field"><label for="email">Email</label><input class="input" id="email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="name@example.com" required></div>
  <button class="btn btn-primary btn-lg btn-block" type="submit">Send reset link</button>
</form>
<p class="switch-line"><a href="login.html">Back to log in</a></p>''')

auth_page("reset.html", "Choose a new password", "Choose a new GrModPro password.", "reset", "Almost there.", f'''
<h1>Choose a new password</h1><p>Pick something you'll remember, at least 8 characters.</p>
<div id="form-msg" hidden style="margin-top:20px"></div>
<form class="form" id="reset-form" novalidate>
  {PW("password", "New password", "new-password")}
  {PW("confirm", "Type it again", "new-password")}
  <button class="btn btn-primary btn-lg btn-block" type="submit">Save new password</button>
</form>''')

# ---------------- Account ----------------
page("account.html", "My account", "Your GrModPro account and saved favorites.", "account", f'''
<div class="shell">
  <section id="signed-out" hidden>
    <div class="empty" style="margin:64px 0"><h3>You're not logged in</h3><p>Log in to see your account and saved favorites.</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap"><a class="btn btn-primary" href="login.html">Log in</a><a class="btn" href="signup.html">Sign up free</a></div></div>
  </section>
  <section id="signed-in" hidden>
    <header class="page-head"><h1>My account</h1></header>
    <div class="account-grid">
      <div>
        <div class="panel profile"><span class="avatar avatar-lg" id="p-avatar">?</span><div><strong id="p-name"></strong><span id="p-email" style="display:block"></span><span id="p-since" style="display:block;color:var(--faint);font-size:var(--text-xs);margin-top:4px"></span></div>
          <button class="btn btn-block" type="button" data-logout>{ic("logout")}Log out</button></div>
        <div class="panel"><h2>Your name</h2><p>This is how we greet you on the site.</p>
          <form class="form" id="name-form" style="margin-top:14px"><div class="field"><label class="sr-only" for="acc-name">Name</label><input class="input" id="acc-name" name="name" maxlength="40" autocomplete="nickname"></div><button class="btn" type="submit">Save name</button></form></div>
        <div class="panel"><h2>Change password</h2><p>At least 8 characters.</p>
          <div id="pw-msg" hidden style="margin-top:12px"></div>
          <form class="form" id="pw-form" style="margin-top:14px">{PW("password", "New password", "new-password")}<button class="btn" type="submit">Change password</button></form></div>
      </div>
      <div id="favorites">
        <div class="section-head" style="margin-bottom:18px"><div><h2>My favorites</h2></div><span class="card-meta" id="fav-count"></span></div>
        <div class="grid" id="fav-grid"></div>
        <div class="empty" id="fav-empty" hidden><h3>No favorites yet</h3><p>Tap the heart on any add-on to save it here.</p><a class="btn btn-primary" href="discover.html">Browse add-ons</a></div>
      </div>
    </div>
  </section>
</div>''', private=True, noindex=True)

print("Pages built.")

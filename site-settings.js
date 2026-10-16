/* GrModPro display settings: theme, text size, motion, and language.
   Saved on this device only. */
(() => {
  const KEY = "gmp-site-settings-v3";
  const LANGS = [["", "English (original)"], ["es", "Español"], ["pt", "Português"], ["fr", "Français"], ["de", "Deutsch"], ["it", "Italiano"], ["nl", "Nederlands"], ["pl", "Polski"], ["tr", "Türkçe"], ["ru", "Русский"], ["uk", "Українська"], ["ar", "العربية"], ["hi", "हिन्दी"], ["id", "Bahasa Indonesia"], ["vi", "Tiếng Việt"], ["th", "ไทย"], ["tl", "Filipino"], ["ja", "日本語"], ["ko", "한국어"], ["zh-CN", "中文 (简体)"], ["zh-TW", "中文 (繁體)"]];
  let s = { theme: "dark", size: "normal", motion: false, language: "" };
  try { s = Object.assign(s, JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) {}

  const root = document.documentElement;
  function apply() {
    const light = s.theme === "light" || (s.theme === "system" && matchMedia("(prefers-color-scheme: light)").matches);
    root.classList.toggle("gmp-light", light);
    root.classList.toggle("gmp-large-text", s.size === "large");
    root.classList.toggle("gmp-reduce-motion", !!s.motion);
  }
  apply();

  function translate(code) {
    if (code) document.cookie = "googtrans=/en/" + code + ";path=/;max-age=31536000;SameSite=Lax";
    else { document.cookie = "googtrans=;path=/;max-age=0"; document.cookie = "googtrans=;path=/;domain=" + location.hostname + ";max-age=0"; }
    location.reload();
  }
  if (s.language) {
    window.googleTranslateElementInit = () => { try { new google.translate.TranslateElement({ pageLanguage: "en", autoDisplay: false }, "gmp-translate"); } catch (e) {} };
    const holder = document.createElement("div"); holder.id = "gmp-translate"; holder.hidden = true;
    document.addEventListener("DOMContentLoaded", () => document.body.appendChild(holder));
    const sc = document.createElement("script"); sc.async = true; sc.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(sc);
  }

  let shade;
  function open() {
    if (!shade) {
      shade = document.createElement("div");
      shade.className = "modal-shade"; shade.hidden = true;
      shade.innerHTML = `<section class="modal" role="dialog" aria-modal="true" aria-labelledby="gmp-set-title">
        <div class="modal-head"><h2 id="gmp-set-title">Display settings</h2>
          <button class="icon-btn" type="button" data-close aria-label="Close settings"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg></button></div>
        <form class="form">
          <div class="field"><label for="gmp-theme">Colors</label>
            <select class="input select" id="gmp-theme"><option value="dark">Dark</option><option value="light">Light</option><option value="system">Match my device</option></select></div>
          <div class="field"><label for="gmp-size">Text size</label>
            <select class="input select" id="gmp-size"><option value="normal">Normal</option><option value="large">Bigger text</option></select></div>
          <label class="toggle"><input type="checkbox" id="gmp-motion"> Turn off animations</label>
          <div class="field"><label for="gmp-lang">Language</label>
            <select class="input select" id="gmp-lang">${LANGS.map(([v, n]) => `<option value="${v}">${n}</option>`).join("")}</select>
            <span class="hint">Translation is automatic and may not be perfect.</span></div>
          <button class="btn btn-primary btn-block" type="submit">Save settings</button>
        </form></section>`;
      document.body.appendChild(shade);
      const f = shade.querySelector("form");
      shade.addEventListener("click", e => { if (e.target === shade || e.target.closest("[data-close]")) close(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape" && !shade.hidden) close(); });
      f.addEventListener("submit", e => {
        e.preventDefault();
        const prevLang = s.language;
        s = { theme: f.querySelector("#gmp-theme").value, size: f.querySelector("#gmp-size").value, motion: f.querySelector("#gmp-motion").checked, language: f.querySelector("#gmp-lang").value };
        try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (err) {}
        apply(); close();
        if (prevLang !== s.language) translate(s.language);
      });
    }
    shade.querySelector("#gmp-theme").value = s.theme;
    shade.querySelector("#gmp-size").value = s.size;
    shade.querySelector("#gmp-motion").checked = !!s.motion;
    shade.querySelector("#gmp-lang").value = s.language || "";
    shade.hidden = false;
    shade.querySelector("#gmp-theme").focus();
  }
  function close() { shade.hidden = true; document.querySelector("[data-settings]")?.focus(); }
  document.addEventListener("click", e => { if (e.target.closest("[data-settings]")) open(); });
})();

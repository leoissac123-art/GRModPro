function message(el, kind, text) {
  if (!el) return;

  el.hidden = false;
  el.className = "notice " + kind;
  el.replaceChildren();

  const iconHolder = document.createElement("span");
  iconHolder.innerHTML = icon(
    kind === "ok" ? "check" :
    kind === "error" ? "alert" : "info"
  );

  const textHolder = document.createElement("span");
  textHolder.textContent = String(text ?? "");

  el.append(iconHolder.firstElementChild, textHolder);
  el.setAttribute("role", kind === "error" ? "alert" : "status");
}
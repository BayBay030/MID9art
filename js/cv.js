(function () {
  if (document.body.dataset.page !== "about") return;

  let CV = null;

  function pickLang() { return (window.I18n && I18n.lang) || "zh"; }
  function t(field) {
    const L = pickLang();
    if (field && typeof field === "object") return field[L] || field.en || field.zh || "";
    return field || "";
  }

  async function load() {
    try {
      const res = await fetch("data/cv.json", { cache: "no-store" });
      if (!res.ok) throw new Error("cv load failed");
      CV = await res.json();
    } catch (e) {
      console.warn("[cv] missing or invalid", e);
      CV = { portrait: "", sections: [] };
    }
  }

  function render() {
    const portrait = document.getElementById("portrait");
    if (portrait && CV.portrait) {
      portrait.src = CV.portrait;
      portrait.alt = window.I18n ? I18n.get("brand.name") || "" : "";
    }

    const list = document.getElementById("cv-list");
    if (!list) return;

    const heading = (key) => (window.I18n ? I18n.get(`cv.${key}`) : key) || key;

    list.innerHTML = "";
    (CV.sections || []).forEach((sec) => {
      if (!sec.entries || !sec.entries.length) return;
      const wrap = document.createElement("div");
      wrap.className = "cv__section";
      wrap.innerHTML = `
        <h3>${escapeHtml(heading(sec.key))}</h3>
        <div class="cv__entries"></div>
      `;
      const entries = wrap.querySelector(".cv__entries");
      sec.entries.forEach((en) => {
        const row = document.createElement("div");
        row.className = "cv__entry";
        row.innerHTML = `
          <span class="year">${escapeHtml(en.year || "")}</span>
          <span class="text">${escapeHtml(t(en.text))}</span>
        `;
        entries.appendChild(row);
      });
      list.appendChild(wrap);
    });
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  document.addEventListener("DOMContentLoaded", async () => { await load(); render(); });
  document.addEventListener("i18n:change", render);
})();

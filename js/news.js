(function () {
  if (document.body.dataset.page !== "news") return;

  let DATA = { items: [] };

  function pickLang() { return (window.I18n && I18n.lang) || "zh"; }
  function t(field) {
    const L = pickLang();
    if (field && typeof field === "object") return field[L] || field.en || field.zh || "";
    return field || "";
  }
  function fmtDate(iso) {
    if (!iso) return "";
    const L = pickLang();
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(L === "zh" ? "zh-Hant" : "en-GB", {
      year: "numeric", month: "long", day: "numeric"
    });
  }

  async function load() {
    try {
      const res = await fetch("data/news.json", { cache: "no-store" });
      if (!res.ok) throw new Error("news load failed");
      DATA = await res.json();
    } catch (e) {
      console.warn("[news] missing or invalid", e);
      DATA = { items: [] };
    }
  }

  function render() {
    const list = document.getElementById("news-list");
    if (!list) return;
    list.innerHTML = "";
    const items = (DATA.items || []).slice().sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    items.forEach((it) => {
      const el = document.createElement("article");
      el.className = "news__item";
      const img = it.image ? `<img loading="lazy" decoding="async" src="${it.image}" alt="">` : "";
      el.innerHTML = `
        <time class="news__date" datetime="${escapeHtml(it.date || "")}">${escapeHtml(fmtDate(it.date))}</time>
        <div class="news__body">
          <h3>${escapeHtml(t(it.title))}</h3>
          ${img}
          <div>${t(it.body)}</div>
        </div>
      `;
      list.appendChild(el);
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

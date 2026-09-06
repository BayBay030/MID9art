(function () {
  const STORAGE_KEY = "site-lang";
  const SUPPORTED = ["zh", "en"];
  const DEFAULT = "zh";

  const I18n = {
    lang: null,
    dict: {},

    get(key) {
      return key.split(".").reduce((o, k) => (o == null ? undefined : o[k]), this.dict);
    },

    apply(root = document) {
      const htmlLang = this.lang === "zh" ? "zh-Hant" : "en";
      document.documentElement.setAttribute("lang", htmlLang);

      root.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const val = this.get(key);
        if (typeof val !== "string") return;
        if (el.tagName === "META") {
          el.setAttribute("content", val);
        } else if (el.tagName === "TITLE") {
          el.textContent = val;
          document.title = val;
        } else if (/<[a-z][\s\S]*>/i.test(val)) {
          el.innerHTML = val;
        } else {
          el.textContent = val;
        }
      });

      document.querySelectorAll("[data-lang]").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.lang === this.lang);
      });

      document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: this.lang } }));
    },

    async load(lang) {
      const res = await fetch(`i18n/${lang}.json`, { cache: "no-store" });
      if (!res.ok) throw new Error(`Cannot load i18n/${lang}.json`);
      this.dict = await res.json();
      this.lang = lang;
      try { localStorage.setItem(STORAGE_KEY, lang); } catch (_) {}
      this.apply();
    },

    async init() {
      let saved = null;
      try { saved = localStorage.getItem(STORAGE_KEY); } catch (_) {}
      if (!saved) {
        const browserLang = (navigator.language || navigator.userLanguage || "").toLowerCase();
        saved = browserLang.startsWith("zh") ? "zh" : "en";
      }
      const lang = SUPPORTED.includes(saved) ? saved : DEFAULT;
      await this.load(lang);

      document.querySelectorAll("[data-lang]").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (btn.dataset.lang !== this.lang) this.load(btn.dataset.lang);
        });
      });
    },
  };

  window.I18n = I18n;
  document.addEventListener("DOMContentLoaded", () => I18n.init());
})();

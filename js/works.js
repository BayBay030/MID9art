(function () {
  const page = document.body.dataset.page;
  if (page !== "home" && page !== "work") return;

  let WORKS = [];

  async function loadManifest() {
    try {
      const res = await fetch("data/manifest.json", { cache: "no-store" });
      if (!res.ok) throw new Error("manifest load failed");
      const data = await res.json();
      WORKS = (data.works || []).slice();
    } catch (e) {
      console.warn("[works] manifest missing or invalid", e);
      WORKS = [];
    }
  }

  function pickLang() { return (window.I18n && I18n.lang) || "zh"; }
  function t(field) {
    const L = pickLang();
    if (field && typeof field === "object") return field[L] || field.en || field.zh || "";
    return field || "";
  }

  // ---------- Home: hero carousel ----------
  let carouselInterval;
  function renderHome() {
    const mediaContainer = document.querySelector(".hero__media");
    if (!mediaContainer) return;

    mediaContainer.innerHTML = "";
    if (carouselInterval) clearInterval(carouselInterval);

    const carouselItems = WORKS.filter((w) => w.featured);
    if (carouselItems.length === 0) carouselItems.push(...WORKS);
    if (carouselItems.length === 0) return;

    const imgs = carouselItems.map((w, idx) => {
      const img = document.createElement("img");
      img.src = w.image;
      img.alt = t(w.title);
      img.decoding = "async";
      if (idx === 0) {
        img.loading = "eager";
        img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
        if (img.complete) img.classList.add("is-loaded");
      } else {
        img.loading = "lazy";
      }
      mediaContainer.appendChild(img);
      return img;
    });

    let currentIdx = 0;

    function goTo(idx) {
      imgs[currentIdx].classList.remove("is-loaded");
      currentIdx = (idx + imgs.length) % imgs.length;
      imgs[currentIdx].classList.add("is-loaded");
    }

    function startAutoPlay() {
      if (carouselInterval) clearInterval(carouselInterval);
      if (imgs.length > 1) {
        carouselInterval = setInterval(() => goTo(currentIdx + 1), 4000);
      }
    }

    startAutoPlay();

    const prevBtn = document.getElementById("hero-prev");
    const nextBtn = document.getElementById("hero-next");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        goTo(currentIdx - 1);
        startAutoPlay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        goTo(currentIdx + 1);
        startAutoPlay();
      });
    }
  }

  // ---------- Work page: grouped by year ----------
  function renderWork() {
    const yearList = document.getElementById("year-list");
    const list = document.getElementById("work-list");
    if (!yearList || !list) return;

    const currentYear = parseInt(document.body.dataset.year) || new Date().getFullYear();

    const byYear = new Map();
    WORKS.forEach((w) => {
      if (!byYear.has(w.year)) byYear.set(w.year, []);
      byYear.get(w.year).push(w);
    });
    
    const staticYears = [2026, 2025, 2024];
    const allYears = Array.from(new Set([...staticYears, ...byYear.keys()])).sort((a, b) => b - a);

    yearList.innerHTML = allYears.map((y) => `<a href="work-${y}.html" class="${y === currentYear ? 'is-current' : ''}">${y}</a>`).join("");
    list.innerHTML = "";

    const items = byYear.get(currentYear) || [];
    const block = document.createElement("div");
    block.className = "work__year-block";
    block.innerHTML = `
      <h2>${currentYear}</h2>
      <div class="work__grid"></div>
    `;
    const grid = block.querySelector(".work__grid");
    items.forEach((w, i) => {
      const fig = document.createElement("article");
      fig.className = "work__item";
      fig.innerHTML = `
        <figure>
          <img data-fade loading="lazy" decoding="async" src="${w.image}" alt="${escapeHtml(t(w.title))}">
        </figure>
        <figcaption>
          <span class="t">${escapeHtml(t(w.title))}</span>
          <span class="m">${currentYear}</span>
        </figcaption>
      `;
      fig.addEventListener("click", () => openLightbox(items, i));
      grid.appendChild(fig);
    });
    list.appendChild(block);

    if (window.__observeFade) window.__observeFade();
  }

  function openLightbox(items, idx) {
    if (!window.Lightbox) return;
    const mapped = items.map((w) => ({
      image: w.image,
      alt: t(w.title),
      caption: `${t(w.title)} · ${w.year} · ${t(w.medium)}${w.dimensions ? " · " + w.dimensions : ""}`,
    }));
    Lightbox.open(mapped, idx);
  }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  async function render() {
    await loadManifest();
    if (page === "home") renderHome();
    if (page === "work") renderWork();
  }

  document.addEventListener("DOMContentLoaded", render);
  document.addEventListener("i18n:change", () => {
    if (page === "home") renderHome();
    if (page === "work") renderWork();
  });
})();

(function () {
  // Year in footer
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  if (nav && toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__menu a").forEach((a) => {
      a.addEventListener("click", () => nav.classList.remove("is-open"));
    });
  }

  // Works dropdown toggle
  function initDropdown() {
    console.log("[Dropdown] Initializing...");
    const worksDropdown = document.getElementById("works-dropdown");
    if (!worksDropdown) {
      console.log("[Dropdown] #works-dropdown element not found on this page.");
      return;
    }

    const dropBtn = worksDropdown.querySelector(".nav__dropdown-toggle");
    if (!dropBtn) {
      console.log("[Dropdown] .nav__dropdown-toggle button not found inside dropdown.");
      return;
    }

    dropBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = worksDropdown.classList.toggle("is-open");
      console.log("[Dropdown] Toggle clicked. isOpen =", isOpen);
      dropBtn.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      if (!worksDropdown.contains(e.target)) {
        if (worksDropdown.classList.contains("is-open")) {
          console.log("[Dropdown] Clicked outside. Closing dropdown.");
          worksDropdown.classList.remove("is-open");
          dropBtn.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDropdown);
  } else {
    initDropdown();
  }

  // Fade-in on enter viewport
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
  );
  window.__siteIO = io;
  const observeAll = (root = document) => {
    root.querySelectorAll("img[data-fade]:not(.is-visible)").forEach((el) => io.observe(el));
  };
  window.__observeFade = observeAll;
  observeAll();

  // ============ Lightbox ============
  const lb = document.getElementById("lightbox");
  if (!lb) return;
  const lbImg = document.getElementById("lightbox-image");
  const lbCap = document.getElementById("lightbox-caption");
  const lbClose = lb.querySelector(".lightbox__close");
  const lbPrev = lb.querySelector(".lightbox__prev");
  const lbNext = lb.querySelector(".lightbox__next");

  const state = { items: [], idx: 0 };

  function render() {
    const it = state.items[state.idx];
    if (!it) return;
    lbImg.src = it.image;
    lbImg.alt = it.alt || "";
    lbCap.textContent = it.caption || "";
  }
  function open(items, idx) {
    state.items = items;
    state.idx = idx;
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    render();
  }
  function close() {
    lb.classList.remove("is-open");
    document.body.style.overflow = "";
    setTimeout(() => { lb.hidden = true; }, 250);
  }
  function step(delta) {
    if (!state.items.length) return;
    state.idx = (state.idx + delta + state.items.length) % state.items.length;
    render();
  }

  lbClose.addEventListener("click", close);
  lbPrev.addEventListener("click", () => step(-1));
  lbNext.addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });

  window.Lightbox = { open, close };
})();

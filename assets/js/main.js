(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const hidePreloader = () => {
    const preloader = document.querySelector(".preloader");
    if (!preloader) return;
    preloader.classList.add("is-hidden");
    window.setTimeout(() => preloader.remove(), 500);
  };

  if (reduceMotion) {
    hidePreloader();
  } else {
    const start = Date.now();
    const finish = () => {
      const wait = Math.max(0, 380 - (Date.now() - start));
      window.setTimeout(hidePreloader, wait);
    };
    if (document.readyState === "complete") finish();
    else {
      document.addEventListener("DOMContentLoaded", finish);
      window.addEventListener("load", finish);
    }
    window.setTimeout(hidePreloader, 1200);
  }

  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!reduceMotion) {
    const reveals = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    document.querySelectorAll(".stagger-group").forEach((group) => {
      [...group.children].forEach((child, index) => {
        child.style.setProperty("--stagger", String(index));
        if (!child.classList.contains("reveal")) child.classList.add("reveal");
      });
    });

    reveals.forEach((el) => io.observe(el));
    document.querySelectorAll(".stagger-group .reveal").forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  document.querySelectorAll(".btn, .filter-btn, .class-card .stretched-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (reduceMotion) return;
      btn.classList.add("is-pressed");
      window.setTimeout(() => btn.classList.remove("is-pressed"), 180);
    });
  });

  const filterButtons = document.querySelectorAll(".gallery-filters .filter-btn");
  const galleryCols = document.querySelectorAll(".gallery-grid .gallery-col");
  const galleryEmpty = document.querySelector(".gallery-empty");

  const applyGalleryFilter = (cat, updateHash = true) => {
    const allowed = new Set(["all", ...[...galleryCols].map((col) => col.dataset.category)]);
    const category = allowed.has(cat) || [...filterButtons].some((b) => b.dataset.filter === cat)
      ? cat
      : "all";

    filterButtons.forEach((button) => {
      const active = button.dataset.filter === category;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    let shown = 0;
    galleryCols.forEach((col, index) => {
      const match = category === "all" || col.dataset.category === category;
      col.style.transitionDelay = match ? `${index * 45}ms` : "0ms";
      if (match) {
        shown += 1;
        col.classList.remove("d-none");
        window.requestAnimationFrame(() => col.classList.remove("is-hidden"));
      } else {
        col.classList.add("is-hidden");
        window.setTimeout(() => {
          if (col.classList.contains("is-hidden")) col.classList.add("d-none");
        }, 380);
      }
    });

    if (galleryEmpty) galleryEmpty.classList.toggle("d-none", shown > 0);

    if (updateHash && filterButtons.length) {
      const hash = category === "all" ? "" : `#${category}`;
      if (location.hash !== hash) history.replaceState(null, "", `${location.pathname}${hash}`);
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyGalleryFilter(button.dataset.filter));
  });

  if (filterButtons.length) {
    const fromHash = decodeURIComponent((location.hash || "").replace("#", ""));
    applyGalleryFilter(fromHash || "all", false);
  }

  const galleryCards = [...document.querySelectorAll(".gallery-grid .gallery-card")];
  if (galleryCards.length) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", "Image viewer");
    lightbox.innerHTML = `
      <button type="button" class="lightbox-btn lightbox-close" aria-label="Close">&times;</button>
      <button type="button" class="lightbox-btn lightbox-prev" aria-label="Previous image">&#10094;</button>
      <img alt="">
      <button type="button" class="lightbox-btn lightbox-next" aria-label="Next image">&#10095;</button>
      <div class="lightbox-caption"></div>
    `;
    document.body.appendChild(lightbox);

    const imgEl = lightbox.querySelector("img");
    const captionEl = lightbox.querySelector(".lightbox-caption");
    let index = 0;
    let lastFocus = null;

    const visibleCards = () =>
      galleryCards.filter((card) => {
        const col = card.closest(".gallery-col");
        return col && !col.classList.contains("is-hidden") && !col.classList.contains("d-none");
      });

    const show = (i) => {
      const cards = visibleCards();
      if (!cards.length) return;
      index = (i + cards.length) % cards.length;
      const card = cards[index];
      const image = card.querySelector("img");
      imgEl.src = card.dataset.full || image.src;
      imgEl.alt = image.alt || "";
      captionEl.textContent = card.dataset.caption || image.alt || "";
    };

    const open = (i) => {
      lastFocus = document.activeElement;
      show(i);
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      lightbox.querySelector(".lightbox-close").focus();
    };

    const close = () => {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    galleryCards.forEach((card, i) => {
      card.addEventListener("click", (event) => {
        event.preventDefault();
        const cards = visibleCards();
        open(cards.indexOf(card) === -1 ? i : cards.indexOf(card));
      });
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.click();
        }
      });
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", close);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", () => show(index - 1));
    lightbox.querySelector(".lightbox-next").addEventListener("click", () => show(index + 1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
  }

  const form = document.querySelector(".enquiry-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      form.classList.add("d-none");
      const success = document.querySelector(".form-success");
      if (success) success.classList.add("is-shown");
    });
  }
})();

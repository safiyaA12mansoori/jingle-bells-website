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

  const filterButtons = document.querySelectorAll(".gallery-filters .filter-btn[data-filter]");
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

  const bindLightbox = () => {
    const grid = document.querySelector(".gallery-grid");
    if (!grid || grid.dataset.lightboxBound) return;
    grid.dataset.lightboxBound = "true";

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
    let touchX = 0;

    const visibleCards = () =>
      [...grid.querySelectorAll(".gallery-card")].filter((card) => {
        const col = card.closest(".gallery-col");
        return !col || (!col.classList.contains("is-hidden") && !col.classList.contains("d-none"));
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

    grid.addEventListener("click", (event) => {
      const card = event.target.closest(".gallery-card");
      if (!card || !grid.contains(card)) return;
      event.preventDefault();
      open(visibleCards().indexOf(card));
    });
    grid.addEventListener("keydown", (event) => {
      const card = event.target.closest(".gallery-card");
      if (!card) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", close);
    lightbox.querySelector(".lightbox-prev").addEventListener("click", () => show(index - 1));
    lightbox.querySelector(".lightbox-next").addEventListener("click", () => show(index + 1));
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) close();
    });
    lightbox.addEventListener("touchstart", (event) => {
      touchX = event.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener("touchend", (event) => {
      const dx = event.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) < 40) return;
      show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });

    document.addEventListener("keydown", (event) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") show(index - 1);
      if (event.key === "ArrowRight") show(index + 1);
    });
  };
  bindLightbox();

  const form = document.querySelector(".enquiry-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const parent = (form.querySelector("[name='parent']") || {}).value || "";
      const child = (form.querySelector("[name='child']") || {}).value || "";
      const age = (form.querySelector("[name='age']") || {}).value || "";
      const klass = (form.querySelector("[name='klass']") || {}).value || "";
      const phone = (form.querySelector("[name='phone']") || {}).value || "";
      const msg = (form.querySelector("[name='msg']") || {}).value || "";
      const text = [
        "Hello Jingle Bells, I would like to enquire about admission.",
        `Parent: ${parent}`,
        child ? `Child: ${child}` : "",
        age ? `Age: ${age}` : "",
        `Class: ${klass}`,
        `Mobile: ${phone}`,
        msg ? `Message: ${msg}` : ""
      ].filter(Boolean).join("\n");
      window.open(`https://wa.me/918329818881?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      const success = document.querySelector(".form-success");
      if (success) {
        success.classList.add("is-shown");
        success.textContent = "WhatsApp is opening with your enquiry. If it does not open, message 8329818881 directly.";
      }
    });
  }

  const yearEls = document.querySelectorAll("[data-year]");
  yearEls.forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  const moments = document.querySelector(".moments-line");
  if (moments) {
    const lines = JSON.parse(moments.dataset.lines || "[]");
    let lineIndex = 0;
    let timer = 0;
    const later = (fn, ms) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(fn, ms);
    };

    const paintLine = (text, revealCount) => {
      const words = text.split(/\s+/).filter(Boolean);
      moments.replaceChildren();
      words.forEach((word, idx) => {
        const span = document.createElement("span");
        span.className = "moments-word" + (idx < revealCount ? " is-in" : "");
        span.textContent = word;
        moments.appendChild(span);
      });
      const caret = document.createElement("span");
      caret.className = "moments-caret";
      caret.setAttribute("aria-hidden", "true");
      moments.appendChild(caret);
    };

    const playLine = () => {
      if (!lines.length) return;
      const text = lines[lineIndex];
      const words = text.split(/\s+/).filter(Boolean);
      moments.classList.toggle("is-final", lineIndex === lines.length - 1);
      moments.classList.add("is-on");

      if (reduceMotion) {
        paintLine(text, words.length);
        later(() => {
          lineIndex = (lineIndex + 1) % lines.length;
          playLine();
        }, 3200);
        return;
      }

      let shown = 0;
      const tick = () => {
        shown += 1;
        paintLine(text, shown);
        if (shown < words.length) {
          later(tick, 320);
        } else {
          later(() => {
            moments.classList.remove("is-on");
            later(() => {
              lineIndex = (lineIndex + 1) % lines.length;
              playLine();
            }, 420);
          }, 1600);
        }
      };
      paintLine(text, 0);
      later(tick, 80);
    };

    playLine();
  }

  const eventGrid = document.querySelector("[data-event-grid]");
  if (eventGrid && window.JB_EVENTS) {
    const filters = document.querySelectorAll("[data-event-filter]");
    const render = (cat) => {
      filters.forEach((btn) => {
        const on = btn.dataset.eventFilter === cat;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-pressed", on ? "true" : "false");
      });
      const showExtra = eventGrid.dataset.includeExtra === "true";
      eventGrid.innerHTML = window.JB_EVENTS.filter((ev) => (showExtra || !ev.extra) && (cat === "all" || ev.category === cat))
        .map((ev) => {
          const has = ev.photos && ev.photos.length;
          const href = has && ev.href ? ev.href : (has ? `gallery.html#${ev.id}` : ev.href);
          const img = ev.cover
            ? `<img src="${ev.cover}" alt="${ev.title} at Jingle Bells" loading="lazy">`
            : "";
          const note = has ? "" : `<p class="placeholder-note mb-0">Add photos in ${ev.placeholderFolder || "assets/events/" + ev.id + "/"}</p>`;
          return `<div class="col-md-6 col-lg-4">
            <a class="event-mosaic theme-${ev.theme} ${has ? "" : "is-placeholder"} reveal is-visible" href="${href}" data-event-id="${ev.id}">
              ${img}
              <div class="body">
                <h3>${ev.title}</h3>
                <p>${ev.description}</p>
                ${note}
              </div>
            </a>
          </div>`;
        }).join("");
    };
    filters.forEach((btn) => btn.addEventListener("click", () => render(btn.dataset.eventFilter)));
    render("all");
  }

  const album = document.querySelector("[data-event-album]");
  if (album && window.JB_EVENTS) {
    const id = decodeURIComponent((location.hash || "").replace("#", ""));
    const ev = window.JB_EVENTS.find((e) => e.id === id);
    const heading = document.querySelector("[data-event-heading]");
    const intro = document.querySelector("[data-event-intro]");
    if (ev && ev.photos && ev.photos.length) {
      if (heading) heading.textContent = ev.title;
      if (intro) intro.textContent = ev.description;
      album.innerHTML = ev.photos.map((photo) => `
        <div class="col-sm-6 col-lg-4 gallery-col">
          <a class="gallery-card reveal is-visible" href="#" data-caption="${ev.title}" tabindex="0">
            <img src="${photo.src}" alt="${photo.alt}" loading="lazy">
            <span class="gallery-overlay">${ev.title}</span>
          </a>
        </div>`).join("");
      album.classList.add("gallery-grid");
      bindLightbox();
    } else if (ev && heading) {
      heading.textContent = ev.title;
      if (intro) intro.textContent = `Add photographs to ${ev.placeholderFolder || "assets/events/" + ev.id + "/"} then list them in assets/js/events-data.js.`;
    }
  }

  const learn = document.querySelector("[data-learn]");
  if (learn) {
    const games = {
      abc: { prompt: "Tap the letter A", options: ["A", "M", "S", "B"], answer: "A" },
      count: { prompt: "How many stars? ★ ★ ★", options: ["2", "3", "5", "4"], answer: "3" },
      shapes: { prompt: "Which one is a circle?", options: ["▲", "■", "●", "★"], answer: "●" },
      colours: { prompt: "Which colour is the sky?", options: ["Blue", "Red", "Black", "Brown"], answer: "Blue" },
      nature: { prompt: "Which one is a fruit?", options: ["Carrot", "Mango", "Leaf", "Stone"], answer: "Mango" },
      animals: { prompt: "Which one can fly?", options: ["Fish", "Cow", "Sparrow", "Frog"], answer: "Sparrow" }
    };
    const promptEl = learn.querySelector("[data-learn-prompt]");
    const board = learn.querySelector("[data-learn-board]");
    const feedback = learn.querySelector("[data-learn-feedback]");
    const load = (key) => {
      const game = games[key] || games.abc;
      promptEl.textContent = game.prompt;
      feedback.textContent = "";
      board.innerHTML = game.options.map((opt) => `<button type="button" class="learn-chip" data-val="${opt}">${opt}</button>`).join("");
      board.querySelectorAll(".learn-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          const ok = chip.dataset.val === game.answer;
          chip.classList.add(ok ? "is-right" : "is-wrong");
          feedback.textContent = ok ? "Well done!" : "Try again — you can do it!";
        });
      });
    };
    learn.querySelectorAll("[data-learn-game]").forEach((btn) => {
      btn.addEventListener("click", () => load(btn.dataset.learnGame));
    });
    load("abc");
  }
})();

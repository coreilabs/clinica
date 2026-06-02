const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");

const updateStickyHeaderOffset = () => {
  if (!header) return;

  const headerHeight = Math.ceil(header.getBoundingClientRect().height);
  document.documentElement.style.setProperty("--sticky-header-offset", `${headerHeight}px`);
};

const getStickyHeaderHeight = () => {
  if (!header) return 0;

  return Math.ceil(header.getBoundingClientRect().height);
};

const closeNavigation = () => {
  if (!menuToggle || !nav) return;

  menuToggle.setAttribute("aria-expanded", "false");
  nav.classList.remove("open");
  document.body.classList.remove("nav-open");
};

const scrollToHashTarget = (hash, updateHistory = true) => {
  if (!hash || hash === "#") return false;

  const target = document.querySelector(hash);
  if (!target) return false;

  const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - getStickyHeaderHeight());
  const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

  window.scrollTo({ top, behavior });

  if (updateHistory) {
    window.history.pushState(null, "", hash);
  }

  return true;
};

updateStickyHeaderOffset();
window.addEventListener("load", () => {
  updateStickyHeaderOffset();

  if (window.location.hash) {
    requestAnimationFrame(() => scrollToHashTarget(window.location.hash, false));
  }
});
window.addEventListener("resize", updateStickyHeaderOffset);

if (header && "ResizeObserver" in window) {
  new ResizeObserver(updateStickyHeaderOffset).observe(header);
}

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    const clickedElement = event.target instanceof Element ? event.target : null;
    const anchor = clickedElement?.closest('a[href^="#"]');

    if (anchor instanceof HTMLAnchorElement) {
      const hash = anchor.getAttribute("href");
      event.preventDefault();
      closeNavigation();

      requestAnimationFrame(() => {
        scrollToHashTarget(hash);
      });
    }
  });
}

const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-tab");

    tabButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  });
});

if (window.lucide) {
  window.lucide.createIcons({
    attrs: {
      "aria-hidden": "true",
    },
  });
}

if (window.AOS) {
  document.documentElement.classList.add("aos-ready");
  window.AOS.init({
    once: true,
    duration: 720,
    easing: "ease-out-cubic",
    offset: 80,
    disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
}

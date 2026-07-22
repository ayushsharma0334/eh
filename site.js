(() => {
  const header = document.querySelector("nav");
  const toggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const currentPage = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  const heroReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const heroVideos = document.querySelectorAll(".hero-video[data-src]");

  const syncHeroVideos = () => {
    heroVideos.forEach((iframe) => {
      if (heroReducedMotion.matches) {
        iframe.src = "about:blank";
        return;
      }

      if (!iframe.getAttribute("src") || iframe.getAttribute("src") === "about:blank") {
        iframe.setAttribute("src", iframe.dataset.src);
      }
    });
  };

  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = (link.getAttribute("href") || "").split("#")[0].toLowerCase();
    if (href && href === currentPage) {
      link.setAttribute("aria-current", "page");
    }
  });

  const setNavOpen = (open) => {
    if (!header || !toggle || !navLinks) return;
    header.classList.toggle("nav-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  syncHeroVideos();

  if (typeof heroReducedMotion.addEventListener === "function") {
    heroReducedMotion.addEventListener("change", syncHeroVideos);
  } else if (typeof heroReducedMotion.addListener === "function") {
    heroReducedMotion.addListener(syncHeroVideos);
  }

  if (header && toggle && navLinks) {
    let navThemeFrame = 0;

    const setNavTheme = (theme) => {
      const nextTheme = theme === "dark" ? "dark" : "light";
      header.classList.toggle("nav-on-dark", nextTheme === "dark");
      header.classList.toggle("nav-on-light", nextTheme === "light");
    };

    const resolveNavTheme = () => {
      const navBottom = header.getBoundingClientRect().bottom;
      const probeY = Math.min(window.innerHeight - 1, Math.max(Math.round(navBottom + 12), 0));
      const probeX = Math.round(window.innerWidth / 2);
      const probeTarget = document.elementFromPoint(probeX, probeY);
      const themedContainer = probeTarget && probeTarget.closest("[data-nav-theme]");
      setNavTheme(themedContainer ? themedContainer.dataset.navTheme : "light");
    };

    const requestNavThemeSync = () => {
      if (navThemeFrame) return;
      navThemeFrame = window.requestAnimationFrame(() => {
        navThemeFrame = 0;
        resolveNavTheme();
      });
    };

    toggle.addEventListener("click", () => {
      setNavOpen(!header.classList.contains("nav-open"));
      requestNavThemeSync();
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setNavOpen(false);
        requestNavThemeSync();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setNavOpen(false);
        requestNavThemeSync();
      }
    });

    document.addEventListener("click", (event) => {
      if (!header.classList.contains("nav-open")) return;
      if (header.contains(event.target)) return;
      setNavOpen(false);
      requestNavThemeSync();
    });

    window.addEventListener("scroll", requestNavThemeSync, { passive: true });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setNavOpen(false);
      requestNavThemeSync();
    });

    window.addEventListener("load", requestNavThemeSync);
    requestNavThemeSync();

    // Scroll-position-based background: transparent at top, dark when scrolled
    const updateNavScrolled = () => {
      header.classList.toggle("nav-scrolled", window.scrollY > 80);
    };
    window.addEventListener("scroll", updateNavScrolled, { passive: true });
    updateNavScrolled();
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          instance.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add("visible"));
  }
})();

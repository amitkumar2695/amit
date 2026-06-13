const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a");
const filterButtons = document.querySelectorAll(".filter-btn");
const publicationItems = document.querySelectorAll(".publication-item");
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    publicationItems.forEach((item) => {
      const tags = item.dataset.tags || "";
      const shouldShow = filter === "all" || tags.includes(filter);
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-42% 0px -52% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

document.querySelectorAll("img").forEach((image) => {
  const fallback = image.classList.contains("portrait")
    ? image.parentElement.querySelector(".portrait-fallback")
    : null;

  const markLoaded = () => {
    image.classList.add("is-loaded");
    if (fallback) {
      fallback.style.display = "none";
    }
  };

  const markMissing = () => {
    image.classList.add("is-missing");
    if (fallback) {
      fallback.style.display = "grid";
    }
  };

  image.addEventListener("load", markLoaded);
  image.addEventListener("error", markMissing);

  if (image.complete) {
    if (image.naturalWidth > 0) {
      markLoaded();
    } else {
      markMissing();
    }
  }
});

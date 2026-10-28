
document.addEventListener("DOMContentLoaded", () => {
  const filters = document.querySelectorAll(".ev-filter");
  const items = document.querySelectorAll(".ev-item");
  const emptyMessage = document.querySelector(".ev-empty");

  // CATEGORY FILTERS
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.filter;
      let visibleCount = 0;

      filters.forEach((button) => {
        const isActive = button === filter;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });

      items.forEach((item) => {
        const shouldShow =
          category === "all" ||
          item.dataset.category === category;

        item.hidden = !shouldShow;

        if (shouldShow) {
          visibleCount++;
        }
      });

      if (emptyMessage) {
        emptyMessage.hidden = visibleCount !== 0;
      }
    });
  });

  // IMAGE LIGHTBOX
  const lightbox = document.getElementById("evLightbox");
  const lightboxImage = document.getElementById("evLightboxImage");
  const lightboxDate = document.getElementById("evLightboxDate");
  const lightboxDescription = document.getElementById(
    "evLightboxDescription"
  );
  const closeButton = document.getElementById("evLightboxClose");

  if (!lightbox || !lightboxImage || !closeButton) {
    return;
  }

  let previousFocus = null;

  function openLightbox(image) {
    previousFocus = document.activeElement;

    lightboxImage.src = image.dataset.full || image.src;
    lightboxImage.alt = image.alt || "Expanded evidence screenshot";

    lightboxDate.textContent = image.dataset.date || "";
    lightboxDescription.textContent =
      image.dataset.caption || image.alt || "";

    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");

    lightboxImage.src = "";
    document.body.style.overflow = "";

    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus();
    }
  }

  // Clicking the image or its expand/view button opens it.
  document.querySelectorAll(".ev-image").forEach((image) => {
    image.addEventListener("click", () => {
      openLightbox(image);
    });
  });

  document.querySelectorAll(".ev-expand, .ev-view").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".ev-item");
      const image = item?.querySelector(".ev-image");

      if (image) {
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener("click", closeLightbox);

  // Clicking the dark background closes the viewer.
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Escape closes the viewer.
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
});

// Image lightbox for the docs.
//
// Any image in the article body becomes clickable and opens in a full-screen
// modal, shown at its natural size but capped to fit the viewport. Images that
// are wrapped in a link are left alone. Close the modal with the Escape key,
// or by clicking the backdrop or the image.
//
// A single delegated click listener drives everything, so it keeps working
// across page loads without any per-page re-initialisation.
(function () {
  "use strict";

  var overlay, imgEl, lastFocused;

  function buildModal() {
    overlay = document.createElement("div");
    overlay.className = "lightbox-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Image viewer");
    overlay.tabIndex = -1;
    overlay.hidden = true;

    imgEl = document.createElement("img");
    imgEl.className = "lightbox-img";

    overlay.appendChild(imgEl);
    document.body.appendChild(overlay);

    // Any click inside the viewer closes it — the backdrop or the image itself.
    overlay.addEventListener("click", close);
  }

  // Eligible = a content image (inside the typeset article body) that isn't
  // itself part of a link.
  function isZoomable(el) {
    return (
      el &&
      el.tagName === "IMG" &&
      el.closest(".md-typeset") !== null &&
      el.closest("a") === null
    );
  }

  function open(sourceImg) {
    if (!overlay) buildModal();
    lastFocused = document.activeElement;
    imgEl.src = sourceImg.currentSrc || sourceImg.src;
    imgEl.alt = sourceImg.alt || "";
    overlay.hidden = false;
    document.body.classList.add("lightbox-open");
    overlay.focus();
  }

  function close() {
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    imgEl.removeAttribute("src");
    document.body.classList.remove("lightbox-open");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus({ preventScroll: true });
    }
  }

  document.addEventListener("click", function (event) {
    if (isZoomable(event.target)) {
      event.preventDefault();
      open(event.target);
    }
  });

  document.addEventListener("keydown", function (event) {
    // close() is a no-op when the viewer isn't open, so no extra guard needed.
    if (event.key === "Escape") close();
  });
})();

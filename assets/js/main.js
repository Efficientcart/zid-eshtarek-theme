/**
 * Theme Entry Point — Eshtarek Subscription Theme
 *
 * Initializes all theme features based on page context.
 * Uses event-based architecture for dynamic content.
 *
 * Changes from Growth theme:
 * - Removed: cart initialization (initCart, initCartButtons)
 * - Removed: cart-related event listeners (products:updated)
 * - Removed: wishlist, bundle-offers, loyalty-rewards (one-time commerce)
 * - Added: Eshtarek subscription module (loaded via separate entry point)
 *
 * Events:
 * - content:loaded      — Dispatch when new content is added (e.g., AJAX, quick view)
 * - eshtarek:ready      — Dispatched when Eshtarek SDK is initialized
 * - eshtarek:checkout:created — Dispatched when checkout session is created
 */

import { createCarousel, createConditionalCarousel } from "./lib/carousel.js";
import { initAllProductGalleries } from "./product/gallery.js";

// Product modules (self-initializing, register global callbacks)
import "./product/variants.js";
import "./product/quick-view.js";
import "./product/lightbox.js";
import "./product/sticky-bar.js";

// Feature modules (self-initializing)
import "./features/layout.js";
import "./features/search.js";
import "./features/qty-input.js";
import "./features/phone-input.js";
import "./features/product-filter.js";
import "./features/price-slider.js";
import "./features/notify-me.js";
// Removed: wishlist.js (one-time commerce — no wishlists for subscriptions)
// Removed: bundle-offers.js (one-time commerce — Zid bundle system)
// Removed: loyalty-rewards.js (one-time commerce — subscriptions handle retention differently)

// Store for initialized carousel instances (for cleanup)
const carouselInstances = new WeakMap();

/**
 * Initialize all carousels with data-carousel attribute
 */
function initCarousels() {
  document.querySelectorAll("[data-carousel]").forEach((container) => {
    // Skip if already initialized
    if (carouselInstances.has(container)) return;

    const options = {
      loop: container.dataset.carouselLoop === "true",
      fade: container.dataset.carouselFade === "true",
      autoplay: container.dataset.carouselAutoplay ? parseInt(container.dataset.carouselAutoplay) : false,
      autoScroll: container.dataset.carouselAutoscroll ? parseFloat(container.dataset.carouselAutoscroll) : false,
      align: container.dataset.carouselAlign || "start",
      dragFree: container.dataset.carouselDragfree === "true"
    };

    // Conditional carousel (only init when content overflows)
    if (container.dataset.carouselConditional === "true") {
      const controlsEl = container.parentElement?.querySelector("[data-carousel-controls]");
      const instance = createConditionalCarousel(container, options, controlsEl);
      if (instance) {
        carouselInstances.set(container, instance);
      }
    } else {
      // Regular carousel
      const instance = createCarousel(container, options);
      if (instance) {
        carouselInstances.set(container, instance);
      }
    }
  });
}

/**
 * Initialize theme
 */
function init() {
  const page = document.body.dataset.template;
  console.log("[Eshtarek Theme] Initializing for page:", page);

  // Initialize carousels
  initCarousels();

  // Initialize product galleries (product page, quick view)
  initAllProductGalleries();

  // Note: Cart initialization removed — subscriptions use Eshtarek checkout
  // Eshtarek SDK is loaded via separate subscription.js entry point
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// Re-init when new content is loaded (AJAX, quick view, etc.)
window.addEventListener("content:loaded", () => {
  initCarousels();
  initAllProductGalleries();
});

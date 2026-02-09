/**
 * Eshtarek Subscription Module — Entry Point
 *
 * Initializes the Eshtarek SDK for subscription-native theme.
 * This replaces the cart controller from the original Growth theme.
 *
 * Flow:
 * 1. Read Eshtarek config from layout settings (injected in layout.jinja)
 * 2. Initialize Eshtarek session via platform init
 * 3. Auto-detect product pages and init plan selector + checkout
 * 4. Expose global API for other components
 *
 * Config expected on window.eshtarekConfig:
 *   - storeId: string     (from layout.schema.json eshtarek.store_id)
 *   - apiUrl: string      (from layout.schema.json eshtarek.api_url)
 *   - portalUrl: string   (from layout.schema.json eshtarek.portal_url)
 */

import { initPlanSelector } from "./plan-selector.js";
import { initCheckout } from "./checkout.js";

const DEFAULT_API_URL = "https://api.eshtarek.com";
const DEFAULT_PORTAL_URL = "https://portal.eshtarek.com";

/**
 * Eshtarek SDK wrapper for theme integration
 */
class EshtarekTheme {
  constructor(config) {
    this.storeId = config.storeId;
    this.apiUrl = config.apiUrl || DEFAULT_API_URL;
    this.portalUrl = config.portalUrl || DEFAULT_PORTAL_URL;
    this.session = null;
    this.sdk = null;
    this.ready = false;

    console.log("[Eshtarek] Initializing for store:", this.storeId);
  }

  /**
   * Initialize SDK and restore session from Zid platform init.
   * Called once on page load.
   */
  async init() {
    if (!this.storeId) {
      console.warn("[Eshtarek] No store ID configured. Set eshtarek_store_id in theme settings.");
      return;
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/platform/zid/init/${this.storeId}/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error(`Platform init failed: ${response.status}`);
      }

      const data = await response.json();
      this.session = data;
      this.ready = true;

      console.log("[Eshtarek] Session restored successfully");

      window.dispatchEvent(
        new CustomEvent("eshtarek:ready", { detail: { session: this.session } })
      );
    } catch (error) {
      console.error("[Eshtarek] Initialization failed:", error);

      window.dispatchEvent(
        new CustomEvent("eshtarek:error", { detail: { error } })
      );
    }
  }

  /**
   * Get subscription plans for a product.
   * @param {string} productId - Zid product ID
   * @returns {Promise<Array>} Available subscription plans
   */
  async getPlans(productId) {
    if (!this.ready) {
      console.warn("[Eshtarek] SDK not ready. Call init() first.");
      return [];
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/api/v1/plans/?product_id=${productId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Session-Token": this.session?.token || ""
          },
          credentials: "include"
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.status}`);
      }

      const data = await response.json();
      return data.plans || data.results || [];
    } catch (error) {
      console.error("[Eshtarek] Failed to fetch plans:", error);
      return [];
    }
  }

  /**
   * Create a checkout session for a selected plan.
   * @param {Object} options
   * @param {string} options.planId - Selected plan ID
   * @param {string} options.frequency - Selected frequency
   * @param {string} options.productId - Zid product ID
   * @returns {Promise<Object>} Checkout session data
   */
  async createCheckout({ planId, frequency, productId }) {
    if (!this.ready) {
      console.warn("[Eshtarek] SDK not ready. Call init() first.");
      return null;
    }

    try {
      const response = await fetch(
        `${this.apiUrl}/api/v1/checkout/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Session-Token": this.session?.token || ""
          },
          credentials: "include",
          body: JSON.stringify({
            plan_id: planId,
            frequency,
            product_id: productId,
            store_id: this.storeId
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Checkout creation failed: ${response.status}`);
      }

      const data = await response.json();

      window.dispatchEvent(
        new CustomEvent("eshtarek:checkout:created", { detail: data })
      );

      return data;
    } catch (error) {
      console.error("[Eshtarek] Checkout creation failed:", error);

      window.dispatchEvent(
        new CustomEvent("eshtarek:checkout:error", { detail: { error } })
      );

      return null;
    }
  }

  /**
   * Get the customer portal URL for subscription management.
   * @returns {string} Portal URL
   */
  getPortalUrl() {
    return this.portalUrl;
  }
}

/**
 * Initialize Eshtarek when DOM is ready
 */
function initEshtarek() {
  const config = window.eshtarekConfig || {};

  if (!config.storeId) {
    console.warn(
      "[Eshtarek] window.eshtarekConfig.storeId not set.",
      "Configure eshtarek_store_id in theme layout settings."
    );
    return;
  }

  const eshtarek = new EshtarekTheme(config);

  // Expose globally for plan selector + checkout components
  window.Eshtarek = eshtarek;

  // Auto-initialize session
  eshtarek.init();

  // Auto-init plan selector if on product page
  const planSelectorEl = document.querySelector("[data-eshtarek-plans]");
  if (planSelectorEl) {
    const productId = planSelectorEl.dataset.productId;
    if (productId) {
      initPlanSelector(productId);
    }
  }

  // Always init checkout module (listens for subscribe events)
  initCheckout();
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initEshtarek);
} else {
  initEshtarek();
}

export { EshtarekTheme };

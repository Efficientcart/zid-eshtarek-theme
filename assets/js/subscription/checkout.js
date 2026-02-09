/**
 * Checkout Module
 *
 * Handles the Eshtarek checkout flow after plan selection.
 * Supports two modes:
 * 1. Embedded (iframe) - checkout loads inside a modal dialog
 * 2. Redirect - navigates to external checkout URL
 *
 * Listens for:
 *   eshtarek:subscribe - Triggered by plan-selector when user clicks Subscribe
 *
 * DOM Dependencies (from embedded-checkout.jinja):
 *   #eshtarek-checkout-dialog      - The <dialog> element
 *   [data-checkout-loading]        - Loading spinner
 *   [data-checkout-iframe-container] - Iframe wrapper
 *   [data-checkout-iframe]         - The iframe element
 *   [data-checkout-success]        - Success state
 *   [data-checkout-error]          - Error state
 *   [data-checkout-close]          - Close buttons
 *   [data-checkout-retry]          - Retry button
 */

/**
 * Initialize checkout module.
 */
export function initCheckout() {
  const dialog = document.getElementById("eshtarek-checkout-dialog");
  if (!dialog) return;

  const els = {
    dialog,
    loading: dialog.querySelector("[data-checkout-loading]"),
    iframeContainer: dialog.querySelector("[data-checkout-iframe-container]"),
    iframe: dialog.querySelector("[data-checkout-iframe]"),
    success: dialog.querySelector("[data-checkout-success]"),
    error: dialog.querySelector("[data-checkout-error]"),
    closeButtons: dialog.querySelectorAll("[data-checkout-close]"),
    retryBtn: dialog.querySelector("[data-checkout-retry]"),
    manageLink: dialog.querySelector("[data-checkout-manage-link]")
  };

  // Store last checkout params for retry
  let lastCheckoutParams = null;

  // Close button handlers
  els.closeButtons.forEach(btn => {
    btn.addEventListener("click", () => closeCheckout(els));
  });

  // Close on backdrop click
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) closeCheckout(els);
  });

  // Close on Escape
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeCheckout(els);
  });

  // Retry handler
  els.retryBtn?.addEventListener("click", () => {
    if (lastCheckoutParams) {
      startCheckout(lastCheckoutParams, els);
    }
  });

  // Listen for subscribe events from plan selector
  window.addEventListener("eshtarek:subscribe", async (e) => {
    lastCheckoutParams = e.detail;
    startCheckout(e.detail, els);
  });

  // Listen for postMessage from iframe (checkout completion)
  window.addEventListener("message", (e) => {
    handleCheckoutMessage(e, els);
  });
}

/**
 * Start the checkout flow.
 */
async function startCheckout(params, els) {
  // Open dialog and show loading
  els.dialog.showModal();
  showCheckoutLoading(els);

  // Update subscribe button to loading state
  const subscribeBtn = document.querySelector("[data-subscribe-btn]");
  if (subscribeBtn) {
    subscribeBtn.querySelector("[data-subscribe-btn-text]")?.classList.add("hidden");
    subscribeBtn.querySelector("[data-subscribe-btn-loading]")?.classList.remove("hidden");
    subscribeBtn.disabled = true;
  }

  try {
    const result = await window.Eshtarek.createCheckout({
      planId: params.planId,
      frequency: params.frequency,
      productId: params.productId
    });

    if (!result) {
      throw new Error("No checkout data returned");
    }

    // Determine checkout mode
    if (result.checkout_url) {
      if (result.embed === false) {
        // Redirect mode — close dialog and navigate
        closeCheckout(els);
        window.location.href = result.checkout_url;
        return;
      }

      // Iframe mode — load checkout URL in iframe
      els.iframe.src = result.checkout_url;
      showCheckoutIframe(els);
    } else {
      throw new Error("No checkout URL in response");
    }
  } catch (error) {
    console.error("[Eshtarek] Checkout failed:", error);
    showCheckoutError(els);
  } finally {
    // Reset subscribe button
    if (subscribeBtn) {
      subscribeBtn.querySelector("[data-subscribe-btn-text]")?.classList.remove("hidden");
      subscribeBtn.querySelector("[data-subscribe-btn-loading]")?.classList.add("hidden");
      subscribeBtn.disabled = false;
    }
  }
}

/**
 * Handle postMessage events from the checkout iframe.
 */
function handleCheckoutMessage(event, els) {
  // Only handle messages from Eshtarek domains
  const eshtarekConfig = window.eshtarekConfig || {};
  const allowedOrigins = [
    eshtarekConfig.apiUrl,
    eshtarekConfig.portalUrl,
    "https://checkout.eshtarek.com",
    "https://api.eshtarek.com"
  ].filter(Boolean);

  if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) {
    return;
  }

  const data = event.data;

  if (data?.type === "eshtarek:checkout:complete" || data?.status === "success") {
    showCheckoutSuccess(els);
    window.dispatchEvent(
      new CustomEvent("eshtarek:checkout:complete", { detail: data })
    );
  } else if (data?.type === "eshtarek:checkout:error" || data?.status === "error") {
    showCheckoutError(els);
  } else if (data?.type === "eshtarek:checkout:close") {
    closeCheckout(els);
  }
}

/** Close dialog and reset states */
function closeCheckout(els) {
  els.dialog.close();
  els.iframe.src = "";
  // Reset all states after animation
  setTimeout(() => {
    showCheckoutLoading(els);
  }, 300);
}

/** State toggles */
function showCheckoutLoading(els) {
  els.loading.classList.remove("hidden");
  els.iframeContainer.classList.add("hidden");
  els.success.classList.add("hidden");
  els.error.classList.add("hidden");
}

function showCheckoutIframe(els) {
  els.loading.classList.add("hidden");
  els.iframeContainer.classList.remove("hidden");
  els.success.classList.add("hidden");
  els.error.classList.add("hidden");
}

function showCheckoutSuccess(els) {
  els.loading.classList.add("hidden");
  els.iframeContainer.classList.add("hidden");
  els.success.classList.remove("hidden");
  els.error.classList.add("hidden");
}

function showCheckoutError(els) {
  els.loading.classList.add("hidden");
  els.iframeContainer.classList.add("hidden");
  els.success.classList.add("hidden");
  els.error.classList.remove("hidden");
}

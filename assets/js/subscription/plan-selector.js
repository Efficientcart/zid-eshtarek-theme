/**
 * Plan Selector Module
 *
 * Fetches subscription plans from Eshtarek API and renders interactive
 * plan cards on the product page. Handles plan selection, frequency
 * picking, and triggers checkout.
 *
 * DOM Dependencies (from plan-selector.jinja):
 *   [data-eshtarek-plans]       - Root container with data-product-id
 *   [data-plans-loading]        - Loading skeleton
 *   [data-plans-error]          - Error state
 *   [data-plans-container]      - Plans wrapper (shown after load)
 *   [data-plans-list]           - Where plan cards are injected
 *   [data-frequency-picker]     - Frequency selector wrapper
 *   [data-frequency-options]    - Where frequency buttons go
 *   [data-plan-summary]         - Selected plan summary
 *   [data-subscribe-btn]        - Subscribe CTA
 */

import { formatPrice, t } from "./utils.js";

/** @type {Object|null} Currently selected plan */
let selectedPlan = null;

/** @type {string|null} Currently selected frequency */
let selectedFrequency = null;

/**
 * Initialize plan selector for a product.
 * @param {string} productId - Zid product ID
 */
export async function initPlanSelector(productId) {
  const root = document.querySelector("[data-eshtarek-plans]");
  if (!root) return;

  const els = {
    loading: root.querySelector("[data-plans-loading]"),
    error: root.querySelector("[data-plans-error]"),
    container: root.querySelector("[data-plans-container]"),
    list: root.querySelector("[data-plans-list]"),
    frequencyPicker: root.querySelector("[data-frequency-picker]"),
    frequencyOptions: root.querySelector("[data-frequency-options]"),
    summary: root.querySelector("[data-plan-summary]"),
    subscribeBtn: root.querySelector("[data-subscribe-btn]"),
    empty: root.querySelector("[data-plans-empty]"),
    retryBtn: root.querySelector("[data-plans-retry]")
  };

  // Retry handler
  els.retryBtn?.addEventListener("click", () => loadPlans(productId, els));

  // Subscribe button handler
  els.subscribeBtn?.addEventListener("click", () => {
    if (!selectedPlan || !selectedFrequency) return;
    window.dispatchEvent(
      new CustomEvent("eshtarek:subscribe", {
        detail: {
          planId: selectedPlan.id,
          frequency: selectedFrequency,
          productId,
          plan: selectedPlan
        }
      })
    );
  });

  // Wait for Eshtarek SDK to be ready
  if (window.Eshtarek?.ready) {
    loadPlans(productId, els);
  } else {
    window.addEventListener("eshtarek:ready", () => loadPlans(productId, els), { once: true });
    window.addEventListener("eshtarek:error", () => showError(els), { once: true });
  }
}

/**
 * Fetch and render plans.
 */
async function loadPlans(productId, els) {
  showLoading(els);

  try {
    const plans = await window.Eshtarek.getPlans(productId);

    if (!plans || plans.length === 0) {
      showEmpty(els);
      return;
    }

    renderPlans(plans, els);
    showContainer(els);

    // Auto-select first plan
    selectPlan(plans[0], els);
  } catch (error) {
    console.error("[Eshtarek] Failed to load plans:", error);
    showError(els);
  }
}

/**
 * Render plan cards into the list.
 */
function renderPlans(plans, els) {
  els.list.innerHTML = "";

  plans.forEach((plan, index) => {
    const card = document.createElement("div");
    card.className = [
      "relative cursor-pointer rounded-lg border-2 p-4 transition-all",
      "hover:border-primary/50",
      "data-[selected]:border-primary data-[selected]:bg-primary/5"
    ].join(" ");
    card.dataset.planCard = plan.id;

    const popularBadge = plan.is_popular || index === 0
      ? `<span class="bg-primary text-primary-foreground absolute -top-2.5 rounded-full px-2 py-0.5 text-xs font-medium ltr:right-3 rtl:left-3">${t("mostPopular")}</span>`
      : "";

    const savingsBadge = plan.savings_percent
      ? `<span class="text-xs font-medium text-green-600">${t("savePercent").replace("%s", plan.savings_percent)}</span>`
      : "";

    card.innerHTML = `
      ${popularBadge}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="flex size-5 items-center justify-center rounded-full border-2 border-current transition-colors" data-plan-radio>
            <div class="size-2.5 rounded-full bg-current scale-0 transition-transform" data-plan-radio-dot></div>
          </div>
          <div>
            <p class="text-foreground text-sm font-medium">${plan.name}</p>
            ${plan.description ? `<p class="text-muted-foreground text-xs">${plan.description}</p>` : ""}
          </div>
        </div>
        <div class="text-end">
          <p class="text-foreground text-sm font-semibold">${formatPrice(plan.price, plan.currency)}</p>
          ${savingsBadge}
        </div>
      </div>
    `;

    card.addEventListener("click", () => selectPlan(plan, els));
    els.list.appendChild(card);
  });
}

/**
 * Handle plan selection.
 */
function selectPlan(plan, els) {
  selectedPlan = plan;

  // Update card states
  els.list.querySelectorAll("[data-plan-card]").forEach(card => {
    const isSelected = card.dataset.planCard === plan.id;
    if (isSelected) {
      card.dataset.selected = "";
      card.querySelector("[data-plan-radio-dot]").style.transform = "scale(1)";
    } else {
      delete card.dataset.selected;
      card.querySelector("[data-plan-radio-dot]").style.transform = "scale(0)";
    }
  });

  // Render frequencies if plan has them
  if (plan.frequencies && plan.frequencies.length > 1) {
    renderFrequencies(plan.frequencies, els);
    els.frequencyPicker.classList.remove("hidden");
  } else {
    els.frequencyPicker.classList.add("hidden");
    // Auto-select the single frequency
    selectedFrequency = plan.frequencies?.[0]?.value || plan.frequency || "monthly";
  }

  updateSummary(els);
  enableSubscribe(els);
}

/**
 * Render frequency options for selected plan.
 */
function renderFrequencies(frequencies, els) {
  els.frequencyOptions.innerHTML = "";
  selectedFrequency = frequencies[0].value;

  frequencies.forEach(freq => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = [
      "rounded-full border px-4 py-1.5 text-xs font-medium transition-all",
      "hover:border-primary/50",
      "data-[selected]:border-primary data-[selected]:bg-primary data-[selected]:text-primary-foreground"
    ].join(" ");
    btn.textContent = freq.label;
    btn.dataset.frequency = freq.value;

    if (freq.value === selectedFrequency) {
      btn.dataset.selected = "";
    }

    btn.addEventListener("click", () => {
      selectedFrequency = freq.value;
      els.frequencyOptions.querySelectorAll("[data-frequency]").forEach(b => {
        delete b.dataset.selected;
      });
      btn.dataset.selected = "";
      updateSummary(els);
    });

    els.frequencyOptions.appendChild(btn);
  });
}

/**
 * Update the plan summary display.
 */
function updateSummary(els) {
  if (!selectedPlan) return;

  const summaryName = els.summary.querySelector("[data-summary-plan-name]");
  const summaryFreq = els.summary.querySelector("[data-summary-frequency]");
  const summaryPrice = els.summary.querySelector("[data-summary-price]");
  const summaryShipping = els.summary.querySelector("[data-summary-shipping]");

  if (summaryName) summaryName.textContent = selectedPlan.name;
  if (summaryFreq) summaryFreq.textContent = selectedFrequency || "";
  if (summaryPrice) summaryPrice.textContent = formatPrice(selectedPlan.price, selectedPlan.currency);
  if (summaryShipping) {
    summaryShipping.classList.toggle("hidden", !selectedPlan.free_shipping);
  }

  els.summary.classList.remove("hidden");
}

/** Enable the subscribe button */
function enableSubscribe(els) {
  els.subscribeBtn.disabled = false;
}

/** Show/hide states */
function showLoading(els) {
  els.loading.classList.remove("hidden");
  els.error.classList.add("hidden");
  els.container.classList.add("hidden");
  els.empty.classList.add("hidden");
}

function showError(els) {
  els.loading.classList.add("hidden");
  els.error.classList.remove("hidden");
  els.container.classList.add("hidden");
  els.empty.classList.add("hidden");
}

function showContainer(els) {
  els.loading.classList.add("hidden");
  els.error.classList.add("hidden");
  els.container.classList.remove("hidden");
  els.empty.classList.add("hidden");
}

function showEmpty(els) {
  els.loading.classList.add("hidden");
  els.error.classList.add("hidden");
  els.container.classList.add("hidden");
  els.empty.classList.remove("hidden");
}

/**
 * Shared utilities for subscription modules.
 */

/**
 * Get a translated string from the Eshtarek translations object.
 * Falls back to the key if translation not found.
 *
 * @param {string} key - Translation key (camelCase)
 * @returns {string} Translated string
 */
export function t(key) {
  return window.eshtarekTranslations?.[key] || key;
}

/**
 * Format a price with currency.
 * Uses the store's locale for formatting.
 *
 * @param {number} price - Price amount
 * @param {string} [currency='SAR'] - Currency code
 * @returns {string} Formatted price string
 */
export function formatPrice(price, currency = "SAR") {
  try {
    const locale = document.documentElement.lang || "ar-SA";
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2
    }).format(price);
  } catch {
    // Fallback for unsupported currencies
    return `${price} ${currency}`;
  }
}

/**
 * Format a frequency label for display.
 *
 * @param {string} frequency - Frequency value (e.g., 'monthly', 'weekly', 'every_14_days')
 * @returns {string} Human-readable frequency label
 */
export function formatFrequency(frequency) {
  const map = {
    daily: t("perDay") || "/day",
    weekly: t("perWeek") || "/week",
    biweekly: `${t("every")} 2 ${t("weeks") || "weeks"}`,
    monthly: t("perMonth") || "/month",
    bimonthly: `${t("every")} 2 ${t("months") || "months"}`,
    quarterly: `${t("every")} 3 ${t("months") || "months"}`,
    yearly: t("perYear") || "/year"
  };

  return map[frequency] || frequency;
}

/**
 * Layout Manager
 *
 * Handles global layout functionality including:
 * - Announcement bar height tracking
 * - Login/logout state management
 * - Customer greeting updates
 * - Locale/region navigation
 */

(function () {
  // ============================================
  // Announcement Bar
  // ============================================

  function initAnnouncementBar() {
    const bar = document.querySelector("[data-announcement-bar]");
    if (bar) {
      const updateHeight = () => {
        document.body.style.setProperty("--announcement-bar-h", bar.offsetHeight + "px");
      };
      updateHeight();
      window.addEventListener("resize", updateHeight);
    }
  }

  // ============================================
  // Login/Account Management
  // ============================================

  // Login action handler
  window.handleLoginAction = function () {
    window.location.href = window.layoutConfig?.profileUrl || "/account-profile";
  };

  // Customer-aware greeting - update UI when customer is logged in
  document.addEventListener("zid-customer-fetched", function (event) {
    const customer = event.detail.customer;
    if (customer && customer.name) {
      // Desktop header
      const headerLoginBtn = document.getElementById("header-login-btn");
      const headerProfileBtn = document.getElementById("header-profile-btn");
      if (headerLoginBtn) headerLoginBtn.style.display = "none";
      if (headerProfileBtn) {
        headerProfileBtn.classList.remove("hidden");
        headerProfileBtn.classList.add("flex");
      }

      // Mobile drawer
      const mobileLoginBtn = document.getElementById("mobile-login-btn");
      const mobileLoggedInLinks = document.getElementById("mobile-logged-in-links");
      if (mobileLoginBtn) mobileLoginBtn.style.display = "none";
      if (mobileLoggedInLinks) {
        mobileLoggedInLinks.classList.remove("hidden");
        mobileLoggedInLinks.classList.add("flex");
      }
    }
  });

  // ============================================
  // Locale/Region Navigation
  // ============================================

  // Desktop locale form submission
  function initLocaleForms() {
    document.querySelectorAll("[data-locale-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        const countrySelect = form.querySelector('[name="country"]');
        const languageSelect = form.querySelector('[name="language"]');

        const config = window.layoutConfig || {};
        const selectedCountry = countrySelect ? countrySelect.value : config.currentCountry;
        const selectedLanguage = languageSelect ? languageSelect.value : config.currentLanguage;

        navigateToLocale(selectedCountry, selectedLanguage);
      });
    });
  }

  // Mobile locale selection functions
  window.selectMobileCountry = function (countryCode) {
    const config = window.layoutConfig || {};
    navigateToLocale(countryCode, config.currentLanguage);
  };

  window.selectMobileLanguage = function (languageCode) {
    const config = window.layoutConfig || {};
    navigateToLocale(config.currentCountry, languageCode);
  };

  // Common locale navigation function
  function navigateToLocale(countryCode, languageCode) {
    const config = window.layoutConfig || {};
    const defaultCountryCode = config.defaultCountryCode || "";
    const currentLanguage = config.currentLanguage || "ar";
    const currentCountry = config.currentCountry || "";

    const newLocale =
      languageCode.toLowerCase() +
      (countryCode.toLowerCase() === defaultCountryCode ? "" : "-" + countryCode.toLowerCase());

    const currentLocale = currentLanguage.toLowerCase() + "-" + currentCountry.toLowerCase();
    const pathParts = window.location.pathname.split("/");

    if (
      pathParts.length > 1 &&
      (pathParts[1].toLowerCase() === currentLanguage.toLowerCase() || pathParts[1].toLowerCase() === currentLocale)
    ) {
      pathParts[1] = newLocale;
    } else {
      pathParts.splice(1, 0, newLocale);
    }

    window.location.href = "/locales/" + newLocale + "?redirect_to=" + encodeURI(pathParts.join("/"));
  }

  // ============================================
  // Initialize on DOM Ready
  // ============================================

  document.addEventListener("DOMContentLoaded", function () {
    initAnnouncementBar();
    initLocaleForms();
  });
})();

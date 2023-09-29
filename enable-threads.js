(async function () {
  if (window.crossOriginIsolated !== false) return;

  let registration = await navigator.serviceWorker
    .register(window.document.currentScript.src)
    .catch((e) =>
      console.error("COOP/COEP Service Worker failed to register:", e)
    );
  if (registration) {
    console.log("COOP/COEP Service Worker registered", registration.scope);

    registration.addEventListener("updatefound", () => {
      console.log(
        "Reloading page to make use of updated COOP/COEP Service Worker."
      );
      window.location.reload();
    });

    // If the registration is active, but it's not controlling the page
    if (registration.active && !navigator.serviceWorker.controller) {
      console.log("Reloading page to make use of COOP/COEP Service Worker.");
      window.location.reload();
    }
  }
})();

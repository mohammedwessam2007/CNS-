/* INTELLECTUALITY v18.14.1 · one save per tap.
 * Owner, 18 Oct 2026: "the menu is clicking on its own … it's very laggy". One tap on a lesson button saved the
 * whole progress (≈740 KB) three times, once per layer that reacts to the tap, about 160 ms each on a slow phone,
 * while the page was scrolling. A tap now opens a short burst: the saves asked for during it become one save, made
 * just after the screen has changed. Nothing waits longer than that: the save is made at once if the page is hidden
 * or closed, or if anything reads the saved progress, and saves asked for outside a tap are made at once as before. */
(function () {
  "use strict";
  if (window.IX_SAVE_BATCH || typeof save !== "function") return;
  const KEY = "intellectuality_v41_launch_state",
    TWIN_KEY = "intellectuality_learning_twin_v1";
  const real = save;
  let burst = false,
    pending = false,
    timer = null,
    arming = false,
    flushing = false,
    asked = 0,
    made = 0;
  function flush() {
    if (timer) clearTimeout(timer);
    timer = null;
    arming = false;
    burst = false;
    if (!pending || flushing) return;
    pending = false;
    flushing = true;
    made++;
    try {
      real();
    } finally {
      flushing = false;
    }
  }
  function arm() {
    // after the tasks the tap queued (the other layers react with setTimeout 0), then a short quiet gap
    if (arming) return;
    arming = true;
    setTimeout(function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(flush, 150);
    }, 0);
  }
  save = function () {
    asked++;
    if (!burst || flushing) {
      made++;
      return real.apply(this, arguments);
    }
    pending = true;
    arm();
  };
  // a tap: the finger or button lifting (a lesson step answers on finger-up and cancels the click), or a click
  const open = function () {
    burst = true;
  };
  window.addEventListener("pointerup", open, true);
  window.addEventListener("click", open, true);
  // whoever reads the saved progress gets it as it is now. The learning twin re-reads its own copy after every
  // redraw (and keeps the newer of the two), so a waiting save writes the twin's copy first; the progress itself
  // still waits for the one save of the tap.
  const getItem = Storage.prototype.getItem;
  Storage.prototype.getItem = function (k) {
    if (pending && !flushing && this === window.localStorage) {
      if (k === KEY) flush();
      else if (k === TWIN_KEY) {
        const T = window.INTELLECTUALITY_TWIN;
        if (T && typeof T.persist === "function") T.persist();
        else flush();
      }
    }
    return getItem.apply(this, arguments);
  };
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);
  window.addEventListener("beforeunload", flush);
  window.IX_SAVE_BATCH = { flush: flush, stats: () => ({ asked: asked, made: made, pending: pending }) };
})();

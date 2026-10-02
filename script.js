/* ═══════════════════════════════════════════════════════════════
   CINEMATIC LOVE STORIES — Static Script
   Scene transitions, RSVP, scroll reveals
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  // ── Scene management ──
  var openingScene = document.getElementById("opening-scene");
  var envelopeScene = document.getElementById("envelope-scene");
  var titleScene = document.getElementById("title-scene");
  var storyContent = document.getElementById("story-content");

  var openingText = document.getElementById("opening-text");
  var openingBtn = document.getElementById("opening-btn");
  var envelopeBtn = document.getElementById("envelope-btn");
  var sealText = document.getElementById("seal-text");

  // Show opening text, then button
  setTimeout(function () {
    if (openingBtn) openingBtn.style.opacity = "0.7";
  }, 2800);

  // Opening → Envelope
  if (openingBtn) {
    openingBtn.addEventListener("click", function () {
      if (openingScene) openingScene.classList.add("hidden");
      if (envelopeScene) envelopeScene.classList.remove("hidden");
    });
  }

  // Envelope → Title
  if (envelopeBtn) {
    envelopeBtn.addEventListener("click", function () {
      envelopeBtn.classList.add("envelope-breaking");
      if (sealText) sealText.textContent = "";
      setTimeout(function () {
        if (envelopeScene) envelopeScene.classList.add("hidden");
        if (titleScene) titleScene.classList.remove("hidden");
        // Title → Story after 6s
        setTimeout(function () {
          if (titleScene) titleScene.classList.add("hidden");
          if (storyContent) {
            storyContent.classList.remove("hidden");
            storyContent.style.animation = "fade-in-slow 1.4s ease-out both";
            // Start observing after story is shown
            setupObservers();
          }
        }, 6000);
      }, 1400);
    });
  }

  // ── Scroll reveal for chapters and scene breaks ──
  function setupObservers() {
    if (!("IntersectionObserver" in window)) {
      // Fallback
      document.querySelectorAll(".chapter-scene, .scene-break").forEach(function (el) {
        el.classList.add("visible");
      });
      return;
    }

    // Chapter scenes
    var chapterObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.3 }
    );

    document.querySelectorAll(".chapter-scene").forEach(function (el) {
      chapterObs.observe(el);
    });

    // Scene breaks
    var breakObs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(".scene-break").forEach(function (el) {
      breakObs.observe(el);
    });
  }

  // ── RSVP Form ──
  var rsvpForm = document.getElementById("rsvp-form");
  var rsvpThanks = document.getElementById("rsvp-thanks");
  var attending = null;

  // Choice buttons
  document.querySelectorAll(".rsvp-choice").forEach(function (btn) {
    btn.addEventListener("click", function () {
      attending = btn.getAttribute("data-value");
      document.querySelectorAll(".rsvp-choice").forEach(function (b) {
        b.classList.remove("active");
      });
      btn.classList.add("active");
      // Enable submit
      var submit = document.querySelector(".rsvp-submit");
      if (submit) submit.disabled = false;
    });
  });

  if (rsvpForm) {
    rsvpForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (rsvpForm && rsvpThanks) {
        rsvpForm.classList.add("hidden");
        rsvpThanks.classList.remove("hidden");
        var msg = rsvpThanks.querySelector("p");
        if (msg) {
          msg.textContent = attending === "yes"
            ? "We can hardly wait to share this scene with you."
            : "We'll miss you in the frame — thank you for telling us.";
        }
      }
    });
  }
})();
